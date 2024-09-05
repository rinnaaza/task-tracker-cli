import { printTasks } from "../src/print-tasks";
import { TaskManager } from "../src/task-manager";
import { ITask, taskStatus } from "../src/interfaces";

describe("printTasks", () => {
    let mockTaskManager: jest.Mocked<TaskManager>;

    beforeEach(() => {
        // Mock the TaskList methods
        mockTaskManager = {
            getAllTasks: jest.fn(),
            getAllDoneTasks: jest.fn(),
            getAllInProgressTasks: jest.fn(),
            getAllTodoTasks: jest.fn(),
        } as unknown as jest.Mocked<TaskManager>;

        // Spy on console.log
        jest.spyOn(console, 'log').mockImplementation(() => {});
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it("should print done tasks", async () => {
        const tasks: ITask[] = [
            { id: '1', description: 'Task 1', status: taskStatus.done, createdAt: 'time', updatedAt: 'time' },
        ];

        mockTaskManager.getAllDoneTasks.mockReturnValue(Promise.resolve(tasks));

        await printTasks('done', mockTaskManager);

        expect(mockTaskManager.getAllDoneTasks).toHaveBeenCalled();
        expect(console.log).toHaveBeenCalledWith(tasks[0]);
    });

    it('should print in-progress tasks', async () => {
        const tasks: ITask[] = [
            { id: '2', description: 'Task 2', status: taskStatus.inProgress, createdAt: 'time', updatedAt: 'time' },
        ];

        mockTaskManager.getAllInProgressTasks.mockReturnValue(Promise.resolve(tasks));

        await printTasks('in-progress', mockTaskManager);

        expect(mockTaskManager.getAllInProgressTasks).toHaveBeenCalled();
        expect(console.log).toHaveBeenCalledWith(tasks[0]);
    });

    it('should print todo tasks', async () => {
        const tasks: ITask[] = [
            { id: '3', description: 'Task 3', status: taskStatus.todo, createdAt: 'time', updatedAt: 'time' },
        ];

        mockTaskManager.getAllTodoTasks.mockReturnValue(Promise.resolve(tasks));

        await printTasks('todo', mockTaskManager);

        expect(mockTaskManager.getAllTodoTasks).toHaveBeenCalled();
        expect(console.log).toHaveBeenCalledWith(tasks[0]);
    });

    it('should print all tasks when no specific status is provided', async () => {
        const tasks: ITask[] = [
            { id: '4', description: 'Task 4', status: taskStatus.todo, createdAt: 'time', updatedAt: 'time' },
        ];

        mockTaskManager.getAllTasks.mockReturnValue(Promise.resolve(tasks));

        await printTasks('all', mockTaskManager);

        expect(mockTaskManager.getAllTasks).toHaveBeenCalled();
        expect(console.log).toHaveBeenCalledWith(tasks[0]);
    });

    it('should not print anything if the task list is empty', async () => {
        mockTaskManager.getAllTasks.mockReturnValue(Promise.resolve([]));

        await printTasks('all', mockTaskManager);

        expect(console.log).not.toHaveBeenCalled();
    });
});