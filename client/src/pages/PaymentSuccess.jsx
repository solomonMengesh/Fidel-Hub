import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import axios from 'axios';

const PaymentSuccess = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [payment, setPayment] = useState(null);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(false);

  // Get and clean parameters
  const getCleanParams = () => {
    const allParams = Object.fromEntries(params.entries());
    const cleaned = {};
    
    for (const [key, value] of Object.entries(allParams)) {
      cleaned[key.replace(/^amp;/, '')] = value;
    }

    return {
      courseId: cleaned.course || '',
      txRef: cleaned.tx_ref || '',
      status: cleaned.status || 'success'
    };
  };

  const { courseId, txRef, status } = getCleanParams();

  const downloadReceipt = async () => {
    try {
      setDownloading(true);
      const token = localStorage.getItem('token');
      
      // Request PDF from backend
      const response = await axios.get(
        `http://localhost:5000/api/payment/receipt/${txRef}`,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Cache-Control': 'no-cache'
          },
          responseType: 'blob' // Important for file downloads
        }
      );

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `payment-receipt-${txRef}.pdf`);
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download error:', err);
      setError('Failed to download receipt. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        if (!txRef) throw new Error('Missing transaction reference');
        if (!courseId) throw new Error('Missing course ID');

        const token = localStorage.getItem('token');
        if (!token) throw new Error('Authentication required');

        const response = await axios.get(
          `http://localhost:5000/api/payment/verify-payment/${txRef}`,
          {
            headers: { 
              Authorization: `Bearer ${token}`,
              'Cache-Control': 'no-cache'
            },
            params: { course_id: courseId }
          }
        );

        // Check for valid payment data in different possible locations
        const paymentData = response.data?.payment || response.data;
        
        if (!paymentData?.tx_ref) {
          throw new Error('Invalid payment data structure');
        }

        setPayment(paymentData);
      } catch (err) {
        console.error('Verification error:', err);
        setError(err.response?.data?.message || err.message || 'Payment verification failed');
      } finally {
        setLoading(false);
      }
    };

    if (txRef && courseId) {
      verifyPayment();
    } else {
      setError(!txRef ? 'Transaction reference missing' : 'Course ID missing');
      setLoading(false);
    }
  }, [courseId, txRef, status]);

  if (loading) {
    return <div className="text-center mt-10">Verifying your payment...</div>;
  }

  if (error) {
    return (
      <div className="text-center mt-10">
        <h1 className="text-2xl font-bold text-red-600">Payment Verification Failed</h1>
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={() => navigate('/courses')}>Back to Courses</Button>
      </div>
    );
  }

  // Formatting functions
  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'N/A';
    }
  };

  const formatCurrency = (amount) => {
    return amount?.toLocaleString('en-US') || '0';
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white dark:bg-slate-800 rounded-lg shadow-md">
      <div className="text-center mb-6">
        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold">Payment Successful!</h1>
        <p className="text-muted-foreground">You're now enrolled in the course.</p>
      </div>

      <div className="space-y-4 mb-6">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Transaction Reference:</span>
          <span className="font-medium">{payment?.tx_ref || 'N/A'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Amount:</span>
          <span className="font-medium">
            {formatCurrency(payment?.amount)} ETB
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Fee:</span>
          <span className="font-medium">
            {formatCurrency(payment?.chapaData?.data?.charge)} ETB
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Payment Method:</span>
          <span className="font-medium capitalize">
            {payment?.chapaData?.data?.method || 'N/A'}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Date:</span>
          <span className="font-medium">
            {formatDate(payment?.createdAt)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Status:</span>
          <span className="font-medium text-green-500">
            {payment?.status ? payment.status.charAt(0).toUpperCase() + payment.status.slice(1) : 'Completed'}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <Button 
          className="w-full" 
          onClick={downloadReceipt}
          disabled={downloading}
        >
          {downloading ? (
            'Generating Receipt...'
          ) : (
            <>
              <Download className="w-4 h-4 mr-2" />
              Download Payment Receipt
            </>
          )}
        </Button>
        
        <div className="flex gap-4">
          <Button 
            className="flex-1" 
            onClick={() => navigate(`/courses/${courseId}`)}
          >
            Start Learning
          </Button>
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => navigate('/courses')}
          >
            Browse More Courses
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;