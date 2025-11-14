import { ObjectId } from "mongodb"

export type JwtPayload = {
    id: string,
    email: string,
    username: string,
}