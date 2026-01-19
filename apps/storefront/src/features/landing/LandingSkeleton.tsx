
import React from 'react';
import { SpaceBackground } from '../../components/ui/SpaceBackground';

// Helper for generic shimmer block
const SkeletonBlock: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`bg-gray-800/50 border border-white/5 animate-pulse rounded-xl ${className}`} />
);

// 1. Skeleton for Product Card
const SkeletonProductCard = () => {
  return (
    <div className="relative flex flex-col bg-[#1a1d21] rounded-2xl overflow-hidden border border-white/5 h-full">
      {/* Image Area */}
      <div className="relative aspect-[4/3] w-full bg-gray-800/40 animate-pulse">
        {/* Fake Badge */}
        <div className="absolute top-3 right-3 w-16 h-5 bg-white/10 rounded-full" />
      </div>

      {/* Content Area */}
      <div className="p-4 flex flex-col flex-1 gap-3">
        {/* Title */}
        <div className="h-4 bg-gray-700/50 rounded w-3/4 animate-pulse" />
        
        {/* Description Lines */}
        <div className="space-y-2">
          <div className="h-2 bg-gray-800 rounded w-full animate-pulse" />
          <div className="h-2 bg-gray-800 rounded w-2/3 animate-pulse" />
        </div>

        <div className="mt-auto pt-3 border-t border-white/5 space-y-3">
           {/* Price Row */}
           <div className="flex justify-between items-end">
              <div className="flex gap-1">
                 {[1,2,3,4,5].map(i => <div key={i} className="w-3 h-3 bg-gray-800 rounded-full" />)}
              </div>
              <div className="h-6 w-24 bg-emerald-900/20 rounded animate-pulse" />
           </div>
           
           {/* Buttons */}
           <div className="grid grid-cols-4 gap-2">
              <div className="col-span-1 h-9 bg-gray-800 rounded-lg animate-pulse" />
              <div className="col-span-3 h-9 bg-emerald-900/20 border border-emerald-500/10 rounded-lg animate-pulse" />
           </div>
        </div>
      </div>
    </div>
  );
};

// 2. Skeleton for Hero Section (Planets & Title)
const SkeletonHero = () => {
  return (
    <section className="relative w-full pt-32 pb-32 border-b border-white/5 flex flex-col items-center justify-center min-h-[400px]">
       {/* Fake Planets */}
       <div className="absolute top-[10%] left-[5%] w-24 h-24 rounded-full bg-teal-900/20 blur-xl animate-pulse delay-75" />
       <div className="absolute bottom-[10%] right-[10%] w-32 h-32 rounded-full bg-purple-900/20 blur-xl animate-pulse delay-150" />
       
       {/* Center Content */}
       <div className="flex flex-col items-center gap-6 z-10 w-full max-w-2xl px-4">
          {/* Logo */}
          <div className="w-24 h-24 rounded-full bg-gray-800/50 animate-pulse" />
          
          {/* Title */}
          <div className="h-12 w-3/4 md:w-1/2 bg-gray-800/80 rounded-2xl animate-pulse" />
          
          {/* Subtitle */}
          <div className="h-4 w-full md:w-2/3 bg-gray-800/50 rounded-full animate-pulse" />
          
          {/* Social Buttons */}
          <div className="flex gap-4 mt-4 w-full justify-center">
             <div className="h-12 w-12 md:w-32 bg-gray-800/40 rounded-2xl animate-pulse" />
             <div className="h-12 w-12 md:w-32 bg-gray-800/40 rounded-2xl animate-pulse" />
             <div className="h-12 w-12 md:w-32 bg-gray-800/40 rounded-2xl animate-pulse" />
          </div>
       </div>

       {/* Bottom Info Bar */}
       <div className="absolute bottom-0 left-0 right-0 h-12 bg-[#0b101b]/80 border-t border-white/5" />
    </section>
  );
};

// 3. Skeleton for Filter Bar
const SkeletonFilters = () => {
  return (
    <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-10 mt-8 py-4 px-6 rounded-2xl border border-white/5 bg-gray-900/40">
       <div className="flex gap-2 overflow-hidden w-full md:w-auto">
          {[1,2,3,4].map(i => (
             <div key={i} className="h-10 w-24 bg-gray-800 rounded-xl animate-pulse" />
          ))}
       </div>
       <div className="h-10 w-full md:w-72 bg-gray-800 rounded-xl animate-pulse" />
    </div>
  );
};

// --- MAIN PAGE SKELETON ---
export const LandingSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#020617] flex flex-col relative overflow-hidden">
      <SpaceBackground />
      
      {/* Fake Header */}
      <div className="fixed top-0 inset-x-0 h-20 bg-[#020617]/90 border-b border-white/5 z-50 flex items-center justify-between px-6">
         <div className="w-32 h-8 bg-gray-800/50 rounded animate-pulse" />
         <div className="w-24 h-8 bg-gray-800/50 rounded-full animate-pulse" />
      </div>

      <SkeletonHero />

      <main className="flex-grow max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pb-12 w-full z-10">
        <SkeletonFilters />
        
        {/* Grid System */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
           {/* Render 10 skeleton cards */}
           {Array.from({ length: 10 }).map((_, idx) => (
              <SkeletonProductCard key={idx} />
           ))}
        </div>
      </main>
    </div>
  );
};
