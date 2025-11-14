import express, {
    type NextFunction,
    type Request,
    type Response,
} from "express";
import cors from "cors";
import denotev from "dotenv"
import { ConnectMongo } from "./config/db";
import routerProductos from "../src/routers/productos";
import routerAuth from "../src/routers/auth";

const app = express();
const PORT = 3000;


denotev.config();

ConnectMongo();

app.use(cors());
app.use(express.json());

app.use("/auth", routerAuth);
app.use("/productos", routerProductos);

app.use((req: Request, res: Response) => {
    res.status(404).json({ error: "Ruta no encontrada" });
});

app.listen(PORT, () => {
    console.log("Servidor en http://localhost:3000");
})
