import axios from 'axios';

const API_URL = 'http://localhost:5000/api/payment'; // Update with your backend URL

export const initializePayment = async (paymentData) => {
  try {
    const response = await axios.post(`${API_URL}/initialize`, paymentData);
    return response.data;
  } catch (error) {
    console.error('Payment initialization error:', error);
    throw error;
  }
};

export const verifyPayment = async (txRef) => {
  try {
    const response = await axios.get(`${API_URL}/verify?tx_ref=${txRef}`);
    return response.data;
  } catch (error) {
    console.error('Payment verification error:', error);
    throw error;
  }
};