import express, { type Request, type Response, type NextFunction } from "express";
import fs from 'fs/promises'
import {type Movie} from "./types.ts";



const app = express()

app.get('/Movies', (req: Request,  res: Response) => {
    fs.readFile("movies.json").then((data) => {
        res.send(data);
    })
})

app.get('/Movies/:id', async (req: Request, res: Response) => {
    const dataJson = await fs.readFile("movies.json", "utf8");
    const arrayMovies: Movie[] = JSON.parse(dataJson);
    console.log(arrayMovies)
    const idreq = String(req.params.id);
    const datosFiltrados = arrayMovies.find((movie) => movie.id === idreq)
    if(!datosFiltrados) res.status(404).send("No se ha encontrado la pelicula")
    res.send(JSON.stringify(datosFiltrados))
})



const port = process.env.PORT || 3000

app.listen(port,  () => {
    console.log(`http://localhost:${port}`)
})