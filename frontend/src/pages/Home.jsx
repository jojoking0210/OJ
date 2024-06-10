// src/components/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const userId = '6654972540ff18bf4f09999a'; // Replace with the actual logged-in user ID

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <header className="bg-blue-600 w-full py-4 flex justify-between items-center px-4">
        <h1 className="text-white text-3xl font-bold">
          <Link to="/">Online Judge</Link>
        </h1>
        <nav className="space-x-4 flex items-center">
          {/* <Link to="/problems" className="text-white hover:underline">Problems</Link>
          <Link to="/register" className="text-white hover:underline">Register</Link>
          <Link to="/login" className="text-white hover:underline">Login</Link> */}
          <Link to="/ManageProblems" className="text-white hover:underline">Manage Problems</Link>
          <Link to={`/users/${userId}/profile`} className="text-white hover:underline">Profile</Link>
        </nav>
      </header>
      <main className="flex-grow container mx-auto p-4">
        <section className="text-center my-16">
          <h1 className="text-5xl font-bold mb-4">Welcome to Online Judge</h1>
          <p className="text-xl mb-8">Practice coding, prepare for interviews, and get better at problem-solving.</p>
          <p className="text-lg">
            Our online judge platform provides a collection of coding problems across various difficulty levels.
            You can submit your solutions, get instant feedback, and see how you rank against other users.
            Whether you're preparing for coding interviews or just looking to improve your skills, our platform has something for everyone.
          </p>
          <p className="text-lg mt-4">
            Key features of our online judge:
          </p>
          <ul className="list-disc list-inside text-left mx-auto max-w-prose mt-4 text-lg">
            <li>Wide range of problems in different categories and difficulty levels.</li>
            <li>Real-time code evaluation and feedback.</li>
            <li>Detailed statistics and rankings.</li>
            <li>Community discussions and problem solutions.</li>
          </ul>
        </section>
      </main>
      <footer className="bg-blue-600 text-white text-center p-4">
        &copy; 2024 Online Judge. All rights reserved.
      </footer>
    </div>
  );
};

export default Home;
