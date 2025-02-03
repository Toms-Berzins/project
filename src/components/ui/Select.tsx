import React from 'react';
import { twMerge } from 'tailwind-merge';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  variant?: 'default' | 'filled';
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ 
    label, 
    error, 
    helperText, 
    className = '', 
    fullWidth = false,
    variant = 'default',
    children,
    ...props 
  }, ref) => {
    const baseStyles = "px-4 py-2 min-h-[44px] rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2";
    
    const variants = {
      default: "border border-gray-300 dark:border-gray-600 focus:border-orange-500 dark:focus:border-orange-500 focus:ring-orange-500/20 dark:focus:ring-orange-500/20 bg-white dark:bg-gray-800",
      filled: "bg-gray-100 dark:bg-gray-700 border-transparent focus:bg-white dark:focus:bg-gray-800 focus:ring-orange-500/20"
    };

    const errorStyles = error 
      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" 
      : "";

    const widthStyles = fullWidth ? "w-full" : "";

    return (
      <div className={`relative ${fullWidth ? 'w-full' : ''}`}>
        <div className="relative">
          <select
            ref={ref}
            className={twMerge(
              baseStyles,
              variants[variant],
              errorStyles,
              widthStyles,
              "appearance-none peer pr-10 focus:ring-2 focus:ring-orange-500/50 dark:focus:ring-orange-400/40 pt-6",
              className
            )}
            role="listbox"
            aria-label={label || "Select an option"}
            {...props}
          >
            {children}
          </select>
          {label && (
            <label className="absolute left-4 top-2 text-sm text-gray-500 dark:text-gray-400 transition-all duration-200 scale-75 origin-left pointer-events-none">
              {label}
            </label>
          )}
          <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-500 dark:text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </span>
        </div>
        {error && (
          <p className="mt-2 text-sm text-red-500">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{helperText}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select; 