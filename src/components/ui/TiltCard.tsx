import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  tiltStrength?: number;
  perspective?: number;
  scale?: number;
  glowColor?: string;
}

const isTouchDevice = () => (
  typeof window !== 'undefined' && 
  ('ontouchstart' in window || navigator.maxTouchPoints > 0)
);

export default function TiltCard({
  children,
  className = '',
  tiltStrength = 50,
  perspective = 1000,
  scale = 1.05,
  glowColor = 'rgba(255, 165, 0, 0.3)',
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [isTouchScreen] = useState(isTouchDevice());
  const animationFrameIdRef = useRef<number>();
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-tiltStrength, tiltStrength], [10, -10]);
  const rotateY = useTransform(x, [-tiltStrength, tiltStrength], [-10, 10]);

  const springConfig = { stiffness: 150, damping: 15, mass: 0.1 };
  const rotateXSpring = useSpring(rotateX, springConfig);
  const rotateYSpring = useSpring(rotateY, springConfig);
  const scaleSpring = useSpring(isPressed ? 0.97 : isHovered ? scale : 1, springConfig);
  const boxShadow = useMotionValue('none');
  const shadowSpring = useSpring(boxShadow, springConfig);

  useEffect(() => {
    boxShadow.set(isHovered ? `0px 15px 50px ${glowColor}` : 'none');
  }, [isHovered, glowColor, boxShadow]);

  useEffect(() => {
    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isTouchScreen) return;

    if (animationFrameIdRef.current) {
      cancelAnimationFrame(animationFrameIdRef.current);
    }

    animationFrameIdRef.current = requestAnimationFrame(() => {
      const card = cardRef.current;
      if (!card) return;

      const rect = card.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      x.set(e.clientX - centerX);
      y.set(e.clientY - centerY);
    });
  };

  const handleMouseLeave = () => {
    if (isTouchScreen) return;
    x.set(0);
    y.set(0);
    setIsHovered(false);
    setIsPressed(false);
  };

  return (
    <motion.div
      ref={cardRef}
      className={`tilt-card ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => !isTouchScreen && setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      style={{
        perspective: isTouchScreen ? undefined : perspective,
        transformStyle: isTouchScreen ? undefined : 'preserve-3d',
        rotateX: isTouchScreen ? 0 : rotateXSpring,
        rotateY: isTouchScreen ? 0 : rotateYSpring,
        scale: scaleSpring,
        boxShadow: shadowSpring,
      }}
    >
      {children}
    </motion.div>
  );
} 