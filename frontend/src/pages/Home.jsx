import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-blue-600 text-white">
        <div className="container mx-auto flex justify-between items-center p-4">
          <div className="text-2xl font-bold">
            <Link to="/">Online Judge</Link>
          </div>
          <nav className="space-x-4">
            <Link to="/problems" className="hover:underline">Problems</Link>
            <Link to="/register" className="hover:underline">Register</Link>
            <Link to="/login" className="hover:underline">Login</Link>
            <Link to="/ManageProblems" className="hover:underline">ManageProblems</Link>
          </nav>
        </div>
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
