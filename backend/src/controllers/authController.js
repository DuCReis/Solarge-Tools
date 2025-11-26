import { login } from '../services/authService.js';

export async function loginController(req, res) {
    try {
        const { email, password } = req.body;
        const result = await login(email, password);
        return res.json(result);
    } catch (err) {
        console.error(err);
        return res.status(401).json({ message: 'Invalid email or password' });
    }
}
