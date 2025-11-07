import express, { Router } from "express"
import { getDb } from "../config/db";
import {getAllDiscos} from "../controllers/discos"


const router = Router();

const getColecion = () => getDb().collection("Discos");

router.get("/",getAllDiscos);
router.post("/", async(req, res) => {
    await getColecion().insertMany(req.body);
    res.status(202);
})


export default router;
