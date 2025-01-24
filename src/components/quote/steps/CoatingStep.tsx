import { coatingTypes, finishTypes } from '../constants';
import { FormData } from '../types';
import { commonInputClasses, errorInputClasses, labelClasses } from '../styles';

interface CoatingStepProps {
  formData: FormData;
  errors: Record<string, string>;
  updateFormData: (field: string, value: string) => void;
}

export const CoatingStep = ({
  formData,
  errors,
  updateFormData,
}: CoatingStepProps) => (
  <div className="space-y-6">
    <div>
      <label className={labelClasses}>Coating Type</label>
      <select
        value={formData.coating.type}
        onChange={(e) => updateFormData('coating.type', e.target.value)}
        className={`${commonInputClasses} ${
          errors.coatingType ? errorInputClasses : ''
        }`}
        aria-label="Coating Type"
        title="Select coating type"
      >
        <option value="">Select Coating Type</option>
        {coatingTypes.map((type) => (
          <option key={type.id} value={type.id}>
            {type.name}
          </option>
        ))}
      </select>
      {errors.coatingType && (
        <p className="mt-1 text-sm text-red-500">{errors.coatingType}</p>
      )}
    </div>

    <div>
      <label className={labelClasses}>Finish Type</label>
      <select
        value={formData.coating.finish}
        onChange={(e) => updateFormData('coating.finish', e.target.value)}
        className={`${commonInputClasses} ${
          errors.finish ? errorInputClasses : ''
        }`}
        aria-label="Finish Type"
        title="Select finish type"
      >
        <option value="">Select Finish</option>
        {finishTypes.map((finish) => (
          <option key={finish.id} value={finish.id}>
            {finish.name}
          </option>
        ))}
      </select>
      {errors.finish && (
        <p className="mt-1 text-sm text-red-500">{errors.finish}</p>
      )}
    </div>
  </div>
); 