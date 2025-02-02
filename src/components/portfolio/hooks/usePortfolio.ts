import { useState, useEffect, useCallback } from 'react';
import portfolioService from '../../../services/portfolioService';
import { PortfolioItem } from '../types';

interface UsePortfolioProps {
  itemsPerPage?: number;
}

export const usePortfolio = ({ itemsPerPage = 6 }: UsePortfolioProps = {}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize loading state
  useEffect(() => {
    setIsLoading(false);
  }, []);

  // Get categories
  const categories = portfolioService.getCategories();

  // Get paginated items
  const { items: displayedItems, hasMore, total } = portfolioService.getPaginatedItems(
    currentPage,
    itemsPerPage,
    selectedCategory
  );

  // Reset pagination when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  // Handle category selection
  const handleCategoryChange = useCallback((category: string) => {
    setSelectedCategory(category);
  }, []);

  // Handle load more
  const handleLoadMore = useCallback(() => {
    setCurrentPage(prev => prev + 1);
  }, []);

  // Handle item selection
  const handleItemSelect = useCallback((item: PortfolioItem) => {
    setSelectedItem(item);
  }, []);

  // Handle item deselection
  const handleItemDeselect = useCallback(() => {
    setSelectedItem(null);
  }, []);

  return {
    // State
    selectedCategory,
    selectedItem,
    displayedItems,
    categories,
    isLoading,
    hasMore,
    total,

    // Actions
    handleCategoryChange,
    handleLoadMore,
    handleItemSelect,
    handleItemDeselect,
  };
}; 