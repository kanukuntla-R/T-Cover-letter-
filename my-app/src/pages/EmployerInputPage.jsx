import { useState } from 'react';
import { CloudArrowUpIcon } from '@heroicons/react/24/outline';

export default function TFormatConverter() {
  const [file, setFile] = useState<File | null>(null);

  return (
    <div className="min-h-screen bg-[#FAFAF3] flex flex-col items-center px-4 py-10">
      {/* Navbar */}
      <header className="w-full flex justify-between items-center px-6 py-4 bg-[#FAFAF3]">
        <h1 className="text-xl font-bold">🌟 TalentMatch AI</h1>
        <nav className="space-x-6 text-sm font-medium">
          <a href="#">Dashboard</a>
          <a href="#">Candidates</a>
          <a href="#">Jobs</a>
          <a href="#">Templates</a>
          <a href="#">Settings</a>
        </nav>
        <div className="w-10 h-10 rounded-full bg-slate-900" />
      </header>

      {/* Main Form */}
      <main className="mt-20 text-center max-w-lg w-full">
        <h2 className="text-2xl font-bold mb-2">Convert Cover Letter to T-Format</h2>
        <p className="text-gray-500 mb-6">Easily match candidate strengths to your job requirements.</p>

        {/* Input field */}
        <input
          type="text"
          placeholder="Enter desired qualities or required qualifications (Press En"
          className="w-full border border-gray-200 px-4 py-3 rounded-md text-gray-700 mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-400 placeholder:text-[#ccc]"
        />

        {/* File Upload */}
        <div className="relative w-full">
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="absolute inset-0 opacity-0 z-10 cursor-pointer"
          />
          <div className="flex items-center justify-between border border-gray-200 px-4 py-3 rounded-md text-gray-500 bg-white">
            <span>{file ? file.name : "Upload Cover Letter (Required)"}</span>
            <CloudArrowUpIcon className="h-5 w-5 text-gray-400" />
          </div>
        </div>
        <p className="text-sm text-gray-400 mt-1">Cover letter is required to proceed</p>

        {/* Convert Button */}
        <button
          disabled={!file}
          className="mt-6 w-full py-3 rounded-full bg-yellow-400 text-black font-semibold hover:bg-yellow-500 transition disabled:opacity-50"
        >
          Convert to T-Format
        </button>
      </main>
    </div>
  );
}
