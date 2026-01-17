import React, { useEffect, useState } from 'react';
import { clientApi } from '../services/clientApi';
import { SiteConfig, Category, Product, SocialLink } from '../../../packages/shared/types';
import { Search, AlertCircle, Sparkles, Star, Eye, ShoppingCart } from 'lucide-react';
import { DynamicIcon } from '../components/ui/Icons';
import ProductModal from '../components/public/ProductModal';
import Logo from '../components/ui/Logo';
import { useRive } from '@rive-app/react-canvas';
// Import as namespace or default to handle CDN variations (ESM vs CJS)
import * as RiveCanvasModule from '@rive-app/canvas';

// Safe destructuring of Rive classes
const RiveCanvas = (RiveCanvasModule as any).default || RiveCanvasModule;
const { Layout, Fit, Alignment } = RiveCanvas;

// Helper component for Rive Animation
const GalaxyRive = () => {
  // NOTE: You need to place a 'galaxy.riv' file in your 'public' folder for this to work.
  
  // Create layout instance safely
  const layout = new Layout({
    fit: Fit.Cover,
    alignment: Alignment.Center,
  });

  const { RiveComponent } = useRive({
    src: '/galaxy.riv',
    autoplay: true,
    layout: layout,
    onLoad: () => console.log("Rive file loaded successfully")
  });

  return (
    // Removed opacity-60 and mix-blend-screen so the sun/galaxy is fully opaque and vibrant
    <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
      <RiveComponent />
    </div>
  );
};

// Helper component for drawing stars (CSS Fallback/Overlay)
const StarField = React.memo(() => {
  return (
    <div className="stars-container">
      {/* 1. Space Dust (Small, faint, slow) */}
      {[...Array(150)].map((_, i) => (
        <div
          key={`dust-${i}`}
          className="star"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            width: `${Math.random() * 1.5}px`,
            height: `${Math.random() * 1.5}px`,
            '--duration': `${Math.random() * 10 + 10}s`,
            '--opacity': `${Math.random() * 0.3 + 0.1}`
          } as any}
        />
      ))}

      {/* 2. Normal Stars (Medium) */}
      {[...Array(80)].map((_, i) => (
        <div
          key={`star-${i}`}
          className="star"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            width: `${Math.random() * 2 + 1}px`,
            height: `${Math.random() * 2 + 1}px`,
            '--duration': `${Math.random() * 4 + 2}s`,
            '--opacity': `${Math.random() * 0.5 + 0.3}`
          } as any}
        />
      ))}

      {/* 3. Bright Glowing Stars (Large with shadow) */}
      {[...Array(20)].map((_, i) => (
        <div
          key={`glow-${i}`}
          className="star"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            width: `${Math.random() * 3 + 2}px`,
            height: `${Math.random() * 3 + 2}px`,
            '--duration': `${Math.random() * 3 + 1}s`,
            '--opacity': `${Math.random() * 0.4 + 0.6}`,
            boxShadow: `0 0 ${Math.random() * 10 + 4}px rgba(255, 255, 255, ${Math.random() * 0.5 + 0.3})`
          } as any}
        />
      ))}
    </div>
  );
});

