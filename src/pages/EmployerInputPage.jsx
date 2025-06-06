import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useEvaluation } from '../context/EvaluationContext'; // ✅ context import

const TFormatConverter = () => {
  const [coverFile, setCoverFile] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [requirements, setRequirements] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const { setEvaluation } = useEvaluation(); // ✅ use context

  const handleConvert = async () => {
    if (!coverFile) {
      toast.error('Please upload a cover letter');
      return;
    }

    if (!requirements.trim()) {
      toast.error('Please enter at least one requirement');
      return;
    }

    const requirementsArr = requirements
      .split('\n')
      .map((r) => r.trim())
      .filter(Boolean);

    if (requirementsArr.length === 0) {
      toast.error('Please enter valid requirements');
      return;
    }

    try {
      setIsLoading(true);

      const formData = new FormData();
      formData.append('cover_letter', coverFile);
      if (resumeFile) formData.append('resume', resumeFile);
      formData.append('requirements', JSON.stringify(requirementsArr));

      const uploadResponse = await fetch('/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Upload failed');
      }

      const { applicant_id: applicantId } = await uploadResponse.json();
      if (!applicantId) throw new Error('No applicant ID received from server');

      localStorage.setItem('jobRequirements', JSON.stringify(requirementsArr));

      // ✅ Now fetch analysis and store matches
      let matches = [];

      try {
        const analyzeRes = await fetch(`/analyze/${applicantId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ requirements: requirementsArr }),
        });

        if (analyzeRes.ok) {
          const analyzeData = await analyzeRes.json();
          matches = analyzeData.matches || [];
        }
      } catch (err) {
        console.error('Analysis failed:', err);
      }

      // ✅ Store in context
      setEvaluation({
        applicant_id: applicantId,
        requirements: requirementsArr,
        matches,
      });

      navigate(`/review/${applicantId}`);
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.message || 'Failed to process files. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF3] flex flex-col items-center px-4 py-10">
      {/* --- UI unchanged --- */}
    </div>
  );
};

export default TFormatConverter;
