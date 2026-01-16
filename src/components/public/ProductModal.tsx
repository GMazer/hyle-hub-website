import React, { useState } from 'react';
import { Product, SiteConfig, SocialLink } from '../../types';
import { X, CheckCircle2, Copy, MessageCircle, Info, ChevronUp, Maximize2 } from 'lucide-react';
import { DynamicIcon } from '../ui/Icons';
import ReactMarkdown from 'react-markdown';

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
  const [showFullDesc, setShowFullDesc] = useState(false);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    const url = `${window.location.origin}/#/?product=${product.slug}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Fallback if no socials
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
    <>
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
            <div className="w-full md:w-5/12 bg-emerald-50/50 dark:bg-gray-800/50 p-6 md:p-8 flex items-center justify-center shrink-0">
              <div className="w-full aspect-square rounded-2xl overflow-hidden shadow-lg border-4 border-white dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
                <img 
                  src={product.thumbnailUrl} 
                  alt={product.name} 
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            {/* Right: Info - Scrollable Area */}
            <div className="w-full md:w-7/12 flex flex-col h-full overflow-hidden">
              <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
                
                {/* Header Info */}
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

                {/* Detailed Info (Markdown) */}
                {product.fullDescription && (
                  <div className="mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-gray-900 dark:text-white text-sm flex items-center gap-2">
                          <Info size={16} className="text-emerald-500"/> Thông tin chi tiết
                        </h3>
                        <button 
                          onClick={() => setShowFullDesc(true)}
                          className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                        >
                          <Maximize2 size={12} /> Phóng to
                        </button>
                      </div>
                      
                      <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                         {/* Markdown Content Container with Scroll */}
                         <div className="markdown-body text-gray-700 dark:text-gray-300 text-sm max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                            <ReactMarkdown>{product.fullDescription}</ReactMarkdown>
                         </div>
                         <div className="mt-2 text-center pt-2 border-t border-gray-200 dark:border-gray-700">
                            <button 
                              onClick={() => setShowFullDesc(true)}
                              className="text-xs font-medium text-gray-500 hover:text-emerald-600 transition-colors"
                            >
                              Nhấn để đọc toàn bộ...
                            </button>
                         </div>
                      </div>
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

              {/* Actions Footer */}
              <div className="p-6 md:p-8 pt-4 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 z-20">
                <div className="flex flex-col sm:flex-row gap-3 relative">
                  {/* Contact Menu Popover */}
                  {showContactMenu && (
                    <div className="absolute bottom-full left-0 w-full sm:w-auto min-w-[240px] mb-3 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-emerald-100 dark:border-gray-700 overflow-hidden z-30 animate-in slide-in-from-bottom-2 fade-in duration-200">
                      <div className="bg-emerald-50 dark:bg-emerald-900/30 px-4 py-2 text-xs font-bold text-emerald-800 dark:text-emerald-400 border-b border-emerald-100 dark:border-gray-700">
                        Chọn kênh hỗ trợ:
                      </div>
                      <div className="p-1 max-h-60 overflow-y-auto">
                        {socials.map(social => (
                          <a 
                            key={social.id}
                            href={social.url}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-200 transition-colors"
                          >
                            <DynamicIcon name={social.iconName} size={18} className="text-emerald-600 dark:text-emerald-400"/>
                            <span className="font-medium">{social.platform}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  <button 
                    onClick={handleContactClick}
                    className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-lg shadow-emerald-200 dark:shadow-none transform hover:-translate-y-0.5"
                  >
                    <MessageCircle size={20} />
                    {showContactMenu ? 'Đóng' : 'Liên hệ mua ngay'}
                    {socials.length > 0 && <ChevronUp size={16} className={`transition-transform duration-200 ${showContactMenu ? 'rotate-180' : ''}`}/>}
                  </button>
                  
                  <button 
                    onClick={handleCopyLink}
                    className="flex items-center justify-center gap-2 bg-white dark:bg-gray-800 hover:bg-emerald-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 border-2 border-gray-100 dark:border-gray-600 font-bold py-3.5 px-6 rounded-xl transition-all"
                  >
                    {copied ? <CheckCircle2 size={20} className="text-emerald-600 dark:text-emerald-400"/> : <Copy size={20} />}
                    {copied ? 'Đã chép' : 'Share'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full Description Popup Overlay */}
      {showFullDesc && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-900 w-full max-w-2xl max-h-[85vh] rounded-2xl shadow-2xl flex flex-col relative animate-in zoom-in-95 duration-200">
             <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800">
               <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                 <Info size={20} className="text-emerald-500"/> Chi tiết sản phẩm
               </h3>
               <button 
                onClick={() => setShowFullDesc(false)} 
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
               >
                 <X size={20} className="text-gray-500" />
               </button>
             </div>
             
             <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
               <div className="markdown-body text-gray-800 dark:text-gray-200 text-base leading-relaxed">
                  <ReactMarkdown>{product.fullDescription}</ReactMarkdown>
               </div>
             </div>

             <div className="p-4 border-t border-gray-100 dark:border-gray-800 text-center">
               <button 
                 onClick={() => setShowFullDesc(false)}
                 className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors"
               >
                 Đóng
               </button>
             </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductModal;