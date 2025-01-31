import { QuestionMarkCircleIcon, WrenchIcon, CurrencyDollarIcon, CogIcon } from '@heroicons/react/24/outline';

interface CategoryIconProps {
  category: 'general' | 'process' | 'technical' | 'pricing';
}

export const CategoryIcon = ({ category }: CategoryIconProps) => {
  switch (category) {
    case 'general':
      return <QuestionMarkCircleIcon className="w-6 h-6" />;
    case 'process':
      return <CogIcon className="w-6 h-6" />;
    case 'technical':
      return <WrenchIcon className="w-6 h-6" />;
    case 'pricing':
      return <CurrencyDollarIcon className="w-6 h-6" />;
  }
}; 