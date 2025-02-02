import { motion } from 'framer-motion';
import { materials } from '../constants';
import { FloatingInput } from '../FloatingInput';
import { PriceSummary } from '../PriceSummary';
import { calculateTotal } from '../constants';
import { useState } from 'react';
import { ArrowRight } from 'lucide-react';

interface MaterialStepProps {
  onNext: () => void;
  formData: {
    material: string;
    dimensions: {
      length: string;
      width: string;
      height: string;
    };
    promoCode?: string;
    quantity: number;
  };
  onChange: (data: Partial<MaterialStepProps['formData']>) => void;
}

export const MaterialStep = ({ onNext, formData, onChange }: MaterialStepProps) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const selectedMaterial = materials.find(m => m.id === formData.material);
  const basePrice = selectedMaterial?.basePrice || 0;

  // Calculate surface area
  const length = parseFloat(formData.dimensions.length) || 0;
  const width = parseFloat(formData.dimensions.width) || 0;
  const height = parseFloat(formData.dimensions.height) || 0;
  // Convert cubic mm to cubic meters for pricing
  const surfaceArea = (length * width * height) / 1000000;

  const priceBreakdown = calculateTotal({
    basePrice: basePrice * surfaceArea,
    quantity: formData.quantity || 1,
    promoCode: formData.promoCode,
    additionalOptions: {},
  });

  const validateField = (name: string, value: string | number) => {
    const newErrors = { ...errors };
    
    const validateDimension = (val: string | number, fieldName: string) => {
      const numValue = parseFloat(val as string);
      if (!numValue || numValue <= 0) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be greater than 0`;
      }
      if (numValue > 10000) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} cannot exceed 10,000mm`;
      }
      return '';
    };

    const validateQuantity = (val: string | number) => {
      const qty = parseInt(val as string);
      if (!qty || qty < 1) {
        return 'Quantity must be at least 1';
      }
      if (qty > 1000) {
        return 'Quantity cannot exceed 1000';
      }
      return '';
    };
    
    switch (name) {
      case 'material': {
        if (!value) {
          newErrors.material = 'Please select a material';
        } else {
          delete newErrors.material;
        }
        break;
      }
      case 'length':
      case 'width':
      case 'height': {
        const error = validateDimension(value, name);
        if (error) {
          newErrors[name] = error;
        } else {
          delete newErrors[name];
        }
        break;
      }
      case 'quantity': {
        const error = validateQuantity(value);
        if (error) {
          newErrors.quantity = error;
        } else {
          delete newErrors.quantity;
        }
        break;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleMaterialChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    validateField('material', value);
    onChange({ material: value });
  };

  const handleDimensionChange = (dimension: 'length' | 'width' | 'height', value: string) => {
    validateField(dimension, value);
    onChange({
      dimensions: {
        ...formData.dimensions,
        [dimension]: value
      }
    });
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    validateField('quantity', value);
    onChange({ quantity: parseInt(value) || 1 });
  };

  const isValid = 
    formData.material && 
    formData.dimensions.length && 
    formData.dimensions.width && 
    formData.dimensions.height &&
    Object.keys(errors).length === 0;

  return (
    <div className="grid grid-cols-1 gap-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="text-center lg:text-left">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Material & Dimensions
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Enter the dimensions of your project in millimeters (mm)
          </p>
        </div>

        <div className="space-y-6">
          {/* Material Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Material Type
            </label>
            <select
              value={formData.material}
              onChange={handleMaterialChange}
              className={`w-full px-3 py-2 rounded-lg border 
                ${errors.material ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}
                bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent
                transition-all duration-200`}
              aria-label="Select material type"
              aria-invalid="false"
              data-error={errors.material ? "true" : "false"}
            >
              <option value="">Select Material</option>
              {materials.map(material => (
                <option key={material.id} value={material.id}>
                  {material.name} (Base: ${material.basePrice}/m³)
                </option>
              ))}
            </select>
            {errors.material && (
              <p className="mt-1 text-sm text-red-500">{errors.material}</p>
            )}
          </div>

          {/* Dimensions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Dimensions (mm)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <FloatingInput
                type="number"
                label="Length (mm)"
                value={formData.dimensions.length}
                onChange={(e) => handleDimensionChange('length', e.target.value)}
                min="1"
                max="10000"
                step="1"
                required
                error={errors.length}
                className="py-3 sm:py-2"
              />
              <FloatingInput
                type="number"
                label="Width (mm)"
                value={formData.dimensions.width}
                onChange={(e) => handleDimensionChange('width', e.target.value)}
                min="1"
                max="10000"
                step="1"
                required
                error={errors.width}
                className="py-3 sm:py-2"
              />
              <FloatingInput
                type="number"
                label="Height (mm)"
                value={formData.dimensions.height}
                onChange={(e) => handleDimensionChange('height', e.target.value)}
                min="1"
                max="10000"
                step="1"
                required
                error={errors.height}
                className="py-3 sm:py-2"
              />
            </div>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              All dimensions should be in millimeters (1 inch = 25.4 mm)
            </p>
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Quantity
            </label>
            <FloatingInput
              type="number"
              label="Quantity"
              value={formData.quantity?.toString() || '1'}
              onChange={handleQuantityChange}
              min="1"
              max="1000"
              step="1"
              required
              error={errors.quantity}
            />
          </div>

          {/* Price Summary and Promo Code */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
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
                    basePrice={basePrice * surfaceArea}
                    quantity={formData.quantity || 1}
                    items={[
                      {
                        label: 'Material',
                        amount: basePrice * surfaceArea,
                        details: selectedMaterial?.name
                      },
                      {
                        label: 'Dimensions',
                        amount: 0,
                        details: `${length} × ${width} × ${height} mm`
                      }
                    ]}
                    priceBreakdown={priceBreakdown}
                    promoCode={formData.promoCode}
                    onApplyPromo={(code) => onChange({ promoCode: code })}
                    onRemovePromo={() => onChange({ promoCode: undefined })}
                  />
                </div>
              </motion.details>
            </div>

            {/* Desktop Price Summary */}
            <div className="hidden md:block">
              <PriceSummary
                basePrice={basePrice * surfaceArea}
                quantity={formData.quantity || 1}
                items={[
                  {
                    label: 'Material',
                    amount: basePrice * surfaceArea,
                    details: selectedMaterial?.name
                  },
                  {
                    label: 'Dimensions',
                    amount: 0,
                    details: `${length} × ${width} × ${height} mm`
                  }
                ]}
                priceBreakdown={priceBreakdown}
                promoCode={formData.promoCode}
                onApplyPromo={(code) => onChange({ promoCode: code })}
                onRemovePromo={() => onChange({ promoCode: undefined })}
              />
            </div>
          </div>

          {/* Next Step Button */}
          <div className="flex justify-end pt-4">
            <motion.button
              onClick={onNext}
              disabled={!isValid}
              whileTap={{ scale: 0.97 }}
              className="w-full sm:w-auto px-6 py-3 sm:py-2 min-h-[50px] bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              Next Step
              <ArrowRight className="ml-2 w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}; 