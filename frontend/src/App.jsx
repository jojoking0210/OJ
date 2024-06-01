// src/App.jsx
import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Register from './components/Register';
import Login from './components/login';
import ProblemPage from './components/ProblemPage';
import ProblemDetailsPage from './components/ProblemDetailsPage'; // Import ProblemDetailsPage

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/problems" element={<ProblemPage />} />
        <Route path="/problems/1" element={<ProblemDetailsPage />} /> {/* Add route for ProblemDetailsPage */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
