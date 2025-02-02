import { type IconType } from 'react-icons';
import { FaTools, FaSprayCan, FaShieldAlt, FaQuestionCircle } from 'react-icons/fa';
import { MdOutlineHomeRepairService } from 'react-icons/md';
import { GiPowderBag } from 'react-icons/gi';

export interface FAQCategory {
  id: string;
  name: string;
  icon: IconType;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export const FAQ_CATEGORIES: FAQCategory[] = [
  {
    id: 'all',
    name: 'All Questions',
    icon: FaQuestionCircle
  },
  {
    id: 'process',
    name: 'Process',
    icon: FaTools
  },
  {
    id: 'coating',
    name: 'Coating Types',
    icon: FaSprayCan
  },
  {
    id: 'durability',
    name: 'Durability',
    icon: FaShieldAlt
  },
  {
    id: 'services',
    name: 'Services',
    icon: MdOutlineHomeRepairService
  },
  {
    id: 'materials',
    name: 'Materials',
    icon: GiPowderBag
  }
];

export const FAQ_ITEMS: FAQItem[] = [
  {
    id: '1',
    question: 'What is powder coating?',
    answer: 'Powder coating is a dry finishing process that uses finely ground particles of pigment and resin that are electrostatically charged and sprayed onto a surface. The parts are then heated, and the powder melts and flows to form a durable, high-quality finish.',
    category: 'process'
  },
  // Add more FAQ items here
];

export const PLACEHOLDER_QUERIES = [
  "How long does powder coating last?",
  "What materials can be coated?",
  "Do you offer color matching?",
  "What is the cost?"
] as const; 