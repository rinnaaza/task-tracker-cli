enum taskStatus { todo = "to do", inProgress = "in progress", done = "done" };

interface ITask {
    id: string;
    description: string,
    status: taskStatus,
    createdAt: string,
    updatedAt: string,
};

interface IAllTasks {
    title: string;
    tasks: ITask[],
};

interface IStorageService {
    getTasks(title: string): Promise<IAllTasks>;
    setTasks(tasks: IAllTasks): Promise<void>;
};

export { ITask, IAllTasks, taskStatus, IStorageService };