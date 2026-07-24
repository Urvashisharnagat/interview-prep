import axios from 'axios';

const api = axios.create({
    baseURL: 'https://interview-prep-pwmn.onrender.com',
    withCredentials: true
});

export async function register(username, email, password) {
    try {
        const response = await api.post('/api/auth/register', { username, email, password });
        return response.data;
    } catch (err) {
        console.error("Register API Error:", err.response?.data || err.message);
        throw err; // 👈 Error throw karna zaroori hai taaki UI/Context ise catch kar sake
    }  
}

export async function login(email, password) {
    try {
        const response = await api.post('/api/auth/login', { email, password });
        return response.data;
    } catch (err) {
        console.error("Login API Error:", err.response?.data || err.message);
        throw err; // 👈 Throwing error back to AuthContext
    }  
}

export async function logout() {
    try {
        const response = await api.post('/api/auth/logout');
        return response.data;
    } catch (err) {
        console.error("Logout API Error:", err.response?.data || err.message);
        throw err;
    }  
}

export async function getMe() {
    try {
        const response = await api.get('/api/auth/get-me');
        return response.data;
    } catch (err) {
        console.error("GetMe API Error:", err.response?.data || err.message);
        throw err;
    }  
}