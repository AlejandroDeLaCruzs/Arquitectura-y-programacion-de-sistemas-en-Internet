import { getDb } from "../config/db";
import { LD, discosValidados, DiscosErroneo } from "../types/LD";
import { validateDiscoData } from "../utils/validateDiscos";

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