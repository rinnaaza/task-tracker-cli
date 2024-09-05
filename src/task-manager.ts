import path from "path";

import { generateId, inRange } from "./helpers";
import { ITask, IAllTasks, taskStatus, IStorageService } from "./interfaces";
import { OutOfRangeError, invalidInputError, EmptyTaskInputError, EmptyTaskListError } from "./errors";

class TaskManager {
    private title: string;
    private storageService: IStorageService;

    constructor(storageService: IStorageService, title: string) {
        this.storageService = storageService;
        this.title = title
    }

    async addTask(task: string): Promise<void> {
        if (!task) {
            throw new EmptyTaskInputError();
        };

        const newTask: ITask = {
            id: generateId(),
            description: task,
            status: taskStatus.todo,
            createdAt: `${new Date().toLocaleTimeString()} ${new Date().toLocaleDateString()}`,
            updatedAt: "",            
        }

        try {
            let allTasks: IAllTasks = await this.storageService.getTasks(this.title);

            allTasks = {
                ...allTasks,
                tasks: [
                    ...(allTasks?.tasks ?? []),
                    newTask,
                ]
            };
    
            await this.storageService.setTasks(allTasks);

            console.log(`Task added successfully (Id: ${allTasks.tasks.length})`);
        } catch (error) {
            console.error("Error at adding new task: ", error);

            throw error;
        }
    };

    async updateTask(taskIndex: number, status: taskStatus | null, task: string | null): Promise<void> {
        const tasks: ITask[] = await this.getAllTasks();

        if (!tasks.length) {
            throw new EmptyTaskListError();
        };

        if (!inRange(taskIndex, 0, tasks.length - 1)) {
            throw new OutOfRangeError();
        };

        if (!status && !task) {
            throw new invalidInputError();
        };
        
        try {
            let allTasks: IAllTasks = await this.storageService.getTasks(this.title);

            allTasks.tasks[taskIndex] = {
                ...allTasks.tasks[taskIndex],
                ...(task) && { description: task, },
                ...(status) && { status },
                updatedAt: `${new Date().toLocaleTimeString()} ${new Date().toLocaleDateString()}`,
            };

            await this.storageService.setTasks(allTasks);    
        } catch (error) {
            console.error(`Error at updating task ${status ? "status" : ""}: `, error);

            throw error;
        }
    };

    async deleteTask(taskIndex: number): Promise<void> {
        const tasks: ITask[] = await this.getAllTasks();

        if (!tasks.length) {
            throw new EmptyTaskListError();
        };

        if (!inRange(taskIndex, 0, tasks.length - 1)) {
            throw new OutOfRangeError();
        };

        try {
            let allTasks: IAllTasks = await this.storageService.getTasks(this.title);

            const filteredTasks = {
                ...allTasks,
                tasks: allTasks.tasks.filter((_, index) => index !== taskIndex),
            };
    
            await this.storageService.setTasks(filteredTasks);    
        } catch (error) {
            console.error("Error at deleting a task: ", error);

            throw error;
        }
    };

    async getAllTasks(): Promise<ITask[]> {
        try {
            const allTasks: IAllTasks = await this.storageService.getTasks(this.title);

            return allTasks.tasks;
        } catch (error) {
            console.error("Error at getting tasks: ", error);

            throw error;
        }
    };

    async getAllDoneTasks(): Promise<ITask[]> {      
        try {
            const tasks: ITask[] = await this.getAllTasks();

            return tasks.filter(task => task.status === "done");
        } catch (error) {
            console.error("Error at getting tasks: ", error);

            throw error;
        }
    };

    async getAllTodoTasks(): Promise<ITask[]> {
        try {
            const tasks: ITask[] = await this.getAllTasks();

            return tasks.filter(task => task.status === "to do");
        } catch (error) {
            console.error("Error at getting tasks: ", error);

            throw error;
        }
    };

    async getAllInProgressTasks(): Promise<ITask[]> {
        try {
            const tasks: ITask[] = await this.getAllTasks();

            return tasks.filter(task => task.status === "in progress");
        } catch (error) {
            console.error("Error at getting tasks: ", error);

            throw error;
        }
    };
};

export { TaskManager };