import { motion } from 'framer-motion';
import { useState } from 'react';
import { commonInputClasses, floatingLabelClasses, inputContainerClasses } from './styles';

interface FloatingInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  touched?: boolean;
}

export const FloatingInput = ({ 
  label, 
  error, 
  touched,
  required,
  value,
  onChange,
  onBlur,
  type = 'text',
  ...props 
}: FloatingInputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const isValid = touched && !error && value;

  return (
    <div className={inputContainerClasses}>
      <div className="relative">
        <input
          {...props}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          onFocus={() => setIsFocused(true)}
          placeholder=" "
          className={`
            ${commonInputClasses}
            ${error && touched ? 'border-red-500 focus:ring-red-200' : ''}
            ${isValid ? 'border-green-500 focus:ring-green-200' : ''}
            ${isFocused ? 'ring-2 ring-accent/20 border-accent' : ''}
          `}
        />
        <label className={`
          ${floatingLabelClasses}
          ${isFocused ? 'text-accent' : ''}
        `}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        
        {/* Validation Icons */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {touched && (
            error ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-red-500"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </motion.div>
            ) : value && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-green-500"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>
            )
          )}
        </div>
      </div>
      
      {/* Error Message */}
      {error && touched && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1 text-sm text-red-500"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}; 