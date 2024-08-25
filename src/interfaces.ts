interface Task {
    id: string;
    description: string,
    status: string,
    createdAt: string,
    updatedAt: string,
};

interface AllTasks {
    name: string;
    tasks: Task[],
};

export { Task, AllTasks };