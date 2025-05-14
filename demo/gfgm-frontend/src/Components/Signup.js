import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';


const Signup = () => {
    const [form, setForm] = useState({ username: '', email: '', password: '' });
    const { setAuth } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        try {
            const res = await axios.post('/api/users/register',
                { ...form, role: 'USER' },
                { headers: { 'Content-Type': 'application/json' } }
            );

            setAuth({ username: form.username, password: form.password });
            alert(`User ${res.data.username} registered successfully`);
            navigate('/recipes');
        } catch (error) {
            alert('Registration failed');
        }
    };

    return (
        <div>
            <h2>Sign Up</h2>
            <input name="username" placeholder="Username" onChange={handleChange} /><br />
            <input name="email" type="email" placeholder="Email" onChange={handleChange} /><br />
            <input name="password" type="password" placeholder="Password" onChange={handleChange} /><br />
            <button onClick={handleSubmit}>Register</button>
        </div>
    );
};

export default Signup;
