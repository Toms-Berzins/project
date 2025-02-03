import { SprayCan as Spray, Shield, Clock, ChevronRight, ArrowRight, Loader2 } from 'lucide-react';
import { ReactNode, useState, useEffect } from 'react';
import Card, { CardContent } from './ui/Card';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

// Media query hook for touch devices
const useIsTouchDevice = () => {
  const [isTouch, setIsTouch] = useState(false);
  
  useEffect(() => {
    setIsTouch('ontouchstart' in window);
  }, []);
  
  return isTouch;
};

// Floating background elements for visual interest
const FloatingBackground = () => {
  const prefersReducedMotion = useReducedMotion();
  const elements = Array.from({ length: 3 }, (_, i) => i);

  if (prefersReducedMotion) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
    >
      {elements.map((i) => (
        <motion.div
          key={i}
          className="absolute w-[300px] h-[300px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(251,146,60,0.03) 0%, transparent 70%)',
            top: `${20 + i * 30}%`,
            left: `${20 + i * 25}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.5, 0.8, 0.5],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 6 + i * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 2,
          }}
        />
      ))}
    </motion.div>
  );
};

// Progressive text reveal component
interface ProgressiveTextProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

const ProgressiveText = ({ children, className = "", delay = 0 }: ProgressiveTextProps) => {
  const prefersReducedMotion = useReducedMotion();
  
  return (
    <motion.div
      initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.43, 0.13, 0.23, 0.96]
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

interface ServiceCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  features: string[];
  index: number;
}

function ServiceCard({ title, description, icon, features, index }: ServiceCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const isTouch = useIsTouchDevice();

  const cardVariants = {
    hidden: prefersReducedMotion ? {} : { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: index * (prefersReducedMotion ? 0 : 0.1),
        ease: [0.43, 0.13, 0.23, 0.96]
      }
    }
  };

  const featureVariants = {
    hidden: prefersReducedMotion ? {} : { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * (prefersReducedMotion ? 0 : 0.1),
        duration: 0.5
      }
    })
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-20px" }}
      layoutId={`service-card-${index}`}
      className="touch-manipulation w-full"
      onTouchStart={() => isTouch && setIsHovered(true)}
      onTouchEnd={() => isTouch && setIsHovered(false)}
    >
      <Card 
        variant="hover" 
        className="group h-full service-card hover-lift bg-gray-800/50 shadow-md sm:shadow-lg 
          border border-gray-700/30 rounded-xl transition-all duration-300
          hover:shadow-xl hover:border-gray-700/50
          hover:shadow-orange-500/10 hover:scale-[1.02]
          before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-b 
          before:from-orange-500/0 before:to-orange-500/0 before:opacity-0 
          before:transition-opacity before:duration-300
          hover:before:opacity-5"
        onMouseEnter={() => !isTouch && setIsHovered(true)}
        onMouseLeave={() => !isTouch && setIsHovered(false)}
      >
        <CardContent className="p-4 sm:p-6 lg:p-8 h-full flex flex-col min-h-[400px] sm:min-h-[500px] lg:min-h-[600px] relative">
          <motion.div 
            className="mb-4 sm:mb-6 lg:mb-8 glass-panel p-3 sm:p-4 rounded-xl w-fit
              bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm
              border border-gray-700/30 relative z-10"
            animate={!prefersReducedMotion ? {
              scale: isHovered ? 1.1 : 1,
              backgroundColor: isHovered ? 'rgba(249, 115, 22, 0.2)' : 'rgba(255, 255, 255, 0.1)'
            } : {}}
            transition={{ duration: 0.3 }}
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center">
              {icon}
            </div>
          </motion.div>
          <div className="flex-1 flex flex-col relative z-10">
            <motion.h3 
              className="title-card mb-2 sm:mb-3 lg:mb-4"
              animate={!prefersReducedMotion ? {
                x: isHovered ? 8 : 0,
                color: isHovered ? '#fb923c' : '#ffffff'
              } : {}}
              transition={{ duration: 0.3 }}
            >
              {title}
            </motion.h3>
            <motion.p 
              className="subtitle-card mb-4 sm:mb-6 lg:mb-8"
              animate={!prefersReducedMotion ? {
                x: isHovered ? 8 : 0
              } : {}}
              transition={{ duration: 0.3 }}
            >
              {description}
            </motion.p>
            
            <ul className="space-y-2 mb-4 sm:mb-6 lg:mb-8 flex-1">
              {features.map((feature, i) => (
                <li key={feature} className="text-gray-300 service-card-feature">
                  <AnimatePresence>
                    <motion.div 
                      custom={i}
                      variants={featureVariants}
                      initial="hidden"
                      animate={isHovered ? "visible" : "hidden"}
                      className="flex items-center w-full text-sm sm:text-base"
                    >
                      <motion.div
                        animate={!prefersReducedMotion ? {
                          rotate: isHovered ? 90 : 0
                        } : {}}
                        transition={{ duration: 0.3 }}
                        className="flex-shrink-0"
                      >
                        <ChevronRight className="w-4 h-4 text-orange-500 mr-2" />
                      </motion.div>
                      <span className="flex-1">{feature}</span>
                    </motion.div>
                  </AnimatePresence>
                </li>
              ))}
            </ul>

            <div className="mt-auto">
              <InteractiveButton 
                className="w-full py-3 sm:py-4 font-semibold text-white 
                  hover:shadow-lg hover:shadow-orange-500/20
                  active:shadow-md active:scale-[0.98]
                  rounded-lg transition-all duration-300 
                  min-h-[50px] sm:min-h-[55px]
                  bg-gradient-to-r from-orange-500 to-orange-600
                  border border-orange-500/20"
              >
                Learn More
              </InteractiveButton>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

interface InteractiveButtonProps {
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  children: React.ReactNode;
}

function InteractiveButton({ onClick, className = "", disabled = false, children }: InteractiveButtonProps) {
  const [loading, setLoading] = useState(false);
  const [ripple, setRipple] = useState<{ x: number; y: number } | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const isTouch = useIsTouchDevice();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) return;
    
    if (!prefersReducedMotion) {
      const rect = e.currentTarget.getBoundingClientRect();
      setRipple({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      setTimeout(() => setRipple(null), 600);
    }
    
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
      className={`relative overflow-hidden transform-gpu touch-manipulation ${className}`}
      whileHover={!isTouch ? { scale: 1.02 } : {}}
      whileTap={{ scale: 0.98 }}
      initial={false}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600"
        animate={{
          opacity: loading || disabled ? 0.7 : 1,
        }}
      />
      
      {ripple && !prefersReducedMotion && (
        <motion.span
          className="absolute bg-white/30 rounded-full"
          initial={{ scale: 0, width: 100, height: 100, x: ripple.x - 50, y: ripple.y - 50 }}
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
          animate={!prefersReducedMotion ? { x: loading ? -4 : 0 } : {}}
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

export default function Services() {
  const services = [
    {
      title: 'Custom Powder Coating',
      description: 'Transform your metal surfaces with our professional powder coating services. Choose from a wide spectrum of colors and finishes.',
      icon: <Spray className="w-7 h-7 text-orange-500" />,
      features: [
        'Wide range of colors and finishes',
        'Custom color matching',
        'Texture and metallic options',
        'Even coating distribution'
      ]
    },
    {
      title: 'Protective Finishes',
      description: 'Shield your valuable metal assets with our durable protective coatings, designed to withstand harsh environmental conditions.',
      icon: <Shield className="w-7 h-7 text-orange-500" />,
      features: [
        'Corrosion resistance',
        'UV protection',
        'Chemical resistance',
        'Impact resistance'
      ]
    },
    {
      title: 'Quick Turnaround',
      description: 'Experience efficient service with our quick turnaround times, without compromising on quality or attention to detail.',
      icon: <Clock className="w-7 h-7 text-orange-500" />,
      features: [
        'Same-day service available',
        'Bulk order processing',
        'Rush order options',
        'On-time delivery'
      ]
    }
  ];

  return (
    <section className="relative py-8 sm:py-16 lg:py-24 bg-gradient-to-b from-gray-900 to-gray-800 overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 via-transparent to-gray-800/80 pointer-events-none" />
      <FloatingBackground />
      <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-orange-500/20 to-transparent" />
      <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-orange-500/20 to-transparent" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <ProgressiveText delay={0.2}>
            <h2 className="title-primary mb-4 sm:mb-6">
              Our Services
            </h2>
          </ProgressiveText>
          
          <ProgressiveText delay={0.4} className="max-w-2xl mx-auto">
            <p className="subtitle-primary mb-6 sm:mb-8">
              Discover our comprehensive range of powder coating solutions tailored to your needs.
            </p>
          </ProgressiveText>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-8 lg:gap-10">
          {services.map((service, index) => (
            <div key={service.title} className="w-full">
              <ServiceCard {...service} index={index} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}