import { coatingTypes, finishTypes, materials } from '../constants';
import { FormData } from '../types';
import { motion } from 'framer-motion';
import { PriceSummary } from '../PriceSummary';
import { ArrowRight } from 'lucide-react';
import { 
  selectClasses,
  errorInputClasses,
  floatingLabelClasses,
  inputContainerClasses,
  errorMessageClasses
} from '../styles';

interface CoatingStepProps {
  formData: FormData;
  errors: Record<string, string>;
  updateFormData: (field: string, value: string) => void;
  onNext: () => void;
}

// Add interface for material type
interface Material {
  id: string;
  name: string;
  basePrice: number;
}

export const CoatingStep = ({
  formData,
  errors,
  updateFormData,
  onNext,
}: CoatingStepProps) => {
  const selectedMaterial = materials.find((m: Material) => m.id === formData.material);
  const selectedCoating = coatingTypes.find(c => c.id === formData.coating.type);
  const selectedFinish = finishTypes.find(f => f.id === formData.coating.finish);
  
  const basePrice = selectedMaterial?.basePrice || 0;
  const coatingPrice = selectedCoating ? basePrice * selectedCoating.priceMultiplier - basePrice : 0;
  const finishPrice = selectedFinish?.priceAdd || 0;

  return (
    <div className="grid grid-cols-1 gap-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="space-y-8"
      >
        <div className={inputContainerClasses}>
          <select
            value={formData.coating.type}
            onChange={(e) => updateFormData('coating.type', e.target.value)}
            className={`${selectClasses} ${errors.coatingType ? errorInputClasses : ''} py-3 sm:py-2`}
            aria-label="Coating Type"
            title="Select coating type"
          >
            <option value="">Select Coating Type</option>
            {coatingTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name} (+${((type.priceMultiplier - 1) * 100).toFixed(0)}%)
              </option>
            ))}
          </select>
          <label className={floatingLabelClasses}>
            Coating Type
          </label>
          {errors.coatingType && (
            <p className={errorMessageClasses}>{errors.coatingType}</p>
          )}
        </div>

        <div className={inputContainerClasses}>
          <select
            value={formData.coating.finish}
            onChange={(e) => updateFormData('coating.finish', e.target.value)}
            className={`${selectClasses} ${errors.finish ? errorInputClasses : ''} py-3 sm:py-2`}
            aria-label="Finish Type"
            title="Select finish type"
          >
            <option value="">Select Finish Type</option>
            {finishTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name} {type.priceAdd > 0 ? `(+€${type.priceAdd})` : '(Included)'}
              </option>
            ))}
          </select>
          <label className={floatingLabelClasses}>
            Finish Type
          </label>
          {errors.finish && (
            <p className={errorMessageClasses}>{errors.finish}</p>
          )}
        </div>

        <div className="flex justify-end">
          <motion.button
            type="button"
            onClick={onNext}
            whileTap={{ scale: 0.97 }}
            className="flex items-center bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 sm:py-2 min-h-[50px] rounded-lg transition-colors w-full sm:w-auto justify-center sm:justify-start"
          >
            Next
            <ArrowRight className="ml-2 w-4 h-4" />
          </motion.button>
        </div>
      </motion.div>

      {/* Mobile Price Summary */}
      <div className="block md:hidden">
        <motion.details
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="overflow-hidden bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg rounded-xl shadow-xl"
        >
          <summary className="text-lg font-semibold p-4 cursor-pointer text-gray-900 dark:text-white">
            View Price Breakdown
          </summary>
          <div className="px-4 pb-4">
            <PriceSummary
              basePrice={basePrice}
              items={[
                {
                  label: 'Material',
                  amount: basePrice * formData.quantity,
                  details: selectedMaterial?.name
                },
                ...(selectedCoating ? [{
                  label: 'Coating',
                  amount: coatingPrice * formData.quantity,
                  details: selectedCoating.name
                }] : []),
                ...(selectedFinish ? [{
                  label: 'Finish',
                  amount: finishPrice * formData.quantity,
                  details: selectedFinish.name
                }] : [])
              ]}
              priceBreakdown={{
                subtotal: (basePrice + coatingPrice + finishPrice) * formData.quantity,
                bulkDiscount: 0,
                bundleDiscount: 0,
                seasonalDiscount: 0,
                total: (basePrice + coatingPrice + finishPrice) * formData.quantity,
                appliedDiscounts: []
              }}
              quantity={formData.quantity}
              onApplyPromo={() => {}}
              onRemovePromo={() => {}}
            />
          </div>
        </motion.details>
      </div>

      {/* Desktop Price Summary */}
      <div className="hidden md:block">
        <PriceSummary
          basePrice={basePrice}
          items={[
            {
              label: 'Material',
              amount: basePrice * formData.quantity,
              details: selectedMaterial?.name
            },
            ...(selectedCoating ? [{
              label: 'Coating',
              amount: coatingPrice * formData.quantity,
              details: selectedCoating.name
            }] : []),
            ...(selectedFinish ? [{
              label: 'Finish',
              amount: finishPrice * formData.quantity,
              details: selectedFinish.name
            }] : [])
          ]}
          priceBreakdown={{
            subtotal: (basePrice + coatingPrice + finishPrice) * formData.quantity,
            bulkDiscount: 0,
            bundleDiscount: 0,
            seasonalDiscount: 0,
            total: (basePrice + coatingPrice + finishPrice) * formData.quantity,
            appliedDiscounts: []
          }}
          quantity={formData.quantity}
          onApplyPromo={() => {}}
          onRemovePromo={() => {}}
        />
      </div>
    </div>
  );
}; 