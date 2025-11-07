import express, { Router } from "express"
import { getDb } from "../config/db";
import {
    getAllDiscos,
    getDiscosById,
    postDisco,
    deleteDisco, 
    postMultipleDisco
} from "../controllers/discos"


const router = Router();

router.get("/", getAllDiscos);
router.get("/:id", getDiscosById);
router.post("/", postDisco);
router.post("/multiple", postMultipleDisco)
router.delete("/:id", deleteDisco);


export default router;
