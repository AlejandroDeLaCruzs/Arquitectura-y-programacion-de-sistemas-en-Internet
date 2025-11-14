import { ObjectId, ServerMonitoringMode } from "mongodb"

export type User = {
    _id?: ObjectId,
    email: string,
    useranme: string,
    password: string
}