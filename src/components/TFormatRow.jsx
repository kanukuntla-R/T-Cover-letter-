import React from 'react';

const TFormatRow = ({ requirement, response, checked, onCheck, disabled = false }) => (
  <div
    className={`p-4 rounded-lg border transition-all ${
      checked ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-white hover:shadow-md'
    }`}
  >
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <h3 className="text-sm font-medium text-gray-700 mb-2">{requirement}</h3>
        <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded border border-gray-100">
          {response || '— No relevant content found —'}
        </div>
      </div>
      <div className="ml-3 flex items-start">
        <input
          type="checkbox"
          checked={checked}
          onChange={onCheck}
          disabled={disabled}
          className={`h-5 w-5 rounded border-gray-300 ${
            checked ? 'text-yellow-500' : 'text-gray-400'
          } focus:ring-yellow-400 mt-1 cursor-pointer ${
            disabled ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          aria-label={checked ? 'Verified' : 'Mark as verified'}
        />
      </div>
    </div>
  </div>
);

export default TFormatRow;
