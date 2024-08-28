type taskStatus = "to do" | "in progress" | "done";

interface Task {
    id: string;
    description: string,
    status: taskStatus,
    createdAt: string,
    updatedAt: string,
};

interface AllTasks {
    title: string;
    tasks: Task[],
};

interface TasksManager {
    getTasks(title: string): Promise<AllTasks>;
    setTasks(tasks: AllTasks): Promise<void>;
};

export { Task, AllTasks, taskStatus, TasksManager };