import pandas as pd
import json

# Load your CSV file (update if different)
df = pd.read_csv("C:/Users/houss/OneDrive/Desktop/EMSI/4IIR/S2/PFA/food.com/RAW_recipes.csv")  # <-- Change this to your actual file name

# Keep only needed columns and drop NaNs
df = df[['name', 'steps', 'ingredients']].dropna()

# Prepare training data and full recipes
training_data = []
recipes = []

for _, row in df.iterrows():
    name = row['name'].strip()
    ingredients = eval(row['ingredients'])  # Convert string to list
    steps = eval(row['steps'])              # Convert string to list

    ingredients = [i.lower().strip() for i in ingredients]
    steps = [s.strip() for s in steps if s.strip()]

    if len(ingredients) < 2 or not steps:
        continue

    training_data.append((ingredients, name))
    recipes.append({
        "name": name,
        "ingredients": ingredients,
        "steps": steps
    })

# Save to JSON
with open("recipes.json", "w", encoding="utf-8") as f:
    json.dump(recipes, f, indent=2)

with open("training_data.json", "w", encoding="utf-8") as f:
    json.dump(training_data, f, indent=2)

print(f"✅ Done! Extracted {len(training_data)} meals.")
