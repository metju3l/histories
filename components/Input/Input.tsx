import React from 'react';

const Input: React.FC<any> = (props) => {
  return (
    <input
      {...props}
      className="w-full h-10 px-3 mt-2 mb-1 leading-tight text-gray-700 border rounded-lg shadow appearance-none focus:outline-none focus:shadow-outline"
    />
  );
};
export default Input;
