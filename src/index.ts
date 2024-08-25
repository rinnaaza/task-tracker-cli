#! /usr/bin/env node
import { TaskList } from "./task-list";
import { printHelp } from "./print-help";
import { printTasks } from "./print-tasks";

// Command-line arguments
const args: string[] = process.argv.slice(2);
const command: string = args[0];
const taskArguments: string[] = Array.from(args.slice(1));

const taskList: TaskList = new TaskList("user");

let taskIndex: number;

switch (command) {
    case "add":
        taskList.addTask(taskArguments[0]);
        
        break;
    case "update":
        taskIndex = parseInt(taskArguments[0]);
        taskList.updateTask(--taskIndex, taskArguments[1]);
        
        break;
    case "delete":
        taskIndex = parseInt(taskArguments[0]);
        taskList.deleteTask(--taskIndex);

        break;
    case "mark-in-progress":
        taskIndex = parseInt(taskArguments[0]);
        taskList.updateTaskStatus(--taskIndex, "in progress");

        break;
    case "mark-done":
        taskIndex = parseInt(taskArguments[0]);
        taskList.updateTaskStatus(--taskIndex, "done");

        break;
    case "mark-not-done":
        taskIndex = parseInt(taskArguments[0]);
        taskList.updateTaskStatus(--taskIndex, "to do");

        break;
    case "list":
        printTasks(taskArguments[0], taskList);

        break;
    default:
        printHelp();
}