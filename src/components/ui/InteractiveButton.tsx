import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Loader2 } from 'lucide-react';

export interface InteractiveButtonProps {
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  children: React.ReactNode;
  role?: string;
  'aria-selected'?: boolean;
}

export function InteractiveButton({ 
  onClick, 
  className = "", 
  disabled = false, 
  children, 
  role, 
  'aria-selected': ariaSelected 
}: InteractiveButtonProps) {
  const [loading, setLoading] = useState(false);
  const [ripple, setRipple] = useState<{ x: number; y: number } | null>(null);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    setRipple({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setTimeout(() => setRipple(null), 600);
    
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onClick?.();
    }, 1000);
  };

  return (
    <motion.button
      onClick={handleClick}
      disabled={disabled || loading}
      className={`relative overflow-hidden transform-gpu touch-manipulation focus:ring-2 focus:ring-orange-500 
        focus:ring-offset-2 focus:ring-offset-gray-900 focus:outline-none ${className}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={false}
      role={role}
      aria-selected={ariaSelected}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600"
        animate={{
          opacity: loading || disabled ? 0.7 : 1,
        }}
      />
      
      {ripple && (
        <motion.span
          className="absolute bg-white/30 rounded-full"
          initial={{ 
            scale: 0, 
            width: 100, 
            height: 100, 
            x: ripple.x - 50, 
            y: ripple.y - 50 
          }}
          animate={{ scale: 4, opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      )}

      <motion.div 
        className="relative flex items-center justify-center gap-2 py-3 px-6"
        animate={{
          opacity: loading ? 0 : 1,
        }}
      >
        {children}
        <motion.div
          animate={{ x: loading ? -4 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <ArrowRight className="w-5 h-5" />
        </motion.div>
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
} 