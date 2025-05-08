import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

export const testModeWithdrawal = async ({ account_name, account_number, bank_code, amount }) => {
  const payload = {
    account_name,
    account_number,
    bank_code,
    amount,
    currency: 'ETB',
    reference: `FIDEL-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    narration: 'Instructor Payout',
  };

  try {
    const response = await axios.post('https://api.chapa.co/v1/transfers', payload, {
      headers: {
        Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      timeout: 15000,
    });

    if (response.data.status !== 'success') {
      throw new Error(response.data.message || 'Chapa transfer failed');
    }

    return response.data;
  } catch (error) {
    console.error('[Chapa Withdrawal Error]', { payload, error: error.response?.data || error.message });
    throw new Error(
      error.response?.data?.message || 'Chapa withdrawal request failed'
    );
  }
};
