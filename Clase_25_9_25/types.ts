import type { MinKey } from "mongodb"

export type Movie = {
    id: string,
    title: string,
    year: number,
    director: string,
    duration: number,
    poster: number,
    genre: string[],
    rate: number 
}