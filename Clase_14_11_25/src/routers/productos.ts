import { Router } from "express";
import { getDb } from '../config/db';
import { Product } from "../types/product"
import { verifyToken } from "../middleware/verifyToken"
import { AuthRequest } from '../types/AuthRequest';

const router = Router();

const getColeccion = () => getDb().collection<Product>("Productos");

router.get("/", async (req, res) => {
    try {
        const filtro = req.query
        const data = await getColeccion().find(filtro).toArray();
        res.status(200).send(data);
    } catch (error) {
        console.log(error);
    }
});

router.post('/addProduct', verifyToken, async (req: AuthRequest, res) => {
    
    const nuevoProducto: Product = {
        ...req.body,
        idCreatorUser: req.user?.id,
    };
    await getColeccion().insertOne(nuevoProducto);

    res.status(201).send("OK");
});



export default router;