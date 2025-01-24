import { FormData, PriceBreakdown } from '../types';
import { commonInputClasses, errorInputClasses, labelClasses } from '../styles';

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
  <div className="space-y-6">
    {priceBreakdown && (
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-semibold mb-4">Price Breakdown</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Base Cost:</span>
            <span>${priceBreakdown.base.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Coating:</span>
            <span>${priceBreakdown.coating.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Finish:</span>
            <span>${priceBreakdown.finish.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Size Adjustment:</span>
            <span>${priceBreakdown.volume.toFixed(2)}</span>
          </div>
          {priceBreakdown.addons > 0 && (
            <div className="flex justify-between">
              <span>Add-ons:</span>
              <span>${priceBreakdown.addons.toFixed(2)}</span>
            </div>
          )}
          <div className="border-t pt-2 mt-2">
            <div className="flex justify-between font-semibold">
              <span>Total Estimate:</span>
              <span>${priceBreakdown.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    )}

    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className={labelClasses}>Name</label>
        <input
          type="text"
          value={formData.contact.name}
          onChange={(e) =>
            updateFormData('contact.name', e.target.value)
          }
          className={`${commonInputClasses} ${
            errors.name ? errorInputClasses : ''
          }`}
          aria-label="Name"
          title="Enter your name"
          placeholder="Enter your name"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-500">{errors.name}</p>
        )}
      </div>

      <div>
        <label className={labelClasses}>Phone</label>
        <input
          type="tel"
          value={formData.contact.phone}
          onChange={(e) =>
            updateFormData('contact.phone', e.target.value)
          }
          className={`${commonInputClasses} ${
            errors.phone ? errorInputClasses : ''
          }`}
          aria-label="Phone"
          title="Enter your phone number"
          placeholder="Enter your phone number"
        />
        {errors.phone && (
          <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
        )}
      </div>
    </div>

    <div>
      <label className={labelClasses}>Email</label>
      <input
        type="email"
        value={formData.contact.email}
        onChange={(e) =>
          updateFormData('contact.email', e.target.value)
        }
        className={`${commonInputClasses} ${
          errors.email ? errorInputClasses : ''
        }`}
        aria-label="Email"
        title="Enter your email"
        placeholder="Enter your email"
      />
      {errors.email && (
        <p className="mt-1 text-sm text-red-500">{errors.email}</p>
      )}
    </div>

    <div>
      <label className={labelClasses}>Additional Comments</label>
      <textarea
        value={formData.contact.comments}
        onChange={(e) =>
          updateFormData('contact.comments', e.target.value)
        }
        rows={4}
        className={commonInputClasses}
        placeholder="Any special instructions or requirements?"
      />
    </div>
  </div>
); 