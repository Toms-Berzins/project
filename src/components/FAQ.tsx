import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useMemo, useRef } from 'react';
import { Search, ArrowUp } from 'lucide-react';
import Accordion from './ui/Accordion';
import { faqs, categoryColors } from './FAQ/faq.data';
import { CategoryIcon } from './FAQ/CategoryIcon';
import Input from './ui/Input';
import { HighlightedFAQ } from './FAQ/types';
import { PLACEHOLDER_QUERIES } from './FAQ/constants';
import { containerVariants, itemVariants } from './FAQ/animations';
import { highlightText } from './FAQ/utils';
import { useReducedMotion } from 'framer-motion';

// Add FloatingBackground component
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

const FAQ = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [hoveredQuestion, setHoveredQuestion] = useState<string | null>(null);
  const [suggestedQuestion, setSuggestedQuestion] = useState<string | null>(null);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [typedPlaceholder, setTypedPlaceholder] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [openQuestion, setOpenQuestion] = useState<{ category: string; index: number } | null>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  // Add refs for each category section
  const categoryRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Add scroll listener for back to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Group FAQs by category
  const faqsByCategory = useMemo(() => {
    return faqs.reduce((acc, faq) => {
      if (!acc[faq.category]) {
        acc[faq.category] = [];
      }
      acc[faq.category].push(faq);
      return acc;
    }, {} as Record<string, typeof faqs>);
  }, []);

  // Filter and highlight FAQs
  const { filteredFaqsByCategory } = useMemo(() => {
    let filtered = [...faqs];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(faq => {
        const matchQuestion = faq.question.toLowerCase().includes(query);
        const matchAnswer = faq.answer.toLowerCase().includes(query);
        
        if (matchQuestion || matchAnswer) {
          const highlightedFaq: HighlightedFAQ = {
            ...faq,
            highlightedQuestion: matchQuestion ? highlightText(faq.question, query) : faq.question,
            highlightedAnswer: matchAnswer ? highlightText(faq.answer, query) : faq.answer
          };
          return highlightedFaq;
        }
        return false;
      });
    }
    
    if (selectedCategory) {
      filtered = filtered.filter(faq => faq.category === selectedCategory);
    }

    // Group filtered FAQs by category
    const groupedByCategory = filtered.reduce((acc, faq) => {
      if (!acc[faq.category]) {
        acc[faq.category] = [];
      }
      acc[faq.category].push(faq as HighlightedFAQ);
      return acc;
    }, {} as Record<string, HighlightedFAQ[]>);
    
    return {
      filteredFaqsByCategory: groupedByCategory
    };
  }, [searchQuery, selectedCategory]);

  const categoriesWithContent = Object.keys(
    searchQuery ? filteredFaqsByCategory : faqsByCategory
  );

  // Find related question when hovering
  useEffect(() => {
    if (!hoveredQuestion) {
      setSuggestedQuestion(null);
      return;
    }

    const currentFaq = faqs.find(faq => faq.question === hoveredQuestion);
    if (!currentFaq) return;

    // Simple keyword matching for related questions
    const keywords = currentFaq.question.toLowerCase().split(' ');
    const relatedFaqs = faqs.filter(faq => 
      faq.question !== hoveredQuestion && 
      keywords.some(keyword => 
        faq.question.toLowerCase().includes(keyword) ||
        faq.answer.toLowerCase().includes(keyword)
      )
    );

    if (relatedFaqs.length > 0) {
      const randomRelated = relatedFaqs[Math.floor(Math.random() * relatedFaqs.length)];
      setSuggestedQuestion(randomRelated.question);
    }
  }, [hoveredQuestion]);

  const handleRelatedQuestionClick = (question: string) => {
    // Find the category and index of the related question
    let targetCategory = '';
    let questionIndex = -1;

    for (const category in faqsByCategory) {
      const index = faqsByCategory[category].findIndex(faq => faq.question === question);
      if (index !== -1) {
        targetCategory = category;
        questionIndex = index;
        break;
      }
    }

    if (targetCategory && questionIndex !== -1) {
      setSelectedCategory(targetCategory);
      // Wait for the category to be selected and scrolled before opening the question
      setTimeout(() => {
        setOpenQuestion({ category: targetCategory, index: questionIndex });
        scrollToCategory(targetCategory);
      }, 100);
    }
  };

  // Animated placeholder effect
  useEffect(() => {
    let currentIndex = 0;
    let timeout: NodeJS.Timeout;

    const typePlaceholder = () => {
      const targetText = PLACEHOLDER_QUERIES[placeholderIndex];
      if (currentIndex <= targetText.length) {
        setTypedPlaceholder(targetText.slice(0, currentIndex));
        currentIndex++;
        timeout = setTimeout(typePlaceholder, 50);
      } else {
        timeout = setTimeout(() => {
          setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDER_QUERIES.length);
          currentIndex = 0;
        }, 2000);
      }
    };

    if (!isSearchFocused) {
      typePlaceholder();
    }

    return () => clearTimeout(timeout);
  }, [placeholderIndex, isSearchFocused]);

  const scrollToCategory = (category: string) => {
    const element = categoryRefs.current[category];
    if (element) {
      const offset = 100; // Offset to account for fixed header if any
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="relative py-8 sm:py-16 lg:py-24 bg-gradient-to-b from-gray-900 to-gray-800 overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 via-transparent to-gray-800/80 pointer-events-none" />
      <FloatingBackground />
      <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-orange-500/20 to-transparent" />
      <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-orange-500/20 to-transparent" />
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
      >
        <motion.div 
          variants={itemVariants} 
          className="text-center mb-16"
        >
          <h2 className="title-primary mb-4">
            Frequently Asked Questions
          </h2>
          <p className="subtitle-primary max-w-2xl mx-auto">
            Find answers to common questions about our powder coating services.
          </p>
        </motion.div>

        <motion.div 
          variants={itemVariants}
          className="mb-8"
        >
          <div className="relative group glass-panel">
            <Input
              ref={searchInputRef}
              type="text"
              placeholder={isSearchFocused ? "Type to search..." : typedPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              fullWidth
              variant="filled"
              className="pl-12 py-3 text-lg min-h-[50px]"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <motion.div
              initial={false}
              animate={isSearchFocused ? "focused" : "unfocused"}
              variants={{
                focused: { opacity: 1, scale: 1.2 },
                unfocused: { opacity: 0.7, scale: 1 }
              }}
              transition={{ duration: 0.2 }}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-1 h-5 bg-orange-400/50
                animate-pulse"
            />
          </div>
        </motion.div>

        <motion.div 
          variants={itemVariants}
          layout
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {categoriesWithContent.map(category => (
              <motion.div 
                key={category}
                layout
                whileHover={{ 
                  scale: 1.03,
                  transition: { duration: 0.2 }
                }}
                whileTap={{ 
                  scale: 0.98,
                  rotate: [-1, 1, -1, 0],
                  transition: { 
                    duration: 0.3,
                    rotate: {
                      duration: 0.3,
                      ease: "easeOut",
                      times: [0, 0.2, 0.4, 1]
                    }
                  }
                }}
                animate={{ 
                  rotate: 0,
                  transition: { duration: 0.2 }
                }}
                onClick={() => {
                  setSelectedCategory(
                    selectedCategory === category ? null : category
                  );
                  // Reset open indexes when changing category
                  setOpenQuestion(null);
                  // Scroll to the category section
                  scrollToCategory(category);
                }}
                className={`p-4 rounded-xl bg-gradient-to-br ${categoryColors[category as keyof typeof categoryColors]} 
                  backdrop-blur-lg transition-all duration-300 cursor-pointer
                  hover:shadow-lg hover:shadow-current/10 border-2
                  group relative overflow-hidden
                  ${selectedCategory === category ? 'ring-2 ring-orange-500 ring-offset-2 ring-offset-gray-900' : ''}`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 
                  translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                <div className="flex items-center gap-3 relative">
                  <motion.div 
                    className="p-2 rounded-lg bg-white/10 group-hover:bg-white/20 transition-colors duration-300"
                    whileHover={{ rotate: [0, -10, 10, -5, 5, 0], transition: { duration: 0.5 } }}
                  >
                    <CategoryIcon category={category as keyof typeof categoryColors} />
                  </motion.div>
                  <span className="capitalize text-white font-medium group-hover:underline 
                    underline-offset-4 transition-all duration-300">
                    {category} Questions ({
                      searchQuery 
                        ? filteredFaqsByCategory[category]?.length || 0
                        : faqsByCategory[category].length
                    })
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {categoriesWithContent.map(category => {
            const categoryFaqs = searchQuery 
              ? filteredFaqsByCategory[category] || []
              : faqsByCategory[category];

            if (categoryFaqs.length === 0) return null;

            return (
              <motion.div 
                key={category} 
                variants={itemVariants} 
                className="mb-12 last:mb-0"
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                ref={el => categoryRefs.current[category] = el}
              >
                <h3 className="text-2xl font-semibold mb-6 flex items-center gap-3 text-white">
                  <div className={`p-2 rounded-lg ${categoryColors[category as keyof typeof categoryColors]}`}>
                    <CategoryIcon category={category as keyof typeof categoryColors} />
                  </div>
                  <span className="capitalize">{category} Questions</span>
                </h3>
                
                <Accordion 
                  items={categoryFaqs.map((faq) => ({
                    title: searchQuery ? (
                      (faq as HighlightedFAQ).highlightedQuestion || faq.question
                    ) : faq.question,
                    content: (
                      <motion.div 
                        className="prose prose-invert max-w-none relative"
                        onMouseEnter={() => setHoveredQuestion(faq.question)}
                        onMouseLeave={() => setHoveredQuestion(null)}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ 
                          height: "auto", 
                          opacity: 1,
                          transition: {
                            height: { duration: 0.3, ease: "easeInOut" },
                            opacity: { duration: 0.2, delay: 0.1 }
                          }
                        }}
                        exit={{ height: 0, opacity: 0 }}
                      >
                        <div className="py-4 px-4 rounded-lg hover:bg-gray-800/50 transition-all">
                          <motion.div 
                            className="text-gray-300"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ 
                              y: 0, 
                              opacity: 1,
                              transition: { delay: 0.1 }
                            }}
                            dangerouslySetInnerHTML={{ 
                              __html: (faq as HighlightedFAQ).highlightedAnswer || faq.answer 
                            }}
                          />
                          
                          {/* Related Question Tooltip */}
                          <AnimatePresence>
                            {hoveredQuestion === faq.question && suggestedQuestion && (
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="mt-2 p-3 rounded-lg bg-orange-500/10 text-sm border border-orange-500/20 cursor-pointer hover:bg-orange-500/20 transition-colors"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRelatedQuestionClick(suggestedQuestion);
                                }}
                              >
                                <div className="flex items-start gap-2">
                                  <span className="font-medium text-orange-400">Related Question</span>
                                  <p className="text-gray-300">{suggestedQuestion}</p>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </motion.div>
                    )
                  }))}
                  className="space-y-4"
                  openIndexes={openQuestion?.category === category ? [openQuestion.index] : []}
                  onToggle={(indexes) => {
                    const clickedIndex = indexes[0];
                    setOpenQuestion(
                      openQuestion?.category === category && openQuestion.index === clickedIndex
                        ? null
                        : { category, index: clickedIndex }
                    );
                  }}
                  allowMultiple={false}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Back to Top Button */}
        <AnimatePresence>
          {showBackToTop && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                boxShadow: [
                  "0px 0px 0px rgba(234, 88, 12, 0)",
                  "0px 0px 15px rgba(234, 88, 12, 0.5)",
                  "0px 0px 0px rgba(234, 88, 12, 0)"
                ]
              }}
              exit={{ opacity: 0, y: 20 }}
              transition={{
                boxShadow: {
                  repeat: Infinity,
                  duration: 2,
                  ease: "easeInOut"
                }
              }}
              whileHover={{ 
                scale: 1.1,
                boxShadow: "0px 0px 20px rgba(234, 88, 12, 0.7)"
              }}
              whileTap={{ scale: 0.9 }}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="fixed bottom-6 right-6 button-primary p-4 rounded-full transform-gpu z-[100]"
            >
              <ArrowUp className="w-6 h-6" />
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
};

export default FAQ;