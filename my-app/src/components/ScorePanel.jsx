import React from 'react';

const ScorePanel = ({ 
  verifiedCount, 
  totalRequirements, 
  onAccept, 
  onReject 
}) => {
  const verificationPercentage = (verifiedCount / totalRequirements) * 100;

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mt-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            Verification Score
          </h3>
          <div className="flex items-center">
            <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
              <div 
                className="bg-yellow-400 h-2.5 rounded-full" 
                style={{ width: `${verificationPercentage}%` }}
              ></div>
            </div>
            <span className="text-sm font-medium text-gray-500">
              {verifiedCount} of {totalRequirements}
            </span>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between">
        <button 
          onClick={onAccept}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Accept Applicant
        </button>
        <button 
          onClick={onReject}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Reject Applicant
        </button>
      </div>
    </div>
  );
};

export default ScorePanel;