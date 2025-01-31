export interface FAQItem {
  question: string;
  answer: string;
  category: 'general' | 'process' | 'technical' | 'pricing';
}

export const faqs: FAQItem[] = [
  {
    question: 'What is powder coating and how does it differ from traditional paint?',
    answer: 'Powder coating is a dry finishing process that uses finely ground particles of pigment and resin electrostatically charged and sprayed onto a surface. Unlike liquid paint, powder coating creates a more durable, uniform finish that\'s resistant to chipping, scratching, and fading.',
    category: 'general'
  },
  {
    question: 'How long does the powder coating process take?',
    answer: 'The typical turnaround time for powder coating is 2-3 business days, depending on the complexity of the project and current workload. Rush services are available for urgent projects, usually completed within 24-48 hours.',
    category: 'process'
  },
  {
    question: 'What types of materials can be powder coated?',
    answer: 'Most metals can be powder coated, including steel, aluminum, and stainless steel. The material must be able to withstand the heating process (350-400°F). Materials like plastic, wood, and rubber cannot be powder coated.',
    category: 'technical'
  },
  {
    question: 'How durable is powder coating?',
    answer: 'Powder coating is extremely durable and can last up to 20 years. It\'s resistant to UV rays, weather, chemicals, and impact. The finish won\'t crack, peel, or fade under normal conditions.',
    category: 'technical'
  },
  {
    question: 'What colors and finishes are available?',
    answer: 'We offer a wide range of colors, including standard RAL colors, custom matches, and specialty finishes like metallic, textured, and chrome effects. Finishes can be matte, satin, or high gloss.',
    category: 'technical'
  },
  {
    question: 'Do you offer color matching services?',
    answer: 'Yes, we provide custom color matching services. We can match virtually any color sample you provide, including paint swatches, existing powder coated items, or other color references.',
    category: 'process'
  },
  {
    question: 'What is the cost of powder coating?',
    answer: 'The cost varies depending on the size of the project, complexity, and finish type. We provide detailed quotes after assessing your specific requirements. Volume discounts are available for larger projects.',
    category: 'pricing'
  },
  {
    question: 'Do you offer a warranty on your powder coating?',
    answer: 'Yes, we offer a standard 5-year warranty on our powder coating services against peeling, cracking, or significant fading under normal use conditions.',
    category: 'general'
  }
];

export const categoryColors = {
  general: 'from-blue-500/10 to-blue-600/5 hover:from-blue-500/20 hover:to-blue-600/10 border-blue-500/10',
  process: 'from-green-500/10 to-green-600/5 hover:from-green-500/20 hover:to-green-600/10 border-green-500/10',
  technical: 'from-purple-500/10 to-purple-600/5 hover:from-purple-500/20 hover:to-purple-600/10 border-purple-500/10',
  pricing: 'from-orange-500/10 to-orange-600/5 hover:from-orange-500/20 hover:to-orange-600/10 border-orange-500/10'
}; 