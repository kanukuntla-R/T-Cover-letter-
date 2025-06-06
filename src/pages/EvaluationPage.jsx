import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import NavigationButtons from '../components/NavigationButtons';
import { useEvaluation } from '../context/EvaluationContext';

const EvaluationPage = () => {
  const { evaluation } = useEvaluation();
  const navigate = useNavigate();
  const [checkedItems, setCheckedItems] = useState({});
  const [verdict, setVerdict] = useState('Pending');

  useEffect(() => {
    if (!evaluation || !evaluation.requirements || !evaluation.matches) {
      navigate('/');
      return;
    }

    const initialChecked = {};
    evaluation.requirements.forEach((req) => {
      initialChecked[req] = false;
    });
    setCheckedItems(initialChecked);
  }, [evaluation, navigate]);

  if (!evaluation) {
    return <div className="p-8 text-center">Loading evaluation data...</div>;
  }

  const { requirements, matches, applicant_id: applicantId } = evaluation;
  const metCount = Object.values(checkedItems).filter(Boolean).length;

  const handleCheckboxChange = (req) => {
    setCheckedItems((prev) => ({
      ...prev,
      [req]: !prev[req],
    }));
  };

  const submitDecision = async (decision) => {
    try {
      const res = await fetch(`/decision/${applicantId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ decision }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail || 'Decision update failed');
      }

      setVerdict(decision);
      toast.success(`Applicant ${decision}`);
    } catch (error) {
      console.error('Decision error:', error);
      toast.error(error.message || 'Failed to submit decision');
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto font-sans text-gray-800">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Candidate Evaluation</h1>
        <p className="text-lg text-gray-500">Applicant ID: {applicantId}</p>
      </header>

      <h2 className="text-xl font-semibold mb-4">Requirements</h2>
      <table className="w-full border rounded-lg overflow-hidden mb-8">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-left px-4 py-2">Job Requirements</th>
            <th className="text-left px-4 py-2">Candidate Responses</th>
            <th className="text-center px-4 py-2">Met?</th>
          </tr>
        </thead>
        <tbody>
          {requirements.map((req) => (
            <tr key={`requirement-${req}`} className="border-t">
              <td className="px-4 py-3 font-medium">{req}</td>
              <td className="px-4 py-3">{matches[req]}</td>
              <td className="px-4 py-3 text-center">
                <input
                  type="checkbox"
                  checked={checkedItems[req] || false}
                  onChange={() => handleCheckboxChange(req)}
                  className="w-5 h-5"
                  aria-label={`Mark requirement "${req}" as met`}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mb-6">
        <h3 className="font-semibold text-lg mb-2">Score & Decision</h3>
        <p className="text-sm text-gray-600 mb-1">Status: {verdict}</p>
        <div className="relative w-full h-2 bg-gray-200 rounded-full mb-2">
          <div
            className="absolute top-0 left-0 h-full bg-yellow-400 rounded-full transition-all duration-300"
            style={{ width: `${(metCount / requirements.length) * 100}%` }}
          ></div>
        </div>
        <p className="text-right text-sm text-gray-600">
          {metCount}/{requirements.length}
        </p>

        <div className="flex gap-3 mt-4">
          <button
            onClick={() => submitDecision('Accepted')}
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-4 rounded"
          >
            Accept Applicant
          </button>
          <button
            onClick={() => submitDecision('Rejected')}
            className="bg-gray-100 hover:bg-gray-200 text-black font-semibold py-2 px-4 rounded"
          >
            Reject
          </button>
        </div>
      </div>

      <NavigationButtons />
    </div>
  );
};

export default EvaluationPage;
