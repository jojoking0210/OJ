// src/components/ProblemDetailsPage.jsx
import React, { useState } from 'react';

const ProblemDetailsPage = ({ problem }) => {
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [code, setCode] = useState('');

  const handleLanguageChange = (e) => {
    setSelectedLanguage(e.target.value);
  };

  const handleRun = () => {
    // Implement code execution on sample test cases
    console.log('Running code on sample test cases...');
  };

  const handleSubmit = () => {
    // Implement code execution on all test cases and display verdict
    console.log('Running code on all test cases and displaying verdict...');
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-4">
      <div className="container mx-auto">
        <h2 className="text-2xl font-bold mt-8 mb-4">{problem.name}</h2>
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Description:</h3>
          <div dangerouslySetInnerHTML={{ __html: problem.description }} />
        </div>
        <div className="flex items-center mb-4">
          <h3 className="text-lg font-semibold mr-2">Select Language:</h3>
          <select
            value={selectedLanguage}
            onChange={handleLanguageChange}
            className="border p-2 rounded"
          >
            <option value="javascript">JavaScript</option>
            {/* Add more language options here */}
          </select>
        </div>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full mb-4 h-48 border p-2 rounded"
          style={{ resize: 'vertical' }}
        />
        <div className="flex justify-center">
          <button onClick={handleRun} className="bg-blue-500 text-white px-4 py-2 rounded mr-4">Run</button>
          <button onClick={handleSubmit} className="bg-green-500 text-white px-4 py-2 rounded">Submit</button>
        </div>
      </div>
    </div>
  );
};

export default ProblemDetailsPage;
