import React, { useState } from 'react';
import { initializePayment } from '../services/paymentService';

const Payment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const handlePayment = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const paymentData = {
        amount: '100', // Amount in currency
        currency: 'ETB', // Change as needed
        email: 'user@example.com', // User's email
        first_name: 'John', // User's first name
        last_name: 'Doe', // User's last name
        return_url: window.location.origin + '/payment-success' // Your success URL
      };
      
      const response = await initializePayment(paymentData);
      
      if (response.success && response.checkoutUrl) {
        window.location.href = response.checkoutUrl;
      } else {
        setError('Failed to initialize payment');
      }
    } catch (err) {
      setError(err.message || 'Payment initialization failed');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      <h2>Make Payment</h2>
      {error && <div className="error">{error}</div>}
      <button onClick={handlePayment} disabled={loading}>
        {loading ? 'Processing...' : 'Pay with Chapa'}
      </button>
    </div>
  );
};

export default Payment;