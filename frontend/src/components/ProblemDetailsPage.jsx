import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ProblemDetailsPage = () => {
  const { problemId } = useParams();
  const [problem, setProblem] = useState(null);
  const [testCases, setTestCases] = useState([]);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProblemDetails();
    fetchTestCases();
  }, [problemId]);

  const fetchProblemDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:5050/problems/${problemId}`);
      setProblem(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching problem details:", error);
      setError("Error fetching problem details");
      setLoading(false);
    }
  };

  const fetchTestCases = async () => {
    try {
      const response = await axios.get(`http://localhost:5050/problems/${problemId}/testcases`);
      setTestCases(response.data);
    } catch (error) {
      console.error("Error fetching test cases:", error);
      setError("Error fetching test cases");
    }
  };

  const handleCodeChange = (e) => {
    setCode(e.target.value);
  };

  const handleRun = () => {
    // Add logic to run the code
  };

  const handleSubmit = () => {
    // Add logic to submit the code
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="min-h-screen flex relative">
      <div className="w-1/2 p-4">
        {problem ? (
          <>
            <h2 className="text-2xl font-bold mb-4">{problem.name}</h2>
            <p className="mb-4">{problem.description}</p>
            <h3 className="text-xl font-bold mb-2">Test Cases</h3>
            <ul className="list-disc list-inside">
              {testCases.map((testCase) => (
                <li key={testCase._id} className="mb-2">
                  <strong>Input:</strong> {testCase.input} | <strong>Output:</strong> {testCase.output}
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p>No problem data available</p>
        )}
      </div>
      <div className="w-1/2 p-4">
        <h3 className="text-xl font-bold mb-2">Code Editor</h3>
        <textarea
          value={code}
          onChange={handleCodeChange}
          className="w-full h-full border rounded p-2"
          placeholder="Write your code here"
        />
        <div className="absolute bottom-4 right-4">
          <button onClick={handleRun} className="bg-blue-500 text-white px-4 py-2 rounded mr-4">Run</button>
          <button onClick={handleSubmit} className="bg-green-500 text-white px-4 py-2 rounded">Submit</button>
        </div>
      </div>
    </div>
  );
};

export default ProblemDetailsPage;
