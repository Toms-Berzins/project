import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';
import { Search, Lightbulb } from 'lucide-react';
import Accordion from './ui/Accordion';
import Particles from './effects/Particles';
import { faqs, categoryColors } from './FAQ/faq.data';
import { CategoryIcon } from './FAQ/CategoryIcon';
import Input from './ui/Input';
import { HighlightedFAQ } from './FAQ/types';
import { PLACEHOLDER_QUERIES } from './FAQ/constants';

const FAQ = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [hoveredQuestion, setHoveredQuestion] = useState<string | null>(null);
  const [suggestedQuestion, setSuggestedQuestion] = useState<string | null>(null);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [typedPlaceholder, setTypedPlaceholder] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [openIndexes, setOpenIndexes] = useState<number[]>([]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

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

  // Highlight matching text
  const highlightText = (text: string, query: string) => {
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map(part => 
      part.toLowerCase() === query.toLowerCase() 
        ? `<mark class="bg-orange-200/20 text-orange-400 px-1 rounded">${part}</mark>`
        : part
    ).join('');
  };

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

  return (
    <section className="relative py-24 bg-gradient-to-b from-gray-900 to-gray-800 overflow-hidden">
      <div className="absolute inset-0">
        <Particles />
        <div className="absolute inset-0 bg-gradient-radial from-orange-500/5 via-transparent to-transparent" />
      </div>
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
      >
        <motion.div 
          variants={itemVariants} 
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent 
            bg-gradient-to-r from-orange-400 to-orange-600 mb-6
            [text-shadow:_0_2px_10px_rgba(251,146,60,0.3)]">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-300 [text-shadow:_0_1px_5px_rgba(255,255,255,0.1)]">
            Find answers to common questions about our powder coating services.
          </p>
        </motion.div>

        <motion.div 
          variants={itemVariants}
          className="mb-8"
        >
          <div className="relative group">
            <Input
              type="text"
              placeholder={isSearchFocused ? "Type to search..." : typedPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              fullWidth
              variant="filled"
              className="pl-12 py-3 text-lg"
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
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
                  setOpenIndexes([]);
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
              >
                <h3 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${categoryColors[category as keyof typeof categoryColors]}`}>
                    <CategoryIcon category={category as keyof typeof categoryColors} />
                  </div>
                  <span className="capitalize">{category} Questions</span>
                </h3>
                
                <Accordion 
                  items={categoryFaqs.map((faq, idx) => ({
                    title: searchQuery ? (
                      (faq as HighlightedFAQ).highlightedQuestion || faq.question
                    ) : faq.question,
                    content: (
                      <motion.div 
                        className="prose prose-invert max-w-none relative"
                        onMouseEnter={() => setHoveredQuestion(faq.question)}
                        onMouseLeave={() => setHoveredQuestion(null)}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ 
                          opacity: 1, 
                          y: 0,
                          transition: { delay: idx * 0.1 }
                        }}
                      >
                        <div 
                          className="text-gray-300"
                          dangerouslySetInnerHTML={{ 
                            __html: (faq as HighlightedFAQ).highlightedAnswer || faq.answer 
                          }}
                        />
                        
                        {/* AI Suggestion Tooltip */}
                        <AnimatePresence>
                          {hoveredQuestion === faq.question && suggestedQuestion && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 10 }}
                              className="mt-4 p-3 rounded-lg bg-orange-500/10 border border-orange-500/20
                                flex items-start gap-2"
                            >
                              <Lightbulb className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                              <div>
                                <p className="text-sm font-medium text-orange-400 mb-1">
                                  Related Question
                                </p>
                                <p className="text-sm text-gray-300">
                                  {suggestedQuestion}
                                </p>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    )
                  }))}
                  className="space-y-4"
                  openIndexes={openIndexes}
                  onToggle={setOpenIndexes}
                  allowMultiple
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </section>
  );
};

export default FAQ;