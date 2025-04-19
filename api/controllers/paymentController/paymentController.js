import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const CHAPA_SECRET_KEY = process.env.CHAPA_SECRET_KEY;

export const initializePayment = async (req, res) => {
  try {
    const { amount, email, first_name, last_name, course_id } = req.body;

    const tx_ref = `fidelhub-${course_id}-${Date.now()}`;

    const paymentData = {
      amount,
      currency: 'ETB',
      email,
      first_name,
      last_name,
      tx_ref,
      callback_url: `${process.env.FRONTEND_URL}/payment/verify`,
      return_url: `${process.env.FRONTEND_URL}/payment/success`,
      customization: {
        title: 'Fidel Hub Payment',
        description: 'Course Enrollment'
      }
    };

    const response = await axios.post(
      'https://api.chapa.co/v1/transaction/initialize',
      paymentData,
      {
        headers: {
          Authorization: `Bearer ${CHAPA_SECRET_KEY}`
        }
      }
    );

    res.json({
      success: true,
      paymentUrl: response.data.data.checkout_url
    });
  } catch (error) {
    console.error('Payment error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      error: 'Payment initialization failed'
    });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { tx_ref } = req.body;

    const response = await axios.get(
      `https://api.chapa.co/v1/transaction/verify/${tx_ref}`,
      {
        headers: {
          Authorization: `Bearer ${CHAPA_SECRET_KEY}`
        }
      }
    );

    if (response.data.status === 'success') {
      // TODO: Save to database, update user's course enrollment, etc.
      return res.json({
        success: true,
        data: response.data.data
      });
    }

    res.json({
      success: false,
      error: 'Payment verification failed'
    });
  } catch (error) {
    console.error('Verification error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      error: 'Payment verification failed'
    });
  }
};
