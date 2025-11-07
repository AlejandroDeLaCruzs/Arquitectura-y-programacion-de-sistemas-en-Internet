import { getDb } from "../config/db";
import { LD, discosValidados, DiscosErroneo } from "../types/LD";
import { Request, Response } from "express";
import { validateCantidadParams, validateDiscoData } from "../utils/validateDiscos";
import { Collection, ObjectId } from "mongodb";
import { error } from "console";

const getColeccion = () => getDb().collection("Discos");

export const getAllDiscosService = async (query: any) => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 2;

    const sortParam = query.sortParam || "filmName";
    const orderBy = query.orderBy === "asc" ? 1 : -1;
    const skip = (page - 1) * limit;

    const data = await getColeccion().find().sort({ sortParam: orderBy }).skip(skip).toArray();

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
        else {
            acc.DiscosCorrectos.push(discosValidado);
            return acc;
        }
    }, discosValidados)

    return {
        info: { page, limit, sortParam, orderBy },
        result,
    };
}

export const getDiscosByIdService = async (req: Request) => {
    try {
        const id = req.params.id;
        if (id.length === 24) {
            const discoBuscado = await getColeccion().findOne({
                _id: new ObjectId(id)
            });
            if (discoBuscado) {
                const discosValidado = validateDiscoData(discoBuscado);
                if (typeof discosValidado === "string") return null;
                return discosValidado;
            }
            return null;
        }
    } catch (error) {
        console.log("Error");
    }
}

export const postDiscoService = async (req: Request) => {
    try {
        const validateBody = validateDiscoData(req.body);
        if (typeof validateBody === "string") return {
            error: validateBody,
        };
        const result = await getColeccion().insertOne(req.body);
        const discoInsertado = await getColeccion().findOne({ _id: result.insertedId });
        return discoInsertado;
    } catch (error) {
        console.log("Error al hacer POST de un disco");
    }
}


export const postMultipleDiscoService = async (req: Request) => {
    try {

        const discos: LD[] = req.body;
        const errores: { index: number; error: string }[] = [];
        const validos: LD[] = [];
        discos.forEach((disco, index) => {
            const validation = validateDiscoData(disco);
            if (typeof validation === "string") {
                errores.push({ index, error: validation });
            } else {
                validos.push(disco);
            }
        });
        if (errores.length > 0) return null;
        const result = await getColeccion().insertMany(validos);
        return result;
    }
    catch (error) {
        console.log(error)
    }
}

export const deleteDiscoService = async (req: Request) => {
    try {
        const { id } = req.params;
        const result = await getColeccion().deleteOne({ _id: new ObjectId(id) });
        return result;
    } catch (error) {
        console.log(error)
    }
}

