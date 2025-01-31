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
    hidden: prefersReducedMotion ? {} : { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: index * (prefersReducedMotion ? 0 : 0.2),
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
      viewport={{ once: true, margin: "-50px" }}
      layoutId={`service-card-${index}`}
      className="touch-manipulation"
      onTouchStart={() => isTouch && setIsHovered(true)}
      onTouchEnd={() => isTouch && setIsHovered(false)}
    >
      <Card 
        variant="hover" 
        className="group h-full service-card hover-lift bg-gray-800/50"
        onMouseEnter={() => !isTouch && setIsHovered(true)}
        onMouseLeave={() => !isTouch && setIsHovered(false)}
      >
        <CardContent className="p-4 sm:p-8 h-full flex flex-col min-h-[500px] sm:min-h-[600px]">
          <motion.div 
            className="mb-6 sm:mb-8 glass-panel p-4 rounded-xl w-fit"
            animate={!prefersReducedMotion ? {
              scale: isHovered ? 1.1 : 1,
              backgroundColor: isHovered ? 'rgba(249, 115, 22, 0.2)' : 'rgba(255, 255, 255, 0.1)'
            } : {}}
            transition={{ duration: 0.3 }}
          >
            {icon}
          </motion.div>
          <div className="flex-1 flex flex-col">
            <motion.h3 
              className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4"
              animate={!prefersReducedMotion ? {
                x: isHovered ? 8 : 0,
                color: isHovered ? '#fb923c' : '#ffffff'
              } : {}}
              transition={{ duration: 0.3 }}
            >
              {title}
            </motion.h3>
            <motion.p 
              className="text-gray-300 mb-6 sm:mb-8 h-[60px] sm:h-[72px] line-clamp-3 text-sm sm:text-base"
              animate={!prefersReducedMotion ? {
                x: isHovered ? 8 : 0
              } : {}}
              transition={{ duration: 0.3 }}
            >
              {description}
            </motion.p>
            
            <ul className="space-y-2 mb-6 sm:mb-8 flex-1">
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
                className="w-full font-semibold text-white hover:shadow-lg hover:shadow-orange-500/20
                  rounded-lg transition-shadow duration-300 min-h-[44px]"
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
    <section className="relative py-12 sm:py-24 bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-10 sm:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent 
            bg-gradient-to-r from-orange-400 to-orange-600 mb-6
            [text-shadow:_0_2px_10px_rgba(251,146,60,0.3)]">
            Our Services
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8
            [text-shadow:_0_1px_5px_rgba(255,255,255,0.1)]">
            Discover our comprehensive range of powder coating solutions tailored to your needs.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
          {services.map((service, index) => (
            <div key={service.title}>
              <ServiceCard {...service} index={index} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}