import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import User, { IUser } from '@domain/entities/user.entity';

declare global {
    namespace Express {
        interface Request {
            user?: IUser;
        }
    }
}

export default async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(401).json({ error: 'Sem header' });
    }
    const token = authorization.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Sem Token' });
    }
    try {
        const data = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        const { email } = data as { email: string };
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Usuario não encontrado' });
        }
        req.user = user;
        next();
    } catch (e) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
}