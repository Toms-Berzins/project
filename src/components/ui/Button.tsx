import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

// Media query hook for touch devices
const useIsTouchDevice = () => {
  const [isTouch, setIsTouch] = useState(false);
  
  useEffect(() => {
    setIsTouch('ontouchstart' in window);
  }, []);
  
  return isTouch;
};

interface InteractiveButtonProps extends HTMLMotionProps<"button"> {
  variant?: 'primary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  className?: string;
  children: React.ReactNode;
}

export const InteractiveButton = ({ 
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'right',
  loading = false,
  className = "",
  children,
  onClick,
  disabled,
  ...props 
}: InteractiveButtonProps) => {
  const [ripple, setRipple] = useState<{ x: number; y: number } | null>(null);
  const isTouch = useIsTouchDevice();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    setRipple({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setTimeout(() => setRipple(null), 600);
    
    onClick?.(e);
  };

  const baseStyles = "relative overflow-hidden transform-gpu touch-manipulation font-medium rounded-lg transition-all duration-300";
  const sizeStyles = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  };
  const variantStyles = {
    primary: "bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:shadow-lg hover:shadow-orange-500/20",
    ghost: "bg-gray-800/50 text-gray-300 hover:bg-gray-800/70 hover:text-white",
    outline: "border-2 border-orange-500/30 text-orange-400 hover:bg-orange-500/10"
  };

  return (
    <motion.button
      onClick={handleClick}
      disabled={disabled || loading}
      className={twMerge(
        baseStyles,
        sizeStyles[size],
        variantStyles[variant],
        disabled ? 'opacity-50 cursor-not-allowed' : '',
        className
      )}
      whileHover={!isTouch && !disabled ? { scale: 1.02 } : undefined}
      whileTap={!disabled ? { scale: 0.98 } : undefined}
      initial={false}
      {...props}
    >
      {ripple && (
        <motion.span
          className="absolute bg-white/30 rounded-full"
          initial={{ scale: 0, width: 100, height: 100, x: ripple.x - 50, y: ripple.y - 50 }}
          animate={{ scale: 4, opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      )}

      <motion.div 
        className="relative flex items-center justify-center gap-2"
        animate={{ opacity: loading ? 0 : 1 }}
      >
        {icon && iconPosition === 'left' && icon}
        {children}
        {icon && iconPosition === 'right' && icon}
      </motion.div>

      {loading && (
        <motion.div 
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Loader2 className="w-5 h-5 animate-spin" />
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
      className={className}
      {...props}
    >
      {children}
    </InteractiveButton>
  );
};

Button.displayName = 'Button';

export default Button; 