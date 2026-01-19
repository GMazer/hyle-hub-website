
import React from 'react';
import { Category } from '../../../../../packages/shared/types';
import { Search } from 'lucide-react';

interface ProductFiltersProps {
  categories: Category[];
  selectedCategory: string;
  setSelectedCategory: (id: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({ 
  categories, 
  selectedCategory, 
  setSelectedCategory, 
  searchQuery, 
  setSearchQuery 
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-10 sticky top-[70px] md:top-[80px] z-30 bg-gray-900/80 backdrop-blur-xl py-4 -mx-4 px-4 md:mx-0 md:px-6 rounded-2xl border border-white/5 shadow-2xl transition-all duration-200">
      
      <div className="flex overflow-x-auto pb-2 md:pb-0 gap-2 w-full md:w-auto hide-scrollbar">
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

      <div className="relative w-full md:w-72 group">
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
    </div>
  );
};

export default ProductFilters;
