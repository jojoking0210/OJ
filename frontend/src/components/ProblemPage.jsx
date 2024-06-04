import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ProblemPage = () => {
  const [problems, setProblems] = useState([]);
  const [filterTag, setFilterTag] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('');

  useEffect(() => {
    fetchProblems();
  }, []);

  // Fetching Problems from Backend
  const fetchProblems = async () => {
    try {
      const response = await axios.get('http://localhost:5050/problems');
      setProblems(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  // Filter problems based on selected tag and difficulty
  const filteredProblems = problems.filter(problem => {
    console.log(`Filtering: Problem difficulty - ${problem.difficulty}, Filter difficulty - ${filterDifficulty}`);
    return (
      (filterTag ? problem.tag === filterTag : true) &&
      (filterDifficulty ? problem.difficulty === filterDifficulty : true)
    );
  });

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-4">
      <header className="bg-blue-600 w-full py-4 text-white text-center mb-8">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold">Online Judge Problems</h1>
        </div>
      </header>
      <div className="container mx-auto">
        <div className="mb-4 flex justify-between">
          {/* Filter by Tag */}
          <div>
            <label className="mr-2">Filter by Tag:</label>
            <select
              value={filterTag}
              onChange={e => setFilterTag(e.target.value)}
              className="border p-2 rounded"
            >
              <option value="">All</option>
              <option value="Array">Array</option>
              <option value="String">String</option>
              <option value="Basic">Basic</option>
            </select>
          </div>
          {/* Filter by Difficulty */}
          <div>
            <label className="mr-2">Filter by Difficulty:</label>
            <select
              value={filterDifficulty}
              onChange={e => setFilterDifficulty(e.target.value)}
              className="border p-2 rounded"
            >
              <option value="">All</option>
              <option value="easy">easy</option>
              <option value="medium">medium</option>
              <option value="hard">hard</option>
            </select>
          </div>
        </div>
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 bg-gray-200 font-bold uppercase text-sm text-gray-600">Problem Name</th>
                <th className="py-2 px-4 bg-gray-200 font-bold uppercase text-sm text-gray-600">Tag</th>
                <th className="py-2 px-4 bg-gray-200 font-bold uppercase text-sm text-gray-600">Difficulty</th>
                <th className="py-2 px-4 bg-gray-200 font-bold uppercase text-sm text-gray-600">Submission %</th>
                <th className="py-2 px-4 bg-gray-200 font-bold uppercase text-sm text-gray-600">Solution</th>
              </tr>
            </thead>
            <tbody>
              {filteredProblems.map((problem, index) => (
                <tr key={index}>
                  <td className="py-2 px-4 border-b">
                    <Link to={`/problems/${problem._id}`} className="text-blue-600 hover:underline">
                      {problem.name}
                    </Link>
                  </td>
                  <td className="py-2 px-4 border-b">{problem.tag}</td>
                  <td className="py-2 px-4 border-b">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                        problem.difficulty === 'easy'
                          ? 'bg-green-200 text-green-800'
                          : problem.difficulty === 'medium'
                          ? 'bg-yellow-200 text-yellow-800'
                          : 'bg-red-200 text-red-800'
                      }`}
                    >
                      {problem.difficulty}
                    </span>
                  </td>
                  <td className="py-2 px-4 border-b">{problem.submissionPercentage}</td>
                  <td className="py-2 px-4 border-b">
                    <a href="#" className="text-blue-600 hover:underline">
                      {problem.solution}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <footer className="bg-blue-600 w-full py-4 text-white text-center mt-auto">
        <div className="container mx-auto">&copy; 2024 Online Judge. All rights reserved.</div>
      </footer>
    </div>
  );
};

export default ProblemPage;
