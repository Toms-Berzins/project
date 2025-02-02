import React, { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useSpring, useAnimation, useVelocity, useScroll } from 'framer-motion';
import { StarIcon } from '@heroicons/react/24/solid';
import { ReactCompareSlider, ReactCompareSliderImage, ReactCompareSliderHandle } from 'react-compare-slider';

// Battery API types
interface BatteryManager {
  charging: boolean;
  chargingTime: number;
  dischargingTime: number;
  level: number;
  addEventListener: (type: string, listener: EventListener) => void;
  removeEventListener: (type: string, listener: EventListener) => void;
}

interface NavigatorWithBattery extends Navigator {
  getBattery: () => Promise<BatteryManager>;
}

interface Project {
  id: string;
  title: string;
  description: string;
  category: 'Automotive' | 'Industrial' | 'Furniture' | 'Custom Projects';
  finishType: 'Glossy' | 'Matte' | 'Metallic' | 'Textured' | 'Custom';
  color: string;
  imageBefore: string;
  imageAfter: string;
  clientType: string;
  material: string;
  duration: string;
  specialTechniques: string[];
  testimonial?: {
    author: string;
    text: string;
    rating: number;
  };
  videoUrl?: string;
}

interface ProjectDetailsProps {
  project: Project;
}

const ProjectDetails: React.FC<ProjectDetailsProps> = ({ project }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isLowPower, setIsLowPower] = useState(false);
  const controls = useAnimation();
  const lastDragVelocity = useRef(0);
  const lastVibration = useRef(0);
  
  // Enhanced motion values for smoother animations
  const position = useMotionValue(50);
  const velocity = useVelocity(position);
  const springConfig = {
    stiffness: 500,  // Increased for snappier response
    damping: 30,     // Adjusted for natural bounce
    mass: 0.5,
    restSpeed: 0.5,
    restDelta: 0.01  // Fine-tuned rest state
  };
  const springX = useSpring(position, springConfig);

  const [isMobile, setIsMobile] = useState(false);
  const { scrollY } = useScroll();
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Check for low power mode
  useEffect(() => {
    if ('getBattery' in navigator) {
      (navigator as NavigatorWithBattery).getBattery().then((battery: BatteryManager) => {
        setIsLowPower(battery.charging === false && battery.level < 0.2);
      });
    }
  }, []);

  // Check for mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Show/hide scroll to top button
  useEffect(() => {
    const unsubscribe = scrollY.onChange(y => {
      setShowScrollTop(y > 500);
    });
    return () => unsubscribe();
  }, [scrollY]);

  // Haptic feedback function with throttling
  const triggerHaptic = useCallback((duration: number = 50) => {
    const now = Date.now();
    if (!isLowPower && 
        'vibrate' in navigator && 
        now - lastVibration.current > 300) {
      navigator.vibrate(duration);
      lastVibration.current = now;
    }
  }, [isLowPower]);

  // Snap points for better control
  const snapPoints = useMemo(() => [0, 25, 50, 75, 100], []);
  const snapThreshold = 10; // Distance from snap point to trigger snap

  // Handle drag start with haptic feedback
  const handleDragStart = useCallback(() => {
    setIsDragging(true);
    triggerHaptic(30); // Light tap feedback
  }, [triggerHaptic]);

  // Add keyframes for button glow animation
  const buttonVariants = {
    initial: {
      opacity: 1,
      y: 0,
      boxShadow: "0px 0px 15px rgba(255, 136, 0, 0.2)",
      scale: 1,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.1, 0.25, 1]
      }
    },
    hover: {
      scale: 1.02,
      boxShadow: [
        "0px 0px 15px rgba(255, 136, 0, 0.2)",
        "0px 0px 20px rgba(255, 136, 0, 0.4)",
        "0px 0px 25px rgba(255, 136, 0, 0.3)",
        "0px 0px 20px rgba(255, 136, 0, 0.4)",
        "0px 0px 15px rgba(255, 136, 0, 0.2)",
      ],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    },
    tap: {
      scale: 0.98
    }
  };

  // Handle drag end with enhanced bounce effect
  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    const currentPos = position.get();
    const currentVel = velocity.get();
    lastDragVelocity.current = currentVel;

    // Find nearest snap point with enhanced bounce
    const closestSnap = snapPoints.reduce((prev, curr) => 
      Math.abs(curr - currentPos) < Math.abs(prev - currentPos) ? curr : prev
    );

    // Enhanced snap animation with bounce effect
    if (Math.abs(closestSnap - currentPos) < snapThreshold && Math.abs(currentVel) < 500) {
      const overshoot = Math.sign(closestSnap - currentPos) * 2; // Small overshoot for bounce
      controls.start({
        x: [currentPos, closestSnap + overshoot, closestSnap],
        scale: [1, 0.98, 1.02, 1],
        transition: { 
          duration: 0.5,
          times: [0, 0.6, 1],
          type: "spring",
          stiffness: 500,
          damping: 30
        }
      });

      // Stronger haptic for snapping to center
      if (closestSnap === 50) {
        triggerHaptic(70);
      } else {
        triggerHaptic(40);
      }
    } else if (Math.abs(currentVel) > 1000) {
      // Strong haptic for fast movements
      triggerHaptic(100);
    }
  }, [position, velocity, controls, snapPoints, triggerHaptic]);

  // Enhanced handle for smoother dragging
  const CustomHandle = () => {
    const handleScale = useTransform(
      velocity,
      [-1000, 0, 1000],
      [0.8, isDragging ? 1.2 : 1, 0.8]
    );

    return (
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 1.2 }}
        style={{
          scale: handleScale,
          x: useTransform(springX, [0, 100], [-20, 20]),
          opacity: useTransform(springX, [0, 50, 100], [0.8, 1, 0.8])
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 25
        }}
      >
        <ReactCompareSliderHandle
          buttonStyle={{
            backdropFilter: 'blur(8px)',
            background: 'rgba(255, 255, 255, 0.9)',
            border: 0,
            boxShadow: `0 0 20px rgba(0, 0, 0, 0.5),
              ${isHovered ? '0 0 30px rgba(255, 165, 0, 0.5)' : ''}
              ${isDragging ? ', 0 0 40px rgba(255, 165, 0, 0.3)' : ''}`,
            color: '#1a1a1a',
            transition: 'all 0.3s ease',
            transform: isHovered ? 'scale(1.2)' : 'scale(1)',
            width: isMobile ? '40px' : '30px',
            height: isMobile ? '40px' : '30px',
            borderRadius: '50%'
          }}
          linesStyle={{ color: '#1a1a1a' }}
        />
      </motion.div>
    );
  };

  // Handle slider position changes with enhanced physics
  const handlePositionChange = useCallback((newPosition: number) => {
    position.set(newPosition);
    
    // Check for snap points during drag
    snapPoints.forEach(snapPoint => {
      if (Math.abs(newPosition - snapPoint) < 2) {
        triggerHaptic(30); // Light feedback when passing snap points
      }
    });
    
    // Add dynamic bounce effect based on velocity
    if (newPosition <= 0 || newPosition >= 100) {
      const bounceScale = Math.min(Math.abs(lastDragVelocity.current) / 2000, 0.1);
      controls.start({
        scale: [1, 1 - bounceScale, 1],
        transition: { duration: 0.3, type: "spring" }
      });
      triggerHaptic(50); // Medium feedback for hitting edges
    }
  }, [position, controls, snapPoints, triggerHaptic]);

  // Detect reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        duration: 0.4
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.1, 0.25, 1]
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-4 md:p-6 space-y-6 md:space-y-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        <motion.div variants={itemVariants} className="space-y-4 md:space-y-6">
          <motion.div
            className="relative rounded-2xl overflow-hidden shadow-2xl"
            animate={controls}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            style={{ 
              transform: 'translate3d(0,0,0)',
              willChange: 'transform'
            }}
          >
            <ReactCompareSlider
              position={springX.get()}
              onPositionChange={handlePositionChange}
              onChange={handleDragEnd}
              onDragStart={handleDragStart}
              handle={<CustomHandle />}
              itemOne={
                <div className="relative">
                  <motion.div
                    style={{ 
                      opacity: useTransform(springX, [0, 50], [1, 0.7]),
                      scale: useTransform(springX, [0, 50], [1.05, 0.95])
                    }}
                  >
                    <ReactCompareSliderImage
                      src={project.imageBefore}
                      alt="Before"
                      className="w-full h-auto md:h-[500px] object-cover transform-gpu"
                      loading="lazy"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <motion.span
                      className="absolute bottom-4 left-4 text-white font-semibold 
                        bg-black/50 px-4 py-2 rounded-full text-sm backdrop-blur-sm"
                      style={{ opacity: useTransform(springX, [0, 50], [1, 0]) }}
                    >
                      Before
                    </motion.span>
                  </motion.div>
                </div>
              }
              itemTwo={
                <div className="relative">
                  <motion.div
                    style={{ 
                      opacity: useTransform(springX, [50, 100], [0.7, 1]),
                      scale: useTransform(springX, [50, 100], [0.95, 1.05])
                    }}
                  >
                    <ReactCompareSliderImage
                      src={project.imageAfter}
                      alt="After"
                      className="w-full h-auto md:h-[500px] object-cover transform-gpu"
                      loading="lazy"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <motion.span
                      className="absolute bottom-4 right-4 text-white font-semibold 
                        bg-black/50 px-4 py-2 rounded-full text-sm backdrop-blur-sm"
                      style={{ opacity: useTransform(springX, [50, 100], [0, 1]) }}
                    >
                      After
                    </motion.span>
                  </motion.div>
                </div>
              }
              className={`${prefersReducedMotion ? 'motion-reduce' : ''}`}
            />
          </motion.div>

          {project.videoUrl && (
            <motion.div
              variants={itemVariants}
              className="relative rounded-2xl overflow-hidden shadow-2xl"
            >
              <video
                src={project.videoUrl}
                controls
                className="w-full aspect-video object-cover"
                poster={project.imageAfter}
                playsInline
              >
                <track kind="captions" />
              </video>
            </motion.div>
          )}
        </motion.div>
        
        <motion.div variants={itemVariants} className="space-y-6 md:space-y-8">
          <div className="space-y-4">
            <h3 className="text-2xl md:text-3xl font-bold text-white">{project.title}</h3>
            <p className="text-base md:text-lg leading-relaxed text-gray-300">{project.description}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">Project Details</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-400">Category:</span>
                  <span className="px-3 py-1 text-sm rounded-full bg-orange-500/20 text-orange-400
                    backdrop-blur-sm border border-orange-500/20">
                    {project.category}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-400">Client:</span>
                  <span className="text-white">{project.clientType}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-400">Duration:</span>
                  <span className="text-white">{project.duration}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">Technical Specs</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-400">Material:</span>
                  <span className="text-white">{project.material}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-400">Finish:</span>
                  <span className="px-3 py-1 text-sm rounded-full bg-blue-500/20 text-blue-400
                    backdrop-blur-sm border border-blue-500/20">
                    {project.finishType}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-400">Color:</span>
                  <span className="text-white">{project.color}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Special Techniques</h4>
            <div className="flex flex-wrap gap-2">
              {project.specialTechniques.map((technique, index) => (
                <span
                  key={index}
                  className="px-3 py-1 text-sm rounded-full bg-gray-800/80 text-gray-300
                    backdrop-blur-sm border border-gray-700/50"
                >
                  {technique}
                </span>
              ))}
            </div>
          </div>

          {project.testimonial && (
            <motion.div
              variants={itemVariants}
              className="relative p-4 md:p-6 w-full md:w-3/4 mx-auto rounded-xl bg-gradient-to-br from-gray-800/50 to-gray-900/50
                backdrop-blur-md border border-gray-700/50"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="flex items-center justify-center w-10 md:w-12 h-10 md:h-12 rounded-full
                  bg-orange-500/20 backdrop-blur-xl border border-orange-500/30">
                  <StarIcon className="w-5 md:w-6 h-5 md:h-6 text-orange-400" />
                </div>
              </div>
              
              <div className="mt-4">
                <div className="flex justify-center items-center space-x-1 mb-4">
                  {[...Array(project.testimonial.rating)].map((_, i) => (
                    <StarIcon key={i} className="w-4 md:w-5 h-4 md:h-5 text-orange-400" />
                  ))}
                </div>
                <p className="text-base md:text-lg italic text-center mb-4 text-gray-300">
                  "{project.testimonial.text}"
                </p>
                <p className="text-center font-semibold text-white text-sm md:text-base">
                  - {project.testimonial.author}
                </p>
              </div>
            </motion.div>
          )}

          <motion.button
            variants={buttonVariants}
            initial="initial"
            whileHover="hover"
            whileTap="tap"
            className="w-full min-h-[50px] py-4 px-6 rounded-xl font-semibold text-white
              bg-gradient-to-r from-orange-500 to-orange-600
              hover:from-orange-600 hover:to-orange-700
              transform-gpu transition-all duration-300
              shadow-lg shadow-orange-500/25
              text-base md:text-lg
              relative overflow-hidden"
            onClick={() => window.location.href = '/quote?project=' + project.id}
          >
            <motion.span
              className="absolute inset-0 bg-gradient-to-r from-orange-400/0 via-orange-400/30 to-orange-400/0"
              animate={{
                x: ["0%", "200%"],
                transition: {
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear",
                }
              }}
            />
            <span className="relative z-10">Request Similar Project</span>
          </motion.button>
        </motion.div>
      </div>

      {/* Back to Top Button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: showScrollTop ? 1 : 0 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 bg-orange-600 hover:bg-orange-700 
          text-white p-4 rounded-full shadow-lg z-50 
          transform-gpu transition-all duration-300"
      >
        <svg 
          className="w-6 h-6" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M5 10l7-7m0 0l7 7m-7-7v18" 
          />
        </svg>
      </motion.button>
    </motion.div>
  );
};

export default ProjectDetails; 