import { FormData } from '../types';
import { motion } from 'framer-motion';
import { PriceSummary } from '../PriceSummary';
import { ArrowRight } from 'lucide-react';
import { materials, coatingTypes, finishTypes, colors, addons } from '../constants';
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
  updateFormData: (field: string, value: string) => void;
  onNext: (e: React.FormEvent) => void;
}

export const ContactStep = ({
  formData,
  errors,
  updateFormData,
  onNext,
}: ContactStepProps) => {
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

        <div className="flex justify-end">
          <button
            type="button"
            onClick={(e) => onNext(e)}
            className="flex items-center bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Submit Quote
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