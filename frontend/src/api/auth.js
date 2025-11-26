// src/api/auth.js
import api from './axios';

export async function loginRequest(email, password) {
    const res = await api.post('/auth/login', { email, password });
    return res.data; // { token, user }
}
