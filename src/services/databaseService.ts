import { FormData, PriceBreakdown } from '../components/quote/types';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

interface QuoteData {
  userId: string;
  formData: {
    material: string;
    dimensions: {
      length: string;
      width: string;
      height: string;
      unit: "inches" | "cm";
    };
    coating: {
      type: string;
      finish: string;
    };
    color: {
      type: string;
      custom?: string;
    };
    quantity: string;
    addons: string[];
    specialRequirements?: string;
    contact: {
      name: string;
      email: string;
      phone?: string;
      company?: string;
    };
  };
  priceBreakdown: {
    base: number;
    coating: number;
    finish: number;
    volume: number;
    addons: number;
    total: number;
  };
  quoteReference: string;
}

interface UserData {
  email: string;
  name: string;
  password?: string;
  googleId?: string;
  facebookId?: string;
  picture?: string;
}

// Database service functions
export const createQuote = async (quoteData: QuoteData) => {
  const response = await fetch(`${API_URL}/api/quotes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(quoteData),
    credentials: 'include'
  });
  
  if (!response.ok) {
    throw new Error('Failed to create quote');
  }
  
  return await response.json();
};

export const getQuoteByReference = async (reference: string) => {
  const response = await fetch(`${API_URL}/api/quotes/${reference}`, {
    credentials: 'include'
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch quote');
  }
  
  return await response.json();
};

export const getUserQuotes = async (userId: string) => {
  const response = await fetch(`${API_URL}/api/quotes/user/${userId}`, {
    credentials: 'include'
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch user quotes');
  }
  
  return await response.json();
};

export const createUser = async (userData: UserData) => {
  const response = await fetch(`${API_URL}/api/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
    credentials: 'include'
  });
  
  if (!response.ok) {
    throw new Error('Failed to create user');
  }
  
  return await response.json();
};

export const findUserByEmail = async (email: string) => {
  const response = await fetch(`${API_URL}/api/users/email/${email}`, {
    credentials: 'include'
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch user');
  }
  
  return await response.json();
};

export const findUserById = async (id: string) => {
  const response = await fetch(`${API_URL}/api/users/${id}`, {
    credentials: 'include'
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch user');
  }
  
  return await response.json();
};

export const saveQuote = async (
  userId: string,
  formData: FormData,
  priceBreakdown: PriceBreakdown
) => {
  const reference = generateQuoteReference();
  
  return await createQuote({
    userId,
    formData: {
      material: formData.material,
      dimensions: {
        length: formData.dimensions.length,
        width: formData.dimensions.width,
        height: formData.dimensions.height,
        unit: formData.dimensions.unit,
      },
      coating: {
        type: formData.coating.type,
        finish: formData.coating.finish,
      },
      color: {
        type: formData.color.type,
        custom: formData.color.custom,
      },
      quantity: formData.quantity.toString(),
      addons: formData.addons,
      specialRequirements: formData.specialRequirements,
      contact: formData.contact,
    },
    priceBreakdown: {
      base: priceBreakdown.base,
      coating: priceBreakdown.coating,
      finish: priceBreakdown.finish,
      volume: priceBreakdown.volume,
      addons: priceBreakdown.addons,
      total: priceBreakdown.total,
    },
    quoteReference: reference,
  });
};

// Helper function to generate a unique quote reference
const generateQuoteReference = () => {
  const prefix = 'QT';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
};

export { API_URL }; 