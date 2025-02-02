import React, { useState, useEffect } from 'react';
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
    const baseStyles = "peer px-3 py-2 sm:px-4 sm:py-3 rounded-lg min-h-[40px] transition-all duration-200 focus:outline-none focus:ring-2 placeholder:text-transparent";
    
    const variants = {
      default: "border border-gray-300 dark:border-gray-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/40 dark:focus:border-orange-400 dark:focus:ring-orange-400/30 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow-none focus:shadow-lg dark:focus:shadow-orange-400/20",
      filled: "bg-gray-100 dark:bg-gray-800 border-transparent focus:bg-white dark:focus:bg-gray-900 focus:ring-2 focus:ring-orange-500/40 text-gray-900 dark:text-gray-100 shadow-none focus:shadow-lg dark:focus:shadow-orange-400/20"
    };

    const errorStyles = error 
      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20 focus:shadow-red-500/20" 
      : "";

    const widthStyles = fullWidth ? "w-full" : "";

    return (
      <div className={`${fullWidth ? 'w-full' : ''}`}>
        <div className="relative">
          <input
            ref={ref}
            placeholder=" "
            className={twMerge(
              baseStyles,
              variants[variant],
              errorStyles,
              widthStyles,
              className
            )}
            {...props}
          />
          {label && (
            <label 
              className={`
                absolute left-3 sm:left-4 -top-2.5 px-1 text-sm 
                transition-all duration-200 
                bg-white dark:bg-gray-900
                text-gray-500 dark:text-gray-400
                peer-placeholder-shown:text-base
                peer-placeholder-shown:top-2.5 sm:peer-placeholder-shown:top-3
                peer-placeholder-shown:text-gray-500
                peer-focus:-top-2.5
                peer-focus:text-sm
                peer-focus:text-orange-500 dark:peer-focus:text-orange-400
                ${variant === 'filled' && 'bg-gray-100 dark:bg-gray-800 peer-focus:bg-white dark:peer-focus:bg-gray-900'}
              `}
            >
              {label}
            </label>
          )}
        </div>
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
  maxLength?: number;
}

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ 
    label, 
    error, 
    helperText, 
    className = '', 
    fullWidth = false,
    variant = 'default',
    maxLength = 500,
    onChange,
    ...props 
  }, ref) => {
    const [charCount, setCharCount] = useState(0);
    const textAreaRef = React.useRef<HTMLTextAreaElement | null>(null);

    // Combine refs to handle both forwarded ref and internal ref
    const setRefs = (element: HTMLTextAreaElement | null) => {
      // Set the internal ref
      textAreaRef.current = element;
      // Handle forwarded ref
      if (typeof ref === 'function') {
        ref(element);
      } else if (ref) {
        ref.current = element;
      }
    };

    const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const target = e.target;
      // Reset height to auto to get the correct scrollHeight
      target.style.height = 'auto';
      // Set new height based on scrollHeight
      target.style.height = `${target.scrollHeight}px`;
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCharCount(e.target.value.length);
      onChange?.(e);
    };

    // Initialize height on mount and value changes
    useEffect(() => {
      if (textAreaRef.current) {
        handleInput({ target: textAreaRef.current } as React.ChangeEvent<HTMLTextAreaElement>);
      }
    }, [props.value, props.defaultValue]);

    const baseStyles = "peer px-3 py-2 sm:px-4 sm:py-3 rounded-lg min-h-[80px] transition-all duration-200 focus:outline-none focus:ring-2 placeholder:text-transparent resize-none overflow-hidden";
    
    const variants = {
      default: "border border-gray-300 dark:border-gray-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/40 dark:focus:border-orange-400 dark:focus:ring-orange-400/30 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow-none focus:shadow-lg dark:focus:shadow-orange-400/20",
      filled: "bg-gray-100 dark:bg-gray-800 border-transparent focus:bg-white dark:focus:bg-gray-900 focus:ring-2 focus:ring-orange-500/40 text-gray-900 dark:text-gray-100 shadow-none focus:shadow-lg dark:focus:shadow-orange-400/20"
    };

    const errorStyles = error 
      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20 focus:shadow-red-500/20" 
      : "";

    const widthStyles = fullWidth ? "w-full" : "";

    return (
      <div className={`${fullWidth ? 'w-full' : ''}`}>
        <div className="relative">
          <textarea
            ref={setRefs}
            placeholder=" "
            maxLength={maxLength}
            onChange={handleChange}
            onInput={handleInput}
            className={twMerge(
              baseStyles,
              variants[variant],
              errorStyles,
              widthStyles,
              className
            )}
            {...props}
          />
          {label && (
            <label 
              className={`
                absolute left-3 sm:left-4 -top-2.5 px-1 text-sm
                transition-all duration-200 
                bg-white dark:bg-gray-900
                text-gray-500 dark:text-gray-400
                peer-placeholder-shown:text-base
                peer-placeholder-shown:top-2.5 sm:peer-placeholder-shown:top-3
                peer-placeholder-shown:text-gray-500
                peer-focus:-top-2.5
                peer-focus:text-sm
                peer-focus:text-orange-500 dark:peer-focus:text-orange-400
                ${variant === 'filled' && 'bg-gray-100 dark:bg-gray-800 peer-focus:bg-white dark:peer-focus:bg-gray-900'}
              `}
            >
              {label}
            </label>
          )}
        </div>
        <div className="flex justify-between items-center mt-1">
          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}
          {helperText && !error && (
            <p className="text-sm text-gray-500 dark:text-gray-400">{helperText}</p>
          )}
          <p className="text-xs text-gray-500 dark:text-gray-400 ml-auto">
            {charCount}/{maxLength} characters
          </p>
        </div>
      </div>
    );
  }
);

TextArea.displayName = 'TextArea'; 