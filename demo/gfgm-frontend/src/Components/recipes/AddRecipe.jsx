import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const AddRecipe = () => {
    const { auth } = useAuth(); // ✅ Fixed: use destructuring correctly
    const { username, password } = auth || {}; // ✅ Then extract from `auth`

    const [recipe, setRecipe] = useState({
        name: '',
        type: '',
        temps: '',
        calories: '',
        imgFile: null
    });
    useEffect(() => {
        console.log('Auth from localStorage:', auth);
    }, [auth]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'imgFile') {
            setRecipe({ ...recipe, imgFile: files[0] });
        } else {
            setRecipe({ ...recipe, [name]: value });
        }
        console.log(username, "+", password);
    };

    const handleSubmit = async () => {
        if (!username || !password) {
            alert('Not authenticated');
            return;
        }

        const formData = new FormData();
        formData.append('name', recipe.name);
        formData.append('type', recipe.type);
        formData.append('temps', recipe.temps);
        formData.append('calories', recipe.calories);
        formData.append('file', recipe.imgFile);
        console.log("Submitting recipe:", recipe);
        console.log(btoa(`${username} : ${password}`));
        try {
            await axios.post('/api/recipes/add', formData, {
                headers: {
                    'Authorization': 'Basic ' + btoa(`${username}:${password}`),
                    'Content-Type': 'multipart/form-data'
                }
            });
            alert('Recipe added successfully');
        } catch (error) {
            console.error(error);
            alert('Failed to add recipe');
        }
    };

    return (
        <div>
            <h2>Add Recipe</h2>
            <input name="name" placeholder="Name" onChange={handleChange} /><br />
            <input name="type" placeholder="Type" onChange={handleChange} /><br />
            <input name="temps" placeholder="Temps" onChange={handleChange} /><br />
            <input name="calories" placeholder="Calories" onChange={handleChange} /><br />
            <input name="imgFile" type="file" onChange={handleChange} /><br />
            <button onClick={handleSubmit}>Add Recipe</button>
        </div>
    );
};

export default AddRecipe;
