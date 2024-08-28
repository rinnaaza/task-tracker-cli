import path from "path";

import { generateId, notInRange } from "./helpers";
import { Task, AllTasks, taskStatus, TasksManager } from "./interfaces";
import { OutOfRangeError, NotValidStatusError, EmptyTaskInputError, EmptyTaskListError } from "./errors";

class TaskList {
    private title: string;
    private tasksManager: TasksManager;

    constructor(tasksManager: TasksManager, title: string) {
        this.tasksManager = tasksManager;
        this.title = title.toLowerCase();
    }

    async addTask(task: string): Promise<void> {
        if (!task) {
            throw new EmptyTaskInputError();
        };

        const newTask: Task = {
            id: generateId(),
            description: task,
            status: "to do",
            createdAt: `${new Date().toLocaleTimeString()} ${new Date().toLocaleDateString()}`,
            updatedAt: "",            
        }

        try {
            let allTasks: AllTasks = await this.tasksManager.getTasks(this.title);

            allTasks = {
                ...allTasks,
                tasks: [
                    ...(allTasks?.tasks ?? []),
                    newTask,
                ]
            };
    
            await this.tasksManager.setTasks(allTasks);
        } catch (error) {
            console.error("Error at adding new task: ", error);

            throw error;
        }
    };

    async updateTask(taskIndex: number, task: string): Promise<void> {
        const tasks: Task[] = await this.getAllTasks();

        if (!tasks.length) {
            throw new EmptyTaskListError();
        };

        if (notInRange(taskIndex, 0, tasks.length - 1)) {
            throw new OutOfRangeError();
        };

        if (!task) {
            throw new EmptyTaskInputError();
        };

        try {
            let allTasks: AllTasks = await this.tasksManager.getTasks(this.title);

            allTasks.tasks[taskIndex] = {
                ...allTasks.tasks[taskIndex],
                description: task,
                updatedAt: `${new Date().toLocaleTimeString()} ${new Date().toLocaleDateString()}`,
            };

            await this.tasksManager.setTasks(allTasks);    
        } catch (error) {
            console.error("Error at updating a task: ", error);

            throw error;
        }
    };

    async deleteTask(taskIndex: number): Promise<void> {
        const tasks: Task[] = await this.getAllTasks();

        if (!tasks.length) {
            throw new EmptyTaskListError();
        };

        if (notInRange(taskIndex, 0, tasks.length - 1)) {
            throw new OutOfRangeError();
        };

        try {
            let allTasks: AllTasks = await this.tasksManager.getTasks(this.title);

            const filteredTasks = {
                ...allTasks,
                tasks: allTasks.tasks.filter((_, index) => index !== taskIndex),
            };
    
            await this.tasksManager.setTasks(filteredTasks);    
        } catch (error) {
            console.error("Error at deleting a task: ", error);

            throw error;
        }
    };

    async updateTaskStatus(taskIndex: number, status: taskStatus): Promise<void> {
        const tasks: Task[] = await this.getAllTasks();

        if (!tasks.length) {
            throw new EmptyTaskListError();
        };

        if (notInRange(taskIndex, 0, tasks.length - 1)) {
            throw new OutOfRangeError();
        };

        if (!status) {
            throw new NotValidStatusError();
        };

        try {
            let allTasks: AllTasks = await this.tasksManager.getTasks(this.title);
        
            allTasks.tasks[taskIndex] = {
                ...allTasks.tasks[taskIndex],
                status,
                updatedAt: `${new Date().toLocaleTimeString()} ${new Date().toLocaleDateString()}`,
            };
    
            await this.tasksManager.setTasks(allTasks);
        } catch (error) {
            console.error("Error at updating a task status: ", error);

            throw error;
        }
    }

    async getAllTasks(): Promise<Task[]> {
        try {
            const allTasks: AllTasks = await this.tasksManager.getTasks(this.title);

            return allTasks.tasks;
        } catch (error) {
            console.error("Error at getting tasks: ", error);

            throw error;
        }
    };

    async getAllDoneTasks(): Promise<Task[]> {      
        try {
            const tasks: Task[] = await this.getAllTasks();

            return tasks.filter(task => task.status === "done");
        } catch (error) {
            console.error("Error at getting tasks: ", error);

            throw error;
        }
    };

    async getAllTodoTasks(): Promise<Task[]> {
        try {
            const tasks: Task[] = await this.getAllTasks();

            return tasks.filter(task => task.status === "to do");
        } catch (error) {
            console.error("Error at getting tasks: ", error);

            throw error;
        }
    };

    async getAllInProgressTasks(): Promise<Task[]> {
        try {
            const tasks: Task[] = await this.getAllTasks();

            return tasks.filter(task => task.status === "in progress");
        } catch (error) {
            console.error("Error at getting tasks: ", error);

            throw error;
        }
    };
};

export { TaskList };