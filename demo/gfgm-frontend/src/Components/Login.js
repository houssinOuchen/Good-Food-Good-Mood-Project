import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [auth, setLocalAuth] = useState({ username: '', password: '' });
    const { setAuth } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setLocalAuth({ ...auth, [e.target.name]: e.target.value });
    };

    const handleLogin = async () => {
        try {
            const res = await axios.post(
                'http://localhost:8080/api/users/login',
                auth,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true, // this is essential for cookies/session to be set
                }
            );
            setAuth(auth); // Save in context (for frontend access)
            alert(`✅ ${res.data}`);
            navigate('/' +
                'recipes');
        } catch (error) {
            alert('❌ Login failed: ' + (error.response?.data || 'Unknown error'));
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <input name="username" placeholder="Username" onChange={handleChange} /><br />
            <input name="password" type="password" placeholder="Password" onChange={handleChange} /><br />
            <button onClick={handleLogin}>Login</button>
        </div>
    );
};

export default Login;