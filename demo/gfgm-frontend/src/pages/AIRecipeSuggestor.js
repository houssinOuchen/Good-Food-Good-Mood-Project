import React, { useState } from 'react';
import axios from 'axios';

const AIRecipeSuggestor = () => {
    const [input, setInput] = useState('');
    const [result, setResult] = useState(null);

    const handleGenerate = async () => {
        const ingredients = input.split(',').map(i => i.trim());
        try {
            const res = await axios.post('/api/ai/predict', { ingredients },{
                headers: { 'Content-Type': 'application/json' },
            });
            setResult(res.data);
        } catch (error) {
            console.error(error);
            alert('AI prediction failed');
        }
    };

    return (
        <div>
            <h3>AI Recipe Suggestion</h3>
            <input
                placeholder="Enter ingredients (e.g. onion, rice)"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                style={{ width: '300px' }}
            />
            <button onClick={handleGenerate}>Generate</button>

            {result && (
                <div style={{ marginTop: '20px' }}>
                    <h4>{result.name}</h4>
                    <p><strong>Ingredients:</strong> {result.ingredients.join(', ')}</p>
                    <p><strong>Steps:</strong></p>
                    <ol>
                        {result.steps.map((step, idx) => (
                            <li key={idx}>{step}</li>
                        ))}
                    </ol>
                </div>
            )}
        </div>
    );
};

export default AIRecipeSuggestor;
