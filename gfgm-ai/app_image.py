from flask import Flask, request, jsonify
from image_predict import predict_ingredients
import os

app = Flask(__name__)
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route("/upload-image", methods=["POST"])
def upload_image():
    if "image" not in request.files:
        return jsonify({"error": "No image provided"}), 400

    file = request.files["image"]
    filepath = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(filepath)

    ingredients = predict_ingredients(filepath)
    return jsonify({"ingredients": ingredients})

if __name__ == "__main__":
    app.run(port=5001, debug=True)
