import { ITask } from "./interfaces";
import { TaskManager } from "./task-manager";

const printTasks = async(taskStatus: string, taskManager: TaskManager): Promise<void> => {
    let tasks: ITask[] = [];

    switch (taskStatus) {
        case "done":
            tasks = await taskManager.getAllDoneTasks();

            break;
        case "in-progress":
            tasks = await taskManager.getAllInProgressTasks();

            break;
        case "todo":
            tasks = await taskManager.getAllTodoTasks();

            break;
        default:
            tasks = await taskManager.getAllTasks();
            break;
    }

    if (!tasks.length) return;

    tasks.forEach((task) => console.log(task));
};

export { printTasks };