import React from 'react';
import { toast } from 'react-hot-toast';

const ScorePanel = ({ score, total, status, onAccept, onReject }) => {
  const [saving, setSaving] = React.useState(false);

  const handleAccept = async () => {
    try {
      setSaving(true);
      await onAccept();
      toast.success('Accepted ️✔');
    } catch (err) {
      toast.error('Could not save decision');
      console.error('Error saving decision:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleReject = async () => {
    try {
      setSaving(true);
      await onReject();
      toast.success('Rejected');
    } catch (err) {
      toast.error('Could not save decision');
      console.error('Error saving decision:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="score-panel flex items-center justify-between p-4 bg-gray-100 rounded-lg shadow-inner">
      <div>
        <p className="text-xl font-semibold">
          Score:&nbsp;
          <span className="text-blue-600">{score}</span> / {total}
        </p>
        <p className="text-sm italic text-gray-500">Status: {status}</p>
      </div>

      <div className="space-x-2">
        <button
          type="button"
          className={`px-4 py-2 rounded text-white ${
            saving ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700'
          }`}
          onClick={handleAccept}
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Accept'}
        </button>
        <button
          type="button"
          className={`px-4 py-2 rounded text-white ${
            saving ? 'bg-red-400' : 'bg-red-600 hover:bg-red-700'
          }`}
          onClick={handleReject}
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Reject'}
        </button>
      </div>
    </div>
  );
};

export default ScorePanel;
