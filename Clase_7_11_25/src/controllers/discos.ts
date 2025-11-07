import { Request, Response } from "express";
import { getAllDiscosService, getDiscosByIdService } from "../services/discos.service";



export const getAllDiscos = async (req: Request, res: Response) => {
    try {
        const result = await getAllDiscosService(req.query);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
}

export const getDiscosById = async (req: Request, res: Response) => {
    try {
        const result = await getDiscosByIdService(req);
        result ? res.status(200).json(result) : res.status(404).send({message: "No se ha encontrado disoc con ese ID"});
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
}