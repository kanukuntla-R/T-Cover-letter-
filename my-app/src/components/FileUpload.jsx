import React, { useRef } from 'react';

const FileUpload = ({ onFileUpload }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      onFileUpload(file);
    }
  };

  return (
    <div>
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        style={{ display: 'none' }}
      />
      <button onClick={() => fileInputRef.current.click()}>
        Upload Resume
      </button>
    </div>
  );
};

export default FileUpload;
