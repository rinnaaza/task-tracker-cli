import fs from "fs";

import { AllTasks } from "./interfaces";

interface TasksManager {
    getTasks(title: string, path: string): AllTasks;
    setTasks(path: string, tasks: AllTasks): void;
};

class JsonSerializer implements TasksManager {
    getTasks = (title: string, path: string): AllTasks => {
        let parsedData: AllTasks = {
            title,
            tasks: []
        };

        try {
            const data = fs.readFileSync(path, { encoding: "utf8" });
            parsedData = JSON.parse(data);
        } catch (error) {
            if (error instanceof Error) {
                const errnoError = error as NodeJS.ErrnoException;
                if (errnoError.code === "ENOENT") {
                    this.setTasks(path, parsedData);
                } else {
                    console.error(errnoError);
                }
            } else {
                console.error(error);
            }
        }

        return parsedData;
    }

    setTasks = (path: string, tasks: AllTasks): void => {
        try {
            fs.writeFileSync(path, JSON.stringify(tasks, null, 2));
        } catch (error) {
            console.log("Error creating a json:", error);
        }
    }
}

class TasksDAO implements TasksManager {
    getTasks(title: string, path: string): AllTasks {
        return ({
            title,
            tasks: [
                {
                    id: "1234",
                    description: "hello",
                    status: "to do",
                    createdAt: `${new Date()}`,
                    updatedAt: "",
                }
            ],
        });
    };

    setTasks(path: string, tasks: AllTasks): void {};
};

export { TasksManager, TasksDAO, JsonSerializer };