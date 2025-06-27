import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './MainPage';
import CallbackPage from './CallbackPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Routes>
            <Route path="/callback" element={<CallbackPage />} />
            <Route path="/" element={<MainPage />} />
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;
