import { FAQItem } from './faq.data';

export interface HighlightedFAQ extends FAQItem {
  highlightedQuestion?: string;
  highlightedAnswer?: string;
}

export const PLACEHOLDER_QUERIES = [
  "How long does powder coating last?",
  "What materials can be coated?",
  "Do you offer color matching?",
  "What is the cost?"
] as const; 