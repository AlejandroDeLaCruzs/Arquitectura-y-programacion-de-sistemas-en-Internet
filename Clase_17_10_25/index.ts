import axios from "axios";
import express, {
    type NextFunction,
    type Request,
    type Response,
} from "express";
import cors from "cors";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

type Team = {
    id: number
    name: string
    city: string
    titles: number
}

let teams: Team[] = [

    { id: 1, name: "Lakers", city: "Los Angeles", titles: 17 },

    { id: 2, name: "Celtics", city: "Boston", titles: 17 },

];


// --- Middleware de error genérico ---
const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.error("Error detectado:", err.message);
    res
        .status(500)
        .json({ error: "Error interno del servidor", detail: err.message });
};



// --- Rutas ---
app.get("/teams", (req, res) => {
    res.status(200).send(teams);
})

app.get("/teams/:id", (req, res) => {
    const id = req.params.id;
    const equipoBuscado = teams.find((team) => team.id == id);
    if (!equipoBuscado) return res.status(404).json({ error: " Equipo no encontrado" });
    return res.status(200).send(equipoBuscado);
})

app.post("/teams", (req, res) => {
    const ultimoEquipo = teams.at(-1);
    const nuevoID = ultimoEquipo ? ultimoEquipo.id + 1 : 0;
    if (!req.body.city || !req.body.titles || !req.body.name) return res.status(404).send({ mesage: "Body incompleto" });

    const nuevoEquipo: Team = {
        id: nuevoID,
        ...req.body
    }
    teams.push(nuevoEquipo);

    return res.status(202).send(nuevoEquipo);
})

app.delete("/teams/:id", (req, res) => {

    const id = req.params.id;
    const index = teams.findIndex((team) => team.id == id);
    if (index === -1) {
        return res.status(404).send({ error: " Equipo no encontrado" });
    }
    teams = teams.filter((team) => team.id != id)
    console.log(teams);
    res.status(202).send({ message: "Persona eliminada correctamente" });

})




// Middleware final (ruta no encontrada)
app.use((req, res) => {
    res.status(404).json({ error: "Ruta no encontrada" });
});

// Middleware de error
app.use(errorHandler);

app.listen(PORT, () => {
    console.log("Servidor en http://localhost:3000");
})




const testApi = async () => {
    setTimeout(() => {
        console.log("Han pasado 2 segundos");
    }, 2000);

    await axios.
        get("http://localhost:3000/teams")
        .then((res) => console.log(res.data));

    await axios.
        post("http://localhost:3000/teams",
            {
                name: "prueba",
                city: "aa",
                titles: 12
            }
        )
        .then((res) => console.log(res.data));

    await axios.
        get("http://localhost:3000/teams")
        .then((res) => console.log(res.data));

    await axios.
            delete("http://localhost:3000/teams/3")
            .then((res) => console.log(res.data));
    
            await axios.
        get("http://localhost:3000/teams")
        .then((res) => console.log(res.data));
}

testApi();