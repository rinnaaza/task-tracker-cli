import path from "path";

import { generateId, notInRange } from "./helpers";
import { TasksManager } from "./tasks-manager";
import { Task, AllTasks, taskStatus } from "./interfaces";
import { OutOfRangeError, NotValidStatusError, EmptyTaskInputError, EmptyTaskListError } from "./errors";

class TaskList {
    private title: string;
    private path: string;
    private tasksManager: TasksManager;

    constructor(tasksManager: TasksManager, title: string, folderPath: string) {
        this.tasksManager = tasksManager;
        this.title = title.toLowerCase();

        const jsonFilePath = path.join(__dirname, `./${folderPath}/${this.title}-tasks.json`);
        this.path = jsonFilePath;
    }

    addTask(task: string): void {
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

        let allTasks: AllTasks = this.tasksManager.getTasks(this.title, this.path);

        allTasks = {
            ...allTasks,
            tasks: [
                ...(allTasks?.tasks ?? []),
                newTask,
            ]
        };

        this.tasksManager.setTasks(this.path, allTasks);
    };

    updateTask(taskIndex: number, task: string): void {
        const tasks = this.getAllTasks();

        if (!tasks.length) {
            throw new EmptyTaskListError();
        };

        if (notInRange(taskIndex, 0, tasks.length - 1)) {
            throw new OutOfRangeError();
        };

        if (!task) {
            throw new EmptyTaskInputError();
        };

        let allTasks: AllTasks = this.tasksManager.getTasks(this.title, this.path);

        allTasks.tasks[taskIndex] = {
            ...allTasks.tasks[taskIndex],
            description: task,
            updatedAt: `${new Date().toLocaleTimeString()} ${new Date().toLocaleDateString()}`,
        };

        this.tasksManager.setTasks(this.path, allTasks);
    };

    public deleteTask(taskIndex: number): void {
        const tasks = this.getAllTasks();

        if (!tasks.length) {
            throw new EmptyTaskListError();
        };

        if (notInRange(taskIndex, 0, tasks.length - 1)) {
            throw new OutOfRangeError();
        };

        let allTasks: AllTasks = this.tasksManager.getTasks(this.title, this.path);

        const filteredTasks = {
            ...allTasks,
            tasks: allTasks.tasks.filter((_, index) => index !== taskIndex),
        };

        this.tasksManager.setTasks(this.path, filteredTasks);
    };

    public updateTaskStatus(taskIndex: number, status: taskStatus): void {
        const tasks = this.getAllTasks();

        if (!tasks.length) {
            throw new EmptyTaskListError();
        };

        if (notInRange(taskIndex, 0, tasks.length - 1)) {
            throw new OutOfRangeError();
        };

        if (!status) {
            throw new NotValidStatusError();
        };

        let allTasks: AllTasks = this.tasksManager.getTasks(this.title, this.path);
        
        allTasks.tasks[taskIndex] = {
            ...allTasks.tasks[taskIndex],
            status,
            updatedAt: `${new Date().toLocaleTimeString()} ${new Date().toLocaleDateString()}`,
        };

        this.tasksManager.setTasks(this.path, allTasks);
    }

    public getAllTasks(): Task[] {
        const allTasks: AllTasks = this.tasksManager.getTasks(this.title, this.path);

        return allTasks.tasks;
    };

    public getAllDoneTasks = (): Task[] => (
        this.getAllTasks().filter(task => task.status === "done")
    );

    public getAllTodoTasks = (): Task[] => (
        this.getAllTasks().filter(task => task.status === "to do")
    );

    public getAllInProgressTasks = (): Task[] => (
        this.getAllTasks().filter(task => task.status === "in progress")
    );
};

export { TaskList };