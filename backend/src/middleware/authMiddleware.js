import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/auth.js';

export function authRequired(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'No token provided' });

    const [, token] = authHeader.split(' ');

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        return next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid token' });
    }
}
