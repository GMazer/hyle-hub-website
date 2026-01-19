
import React from 'react';
import { Product, Category } from '../../../../../packages/shared/types';
import ProductCard from './ProductCard';
import { Sparkles } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  categories: Category[];
  onProductClick: (product: Product) => void;
  onClearFilters: () => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({ 
  products, 
  categories, 
  onProductClick,
  onClearFilters
}) => {
  if (products.length === 0) {
    return (
      <div className="text-center py-24 border border-dashed border-gray-800 rounded-2xl bg-gray-900/50 backdrop-blur-sm mt-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-800 mb-4 text-emerald-500 shadow-[0_0_20px_-5px_rgba(16,185,129,0.3)]">
          <Sparkles size={32} />
        </div>
        <h3 className="text-lg font-bold text-white">Chưa có sản phẩm nào</h3>
        <p className="text-gray-500 mt-2 text-sm">Thử thay đổi bộ lọc, khoảng giá hoặc từ khoá tìm kiếm.</p>
        
        <button 
          onClick={onClearFilters}
          className="mt-6 px-6 py-2 bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 rounded-full hover:bg-emerald-600 hover:text-white transition-all"
        >
          Xóa bộ lọc
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {products.map(product => (
         <ProductCard 
           key={product.id}
           product={product}
           category={categories.find(c => c.id === product.categoryId)}
           onClick={onProductClick}
         />
      ))}
    </div>
  );
};

export default ProductGrid;
