import React, { useState, useEffect, useRef } from 'react';

const Dropdown = ({ options, selected, onChange }) => {
     const [isOpen, setIsOpen] = useState(false);
     const dropdownRef = useRef(null);

     const handleSelection = (value) => {
          onChange(value);
          setIsOpen(false);
     };

     const handleClickOutside = (event) => {
          if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
               setIsOpen(false);
          }
     };

     useEffect(() => {
          document.addEventListener('mousedown', handleClickOutside);
          return () => {
               document.removeEventListener('mousedown', handleClickOutside);
          };
     }, []);

     return (
          <div className="relative inline-block text-left w-48" ref={dropdownRef}>
               <div>
                    <button
                         type="button"
                         className="inline-flex justify-between w-full px-4 py-2 bg-blue-600 text-white rounded-md focus:outline-none"
                         onClick={() => setIsOpen(!isOpen)}
                    >
                         {selected}
                         <svg
                              className="w-5 h-5 ml-2 -mr-1"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                         >
                              <path
                                   fillRule="evenodd"
                                   d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                   clipRule="evenodd"
                              />
                         </svg>
                    </button>
               </div>
               {isOpen && (
                    <div className="absolute right-0 w-full mt-2 bg-white border border-gray-200 rounded-md shadow-lg">
                         <div className="py-1">
                              {options.map((option) => (
                                   <button
                                        key={option.value}
                                        onClick={() => handleSelection(option.label)}
                                        className="block px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left"
                                   >
                                        {option.label}
                                   </button>
                              ))}
                         </div>
                    </div>
               )}
          </div>
     );
};

export default Dropdown;
