# from flask import Flask, request, jsonify
# import json
# import numpy as np
# from tensorflow.keras.models import load_model
# from sklearn.preprocessing import MultiLabelBinarizer
# import joblib

# app = Flask(__name__)

# # Load model and label binarizer
# model = load_model("meal_model.h5")
# mlb = joblib.load("mlb.pkl")

# # Load recipes
# with open("recipes.json", "r") as f:
#     recipes = json.load(f)

# with open("meals.json", "r") as f:
#     int_to_meal = json.load(f)

# @app.route('/predict', methods=['POST'])
# @app.route('/predict', methods=['POST'])
# def predict():
#     data = request.json
#     ingredients = data.get('ingredients', [])

#     input_vec = mlb.transform([ingredients])
#     prediction = model.predict(input_vec)[0]
#     predicted_index = np.argmax(prediction)

#     predicted_label = int_to_meal[str(predicted_index)]

#     recipe = next((r for r in recipes if r["name"].lower() == predicted_label.lower()), None)

#     if recipe:
#         return jsonify(recipe)
#     else:
#         return jsonify({"error": "Recipe not found for prediction"}), 404


# if __name__ == '__main__':
#     app.run(debug=True)
from flask import Flask, request, jsonify
import json
import numpy as np
from tensorflow.keras.models import load_model
import joblib

app = Flask(__name__)

# Load model and encoders
model = load_model("meal_model.h5")
mlb = joblib.load("mlb.pkl")

# Load recipes and label mappings
with open("recipes.json", "r") as f:
    recipes = json.load(f)

with open("meals.json", "r") as f:
    int_to_meal = json.load(f)

# Prediction route
@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    ingredients = data.get('ingredients', [])

    if not ingredients:
        return jsonify({"error": "No ingredients provided"}), 400

    try:
        input_vec = mlb.transform([ingredients])
        prediction = model.predict(input_vec.toarray())[0]
        predicted_index = int(np.argmax(prediction))
        predicted_label = int_to_meal[str(predicted_index)]

        # Find full recipe info
        recipe = next((r for r in recipes if r["name"].lower() == predicted_label.lower()), None)

        if recipe:
            return jsonify(recipe)
        else:
            return jsonify({"error": "Recipe not found for prediction"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
