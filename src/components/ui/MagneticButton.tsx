import React, { useRef, useState, useEffect } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface MagneticButtonProps extends Omit<HTMLMotionProps<"button">, "ref"> {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}

const isTouchDevice = () => typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);

export default function MagneticButton({
  children,
  strength = 40,
  className = '',
  ...props
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  
  // Mouse movement tracking
  const lastMousePosRef = useRef({ x: 0, y: 0, time: 0 });

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isTouchDevice()) return;

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    animationFrameRef.current = requestAnimationFrame(() => {
      const now = Date.now();
      const { x: lastX, y: lastY, time: lastTime } = lastMousePosRef.current;
      
      // Calculate cursor speed
      const deltaX = e.clientX - lastX;
      const deltaY = e.clientY - lastY;
      const deltaTime = now - lastTime || 1; // Prevent division by zero
      const speed = Math.sqrt(deltaX ** 2 + deltaY ** 2) / deltaTime;
      
      // Update last position
      lastMousePosRef.current = { x: e.clientX, y: e.clientY, time: now };

      // Adjust strength based on speed (faster movement = less magnetic pull)
      const adjustedStrength = Math.max(strength / (speed * 0.2 + 1), 15);

      const button = buttonRef.current;
      if (!button) return;

      const rect = button.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);
      
      setPosition({ x: x / adjustedStrength, y: y / adjustedStrength });
    });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
    // Reset mouse tracking when leaving
    lastMousePosRef.current = { x: 0, y: 0, time: 0 };
  };

  const handleTap = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Trigger haptic feedback if supported
    if (isTouchDevice() && 'vibrate' in navigator) {
      navigator.vibrate(30); // Short vibration for feedback
    }

    const rect = buttonRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();

    setRipples((prev) => [...prev, { x, y, id }]);

    setTimeout(() => {
      setRipples((prev) => prev.filter(ripple => ripple.id !== id));
    }, 600);
  };

  const springConfig = {
    type: "spring",
    stiffness: 150,
    damping: 15,
    mass: 0.1
  } as const;

  const baseStyles = "px-5 py-3 text-lg font-medium rounded-lg transition-all duration-300";
  const themeStyles = "bg-orange-500 text-white dark:bg-orange-600 dark:text-gray-200";

  return (
    <motion.button
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleTap}
      animate={{ x: position.x, y: position.y }}
      transition={springConfig}
      className={`magnetic-button relative overflow-hidden ${baseStyles} ${themeStyles} ${className}`}
      whileHover={{ scale: isTouchDevice() ? 1 : 1.1 }}
      whileTap={{ scale: 0.95 }}
      {...props}
    >
      {ripples.map(({ x, y, id }) => (
        <span
          key={id}
          className="ripple-effect animate-ripple"
          style={{ left: `${x}px`, top: `${y}px` }}
        />
      ))}
      {children}
    </motion.button>
  );
} 