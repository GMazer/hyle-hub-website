
import React from 'react';
import Logo from '../../components/ui/Logo';
import { Flame } from 'lucide-react';

interface HeaderProps {
  scrolled: boolean;
}

const Header: React.FC<HeaderProps> = ({ scrolled }) => {
  return (
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
  );
};

export default Header;
