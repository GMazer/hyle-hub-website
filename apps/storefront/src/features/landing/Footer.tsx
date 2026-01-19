
import React from 'react';
import { SiteConfig } from '../../../../../packages/shared/types';
import Logo from '../../components/ui/Logo';

interface FooterProps {
  config: SiteConfig;
}

const Footer: React.FC<FooterProps> = ({ config }) => {
  return (
    <footer className="bg-gray-950/80 backdrop-blur-xl border-t border-white/5 py-12 mt-12 relative z-10">
      <div className="max-w-[1400px] mx-auto px-4 text-center">
         <div className="flex justify-center mb-4"><Logo className="h-10 w-10 hover:scale-110 transition-transform duration-300" /></div>
         <h4 className="font-bold text-white mb-2 tracking-wide">{config.siteName}</h4>
         <p className="text-gray-500 text-sm">© {new Date().getFullYear()} All rights reserved.</p>
         {config.contactInfo.email && <p className="text-gray-600 text-sm mt-2 hover:text-emerald-500 transition-colors cursor-pointer">{config.contactInfo.email}</p>}
      </div>
    </footer>
  );
};

export default Footer;
