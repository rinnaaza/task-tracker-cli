#! /usr/bin/env node

import path from "path";
import { config } from "dotenv";

import { TaskList } from "./task-list";
import { printHelp } from "./print-help";
import { printTasks } from "./print-tasks";
import { JsonSerializer } from "@services/json-serializer";
import { DatabaseService } from "@services/database-service";

config();

// Command-line arguments
const args: string[] = process.argv.slice(2);
const command: string = args[0];
const taskArguments: string[] = Array.from(args.slice(1));

const title: string = "my-tasks";

// Store tasks in json file
const jsonFilePath: string = path.join(__dirname, "../json-data/my-tasks.json");

const tasksManager = new JsonSerializer(jsonFilePath);
// ------------------------

// Store data in MongoDb document (Uncomment this part to use MongoDb):
// const uri: string = process.env.DATABASE_URI ?? "hello";
// const options: object = {};
// const dbName: string = process.env.DATABASE_NAME ?? "";

// const tasksManager = new DatabaseService(uri, options, dbName);
// ----------------------------------

const taskList: TaskList = new TaskList(tasksManager, title);

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
    case "mark-todo":
        taskIndex = parseInt(taskArguments[0]);
        taskList.updateTaskStatus(--taskIndex, "to do");

        break;
    case "list":
        printTasks(taskArguments[0], taskList);

        break;
    default:
        printHelp();
}