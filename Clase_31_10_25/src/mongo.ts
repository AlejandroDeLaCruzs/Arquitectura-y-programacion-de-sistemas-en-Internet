import { Db, MongoClient } from "mongodb";
import denotev from "dotenv"



let client: MongoClient;
let db: Db;
//const dbName: string = "sample_mflix";
const dbName: string = "mybbdd";


export const connectMongoDB = async (): Promise<void> => {
    try {
        const url = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.5scmzzh.mongodb.net/?appName=Cluster0`
        client = new MongoClient(url);
        await client.connect();
        db = client.db(dbName);
        console.log("Connected to mongodb at db " + dbName);
    } catch (error) {
        console.log("Error mongo: ", error);
    }
}

export const getDb = (): Db => db; 