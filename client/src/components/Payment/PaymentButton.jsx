import { useState } from 'react';
import axios from 'axios';

export const PaymentButton = ({ courseId, amount, email, firstName, lastName }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePayment = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('http://localhost:5000/api/payment/initialize', {
        course_id: courseId,
        amount,
        email,
        first_name: firstName,
        last_name: lastName
      });

      if (response.data.success) {
        window.location.href = response.data.paymentUrl;
      } else {
        setError(response.data.error || 'Payment failed');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Payment error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handlePayment}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {loading ? 'Processing...' : 'Pay with Chapa'}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default PaymentButton;