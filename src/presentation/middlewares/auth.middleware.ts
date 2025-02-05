import { NextFunction, Request, Response } from "express";
import { JwtAdapter } from "../../config/jwt.adapter";
import { UserModel } from "../../data";
import { UserEntity } from "../../domain";


export class AuthMiddleware {

    static async validateJWT(req: Request, res: Response, next: NextFunction) {
        const authorization = req.headers.authorization;

        if (!authorization) return res.status(401).json({ error: 'Not token provided' })
        if (!authorization.startsWith('Bearer ')) return res.status(401).json({ error: 'Invalid Bearer token' })

        const token = authorization.split(' ').at(1) || '';

        try {
            const payload = await JwtAdapter.validateToken<{ id: string }>(token);
            if (!payload) return res.status(401).json({ error: 'Invalid token' });

            // Validamos que el ususario del token exista
            const user = await UserModel.findById(payload.id);
            if (!user) return res.status(401).json({ error: 'Invalid token - user' });

            // Agregamos el usuario al body
            req.body.user = UserEntity.fromObject(user);

            next();

        } catch (error) {
            // Crear log de errores
            console.log(error)
            res.status(500).json({ error: 'Internal server error' })
        }
    }
}