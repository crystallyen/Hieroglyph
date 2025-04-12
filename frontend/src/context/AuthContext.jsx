import { createContext, useState, useEffect } from 'react';
import axios from '../config/axiosConfig.js';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const fetchUser = async () => {
        try {
            const res = await axios.get('/api/me');
            setUser(res.data.user);
            setIsAuthenticated(true);
        } catch (err) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const login = async (user) => {
        setUser(user);
        setIsAuthenticated(true);
        setLoading(false);
    };

    const logout = async () => {
        setLoading(true);
        try {
            await axios.post('/api/auth/logout');
            setUser(null);
            setIsAuthenticated(false);
        } catch (err) {
            console.log(err); // Toast here
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
