// src/pages/PaymentFailed.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTimesCircle } from 'react-icons/fa';

const PaymentFailed = () => {
  const navigate = useNavigate();

  // Optional: Auto-redirect after delay
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/');
    }, 10000); // Redirect after 10 seconds

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <div className="flex justify-center text-red-500 mb-4">
          <FaTimesCircle size={50} />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-3">Payment Failed</h1>
        
        <p className="text-gray-600 mb-6">
          We couldn't process your payment. Please check your payment details and try again.
        </p>

        <div className="space-y-3">
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
          >
            Try Again
          </button>
          
          <button
            onClick={() => navigate('/')}
            className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-100 transition"
          >
            Return to Home
          </button>
        </div>

        <p className="text-sm text-gray-500 mt-6">
          Need help? Contact our support at support@fidelhub.com
        </p>
      </div>
    </div>
  );
};

export default PaymentFailed;