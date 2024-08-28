import { Task } from "./interfaces";
import { TaskList } from "./task-list";

const printTasks = async(taskStatus: string, taskList: TaskList): Promise<void> => {
    let tasks: Task[] = [];

    switch (taskStatus) {
        case "done":
            tasks = await taskList.getAllDoneTasks();

            break;
        case "in-progress":
            tasks = await taskList.getAllInProgressTasks();

            break;
        case "todo":
            tasks = await taskList.getAllTodoTasks();

            break;
        default:
            tasks = await taskList.getAllTasks();
            break;
    }

    if (!tasks.length) return;

    tasks.forEach((task) => console.log(task));
};

export { printTasks };