import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import CallbackPage from './pages/Callback';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>GitHub Import Test</h1>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/callback" element={<CallbackPage />} />
            <Route path="/" element={<Login />} />
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App; 