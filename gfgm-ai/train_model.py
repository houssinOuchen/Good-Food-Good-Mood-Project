# import tensorflow as tf
# import numpy as np
# import json
# import joblib
# from sklearn.preprocessing import MultiLabelBinarizer
# from tensorflow.keras.models import Sequential
# from tensorflow.keras.layers import Dense

# # Sample data (ingredients and meals)
# data = [
#     (["chicken", "rice", "broccoli"], "Grilled Chicken Bowl"),
#     (["tuna", "lettuce", "tomato"], "Tuna Salad"),
#     (["eggs", "spinach", "avocado"], "Protein Breakfast Wrap"),
#     (["oats", "banana", "peanut butter"], "Power Oatmeal"),
#     (["beef", "quinoa", "beans"], "Beef Protein Bowl"),

#     (["msemen", "l3des", "djaj o bayd semman"], "Rfisa"),
#     (["sardin", "khayzo", "matisha"], "hot kwari"),
    
#     (["msemen", "l3des", "djaj"], "Rfisa"),
#     (["msemen", "djaj"], "Rfisa"),
#     (["l3des", "bayd semman"], "Rfisa"),
#     (["sardin", "khayzo"], "Hot Kwari"),
#     (["sardin", "matisha"], "Hot Kwari")
# ]

# # Prepare input (ingredients) and output (meals)
# X_raw = [x[0] for x in data]
# y_raw = [x[1] for x in data]

# # Encode ingredients with one-hot encoding
# mlb = MultiLabelBinarizer()
# X = mlb.fit_transform(X_raw)

# # Encode output meals to numbers
# meal_labels = list(set(y_raw))
# meal_to_int = {meal: idx for idx, meal in enumerate(meal_labels)}
# int_to_meal = {idx: meal for meal, idx in meal_to_int.items()}
# y = np.array([meal_to_int[label] for label in y_raw])

# # Build a basic model
# model = Sequential()
# model.add(Dense(32, input_dim=len(X[0]), activation='relu'))
# model.add(Dense(16, activation='relu'))
# model.add(Dense(len(meal_labels), activation='softmax'))

# model.compile(loss='sparse_categorical_crossentropy', optimizer='adam', metrics=['accuracy'])

# # Train
# model.fit(X, y, epochs=100, verbose=1)

# # Save model and labels
# model.save("meal_model.h5")
# with open("ingredients.json", "w") as f:
#     json.dump(mlb.classes_.tolist(), f)

# with open("meals.json", "w") as f:
#     json.dump(int_to_meal, f)

# joblib.dump(mlb, "mlb.pkl")

# print("✅ Model and label files saved.")
import tensorflow as tf
import numpy as np
import json
import joblib
from sklearn.preprocessing import MultiLabelBinarizer
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense
from tensorflow.keras.optimizers import Adam

# Load the cleaned dataset
with open("recipes.json", "r") as f:
    recipes = json.load(f)

print(f"Loaded {len(recipes)} recipes.")

# Prepare inputs (ingredients) and outputs (meal names)
X_raw = [r["ingredients"] for r in recipes]
y_raw = [r["name"] for r in recipes]

# Limit dataset to first N samples to avoid memory issues
subset_size = 50000  # Use 50,000 samples (adjust based on your memory)
X_raw = X_raw[:subset_size]
y_raw = y_raw[:subset_size]
print(f"Using {len(X_raw)} samples for training.")

# Encode ingredients as sparse one-hot vectors
mlb = MultiLabelBinarizer(sparse_output=True)
X = mlb.fit_transform(X_raw)

# Encode meal names to integer labels
meal_labels = list(set(y_raw))
meal_to_int = {meal: idx for idx, meal in enumerate(meal_labels)}
int_to_meal = {idx: meal for meal, idx in meal_to_int.items()}
y = np.array([meal_to_int[label] for label in y_raw])

# Convert sparse matrix to dense for training
X_dense = X.toarray()

# Build the model
model = Sequential([
    Dense(256, input_dim=X_dense.shape[1], activation='relu'),
    Dense(128, activation='relu'),
    Dense(len(meal_labels), activation='softmax')
])

model.compile(optimizer=Adam(0.001),
              loss='sparse_categorical_crossentropy',
              metrics=['accuracy'])

# Train the model
model.fit(X_dense, y, epochs=10, batch_size=64, validation_split=0.1, verbose=1)

# Save model and preprocessing files
model.save("meal_model.h5")
joblib.dump(mlb, "mlb.pkl")

with open("ingredients.json", "w") as f:
    json.dump(mlb.classes_.tolist(), f)

with open("meals.json", "w") as f:
    json.dump(int_to_meal, f)

print("✅ Model and preprocessing files saved.")
