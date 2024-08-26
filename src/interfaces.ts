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

export { Task, AllTasks, taskStatus };