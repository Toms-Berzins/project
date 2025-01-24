export interface FormData {
  material: string;
  dimensions: {
    length: string;
    width: string;
    height: string;
    unit: 'inches' | 'cm';
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
  specialRequirements: string;
  contact: {
    name: string;
    email: string;
    phone: string;
    comments: string;
  };
}

export interface PriceBreakdown {
  base: number;
  coating: number;
  finish: number;
  volume: number;
  addons: number;
  total: number;
}

export type FormDataValue = string | string[] | boolean | number;
export type NestedFormData = {
  [key: string]: FormDataValue | NestedFormData;
}; 