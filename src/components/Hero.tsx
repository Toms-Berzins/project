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
    <section className="hero-section relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Particles Background */}
      <div className="absolute inset-0">
        <Particles />
        <div className="absolute inset-0 bg-gradient-radial from-orange-500/10 via-transparent to-transparent animate-pulse" />
      </div>

      {/* Hero Section */}
      <motion.div 
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32"
        style={{ y: parallaxY }}
      >
        <motion.div 
          className="relative"
          variants={staggerChildren}
          initial="hidden"
          animate="animate"
        >
          <motion.div 
            ref={cardRef}
            className="hero-card relative rounded-2xl p-8 sm:p-12 lg:p-16 overflow-hidden
              backdrop-blur-xl bg-white/5 dark:bg-gray-900/30
              border border-white/10 dark:border-white/5
              shadow-2xl shadow-black/5
              transform-gpu perspective-1000"
            variants={fadeInUp}
            style={{
              rotateX: rotateXSpring,
              rotateY: rotateYSpring
            }}
          >
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-blue-500/10 rounded-2xl opacity-50" />
            
            <motion.div className="card-3d-content relative z-10">
              <motion.h1 
                className="title-primary mb-6"
                variants={fadeInUp}
              >
                Premium Powder Coating Solutions
              </motion.h1>
              <motion.p 
                className="subtitle-primary mb-8"
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
                    className="w-full group tooltip glass-effect button-primary"
                  >
                    Get Started
                  </InteractiveButton>
                </Link>
                <InteractiveButton
                  variant="outline"
                  size="lg"
                  onClick={handlePortfolioClick}
                  className="glass-effect press-effect group tooltip button-secondary"
                >
                  View Portfolio
                </InteractiveButton>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}