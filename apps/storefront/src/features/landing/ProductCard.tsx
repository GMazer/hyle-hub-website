
import React, { useState } from 'react';
import { Product, Category } from '../../../../../packages/shared/types';
import { Flame, Zap, Star, Eye, ShoppingCart, ImageOff } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  category?: Category;
  onClick: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, category, onClick }) => {
  const [imgError, setImgError] = useState(false);

  const minPrice = product.priceOptions && product.priceOptions.length > 0 
    ? Math.min(...product.priceOptions.map(p => p.price)) 
    : 0;
  const currency = product.priceOptions && product.priceOptions.find(p => p.price === minPrice)?.currency || 'đ';

  // Better Price Formatting:
  // If currency is 'K' and price >= 1000 (e.g. 89000), show "89K"
  // If price < 1000, show raw value "60K"
  const formatPrice = (price: number, curr: string) => {
    if (price === 0) return 'Liên hệ';
    if (curr.toUpperCase() === 'K' && price >= 1000) {
      return new Intl.NumberFormat('vi-VN').format(price / 1000) + 'K';
    }
    return new Intl.NumberFormat('vi-VN').format(price) + curr.toUpperCase();
  };

  const displayPrice = formatPrice(minPrice, currency);
  
  // Fake original price for strikethrough (approx +36%)
  const originalPrice = formatPrice(Math.round(minPrice * 1.36), currency);

  return (
    <div 
      onClick={() => onClick(product)}
      className={`group relative flex flex-col bg-[#1a1d21] rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] hover:-translate-y-1 h-full ${
        product.isHot 
          ? 'border border-orange-500/50 shadow-[0_0_15px_rgba(249,115,22,0.15)]' 
          : 'border border-white/5 hover:border-emerald-500/40'
      }`}
    >
      {/* HOT BADGE - Absolute Top Left */}
      {product.isHot && (
        <div className="absolute top-0 left-0 z-30 pointer-events-none">
          <div className="relative">
             {/* Background Shape */}
             <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-orange-600 via-red-600 to-transparent opacity-80 blur-lg rounded-full -translate-x-1/2 -translate-y-1/2"></div>
             
             <div className="relative flex items-center gap-1 bg-gradient-to-r from-orange-600 to-red-600 text-white text-[10px] font-black uppercase px-3 py-1.5 rounded-br-2xl shadow-lg border-b border-r border-white/20">
                <Flame size={12} fill="currentColor" className="animate-pulse" />
                HOT PICK
             </div>
          </div>
        </div>
      )}

      {/* Image Section - Full Display No Padding */}
      <div className="relative aspect-[4/3] w-full bg-gray-800 flex items-center justify-center overflow-hidden">
         {!imgError ? (
           <img 
            src={product.thumbnailUrl} 
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            // Important: Bypass referrer checks for hotlinked images
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
          />
         ) : (
           <div className="flex flex-col items-center justify-center text-gray-600 gap-2 p-4 text-center">
             <ImageOff size={32} />
             <span className="text-[10px] uppercase font-bold text-gray-500 line-clamp-2">{product.name}</span>
           </div>
         )}
        
        {/* Category Icon Overlay - Top Left (Offset slightly if Hot) */}
        {category?.iconUrl ? (
          <div className={`absolute left-3 z-20 w-5 h-5 drop-shadow-md filter brightness-110 ${product.isHot ? 'top-10' : 'top-3'}`}>
            <img src={category.iconUrl} alt="cat-icon" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
          </div>
        ) : (
          <div className={`absolute left-3 z-20 text-yellow-500 drop-shadow-md ${product.isHot ? 'top-10' : 'top-3'}`}>
            <Zap size={20} fill="currentColor" />
          </div>
        )}

        {/* Sale Badge - Top Right */}
        <div className="absolute top-3 right-3 z-20">
           <span className="bg-emerald-600/90 text-white text-[10px] font-bold px-2 py-1 rounded-full backdrop-blur-sm border border-emerald-400/30 shadow-lg">
             SALE 36%
           </span>
        </div>

        {/* Gradient Overlay for Text Readability - Warmer if hot */}
        <div className={`absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t opacity-80 ${
           product.isHot ? 'from-[#1a1d21] via-[#1a1d21]/80 to-transparent' : 'from-[#1a1d21] to-transparent'
        }`}></div>
      </div>

      {/* Content Section */}
      <div className="p-4 flex flex-col flex-1 relative z-10 -mt-2">
        <h3 className={`text-sm md:text-base font-bold uppercase mb-1 line-clamp-1 transition-colors tracking-wide ${
           product.isHot ? 'text-orange-100 group-hover:text-orange-400 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]' : 'text-gray-100 group-hover:text-emerald-400'
        }`}>
          {product.name}
        </h3>
        
        <p className="text-gray-500 text-xs mb-4 line-clamp-2 min-h-[2.5em]">
          {product.shortDescription}
        </p>

        <div className="mt-auto">
          {/* Rating & Price */}
          <div className="flex items-end justify-between mb-3">
             <div className="flex gap-0.5 mb-1">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} size={12} fill={product.isHot ? "#f97316" : "#10b981"} className={product.isHot ? "text-orange-500" : "text-emerald-500"} />
                ))}
             </div>
             <div className="text-right">
               <span className="text-gray-500 text-[10px] line-through block leading-none mb-0.5">
                 {originalPrice}
               </span>
               <span className={`text-lg font-bold leading-none ${product.isHot ? 'text-orange-400' : 'text-emerald-400'}`}>
                 {displayPrice}
               </span>
             </div>
          </div>

          {/* Action Buttons */}
          <div className={`grid grid-cols-4 gap-2 border-t pt-3 ${product.isHot ? 'border-orange-500/20' : 'border-white/5'}`}>
             <button className="col-span-1 h-9 flex items-center justify-center rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white transition-all border border-white/5 hover:border-white/20">
                <Eye size={16} />
             </button>
             <button className={`col-span-3 h-9 flex items-center justify-center gap-2 rounded-lg transition-all font-medium text-sm ${
                product.isHot 
                  ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white hover:brightness-110 shadow-lg shadow-orange-900/20'
                  : 'bg-emerald-600/10 text-emerald-500 hover:bg-emerald-600 hover:text-white border border-emerald-500/20 hover:border-emerald-500'
             }`}>
                <ShoppingCart size={16} /> 
                <span>Mua ngay</span>
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
