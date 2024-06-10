// src/App.jsx

import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import Home from './pages/Home';
import Register from './components/Register';
import Login from './components/login'; // Ensure the file name matches the case
import ProblemPage from './components/ProblemPage';
import ProblemDetailsPage from './components/ProblemDetailsPage';
import ManageProblems from './components/ManageProblems';
import TestCase from './components/testcases'; // Ensure the file name matches the case
import HomeButton from './components/HomeButton';
import ProfilePage from './components/ProfilePage';
import NavBar from './components/NavBar';

function App() {
  const [user, setUser] = useState(null);
    useEffect(() => {
      const fetchUser = async () => {
        const token = localStorage.getItem('token');
        if (token) {
          try {
            const res = await axios.get('/api/auth/me', {
              headers: { Authorization: token }
            });
            setUser(res.data.user);
          } catch (err) {
            console.error(err);
          }
        }
      };
      fetchUser();
    }, []);

    const handleLogout = () => {
      localStorage.removeItem('token');
      setUser(null);
    };
  return (
    <BrowserRouter>
      <NavBar user={user} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/problems" element={<ProblemPage />} />
        {/* <Route 
          path="/ManageProblems" 
          element={user && user.role === 'admin' ? <ManageProblems /> : <Navigate to="/login" />} 
        /> */}
        <Route path="/ManageProblems" element={<ManageProblems />}/>
        <Route path="/testcases/:problemId" element={<TestCase />} />
        <Route path="/problems/:problemId" element={<ProblemDetailsPage />} />
        <Route path="/users/:id/profile" element={<ProfilePage/>} />
      </Routes>
    </BrowserRouter>
  );
}

// function App() {
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const fetchUser = async () => {
//       const token = localStorage.getItem('token');
//       if (token) {
//         try {
//           const res = await axios.get('/api/auth/me', {
//             headers: { Authorization: token }
//           });
//           setUser(res.data.user);
//         } catch (err) {
//           console.error(err);
//         }
//       }
//     };
//     fetchUser();
//   }, []);


export default App;
