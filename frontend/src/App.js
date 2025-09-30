import { useState } from 'react';
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
      
      if (!response.ok) {
        throw new Error('Prediction failed');
      }
      
      const data = await response.json();
      setPrediction(data.predicted_crop);
    } catch (error) {
      console.error('Error:', error);
      setPrediction('Error occurred while predicting');
    } finally {
      setLoading(false);
    }
  };

  const inputFields = [
    { name: 'N', label: 'Nitrogen (N)', min: 0, max: 150, step: '1', unit: 'kg/ha', icon: '⚗️' },
    { name: 'P', label: 'Phosphorus (P)', min: 0, max: 150, step: '1', unit: 'kg/ha', icon: '⚗️' },
    { name: 'K', label: 'Potassium (K)', min: 0, max: 250, step: '1', unit: 'kg/ha', icon: '⚗️' },
    { name: 'temperature', label: 'Temperature', min: 5, max: 45, step: '0.1', unit: '°C', icon: '🌡️' },
    { name: 'humidity', label: 'Humidity', min: 0, max: 100, step: '0.1', unit: '%', icon: '💧' },
    { name: 'ph', label: 'pH Level', min: 0, max: 14, step: '0.1', unit: 'pH', icon: '⚗️' },
    { name: 'rainfall', label: 'Rainfall', min: 0, max: 500, step: '0.1', unit: 'mm', icon: '🌧️' },
  ];

  return (
    <div className="app-container">
      <div className="container">
        {/* Header */}
        <div className="header">
          <div className="icon-circle">
            <span className="sprout-icon">🌱</span>
          </div>
          <h1 className="title">Crop Recommendation System</h1>
          <p className="subtitle">
            Get intelligent crop recommendations based on soil and environmental conditions
          </p>
        </div>

        {/* Main Card */}
        <div className="card">
          <form onSubmit={handleSubmit} className="form">
            {/* Input Grid */}
            <div className="input-grid">
              {inputFields.map((field) => (
                <div key={field.name} className="input-group">
                  <label htmlFor={field.name} className="label">
                    <span className="label-icon">{field.icon}</span>
                    <span>{field.label}</span>
                    <span className="unit">{field.unit}</span>
                  </label>
                  <input
                    type="number"
                    id={field.name}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    required
                    min={field.min}
                    max={field.max}
                    step={field.step}
                    className="input"
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                  />
                </div>
              ))}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`submit-button ${loading ? 'loading' : ''}`}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Analyzing Conditions...
                </>
              ) : (
                <>
                  <span className="button-icon">🌱</span>
                  Get Crop Recommendation
                </>
              )}
            </button>
          </form>

          {/* Prediction Result */}
          {prediction && (
            <div className="prediction-result">
              <div className="result-card">
                <div className="result-icon-circle">
                  <span className="result-icon">🌱</span>
                </div>
                <h3 className="result-title">Recommended Crop</h3>
                <p className="result-crop">{prediction}</p>
                <p className="result-description">
                  Based on your soil and environmental conditions
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="footer">
          <p>Powered by machine learning for accurate crop recommendations</p>
        </div>
      </div>
    </div>
  );
}

export default App;