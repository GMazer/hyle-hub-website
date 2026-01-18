
import React, { useEffect, useState } from 'react';
import { clientApi } from '../services/clientApi';
import { SiteConfig, Category, Product, SocialLink } from '../../../packages/shared/types';
import { Search, Sparkles, Star, Eye, ShoppingCart, Clock, ShieldCheck, CheckCircle2, Flame, Zap } from 'lucide-react';
import { DynamicIcon } from '../components/ui/Icons';
import ProductModal from '../components/public/ProductModal';
import Logo from '../components/ui/Logo';

// --- CSS VISUAL COMPONENTS ---

const CssSpaceBackground = () => (
  <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#050914]">
    {/* 1. Base Gradient Glows (Deep Ambient) */}
    <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-emerald-900/20 rounded-full blur-[120px] mix-blend-screen opacity-60"></div>
    <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-indigo-900/20 rounded-full blur-[120px] mix-blend-screen opacity-60"></div>

    {/* 2. Dot Grid Pattern (Enhanced Visibility) */}
    <div 
      className="absolute inset-0 z-0"
      style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.15) 1.5px, transparent 0)',
        backgroundSize: '40px 40px',
        maskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)' // Fade out at bottom
      }}
    />
  </div>
);

const FourPointStar: React.FC<{ className?: string, delay?: string, style?: React.CSSProperties }> = ({ className, delay, style }) => (
  <div className={`absolute animate-twinkle text-white ${className}`} style={{ animationDelay: delay, ...style }}>
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full drop-shadow-[0_0_8px_rgba(255,255,255,1)]">
      <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
    </svg>
  </div>
);

