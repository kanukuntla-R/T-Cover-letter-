import React, { useEffect, useState } from 'react';
import NavigationButtons from '../components/NavigationButtons';

const EvaluationPage = () => {
  const [requirements, setRequirements] = useState([]);
  const [matches, setMatches] = useState({});
  const [checkedItems, setCheckedItems] = useState({});
  const [verdict, setVerdict] = useState('Pending');

  useEffect(() => {
    const sampleRequirements = [
      'Proficiency in Java',
      'Experience with Spring Framework',
      'Strong problem-solving skills',
      'Excellent communication skills',
      "Bachelor's degree in Computer Science",
    ];
    const sampleMatches = {
      'Proficiency in Java': 'Led debugging for major outages at XYZ Inc.',
      'Experience with Spring Framework':
        'Developed and maintained Java-based applications using Spring Framework.',
      'Strong problem-solving skills': 'Implemented new features and resolved critical issues.',
      'Excellent communication skills':
        'Collaborated with cross-functional teams to deliver projects on time and within budget.',
      "Bachelor's degree in Computer Science":
        'Bachelor of Science in Computer Science | University of Technology | 2014 - 2018',
    };

    setRequirements(sampleRequirements);
    setMatches(sampleMatches);

    // Initialize all checkboxes as unchecked
    const initialChecked = {};
    sampleRequirements.forEach((req) => {
      initialChecked[req] = false;
    });
    setCheckedItems(initialChecked);
  }, []);

  const handleCheckboxChange = (req) => {
    setCheckedItems((prev) => ({
      ...prev,
      [req]: !prev[req],
    }));
  };

  const metCount = Object.values(checkedItems).filter(Boolean).length;

  const handleAccept = () => {
    setVerdict('Accepted');
  };

  const handleReject = () => {
    setVerdict('Rejected');
  };

  return (
    <div className="p-8 max-w-5xl mx-auto font-sans text-gray-800">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Candidate: Alex Johnson</h1>
        <p className="text-lg text-gray-500">Position: Software Engineer</p>
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
        <p className="text-sm text-gray-600 mb-1">{verdict}</p>
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
            onClick={handleAccept}
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-4 rounded"
          >
            Accept Applicant
          </button>
          <button
            onClick={handleReject}
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
