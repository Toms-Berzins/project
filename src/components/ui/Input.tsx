import React from 'react';
import { twMerge } from 'tailwind-merge';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  variant?: 'default' | 'filled';
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    label, 
    error, 
    helperText, 
    className = '', 
    fullWidth = false,
    variant = 'default',
    ...props 
  }, ref) => {
    const baseStyles = "px-4 py-2 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2";
    
    const variants = {
      default: "border border-gray-300 dark:border-gray-600 focus:border-orange-500 dark:focus:border-orange-500 focus:ring-orange-500/20 dark:focus:ring-orange-500/20 bg-white dark:bg-gray-800",
      filled: "bg-gray-100 dark:bg-gray-700 border-transparent focus:bg-white dark:focus:bg-gray-800 focus:ring-orange-500/20"
    };

    const errorStyles = error 
      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" 
      : "";

    const widthStyles = fullWidth ? "w-full" : "";

    return (
      <div className={`${fullWidth ? 'w-full' : ''}`}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={twMerge(
            baseStyles,
            variants[variant],
            errorStyles,
            widthStyles,
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-500">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  variant?: 'default' | 'filled';
}

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ 
    label, 
    error, 
    helperText, 
    className = '', 
    fullWidth = false,
    variant = 'default',
    ...props 
  }, ref) => {
    const baseStyles = "px-4 py-2 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2";
    
    const variants = {
      default: "border border-gray-300 dark:border-gray-600 focus:border-orange-500 dark:focus:border-orange-500 focus:ring-orange-500/20 dark:focus:ring-orange-500/20 bg-white dark:bg-gray-800",
      filled: "bg-gray-100 dark:bg-gray-700 border-transparent focus:bg-white dark:focus:bg-gray-800 focus:ring-orange-500/20"
    };

    const errorStyles = error 
      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" 
      : "";

    const widthStyles = fullWidth ? "w-full" : "";

    return (
      <div className={`${fullWidth ? 'w-full' : ''}`}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={twMerge(
            baseStyles,
            variants[variant],
            errorStyles,
            widthStyles,
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-500">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{helperText}</p>
        )}
      </div>
    );
  }
); 