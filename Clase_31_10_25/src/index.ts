import express from "express";
import { connectMongoDB } from "./mongo";
import routerPersonas from "./router";
import denotev from "dotenv"


denotev.config();

connectMongoDB()

const app = express();
app.use(express.json());


app.use("/users", routerPersonas);


app.listen(3000, () => console.log("Servidor en http://localhost:3000"));
