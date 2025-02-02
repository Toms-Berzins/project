import React from 'react';
import { twMerge } from 'tailwind-merge';
import { motion } from 'framer-motion';

type PaddingSize = 'none' | 'sm' | 'md' | 'lg';
type CardVariant = 'default' | 'hover' | 'interactive';

export interface CardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  className?: string;
  padding?: PaddingSize;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const Card: React.FC<CardProps> = ({
  children,
  className,
  variant = 'default',
  padding = 'md',
  onClick,
  onMouseEnter,
  onMouseLeave
}) => {
  const baseStyles = "bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 min-h-[100px]";
  
  const variants: Record<CardVariant, string> = {
    default: "shadow-md dark:shadow-gray-900/30 transition-all",
    hover: "shadow-md sm:hover:shadow-lg transition-all duration-300 dark:shadow-gray-900/30",
    interactive: "shadow-md sm:hover:shadow-xl sm:hover:shadow-orange-500/20 sm:active:scale-[0.97] transition-all cursor-pointer dark:shadow-gray-900/30"
  };

  const paddings: Record<PaddingSize, string> = {
    none: "",
    sm: "p-3 sm:p-4 lg:p-6",
    md: "p-4 sm:p-6 lg:p-8",
    lg: "p-6 sm:p-8 lg:p-10"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
      className={twMerge(
        baseStyles,
        variants[variant],
        paddings[padding],
        className
      )}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      {...onClick && {
        role: "button",
        "aria-disabled": "false",
        tabIndex: 0
      }}
    >
      {children}
    </motion.div>
  );
};

export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className 
}) => (
  <div className={twMerge("mb-4 space-y-1", className)}>
    {children}
  </div>
);

export const CardTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className 
}) => (
  <h3 className={twMerge("text-xl font-semibold text-gray-900 dark:text-gray-50", className)}>
    {children}
  </h3>
);

export const CardDescription: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className 
}) => (
  <p className={twMerge("text-sm text-gray-700 dark:text-gray-300", className)}>
    {children}
  </p>
);

export const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className 
}) => (
  <div className={twMerge("text-gray-700 dark:text-gray-200", className)}>
    {children}
  </div>
);

export const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className 
}) => (
  <div className={twMerge("mt-4 flex items-center space-x-4", className)}>
    {children}
  </div>
);

export default Card; 