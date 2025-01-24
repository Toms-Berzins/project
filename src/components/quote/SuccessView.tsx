import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import { FormData, PriceBreakdown } from './types';
import { generateQuotePDF } from '../../services/pdfService';

interface SuccessViewProps {
  quoteReference: string;
  formData: FormData;
  priceBreakdown: PriceBreakdown;
  onStartNewQuote: () => void;
}

export const SuccessView = ({
  quoteReference,
  formData,
  priceBreakdown,
  onStartNewQuote,
}: SuccessViewProps) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="text-center p-8"
  >
    <div className="mb-6">
      <h2 className="text-2xl font-bold mb-4">Quote Submitted Successfully!</h2>
      <p className="text-gray-600 mb-4">
        Your quote reference number is: {quoteReference}
      </p>
      <p className="text-gray-600">
        A confirmation email has been sent to {formData.contact.email}
      </p>
    </div>

    <div className="flex justify-center space-x-4">
      <button
        onClick={() => generateQuotePDF(formData, priceBreakdown, quoteReference)}
        className="flex items-center gap-2 bg-accent text-white px-6 py-2 rounded-lg hover:bg-accent/90 transition-colors"
      >
        <Download className="w-5 h-5" />
        Download PDF
      </button>
      
      <button
        onClick={onStartNewQuote}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Start New Quote
      </button>
    </div>
  </motion.div>
); 