import jwt from "jsonwebtoken";
import { Request } from "express";
import { JwtPayload } from "../types/JwtPayload"

export interface AuthRequest extends Request {
    user?: JwtPayload;
};