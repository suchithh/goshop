import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QrScanner from 'react-qr-scanner';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const ScanQR = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const handleScan = (data) => {
    if (data) {
      navigate('/search', { state: { query: data.text } });
    }
  };

  const handleError = (err) => {
    setError(err.message);
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <button
        onClick={() => navigate('/')}
        className="text-white mb-4 flex items-center gap-2"
      >
        <ArrowLeftIcon className="w-5 h-5" />
        Back
      </button>

      <div className="relative max-w-md mx-auto">
        <QrScanner
          delay={300}
          onError={handleError}
          onScan={handleScan}
          style={{ width: '100%' }}
        />
        {error && (
          <p className="text-red-500 mt-4 text-center">{error}</p>
        )}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-2 border-white w-48 h-48"></div>
      </div>
    </div>
  );
};

export default ScanQR;