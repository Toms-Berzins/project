import { motion } from 'framer-motion';
import { RefObject } from 'react';
import { InteractiveButton } from './ui/InteractiveButton';

interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  image: string;
  description: string;
}

interface PortfolioModalProps {
  item: PortfolioItem;
  onClose: () => void;
  closeButtonRef: RefObject<HTMLButtonElement>;
}

const PortfolioModal = ({ item, onClose, closeButtonRef }: PortfolioModalProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 md:p-8 z-50"
      onClick={onClose}
      role="dialog"
      aria-labelledby="modal-title"
      aria-modal="true"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="glass-panel p-4 md:p-6 lg:p-8 rounded-2xl max-w-3xl w-[90vw] md:w-full shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h3 id="modal-title" className="title-card text-xl md:text-2xl mb-2">{item.title}</h3>
            <span className="px-3 py-1 bg-orange-500/20 rounded-full text-orange-400 text-sm">
              {item.category}
            </span>
          </div>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg 
              hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 
              focus:ring-offset-gray-900"
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        <div className="flex justify-center items-center bg-black rounded-lg overflow-hidden mb-4 md:mb-6">
          <img
            src={item.image}
            alt={item.title}
            loading="lazy"
            className="object-scale-down w-full max-h-[70vh]"
          />
        </div>

        <div className="space-y-3 md:space-y-4">
          <p className="subtitle-card leading-relaxed text-base md:text-lg">
            {item.description}
          </p>
          <div className="pt-4">
            <InteractiveButton
              onClick={onClose}
              className="button-primary px-4 md:px-6 py-2 md:py-3"
            >
              Close
            </InteractiveButton>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PortfolioModal; 