import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../models/index.js';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config/auth.js';

export async function login(email, password) {
    const user = await db.User.findOne({ where: { email } });
    if (!user) {
        throw new Error('Invalid credentials');
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
        throw new Error('Invalid credentials');
    }

    const payload = {
        sub: user.id,
        role: user.role
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    return {
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    };
}
