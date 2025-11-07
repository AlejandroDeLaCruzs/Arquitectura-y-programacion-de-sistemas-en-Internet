import { getDb } from "../config/db";
import { Request, Response } from "express";
import {LD, DiscosErroneo, discosValidados} from "../types/LD"


const getColecion = () => getDb().collection("Discos");


const validateCantidadParams = (data: any): string | null => {
    const { filmName, rotationType, region, lengthMinutes, videoFormat } = data;
    if (!filmName || !rotationType || !region || !lengthMinutes || !videoFormat) return "Faltan campos en el body";
    return null;
}

const validateDiscoData = (data: any): string | LD => {
    if (!data) return "No hay body";
    const cantidadParams = validateCantidadParams(data);
    if(cantidadParams) return cantidadParams;

    const { filmName, rotationType, region, lengthMinutes, videoFormat } = data;
    if ((filmName && typeof filmName != "string") ||
        (region && typeof region != "string") ||
        (lengthMinutes && typeof lengthMinutes != "number")) return "EL filname debe ser un string, la region un string y la duracion un number";


    if (lengthMinutes < 0) return "La duracion de la pelicula debe ser positiva";

    if (rotationType && !["CAV", "CLV"].includes(rotationType)) return "El rotationType debe ser CAV o CLV ";
    if (videoFormat && !["PAL", "NTSC"].includes(videoFormat)) return "EL videoFormat debe ser PAL o NSTC";

    return {
        ...data
    }
}




export const getAllDiscos = async (req: Request, res: Response) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 2;

    const sortParam = req.query.sortParam || "filmName";
    const orderBy = req.query.orderBy === "asc" ? 1 : -1;
    const skip = (page - 1) * limit;

    const data = await getColecion().find().sort({ sortParam: orderBy }).skip(skip).toArray();

    const discosValidados: discosValidados = {
        DiscosCorrectos: [],
        DiscosErroneos: [],
    };

    const result = data.reduce((acc, disco) => {
        const discosValidado: LD | string = validateDiscoData(disco);
        if (typeof discosValidado == "string") {
            const discosErroneo: DiscosErroneo = {
                Disco: disco._id,
                Message: discosValidado,
            }
           acc.DiscosErroneos.push(discosErroneo);
           return acc;
        }
        else{
            acc.DiscosCorrectos.push(discosValidado);
            return acc;
        }
    },discosValidados)

    res.status(200).send({
        info: {
            page,
            limit,
            sortParam,
            orderBy,
        },
        result,
    });
}