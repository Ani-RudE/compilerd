import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Dropdown from './Dropdown'; // Import the new Dropdown component
import '../App.css';
import { FaTrash, FaCheck } from 'react-icons/fa'; // Import the delete and check icons

const Body = () => {
     const [files, setFiles] = useState([{ name: 'File 1', content: '', language: 'python' }]);
     const [currentFileIndex, setCurrentFileIndex] = useState(0);
     const [output, setOutput] = useState('');
     const [newFileName, setNewFileName] = useState('');
     const [isAddingFile, setIsAddingFile] = useState(false);
     const inputRef = useRef(null);

     const handleCodeChange = (e) => {
          const updatedFiles = [...files];
          updatedFiles[currentFileIndex].content = e.target.value;
          setFiles(updatedFiles);
     };

     const handleKeyDown = (e) => {
          if (e.key === 'Tab') {
               e.preventDefault();
               const textarea = e.target;
               const start = textarea.selectionStart;
               const end = textarea.selectionEnd;
               const newValue = files[currentFileIndex].content.substring(0, start) + '   ' + files[currentFileIndex].content.substring(end);

               const updatedFiles = [...files];
               updatedFiles[currentFileIndex].content = newValue;
               setFiles(updatedFiles);

               setTimeout(() => {
                    textarea.selectionStart = textarea.selectionEnd = start + 3;
               }, 0);
          }
     };

     const runCode = async () => {
          const payload = {
               language: files[currentFileIndex].language,
               script: files[currentFileIndex].content
          };
          console.log(payload);
          setOutput(''); // Clear the output while waiting for the response

          try {
               const response = await axios.post('http://localhost:3000/api/execute/', payload);
               setOutput(response.data.output);
          } catch (error) {
               console.error('Error executing code:', error);
          }
     };

     const handleLanguageChange = (value) => {
          const updatedFiles = [...files];
          updatedFiles[currentFileIndex].language = value;
          setFiles(updatedFiles);
     };

     const addNewFile = () => {
          setIsAddingFile(true);
          setNewFileName('');
     };

     const confirmNewFileName = () => {
          if (newFileName.trim()) {
               setFiles([...files, { name: newFileName, content: '', language: 'python' }]);
               setCurrentFileIndex(files.length);
          }
          setIsAddingFile(false);
     };

     const handleClickOutside = (event) => {
          if (inputRef.current && !inputRef.current.contains(event.target)) {
               confirmNewFileName();
          }
     };

     useEffect(() => {
          document.addEventListener('mousedown', handleClickOutside);
          return () => {
               document.removeEventListener('mousedown', handleClickOutside);
          };
     }, []);

     const switchFile = (index) => {
          setCurrentFileIndex(index);
     };

     const deleteFile = (index) => {
          if (files.length > 1) {
               const updatedFiles = files.filter((file, i) => i !== index);
               setFiles(updatedFiles);
               setCurrentFileIndex(0); // Set to the first file or handle appropriately
          } else {
               alert('Cannot delete the last file.');
          }
     };

     const languageOptions = [
          { value: 'c', label: 'C' },
          { value: 'cpp', label: 'C++' },
          { value: 'csharp', label: 'C#' },
          { value: 'python', label: 'Python' },
          { value: 'java', label: 'Java' },
          { value: 'nodejs', label: 'JavaScript' },
          { value: 'ruby', label: 'Ruby' },
          { value: 'promptv1', label: 'PromptV1' },
          { value: 'promptv2', label: 'PromptV2' },
          { value: 'multifile', label: 'Multifile' },
          { value: 'sqlite3', label: 'SQLite3' },
          { value: 'r', label: 'R' },
          { value: 'perl', label: 'Perl' }
     ];

     return (
          <div className="flex flex-col items-center w-full h-[95vh] pb-4 bg-gray-900">
               <div className="w-full flex justify-center items-center mb-2">
                    <h1 className="text-white font-cursive text-4xl">Compilerd</h1>
               </div>
               <div className="w-full border-t border-gray-600"></div>
               <div className="flex flex-row items-start w-full h-full">
                    <div className="flex flex-col w-1/6 h-full p-4 border-r border-gray-600">
                         <button
                              onClick={addNewFile}
                              className="mb-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300"
                         >
                              Add New File
                         </button>
                         {files.map((file, index) => (
                              <div key={index} className="mb-2 flex items-center">
                                   <button
                                        onClick={() => switchFile(index)}
                                        className={`flex-grow px-4 py-2 text-left rounded-md ${index === currentFileIndex ? 'bg-blue-500 text-white' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
                                   >
                                        {file.name}
                                   </button>
                                   <button
                                        onClick={() => deleteFile(index)}
                                        className="ml-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300 flex items-center justify-center"
                                   >
                                        <FaTrash />
                                   </button>
                              </div>
                         ))}
                         {isAddingFile && (
                              <div className="mb-2 flex items-center" ref={inputRef}>
                                   <input
                                        type="text"
                                        value={newFileName}
                                        onChange={(e) => setNewFileName(e.target.value)}
                                        onKeyDown={(e) => { if (e.key === 'Enter') confirmNewFileName(); }}
                                        placeholder="Enter file name..."
                                        className="flex-grow px-4 py-2 text-left rounded-md bg-gray-700 text-white border border-gray-600"
                                   />
                                   <button
                                        onClick={confirmNewFileName}
                                        className="ml-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300 flex items-center justify-center"
                                   >
                                        <FaCheck />
                                   </button>
                              </div>
                         )}
                         {isAddingFile && (
                              <div className="flex items-center mt-2">
                                   <span className="text-white text-sm">Press enter to save name</span>
                              </div>
                         )}
                    </div>
                    <div className="flex flex-col items-start w-3/6 h-full p-4 border-r border-gray-600 bg-gray-800">
                         <div className="flex justify-between w-full mb-2">
                              <Dropdown
                                   options={languageOptions}
                                   selected={files[currentFileIndex].language}
                                   onChange={(value) => handleLanguageChange(value)}
                              />
                              <button
                                   onClick={runCode}
                                   className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                              >
                                   Run Code
                              </button>
                         </div>
                         <textarea
                              value={files[currentFileIndex].content}
                              onChange={handleCodeChange}
                              onKeyDown={handleKeyDown}
                              placeholder="Write your code here..."
                              className="w-full h-full p-2 bg-gray-900 text-white border border-gray-600 rounded-md font-mono"
                         />
                    </div>
                    <div className="flex flex-col w-2/6 h-full p-4 bg-gray-800">
                         <h3 className="text-lg font-semibold text-white mb-2 mt-3">Output:</h3>
                         <pre className="w-full h-full p-2 bg-gray-900 text-white border border-gray-600 rounded-md overflow-auto">
                              {output}
                         </pre>
                    </div>
               </div>
          </div>
     );
};

export default Body;