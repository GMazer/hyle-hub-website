
import React, { useState } from 'react';
import { SocialLink, SiteConfig } from '../../../../../packages/shared/types';
import { MessageCircle, X, ExternalLink } from 'lucide-react';
import { DynamicIcon } from '../../components/ui/Icons';

interface FloatingChatProps {
  socials: SocialLink[];
  contactInfo: SiteConfig['contactInfo'];
}

const FloatingChat: React.FC<FloatingChatProps> = ({ socials, contactInfo }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 group">
      {/* Expanded Links */}
      <div className={`flex flex-col gap-3 transition-all duration-300 origin-bottom-right ${isChatOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-50 translate-y-10 pointer-events-none'}`}>
        {socials.map((social) => (
           <a 
             key={social.id}
             href={social.url}
             target="_blank"
             rel="noreferrer"
             className="flex items-center gap-3 bg-gray-800/90 backdrop-blur-md border border-white/10 px-4 py-3 rounded-full shadow-xl hover:bg-emerald-900/80 hover:border-emerald-500/50 transition-all group/item whitespace-nowrap"
           >
              <span className="text-sm font-bold text-gray-200 group-hover/item:text-white">{social.platform}</span>
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-emerald-400 group-hover/item:bg-emerald-500 group-hover/item:text-white transition-colors">
                 <DynamicIcon name={social.iconName} size={16} />
              </div>
           </a>
        ))}
        {/* Fallback Contact Info if no socials */}
        {socials.length === 0 && contactInfo.phone && (
            <a 
             href={`tel:${contactInfo.phone}`}
             className="flex items-center gap-3 bg-gray-800/90 backdrop-blur-md border border-white/10 px-4 py-3 rounded-full shadow-xl hover:bg-emerald-900/80 transition-all"
            >
              <span className="text-sm font-bold text-gray-200">{contactInfo.phone}</span>
              <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                 <ExternalLink size={16} />
              </div>
            </a>
        )}
      </div>

      {/* Main Toggle Button */}
      <button 
        onClick={() => setIsChatOpen(!isChatOpen)}
        className={`h-14 w-14 rounded-full flex items-center justify-center shadow-[0_0_25px_rgba(16,185,129,0.4)] transition-all duration-300 hover:scale-110 active:scale-95 ${
           isChatOpen 
           ? 'bg-gray-800 text-gray-400 rotate-90 border border-white/10' 
           : 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white animate-bounce-slow hover:shadow-[0_0_35px_rgba(16,185,129,0.6)]'
        }`}
        title="Liên hệ hỗ trợ"
      >
        {isChatOpen ? <X size={24} /> : <MessageCircle size={26} fill="currentColor" className="text-white" />}
        
        {/* Notification Dot */}
        {!isChatOpen && (
          <span className="absolute top-0 right-0 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
          </span>
        )}
      </button>
    </div>
  );
};

export default FloatingChat;
