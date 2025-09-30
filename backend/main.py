from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
import pandas as pd
import joblib
import os

# Load trained model
model = joblib.load("backend/CropRecommendation.pkl")
# model = joblib.load("CropRecommendation.pkl")

# Initialize app
app = FastAPI()

# Allow frontend API calls
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # for production, replace "*" with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Input schema for crop recommendation
class CropInput(BaseModel):
    N: float
    P: float
    K: float
    temperature: float
    humidity: float
    ph: float
    rainfall: float

# Reverse label encoding dictionary
label_map = {
    0: 'apple', 1: 'banana', 2: 'blackgram', 3: 'chickpea',
    4: 'coconut', 5: 'coffee', 6: 'cotton', 7: 'grapes',
    8: 'jute', 9: 'kidneybeans', 10: 'lentil', 11: 'maize',
    12: 'mango', 13: 'mothbeans', 14: 'mungbean', 15: 'muskmelon',
    16: 'orange', 17: 'papaya', 18: 'pigeonpeas', 19: 'pomegranate',
    20: 'rice', 21: 'watermelon'
}

@app.post("/predict")
def predict_crop(data: CropInput):
    input_df = pd.DataFrame([{
        "N": data.N,
        "P": data.P,
        "K": data.K,
        "temperature": data.temperature,
        "humidity": data.humidity,
        "ph": data.ph,
        "rainfall": data.rainfall
    }])
    prediction = model.predict(input_df)[0]
    crop_name = label_map.get(prediction, str(prediction))
    return {"predicted_crop": crop_name}

# Serve React build folder
frontend_dir = os.path.join(os.path.dirname(__file__), "../frontend/build")
if os.path.exists(frontend_dir):
    app.mount("/", StaticFiles(directory=frontend_dir, html=True), name="frontend")

    @app.get("/{full_path:path}")
    async def serve_react_app(full_path: str):
        return FileResponse(os.path.join(frontend_dir, "index.html"))
