from flask import Flask, request, jsonify

app = Flask(__name__)

ingredient_db = {
    "chicken rice broccoli": "Grilled Chicken Bowl",
    "banana oats egg": "Protein Banana Pancakes",
    "tuna lettuce avocado": "Tuna Avocado Salad"
}

@app.route('/suggest-meal', methods=['POST'])
def suggest_meal():
    data = request.get_json()
    ingredients = data.get("ingredients", [])
    
    key = " ".join(sorted(ingredients)).lower()

    for known in ingredient_db:
        if all(item in key for item in known.split()):
            return jsonify({"meal": ingredient_db[known]})
    
    return jsonify({"meal": "No matching meal found. Try something else!"})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
