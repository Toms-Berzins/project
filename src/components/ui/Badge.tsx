import React from 'react';
import { twMerge } from 'tailwind-merge';
import { motion } from 'framer-motion';

interface BadgeProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  rounded?: 'default' | 'full';
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  icon,
  variant = 'default',
  size = 'md',
  rounded = 'default',
  className = '',
}) => {
  const baseStyles = "inline-flex items-center justify-center font-medium flex-wrap transition-colors duration-200";

  const variants = {
    default: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
    primary: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
    secondary: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    success: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    error: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs sm:px-2.5 sm:py-1",
    md: "px-2.5 py-0.5 text-sm sm:px-3 sm:py-1",
    lg: "px-3 py-1 text-base sm:px-4 sm:py-1.5"
  };

  const roundedStyles = {
    default: "rounded",
    full: "rounded-full"
  };

  return (
    <motion.span
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={twMerge(
        baseStyles,
        variants[variant],
        sizes[size],
        roundedStyles[rounded],
        className
      )}
    >
      {icon && <span className="mr-1.5 inline-flex items-center">{icon}</span>}
      {children}
    </motion.span>
  );
};

export default Badge; 