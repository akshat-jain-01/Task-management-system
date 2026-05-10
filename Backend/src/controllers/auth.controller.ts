import { Request, Response } from "express";
import { regiserUser } from "../services/auth.service";
import { loginUser } from "../services/auth.service";
import { registerSchema, loginSchema } from "../validators/auth.validator";

export const register = async (req: Request, res: Response) => {

    try {

        registerSchema.parse(req.body);

        const { name, email, password } = req.body;


        const result = await regiserUser(name, email, password);
        res.status(201).json(result);
    } 
    
    catch (error:any) {
        res.status(400).json({ errors: error.errors || error.message });
    }

};

export const login = async (req: Request, res: Response) => {

    try {

        loginSchema.parse(req.body);

        const { email, password } = req.body;

        const result = await loginUser(email, password);
        res.status(201).json(result);
    } 
    
    catch (error:any) {
        res.status(400).json({ errors: error.errors || error.message });
    }

};