#! /usr/bin/env node

import path from "path";
import { config } from "dotenv";

import { STORAGE, JSON_PATH, TASK_TITLE } from "./config";

import { TaskManager } from "./task-manager";
import { printHelp } from "./print-help";
import { printTasks } from "./print-tasks";
import { JsonStorage } from "@services/json-storage";
import { MongoDbStorage } from "@services/mongo-db-storage";
import { taskStatus, IStorageService } from "./interfaces";

config();

// Command-line arguments
const args: string[] = process.argv.slice(2);

const command: string = args[0];

const commandArguments: string[] = Array.from(args.slice(1));

const title: string = TASK_TITLE;

let storageService: IStorageService;

if (STORAGE === "json") {
    const jsonFilePath: string = path.join(__dirname, JSON_PATH);

    storageService = new JsonStorage(jsonFilePath);
} else if (STORAGE === "mongodb") {
    const uri: string = process.env.DATABASE_URI ?? "hello";
    const options: object = {};
    const dbName: string = process.env.DATABASE_NAME ?? "";

    storageService = new MongoDbStorage(uri, options, dbName);
} else {
    throw new Error(`Unsupported storage type: ${STORAGE}`);
}

const taskManager: TaskManager = new TaskManager(storageService, title);

let taskIndex: number;

switch (command) {
    case "add":
        taskManager.addTask(commandArguments[0]);
        
        break;
    case "update":
        taskIndex = parseInt(commandArguments[0]);
        taskManager.updateTask(--taskIndex, null, commandArguments[1]);
        
        break;
    case "delete":
        taskIndex = parseInt(commandArguments[0]);
        taskManager.deleteTask(--taskIndex);

        break;
    case "mark-in-progress":
        taskIndex = parseInt(commandArguments[0]);
        taskManager.updateTask(--taskIndex, taskStatus.inProgress, null);

        break;
    case "mark-done":
        taskIndex = parseInt(commandArguments[0]);
        taskManager.updateTask(--taskIndex, taskStatus.done, null);

        break;
    case "mark-todo":
        taskIndex = parseInt(commandArguments[0]);
        taskManager.updateTask(--taskIndex, taskStatus.todo, null);

        break;
    case "list":
        printTasks(commandArguments[0], taskManager);

        break;
    default:
        printHelp();
}