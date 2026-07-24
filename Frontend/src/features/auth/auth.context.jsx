import { createContext, useState, useEffect } from "react";
import { login, register, logout, getMe } from './services/auth.api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // 1. Initial Page Load Check (Sirf ek baar app start hone par chalega)
    useEffect(() => {
        const getAndSetUser = async () => {
            try {
                const data = await getMe();
                if (data && data.user) {
                    setUser(data.user);
                } else {
                    setUser(null);
                }
            } catch (err) {
                console.log("Session check failed:", err);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        getAndSetUser();
    }, []); // Empty dependency array -> Runs ONLY ONCE on mount

    // 2. Handle Login
    const handleLogin = async ({ email, password }) => {
        setLoading(true);
        try {
            const data = await login(email, password);
            if (data && data.user) {
                setUser(data.user);
                return data.user;
            }
        } catch (err) {
            console.error("Login failed:", err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // 3. Handle Register
    const handleRegister = async ({ username, email, password }) => {
        setLoading(true);
        try {
            const data = await register(username, email, password);
            if (data && data.user) {
                setUser(data.user);
                return data.user;
            }
        } catch (err) {
            console.error("Registration failed:", err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // 4. Handle Logout
    const handleLogout = async () => {
        setLoading(true);
        try {
            await logout();
            setUser(null);
            localStorage.removeItem('token');
        } catch (err) {
            console.error("Logout failed:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            setUser,
            loading,
            setLoading,
            handleLogin,
            handleRegister,
            handleLogout
        }}>
            {children}
        </AuthContext.Provider>
    );
};