import path from "path";

import { generateId, notInRange } from "./helpers";
import { JsonSerializer } from "./json-serializer";
import { Task, AllTasks } from "./interfaces";

class TaskList {
    private name: string;
    private path: string;

    constructor(name: string) {
        this.name = name.toLowerCase();

        const jsonFilePath = path.join(__dirname, `../json-data/${this.name}-tasks.json`);
        this.path = jsonFilePath;
    }

    public addTask(task: string): void {
        if (!task) return;

        const newTask: Task = {
            id: generateId(),
            description: task,
            status: "to do",
            createdAt: `${new Date().toLocaleTimeString()} ${new Date().toLocaleDateString()}`,
            updatedAt: "",            
        }

        let allTasks: AllTasks = JsonSerializer.jsonToObject(this.name, this.path);

        allTasks = {
            ...allTasks,
            tasks: [
                ...(allTasks?.tasks ?? []),
                newTask,
            ]
        };

        JsonSerializer.objectToJson(this.path, allTasks);
    };

    public updateTask(taskIndex: number, task: string): void {
        if (notInRange(taskIndex, 0, this.getAllTasks().length - 1) || !task) return;

        let allTasks: AllTasks = JsonSerializer.jsonToObject(this.name, this.path);

        if (!allTasks.tasks.length) return;
        
        allTasks.tasks[taskIndex] = {
            ...allTasks.tasks[taskIndex],
            description: task,
            updatedAt: `${new Date().toLocaleTimeString()} ${new Date().toLocaleDateString()}`,
        };

        JsonSerializer.objectToJson(this.path, allTasks);
    };

    public deleteTask(taskIndex: number): void {
        if (notInRange(taskIndex, 0, this.getAllTasks().length - 1)) return;

        let allTasks: AllTasks = JsonSerializer.jsonToObject(this.name, this.path);

        if (!allTasks.tasks.length) return;

        const filteredTasks = {
            ...allTasks,
            tasks: allTasks.tasks.filter((_, index) => index !== taskIndex),
        };

        JsonSerializer.objectToJson(this.path, filteredTasks);
    };

    public updateTaskStatus(taskIndex: number, status: string): void {
        if (notInRange(taskIndex, 0, this.getAllTasks().length - 1) || !status) return;


        let allTasks: AllTasks = JsonSerializer.jsonToObject(this.name, this.path);
        
        if (!allTasks.tasks.length) return;

        allTasks.tasks[taskIndex] = {
            ...allTasks.tasks[taskIndex],
            status,
            updatedAt: `${new Date().toLocaleTimeString()} ${new Date().toLocaleDateString()}`,
        };

        JsonSerializer.objectToJson(this.path, allTasks);
    }

    public getAllTasks(): Task[] {
        const allTasks: AllTasks = JsonSerializer.jsonToObject(this.name, this.path);

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