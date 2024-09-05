import fs from "fs";
import path from "path";

import { IAllTasks, IStorageService } from "../interfaces";

class JsonStorage implements IStorageService {
    private filePath: string;

    constructor(path: string) {
        this.filePath = path;
    }

    async getTasks(title: string): Promise<IAllTasks> {
        try {
            const tasks: string = await fs.promises.readFile(this.filePath, { encoding: "utf8" });

            const parsedData: IAllTasks = JSON.parse(tasks);

            return parsedData;
        } catch (error) {
            if (error instanceof Error) {
                if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
                    try {
                        const defaultData: IAllTasks = { title, tasks: [] };

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

    async setTasks(tasks: IAllTasks): Promise<void> {
        try {
            const dir = path.dirname(this.filePath);

            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }

            fs.writeFileSync(this.filePath, JSON.stringify(tasks, null, 2));
        } catch (error) {
            console.log("Error creating a json:", error);
        }
    };
}



export { JsonStorage };