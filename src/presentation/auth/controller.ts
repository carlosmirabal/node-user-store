import { Request, Response } from "express";
import { RegisterUserDto } from "../../domain";

export class AuthController {
    constructor() { }

    registerUser = (req: Request, res: Response) => {
        const [error, registerDto] = RegisterUserDto.create(req.body);

        if (error) return res.status(400).json({ error });

        res.json(registerDto);
    };

    loginUser = (req: Request, res: Response) => {
        res.json("loginUser");
    };

    validateEmail = (req: Request, res: Response) => {
        res.json("ValidateEmail");
    };
}
