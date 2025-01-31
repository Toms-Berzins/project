import React from 'react';
import { Plus, Minus, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './Button';
import Card, { CardContent } from './Card';

interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
  icon?: React.ReactNode;
  id?: string;
}

export function AccordionItem({ 
  title, 
  children, 
  isOpen, 
  onToggle,
  className = '',
  icon = <HelpCircle className="w-5 h-5 text-orange-500/70" />,
  id
}: AccordionItemProps) {
  const springConfig = {
    type: "spring",
    stiffness: 300,
    damping: 30
  };

  return (
    <div id={id}>
      <Card 
        variant="default" 
        className={`overflow-hidden transition-all duration-300 hover:shadow-lg 
          bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900
          border border-gray-200 dark:border-gray-700 group ${className}`}
      >
        <Button
          variant="ghost"
          className="w-full px-6 py-5 flex justify-between items-center text-left 
            hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-300
            group-hover:bg-orange-50/10"
          onClick={onToggle}
        >
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 p-1 rounded-full bg-orange-100/20 
              dark:bg-orange-500/10 group-hover:bg-orange-100/30 
              dark:group-hover:bg-orange-500/20 transition-colors duration-300">
              {icon}
            </div>
            <span className="font-semibold text-gray-900 dark:text-white text-lg 
              group-hover:text-orange-500 dark:group-hover:text-orange-400 
              transition-colors duration-300">
              {title}
            </span>
          </div>
          <motion.div
            initial={false}
            animate={{ 
              rotate: isOpen ? 180 : 0,
              scale: isOpen ? 1.1 : 1
            }}
            transition={springConfig}
            className="flex-shrink-0 p-1 rounded-full bg-orange-100/20 
              dark:bg-orange-500/10 group-hover:bg-orange-100/30 
              dark:group-hover:bg-orange-500/20 transition-colors duration-300"
          >
            {isOpen ? (
              <Minus className="w-5 h-5 text-orange-500 dark:text-orange-400" />
            ) : (
              <Plus className="w-5 h-5 text-orange-500 dark:text-orange-400" />
            )}
          </motion.div>
        </Button>
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ 
                height: "auto", 
                opacity: 1,
                transition: {
                  height: springConfig,
                  opacity: { duration: 0.2, delay: 0.1 }
                }
              }}
              exit={{ 
                height: 0, 
                opacity: 0,
                transition: {
                  height: springConfig,
                  opacity: { duration: 0.2 }
                }
              }}
            >
              <CardContent className="px-6 py-5 bg-white/50 dark:bg-gray-800/50 border-t 
                border-gray-100 dark:border-gray-700">
                {children}
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </div>
  );
}

interface AccordionProps {
  items: {
    title: string;
    content: React.ReactNode;
    icon?: React.ReactNode;
  }[];
  className?: string;
  allowMultiple?: boolean;
  openIndexes?: number[];
  onToggle?: (indexes: number[]) => void;
}

export default function Accordion({ 
  items, 
  className = '',
  allowMultiple = false,
  openIndexes: controlledOpenIndexes,
  onToggle: onControlledToggle
}: AccordionProps) {
  const [internalOpenIndexes, setInternalOpenIndexes] = React.useState<number[]>([]);
  
  const openIndexes = controlledOpenIndexes ?? internalOpenIndexes;
  const setOpenIndexes = (value: number[] | ((prev: number[]) => number[])) => {
    if (onControlledToggle) {
      onControlledToggle(typeof value === 'function' ? value(openIndexes) : value);
    } else {
      setInternalOpenIndexes(value);
    }
  };

  const toggleItem = (index: number) => {
    if (allowMultiple) {
      setOpenIndexes(prev => 
        prev.includes(index) 
          ? prev.filter(i => i !== index)
          : [...prev, index]
      );
    } else {
      setOpenIndexes(prev => 
        prev.includes(index) ? [] : [index]
      );
    }

    // Scroll into view if needed
    const element = document.getElementById(`accordion-item-${index}`);
    if (element) {
      const rect = element.getBoundingClientRect();
      const isOutOfView = rect.bottom > window.innerHeight || rect.top < 0;
      
      if (isOutOfView) {
        element.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center'
        });
      }
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {items.map((item, index) => (
        <AccordionItem
          key={index}
          id={`accordion-item-${index}`}
          title={item.title}
          icon={item.icon}
          isOpen={openIndexes.includes(index)}
          onToggle={() => toggleItem(index)}
        >
          {item.content}
        </AccordionItem>
      ))}
    </div>
  );
} 