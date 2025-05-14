import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedAuth = localStorage.getItem('auth');
        if (storedAuth) {
            const { username, password } = JSON.parse(storedAuth);
            axios.defaults.auth = { username, password };
            fetchCurrentUser();
        } else {
            setLoading(false);
        }
    }, []);

    const fetchCurrentUser = async () => {
        try {
            const response = await axios.get('/api/auth/me');
            setUser(response.data);
        } catch (error) {
            console.error('Failed to fetch current user:', error);
            logout();
        } finally {
            setLoading(false);
        }
    };

    const login = async (username, password) => {
        try {
            await axios.post('/api/auth/login', { username, password });
            
            // Store credentials and set axios default auth
            const auth = { username, password };
            localStorage.setItem('auth', JSON.stringify(auth));
            axios.defaults.auth = auth;
            
            await fetchCurrentUser();
            return true;
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    };

    const register = async (userData) => {
        try {
            await axios.post('/api/auth/register', userData);
            return true;
        } catch (error) {
            console.error('Registration failed:', error);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('auth');
        delete axios.defaults.auth;
        setUser(null);
    };

    const value = {
        user,
        loading,
        login,
        logout,
        register,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
