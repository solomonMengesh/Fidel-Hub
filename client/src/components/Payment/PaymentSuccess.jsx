import React, { useEffect, useState } from 'react';
import { verifyPayment } from '../services/paymentService';
import { useSearchParams } from 'react-router-dom';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const txRef = searchParams.get('tx_ref');
    if (txRef) {
      verifyPayment(txRef)
        .then(response => {
          setPaymentStatus(response.success ? 'success' : 'failed');
        })
        .catch(() => {
          setPaymentStatus('failed');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setPaymentStatus('failed');
      setLoading(false);
    }
  }, [searchParams]);
  
  if (loading) return <div>Verifying payment...</div>;
  
  return (
    <div>
      {paymentStatus === 'success' ? (
        <div>
          <h2>Payment Successful!</h2>
          <p>Thank you for your payment.</p>
        </div>
      ) : (
        <div>
          <h2>Payment Failed</h2>
          <p>There was an issue processing your payment.</p>
        </div>
      )}
    </div>
  );
};

export default PaymentSuccess;