const LandingPage: React.FC = () => {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [socials, setSocials] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    // 1. Track Visit
    clientApi.trackVisit();

    // 2. Fetch Data
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

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    clientApi.trackProductView(product.id);
  };

  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'all' || p.categoryId === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  if (loading) return <div className="min-h-screen flex items-center justify-center text-emerald-400 font-medium bg-[#020617]">Đang tải dữ liệu...</div>;
  if (!config) return <div className="min-h-screen flex items-center justify-center text-gray-200 bg-[#020617]">Không thể tải cấu hình (Hãy kiểm tra Backend)</div>;

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col text-gray-100 font-sans selection:bg-emerald-500/30 relative overflow-x-hidden">
      
      {/* 1. Global CSS Space Background */}
      <CssSpaceBackground />
      
      {/* 2. Content Layer */}
      <div className="relative z-10 flex flex-col min-h-screen">

        {/* --- FIXED HEADER --- */}
        <nav 
          className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
            scrolled 
              ? 'bg-[#020617]/90 backdrop-blur-xl border-emerald-900/30 py-3 shadow-lg' 
              : 'bg-transparent border-transparent py-4 md:py-6'
          }`}
        >
          <div className="max-w-[1400px] mx-auto px-4 md:px-6 flex items-center justify-between">
            {/* Left: Logo & Name */}
            <div className="flex items-center gap-3 md:gap-4">
               <div className="p-1.5 md:p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/30 backdrop-blur-md shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                  <Logo className="w-6 h-6 md:w-8 md:h-8" />
               </div>
               {/* Hide site name on mobile to make room for sale badge */}
               <span className="hidden sm:block font-bold text-lg md:text-xl text-emerald-400 tracking-wide drop-shadow-[0_0_10px_rgba(52,211,153,0.5)] font-orbitron">
                 HyleHub Store
               </span>
            </div>

            {/* Right: Sale Badge (Visible on Mobile & Desktop) */}
            <div className="flex items-center">
              {/* Changed scale-90 to scale-75 for mobile to balance with logo */}
              <div className="relative group cursor-pointer hover:scale-105 transition-transform duration-300 transform scale-75 origin-right md:scale-100">
                {/* Burning Animation Container */}
                <div className="relative px-4 md:px-5 py-1.5 bg-[#1a0505]/90 backdrop-blur-md border border-red-500/50 rounded-full animate-burn overflow-hidden flex items-center gap-2 md:gap-3 shadow-red-500/20">
                  {/* Internal Glow */}
                  <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 via-orange-500/10 to-yellow-500/10 pointer-events-none"></div>

                  <div className="relative z-10 flex items-center gap-2">
                    <div className="relative">
                       <Flame size={20} className="text-orange-500 fill-orange-500 animate-pulse drop-shadow-[0_0_8px_rgba(249,115,22,0.8)]" />
                       <Flame size={10} className="text-yellow-300 fill-yellow-300 absolute bottom-0.5 left-1/2 -translate-x-1/2 animate-bounce" />
                    </div>
                    
                    <div className="flex flex-col leading-none">
                       <span className="text-[9px] font-bold text-red-400 uppercase tracking-widest mb-0.5">Giảm giá</span>
                       <span className="text-lg md:text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-400 to-red-500 font-orbitron drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                         36%
                       </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* --- HERO SECTION --- */}
        <section className="relative w-full pt-28 pb-16 md:pt-32 md:pb-32 border-b border-white/5 bg-gradient-to-b from-transparent to-[#020617]/50">
          
          {/* HERO CONTENT CONTAINER */}
          <div className="relative max-w-[1400px] mx-auto min-h-[350px] md:min-h-[400px] flex flex-col justify-center items-center px-4">

             {/* --- PLANETS & DECORATIONS --- */}
             
             {/* 1. Teal Planet (Top Left) */}
             <div className="absolute top-[0%] left-[-5%] md:left-[5%] md:top-[0%] animate-float pointer-events-none">
                <div 
                  className="w-20 h-20 md:w-40 md:h-40 rounded-full relative overflow-hidden"
                  style={{
                    background: 'radial-gradient(circle at 30% 30%, #5eead4 0%, #0f766e 40%, #134e4a 100%)',
                    boxShadow: 'inset -10px -10px 30px rgba(0,0,0,0.8), 0 0 40px rgba(45,212,191,0.2)'
                  }}
                >
                   <div className="absolute inset-0 rounded-full border-[1px] border-teal-200/20 mix-blend-overlay"></div>
                   <div className="absolute top-6 left-6 w-12 h-8 bg-white/10 blur-xl rounded-full transform -rotate-45"></div>
                </div>
                <FourPointStar className="w-6 h-6 top-0 right-[-10px] text-teal-100" delay="0s" />
             </div>

             {/* 2. Purple Ringed Planet (Top Right) */}
             <div className="absolute top-[-5%] right-[-10%] md:right-[2%] md:top-[-5%] animate-float-delayed pointer-events-none z-0">
                <div className="relative w-40 h-40 md:w-80 md:h-80">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[30%] border-[6px] md:border-[10px] border-purple-400/10 rounded-[50%] rotate-[-25deg]"></div>
                    
                    <div 
                      className="absolute inset-4 rounded-full overflow-hidden z-10"
                      style={{
                        background: 'linear-gradient(135deg, #a855f7 0%, #6b21a8 50%, #3b0764 100%)',
                        boxShadow: 'inset -20px -20px 60px rgba(0,0,0,0.9), 0 0 70px rgba(168,85,247,0.3)'
                      }}
                    >
                       <div className="absolute top-[20%] left-[-10%] w-[120%] h-[10%] bg-purple-400/10 blur-sm rotate-[-15deg]"></div>
                       <div className="absolute top-[40%] left-[-10%] w-[120%] h-[5%] bg-indigo-500/20 blur-sm rotate-[-15deg]"></div>
                       <div className="absolute top-[60%] left-[-10%] w-[120%] h-[15%] bg-purple-900/30 blur-md rotate-[-15deg]"></div>
                       <div className="absolute inset-0 rounded-full ring-1 ring-white/20"></div>
                    </div>

                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[30%] border-t-[6px] md:border-t-[10px] border-l-[2px] border-r-[2px] border-b-transparent border-purple-300/30 rounded-[50%] rotate-[-25deg] z-20 opacity-80"></div>
                </div>
             </div>

             {/* 3. Orange Planet (Bottom Left) */}
             <div className="absolute bottom-[-15%] left-[-15%] md:left-[5%] md:bottom-[-10%] animate-float pointer-events-none z-10">
                <div 
                  className="w-32 h-32 md:w-56 md:h-56 rounded-full relative overflow-hidden"
                  style={{
                    background: 'radial-gradient(circle at 40% 40%, #fb923c 0%, #c2410c 50%, #7c2d12 100%)',
                    boxShadow: 'inset -15px -15px 50px rgba(0,0,0,0.8), 0 0 50px rgba(249,115,22,0.25)'
                  }}
                >
                   <div className="absolute top-[25%] left-[20%] w-14 h-10 bg-[#9a3412] rounded-full opacity-60 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.6),1px_1px_0_rgba(255,255,255,0.1)] rotate-[-10deg]"></div>
                   <div className="absolute bottom-[30%] right-[25%] w-8 h-8 bg-[#7c2d12] rounded-full opacity-70 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.7)]"></div>
                   <div className="absolute top-[60%] left-[15%] w-4 h-4 bg-[#7c2d12] rounded-full opacity-50 shadow-inner"></div>
                   <div className="absolute inset-0 bg-black/10 mix-blend-overlay"></div>
                </div>
                 <FourPointStar className="w-8 h-8 top-[-25px] right-[25px] text-orange-100 drop-shadow-[0_0_10px_rgba(255,165,0,0.8)]" delay="1s" />
             </div>

             {/* 4. Extra Sparkles */}
             <div className="absolute bottom-[20%] right-[15%] w-4 h-4 rounded-full bg-emerald-500 blur-[2px] shadow-[0_0_15px_rgba(16,185,129,0.8)] animate-pulse-slow"></div>
             <FourPointStar className="w-5 h-5 top-[22%] left-[28%] text-white" delay="2.5s" />
             <FourPointStar className="w-3 h-3 top-[18%] right-[32%] text-white/60" delay="3.8s" />
             <FourPointStar className="w-6 h-6 bottom-[35%] left-[42%] text-emerald-200" delay="1.2s" />


             {/* --- CENTER TEXT CONTENT --- */}
             <div className="relative z-20 flex flex-col items-center text-center max-w-3xl mx-auto mt-4 md:mt-0">
                
                {/* Logo & Brand - Massive Green Glow */}
                <div className="mb-4 md:mb-8 animate-float relative group">
                   {/* Fix: Center the blur, make it larger than container to avoid clipping edges */}
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-emerald-500/40 blur-[30px] md:blur-[80px] rounded-full group-hover:bg-emerald-500/50 transition-all duration-700"></div>
                   <div className="relative z-10">
                      {/* Fix: Remove drop-shadow from here as it causes artifacts on mobile when combined with overflow-hidden in Logo */}
                      <Logo className="w-20 h-20 md:w-36 md:h-36" />
                   </div>
                </div>

                {/* Main Title - Strong Glow & Tech Font */}
                <h1 className="text-4xl md:text-8xl font-black text-white tracking-wider mb-2 md:mb-4 font-orbitron drop-shadow-[0_0_30px_rgba(16,185,129,0.8)] uppercase">
                  HyleHub Store
                </h1>

                {/* Subtitle - Single Line */}
                <p className="text-gray-300 text-xs md:text-2xl font-normal mb-6 md:mb-10 w-full max-w-none whitespace-nowrap overflow-hidden text-ellipsis mx-auto px-4 leading-relaxed">
                   Cung cấp các loại tài khoản <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300 drop-shadow-[0_0_10px_rgba(52,211,153,0.4)]">AI Pro Premium Ultra</span> giá rẻ
                </p>

                {/* Social Buttons */}
                <div className="flex flex-row items-center justify-center gap-3 w-full flex-wrap sm:flex-nowrap">
                   
                   {/* Instagram */}
                   <a href="https://instagram.com/hylehub" target="_blank" rel="noreferrer" className="flex-1 sm:flex-none flex items-center justify-center gap-2 md:gap-3 px-4 md:px-8 py-3 md:py-4 bg-[#1e2025]/60 hover:bg-[#25282e] border border-white/10 hover:border-pink-500/50 rounded-2xl transition-all group backdrop-blur-md shadow-lg hover:shadow-pink-500/10">
                      <DynamicIcon name="Instagram" className="text-pink-500 group-hover:scale-110 transition-transform w-4 h-4 md:w-5 md:h-5 drop-shadow-[0_0_8px_rgba(236,72,153,0.5)]" />
                      <span className="font-semibold text-xs md:text-base text-gray-200 group-hover:text-white">Instagram</span>
                   </a>

                   {/* Facebook */}
                   <a href="#" target="_blank" rel="noreferrer" className="flex-1 sm:flex-none flex items-center justify-center gap-2 md:gap-3 px-4 md:px-8 py-3 md:py-4 bg-[#1e2025]/60 hover:bg-[#25282e] border border-white/10 hover:border-blue-600/50 rounded-2xl transition-all group backdrop-blur-md shadow-lg hover:shadow-blue-600/10">
                      <DynamicIcon name="Facebook" className="text-blue-600 group-hover:scale-110 transition-transform w-4 h-4 md:w-5 md:h-5 drop-shadow-[0_0_8px_rgba(37,99,235,0.5)]" />
                      <span className="font-semibold text-xs md:text-base text-gray-200 group-hover:text-white">Facebook</span>
                   </a>

                   {/* Telegram */}
                   <a href="https://t.me/hylehub" target="_blank" rel="noreferrer" className="w-full sm:w-auto flex items-center justify-center gap-2 md:gap-3 px-4 md:px-8 py-3 md:py-4 bg-[#1e2025]/60 hover:bg-[#25282e] border border-white/10 hover:border-sky-500/50 rounded-2xl transition-all group backdrop-blur-md shadow-lg hover:shadow-sky-500/10">
                      <DynamicIcon name="Telegram" className="text-sky-500 group-hover:scale-110 transition-transform w-4 h-4 md:w-5 md:h-5 drop-shadow-[0_0_8px_rgba(14,165,233,0.5)]" />
                      <span className="font-semibold text-xs md:text-base text-gray-200 group-hover:text-white">Telegram</span>
                   </a>
                </div>
             </div>
          </div>

          {/* --- BOTTOM INFO BAR (HORIZONTAL SCROLL ON MOBILE) --- */}
          <div className="absolute bottom-0 left-0 right-0 bg-[#0b101b]/80 backdrop-blur-xl border-t border-white/5 py-3 md:py-4 z-30 shadow-[0_-5px_20px_rgba(0,0,0,0.2)]">
             <div className="max-w-[1400px] mx-auto px-4 flex flex-row overflow-x-auto snap-x snap-mandatory hide-scrollbar md:justify-between items-center gap-4 text-xs md:text-sm text-gray-400 font-medium">
                
                {/* Item 1 */}
                <div className="snap-center shrink-0 w-full md:w-auto flex items-center justify-center gap-2 md:gap-3 bg-white/5 px-4 py-1.5 rounded-full md:bg-transparent md:p-0 border border-white/5 md:border-none">
                   <div className="p-1 bg-emerald-500/20 rounded-full text-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.2)]"><Clock size={12} className="md:w-[14px] md:h-[14px]"/></div>
                   <span>Hỗ trợ kỹ thuật: 8:00 - 22:00 hàng ngày</span>
                </div>
                
                <div className="hidden md:block w-px h-5 bg-white/10"></div>
                
                {/* Item 2 */}
                <div className="snap-center shrink-0 w-full md:w-auto flex items-center justify-center gap-2 md:gap-3 bg-white/5 px-4 py-1.5 rounded-full md:bg-transparent md:p-0 border border-white/5 md:border-none">
                   <div className="p-1 bg-emerald-500/20 rounded-full text-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.2)]"><ShieldCheck size={12} className="md:w-[14px] md:h-[14px]"/></div>
                   <span>Bảo hành nhanh chóng</span>
                </div>
                
                <div className="hidden md:block w-px h-5 bg-white/10"></div>
                
                {/* Item 3 */}
                <div className="snap-center shrink-0 w-full md:w-auto flex items-center justify-center gap-2 md:gap-3 bg-white/5 px-4 py-1.5 rounded-full md:bg-transparent md:p-0 border border-white/5 md:border-none">
                   <div className="p-1 bg-emerald-500/20 rounded-full text-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.2)]"><CheckCircle2 size={12} className="md:w-[14px] md:h-[14px]"/></div>
                   <span>Sản phẩm chuẩn chất lượng</span>
                </div>

             </div>
          </div>
        </section>

        {/* Main Content */}
        <main className="flex-grow max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 w-full z-10">
          
          {/* Controls */}
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

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredProducts.map(product => {
               const minPrice = product.priceOptions.length > 0 
                  ? Math.min(...product.priceOptions.map(p => p.price)) 
                  : 0;
               const currency = product.priceOptions.find(p => p.price === minPrice)?.currency || '';
               const category = categories.find(c => c.id === product.categoryId);

               return (
                <div 
                  key={product.id} 
                  onClick={() => handleProductClick(product)}
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
                  <div className="relative aspect-[4/3] w-full bg-gray-800">
                     <img 
                      src={product.thumbnailUrl} 
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    
                    {/* Category Icon Overlay - Top Left (Offset slightly if Hot) */}
                    {category?.iconUrl ? (
                      <div className={`absolute left-3 z-20 w-5 h-5 drop-shadow-md filter brightness-110 ${product.isHot ? 'top-10' : 'top-3'}`}>
                        <img src={category.iconUrl} alt="cat-icon" className="w-full h-full object-contain" />
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
                             {new Intl.NumberFormat('vi-VN').format(Math.round(minPrice * 1.36))}{currency.toUpperCase()}
                           </span>
                           <span className={`text-lg font-bold leading-none ${product.isHot ? 'text-orange-400' : 'text-emerald-400'}`}>
                             {new Intl.NumberFormat('vi-VN').format(minPrice)}{currency.toUpperCase()}
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
