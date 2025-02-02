import { colors, addons, materials, coatingTypes, finishTypes } from '../constants';
import { FormData } from '../types';
import { motion } from 'framer-motion';
import { PriceSummary } from '../PriceSummary';
import { ArrowRight } from 'lucide-react';
import { 
  commonInputClasses,
  selectClasses,
  errorInputClasses,
  floatingLabelClasses,
  inputContainerClasses,
  errorMessageClasses
} from '../styles';

interface ColorStepProps {
  formData: FormData;
  errors: Record<string, string>;
  updateFormData: (field: string, value: string | string[]) => void;
  onNext: () => void;
}

export const ColorStep = ({
  formData,
  errors,
  updateFormData,
  onNext,
}: ColorStepProps) => {
  const selectedMaterial = materials.find(m => m.id === formData.material);
  const selectedCoating = coatingTypes.find(c => c.id === formData.coating.type);
  const selectedFinish = finishTypes.find(f => f.id === formData.coating.finish);
  const selectedColor = colors.find(c => c.id === formData.color.type);
  
  const basePrice = selectedMaterial?.basePrice || 0;
  const coatingPrice = selectedCoating ? basePrice * selectedCoating.priceMultiplier - basePrice : 0;
  const finishPrice = selectedFinish?.priceAdd || 0;
  const colorMultiplier = selectedColor?.priceMultiplier || 1;
  
  const addonsTotal = formData.addons.reduce((total, addonId) => {
    const addon = addons.find(a => a.id === addonId);
    return total + (addon?.price || 0);
  }, 0);

  const subtotal = ((basePrice + coatingPrice + finishPrice) * colorMultiplier) * formData.quantity;
  const total = subtotal + addonsTotal;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="space-y-8"
      >
        <div className={inputContainerClasses}>
          <select
            value={formData.color.type}
            onChange={(e) => updateFormData('color.type', e.target.value)}
            className={`${selectClasses} ${errors.colorType ? errorInputClasses : ''}`}
            aria-label="Color Type"
            title="Select color type"
          >
            <option value="">Select Color Type</option>
            {colors.map((color) => (
              <option key={color.id} value={color.id}>
                {color.name} {color.priceMultiplier > 1 ? `(+${((color.priceMultiplier - 1) * 100).toFixed(0)}%)` : '(Standard)'}
              </option>
            ))}
          </select>
          <label className={floatingLabelClasses}>
            Color Type
          </label>
          {errors.colorType && (
            <p className={errorMessageClasses}>{errors.colorType}</p>
          )}
        </div>

        {formData.color.type === 'custom' && (
          <div className={inputContainerClasses}>
            <input
              type="text"
              value={formData.color.custom || ''}
              onChange={(e) => updateFormData('color.custom', e.target.value)}
              className={`${commonInputClasses} ${errors.customColor ? errorInputClasses : ''}`}
              placeholder="Describe your custom color"
            />
            <label className={floatingLabelClasses}>
              Custom Color Description
            </label>
            {errors.customColor && (
              <p className={errorMessageClasses}>{errors.customColor}</p>
            )}
          </div>
        )}

        <div className={inputContainerClasses}>
          <input
            type="number"
            value={formData.quantity}
            onChange={(e) => updateFormData('quantity', e.target.value)}
            min="1"
            className={`${commonInputClasses} ${errors.quantity ? errorInputClasses : ''}`}
            placeholder="Enter quantity"
          />
          <label className={floatingLabelClasses}>
            Quantity
          </label>
          {errors.quantity && (
            <p className={errorMessageClasses}>{errors.quantity}</p>
          )}
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Additional Options
          </h3>
          <div className="space-y-3">
            {addons.map((addon) => (
              <label
                key={addon.id}
                className="flex items-center p-4 border rounded-lg hover:border-accent/50 transition-colors cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={formData.addons.includes(addon.id)}
                  onChange={(e) => {
                    const newAddons = e.target.checked
                      ? [...formData.addons, addon.id]
                      : formData.addons.filter((id) => id !== addon.id);
                    updateFormData('addons', newAddons);
                  }}
                  className="w-5 h-5 rounded border-gray-300 text-accent focus:ring-accent"
                />
                <div className="ml-3 flex-grow">
                  <span className="text-gray-900 dark:text-white font-medium group-hover:text-accent transition-colors">
                    {addon.name}
                  </span>
                  <span className="ml-2 text-sm text-gray-500">
                    (+€{addon.price})
                  </span>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={onNext}
            className="flex items-center bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Next
            <ArrowRight className="ml-2 w-4 h-4" />
          </button>
        </div>
      </motion.div>

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
            }] : []),
            ...(selectedColor && colorMultiplier > 1 ? [{
              label: 'Color Premium',
              amount: ((basePrice + coatingPrice + finishPrice) * (colorMultiplier - 1)) * formData.quantity,
              details: selectedColor.name
            }] : []),
            ...(addonsTotal > 0 ? [{
              label: 'Add-ons',
              amount: addonsTotal,
              details: formData.addons
                .map(id => addons.find(a => a.id === id)?.name)
                .filter(Boolean)
                .join(', ')
            }] : [])
          ]}
          priceBreakdown={{
            subtotal: total,
            bulkDiscount: 0,
            bundleDiscount: 0,
            seasonalDiscount: 0,
            total: total,
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