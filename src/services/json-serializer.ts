import fs from "fs";

import { AllTasks, TasksManager } from "../interfaces";

class JsonSerializer implements TasksManager {
    private path: string;

    constructor(path: string) {
        this.path = path;
    }

    async getTasks(title: string): Promise<AllTasks> {
        try {
            const tasks: string = await fs.promises.readFile(this.path, { encoding: "utf8" });

            const parsedData: AllTasks = JSON.parse(tasks);

            return parsedData;
        } catch (error) {
            if (error instanceof Error) {
                if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
                    try {
                        const defaultData: AllTasks = { title, tasks: [] };

                        await this.setTasks(defaultData);

                        return defaultData;
                    } catch (error) {
                        console.error("Error creating json file:", error);
                        
                        throw error;
                    }
                } else {
                    console.error("Error reading json file: ", error);

                    throw error;
                }
            } else {
                console.error("Error reading json file: ", error);
                
                throw error;
            }
        }
    };

    async setTasks(tasks: AllTasks): Promise<void> {
        try {
            fs.writeFileSync(this.path, JSON.stringify(tasks, null, 2));
        } catch (error) {
            console.log("Error creating a json:", error);
        }
    };
}



export { JsonSerializer };