import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PAGE_SIZE = 4;

const CandidatesPage = () => {
  const [evaluations, setEvaluations] = useState([]);
  const [filterStatus, setFilterStatus] = useState('All');
  const [minScore, setMinScore] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/evaluations');
        if (!res.ok) throw new Error('Failed to fetch evaluations');
        const data = await res.json();
        setEvaluations(data);
      } catch (err) {
        console.error('Error fetching candidates:', err);
      }
    };

    fetchData();
  }, []);

  const filtered = evaluations.filter((e) => {
    const matchesStatus = filterStatus === 'All' || e.decision === filterStatus;
    const matchesScore = e.score >= minScore;
    const matchesSearch = e.applicantId.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesScore && matchesSearch;
  });

  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  const clearFilters = () => {
    setFilterStatus('All');
    setMinScore(0);
    setSearchTerm('');
    setCurrentPage(1);
  };

  const exportCSV = () => {
    const rows = [['Applicant ID', 'Decision', 'Score', 'Total']];
    filtered.forEach((e) => {
      rows.push([e.applicantId, e.decision, e.score, e.total]);
    });
    const csvContent = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'candidates.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto font-sans text-gray-800">
      <h1 className="text-3xl font-bold mb-1">Candidates</h1>
      <p className="text-gray-500 mb-6">Manage your candidates</p>

      {/* Filter Controls */}
      <div className="flex flex-wrap gap-4 justify-between items-end mb-6">
        <div>
          <label htmlFor="filter-status" className="text-sm font-medium text-gray-700 block">Filter by decision:</label>
          <select
            id="filter-status"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-300 rounded px-3 py-1 text-sm w-40"
          >
            <option>All</option>
            <option>Accepted</option>
            <option>Rejected</option>
          </select>
        </div>

        <div>
          <label htmlFor="min-score" className="text-sm font-medium text-gray-700 block">Min score:</label>
          <input
            id="min-score"
            type="number"
            min={0}
            value={minScore}
            onChange={(e) => setMinScore(parseInt(e.target.value, 10) || 0)}
            className="border border-gray-300 rounded px-3 py-1 text-sm w-24"
          />
        </div>

        <div>
          <label htmlFor="search-term" className="text-sm font-medium text-gray-700 block">Search applicant ID:</label>
          <input
            id="search-term"
            type="text"
            placeholder="e.g. abc123"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 rounded px-3 py-1 text-sm w-48"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={clearFilters}
            className="bg-gray-100 hover:bg-gray-200 text-black font-medium py-2 px-4 rounded shadow-sm h-10"
          >
            Clear Filters
          </button>
          <button
            onClick={exportCSV}
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium py-2 px-4 rounded shadow-sm h-10"
          >
            Export CSV
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <StatCard label="Total Shown" value={filtered.length} />
        <StatCard label="Page" value={`${currentPage} / ${totalPages || 1}`} />
        <StatCard
          label="Matching Accepted"
          value={filtered.filter((e) => e.decision === 'Accepted').length}
        />
      </div>

      {/* Candidates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {paginated.length > 0 ? (
          paginated.map(({ applicant_id: applicantId, decision, score, total, avatar_url: avatarUrl }) => (
            <CandidateCard
              key={applicantId}
              id={applicantId}
              score={score}
              total={total}
              decision={decision}
              avatar={avatarUrl}
              navigate={navigate}
            />
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">No candidates match this filter.</p>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ label, value }) => (
  <div className="bg-gray-100 p-6 rounded-lg text-center">
    <p className="text-sm text-gray-600">{label}</p>
    <p className="text-2xl font-semibold">{value}</p>
  </div>
);

const CandidateCard = ({ id, score, total, decision, navigate, avatar }) => (
  <div className="flex items-center justify-between p-4 border rounded-lg shadow-sm bg-white">
    <div>
      <p className="font-semibold">Applicant ID: {id}</p>
      <p className="text-sm text-gray-500">Decision: {decision}</p>
      <p className="text-sm text-gray-500 mb-2">Score: {score} / {total}</p>
      <button
        onClick={() => navigate(`/review/${id}`)}
        className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded"
      >
        View Profile
      </button>
    </div>
    {avatar ? (
      <img src={avatar} alt="avatar" className="w-24 h-24 rounded-md object-cover" />
    ) : (
      <div className="w-24 h-24 bg-gray-100 rounded-md flex items-center justify-center text-gray-400 text-sm">
        IMG
      </div>
    )}
  </div>
);

export default CandidatesPage;
