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
  quantity: 1,
  addons: [],
  specialRequirements: '',
  contact: {
    name: '',
    email: '',
    phone: '',
    comments: ''
  }
};

export const COATING_PRICES = {
  standard: 0,
  premium: 50,
  ceramic: 100,
} as const;

export const FINISH_PRICES = {
  matte: 0,
  satin: 25,
  gloss: 35,
  textured: 45,
} as const;

export const SIZE_ADJUSTMENT_PRICES = {
  small: 0,
  medium: 50,
  large: 100,
  custom: 150,
} as const;

export const ADDITIONAL_OPTIONS = {
  extraCoating: {
    label: 'Extra Coating Layer',
    price: 25,
    description: 'Additional layer for enhanced durability',
  },
  protectiveClearCoat: {
    label: 'Protective Clear Coat',
    price: 35,
    description: 'Superior protection against environmental factors',
  },
  specialPrimer: {
    label: 'Special Primer',
    price: 20,
    description: 'Enhanced adhesion and surface preparation',
  },
  rushProcessing: {
    label: 'Rush Processing',
    price: 50,
    description: 'Expedited processing and handling',
  },
} as const;

export type CoatingType = keyof typeof COATING_PRICES;
export type FinishType = keyof typeof FINISH_PRICES;
export type SizeAdjustment = keyof typeof SIZE_ADJUSTMENT_PRICES;
export type AdditionalOption = keyof typeof ADDITIONAL_OPTIONS;

export const BULK_PRICING_TIERS = {
  tier1: { min: 1, max: 4, discount: 0 },
  tier2: { min: 5, max: 9, discount: 0.05 }, // 5% off
  tier3: { min: 10, max: 24, discount: 0.10 }, // 10% off
  tier4: { min: 25, max: 49, discount: 0.15 }, // 15% off
  tier5: { min: 50, max: Infinity, discount: 0.20 }, // 20% off
} as const;

export const SEASONAL_DISCOUNTS = {
  earlyBird: { code: 'EARLY', discount: 0.10 }, // 10% off
  holiday: { code: 'HOLIDAY', discount: 0.15 }, // 15% off
  summer: { code: 'SUMMER', discount: 0.12 }, // 12% off
} as const;

export const BUNDLE_DISCOUNTS = {
  basicBundle: {
    name: 'Basic Protection',
    requiredOptions: ['extraCoating', 'specialPrimer'],
    discount: 0.10, // 10% off when both are selected
  },
  premiumBundle: {
    name: 'Premium Protection',
    requiredOptions: ['extraCoating', 'protectiveClearCoat', 'specialPrimer'],
    discount: 0.15, // 15% off when all three are selected
  },
} as const;

export interface QuoteState {
  coating?: CoatingType;
  finish?: FinishType;
  sizeAdjustment?: SizeAdjustment;
  additionalOptions: {
    [K in AdditionalOption]?: boolean;
  };
  dimensions?: {
    width: number;
    height: number;
    depth: number;
  };
  quantity: number;
  basePrice: number;
  promoCode?: string;
  rushOrder?: boolean;
  estimatedDate?: Date;
}

export interface PriceBreakdown {
  subtotal: number;
  bulkDiscount: number;
  bundleDiscount: number;
  seasonalDiscount: number;
  total: number;
  appliedDiscounts: {
    name: string;
    amount: number;
  }[];
}

const getBulkDiscountTier = (quantity: number) => {
  return Object.values(BULK_PRICING_TIERS).find(
    tier => quantity >= tier.min && quantity <= tier.max
  ) || BULK_PRICING_TIERS.tier1;
};

const calculateBundleDiscount = (additionalOptions: QuoteState['additionalOptions']) => {
  for (const bundle of Object.values(BUNDLE_DISCOUNTS)) {
    const allOptionsSelected = bundle.requiredOptions.every(
      option => additionalOptions[option as AdditionalOption]
    );
    if (allOptionsSelected) {
      return bundle;
    }
  }
  return null;
};

export const calculateTotal = (state: QuoteState): PriceBreakdown => {
  let subtotal = state.basePrice * (state.quantity || 1);

  // Add coating price
  if (state.coating) {
    subtotal += COATING_PRICES[state.coating] * (state.quantity || 1);
  }

  // Add finish price
  if (state.finish) {
    subtotal += FINISH_PRICES[state.finish] * (state.quantity || 1);
  }

  // Add size adjustment price
  if (state.sizeAdjustment) {
    subtotal += SIZE_ADJUSTMENT_PRICES[state.sizeAdjustment] * (state.quantity || 1);
  }

  // Add additional options
  Object.entries(state.additionalOptions).forEach(([option, isSelected]) => {
    if (isSelected && option in ADDITIONAL_OPTIONS) {
      subtotal += ADDITIONAL_OPTIONS[option as AdditionalOption].price * (state.quantity || 1);
    }
  });

  const appliedDiscounts: { name: string; amount: number; }[] = [];

  // Calculate bulk discount
  const bulkTier = getBulkDiscountTier(state.quantity);
  const bulkDiscount = subtotal * bulkTier.discount;
  if (bulkDiscount > 0) {
    appliedDiscounts.push({
      name: `Bulk Discount (${bulkTier.discount * 100}% off)`,
      amount: bulkDiscount
    });
  }

  // Calculate bundle discount
  const bundle = calculateBundleDiscount(state.additionalOptions);
  const bundleDiscount = bundle ? subtotal * bundle.discount : 0;
  if (bundleDiscount > 0) {
    appliedDiscounts.push({
      name: `${bundle!.name} Bundle (${bundle!.discount * 100}% off)`,
      amount: bundleDiscount
    });
  }

  // Calculate seasonal discount
  let seasonalDiscount = 0;
  if (state.promoCode) {
    const seasonalPromo = Object.values(SEASONAL_DISCOUNTS).find(
      promo => promo.code === state.promoCode
    );
    if (seasonalPromo) {
      seasonalDiscount = subtotal * seasonalPromo.discount;
      appliedDiscounts.push({
        name: `Promo Code: ${state.promoCode} (${seasonalPromo.discount * 100}% off)`,
        amount: seasonalDiscount
      });
    }
  }

  // Calculate early bird discount (if order date is more than 30 days ahead)
  if (state.estimatedDate && !state.rushOrder) {
    const daysUntilOrder = Math.floor(
      (state.estimatedDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysUntilOrder > 30) {
      const earlyBirdDiscount = subtotal * SEASONAL_DISCOUNTS.earlyBird.discount;
      appliedDiscounts.push({
        name: 'Early Bird Discount (10% off)',
        amount: earlyBirdDiscount
      });
      seasonalDiscount += earlyBirdDiscount;
    }
  }

  // Calculate final total
  const total = subtotal - bulkDiscount - bundleDiscount - seasonalDiscount;

  return {
    subtotal,
    bulkDiscount,
    bundleDiscount,
    seasonalDiscount,
    total,
    appliedDiscounts
  };
};

export const formatPrice = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
}; 