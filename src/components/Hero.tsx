import { ArrowRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion, useMotionValue, useTransform, useSpring, useScroll } from 'framer-motion';
import { InteractiveButton } from './ui/Button';
import { useEffect, useRef } from 'react';
import Particles from './effects/Particles';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
};

const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function Hero() {
  const location = useLocation();
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const { scrollY } = useScroll();

  const rotateX = useTransform(y, [-300, 300], [10, -10]);
  const rotateY = useTransform(x, [-300, 300], [-10, 10]);
  const parallaxY = useTransform(scrollY, [0, 500], [0, -100]);

  const springConfig = { stiffness: 150, damping: 15, mass: 0.8 };
  const rotateXSpring = useSpring(rotateX, springConfig);
  const rotateYSpring = useSpring(rotateY, springConfig);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;
      
      // Smooth easing for mouse movement
      x.set(deltaX * 0.5);
      y.set(deltaY * 0.5);
    };

    const handleMouseLeave = () => {
      x.set(0);
      y.set(0);
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [x, y]);

  const handlePortfolioClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      window.location.href = '/#portfolio';
      return;
    }
    const element = document.getElementById('portfolio');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center py-20 overflow-hidden">
      {/* Particles Background */}
      <div className="absolute inset-0">
        <Particles />
        <div className="absolute inset-0 bg-gradient-radial from-orange-500/10 via-transparent to-transparent animate-pulse" />
      </div>

      {/* Hero Section */}
      <div className="section-pattern">
        {/* Hero Content */}
        <motion.div 
          className="hero-gradient min-h-[70vh] flex items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          style={{ y: parallaxY }}
        >
          <div className="hero-content max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 w-full">
            <motion.div 
              ref={cardRef}
              className="max-w-xl glass-enhanced p-8 rounded-2xl card-3d relative backdrop-blur-xl
                bg-white/5 dark:bg-gray-900/30 border border-white/10 dark:border-white/5
                shadow-2xl shadow-black/5 dark:shadow-orange-500/5"
              style={{
                rotateX: rotateXSpring,
                rotateY: rotateYSpring
              }}
              variants={staggerChildren}
              initial="initial"
              animate="animate"
            >
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-blue-500/10 rounded-2xl opacity-50" />
              
              <motion.div className="card-3d-content relative z-10">
                <motion.h1 
                  className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6
                    bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-orange-600
                    [text-shadow:_0_2px_10px_rgba(251,146,60,0.3)]"
                  variants={fadeInUp}
                >
                  Premium Powder Coating Solutions
                </motion.h1>
                <motion.p 
                  className="text-xl text-gray-300 mb-8
                    [text-shadow:_0_1px_5px_rgba(255,255,255,0.1)]"
                  variants={fadeInUp}
                >
                  Transform your metal surfaces with our professional powder coating services. 
                  Durable, beautiful, and environmentally friendly.
                </motion.p>
                
                <motion.div 
                  className="flex flex-col sm:flex-row gap-4"
                  variants={fadeInUp}
                >
                  <Link 
                    to="/quote"
                    className="inline-block group"
                  >
                    <InteractiveButton
                      variant="primary"
                      size="lg"
                      icon={<ArrowRight className="w-5 h-5" />}
                      iconPosition="right"
                      className="w-full group tooltip glass-effect
                        bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700
                        shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30
                        border border-orange-400/20 hover:border-orange-400/30"
                    >
                      Get Started
                    </InteractiveButton>
                  </Link>
                  <InteractiveButton
                    variant="outline"
                    size="lg"
                    onClick={handlePortfolioClick}
                    className="glass-effect press-effect group tooltip
                      bg-white/5 hover:bg-white/10 dark:bg-gray-900/30 dark:hover:bg-gray-900/50
                      backdrop-blur-xl border border-white/10 dark:border-white/5
                      shadow-lg shadow-black/5 hover:shadow-black/10"
                  >
                    View Portfolio
                  </InteractiveButton>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}