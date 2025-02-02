import { motion } from 'framer-motion';
import { FormData, PriceBreakdown } from './types';
import { PriceSummary } from './PriceSummary';
import { CheckCircle2, ArrowRight } from 'lucide-react';

interface SuccessViewProps {
  quoteReference: string;
  formData: FormData;
  priceBreakdown: PriceBreakdown;
  onStartNewQuote: () => void;
  isGuest?: boolean;
}

export const SuccessView = ({
  quoteReference,
  formData,
  priceBreakdown,
  onStartNewQuote,
  isGuest = false
}: SuccessViewProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
          <CheckCircle2 className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Quote Submitted Successfully!
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          {isGuest ? (
            <>
              Your quote details have been sent to {formData.contact.email}.<br />
              <span className="text-sm mt-2 block">
                Consider creating an account to track your quotes and receive special offers.
              </span>
            </>
          ) : (
            <>
              Thank you for your quote request. We'll review it and get back to you shortly.<br />
              <span className="text-sm mt-2 block">
                You can track this quote in your account dashboard.
              </span>
            </>
          )}
        </p>
      </div>

      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg rounded-xl p-6 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Quote Reference
          </h3>
          <span className="text-orange-600 font-mono font-medium">
            {quoteReference}
          </span>
        </div>

        <PriceSummary
          basePrice={priceBreakdown.base}
          items={[
            {
              label: 'Material',
              amount: priceBreakdown.base,
              details: formData.material
            },
            {
              label: 'Coating',
              amount: priceBreakdown.coating,
              details: formData.coating.type
            },
            {
              label: 'Finish',
              amount: priceBreakdown.finish,
              details: formData.coating.finish
            }
          ]}
          priceBreakdown={{
            subtotal: priceBreakdown.total,
            bulkDiscount: 0,
            bundleDiscount: 0,
            seasonalDiscount: 0,
            total: priceBreakdown.total,
            appliedDiscounts: []
          }}
          quantity={formData.quantity}
          onApplyPromo={() => {}}
          onRemovePromo={() => {}}
        />
      </div>

      <div className="flex justify-center space-x-4">
        {isGuest && (
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => window.location.href = '/signup'}
            className="flex items-center px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
          >
            Create Account
            <ArrowRight className="ml-2 w-4 h-4" />
          </motion.button>
        )}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onStartNewQuote}
          className={`flex items-center px-6 py-3 ${
            isGuest ? 'bg-gray-600 hover:bg-gray-700' : 'bg-orange-600 hover:bg-orange-700'
          } text-white rounded-lg transition-colors`}
        >
          Start New Quote
          <ArrowRight className="ml-2 w-4 h-4" />
        </motion.button>
      </div>
    </motion.div>
  );
}; 