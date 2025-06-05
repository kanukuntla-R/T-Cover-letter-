import React from 'react';
import { useNavigate } from 'react-router-dom';

const NavigationButtons = ({
  currentApplicantId = '001',
  applicantIds = ['001', '002', '003'],
}) => {
  const navigate = useNavigate();
  const currentIndex = applicantIds.indexOf(currentApplicantId);

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const previousApplicantId = applicantIds[currentIndex - 1];
      navigate(`/evaluate/${previousApplicantId}`);
    }
  };

  const handleNext = () => {
    if (currentIndex < applicantIds.length - 1) {
      const nextApplicantId = applicantIds[currentIndex + 1];
      navigate(`/evaluate/${nextApplicantId}`);
    }
  };

  return (
    <div className="flex justify-between mt-6">
      <button
        onClick={handlePrevious}
        disabled={currentIndex === 0}
        className={`
          text-sm 
          ${
            currentIndex === 0
              ? 'text-gray-300 cursor-not-allowed'
              : 'text-yellow-600 hover:underline'
          }
        `}
      >
        ← Previous Applicant
      </button>

      <button
        onClick={handleNext}
        disabled={currentIndex === applicantIds.length - 1}
        className={`
          text-sm 
          ${
            currentIndex === applicantIds.length - 1
              ? 'text-gray-300 cursor-not-allowed'
              : 'text-yellow-600 hover:underline'
          }
        `}
      >
        Next Applicant →
      </button>
    </div>
  );
};

export default NavigationButtons;
