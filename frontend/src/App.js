import React, { useState } from 'react';
import axios from 'axios';
import './styles.css';

function App() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:5001";

  const handleFileChange = (e) => {
    setSelectedFiles(Array.from(e.target.files));
    setResult(null);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedFiles.length !== 4) {
      alert('Please upload exactly 4 videos.');
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    const formData = new FormData();
    selectedFiles.forEach(file => formData.append('videos', file));

    try {
      const response = await axios.post(
        `${backendUrl}/upload`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      setResult(response.data);
    } catch (err) {
      console.error(err);
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>🚗 AI Based Traffic Management</h1>
      <hr />

      <div className='main-container'>
        
        {/* LEFT PANEL */}
        <div className='left'>
          <section className="hero">
            <h2>🚦 Optimize Traffic Flow with AI 🤖</h2>
            <p>
              Smart system that analyzes traffic videos and generates optimal signal timings 
              to reduce congestion.
            </p>
          </section>

          <section className="upload">
            <h2>📹 Upload Traffic Videos</h2>

            <form onSubmit={handleSubmit}>
              <input 
                type="file" 
                multiple 
                accept="video/*" 
                onChange={handleFileChange} 
              />
              <br /><br />

              <button type="submit" disabled={loading}>
                {loading ? "Processing..." : "Run Model"}
              </button>
            </form>
          </section>
        </div>

        {/* RIGHT PANEL */}
        <section className="result">
          
          {!loading && !result && !error && (
            <p className='placeholder'>
              Results will appear here <br />
              <span>🚦🚦🚦🚦</span>
            </p>
          )}

          {loading && (
            <p className='loader'>
              ⏳ Processing videos... please wait
            </p>
          )}

          {error && (
            <div className="error">
              <h3>❌ Error</h3>
              <p>{error}</p>
            </div>
          )}

          {result && !error && (
            <>
              <h2>✅ Optimization Results</h2>

              {/* 🚗 Car Counts */}
              {result.cars && (
                <>
                  <h3>🚗 Cars Detected</h3>
                  <ul>
                    <li>North: {result.cars[0]}</li>
                    <li>South: {result.cars[1]}</li>
                    <li>West: {result.cars[2]}</li>
                    <li>East: {result.cars[3]}</li>
                  </ul>
                </>
              )}

              {/* 🚦 Signal Timing */}
              {result.signal && (
                <>
                  <h3>🚦 Signal Timings</h3>
                  <ul>
                    <li>North: {result.signal.north} sec</li>
                    <li>South: {result.signal.south} sec</li>
                    <li>West: {result.signal.west} sec</li>
                    <li>East: {result.signal.east} sec</li>
                  </ul>
                </>
              )}
            </>
          )}

        </section>
      </div>
    </div>
  );
}

export default App;