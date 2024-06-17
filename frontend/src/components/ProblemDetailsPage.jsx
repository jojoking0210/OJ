import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import AceEditor from 'react-ace';
import 'brace/mode/javascript';
import 'brace/theme/monokai';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-monokai';

import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism.css';
import '../App.css';
import NavBar from './NavBar';

const ProblemDetailsPage = () => {
  const { problemId } = useParams();
  const [problem, setProblem] = useState(null);
  const [testCases, setTestCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTestCases, setSelectedTestCases] = useState([]);
  const [leftWidth, setLeftWidth] = useState(50); // Default width percentage for the left pane
  const [code, setCode] = useState(`
  #include <bits/stdc++.h> 
  using namespace std;

  // Define the main function
  int main() { 

     cout<<"Hello World!"<<endl;

      return 0; 
  }
  `);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [problem_Id, setProblemId] = useState('');
  const handleRun = async () => {
    const payload = {
      language: 'cpp',
      code,
      input
    };

    try {
      const { data } = await axios.post('http://localhost:5050/run', payload);
      console.log(data);
      setOutput(data.output); 
    } catch (error) {
      console.log(error.response);
    }
  }

  const [verdict, setVerdict] = useState('');
  const handleSubmit = async () => {
      const payload = {
          problemId, // Assuming problemId is available in the component's state or props
          language: 'cpp',
          solution: code,
          input // Ensure input is provided or handled correctly in your component
      };
  
      try {
        // Retrieve the token from local storage or a similar place
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Token not found');
        }

        const { data } = await axios.post('http://localhost:5050/submit', payload, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        console.log("Response Data:", data);

        if (data && data.verdict) {
            setVerdict(data.verdict);
            setOutput(data.verdict); // Assuming setOutput is a state function to display the output
        } else {
            console.error("Invalid response data:", data);
            setOutput("Error: Invalid response from server");
        }
    } catch (error) {
        console.error("Error submitting code:", error);
        setOutput("Error: Failed to submit code");
    }
  };

  
  const [currentUser, setCurrentUser] = useState(null);
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }

        const response = await axios.get('http://localhost:5050/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCurrentUser(response.data.user);
      } catch (error) {
        console.error('Failed to fetch current user:', error);
      }
    };
  
    fetchCurrentUser();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5050/api/auth/logout', {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      localStorage.removeItem('token');
      setCurrentUser(null);
      navigate('/');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };


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

  const toggleTestCaseSelection = (id) => {
    setSelectedTestCases(prevState => {
      if (prevState.includes(id)) {
        return prevState.filter(tcId => tcId !== id);
      } else {
        return [...prevState, id];
      }
    });
  };
  

  const handleMouseDown = (e) => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e) => {
    const newWidth = (e.clientX / window.innerWidth) * 100;
    setLeftWidth(newWidth);
  };

  const handleMouseUp = () => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="flex flex-col h-screen">
    <NavBar user={currentUser} onLogout={handleLogout} />
    <div className="flex-1 flex">
  {/* Left Pane */}
  <div className="overflow-auto p-4" style={{ width: `${leftWidth}%` }}>
    {problem ? (
      <>
        <h2 className="text-2xl font-bold mb-4">{problem.name}</h2>
        <p className="text-base font-medium text-gray-700 mb-4" style={{ lineHeight: '1.5' }}>
          {problem.description}
        </p>

        <h3 className="text-xl font-bold mb-2">Test Cases</h3>
        <ul className="list-disc list-inside">
          {testCases.map((testCase) => (
            <li key={testCase._id} className="mb-2">
              <strong>Input:</strong> <pre className="bg-gray-100 p-2 rounded">{testCase.input}</pre>
              <strong>Output:</strong> <pre className="bg-gray-100 p-2 rounded">{testCase.output}</pre>
            </li>
          ))}
        </ul>

        <h3 className="text-xl font-bold mb-2">Constraints</h3>
        <p className="mb-4">{problem.constraints}</p>

        <h3 className="text-l font-bold mb-2">Time Limit: 1s</h3>
        <p className="mb-4">{problem.constraints}</p>

        <h3 className="text-l font-bold mb-2">Memory Limit: 100Mb</h3>
        <p className="mb-4">{problem.constraints}</p>
      </>
    ) : (
      <p>No problem data available</p>
    )}
  </div>

  {/* Divider */}
  <div
    className="w-1 bg-gray-300 cursor-ew-resize"
    onMouseDown={handleMouseDown}
  ></div>

  {/* Right Pane */}
  <div className="flex-1 p-4" style={{ width: `${100 - leftWidth}%` }}>
    <h1 className="text-3xl font-bold mb-4">Code Editor</h1>
    <select className="select-box border border-gray-300 rounded-lg py-1.5 px-4 mb-4 focus:outline-none focus:border-indigo-500">
      <option value="cpp">C++</option>
      <option value="c">C</option>
      <option value="py">Python</option>
      <option value="java">Java</option>
    </select>

    <div className="bg-gray-100 shadow-md w-full max-w-lg mb-4" style={{ height: '300px', overflowY: 'auto' }}>
      <AceEditor
        mode="cpp"
        theme="monokai"
        name="codeEditor"
        value={code}
        onChange={setCode}
        fontSize={15}
        width="100%"
        height="100%"
        editorProps={{ $blockScrolling: true }}
      />
    </div>

    <div className="flex justify-end space-x-4">
      {/* Run button */}
      <button onClick={handleRun} type="button" className="w-full text-center bg-gradient-to-br from-pink-500 to-orange-400 hover:from-pink-600 hover:to-orange-500 focus:outline-none text-white font-medium rounded-lg text-sm px-5 py-2.5">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 inline-block align-middle me-2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z" />
        </svg>
        Run
        </button>

        {/* Submit button */}
        <button onClick={handleSubmit} className="bg-green-500 text-white px-4 py-3 rounded">
          Submit
        </button>
      </div>

      {/* Input and Output */}
      <div className="flex justify-between mt-4">
        <div className="w-1/2 pr-2">
          <h2 className="text-lg font-semibold mb-2">Input</h2>
          <textarea
            rows="5"
            value={input}
            placeholder="Input"
            onChange={(e) => setInput(e.target.value)}
            className="border border-gray-300 rounded-sm py-1.5 px-4 mb-1 focus:outline-none focus:border-indigo-500 resize-none w-full"
            style={{ minHeight: '100px' }}
          ></textarea>
        </div>

        <div className="w-1/2 pl-2">
          <h2 className="text-lg font-semibold mb-2">Output</h2>
          <div className="bg-gray-100 rounded-sm shadow-md p-4" style={{ minHeight: '100px' }}>
            <pre style={{ fontFamily: '"Fira code", "Fira Mono", monospace', fontSize: 12 }}>{output}</pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
);
};

export default ProblemDetailsPage;




{/* { 
          <AceEditor
            mode="cpp" // Change this to the mode you need
            theme="monokai"
            name="codeEditor"
            value={code}
            onValueChange={code => setCode(code)}
            fontSize={14}
            showPrintMargin={true}
            showGutter={true}
            highlightActiveLine={true}
            setOptions={{
              enableBasicAutocompletion: true,
              enableLiveAutocompletion: true,
              enableSnippets: true,
              showLineNumbers: true,
              tabSize: 2,
            }}

            className="flex-grow border rounded"
            style={{ width: '100%', height: 'calc(100% - 50px)' }} // Adjusting height for buttons
          />  
          }  */}



          
        {/* <div className="bg-gray-100 shadow-md w-full max-w-lg mb-4" style={{ height: '300px', overflowY: 'auto' }}>
        <Editor
            value={code}
            onValueChange={code => setCode(code)}
            highlight={code => highlight(code, languages.js)}
            padding={5}
            style={{
              fontFamily: '"Fira code", "Fira Mono", monospace',
              fontSize: 15,
              outline: 'none',
              border: 'none',
              backgroundColor: '#f7fafc',
              height: '100%',
              overflowY: 'auto'
            }}
          />

        </div> */}