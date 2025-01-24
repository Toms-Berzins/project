import { colors, addons } from '../constants';
import { FormData } from '../types';
import { commonInputClasses, errorInputClasses, labelClasses } from '../styles';

interface ColorStepProps {
  formData: FormData;
  errors: Record<string, string>;
  updateFormData: (field: string, value: string | string[]) => void;
}

export const ColorStep = ({
  formData,
  errors,
  updateFormData,
}: ColorStepProps) => (
  <div className="space-y-6">
    <div>
      <label className={labelClasses}>Color Type</label>
      <select
        value={formData.color.type}
        onChange={(e) => updateFormData('color.type', e.target.value)}
        className={`${commonInputClasses} ${
          errors.colorType ? errorInputClasses : ''
        }`}
        aria-label="Color Type"
        title="Select color type"
      >
        <option value="">Select Color Type</option>
        {colors.map((color) => (
          <option key={color.id} value={color.id}>
            {color.name}
          </option>
        ))}
      </select>
      {errors.colorType && (
        <p className="mt-1 text-sm text-red-500">{errors.colorType}</p>
      )}
    </div>

    {formData.color.type === 'custom' && (
      <div>
        <label className={labelClasses}>Custom Color Description</label>
        <input
          type="text"
          value={formData.color.custom || ''}
          onChange={(e) => updateFormData('color.custom', e.target.value)}
          className={`${commonInputClasses} ${
            errors.customColor ? errorInputClasses : ''
          }`}
          placeholder="Describe your custom color"
        />
        {errors.customColor && (
          <p className="mt-1 text-sm text-red-500">
            {errors.customColor}
          </p>
        )}
      </div>
    )}

    <div>
      <label className={labelClasses}>Quantity</label>
      <input
        type="number"
        value={formData.quantity}
        onChange={(e) => updateFormData('quantity', e.target.value)}
        min="1"
        className={`${commonInputClasses} ${
          errors.quantity ? errorInputClasses : ''
        }`}
        aria-label="Quantity"
        title="Enter quantity"
        placeholder="Enter quantity"
      />
      {errors.quantity && (
        <p className="mt-1 text-sm text-red-500">{errors.quantity}</p>
      )}
    </div>

    <div>
      <label className={labelClasses}>Additional Options</label>
      <div className="space-y-2">
        {addons.map((addon) => (
          <label key={addon.id} className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.addons.includes(addon.id)}
              onChange={(e) => {
                const newAddons = e.target.checked
                  ? [...formData.addons, addon.id]
                  : formData.addons.filter((id) => id !== addon.id);
                updateFormData('addons', newAddons);
              }}
              className="rounded border-gray-300 text-accent focus:ring-accent"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {addon.name} (+${addon.price})
            </span>
          </label>
        ))}
      </div>
    </div>
  </div>
); 