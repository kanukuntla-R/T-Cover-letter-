import React from 'react';

const QualityInput = ({ label, value, onChange }) => {
  return (
    <div>
      <label>{label}</label>
      <input 
        type="number" 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        min="0" 
        max="10"
      />
    </div>
  );
};

export default QualityInput;
