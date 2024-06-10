// src/components/NavBar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = ({ user, onLogout }) => {
  return (
    <nav className="bg-blue-500 p-4">
      <ul className="flex space-x-4">
        <li>
          <Link to="/" className="text-white">Home</Link>
        </li>
        <li>
          <Link to="/problems" className="text-white">Problems</Link>
        </li>
        {user && user.role === 'admin' && (
          <li>
            <Link to="/manageProblems" className="text-white">Manage Problems</Link>
          </li>
        )}
        {!user ? (
          <>
            <li>
              <Link to="/login" className="text-white">Login</Link>
            </li>
            <li>
              <Link to="/register" className="text-white">Register</Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to={`/users/${user.id}/profile`} className="text-white">Profile</Link>
            </li>
            <li className="text-white">Logged in as {user.email}</li>
            <li>
              <button onClick={onLogout} className="text-white">Logout</button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default NavBar;
