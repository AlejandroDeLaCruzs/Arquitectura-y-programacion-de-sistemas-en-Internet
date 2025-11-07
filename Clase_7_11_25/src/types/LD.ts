import { ObjectId } from "mongodb";

export type discosValidados = {
    DiscosCorrectos: LD[];
    DiscosErroneos: DiscosErroneo[];
}
export type DiscosErroneo = {
    Disco: ObjectId;
    Message: string,
}
export type LD = {
    id: number;
    filmName: string;
    rotationType: "CAV" | "CLV";
    region: string;
    lengthMinutes: number;
    videoFormat: "NTSC" | "PAL";
}