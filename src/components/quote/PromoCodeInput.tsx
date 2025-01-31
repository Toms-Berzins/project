import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { SEASONAL_DISCOUNTS } from './constants';
import { QuoteButton } from './QuoteButton';

interface PromoCodeInputProps {
  onApply: (code: string) => void;
  onRemove: () => void;
  appliedCode?: string;
  className?: string;
}

type PromoCode = keyof typeof SEASONAL_DISCOUNTS;

export const PromoCodeInput = ({ onApply, onRemove, appliedCode, className = '' }: PromoCodeInputProps) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isValidating, setIsValidating] = useState(false);

  const validateCode = (inputCode: string): inputCode is PromoCode => {
    return Object.keys(SEASONAL_DISCOUNTS).includes(inputCode.toLowerCase() as PromoCode);
  };

  const handleSubmit = async () => {
    const trimmedCode = code.trim().toUpperCase();
    if (!trimmedCode) {
      setError('Please enter a promo code');
      return;
    }

    setIsValidating(true);
    setError('');

    // Simulate API validation delay
    await new Promise(resolve => setTimeout(resolve, 600));

    if (validateCode(trimmedCode)) {
      onApply(trimmedCode);
      setCode('');
    } else {
      setError('Invalid promo code');
    }
    setIsValidating(false);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {appliedCode ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800"
        >
          <div className="flex items-center space-x-2">
            <svg 
              className="w-5 h-5 text-green-500" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M5 13l4 4L19 7" 
              />
            </svg>
            <span className="text-sm text-green-700 dark:text-green-300">
              Promo code <span className="font-medium">{appliedCode}</span> applied!
            </span>
          </div>
          <button
            onClick={onRemove}
            className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors p-1 rounded-full hover:bg-green-50 dark:hover:bg-green-900/20"
            aria-label="Remove promo code"
            title="Remove promo code"
          >
            <svg 
              className="w-5 h-5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M6 18L18 6M6 6l12 12" 
              />
            </svg>
          </button>
        </motion.div>
      ) : (
        <div className="flex items-start space-x-2">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value.toUpperCase());
                  setError('');
                }}
                placeholder="Enter promo code"
                className={`
                  w-full px-3 py-2 rounded-lg
                  border ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}
                  bg-white dark:bg-gray-800
                  text-gray-900 dark:text-white
                  placeholder-gray-400 dark:placeholder-gray-500
                  focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent
                  transition-all duration-200
                `}
                disabled={isValidating}
                aria-label="Promo code input"
                aria-invalid="false"
                data-invalid={error ? "true" : "false"}
                aria-describedby={error ? "promo-error" : undefined}
              />
              <AnimatePresence mode="wait">
                {isValidating && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    <svg 
                      className="animate-spin h-5 w-5 text-accent" 
                      fill="none" 
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <circle 
                        className="opacity-25" 
                        cx="12" 
                        cy="12" 
                        r="10" 
                        stroke="currentColor" 
                        strokeWidth="4"
                      />
                      <path 
                        className="opacity-75" 
                        fill="currentColor" 
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <AnimatePresence mode="wait">
              {error && (
                <motion.p
                  id="promo-error"
                  role="alert"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-sm text-red-500 mt-1"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
          <QuoteButton
            onClick={handleSubmit}
            disabled={isValidating || !code.trim()}
            isLoading={isValidating}
            variant="secondary"
            className="whitespace-nowrap"
            aria-label="Apply promo code"
          >
            Apply Code
          </QuoteButton>
        </div>
      )}
    </div>
  );
}; 