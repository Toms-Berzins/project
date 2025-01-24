import { Plus, Minus } from 'lucide-react';
import { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: 'What is powder coating and how does it differ from traditional paint?',
    answer: 'Powder coating is a dry finishing process that uses finely ground particles of pigment and resin electrostatically charged and sprayed onto a surface. Unlike liquid paint, powder coating creates a more durable, uniform finish that\'s resistant to chipping, scratching, and fading.',
  },
  {
    question: 'How long does the powder coating process take?',
    answer: 'The typical turnaround time for powder coating is 2-3 business days, depending on the complexity of the project and current workload. Rush services are available for urgent projects, usually completed within 24-48 hours.',
  },
  {
    question: 'What types of materials can be powder coated?',
    answer: 'Most metals can be powder coated, including steel, aluminum, and stainless steel. The material must be able to withstand the heating process (350-400°F). Materials like plastic, wood, and rubber cannot be powder coated.',
  },
  {
    question: 'How durable is powder coating?',
    answer: 'Powder coating is extremely durable and can last up to 20 years. It\'s resistant to UV rays, weather, chemicals, and impact. The finish won\'t crack, peel, or fade under normal conditions.',
  },
  {
    question: 'What colors and finishes are available?',
    answer: 'We offer a wide range of colors, including standard RAL colors, custom matches, and specialty finishes like metallic, textured, and chrome effects. Finishes can be matte, satin, or high gloss.',
  },
  {
    question: 'Do you offer color matching services?',
    answer: 'Yes, we provide custom color matching services. We can match virtually any color sample you provide, including paint swatches, existing powder coated items, or other color references.',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-24 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Find answers to common questions about our powder coating services.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
            >
              <button
                className="w-full px-6 py-4 flex items-center justify-between text-left"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="text-lg font-medium text-gray-900 dark:text-white">
                  {faq.question}
                </span>
                {openIndex === index ? (
                  <Minus className="w-5 h-5 text-accent flex-shrink-0" />
                ) : (
                  <Plus className="w-5 h-5 text-accent flex-shrink-0" />
                )}
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4">
                  <p className="text-gray-600 dark:text-gray-300">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}