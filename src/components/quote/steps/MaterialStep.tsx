import { materials } from '../constants';
import { FormData } from '../types';
import { commonInputClasses, errorInputClasses, labelClasses } from '../styles';

interface MaterialStepProps {
  formData: FormData;
  errors: Record<string, string>;
  updateFormData: (field: string, value: string) => void;
}

export const MaterialStep = ({
  formData,
  errors,
  updateFormData,
}: MaterialStepProps) => (
  <div className="space-y-6">
    <div>
      <label className={labelClasses}>Material Type</label>
      <select
        value={formData.material}
        onChange={(e) => updateFormData('material', e.target.value)}
        className={`${commonInputClasses} ${errors.material ? errorInputClasses : ''}`}
        aria-label="Material Type"
        title="Select material type"
      >
        <option value="">Select Material</option>
        {materials.map((material) => (
          <option key={material.id} value={material.id}>
            {material.name}
          </option>
        ))}
      </select>
      {errors.material && (
        <p className="mt-1 text-sm text-red-500">{errors.material}</p>
      )}
    </div>

    <div className="space-y-4">
      <div className="flex justify-end">
        <label className={`${labelClasses} inline-flex items-center`}>
          Unit:
          <select
            value={formData.dimensions.unit}
            onChange={(e) => updateFormData('dimensions.unit', e.target.value)}
            className="ml-2 p-1 rounded border dark:bg-gray-800"
          >
            <option value="inches">inches</option>
            <option value="cm">cm</option>
          </select>
        </label>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {['length', 'width', 'height'].map((dim) => (
          <div key={dim}>
            <label className={labelClasses}>
              {dim.charAt(0).toUpperCase() + dim.slice(1)}
            </label>
            <input
              type="number"
              value={formData.dimensions[dim as keyof typeof formData.dimensions]}
              onChange={(e) =>
                updateFormData(`dimensions.${dim}`, e.target.value)
              }
              min="0"
              step="0.1"
              className={`${commonInputClasses} ${
                errors[dim] ? errorInputClasses : ''
              }`}
              aria-label={`${dim.charAt(0).toUpperCase() + dim.slice(1)} dimension`}
              title={`Enter ${dim} dimension`}
              placeholder={`Enter ${dim}`}
            />
            {errors[dim] && (
              <p className="mt-1 text-sm text-red-500">{errors[dim]}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  </div>
); 