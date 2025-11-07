import { LD } from "../types/LD";

export const validateCantidadParams = (data: any): string | null => {
    const { filmName, rotationType, region, lengthMinutes, videoFormat } = data;
    if (!filmName || !rotationType || !region || !lengthMinutes || !videoFormat)
        return "Faltan campos en el body";
    return null;
};

export const validateDiscoData = (data: any): string | LD => {
    if (!data) return "No hay body";
    const missing = validateCantidadParams(data);
    if (missing) return missing;

    const { filmName, rotationType, region, lengthMinutes, videoFormat } = data;

    if (typeof filmName !== "string") return "filmName debe ser un string";
    if (typeof region !== "string") return "region debe ser un string";
    if (typeof lengthMinutes !== "number" || lengthMinutes < 0)
        return "lengthMinutes debe ser un número positivo";
    if (!["CAV", "CLV"].includes(rotationType))
        return "rotationType debe ser CAV o CLV";
    if (!["PAL", "NTSC"].includes(videoFormat))
        return "videoFormat debe ser PAL o NTSC";

    return data as LD;
};

