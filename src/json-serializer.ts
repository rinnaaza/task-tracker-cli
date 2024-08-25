import fs from "fs";

import { AllTasks } from "./interfaces";

class JsonSerializer {
    static objectToJson(path: string, tasks: AllTasks) : void {
        try {
            fs.writeFileSync(path, JSON.stringify(tasks, null, 2));
        } catch (error) {
            console.log("Error creating a json:", error);
        }
    };

    static jsonToObject(name: string, path: string) : AllTasks {
        let parsedData: AllTasks = {
            name,
            tasks: []
        };

        try {
            const data = fs.readFileSync(path, { encoding: "utf8" });
            parsedData = JSON.parse(data);
        } catch (error) {
            if (error instanceof Error) {
                const errnoError = error as NodeJS.ErrnoException;
                if (errnoError.code === "ENOENT") {
                    this.objectToJson(path, parsedData);
                } else {
                    console.error(errnoError);
                }
            } else {
                console.error(error);
            }
        }

        return parsedData;
    };
}

export { JsonSerializer };