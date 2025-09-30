import React, { useState } from 'react';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    N: '',
    P: '',
    K: '',
    temperature: '',
    humidity: '',
    ph: '',
    rainfall: ''
  });
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // const response = await fetch('http://localhost:8000/predict', {
      const response = await fetch('/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      setPrediction(data.predicted_crop);
    } catch (error) {
      console.error('Error:', error);
      setPrediction('Error occurred while predicting');
    }
    setLoading(false);
  };

  return (
    <div className="App">
      <h1>Crop Recommendation System</h1>
      <form onSubmit={handleSubmit} className="form-container">
        <div className="input-group">
          <label>Nitrogen (N):</label>
          <input
            type="number"
            name="N"
            value={formData.N}
            onChange={handleChange}
            required
            min={0} max={150}
          />
        </div>
        <div className="input-group">
          <label>Phosphorus (P):</label>
          <input
            type="number"
            name="P"
            value={formData.P}
            onChange={handleChange}
            required
            min={0} max={150}
          />
        </div>
        <div className="input-group">
          <label>Potassium (K):</label>
          <input
            type="number"
            name="K"
            value={formData.K}
            onChange={handleChange}
            required
            min={0} max={250}
          />
        </div>
        <div className="input-group">
          <label>Temperature:</label>
          <input
            type="number"
            step="0.01"
            name="temperature"
            value={formData.temperature}
            onChange={handleChange}
            required
            min={5} max={45}
          />
        </div>
        <div className="input-group">
          <label>Humidity:</label>
          <input
            type="number"
            step="0.01"
            name="humidity"
            value={formData.humidity}
            onChange={handleChange}
            required
            min={10} max={100}
          />
        </div>
        <div className="input-group">
          <label>pH:</label>
          <input
            type="number"
            step="0.01"
            name="ph"
            value={formData.ph}
            onChange={handleChange}
            required
            min={3} max={10}
          />
        </div>
        <div className="input-group">
          <label>Rainfall:</label>
          <input
            type="number"
            step="0.01"
            name="rainfall"
            value={formData.rainfall}
            onChange={handleChange}
            required
            min={20} max={500}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Predicting...' : 'Predict Crop'}
        </button>
      </form>
      {prediction && (
        <div className="prediction">
          <h2>Recommended Crop:</h2>
          <p className="crop-name">{prediction}</p>
        </div>
      )}
    </div>
  );
}

export default App;
