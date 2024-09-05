import fs from "fs";
import path from "path";

import { JsonStorage } from "../src/services/json-storage";
import { IAllTasks, taskStatus } from "../src/interfaces";

describe("JsonSerializer", () => {
    let jsonStorage: JsonStorage;
    const jsonFilePath: string = path.join(__dirname, "../json-data/my-tasks-test.json");

    beforeAll(() => {
        jsonStorage = new JsonStorage(jsonFilePath);
    });

    afterAll(() => {
        fs.unlinkSync(jsonFilePath);
    });

    describe("setTasks", () => {
        it('should create a JSON file and write data to it', async () => {
            const title: string = "my-tasks-test";
            const tasks: IAllTasks = {
                title,
                tasks: [
                    {
                        id: "1",
                        description: "Finish my first task",
                        status: taskStatus.todo,
                        createdAt: "",
                        updatedAt: "",
                    },
                ],
            };

            await jsonStorage.setTasks(tasks);

            expect(fs.existsSync(jsonFilePath)).toBe(true);
            
            const data: string = JSON.parse(fs.readFileSync(jsonFilePath, "utf8"));
            expect(data).toStrictEqual(tasks);
        });
    });

    describe("getTasks", () => {
        it('should read tasks from a JSON file', async () => {
            const data: IAllTasks = await jsonStorage.getTasks("my-tasks-test");

            const title: string = "my-tasks-test";
            const expectedData: IAllTasks = {
                title,
                tasks: [
                    {
                        id: "1",
                        description: "Finish my first task",
                        status: taskStatus.todo,
                        createdAt: "",
                        updatedAt: "",
                    },
                ],
            };

            expect(data).toStrictEqual(expectedData);
        });
    });
});

