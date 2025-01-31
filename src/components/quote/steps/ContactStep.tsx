import { FormData, PriceBreakdown } from '../types';
import { motion } from 'framer-motion';
import { 
  commonInputClasses,
  errorInputClasses,
  floatingLabelClasses,
  inputContainerClasses,
  errorMessageClasses
} from '../styles';

interface ContactStepProps {
  formData: FormData;
  errors: Record<string, string>;
  priceBreakdown: PriceBreakdown | null;
  updateFormData: (field: string, value: string) => void;
}

export const ContactStep = ({
  formData,
  errors,
  priceBreakdown,
  updateFormData,
}: ContactStepProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="space-y-8"
  >
    {priceBreakdown && (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Price Breakdown
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">Base Cost:</span>
            <span className="font-medium text-gray-900 dark:text-white">
              ${priceBreakdown.base.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">Coating:</span>
            <span className="font-medium text-gray-900 dark:text-white">
              ${priceBreakdown.coating.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">Finish:</span>
            <span className="font-medium text-gray-900 dark:text-white">
              ${priceBreakdown.finish.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">Size Adjustment:</span>
            <span className="font-medium text-gray-900 dark:text-white">
              ${priceBreakdown.volume.toFixed(2)}
            </span>
          </div>
          {priceBreakdown.addons > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Add-ons:</span>
              <span className="font-medium text-gray-900 dark:text-white">
                ${priceBreakdown.addons.toFixed(2)}
              </span>
            </div>
          )}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                Total Estimate:
              </span>
              <span className="text-lg font-bold text-accent">
                ${priceBreakdown.total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    )}

    <div className="grid grid-cols-2 gap-6">
      <div className={inputContainerClasses}>
        <input
          type="text"
          value={formData.contact.name}
          onChange={(e) => updateFormData('contact.name', e.target.value)}
          className={`${commonInputClasses} ${errors.name ? errorInputClasses : ''}`}
          placeholder="Enter your name"
        />
        <label className={floatingLabelClasses}>
          Name
        </label>
        {errors.name && (
          <p className={errorMessageClasses}>{errors.name}</p>
        )}
      </div>

      <div className={inputContainerClasses}>
        <input
          type="tel"
          value={formData.contact.phone}
          onChange={(e) => updateFormData('contact.phone', e.target.value)}
          className={`${commonInputClasses} ${errors.phone ? errorInputClasses : ''}`}
          placeholder="Enter your phone number"
        />
        <label className={floatingLabelClasses}>
          Phone
        </label>
        {errors.phone && (
          <p className={errorMessageClasses}>{errors.phone}</p>
        )}
      </div>
    </div>

    <div className={inputContainerClasses}>
      <input
        type="email"
        value={formData.contact.email}
        onChange={(e) => updateFormData('contact.email', e.target.value)}
        className={`${commonInputClasses} ${errors.email ? errorInputClasses : ''}`}
        placeholder="Enter your email"
      />
      <label className={floatingLabelClasses}>
        Email
      </label>
      {errors.email && (
        <p className={errorMessageClasses}>{errors.email}</p>
      )}
    </div>

    <div className={inputContainerClasses}>
      <textarea
        value={formData.contact.comments}
        onChange={(e) => updateFormData('contact.comments', e.target.value)}
        rows={4}
        className={`${commonInputClasses} min-h-[120px] resize-y`}
        placeholder="Any special instructions or requirements?"
      />
      <label className={floatingLabelClasses}>
        Additional Comments
      </label>
    </div>
  </motion.div>
); 