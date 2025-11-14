import { Db, MongoClient } from "mongodb";

let mongoClient: MongoClient;
let db: Db;
const dbName = "Compras";

export const ConnectMongo = async (): Promise<void> => {
    try {
        const url = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.5scmzzh.mongodb.net/?appName=Cluster0`;
        mongoClient = new MongoClient(url);
        await mongoClient.connect();
        db = mongoClient.db(dbName);
        console.log("Se ha conectado a la BBDD" + dbName);
    } catch (error) {
        console.log("No se ha podido conectar a la BBDD")
    }
}

export const getDb = (): Db => db; 

