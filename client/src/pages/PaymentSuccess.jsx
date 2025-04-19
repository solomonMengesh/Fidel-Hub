// pages/PaymentSuccess.js
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const tx_ref = new URLSearchParams(location.search).get('tx_ref');

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const response = await axios.post('/api/payment/verify', { tx_ref });
        
        if (response.data.success) {
          // Payment verified, you might want to redirect to the course page
          // or show a success message
          console.log('Payment verified successfully');
        } else {
          navigate('/payment-failed');
        }
      } catch (error) {
        console.error('Verification error:', error);
        navigate('/payment-failed');
      }
    };

    if (tx_ref) {
      verifyPayment();
    } else {
      navigate('/');
    }
  }, [tx_ref, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md text-center">
        <h1 className="text-2xl font-bold mb-4">Payment Successful!</h1>
        <p>Thank you for your payment. You're now enrolled in the course.</p>
        <p>Transaction reference: {tx_ref}</p>
      </div>
    </div>
  );
};

export default PaymentSuccess;