import { Task } from "./interfaces";
import { TaskList } from "./task-list";

const printTasks = (taskStatus: string, taskList: TaskList): void => {
    let tasks: Task[] = [];

    switch (taskStatus) {
        case "done":
            tasks = taskList.getAllDoneTasks();

            break;
        case "in-progress":
            tasks = taskList.getAllInProgressTasks();

            break;
        case "todo":
            tasks = taskList.getAllTodoTasks();

            break;
        default:
            tasks = taskList.getAllTasks();
            break;
    }

    if (!tasks.length) return;

    tasks.forEach((task) => console.log(task));
};

export { printTasks };