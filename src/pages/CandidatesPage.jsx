import React from 'react';

const mockData = {
  accepted: [
    { name: 'Emily Carter', role: 'Software Engineer', img: '/img1.png' },
    { name: 'Daniel Kim', role: 'Product Manager', img: '/img2.png' },
    { name: 'Isabella Rossi', role: 'UX Designer', img: '/img3.png' },
  ],
  rejected: [
    { name: 'Owen Taylor', role: 'Data Analyst', img: '/img4.png' },
    { name: 'Chloe Bennett', role: 'Marketing Specialist', img: '/img5.png' },
    { name: 'Lucas Ramirez', role: 'Sales Representative', img: '/img6.png' },
  ],
};

const CandidatesPage = () => {
  const total = mockData.accepted.length + mockData.rejected.length;

  return (
    <div className="p-8 max-w-6xl mx-auto font-sans text-gray-800">
      <h1 className="text-3xl font-bold mb-1">Candidates</h1>
      <p className="text-gray-500 mb-6">Manage your candidates</p>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-100 p-6 rounded-lg text-center">
          <p className="text-sm text-gray-600">Total Candidates</p>
          <p className="text-2xl font-semibold">{total}</p>
        </div>
        <div className="bg-gray-100 p-6 rounded-lg text-center">
          <p className="text-sm text-gray-600">Accepted</p>
          <p className="text-2xl font-semibold">{mockData.accepted.length}</p>
        </div>
        <div className="bg-gray-100 p-6 rounded-lg text-center">
          <p className="text-sm text-gray-600">Rejected</p>
          <p className="text-2xl font-semibold">{mockData.rejected.length}</p>
        </div>
      </div>

      {/* Add Button */}
      <div className="flex justify-end mb-6">
        <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium py-2 px-4 rounded shadow-sm">
          ➕ Add Candidate
        </button>
      </div>

      {/* Accepted Candidates */}
      <h2 className="text-xl font-semibold mb-4">Accepted</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {mockData.accepted.map((person) => (
          <CandidateCard
            key={`accepted-${person.name}`}
            name={person.name}
            role={person.role}
            img={person.img}
          />
        ))}
      </div>

      {/* Rejected Candidates */}
      <h2 className="text-xl font-semibold mb-4">Rejected</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockData.rejected.map((person) => (
          <CandidateCard
            key={`rejected-${person.name}`}
            name={person.name}
            role={person.role}
            img={person.img}
          />
        ))}
      </div>
    </div>
  );
};

const CandidateCard = ({ name, role, img }) => (
  <div className="flex items-center justify-between p-4 border rounded-lg shadow-sm bg-white">
    <div>
      <p className="font-semibold">{name}</p>
      <p className="text-sm text-gray-500">{role}</p>
      <button className="mt-2 text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded">
        View Profile
      </button>
    </div>
    <img src={img} alt={name} className="w-24 h-24 rounded-md object-cover" />
  </div>
);

export default CandidatesPage;
