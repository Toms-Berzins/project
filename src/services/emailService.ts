import { FormData, PriceBreakdown } from '../components/quote/types';

const API_URL = 'http://localhost:3000';

interface EmailData {
  formData: FormData;
  priceBreakdown: PriceBreakdown;
  quoteReference: string;
}

export const sendQuoteEmail = async (data: EmailData) => {
  const response = await fetch(`${API_URL}/api/send-email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to send email');
  }

  return response.json();
}; 