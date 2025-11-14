import { Router } from "express";
import { User } from "../types/user";
import { getDb } from '../config/db';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { JwtPayload } from "../types/JwtPayload"


const router = Router();

dotenv.config();

const SECRET = process.env.SECRET;
console.log(SECRET);

const getColeccion = () => getDb().collection<User>("Users");

router.post("/register", async (req, res) => {
    try {
        const { email, useranme, password } = req.body as User;

        const user = await getColeccion().findOne({ email });
        if (user) return res.status(400).send({ message: "Email ya existente" });

        const passwordEncriptada = await bcrypt.hash(password, 10);
        await getColeccion().insertOne({ email, useranme, password: passwordEncriptada });

        return res.status(201).send({ message: "Usuario creado con exito" });
    } catch (error) {
        console.log(error);
    }
})

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body as User;

        const user = await getColeccion().findOne({ email });
        if (!user) return res.status(400).send({ message: "emial incorrecto" });

        const passwordValid = await bcrypt.compare(password, user.password);
        if (!passwordValid) return res.status(400).send({ message: "Contraseña incorrecta" });

        const token = jwt.sign({ id: user._id.toString(), email: user.email, username: user.useranme } as JwtPayload, SECRET as string, {
            expiresIn: "1h"
        });
        return res.status(201).send({ message: "login correcto", token });
    } catch (error) {
        console.log(error);
    }

})

export default router;