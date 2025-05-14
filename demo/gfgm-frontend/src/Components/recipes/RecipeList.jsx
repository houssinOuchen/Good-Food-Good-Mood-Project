import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const RecipeList = () => {
    const [recipes, setRecipes] = useState([]);
    const navigate = useNavigate();

    const fetchRecipes = () => {
        axios.get('/api/recipes', { withCredentials: true })

            .then(res => {
                console.log("Loaded recipes:", res.data);
                setRecipes(res.data)
            })
            .catch(() => Swal.fire('Error', 'Failed to load recipes', 'error'));
        console.log("Loaded recipes:", recipes);
    };

    const deleteRecipe = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'This will permanently delete the recipe.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
        }).then(result => {
            if (result.isConfirmed) {
                axios.delete(`/api/recipes/${id}`, { withCredentials: true })
                    .then(() => {
                        Swal.fire('Deleted!', 'Recipe deleted successfully.', 'success');
                        fetchRecipes();
                    })
                    .catch(() => Swal.fire('Error', 'Failed to delete recipe', 'error'));
            }
        });
    };

    useEffect(() => {
        fetchRecipes();
    }, []);

    return (<>
        <div className="container">
            <h2>All Recipes</h2>
            <button onClick={() => navigate('/recipes/new')} className="btn btn-primary mb-3">Add New Recipe</button>
            <div className="row">
                <h2>Recipes Loaded: {recipes.length}</h2>
                {recipes.map(r => (
                    <div className="col-md-4 mb-4" key={r.id}>
                        <div className="card">
                            <img src={r.img_url} className="card-img-top" alt={r.name} style={{ height: "200px", objectFit: "cover" }} />
                            <div className="card-body">
                                <h5 className="card-title">{r.name}</h5>
                                <p className="card-text">
                                    <b>Type:</b> {r.type}<br />
                                    <b>Temps:</b> {r.temps}<br />
                                    <b>Calories:</b> {r.calories}
                                </p>
                                <button onClick={() => navigate(`/recipes/edit/${r.id}`)} className="btn btn-warning me-2">Edit</button>
                                <button onClick={() => deleteRecipe(r.id)} className="btn btn-danger">Delete</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </>);
};

export default RecipeList;
