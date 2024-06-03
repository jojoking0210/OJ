// src/components/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [message, setMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5050/login', formData);
      setMessage(response.data.message);

      if (response.data.success) {
        setShowPopup(true);
        setTimeout(() => {
          setShowPopup(false);
          navigate('/problems');
        }, 1000); // Hide popup and redirect after 1 second
      }
    } catch (error) {
      console.error(error);
      setMessage('An error occurred during login. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <header className="bg-blue-600 w-full py-4 text-white text-center">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold">Online Judge</h1>
        </div>
      </header>
      <main className="flex-grow flex flex-col items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
          <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
          {message && <p className="mb-4 text-center text-red-600">{message}</p>}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Email"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Password"
                required
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Sign In
              </button>
              <Link to="/register" className="inline-block align-baseline font-bold text-sm text-blue-600 hover:text-blue-800">
                Register
              </Link>
            </div>
          </form>
        </div>
      </main>
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded shadow-lg">
            <p className="text-center text-green-600">Login successful! Redirecting...</p>
          </div>
        </div>
      )}
      <footer className="bg-blue-600 w-full py-4 text-white text-center">
        <div className="container mx-auto">
          &copy; 2024 Online Judge. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Login;
