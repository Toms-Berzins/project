export const materials = [
  { id: 'steel', name: 'Steel', basePrice: 50 },
  { id: 'aluminum', name: 'Aluminum', basePrice: 65 },
  { id: 'stainless', name: 'Stainless Steel', basePrice: 80 },
  { id: 'other', name: 'Other', basePrice: 60 }
];

export const coatingTypes = [
  { id: 'standard', name: 'Standard Powder Coating', priceMultiplier: 1 },
  { id: 'premium', name: 'Premium Grade', priceMultiplier: 1.3 },
  { id: 'automotive', name: 'Automotive Grade', priceMultiplier: 1.5 },
  { id: 'industrial', name: 'Industrial Grade', priceMultiplier: 1.4 }
];

export const finishTypes = [
  { id: 'glossy', name: 'Glossy', priceAdd: 0 },
  { id: 'matte', name: 'Matte', priceAdd: 5 },
  { id: 'metallic', name: 'Metallic', priceAdd: 10 },
  { id: 'textured', name: 'Textured', priceAdd: 8 }
];

export const colors = [
  { id: 'standard', name: 'Standard Colors', priceMultiplier: 1 },
  { id: 'metallic', name: 'Metallic', priceMultiplier: 1.2 },
  { id: 'chrome', name: 'Chrome Effect', priceMultiplier: 1.5 },
  { id: 'custom', name: 'Custom Color', priceMultiplier: 1.3 }
];

export const addons = [
  { id: 'extra-layer', name: 'Extra Coating Layer', price: 25 },
  { id: 'protective', name: 'Protective Clear Coat', price: 35 },
  { id: 'primer', name: 'Special Primer', price: 20 },
  { id: 'rush', name: 'Rush Processing', price: 50 }
];

export const initialFormData = {
  material: '',
  dimensions: {
    length: '',
    width: '',
    height: '',
    unit: 'inches' as const
  },
  coating: {
    type: '',
    finish: ''
  },
  color: {
    type: '',
  },
  quantity: '',
  addons: [],
  specialRequirements: '',
  contact: {
    name: '',
    email: '',
    phone: '',
    comments: ''
  }
}; 