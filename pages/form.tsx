import React, { useState } from 'react';

const Test = () => {
  const [file, setFile] = useState<any>(null);

  return (
    <>
      <input
        type="file"
        onChange={(e: any) => {
          setFile(e.target.files[0]);
        }}
      />
      <button
        onClick={() => {
          console.log(file);
        }}
      >
        test
      </button>
    </>
  );
};

export default Test;
