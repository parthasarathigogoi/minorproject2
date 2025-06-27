import React, { useState } from 'react';

export default function CreateSubjectForm({ onSubjectCreated, onEnterSubject }) {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [createdSubject, setCreatedSubject] = useState(null);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setCode('');
    try {
      const res = await fetch('/api/subjects/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ name })
      });
      const data = await res.json();
      setLoading(false);
      if (res.ok) {
        setCode(data.code);
        setCreatedSubject(data);
        setShowModal(true);
        setName('');
        setCopied(false);
        onSubjectCreated && onSubjectCreated(data);
      } else {
        setError(data.message || 'Error creating subject');
      }
    } catch (err) {
      setLoading(false);
      setError('Network error');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleDone = () => {
    setShowModal(false);
    if (onEnterSubject && createdSubject) onEnterSubject(createdSubject);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="p-4 bg-white rounded shadow max-w-md mx-auto mt-8">
        <h2 className="text-xl mb-2 font-semibold">Create Subject</h2>
        <input
          className="border p-2 w-full mb-2 rounded"
          placeholder="Subject Name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded w-full" disabled={loading}>
          {loading ? 'Creating...' : 'Create'}
        </button>
        {error && <div className="mt-2 text-red-600 text-sm">{error}</div>}
      </form>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full text-center">
            <h3 className="text-lg font-semibold mb-2">Subject Created!</h3>
            <div className="mb-2">
              <span className="font-bold">Subject Code:</span> <span className="text-blue-700 text-lg">{code}</span>
              <button
                type="button"
                className="ml-2 px-2 py-1 bg-gray-200 rounded text-sm hover:bg-gray-300"
                onClick={handleCopy}
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <div className="mb-4 text-gray-600 text-sm">
              Share this code with your students so they can join your class.
            </div>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded w-full"
              onClick={handleDone}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </>
  );
} 