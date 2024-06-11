// src/components/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import codingBoy from '../assets/hacker-operating-laptop-cartoon-icon-illustration-technology-icon-concept-isolated-flat-cartoon-style.png'; // Make sure to add an image in the assets folder

const Home = () => {
  const userId = '6654972540ff18bf4f09999a'; // Replace with the actual logged-in user ID

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <header className="bg-blue-600 w-full py-4 flex justify-between items-center px-4">
        <h1 className="text-white text-3xl font-bold hover:text-yellow-300 transition duration-300 ease-in-out">
          <Link to="/">Online Judge</Link>
        </h1>
        <nav className="space-x-4 flex items-center">
          <Link to="/ManageProblems" className="text-white hover:text-yellow-300 transition duration-300 ease-in-out">Manage Problems</Link>
          <Link to={`/users/${userId}/profile`} className="text-white hover:text-yellow-300 transition duration-300 ease-in-out">Profile</Link>
        </nav>
      </header>
      <main className="flex-grow container mx-auto p-4 flex flex-col items-center justify-center">
        <section className="text-center my-16">
          <div className="flex flex-col md:flex-row items-center">
            <img src={codingBoy} alt="Coding Boy" className="w-72 h-72 md:w-96 md:h-96 mx-auto md:mx-0 animate-bounce" />
            <div className="md:ml-8">
              <h1 className="text-5xl font-bold mb-4 text-blue-600 animate-pulse">Welcome to Online Judge</h1>
              <p className="text-xl mb-8 text-gray-700">Practice coding, prepare for interviews, and get better at problem-solving.</p>
              <p className="text-lg text-gray-600">
                Our online judge platform provides a collection of coding problems across various difficulty levels.
                You can submit your solutions, get instant feedback, and see how you rank against other users.
                Whether you're preparing for coding interviews or just looking to improve your skills, our platform has something for everyone.
              </p>
              <p className="text-lg mt-4 text-gray-600">
                Key features of our online judge:
              </p>
              <ul className="list-disc list-inside text-left mx-auto max-w-prose mt-4 text-lg text-gray-600">
                <li>Wide range of problems in different categories and difficulty levels.</li>
                <li>Real-time code evaluation and feedback.</li>
                <li>Detailed statistics and rankings.</li>
                <li>Community discussions and problem solutions.</li>
              </ul>
            </div>
          </div>
        </section>
      </main>
      <footer className="bg-blue-600 text-white text-center p-4">
        &copy; 2024 Online Judge. All rights reserved.
      </footer>
    </div>
  );
};

export default Home;