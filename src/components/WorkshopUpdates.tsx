import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Button from './ui/Button';
import Card, { CardContent } from './ui/Card';
import SocialFeed from './SocialFeed';

const staggerChildren = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6
    }
  }
};

export default function WorkshopUpdates() {
  return (
    <section className="social-feed-section relative py-16 lg:py-24">
      {/* Background Pattern */}
      <div className="section-pattern absolute inset-0" />
      
      {/* Content */}
      <motion.div 
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <motion.div 
          className="text-center mb-12 lg:mb-16"
          variants={staggerChildren}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          <motion.h2 
            className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent 
              bg-gradient-to-r from-orange-400 to-orange-600 mb-6
              [text-shadow:_0_2px_10px_rgba(251,146,60,0.3)]"
            variants={fadeInUp}
          >
            Latest From Our Workshop
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-300/90 max-w-2xl mx-auto
              [text-shadow:_0_1px_5px_rgba(255,255,255,0.1)]"
            variants={fadeInUp}
          >
            Stay updated with our recent projects and transformations. 
            Follow us on social media for more inspiration.
          </motion.p>
        </motion.div>
        
        {/* Social Feed Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card 
            variant="default" 
            className="glass-effect social-feed-grid card-3d transform-gpu transition-all duration-300 hover:scale-[1.02]"
          >
            <CardContent className="card-3d-content">
              <SocialFeed 
                limit={3} 
                className="relative z-10" 
              />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Button
            variant="primary"
            size="lg"
            icon={<ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />}
            iconPosition="right"
            className="hover-lift press-effect group tooltip"
            data-tooltip="See all our social media updates"
          >
            View All Updates
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
} 