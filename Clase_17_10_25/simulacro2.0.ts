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

type Player = {
    id: number;
    name: string;
    team: string;
    position: "PG" | "SG" | "SF" | "PF" | "C"; // Point Guard, Shooting Guard, Small Forward, Power Forward, Center
    stats: {
        pointsPerGame: number;
        reboundsPerGame: number;
        assistsPerGame: number;
    };
    titles: number
};


let players: Player[] = [
    {
        id: 1,
        name: "LeBron James",
        team: "Lakers",
        position: "SF",
        stats: { pointsPerGame: 25.0, reboundsPerGame: 7.0, assistsPerGame: 7.0 },
        titles: 2
    },
    {
        id: 2,
        name: "Stephen Curry",
        team: "Warriors",
        position: "PG",
        stats: { pointsPerGame: 30.0, reboundsPerGame: 4.0, assistsPerGame: 6.0 },
        titles: 0
    },
    {
        id: 3,
        name: "Kevin Durant",
        team: "Suns",
        position: "PF",
        stats: { pointsPerGame: 27.0, reboundsPerGame: 6.0, assistsPerGame: 5.0 },
        titles: 4
    },
];



const validatePlayerData = (data: any): string | null => {
    const { name, team, position, stats } = data;
    if (typeof name !== "string" || name.trim().length < 2) return "Fallo en el nombre";
    if (!team) return "Falta el equipo";
    if (!["PG", "SG", "SF", "PF", "C"].includes(position))
        return "La posición debe ser PG, SG, SF, PF o C.";
    if (
        !stats ||
        typeof stats.pointsPerGame !== "number" ||
        typeof stats.reboundsPerGame !== "number" ||
        typeof stats.assistsPerGame !== "number" ||
        stats.pointsPerGame < 0 ||
        stats.reboundsPerGame < 0 ||
        stats.assistsPerGame < 0
    ) {
        return "Las estadísticas deben incluir pointsPerGame, reboundsPerGame y assistsPerGame como números no negativos.";
    }
    return null;
}



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



app.get("/players", (req, res) => {
    res.status(200).send(players);
})


app.get("/players/:id", (req, res) => {
    const id = Number(req.params.id);
    const jugadorBuscado = players.find((player) => player.id === id);
    return jugadorBuscado ? res.status(202).send(jugadorBuscado) : res.status(404).send({ error: "Jugador no encontrado" });
})

app.get("/players/position/:position", (req, res) => {
    const position = req.params.position;
    const jugadoresBuscadosPosicion = players.filter((player) => player.position === position);
    res.status(200).send(jugadoresBuscadosPosicion);
})

app.post("/players", (req, res) => {
    const error = validatePlayerData(req.body);
    if (error) return res.status(400).json({ error });
    const ultimoPlayer = players.at(-1);
    const nuevoID = ultimoPlayer ? ultimoPlayer.id + 1 : 0;
    const newPlayer = {
        id: nuevoID,
        ...req.body
    }
    players.push(newPlayer);
    return res.status(201).send(newPlayer);
})

app.put("/players/:id", (req, res) => {
    const id = Number(req.params.id);
    const index = players.findIndex((player) => player.id === id);
    if (index === -1) res.status(404).send({ mesagge: "Jugador no encotrado" });

    const error = validatePlayerData(req.body);
    if (error) return res.status(400).json({ error });

    players[index] = {
        ...players[index],
        ...req.body,
    }
    res.json({
        message: "Persona actualizada correctamente",
        person: players[index],
    });
})

app.put("/players/titles/:team", (req, res) => {
    let { team } = req.params;
    team = team.toLowerCase();
    const nombreCorrecto = players.some((player) => player.team.toLowerCase() === team)
    if(!nombreCorrecto) return res.status(404).send({mesagge: "no hay equipos con ese nombre"});
    players = players.map((player) => {
        if (player.team.toLowerCase() === team) player.titles = player.titles + 1;
        return player;
    })
    

    res.json({
        message: "lista actualizada correctamente"
    })
})

app.delete("/players/:id", (req, res) => {
    const id = Number(req.params.id);
    const index = players.findIndex((player) => player.id === id);
    if (index === -1) res.status(404).send({ mesagge: "Jugador no encotrado" });
    players = players.filter((player) => player.id !== id);
    res.status(200).send({message: "Persona eliminada"});
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

    console.log('Todos los jugadores');
    await axios
        .get("http://localhost:3000/players")
        .then((res) => console.log(res.data));

    console.log('Hago el POST');
    await axios
        .post("http://localhost:3000/players", {
            "name": "pruebaaa",
            "team": "Warriors",
            "position": "SF",
            "stats": {
                "pointsPerGame": 7,
                "reboundsPerGame": 7,
                "assistsPerGame": 7
            },
            "titles": 0
        })
        .then((res) => console.log(res.data));

    console.log('Verfico el POST');
    await axios
        .get("http://localhost:3000/players")
        .then((res) => console.log(res.data));

    console.log('SUMO titles a warrios');
    await axios
        .put("http://localhost:3000/players/titles/Warriors")
        .then((res) => console.log(res.data))
    
    
    await axios
        .get("http://localhost:3000/players")
        .then((res) => console.log(res.data));

    console.log('GET POR POSICION');
    await axios
        .get("http://localhost:3000/players/position/SF")
        .then((res) => console.log(res.data));
    
    
    await axios
        .delete("http://localhost:3000/players/4")
        .then((res) => console.log(res.data));

    await axios
        .get("http://localhost:3000/players")
        .then((res) => console.log(res.data));
        
}

testApi()