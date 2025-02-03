import { motion } from 'framer-motion';
import { FaArrowUp } from 'react-icons/fa';

interface ScrollToTopProps {
  onClick: () => void;
}

export const ScrollToTop = ({ onClick }: ScrollToTopProps) => {
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.5, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.5, y: 20 }}
      whileHover={{ scale: 1.2, y: -4 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className="button-primary fixed bottom-4 md:bottom-6 right-4 md:right-6 p-3 md:p-4 rounded-full z-50 
        backdrop-blur-[5px] shadow-lg hover:shadow-xl transition-shadow duration-300"
      aria-label="Scroll to top"
    >
      <FaArrowUp className="w-4 h-4 md:w-5 md:h-5" />
      <motion.div
        className="absolute -inset-1 bg-orange-500 rounded-full opacity-20 z-0"
        animate={{ scale: [0.85, 1.1, 0.85] }}
        transition={{ 
          repeat: Infinity,
          duration: 2,
          ease: "easeInOut"
        }}
      />
    </motion.button>
  );
}; 