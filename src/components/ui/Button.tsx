import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

// Media query hook for touch devices and screen size
const useDeviceContext = () => {
  const [isTouch, setIsTouch] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkDevice = () => {
      setIsTouch('ontouchstart' in window);
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);
  
  return { isTouch, isMobile };
};

interface InteractiveButtonProps extends HTMLMotionProps<"button"> {
  variant?: 'primary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  fullWidth?: boolean;
  className?: string;
  children: React.ReactNode;
}

export const InteractiveButton = ({ 
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'right',
  loading = false,
  fullWidth = false,
  className = "",
  children,
  onClick,
  disabled,
  ...props 
}: InteractiveButtonProps) => {
  const [ripple, setRipple] = useState<{ x: number; y: number } | null>(null);
  const { isTouch, isMobile } = useDeviceContext();

  // Enhanced tap animation configuration
  const tapConfig = {
    scale: isMobile ? 0.94 : 0.98,
    transition: { duration: 0.15, ease: "easeOut" }
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    setRipple({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setTimeout(() => setRipple(null), 600);
    
    onClick?.(e);
  };

  const baseStyles = "relative overflow-hidden transform-gpu touch-manipulation font-medium rounded-lg transition-all duration-300";
  
  // Enhanced responsive size styles with adaptive padding
  const sizeStyles = {
    sm: `min-w-[100px] max-w-[250px] text-sm
      ${isMobile ? 
        "px-3 py-2.5 min-h-[44px]" : 
        "px-4 py-2 sm:px-4 sm:py-2.5 md:px-5 md:py-2.5 min-h-[36px]"}`,
    md: `min-w-[120px] max-w-[300px] text-base
      ${isMobile ? 
        "px-4 py-3 min-h-[50px]" : 
        "px-5 py-2.5 sm:px-6 sm:py-3 md:px-7 md:py-3.5 min-h-[42px]"}`,
    lg: `min-w-[140px] max-w-[350px] text-lg
      ${isMobile ? 
        "px-5 py-4 min-h-[56px]" : 
        "px-6 py-3 sm:px-8 sm:py-4 md:px-10 md:py-4.5 min-h-[48px]"}`
  };

  // Enhanced variant styles with dark mode support
  const variantStyles = {
    primary: `bg-gradient-to-r from-orange-500 to-orange-600 text-white 
      dark:from-orange-600 dark:to-orange-700 dark:text-white
      ${!isMobile ? 'hover:shadow-lg hover:shadow-orange-500/20 dark:hover:shadow-orange-600/20 hover:bg-opacity-90' : 'active:scale-[0.94]'}`,
    ghost: `bg-gray-800/50 text-gray-300 
      dark:bg-gray-700/50 dark:text-gray-200
      ${!isMobile ? 'hover:bg-gray-800/70 hover:text-white dark:hover:bg-gray-600/70' : 'active:bg-gray-800/70 active:scale-[0.94]'}`,
    outline: `border-2 border-orange-500/30 text-orange-400 
      dark:border-orange-400/30 dark:text-orange-300
      ${!isMobile ? 'hover:bg-orange-500/10 dark:hover:bg-orange-400/10' : 'active:bg-orange-500/10 active:scale-[0.94]'}`
  };

  // Enhanced width control
  const widthStyles = fullWidth || isMobile ? 
    'w-full max-w-full' : 
    'w-auto';

  return (
    <motion.button
      onClick={handleClick}
      disabled={disabled || loading}
      className={twMerge(
        baseStyles,
        sizeStyles[size],
        variantStyles[variant],
        widthStyles,
        disabled ? 'opacity-50 cursor-not-allowed dark:opacity-40' : '',
        className
      )}
      whileHover={!isTouch && !disabled ? { scale: 1.02 } : undefined}
      whileTap={!disabled ? tapConfig : undefined}
      style={{
        backfaceVisibility: 'hidden',
        WebkitFontSmoothing: 'antialiased',
        transform: 'translateZ(0)'
      }}
      initial={false}
      {...props}
    >
      {ripple && (
        <motion.span
          className="absolute bg-white/30 dark:bg-white/20 rounded-full"
          initial={{ scale: 0, width: 100, height: 100, x: ripple.x - 50, y: ripple.y - 50 }}
          animate={{ scale: 4, opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      )}

      <motion.div 
        className="relative flex items-center justify-center gap-2 px-1"
        animate={{ opacity: loading ? 0 : 1 }}
      >
        {icon && iconPosition === 'left' && icon}
        <span className="truncate">{children}</span>
        {icon && iconPosition === 'right' && icon}
      </motion.div>

      {loading && (
        <motion.div 
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Loader2 className="w-5 h-5 animate-spin dark:text-gray-300" />
        </motion.div>
      )}
    </motion.button>
  );
};

// Original Button component for backward compatibility
const Button = ({ 
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'right',
  fullWidth = false,
  className = '',
  children,
  ...props 
}: InteractiveButtonProps) => {
  return (
    <InteractiveButton
      variant={variant}
      size={size}
      icon={icon}
      iconPosition={iconPosition}
      fullWidth={fullWidth}
      className={className}
      {...props}
    >
      {children}
    </InteractiveButton>
  );
};

Button.displayName = 'Button';

export default Button; 