import { ObjectId } from "mongodb"

export type Product = {
    _id?: ObjectId,
    idCreatorUser: string,
    idsBuyer?: ObjectId[],
    name: string,
    description: string,
}