const LandingPage: React.FC = () => {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [socials, setSocials] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [conf, cats, prods, socs] = await Promise.all([
          clientApi.getConfig(),
          clientApi.getCategories(),
          clientApi.getProducts(),
          clientApi.getSocials()
        ]);
        setConfig(conf);
        setCategories(cats.filter(c => c.isVisible).sort((a, b) => a.order - b.order));
        setProducts(prods.filter(p => p.status === 'published'));
        setSocials(socs.sort((a, b) => a.order - b.order));
      } catch (e) {
        console.error("Failed to load data", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'all' || p.categoryId === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  if (loading) return <div className="min-h-screen flex items-center justify-center text-emerald-400 font-medium bg-gray-950">Đang tải dữ liệu...</div>;
  if (!config) return <div className="min-h-screen flex items-center justify-center text-gray-200 bg-gray-950">Không thể tải cấu hình (Hãy kiểm tra Backend)</div>;

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col text-gray-100 font-sans selection:bg-emerald-500/30 relative overflow-x-hidden">
      
      {/* --- GLOBAL FIXED BACKGROUND (STARS & GRADIENTS) --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Deep Space Base - Radial Gradient to give 3D depth */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-gray-950 to-black"></div>
        
        {/* 3D Grid Pattern - matrix style */}
        <div className="absolute inset-0 bg-grid-white/[0.03] bg-grid-pattern [mask-image:linear-gradient(to_bottom,transparent,black,transparent)]"></div>

        {/* Moving Nebula Blobs (Enhanced colors & size) */}
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-emerald-600/20 rounded-full mix-blend-screen filter blur-[120px] animate-blob opacity-30"></div>
        <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full mix-blend-screen filter blur-[100px] animate-blob animation-delay-2000 opacity-30"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[700px] h-[700px] bg-purple-600/20 rounded-full mix-blend-screen filter blur-[140px] animate-blob animation-delay-4000 opacity-30"></div>
        
        {/* Twinkling Stars (Overlay everywhere) */}
        <StarField />
      </div>
      
      {/* Content Layer - z-index ensures it sits above fixed background */}
      <div className="relative z-10 flex flex-col min-h-screen">

        {/* --- RIVE GALAXY BACKGROUND (HEADER ONLY) --- */}
        {/* Positioned absolute at the top, scrolls with content, blended at bottom */}
        <div className="absolute top-0 left-0 w-full h-[120vh] z-[-1] overflow-hidden pointer-events-none">
           <GalaxyRive />
           {/* Fade out mask to blend Rive into the dark background below */}
           <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-gray-950 to-transparent"></div>
        </div>

        {/* Navbar */}
        <nav className="bg-gray-950/70 backdrop-blur-xl border-b border-white/10 sticky top-0 z-40 supports-[backdrop-filter]:bg-gray-950/40">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
               <div className="flex items-center gap-3">
                  <Logo className="h-9 w-9 shadow-lg shadow-emerald-500/20 rounded-full" />
                  <span className="font-extrabold text-xl text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200 tracking-tight">{config.siteName}</span>
               </div>
               <div className="flex items-center gap-4">
               </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="relative border-b border-white/5 overflow-hidden">
          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 text-center z-10">
            
            {/* Glowing effect behind Logo */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-emerald-500/10 filter blur-[80px] rounded-full pointer-events-none"></div>

            <h1 className="text-4xl md:text-7xl font-black text-white tracking-tight mb-8 flex flex-col items-center gap-6">
              {/* Logo in Hero - No opacity, fully overlays the Rive background */}
              <Logo className="h-24 w-24 md:h-36 md:w-36 shadow-[0_0_50px_-12px_rgba(16,185,129,0.5)] rounded-full animate-float" />
              
              {/* Added Lifted/Floating Effect: Strong Drop Shadow and brighter gradient */}
              <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-gray-100 to-gray-300 drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] filter">
                {config.siteName}
              </span>
            </h1>
            
            {config.tagline && (
              // Added strong drop shadow for readability against galaxy
              <p className="text-lg md:text-2xl text-gray-100 mb-12 font-medium max-w-2xl mx-auto leading-relaxed drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)]">
                {config.tagline}
              </p>
            )}
            
            <div className="flex flex-wrap justify-center gap-4">
              {socials.map(social => (
                <a 
                  key={social.id}
                  href={social.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center gap-2 px-6 py-3 bg-gray-800/60 hover:bg-gray-800/90 border border-white/10 hover:border-emerald-500/50 rounded-full text-gray-300 transition-all duration-300 font-semibold text-sm backdrop-blur-md shadow-lg hover:shadow-emerald-500/20 hover:-translate-y-1"
                >
                  <DynamicIcon name={social.iconName} size={18} className="text-emerald-500 group-hover:text-emerald-400 transition-colors"/>
                  <span className="group-hover:text-white transition-colors">{social.platform}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Notices */}
        {config.notices.length > 0 && (
          <div className="bg-emerald-950/30 border-y border-emerald-500/20 backdrop-blur-md relative overflow-hidden">
            <div className="absolute inset-0 bg-emerald-500/5 animate-pulse-slow"></div>
            <div className="max-w-[1400px] mx-auto px-4 py-3 flex flex-wrap gap-x-8 gap-y-2 justify-center text-sm font-medium text-emerald-100 relative z-10">
               {config.notices.map((notice, idx) => (
                 <div key={idx} className="flex items-center gap-2">
                   <AlertCircle size={14} className="text-emerald-400"/>
                   <span>{notice}</span>
                 </div>
               ))}
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-grow max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full z-10">
          
          {/* Controls */}
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-10 sticky top-16 z-30 bg-gray-950/80 backdrop-blur-xl py-4 -mx-4 px-4 md:mx-0 md:px-6 rounded-2xl border border-white/5 shadow-2xl transition-all duration-200">
            
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
                  className={`whitespace-nowrap px-5 py-2.5 rounded-xl text-sm font-bold transition-all border ${
                    selectedCategory === cat.id 
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-transparent shadow-[0_0_20px_rgba(16,185,129,0.4)]' 
                      : 'bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-800 border-white/5 hover:border-white/20'
                  }`}
                >
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

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredProducts.map(product => {
               const minPrice = product.priceOptions.length > 0 
                  ? Math.min(...product.priceOptions.map(p => p.price)) 
                  : 0;
               const currency = product.priceOptions.find(p => p.price === minPrice)?.currency || '';
               const fakeOriginalPrice = Math.round(minPrice * 1.36);

               return (
                <div 
                  key={product.id} 
                  onClick={() => setSelectedProduct(product)}
                  className="group flex flex-col bg-gray-900/40 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/5 hover:border-emerald-500/50 cursor-pointer transition-all duration-300 hover:shadow-[0_0_30px_-5px_rgba(16,185,129,0.15)] hover:-translate-y-2 h-full relative"
                >
                  {/* Glass highlight effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                  {/* Image Section */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-gray-900/50">
                     <img 
                      src={product.thumbnailUrl} 
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                    
                    {/* Sale Badge (Top Right) */}
                    <div className="absolute top-0 right-4 z-10">
                       <div className="bg-yellow-400/90 backdrop-blur text-gray-950 text-[10px] font-bold px-2 py-1.5 rounded-b shadow-lg flex flex-col items-center leading-none border-x border-b border-yellow-200/50">
                         <span className="mb-0.5">SALE</span>
                         <span>36%</span>
                       </div>
                    </div>

                    {/* Status Tag (Top Left) */}
                    <div className="absolute top-3 left-3 z-10">
                       <span className="px-2 py-1 bg-emerald-600/90 backdrop-blur text-white text-[10px] font-bold uppercase tracking-wider rounded shadow-lg border border-emerald-400/30">
                        {product.tags[0] || 'HOT'}
                      </span>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-4 flex flex-col flex-1 relative z-10">
                    <h3 className="text-lg font-bold text-gray-100 uppercase mb-1 line-clamp-2 leading-tight group-hover:text-emerald-400 transition-colors drop-shadow-sm">
                      {product.name}
                    </h3>
                    
                    <p className="text-gray-400 text-xs mb-3 line-clamp-2">
                      {product.shortDescription}
                    </p>

                    <div className="mt-auto pt-3 border-t border-white/5 group-hover:border-emerald-500/20 transition-colors">
                      {/* Price Row */}
                      <div className="flex items-end gap-2 mb-3">
                         <span className="text-base font-bold text-emerald-400 leading-none drop-shadow-[0_0_10px_rgba(52,211,153,0.3)]">
                           {new Intl.NumberFormat('vi-VN').format(minPrice)}{currency.toUpperCase()}
                         </span>
                         {minPrice > 0 && (
                           <span className="text-xs text-gray-600 line-through decoration-gray-600 mb-0.5">
                             {new Intl.NumberFormat('vi-VN').format(fakeOriginalPrice)}{currency.toUpperCase()}
                           </span>
                         )}
                      </div>

                      {/* Footer Actions */}
                      <div className="flex items-center justify-between">
                         {/* Stars - Fixed 5 Stars */}
                         <div className="flex gap-0.5">
                            {[1,2,3,4,5].map(i => (
                              <Star key={i} size={14} fill="#f59e0b" className="text-yellow-500 drop-shadow-sm" />
                            ))}
                         </div>

                         {/* Action Buttons */}
                         <div className="flex gap-2">
                            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white transition-all border border-white/5 hover:border-white/20">
                               <Eye size={16} />
                            </button>
                            <button className="h-8 px-3 flex items-center gap-1 rounded-lg bg-emerald-600/90 text-white hover:bg-emerald-500 transition-all shadow-[0_4px_14px_0_rgba(16,185,129,0.39)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.23)] hover:-translate-y-0.5">
                               <ShoppingCart size={16} />
                            </button>
                         </div>
                      </div>
                    </div>
                  </div>
                </div>
               );
            })}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-24 border border-dashed border-gray-800 rounded-2xl bg-gray-900/50 backdrop-blur-sm">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-800 mb-4 text-emerald-500 shadow-[0_0_20px_-5px_rgba(16,185,129,0.3)]">
                <Sparkles size={32} />
              </div>
              <h3 className="text-lg font-bold text-white">Chưa có sản phẩm nào</h3>
              <p className="text-gray-500 mt-2 text-sm">Thử thay đổi bộ lọc hoặc từ khoá tìm kiếm của bạn.</p>
            </div>
          )}
        </main>

        <footer className="bg-gray-950/80 backdrop-blur-xl border-t border-white/5 py-12 mt-12 relative z-10">
          <div className="max-w-[1400px] mx-auto px-4 text-center">
             <div className="flex justify-center mb-4"><Logo className="h-10 w-10 hover:scale-110 transition-transform duration-300" /></div>
             <h4 className="font-bold text-white mb-2 tracking-wide">{config.siteName}</h4>
             <p className="text-gray-500 text-sm">© {new Date().getFullYear()} All rights reserved.</p>
             {config.contactInfo.email && <p className="text-gray-600 text-sm mt-2 hover:text-emerald-500 transition-colors cursor-pointer">{config.contactInfo.email}</p>}
          </div>
        </footer>
      </div>

      {selectedProduct && (
        <ProductModal 
          isOpen={!!selectedProduct} 
          product={selectedProduct} 
          siteConfig={config}
          socials={socials} 
          onClose={() => setSelectedProduct(null)} 
        />
      )}
    </div>
  );
};

export default LandingPage;