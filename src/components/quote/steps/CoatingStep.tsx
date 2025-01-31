import { coatingTypes, finishTypes } from '../constants';
import { FormData } from '../types';
import { motion } from 'framer-motion';
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
}

export const CoatingStep = ({
  formData,
  errors,
  updateFormData,
}: CoatingStepProps) => (
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
        className={`${selectClasses} ${errors.coatingType ? errorInputClasses : ''}`}
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
        className={`${selectClasses} ${errors.finish ? errorInputClasses : ''}`}
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
      <label className={floatingLabelClasses}>
        Finish Type
      </label>
      {errors.finish && (
        <p className={errorMessageClasses}>{errors.finish}</p>
      )}
    </div>
  </motion.div>
); 