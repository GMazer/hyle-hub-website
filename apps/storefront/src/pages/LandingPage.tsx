import React, { useEffect, useState } from 'react';
import { clientApi } from '../services/clientApi';
import { SiteConfig, Category, Product, SocialLink } from '../../../packages/shared/types';
import { Search, Filter, AlertCircle, Menu, X, Sparkles } from 'lucide-react';
import { DynamicIcon } from '../components/ui/Icons';
import ProductModal from '../components/public/ProductModal';
import Logo from '../components/ui/Logo';

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
    <div className="min-h-screen bg-gray-950 flex flex-col text-gray-100 font-sans selection:bg-emerald-500/30">
      {/* Navbar */}
      <nav className="bg-gray-900/80 backdrop-blur-md border-b border-gray-800 sticky top-0 z-40">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
             <div className="flex items-center gap-3">
                <Logo className="h-9 w-9" />
                <span className="font-extrabold text-xl text-white tracking-tight">{config.siteName}</span>
             </div>
             <div className="flex items-center gap-4">
             </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative bg-gray-950 border-b border-gray-800 overflow-hidden">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob pointer-events-none"></div>
        <div className="absolute top-0 -right-4 w-96 h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000 pointer-events-none"></div>
        <div className="absolute -bottom-8 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000 pointer-events-none"></div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center z-10">
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-6 drop-shadow-xl flex flex-col items-center gap-4">
            <Logo className="h-24 w-24 md:h-32 md:w-32 shadow-2xl shadow-emerald-500/20" />
            {config.siteName}
          </h1>
          {config.tagline && (
            <p className="text-lg md:text-xl text-gray-400 mb-10 font-medium max-w-2xl mx-auto">{config.tagline}</p>
          )}
          
          <div className="flex flex-wrap justify-center gap-3">
            {socials.map(social => (
              <a 
                key={social.id}
                href={social.url}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-2 px-5 py-2.5 bg-gray-800/80 hover:bg-gray-700 border border-gray-700 hover:border-emerald-500/50 rounded-full text-gray-300 transition-all duration-300 font-semibold text-sm shadow-sm hover:shadow-emerald-500/20 hover:-translate-y-0.5"
              >
                <DynamicIcon name={social.iconName} size={16} className="text-emerald-500 group-hover:text-emerald-400 transition-colors"/>
                <span className="group-hover:text-white transition-colors">{social.platform}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Notices */}
      {config.notices.length > 0 && (
        <div className="bg-emerald-900/30 border-y border-emerald-900/50 backdrop-blur-sm">
          <div className="max-w-[1400px] mx-auto px-4 py-3 flex flex-wrap gap-x-8 gap-y-2 justify-center text-sm font-medium text-emerald-100">
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
      <main className="flex-grow max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        
        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8 sticky top-16 z-30 bg-gray-950/95 backdrop-blur py-4 -mx-4 px-4 md:mx-0 md:px-0 rounded-b-xl border-b border-gray-800/50 md:border-none transition-all duration-200">
          
          <div className="flex overflow-x-auto pb-2 md:pb-0 gap-2 w-full md:w-auto hide-scrollbar">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-bold transition-all border ${
                selectedCategory === 'all' 
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-900/50' 
                  : 'bg-gray-900 text-gray-400 hover:text-white hover:bg-gray-800 border-gray-800'
              }`}
            >
              Tất cả
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-bold transition-all border ${
                  selectedCategory === cat.id 
                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-900/50' 
                    : 'bg-gray-900 text-gray-400 hover:text-white hover:bg-gray-800 border-gray-800'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72 group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-500 group-focus-within:text-emerald-500 transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Tìm kiếm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-9 pr-3 py-2 border border-gray-800 rounded-lg leading-5 bg-gray-900 text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-all shadow-sm group-hover:border-gray-700"
            />
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredProducts.map(product => {
             const minPrice = product.priceOptions.length > 0 
                ? Math.min(...product.priceOptions.map(p => p.price)) 
                : 0;
             const currency = product.priceOptions.find(p => p.price === minPrice)?.currency || '';

             return (
              <div 
                key={product.id} 
                onClick={() => setSelectedProduct(product)}
                className="group relative flex flex-col bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-emerald-500/50 cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-emerald-900/10 hover:-translate-y-1"
              >
                <div className="aspect-[16/10] bg-gray-900 flex items-center justify-center relative overflow-hidden">
                   <img 
                    src={product.thumbnailUrl} 
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 relative z-10"
                    loading="lazy"
                  />
                  
                  {product.tags[0] && (
                    <div className="absolute top-2 right-2 z-20">
                       <span className="px-2 py-0.5 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase tracking-wider rounded backdrop-blur-sm">
                        {product.tags[0]}
                      </span>
                    </div>
                  )}
                </div>

                <div className="bg-gray-950 p-4 flex items-center gap-3 border-t border-gray-800 group-hover:border-gray-700 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-gray-800 border border-gray-700 shrink-0 group-hover:bg-gray-700 transition-colors overflow-hidden">
                     <img src={product.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                  </div>
                  
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-bold text-gray-100 group-hover:text-emerald-400 truncate transition-colors">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-1">
                       {minPrice > 0 ? (
                         <p className="text-xs text-gray-500 truncate group-hover:text-gray-400">
                            Giá từ <span className="text-emerald-500 font-bold text-base">{new Intl.NumberFormat('vi-VN').format(minPrice)}{currency.toUpperCase()}</span>
                         </p>
                       ) : (
                         <p className="text-xs text-emerald-500 font-bold truncate">Liên hệ</p>
                       )}
                    </div>
                  </div>
                </div>
              </div>
             );
          })}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-24 border border-dashed border-gray-800 rounded-2xl bg-gray-900/50">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-800 mb-4 text-emerald-500">
              <Sparkles size={32} />
            </div>
            <h3 className="text-lg font-bold text-white">Chưa có sản phẩm nào</h3>
            <p className="text-gray-500 mt-2 text-sm">Thử thay đổi bộ lọc hoặc từ khoá tìm kiếm của bạn.</p>
          </div>
        )}
      </main>

      <footer className="bg-gray-900 border-t border-gray-800 py-12 mt-12">
        <div className="max-w-[1400px] mx-auto px-4 text-center">
           <div className="flex justify-center mb-4"><Logo className="h-10 w-10 opacity-80 grayscale hover:grayscale-0 transition-all" /></div>
           <h4 className="font-bold text-white mb-2 tracking-wide">{config.siteName}</h4>
           <p className="text-gray-500 text-sm">© {new Date().getFullYear()} All rights reserved.</p>
           {config.contactInfo.email && <p className="text-gray-600 text-sm mt-2 hover:text-emerald-500 transition-colors cursor-pointer">{config.contactInfo.email}</p>}
        </div>
      </footer>

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