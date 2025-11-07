import { Request, Response } from "express";
import { getAllDiscosService } from "../services/discos.service";



export const getAllDiscos = async (req: Request, res: Response) => {
    try {
        const result = await getAllDiscosService(req.query);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }

}