import { Request, Response } from "express";
import { getAllDiscosService, getDiscosByIdService, postDiscoService, deleteDiscoService, postMultipleDiscoService } from "../services/discos.service";



export const getAllDiscos = async (req: Request, res: Response) => {
    try {
        const result = await getAllDiscosService(req.query);
        res.status(200).json(result);
    } catch (error) {
        res.status(404).json(error);
    }
}

export const getDiscosById = async (req: Request, res: Response) => {
    try {
        const result = await getDiscosByIdService(req);
        !result ?  res.status(404).send({ message: "No se ha encontrado discos con ese ID" }):res.status(200).json(result) ; 
    } catch (error) {
        res.status(404).json(error);
    }
}

export const postDisco = async (req: Request, res: Response) => {
    try {
        const result = await postDiscoService(req);
        if (result?.error) return res.status(400).json({ message: result.error });
        res.status(201).send(result);
    } catch (error) {
        res.status(404).json(error);
    }
}

export const postMultipleDisco = async (req: Request, res: Response) => {
    try {
        const result = await postMultipleDiscoService(req);
        result ? res.status(202).send(result) : res.status(400).send("error en el body");

    } catch (error) {
        res.status(404).json(error);
    }
}



export const deleteDisco = async (req: Request, res: Response) => {
    try {
        const result = await deleteDiscoService(req);
        result?.deletedCount === 1 ? res.status(200).send(result) : res.status(404).send(result);
    } catch (error) {
        res.status(404).json(error);
    }
}