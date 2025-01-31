import { motion, HTMLMotionProps } from 'framer-motion';

interface QuoteButtonProps extends Omit<HTMLMotionProps<"button">, "disabled"> {
  isLoading?: boolean;
  variant?: 'primary' | 'secondary';
  icon?: React.ReactNode;
  disabled?: boolean;
}

const LoadingSpinner = () => (
  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

export const QuoteButton = ({ 
  children, 
  isLoading, 
  variant = 'primary',
  icon,
  disabled,
  className = '',
  ...props 
}: QuoteButtonProps) => {
  const baseClasses = `
    relative
    px-6 
    py-3 
    rounded-lg 
    font-medium 
    transition-all 
    duration-200
    disabled:opacity-50 
    disabled:cursor-not-allowed
    flex 
    items-center 
    justify-center 
    gap-2
    min-w-[120px]
  `;

  const variantClasses = {
    primary: `
      bg-accent 
      text-white 
      hover:bg-accent/90
      shadow-lg
      shadow-accent/20
      hover:shadow-accent/30
      disabled:hover:bg-accent
    `,
    secondary: `
      bg-gray-100 
      dark:bg-gray-800 
      text-gray-900 
      dark:text-white
      hover:bg-gray-200 
      dark:hover:bg-gray-700
      disabled:hover:bg-gray-100
      dark:disabled:hover:bg-gray-800
    `
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          {icon && <span className="text-xl">{icon}</span>}
          {children}
        </>
      )}
      
      {/* Hover glow effect */}
      <motion.div
        className="absolute inset-0 rounded-lg bg-white"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 0.1 }}
        transition={{ duration: 0.2 }}
      />
      
      {/* Click ripple effect */}
      <motion.div
        className="absolute inset-0 rounded-lg bg-white"
        initial={{ scale: 0, opacity: 0.3 }}
        whileTap={{ scale: 2, opacity: 0 }}
        transition={{ duration: 0.5 }}
      />
    </motion.button>
  );
}; 