import { TaskManager } from "../src/task-manager";
import { IStorageService, IAllTasks, taskStatus } from "../src/interfaces";
import { EmptyTaskInputError, EmptyTaskListError, OutOfRangeError, invalidInputError } from "../src/errors";

jest.mock("../src/helpers", () => ({
    generateId: jest.fn(() => "1234"),
    inRange: jest.fn((index: number, min: number, max: number) => (index >= min) && (index <= max)),
}));

describe("TaskManager", () => {
    let taskManager: TaskManager;
    let mockIStorageService: jest.Mocked<IStorageService>;
    const title: string = "my-tasks";

    beforeEach(() => {
        mockIStorageService = {
            getTasks: jest.fn(),
            setTasks: jest.fn(),
        } as jest.Mocked<IStorageService>;

        jest.spyOn(console, 'error').mockImplementation(() => {});

        const mockDate: Date = new Date("2024-09-04T12:00:00");
        jest.spyOn(global, 'Date').mockImplementation(() => mockDate as Date);

        taskManager = new TaskManager(mockIStorageService, title);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    })

    it("should create a json folder and add task if task is valid", async () => {
        const mockTasks: IAllTasks = { title, tasks: [] };
        mockIStorageService.getTasks.mockResolvedValueOnce(mockTasks);
        mockIStorageService.setTasks.mockResolvedValueOnce(undefined);

        await taskManager.addTask("Buy groceries");

        expect(mockIStorageService.getTasks).toHaveBeenCalledWith(title);
        expect(mockIStorageService.setTasks).toHaveBeenCalled();

        const savedTasks = mockIStorageService.setTasks.mock.calls[0][0] as IAllTasks;
        expect(savedTasks.tasks.length).toBe(1);
        expect(savedTasks.tasks[0].description).toBe("Buy groceries");
        expect(savedTasks.tasks[0].status).toBe(taskStatus.todo);
        expect(savedTasks.tasks[0].id).toBe("1234");
    });

    it("should throw an error if task is empty", async () => {
        await expect(taskManager.addTask("")).rejects.toThrow(EmptyTaskInputError);
    });

    it("should handle errors from storage service", async () => {
        const errorMessage = "Storage service error";
        mockIStorageService.getTasks.mockRejectedValueOnce(new Error(errorMessage));

        await expect(taskManager.addTask("New Task")).rejects.toThrow(errorMessage);
    });

    it("should update the task status successfully", async () => {
        const mockTasks: IAllTasks = {
            title,
            tasks: [
                { id: "1234", description: "Buy groceries", status: taskStatus.todo, createdAt: "12:00:00 04/09/2024", updatedAt: "" },
                { id: "1234", description: "Prepare dinner", status: taskStatus.todo, createdAt: "12:00:00 04/09/2024", updatedAt: "" },
            ]
        };

        mockIStorageService.getTasks.mockResolvedValue(mockTasks);

        await taskManager.updateTask(1, taskStatus.inProgress, null);

        expect(mockIStorageService.setTasks).toHaveBeenCalledWith(
            {
                title,
                tasks: [
                    mockTasks.tasks[0],
                    {
                        ...mockTasks.tasks[1],
                        status: taskStatus.inProgress,
                        updatedAt: "12:00:00 04/09/2024",
                    }
                ]
            }
        );
    });

    it("should update the task successfully", async () => {
        const mockTasks: IAllTasks = {
            title,
            tasks: [
                { id: "1234", description: "Buy groceries", status: taskStatus.todo, createdAt: "12:00:00 04/09/2024", updatedAt: "" },
                { id: "1234", description: "Prepare dinner", status: taskStatus.todo, createdAt: "12:00:00 04/09/2024", updatedAt: "" },
            ]
        };

        mockIStorageService.getTasks.mockResolvedValue(mockTasks);

        await taskManager.updateTask(1, null, "Prepare dinner and eat");

        expect(mockIStorageService.setTasks).toHaveBeenCalledWith({
            title,
            tasks: [
                mockTasks.tasks[0],
                {
                    ...mockTasks.tasks[1],
                    description: "Prepare dinner and eat",
                    updatedAt: "12:00:00 04/09/2024",
                }
            ]
        });
    });

    it("should throw EmptyTaskListError when task list is empty", async () => {
        mockIStorageService.getTasks.mockResolvedValue({ title, tasks: [] });

        await expect(taskManager.updateTask(0, taskStatus.inProgress, null))
            .rejects
            .toThrow(EmptyTaskListError);
    });

    it("should throw OutOfRangeError for invalid task index", async () => {
        const mockTasks: IAllTasks = {
            title,
            tasks: [
                { id: "1234", description: "Buy groceries", status: taskStatus.todo, createdAt: "12:00:00 04/09/2024", updatedAt: "" },
            ]
        };

        mockIStorageService.getTasks.mockResolvedValue(mockTasks);

        await expect(taskManager.updateTask(2, taskStatus.inProgress, null))
            .rejects
            .toThrow(OutOfRangeError);
    });

    it("should throw invalidInput when both status and task are null", async () => {
        const mockTasks: IAllTasks = {
            title,
            tasks: [
                { id: "1234", description: "Buy groceries", status: taskStatus.todo, createdAt: "12:00:00 04/09/2024", updatedAt: "" },
            ]
        };

        mockIStorageService.getTasks.mockResolvedValue(mockTasks);

        await expect(taskManager.updateTask(0, null, null))
            .rejects
            .toThrow(invalidInputError);
    });

    it("should handle and rethrow errors during update", async () => {
        const mockTasks: IAllTasks = {
            title,
            tasks: [
                { id: "1234", description: "Buy groceries", status: taskStatus.todo, createdAt: "12:00:00 04/09/2024", updatedAt: "" },
            ]
        };

        mockIStorageService.getTasks.mockResolvedValue(mockTasks);
        mockIStorageService.setTasks.mockRejectedValue(new Error("Storage error"));

        await expect(taskManager.updateTask(0, null, "Updated Task"))
            .rejects
            .toThrow("Storage error");

        expect(console.error).toHaveBeenCalledWith(expect.stringContaining("Error at updating task"), expect.any(Error));
    });

    it("should delete the task successfully", async () => {
        const mockTasks: IAllTasks = {
            title,
            tasks: [
                { id: "1234", description: "Buy groceries", status: taskStatus.todo, createdAt: "12:00:00 04/09/2024", updatedAt: "" },
                { id: "1234", description: "Prepare dinner", status: taskStatus.inProgress, createdAt: "12:00:00 04/09/2024", updatedAt: "" },
            ]
        };

        mockIStorageService.getTasks.mockResolvedValue(mockTasks);

        await taskManager.deleteTask(1);

        expect(mockIStorageService.setTasks).toHaveBeenCalledWith({
            title,
            tasks: [mockTasks.tasks[0]]
        });
    });

    it("should throw EmptyTaskListError when task list is empty", async () => {
        mockIStorageService.getTasks.mockResolvedValue({ title, tasks: [] });

        await expect(taskManager.deleteTask(0))
            .rejects
            .toThrow(EmptyTaskListError);
    });

    it("should throw OutOfRangeError for invalid task index", async () => {
        const mockTasks: IAllTasks = {
            title,
            tasks: [
                { id: "1234", description: "Buy groceries", status: taskStatus.todo, createdAt: "12:00:00 04/09/2024", updatedAt: "" },
            ]
        };

        mockIStorageService.getTasks.mockResolvedValue(mockTasks);

        await expect(taskManager.deleteTask(2))
            .rejects
            .toThrow(OutOfRangeError);
    });

    it("should handle and rethrow errors during deletion", async () => {
        const mockTasks: IAllTasks = {
            title,
            tasks: [
                { id: "1234", description: "Buy groceries", status: taskStatus.todo, createdAt: "12:00:00 04/09/2024", updatedAt: "" },
            ]
        };

        mockIStorageService.getTasks.mockResolvedValue(mockTasks);
        mockIStorageService.setTasks.mockRejectedValue(new Error("Storage error"));

        await expect(taskManager.deleteTask(0))
            .rejects
            .toThrow("Storage error");

        expect(console.error).toHaveBeenCalledWith(expect.stringContaining("Error at deleting a task"), expect.any(Error));
    });

    it("should return all tasks successfully", async () => {
        const mockTasks: IAllTasks = {
            title,
            tasks: [
                { id: "1", description: "Buy groceries", status: taskStatus.todo, createdAt: "12:00:00 04/09/2024", updatedAt: "" },
                { id: "2", description: "Prepare dinner", status: taskStatus.inProgress, createdAt: "12:00:00 04/09/2024", updatedAt: "" },
            ]
        };

        mockIStorageService.getTasks.mockResolvedValue(mockTasks);

        const tasks = await taskManager.getAllTasks();

        expect(tasks).toEqual(mockTasks.tasks);
        expect(mockIStorageService.getTasks).toHaveBeenCalledWith(title);
    });

    it("should handle and rethrow errors during task retrieval", async () => {
        mockIStorageService.getTasks.mockRejectedValue(new Error("Storage error"));

        await expect(taskManager.getAllTasks())
            .rejects
            .toThrow("Storage error");

        expect(console.error).toHaveBeenCalledWith(expect.stringContaining("Error at getting tasks"), expect.any(Error));
    });
});

