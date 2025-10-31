import express, { Router } from "express"
import { getDb } from "./mongo";
import { ObjectId } from "mongodb";


const router = Router();


const coleccion = () => getDb().collection("users");

router.get("/", async (req, res) => {
    try {
        const personas = await coleccion().find().toArray();
        res.json(personas);
    } catch (err) {
        res.status(404).json(err);
    }
});

router.get("/:id", async (req, res) => {
    try {
        const idDelParametro = req.params.id;
        if (idDelParametro.length == 24) {
            const personaEncontradaOno = await coleccion().findOne({
                _id: new ObjectId(idDelParametro),
            });
            personaEncontradaOno
                ? res.json(personaEncontradaOno)
                : res.status(404).json({ message: "Persona con dicho id no existe" });
        } else {
            res
                .status(404)
                .json({ message: "Id de diferente longitud a 24 caracteres" });
        }
    } catch (error) {
        console.log(error);
    }
})


router.post("/", async (req, res) => {
    try {
        const result = await coleccion().insertOne(req.body);
        const idMongo = result.insertedId;
        const personaCreada = await coleccion().findOne({ _id: idMongo });
        res.status(201).json(personaCreada);
    } catch (error) {
        res.status(400).json(error);
    }

})

router.put("/:id", async (req, res) => {
    const id = req.params.id;
    const PersonaActualizada = await coleccion().updateOne(
        { _id: new ObjectId(id) },
        { $set: req.body }
    )
    PersonaActualizada ? res.sendStatus(200).send(PersonaActualizada) : res.status(404).send({ message: "Persona con dicho id no existe" })
})



router.delete("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const personaElimianda = await coleccion().deleteOne({
        _id: new ObjectId(id)
    })
        res.json({ personaElimianda });
    } catch (error) {
        console.log(error);
    }
   
})


export default router;
