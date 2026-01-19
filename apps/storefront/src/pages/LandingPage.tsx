
import React, { useEffect, useState } from 'react';
import { clientApi } from '../services/clientApi';
import { Product } from '../../../packages/shared/types';
import ProductModal from '../components/public/ProductModal';
import { SpaceBackground } from '../components/ui/SpaceBackground';
import Header from '../features/landing/Header';
import HeroSection from '../features/landing/HeroSection';
import ProductFilters from '../features/landing/ProductFilters';
import Footer from '../features/landing/Footer';
import { LandingSkeleton } from '../features/landing/LandingSkeleton';
import FloatingChat from '../features/landing/FloatingChat';
import ProductGrid from '../features/landing/ProductGrid';
import { useStoreData } from '../hooks/useStoreData';
import { useProductFilter } from '../hooks/useProductFilter';

const LandingPage: React.FC = () => {
  // Data Fetching Hook
  const { config, categories, products, socials, loading } = useStoreData();
  
  // Filtering Logic Hook
  const {
    selectedCategory, setSelectedCategory,
    searchQuery, setSearchQuery,
    sortOption, setSortOption,
    priceRange, setPriceRange,
    filteredProducts,
    resetFilters
  } = useProductFilter(products);

  // UI State
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
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
            sortOption={sortOption}
            setSortOption={setSortOption}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
          />

          <ProductGrid 
            products={filteredProducts} 
            categories={categories} 
            onProductClick={handleProductClick} 
            onClearFilters={resetFilters} 
          />

        </main>

        <Footer config={config} />
      </div>

      <FloatingChat socials={socials} contactInfo={config.contactInfo} />

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
