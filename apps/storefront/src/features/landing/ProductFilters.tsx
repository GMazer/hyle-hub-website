
import React, { useState } from 'react';
import { Category } from '../../../../../packages/shared/types';
import { Search, SlidersHorizontal, ArrowDownUp, Banknote, X } from 'lucide-react';

export type SortOption = 'default' | 'price_asc' | 'price_desc' | 'name_asc';
export type PriceRange = 'all' | 'under_50' | '50_200' | '200_500' | 'above_500';

interface ProductFiltersProps {
  categories: Category[];
  selectedCategory: string;
  setSelectedCategory: (id: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  // New Props
  sortOption: SortOption;
  setSortOption: (opt: SortOption) => void;
  priceRange: PriceRange;
  setPriceRange: (range: PriceRange) => void;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({ 
  categories, 
  selectedCategory, 
  setSelectedCategory, 
  searchQuery, 
  setSearchQuery,
  sortOption,
  setSortOption,
  priceRange,
  setPriceRange
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Helper to count active filters for badge
  const activeFiltersCount = (sortOption !== 'default' ? 1 : 0) + (priceRange !== 'all' ? 1 : 0);

  return (
    <div className="mb-10 sticky top-[70px] md:top-[80px] z-30 transition-all duration-200">
      
      {/* Main Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-gray-900/80 backdrop-blur-xl py-4 -mx-4 px-4 md:mx-0 md:px-6 rounded-2xl border border-white/5 shadow-2xl">
        
        {/* Categories (Scrollable) */}
        <div className="flex overflow-x-auto pb-2 md:pb-0 gap-2 w-full md:w-auto hide-scrollbar items-center">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`whitespace-nowrap px-5 py-2.5 rounded-xl text-sm font-bold transition-all border ${
              selectedCategory === 'all' 
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-transparent shadow-[0_0_20px_rgba(16,185,129,0.4)]' 
                : 'bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-800 border-white/5 hover:border-white/20'
            }`}
          >
            Tất cả
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 whitespace-nowrap px-5 py-2.5 rounded-xl text-sm font-bold transition-all border ${
                selectedCategory === cat.id 
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-transparent shadow-[0_0_20px_rgba(16,185,129,0.4)]' 
                  : 'bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-800 border-white/5 hover:border-white/20'
              }`}
            >
              {cat.iconUrl && <img src={cat.iconUrl} alt="" className="w-4 h-4 object-contain" />}
              {cat.name}
            </button>
          ))}
        </div>

        {/* Right Side: Search & Filter Toggle */}
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-64 group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-500 group-focus-within:text-emerald-400 transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Tìm kiếm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-4 py-2.5 border border-white/10 rounded-xl leading-5 bg-gray-900/50 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 sm:text-sm transition-all shadow-inner group-hover:border-white/20 group-hover:bg-gray-900"
            />
          </div>

          <button 
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`relative flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border transition-all ${
              showAdvanced || activeFiltersCount > 0
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50' 
                : 'bg-gray-800/50 text-gray-400 border-white/10 hover:bg-gray-800 hover:text-white'
            }`}
          >
            {showAdvanced ? <X size={18} /> : <SlidersHorizontal size={18} />}
            <span className="hidden sm:inline font-medium">Bộ lọc</span>
            {activeFiltersCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full shadow-lg">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Advanced Filter Panel (Collapsible) */}
      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          showAdvanced ? 'max-h-[500px] opacity-100 mt-2' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="bg-[#13161c]/95 backdrop-blur-md border border-white/10 rounded-2xl p-4 md:p-6 shadow-2xl grid grid-cols-1 md:grid-cols-2 gap-6">
           
           {/* Sort Options */}
           <div>
              <h4 className="text-sm font-bold text-gray-400 uppercase mb-3 flex items-center gap-2">
                <ArrowDownUp size={14}/> Sắp xếp theo
              </h4>
              <div className="grid grid-cols-2 gap-2">
                 {[
                   { id: 'default', label: 'Nổi bật nhất' },
                   { id: 'price_asc', label: 'Giá: Thấp -> Cao' },
                   { id: 'price_desc', label: 'Giá: Cao -> Thấp' },
                   { id: 'name_asc', label: 'Tên: A -> Z' },
                 ].map((opt) => (
                   <button
                     key={opt.id}
                     onClick={() => setSortOption(opt.id as SortOption)}
                     className={`text-sm py-2 px-3 rounded-lg text-left transition-colors border ${
                        sortOption === opt.id
                          ? 'bg-emerald-600/20 border-emerald-500/50 text-emerald-400 font-medium'
                          : 'bg-gray-800/50 border-transparent text-gray-500 hover:bg-gray-800 hover:text-gray-300'
                     }`}
                   >
                     {opt.label}
                   </button>
                 ))}
              </div>
           </div>

           {/* Price Range */}
           <div>
              <h4 className="text-sm font-bold text-gray-400 uppercase mb-3 flex items-center gap-2">
                <Banknote size={14}/> Khoảng giá
              </h4>
              <div className="flex flex-wrap gap-2">
                 {[
                   { id: 'all', label: 'Tất cả' },
                   { id: 'under_50', label: '< 50k' },
                   { id: '50_200', label: '50k - 200k' },
                   { id: '200_500', label: '200k - 500k' },
                   { id: 'above_500', label: '> 500k' },
                 ].map((opt) => (
                   <button
                     key={opt.id}
                     onClick={() => setPriceRange(opt.id as PriceRange)}
                     className={`text-sm py-1.5 px-4 rounded-full border transition-all ${
                        priceRange === opt.id
                          ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-900/20'
                          : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500 hover:text-white'
                     }`}
                   >
                     {opt.label}
                   </button>
                 ))}
              </div>
           </div>
        </div>
      </div>

    </div>
  );
};

export default ProductFilters;
