
import React from 'react';
import { SiteConfig, SocialLink } from '../../../../../packages/shared/types';
import Logo from '../../components/ui/Logo';
import { FourPointStar } from '../../components/ui/SpaceBackground';
import { DynamicIcon } from '../../components/ui/Icons';
import { Clock, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface HeroSectionProps {
  config: SiteConfig;
  socials: SocialLink[];
}

const HeroSection: React.FC<HeroSectionProps> = ({ config, socials }) => {
  return (
    <section className="relative w-full pt-28 pb-16 md:pt-32 md:pb-32 border-b border-white/5 bg-gradient-to-b from-transparent to-[#020617]/50">
      
      {/* HERO CONTENT CONTAINER */}
      <div className="relative max-w-[1400px] mx-auto min-h-[350px] md:min-h-[400px] flex flex-col justify-center items-center px-4">

         {/* --- PLANETS & DECORATIONS --- */}
         
         {/* 1. Teal Planet (Top Left) */}
         <div className="absolute top-[0%] left-[-5%] md:left-[5%] md:top-[0%] animate-float pointer-events-none">
            {/* Atmospheric Glow */}
            <div className="absolute inset-0 bg-teal-500/30 blur-[50px] rounded-full animate-pulse-slow"></div>

            <div 
              className="w-20 h-20 md:w-40 md:h-40 rounded-full relative overflow-hidden transition-all duration-1000"
              style={{
                background: 'radial-gradient(circle at 30% 30%, #5eead4 0%, #0f766e 40%, #134e4a 100%)',
                boxShadow: 'inset -10px -10px 30px rgba(0,0,0,0.8), 0 0 60px rgba(45,212,191,0.4)'
              }}
            >
               <div className="absolute inset-0 rounded-full border-[1px] border-teal-200/20 mix-blend-overlay"></div>
               <div className="absolute top-6 left-6 w-12 h-8 bg-white/10 blur-xl rounded-full transform -rotate-45"></div>
               {/* Fake cloud/movement */}
               <div className="absolute -inset-4 bg-gradient-to-tr from-transparent via-teal-300/10 to-transparent blur-md rotate-45 animate-pulse-slow"></div>
            </div>
            <FourPointStar className="w-6 h-6 top-0 right-[-10px] text-teal-100" delay="0s" />
         </div>

         {/* 2. Purple Ringed Planet (Top Right) */}
         <div className="absolute top-[-5%] right-[-10%] md:right-[2%] md:top-[-5%] animate-float-delayed pointer-events-none z-0">
            <div className="relative w-40 h-40 md:w-80 md:h-80">
                {/* Rotating Glow Ring */}
                <div className="absolute inset-0 rounded-full bg-purple-600/20 blur-[60px] animate-pulse-slow"></div>

                {/* Rings */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[30%] border-[6px] md:border-[10px] border-purple-400/20 rounded-[50%] rotate-[-25deg] shadow-[0_0_20px_rgba(168,85,247,0.2)]"></div>
                
                {/* Planet Body */}
                <div 
                  className="absolute inset-4 rounded-full overflow-hidden z-10"
                  style={{
                    background: 'linear-gradient(135deg, #a855f7 0%, #6b21a8 50%, #3b0764 100%)',
                    boxShadow: 'inset -20px -20px 60px rgba(0,0,0,0.9), 0 0 80px rgba(168,85,247,0.5)'
                  }}
                >
                   <div className="absolute top-[20%] left-[-10%] w-[120%] h-[10%] bg-purple-400/10 blur-sm rotate-[-15deg]"></div>
                   <div className="absolute top-[40%] left-[-10%] w-[120%] h-[5%] bg-indigo-500/20 blur-sm rotate-[-15deg]"></div>
                   <div className="absolute top-[60%] left-[-10%] w-[120%] h-[15%] bg-purple-900/30 blur-md rotate-[-15deg]"></div>
                   <div className="absolute inset-0 rounded-full ring-1 ring-white/20"></div>
                   {/* Subtle internal shift */}
                   <div className="absolute inset-0 bg-gradient-to-b from-transparent to-purple-950/50 mix-blend-multiply"></div>
                </div>

                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[30%] border-t-[6px] md:border-t-[10px] border-l-[2px] border-r-[2px] border-b-transparent border-purple-300/40 rounded-[50%] rotate-[-25deg] z-20 opacity-90 shadow-[0_0_15px_rgba(216,180,254,0.3)]"></div>
            </div>
         </div>

         {/* 3. Orange Planet (Bottom Left) */}
         <div className="absolute bottom-[-15%] left-[-15%] md:left-[5%] md:bottom-[-10%] animate-float pointer-events-none z-10">
            <div className="absolute inset-0 bg-orange-600/30 blur-[50px] rounded-full animate-pulse-slow"></div>

            <div 
              className="w-32 h-32 md:w-56 md:h-56 rounded-full relative overflow-hidden"
              style={{
                background: 'radial-gradient(circle at 40% 40%, #fb923c 0%, #c2410c 50%, #7c2d12 100%)',
                boxShadow: 'inset -15px -15px 50px rgba(0,0,0,0.8), 0 0 70px rgba(249,115,22,0.4)'
              }}
            >
               <div className="absolute top-[25%] left-[20%] w-14 h-10 bg-[#9a3412] rounded-full opacity-60 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.6),1px_1px_0_rgba(255,255,255,0.1)] rotate-[-10deg]"></div>
               <div className="absolute bottom-[30%] right-[25%] w-8 h-8 bg-[#7c2d12] rounded-full opacity-70 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.7)]"></div>
               <div className="absolute top-[60%] left-[15%] w-4 h-4 bg-[#7c2d12] rounded-full opacity-50 shadow-inner"></div>
               <div className="absolute inset-0 bg-black/10 mix-blend-overlay"></div>
               
               {/* Magma flow effect (subtle) */}
               <div className="absolute inset-0 bg-gradient-to-t from-orange-900/0 via-orange-500/10 to-transparent animate-pulse-slow"></div>
            </div>
             <FourPointStar className="w-8 h-8 top-[-25px] right-[25px] text-orange-100 drop-shadow-[0_0_15px_rgba(255,165,0,1)]" delay="1s" />
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
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-emerald-500/40 blur-[30px] md:blur-[80px] rounded-full group-hover:bg-emerald-500/50 transition-all duration-700"></div>
               <div className="relative z-10">
                  <Logo className="w-20 h-20 md:w-36 md:h-36" />
               </div>
            </div>

            {/* Main Title - Strong Glow & Tech Font */}
            <h1 className="text-4xl md:text-8xl font-black text-white tracking-wider mb-2 md:mb-4 font-orbitron drop-shadow-[0_0_30px_rgba(16,185,129,0.8)] uppercase">
              {config.siteName}
            </h1>

            {/* Subtitle - Single Line */}
            <p className="text-gray-300 text-xs md:text-2xl font-normal mb-6 md:mb-10 w-full max-w-none whitespace-nowrap overflow-hidden text-ellipsis mx-auto px-4 leading-relaxed">
               Cung cấp các loại tài khoản <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300 drop-shadow-[0_0_10px_rgba(52,211,153,0.4)]">AI Pro Premium Ultra</span> giá rẻ
            </p>

            {/* Social Buttons */}
            <div className="flex flex-row items-center justify-center gap-3 w-full flex-wrap sm:flex-nowrap">
               {socials.map(social => (
                 <a 
                   key={social.id}
                   href={social.url} 
                   target="_blank" 
                   rel="noreferrer" 
                   className="flex-1 sm:flex-none flex items-center justify-center gap-2 md:gap-3 px-4 md:px-8 py-3 md:py-4 bg-[#1e2025]/60 hover:bg-[#25282e] border border-white/10 hover:border-emerald-500/50 rounded-2xl transition-all group backdrop-blur-md shadow-lg hover:shadow-emerald-500/10"
                 >
                    <DynamicIcon name={social.iconName} className="text-emerald-500 group-hover:scale-110 transition-transform w-4 h-4 md:w-5 md:h-5 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                    <span className="font-semibold text-xs md:text-base text-gray-200 group-hover:text-white">{social.platform}</span>
                 </a>
               ))}
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
  );
};

export default HeroSection;
