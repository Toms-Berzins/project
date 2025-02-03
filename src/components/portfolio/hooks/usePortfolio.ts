import { useState, useCallback } from 'react';
import { PortfolioItem } from '../types';

const ITEMS_PER_PAGE = 6;

export const usePortfolio = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Automotive');
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const [visibleItems, setVisibleItems] = useState(ITEMS_PER_PAGE);

  // This would typically come from an API or database
  const portfolioItems: PortfolioItem[] = [
    // ... your portfolio items here
  ];

  const categories = [...new Set(portfolioItems.map(item => item.category))];

  const filteredItems = portfolioItems.filter(item => item.category === selectedCategory);

  const displayedItems = filteredItems.slice(0, visibleItems);
  const hasMore = visibleItems < filteredItems.length;

  const handleCategoryChange = useCallback((category: string) => {
    setSelectedCategory(category);
    setVisibleItems(ITEMS_PER_PAGE);
  }, []);

  const handleLoadMore = useCallback(() => {
    setVisibleItems(prev => prev + ITEMS_PER_PAGE);
  }, []);

  const handleItemSelect = useCallback((item: PortfolioItem) => {
    setSelectedItem(item);
  }, []);

  const handleItemDeselect = useCallback(() => {
    setSelectedItem(null);
  }, []);

  return {
    selectedCategory,
    selectedItem,
    displayedItems,
    categories,
    hasMore,
    handleCategoryChange,
    handleLoadMore,
    handleItemSelect,
    handleItemDeselect,
  };
}; 