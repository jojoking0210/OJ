// src/App.jsx
import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Register from './components/Register';
import Login from './components/login'; // Ensure the file name matches the case
import ProblemPage from './components/ProblemPage';
import ProblemDetailsPage from './components/ProblemDetailsPage';
import ManageProblems from './components/ManageProblems';
import TestCase from './components/testcases'; // Ensure the file name matches the case
import HomeButton from './components/HomeButton';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/problems" element={<ProblemPage />} />
        <Route path="/ManageProblems" element={<ManageProblems />} />
        <Route path="/testcases/:problemId" element={<TestCase />} />
        <Route path="/problems/:problemId" element={<ProblemDetailsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
