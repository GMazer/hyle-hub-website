
import { useState, useMemo } from 'react';
import { Product } from '../../../../packages/shared/types';
import { SortOption, PriceRange } from '../features/landing/ProductFilters';

export const useProductFilter = (products: Product[]) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('default');
  const [priceRange, setPriceRange] = useState<PriceRange>('all');

  // Helper: Normalize price for filtering/sorting
  const getNormalizedPrice = (p: Product) => {
    if (!p.priceOptions || p.priceOptions.length === 0) return 0;
    const rawMin = Math.min(...p.priceOptions.map(o => o.price));
    return rawMin < 1000 ? rawMin * 1000 : rawMin;
  };

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      // 1. Category Filter
      const matchesCategory = selectedCategory === 'all' || p.categoryId === selectedCategory;
      
      // 2. Search Filter
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            p.tags?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      
      // 3. Price Range Filter
      let matchesPrice = true;
      if (priceRange !== 'all') {
        const price = getNormalizedPrice(p);
        
        switch (priceRange) {
          case 'under_50': matchesPrice = price < 50000; break;
          case '50_200': matchesPrice = price >= 50000 && price <= 200000; break;
          case '200_500': matchesPrice = price > 200000 && price <= 500000; break;
          case 'above_500': matchesPrice = price > 500000; break;
        }
      }

      return matchesCategory && matchesSearch && matchesPrice;
    }).sort((a, b) => {
      // 4. Sorting Logic
      const priceA = getNormalizedPrice(a);
      const priceB = getNormalizedPrice(b);

      if (sortOption === 'price_asc') return priceA - priceB;
      if (sortOption === 'price_desc') return priceB - priceA;
      if (sortOption === 'name_asc') return a.name.localeCompare(b.name);
      
      // Default: Hot first, then updated recently
      if (a.isHot && !b.isHot) return -1;
      if (!a.isHot && b.isHot) return 1;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
  }, [products, selectedCategory, searchQuery, priceRange, sortOption]);

  const resetFilters = () => {
    setPriceRange('all');
    setSortOption('default');
    setSelectedCategory('all');
    setSearchQuery('');
  };

  return {
    selectedCategory, setSelectedCategory,
    searchQuery, setSearchQuery,
    sortOption, setSortOption,
    priceRange, setPriceRange,
    filteredProducts,
    resetFilters
  };
};
