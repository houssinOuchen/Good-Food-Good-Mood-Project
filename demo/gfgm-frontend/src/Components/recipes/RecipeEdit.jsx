import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const RecipeEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [recipe, setRecipe] = useState({
        name: '',
        type: '',
        temps: '',
        calories: '',
        img_url: ''
    });

    useEffect(() => {
        axios.get(`/api/recipes/${id}`, { withCredentials: true })
            .then(res => {
                setRecipe(res.data);
            })
            .catch(() => {
                Swal.fire('Error', 'Failed to load recipe', 'error');
                navigate('/');
            });
    }, [id, navigate]);

    const handleChange = (e) => {
        setRecipe({ ...recipe, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.put(`/api/recipes/${id}`, recipe,{ withCredentials: true }
        )
            .then(() => {
                Swal.fire('Success', 'Recipe updated successfully', 'success');
                navigate('/');
            })
            .catch(err => {
                console.error(err);
                Swal.fire('Error', 'Failed to update recipe', 'error');
            });
    };

    return (
        <div className="container">
            <h2>Edit Recipe</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label>Name:</label>
                    <input type="text" className="form-control" name="name" value={recipe.name} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <label>Type:</label>
                    <input type="text" className="form-control" name="type" value={recipe.type} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <label>Temps (min):</label>
                    <input type="number" className="form-control" name="temps" value={recipe.temps} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <label>Calories:</label>
                    <input type="number" className="form-control" name="calories" value={recipe.calories} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <label>Image URL:</label>
                    <input type="text" className="form-control" name="img_url" value={recipe.img_url} onChange={handleChange} />
                </div>
                <button type="submit" className="btn btn-success">Update</button>
                <button type="button" className="btn btn-secondary ms-2" onClick={() => navigate('/')}>Cancel</button>
            </form>
        </div>
    );
};

export default RecipeEdit;
