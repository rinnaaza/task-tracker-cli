import { MongoClient, Db, Collection } from "mongodb";

import { IAllTasks, IStorageService } from "../interfaces";

class MongoDbStorage implements IStorageService {
    private client: MongoClient;
    private db: Db | null = null;
    private dbName: string;
    
    constructor(uri: string, options: object = {}, dbName: string) {
        this.client = new MongoClient(uri, options);
        this.dbName = dbName;
    }

    async connect(): Promise<void> {
        try {
            await this.client.connect();
            this.db = this.client.db(this.dbName);
            console.log("Connected to MongoDB");
        } catch (error) {
            console.error("Failed to connect to MongoDB:", error);
            throw error;
        }
    };

    async disconnect(): Promise<void> {
        try {
            await this.client.close();
            console.log("Disconnected from MongoDB");
        } catch (error) {
            console.error("Failed to disconnect from MongoDB:", error);
            throw error;
        }
    }

    private getCollection(collectionName: string): Collection<IAllTasks> {
        if (!this.db) {
            throw new Error("Not connected to the database");
        }

        return this.db.collection(collectionName);
    }

    async getTasks(title: string): Promise<IAllTasks> {
        try {
            await this.connect();

            const collection = this.getCollection(title);

            const allTasks = await collection.find({ title }).toArray();

            await this.disconnect();

            if (allTasks.length === 0) {
                return { title, tasks: [] };
            }

            return (allTasks[0]);
        } catch (error) {
            console.error("Failed to read data:", error);
            throw error;
        }
    };

    async setTasks(tasks: IAllTasks): Promise<void> {
        try {
            await this.connect();

            const collection = this.getCollection(tasks.title);

            const filter: object = { title: tasks.title };

            await collection.replaceOne(filter, tasks);

            await this.disconnect();
        } catch (error) {
            console.error("Failed to set data", error);
            throw error;
        }
    };
};

export { MongoDbStorage };