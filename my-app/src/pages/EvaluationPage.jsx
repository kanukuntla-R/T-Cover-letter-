import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import TFormatRow from '../components/TFormatRow';
import ScorePanel from '../components/ScorePanel';
import NavigationButtons from '../components/NavigationButtons';

const mockApplicant = {
  id: '001',
  name: 'Jane Doe',
  requirements: ['Leadership', 'Python', 'UX Design', 'Team Collaboration', 'Problem Solving'],
  responses: [
    'Managed a team of 6 developers for 2 years.',
    'Built Python-based data processing tools.',
    'Worked with designers to implement user-friendly features.',
    'Facilitated team retrospectives and agile ceremonies.',
    'Resolved production bugs and optimized system performance.'
  ]
};

const EvaluationPage = () => {
  const { applicantId = '001' } = useParams();
  const [checked, setChecked] = useState(Array(mockApplicant.requirements.length).fill(false));
  const [status, setStatus] = useState('pending');

  const handleCheckToggle = (index) => {
    const updated = [...checked];
    updated[index] = !updated[index];
    setChecked(updated);
  };

  const verifiedCount = checked.filter(Boolean).length;

  return (
    <div className="min-h-screen bg-white p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold text-yellow-600 mb-2">Reviewing: {mockApplicant.name}</h2>
      <p className="text-gray-600 mb-6">Applicant ID: {applicantId}</p>

      <div className="grid grid-cols-3 gap-4 bg-gray-50 p-4 rounded shadow mb-6">
        {mockApplicant.requirements.map((req, idx) => (
          <TFormatRow
            key={idx}
            requirement={req}
            response={mockApplicant.responses[idx]}
            checked={checked[idx]}
            onCheck={() => handleCheckToggle(idx)}
          />
        ))}
      </div>

      <ScorePanel
        score={verifiedCount}
        total={mockApplicant.requirements.length}
        status={status}
        onAccept={() => setStatus('accepted')}
        onReject={() => setStatus('rejected')}
      />

      <NavigationButtons
        currentApplicantId={applicantId}
        applicantIds={['001', '002', '003']}
      />
    </div>
  );
};

export default EvaluationPage;