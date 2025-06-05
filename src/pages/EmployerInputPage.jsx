import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CloudArrowUpIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

const TFormatConverter = () => {
  const [coverFile, setCoverFile] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [requirements, setRequirements] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState('dashboard');

  const handleNavClick = (navItem) => (e) => {
    e.preventDefault();
    setActiveNav(navItem);
  };

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

      // Create FormData for file upload
      const formData = new FormData();
      formData.append('cover_letter', coverFile);
      if (resumeFile) {
        formData.append('resume', resumeFile);
      }
      formData.append('requirements', JSON.stringify(requirementsArr));

      // Upload files and get applicant ID
      const uploadResponse = await fetch('/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Upload failed');
      }

      const { applicant_id: applicantId } = await uploadResponse.json();

      if (!applicantId) {
        throw new Error('No applicant ID received from server');
      }

      // Save requirements to localStorage as fallback
      localStorage.setItem('jobRequirements', JSON.stringify(requirementsArr));

      // Kick off analysis in the background
      try {
        await fetch(`/analyze/${applicantId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            requirements: requirementsArr,
            // Include any additional data needed for analysis
          }),
        });
      } catch (analysisError) {
        console.error('Background analysis failed:', analysisError);
        // Continue with navigation even if analysis fails
      }

      // Navigate to review page with requirements in URL
      const requirementsParam = encodeURIComponent(JSON.stringify(requirementsArr));
      navigate(`/review/${applicantId}?requirements=${requirementsParam}`);
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.message || 'Failed to process files. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF3] flex flex-col items-center px-4 py-10">
      {/* Navbar */}
      <header className="w-full flex justify-between items-center px-6 py-4 bg-[#FAFAF3]">
        <h1 className="text-xl font-bold">🌟 TalentMatch AI</h1>
        <nav className="space-x-6 text-sm font-medium">
          <button
            onClick={handleNavClick('dashboard')}
            className={`${activeNav === 'dashboard' ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
          >
            Dashboard
          </button>
          <button
            onClick={handleNavClick('candidates')}
            className={`${activeNav === 'candidates' ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
          >
            Candidates
          </button>
          <button
            onClick={handleNavClick('jobs')}
            className={`${activeNav === 'jobs' ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
          >
            Jobs
          </button>
          <button
            onClick={handleNavClick('templates')}
            className={`${activeNav === 'templates' ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
          >
            Templates
          </button>
          <button
            onClick={handleNavClick('settings')}
            className={`${activeNav === 'settings' ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
          >
            Settings
          </button>
        </nav>
        <div className="w-10 h-10 rounded-full bg-slate-900" />
      </header>

      {/* Main Form */}
      <main className="mt-20 text-center max-w-2xl w-full px-4">
        <h2 className="text-3xl font-bold mb-4 text-gray-800">Convert Cover Letter to T-Format</h2>
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
          Easily match candidate strengths to your job requirements. Enter requirements below and
          upload the candidate&apos;s cover letter.
        </p>

        {/* Requirements Input */}
        <div className="mb-6 text-left">
          <label htmlFor="jobRequirements" className="block">
            <div className="text-sm font-medium text-gray-700 mb-2">
              Job Requirements (one per line)
            </div>
            <textarea
              id="jobRequirements"
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              placeholder="Enter each requirement on a new line, for example:
- 3+ years of experience
- Bachelor's degree in Computer Science
- Experience with React and Node.js"
              rows={6}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent resize-none"
            />
          </label>
        </div>

        {/* File Uploads */}
        <div className="space-y-4">
          {/* Cover Letter Upload */}
          <div className="text-left">
            <span id="cover-letter-label" className="block text-sm font-medium text-gray-700 mb-2">
              Cover Letter (Required)
            </span>
            <div className="relative">
              <input
                id="cover-letter-upload"
                name="cover-letter-upload"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
                className="sr-only"
                aria-labelledby="cover-letter-label"
              />
              <label htmlFor="cover-letter-upload" className="block">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer">
                  <div className="space-y-1">
                    <CloudArrowUpIcon
                      className="mx-auto h-12 w-12 text-gray-400"
                      aria-hidden="true"
                    />
                    <div className="flex text-sm text-gray-600">
                      <p className="pl-1">
                        {coverFile ? (
                          <span className="font-medium text-yellow-600">{coverFile.name}</span>
                        ) : (
                          <span className="font-medium">Upload a file or drag and drop</span>
                        )}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500">PDF, DOC, DOCX up to 10MB</p>
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Resume Upload (Optional) */}
          <div className="text-left">
            <span id="resume-label" className="block text-sm font-medium text-gray-700 mb-2">
              Resume (Optional)
            </span>
            <div className="relative">
              <input
                id="resume-upload"
                name="resume-upload"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                className="sr-only"
                aria-labelledby="resume-label"
              />
              <label htmlFor="resume-upload" className="block">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer">
                  <div className="space-y-1">
                    <CloudArrowUpIcon
                      className="mx-auto h-12 w-12 text-gray-400"
                      aria-hidden="true"
                    />
                    <div className="flex text-sm text-gray-600">
                      <p className="pl-1">
                        {resumeFile ? (
                          <span className="font-medium text-yellow-600">{resumeFile.name}</span>
                        ) : (
                          <span className="font-medium">Upload a file or drag and drop</span>
                        )}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500">PDF, DOC, DOCX up to 10MB</p>
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Convert Button */}
        <button
          onClick={handleConvert}
          disabled={!coverFile || !requirements.trim() || isLoading}
          className={`mt-8 w-full max-w-md mx-auto py-3 px-6 rounded-full font-semibold text-white shadow-md transition-all ${
            !coverFile || !requirements.trim() || isLoading
              ? 'bg-yellow-300 cursor-not-allowed'
              : 'bg-yellow-500 hover:bg-yellow-600 transform hover:-translate-y-0.5'
          }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processing...
            </div>
          ) : (
            'Convert to T-Format'
          )}
        </button>
      </main>
    </div>
  );
};

export default TFormatConverter;
