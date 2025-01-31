import { motion, AnimatePresence } from 'framer-motion';
import { PriceBreakdown } from './constants';
import { PromoCodeInput } from './PromoCodeInput';

export interface PriceItem {
  label: string;
  amount: number;
  details?: string;
}

interface PriceSummaryProps {
  basePrice?: number;
  items: PriceItem[];
  additionalOptions?: {
    extraCoating?: boolean;
    protectiveClearCoat?: boolean;
    specialPrimer?: boolean;
    rushProcessing?: boolean;
  };
  priceBreakdown: PriceBreakdown;
  quantity: number;
  promoCode?: string;
  onApplyPromo: (code: string) => void;
  onRemovePromo: () => void;
}

const ADDITIONAL_COSTS = {
  extraCoating: 25,
  protectiveClearCoat: 35,
  specialPrimer: 20,
  rushProcessing: 50,
};

const formatPrice = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
};

export const PriceSummary = ({ 
  basePrice = 0, 
  items, 
  additionalOptions = {},
  priceBreakdown,
  quantity,
  promoCode,
  onApplyPromo,
  onRemovePromo
}: PriceSummaryProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg p-6 rounded-xl shadow-xl"
    >
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Price Summary</h3>
      
      {/* Base Price and Quantity */}
      {basePrice > 0 && (
        <div className="flex justify-between mb-2">
          <div className="flex flex-col">
            <span className="text-gray-600 dark:text-gray-400">Base Price</span>
            <span className="text-xs text-gray-500">Quantity: {quantity}</span>
          </div>
          <motion.span
            key={basePrice}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="font-medium text-gray-900 dark:text-white"
          >
            {formatPrice(basePrice)} × {quantity}
          </motion.span>
        </div>
      )}

      {/* Selected Options */}
      <AnimatePresence mode="popLayout">
        {items.map((item) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex justify-between mb-2"
          >
            <div className="flex flex-col">
              <span className="text-gray-600 dark:text-gray-400">{item.label}</span>
              {item.details && (
                <span className="text-xs text-gray-500 dark:text-gray-500">{item.details}</span>
              )}
            </div>
            <motion.span
              key={item.amount}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="font-medium text-gray-900 dark:text-white"
            >
              {formatPrice(item.amount)}
            </motion.span>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Additional Options */}
      {Object.entries(additionalOptions).map(([key, isSelected]) => {
        if (!isSelected) return null;
        const amount = ADDITIONAL_COSTS[key as keyof typeof ADDITIONAL_COSTS];
        const label = key.replace(/([A-Z])/g, ' $1').trim();
        
        return (
          <motion.div
            key={key}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex justify-between mb-2"
          >
            <span className="text-gray-600 dark:text-gray-400">{label}</span>
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="font-medium text-gray-900 dark:text-white"
            >
              +{formatPrice(amount)}
            </motion.span>
          </motion.div>
        );
      })}

      {/* Subtotal */}
      <motion.div
        className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between"
        layout
      >
        <span className="font-medium text-gray-700 dark:text-gray-300">Subtotal</span>
        <motion.span
          key={priceBreakdown.subtotal}
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="font-medium text-gray-900 dark:text-white"
        >
          {formatPrice(priceBreakdown.subtotal)}
        </motion.span>
      </motion.div>

      {/* Promo Code Input */}
      <div className="my-4">
        <PromoCodeInput
          onApply={onApplyPromo}
          onRemove={onRemovePromo}
          appliedCode={promoCode}
        />
      </div>

      {/* Applied Discounts */}
      <AnimatePresence mode="popLayout">
        {priceBreakdown.appliedDiscounts.map((discount) => (
          <motion.div
            key={discount.name}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex justify-between mt-2 text-green-600 dark:text-green-400"
          >
            <span>{discount.name}</span>
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              -{formatPrice(discount.amount)}
            </motion.span>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Final Total */}
      <motion.div
        className="mt-4 pt-4 border-t-2 border-gray-200 dark:border-gray-700 flex justify-between"
        layout
      >
        <span className="font-bold text-gray-900 dark:text-white">Total</span>
        <div className="flex flex-col items-end">
          {priceBreakdown.appliedDiscounts.length > 0 && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-green-600 dark:text-green-400 mb-1"
            >
              You saved {formatPrice(priceBreakdown.subtotal - priceBreakdown.total)}!
            </motion.span>
          )}
          <motion.span
            key={priceBreakdown.total}
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="font-bold text-lg text-accent"
          >
            {formatPrice(priceBreakdown.total)}
          </motion.span>
        </div>
      </motion.div>
    </motion.div>
  );
}; 