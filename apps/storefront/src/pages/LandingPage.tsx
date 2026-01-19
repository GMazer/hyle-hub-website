
import React, { useEffect, useState } from 'react';
import { clientApi } from '../services/clientApi';
import { SiteConfig, Category, Product, SocialLink } from '../../../packages/shared/types';
import { Sparkles } from 'lucide-react';
import ProductModal from '../components/public/ProductModal';
import { SpaceBackground } from '../components/ui/SpaceBackground';
import Header from '../features/landing/Header';
import HeroSection from '../features/landing/HeroSection';
import ProductFilters, { SortOption, PriceRange } from '../features/landing/ProductFilters';
import ProductCard from '../features/landing/ProductCard';
import Footer from '../features/landing/Footer';
import { LandingSkeleton } from '../features/landing/LandingSkeleton';

const LandingPage: React.FC = () => {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [socials, setSocials] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);

  // Filters State
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('default');
  const [priceRange, setPriceRange] = useState<PriceRange>('all');
  
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

  // Helper: Normalize price for filtering/sorting (Handle 50 vs 50000 ambiguity)
  const getNormalizedPrice = (p: Product) => {
    if (!p.priceOptions || p.priceOptions.length === 0) return 0;
    const rawMin = Math.min(...p.priceOptions.map(o => o.price));
    // If admin entered "50" implying 50k, we treat it as 50000 for filtering
    return rawMin < 1000 ? rawMin * 1000 : rawMin;
  };

  // --- FILTERING LOGIC ---
  const filteredProducts = products.filter(p => {
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

    if (sortOption === 'price_asc') {
      return priceA - priceB;
    }
    if (sortOption === 'price_desc') {
      return priceB - priceA;
    }
    if (sortOption === 'name_asc') {
      return a.name.localeCompare(b.name);
    }
    
    // Default: Hot first, then updated recently
    if (a.isHot && !b.isHot) return -1;
    if (!a.isHot && b.isHot) return 1;
    // Fallback to newness
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  if (loading) return <LandingSkeleton />;
  
  if (!config) return <div className="min-h-screen flex items-center justify-center text-gray-200 bg-[#020617]">Không thể tải cấu hình (Hãy kiểm tra Backend)</div>;

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col text-gray-100 font-sans selection:bg-emerald-500/30 relative overflow-x-hidden">
      
      <SpaceBackground />
      
      <div className="relative z-10 flex flex-col min-h-screen">

        <Header scrolled={scrolled} />

        <HeroSection config={config} socials={socials} />

        {/* Main Content */}
        <main className="flex-grow max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 w-full z-10">
          
          <ProductFilters 
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            // Advanced Filters
            sortOption={sortOption}
            setSortOption={setSortOption}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
          />

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredProducts.map(product => (
               <ProductCard 
                 key={product.id}
                 product={product}
                 category={categories.find(c => c.id === product.categoryId)}
                 onClick={handleProductClick}
               />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-24 border border-dashed border-gray-800 rounded-2xl bg-gray-900/50 backdrop-blur-sm mt-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-800 mb-4 text-emerald-500 shadow-[0_0_20px_-5px_rgba(16,185,129,0.3)]">
                <Sparkles size={32} />
              </div>
              <h3 className="text-lg font-bold text-white">Chưa có sản phẩm nào</h3>
              <p className="text-gray-500 mt-2 text-sm">Thử thay đổi bộ lọc, khoảng giá hoặc từ khoá tìm kiếm.</p>
              
              <button 
                onClick={() => {
                  setPriceRange('all');
                  setSortOption('default');
                  setSelectedCategory('all');
                  setSearchQuery('');
                }}
                className="mt-6 px-6 py-2 bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 rounded-full hover:bg-emerald-600 hover:text-white transition-all"
              >
                Xóa bộ lọc
              </button>
            </div>
          )}
        </main>

        <Footer config={config} />
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
