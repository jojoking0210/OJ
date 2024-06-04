import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import HomeButton from './HomeButton';

const Problems = () => {
  const [problems, setProblems] = useState([]);
  const [filteredProblems, setFilteredProblems] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    tag: '', // Added 'tag' field to formData
    difficulty: 'easy',
  });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');

  useEffect(() => {
    fetchProblems();
  }, []);

  useEffect(() => {
    filterProblems();
  }, [problems, selectedDifficulty]);

  const fetchProblems = async () => {
    try {
      const response = await axios.get('http://localhost:5050/problems');
      setProblems(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await axios.put(`http://localhost:5050/problems/${editingId}`, formData);
        setMessage('Problem updated successfully!');
      } else {
        await axios.post('http://localhost:5050/problems', formData);
        setMessage('Problem added successfully!');
      }
      setFormData({ name: '', description: '', tag: '', difficulty: 'easy' }); // Reset 'tag' to empty string after submission
      setEditingId(null);
      fetchProblems();
    } catch (error) {
      console.error(error);
      setMessage('An error occurred. Please try again.');
    }
  };

  const handleEdit = (problem) => {
    setFormData({
      name: problem.name,
      description: problem.description,
      tag: problem.tag,
      difficulty: problem.difficulty,
    });
    setEditingId(problem._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5050/problems/${id}`);
      setMessage('Problem deleted successfully!');
      fetchProblems();
    } catch (error) {
      console.error(error);
      setMessage('An error occurred. Please try again.');
    }
  };

  const handleDifficultyChange = (e) => {
    setSelectedDifficulty(e.target.value);
  };

  const filterProblems = () => {
    if (selectedDifficulty === 'all') {
      setFilteredProblems(problems);
    } else {
      setFilteredProblems(problems.filter(problem => problem.difficulty === selectedDifficulty));
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <header className="bg-blue-500 w-full py-4 text-white text-center">
        <div className="container mx-auto">
          <div className="text-3xl font-bold">
            <Link to="/">Online Judge</Link>
          </div>
        </div>
      </header>
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Problems</h2>
        {message && <p className="mb-4 text-center text-green-600">{message}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="name">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="tag">
              Tag
            </label>
            <input
              type="text"
              id="tag"
              name="tag"
              value={formData.tag}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="difficulty">
              Difficulty
            </label>
            <select
              id="difficulty"
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
            {editingId ? 'Update Problem' : 'Add Problem'}
          </button>
        </form>
      </div>

      <div className="mt-8 w-full max-w-md">
        <h3 className="text-xl font-bold mb-4 text-center">Existing Problems</h3>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="difficulty-filter">
            Filter by Difficulty
          </label>
          <select
            id="difficulty-filter"
            value={selectedDifficulty}
            onChange={handleDifficultyChange}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="all">All</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
        <ul>
          {filteredProblems.map((problem) => (
            <li key={problem._id} className="bg-white p-4 mb-2 rounded shadow-md flex justify-between items-center">
              <div>
                <h4 className="text-lg font-bold">{problem.name}</h4>
                <p>{problem.description}</p>
                <p className={`inline-block px-2 py-1 rounded ${
                  problem.difficulty === 'easy' ? 'bg-green-200' : 
                  problem.difficulty === 'medium' ? 'bg-yellow-200' : 'bg-red-200'
                }`}>
                  {problem.difficulty}
                </p>
              </div>
              <div>
                <button
                  onClick={() => handleEdit(problem)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(problem._id)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
                <Link
                  to={`/testcases/${problem._id}`}
                  className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                >
                  Manage Test Cases
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Problems;
