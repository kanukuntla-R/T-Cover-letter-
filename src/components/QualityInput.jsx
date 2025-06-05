import React from 'react';

const QualityInput = ({ label, value, onChange, id }) => {
  const inputId = id || `quality-input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="mb-4">
      <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        id={inputId}
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        min="0"
        max="10"
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
        aria-describedby={`${inputId}-description`}
      />
      <p id={`${inputId}-description`} className="mt-1 text-sm text-gray-500">
        Rate from 0 to 10
      </p>
    </div>
  );
};

export default QualityInput;
