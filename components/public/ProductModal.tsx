import React, { useState, useEffect } from 'react';
import { Product, SiteConfig, SocialLink } from '../../types';
import { X, CheckCircle2, Copy, MessageCircle, Info, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { DynamicIcon } from '../ui/Icons';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ProductModalProps {
  product: Product;
  siteConfig: SiteConfig;
  socials?: SocialLink[];
  isOpen: boolean;
  onClose: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, siteConfig, socials = [], isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [showContactMenu, setShowContactMenu] = useState(false);
  const [isDescExpanded, setIsDescExpanded] = useState(false);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    const url = `${window.location.origin}/#/?product=${product.slug}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const fallbackContactLink = siteConfig.contactInfo.email 
    ? `mailto:${siteConfig.contactInfo.email}?subject=Đặt hàng ${product.name}` 
    : '#';

  const handleContactClick = () => {
    if (socials.length === 0) {
      window.open(fallbackContactLink, '_blank');
    } else {
      setShowContactMenu(!showContactMenu);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-emerald-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden bg-white dark:bg-gray-900 rounded-3xl shadow-2xl animate-in fade-in zoom-in duration-200 transition-colors border border-emerald-100 dark:border-gray-800 flex flex-col">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-emerald-50 dark:bg-gray-800 rounded-full hover:bg-emerald-100 dark:hover:bg-gray-700 text-emerald-800 dark:text-emerald-400 z-10 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col md:flex-row h-full overflow-hidden">
          {/* Left: Single Main Image */}
          {/* Mobile: reduced padding and aspect-video to save vertical space. Desktop: aspect-square */}
          <div className="w-full md:w-5/12 bg-emerald-50/50 dark:bg-gray-800/50 p-4 md:p-8 flex items-center justify-center shrink-0">
            <div className="w-full aspect-video md:aspect-square rounded-2xl overflow-hidden shadow-lg border-4 border-white dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
              <img 
                src={product.thumbnailUrl} 
                alt={product.name} 
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Right: Info */}
          {/* Use flex-1 instead of h-full to allow correct resizing in column layout */}
          <div className="w-full md:w-7/12 flex-1 flex flex-col min-h-0 overflow-hidden relative">
            <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar min-h-0">
              <div className="flex flex-wrap gap-2 mb-4">
                {product.tags.map((tag, idx) => (
                  <span key={idx} className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 text-xs font-bold rounded-full">
                    {tag}
                  </span>
                ))}
              </div>

              <h2 className="text-2xl md:text-3xl font-extrabold text-emerald-900 dark:text-white mb-2">{product.name}</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6 italic">{product.shortDescription}</p>

              {/* Pricing Table */}
              <div className="mb-6 bg-white dark:bg-gray-800 rounded-2xl border-2 border-emerald-100 dark:border-gray-700 overflow-hidden shadow-sm">
                  <div className="bg-emerald-50 dark:bg-emerald-900/20 px-4 py-3 border-b border-emerald-100 dark:border-gray-700">
                    <h3 className="font-bold text-emerald-800 dark:text-emerald-300 text-sm uppercase tracking-wider flex items-center gap-2">
                      <CheckCircle2 size={16}/> Bảng giá
                    </h3>
                  </div>
                  <div className="divide-y divide-emerald-50 dark:divide-gray-700">
                    {product.priceOptions.map((opt) => (
                      <div 
                        key={opt.id} 
                        className={`flex items-center justify-between p-4 transition-colors ${opt.isHighlight ? 'bg-emerald-50/50 dark:bg-emerald-900/10' : ''}`}
                      >
                        <div>
                          <div className="font-bold text-gray-900 dark:text-gray-100">{opt.name}</div>
                          {opt.description && <div className="text-xs text-gray-500 dark:text-gray-400">{opt.description}</div>}
                        </div>
                        <div className="text-right">
                          <div className="font-extrabold text-lg text-emerald-600 dark:text-emerald-400">
                            {new Intl.NumberFormat('vi-VN').format(opt.price)}{opt.currency.toUpperCase()}
                          </div>
                          <div className="text-xs text-gray-400">/ {opt.unit}</div>
                        </div>
                      </div>
                    ))}
                  </div>
              </div>

              {/* Detailed Info (Expandable) */}
              {product.fullDescription && (
                <div className="mb-6 group">
                   <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-2 flex items-center gap-2">
                     <Info size={16} className="text-emerald-500"/> Thông tin chi tiết
                   </h3>
                   {/* Increased max-height significantly to support very long content */}
                   <div className={`relative bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700 transition-all duration-500 ease-in-out ${isDescExpanded ? 'max-h-[5000px] overflow-y-auto' : 'max-h-[100px] overflow-hidden'}`}>
                     <div className="p-4 markdown-body text-gray-600 dark:text-gray-300 text-sm">
                       <ReactMarkdown remarkPlugins={[remarkGfm]}>
                         {product.fullDescription}
                       </ReactMarkdown>
                     </div>
                     {/* Gradient overlay when collapsed */}
                     {!isDescExpanded && (
                       <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-gray-50 dark:from-gray-800 via-gray-50/80 dark:via-gray-800/80 to-transparent flex items-end justify-center pb-2 cursor-pointer" onClick={() => setIsDescExpanded(true)}>
                       </div>
                     )}
                   </div>
                   
                   <button 
                      onClick={() => setIsDescExpanded(!isDescExpanded)}
                      className="w-full mt-2 py-1.5 flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors"
                   >
                      {isDescExpanded ? (
                          <>Thu gọn <ChevronUp size={14}/></>
                      ) : (
                          <>Xem thêm <ChevronDown size={14}/></>
                      )}
                   </button>
                </div>
              )}

              {/* Notes */}
              {product.notes && (
                <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-100 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-sm flex gap-3">
                  <div className="shrink-0 mt-0.5"><Info size={16} /></div>
                  <span className="font-medium">{product.notes}</span>
                </div>
              )}
            </div>

            {/* SLIDE UP CONTACT MENU OVERLAY */}
            {showContactMenu && (
               <div className="absolute bottom-0 left-0 w-full z-30 animate-in slide-in-from-bottom duration-300">
                  <div className="bg-white dark:bg-gray-800 rounded-t-2xl shadow-[0_-5px_20px_rgba(0,0,0,0.3)] border-t border-gray-200 dark:border-gray-700 overflow-hidden">
                     <div className="bg-emerald-50 dark:bg-emerald-900/30 px-4 py-3 flex justify-between items-center border-b border-gray-100 dark:border-gray-700">
                         <span className="font-bold text-emerald-800 dark:text-emerald-300">Chọn kênh liên hệ</span>
                         <button onClick={() => setShowContactMenu(false)} className="p-1 bg-white dark:bg-gray-700 rounded-full text-gray-500 hover:text-red-500 shadow-sm"><X size={16}/></button>
                     </div>
                     <div className="p-4 space-y-2 max-h-[250px] overflow-y-auto">
                        {socials.map(social => (
                          <a 
                            key={social.id}
                            href={social.url}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-700/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 rounded-xl transition-colors group"
                          >
                             <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center shadow-sm text-emerald-600 dark:text-emerald-400">
                                   <DynamicIcon name={social.iconName} size={18} />
                                </div>
                                <span className="font-bold text-gray-800 dark:text-gray-100">{social.platform}</span>
                             </div>
                             <ExternalLink size={16} className="text-gray-400 group-hover:text-emerald-500"/>
                          </a>
                        ))}
                     </div>
                  </div>
               </div>
            )}

            {/* Actions Footer */}
            <div className="p-6 md:p-8 pt-4 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 z-20">
              <div className="flex flex-col sm:flex-row gap-3 relative">
                {/* Main Buy Button */}
                <button 
                  onClick={handleContactClick}
                  className={`flex-1 flex items-center justify-center gap-2 font-bold py-3.5 px-6 rounded-xl transition-all shadow-lg shadow-emerald-200 dark:shadow-none transform active:scale-95 ${
                    showContactMenu 
                      ? 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300' 
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white hover:-translate-y-0.5'
                  }`}
                >
                  <MessageCircle size={20} />
                  {showContactMenu ? 'Đóng tuỳ chọn' : 'Liên hệ mua ngay'}
                </button>
                
                <button 
                  onClick={handleCopyLink}
                  className="flex items-center justify-center gap-2 bg-white dark:bg-gray-800 hover:bg-emerald-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 border-2 border-gray-100 dark:border-gray-600 font-bold py-3.5 px-6 rounded-xl transition-all"
                >
                  {copied ? <CheckCircle2 size={20} className="text-emerald-600 dark:text-emerald-400"/> : <Copy size={20} />}
                  {copied ? 'Đã sao chép' : 'Chia sẻ'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
