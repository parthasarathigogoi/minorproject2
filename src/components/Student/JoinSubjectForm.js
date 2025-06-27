import React, { useState } from 'react';

export default function JoinSubjectForm({ onJoined, onSuccess }) {
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/subjects/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ code })
      });
      const data = await res.json();
      setLoading(false);
      if (res.ok) {
        setMessage('Joined successfully!');
        setError('');
        onJoined && onJoined(data.subject);
        if (onSuccess) onSuccess();
      } else {
        setError(data.message || 'Error joining subject');
      }
    } catch (err) {
      setLoading(false);
      setError('Network error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white rounded shadow max-w-md mx-auto mt-8">
      <h2 className="text-xl mb-2 font-semibold">Join Subject</h2>
      <input
        className="border p-2 w-full mb-2 rounded"
        placeholder="Enter Subject Code"
        value={code}
        onChange={e => setCode(e.target.value.toUpperCase())}
        required
      />
      <button className="bg-green-600 text-white px-4 py-2 rounded w-full" disabled={loading}>
        {loading ? 'Joining...' : 'Join'}
      </button>
      {message && <div className="mt-2 text-green-700 text-sm">{message}</div>}
      {error && <div className="mt-2 text-red-600 text-sm">{error}</div>}
    </form>
  );
} 