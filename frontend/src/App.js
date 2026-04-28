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

  const directions = ['North', 'South', 'West', 'East'];
  const dirIcons = ['↑', '↓', '←', '→'];

  return (
    <div className="app">
      {/* Background grid */}
      <div className="bg-grid"></div>

      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-logo">
          <span className="logo-dot"></span>
          <span className="logo-text">TrafficAI</span>
        </div>
        <div className="nav-badge">YOLOv4 + Genetic Algorithm</div>
      </nav>

      {/* Hero */}
      <header className="hero">
        <div className="hero-tag">Smart Adaptive System</div>
        <h1 className="hero-title">
          AI-Based Traffic<br />
          <span className="hero-accent">Management System</span>
        </h1>
        <p className="hero-sub">
          Real-time vehicle detection meets intelligent signal optimization.
          Upload 4 intersection videos and let the AI do the rest.
        </p>
        <div className="hero-stats">
          <div className="stat"><span>YOLOv4</span><small>Detection</small></div>
          <div className="stat-divider"></div>
          <div className="stat"><span>Genetic Algo</span><small>Optimization</small></div>
          <div className="stat-divider"></div>
          <div className="stat"><span>4-Lane</span><small>Intersection</small></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-grid">

        {/* Upload Panel */}
        <div className="panel upload-panel">
          <div className="panel-header">
            <div className="panel-icon">▲</div>
            <h2>Upload Traffic Videos</h2>
          </div>
          <p className="panel-desc">
            Select exactly <strong>4 videos</strong> — one per lane direction (N, S, W, E).
          </p>

          <form onSubmit={handleSubmit}>
            <label className="file-drop">
              <input
                type="file"
                multiple
                accept="video/*"
                onChange={handleFileChange}
                hidden
              />
              <div className="drop-content">
                <div className="drop-icon">🎥</div>
                <div className="drop-text">
                  {selectedFiles.length > 0
                    ? `${selectedFiles.length} file(s) selected`
                    : 'Click to browse videos'}
                </div>
                <div className="drop-sub">MP4, AVI, MOV supported</div>
              </div>
            </label>

            {selectedFiles.length > 0 && (
              <ul className="file-list">
                {selectedFiles.map((f, i) => (
                  <li key={i}>
                    <span className="file-dir">{directions[i] || `Lane ${i+1}`}</span>
                    <span className="file-name">{f.name}</span>
                  </li>
                ))}
              </ul>
            )}

            <button
              type="submit"
              className={`run-btn ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              {loading ? (
                <><span className="spinner"></span> Analyzing...</>
              ) : (
                'Run Model'
              )}
            </button>
          </form>
        </div>

        {/* Results Panel */}
        <div className="panel result-panel">
          <div className="panel-header">
            <div className="panel-icon">◆</div>
            <h2>Optimization Results</h2>
          </div>

          {!loading && !result && !error && (
            <div className="placeholder">
              <div className="traffic-lights">
                {[0,1,2,3].map(i => (
                  <div key={i} className="tl">
                    <div className="tl-light red"></div>
                    <div className="tl-light yellow"></div>
                    <div className="tl-light green"></div>
                  </div>
                ))}
              </div>
              <p>Upload videos and run the model<br/>to see signal timings</p>
            </div>
          )}

          {loading && (
            <div className="loading-state">
              <div className="pulse-ring"></div>
              <p>Processing video feeds<br/><small>This may take a few minutes...</small></p>
            </div>
          )}

          {error && (
            <div className="error-box">
              <div className="error-icon">✕</div>
              <p>{error}</p>
            </div>
          )}

          {result && !error && (
            <div className="results">

              {result.cars && (
                <div className="result-section">
                  <h3>Vehicles Detected</h3>
                  <div className="cards-grid">
                    {directions.map((dir, i) => (
                      <div className="dir-card" key={dir}>
                        <div className="dir-arrow">{dirIcons[i]}</div>
                        <div className="dir-name">{dir}</div>
                        <div className="dir-count">{result.cars[i]}</div>
                        <div className="dir-label">cars</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {result.signal && (
                <div className="result-section">
                  <h3>Optimized Signal Timings</h3>
                  <div className="timings">
                    {directions.map((dir, i) => {
                      const key = dir.toLowerCase();
                      const val = result.signal[key] || 0;
                      const max = Math.max(...directions.map(d => result.signal[d.toLowerCase()] || 0));
                      const pct = max > 0 ? (val / max) * 100 : 0;
                      return (
                        <div className="timing-row" key={dir}>
                          <span className="timing-dir">{dirIcons[i]} {dir}</span>
                          <div className="timing-bar-wrap">
                            <div className="timing-bar" style={{width: `${pct}%`}}></div>
                          </div>
                          <span className="timing-val">{val}s</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <footer className="footer">
        <p>AI-Based Traffic Management System &nbsp;·&nbsp; YOLOv4 &nbsp;·&nbsp; Genetic Algorithm &nbsp;·&nbsp; OpenCV</p>
      </footer>
    </div>
  );
}

export default App;