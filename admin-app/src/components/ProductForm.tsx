
import React, { useState, useEffect, useRef } from 'react';
import { Product, Category, PriceOption } from '../types';
import { Plus, Trash2, Save, ArrowLeft, Upload, Flame, Copy } from 'lucide-react';
import { adminApi } from '../services/api';

interface Props {
  product?: Product | null;
  categories: Category[];
  onSave: () => void;
  onCancel: () => void;
}

const ProductForm: React.FC<Props> = ({ product, categories, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    slug: '',
    categoryId: '',
    shortDescription: '',
    fullDescription: '',
    thumbnailUrl: '',
    galleryUrls: [],
    tags: [],
    status: 'draft',
    priceOptions: [],
    notes: '',
    isHot: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (product) setFormData(product);
  }, [product]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      let content = event.target?.result as string;
      if (content) {
        // Clean up markdown content if needed
        content = content.replace(/\n{3,}/g, '\n\n').trim();
        setFormData(prev => ({ ...prev, fullDescription: content }));
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAddPrice = () => {
    const newPrice: PriceOption = {
      id: Math.random().toString(36).substr(2, 9),
      name: '',
      price: 0,
      currency: 'K',
      unit: 'tháng',
      isHighlight: false
    };
    setFormData(prev => ({ ...prev, priceOptions: [...(prev.priceOptions || []), newPrice] }));
  };

  const handleDuplicatePrice = (index: number) => {
    if (!formData.priceOptions) return;
    const optionToClone = formData.priceOptions[index];
    const newOption: PriceOption = {
      ...optionToClone,
      id: Math.random().toString(36).substr(2, 9), // New ID
      name: optionToClone.name ? `${optionToClone.name} (Copy)` : ''
    };
    
    const newOptions = [...formData.priceOptions];
    newOptions.splice(index + 1, 0, newOption); // Insert after current
    setFormData(prev => ({ ...prev, priceOptions: newOptions }));
  };

  const handlePriceChange = (id: string, field: keyof PriceOption, value: any) => {
    setFormData(prev => ({
      ...prev,
      priceOptions: prev.priceOptions?.map(p => p.id === id ? { ...p, [field]: value } : p)
    }));
  };

  const handleRemovePrice = (id: string) => {
    setFormData(prev => ({ ...prev, priceOptions: prev.priceOptions?.filter(p => p.id !== id) }));
  };

  const handleAddTag = () => {
    if (tagInput.trim()) {
      setFormData(prev => ({ ...prev, tags: [...(prev.tags || []), tagInput.trim()] }));
      setTagInput('');
    }
  };

  const removeTag = (idx: number) => {
    setFormData(prev => ({ ...prev, tags: prev.tags?.filter((_, i) => i !== idx) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (!formData.name || !formData.categoryId || !formData.priceOptions?.length) {
        alert("Vui lòng điền các trường bắt buộc và thêm ít nhất một mức giá.");
        setIsSubmitting(false);
        return;
      }
      await adminApi.saveProduct(formData as Product);
      onSave();
    } catch (error) {
      console.error(error);
      alert("Lỗi khi lưu sản phẩm");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = "w-full p-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 cursor-text transition-colors";
  const labelClass = "block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1";
  
  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-emerald-100 dark:border-gray-800 p-6 max-w-4xl mx-auto transition-colors duration-200">
      <div className="flex items-center justify-between mb-6 border-b border-gray-100 dark:border-gray-800 pb-4">
        <button type="button" onClick={onCancel} className="text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center gap-1 font-medium transition-colors">
          <ArrowLeft size={18} /> Quay lại
        </button>
        <h2 className="text-2xl font-bold text-emerald-800 dark:text-emerald-400">{product ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* --- LEFT COLUMN --- */}
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Tên sản phẩm *</label>
            <input required type="text" name="name" value={formData.name} onChange={handleChange} className={inputClass} placeholder="VD: ChatGPT Plus" />
          </div>
          <div>
            <label className={labelClass}>Slug (URL)</label>
            <input 
              type="text" 
              name="slug" 
              value={formData.slug} 
              onChange={handleChange} 
              className={`${inputClass} bg-gray-50 dark:bg-gray-800/50`} 
              placeholder="chatgpt-plus" 
            />
          </div>
          <div>
            <label className={labelClass}>Danh mục *</label>
            <select required name="categoryId" value={formData.categoryId} onChange={handleChange} className={inputClass}>
              <option value="">-- Chọn danh mục --</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          
          {/* Status & Hot Section */}
          <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
            <label className={labelClass}>Cài đặt hiển thị</label>
            <div className="flex gap-4 items-center mt-2">
                <select name="status" value={formData.status} onChange={handleChange} className={`${inputClass} flex-1`}>
                  <option value="draft">Nháp (Draft)</option>
                  <option value="published">Công khai (Published)</option>
                  <option value="hidden">Ẩn (Hidden)</option>
                </select>
                
                <label className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border cursor-pointer transition-all ${
                    formData.isHot 
                    ? 'bg-orange-50 border-orange-500 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400' 
                    : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-500'
                }`}>
                    <input 
                       type="checkbox" 
                       name="isHot" 
                       checked={formData.isHot || false} 
                       onChange={handleCheckboxChange} 
                       className="w-5 h-5 accent-orange-500"
                    />
                    <span className="font-bold flex items-center gap-1">
                        <Flame size={18} className={formData.isHot ? 'fill-orange-500 text-orange-500' : 'text-gray-400'} /> 
                        HOT
                    </span>
                </label>
            </div>
          </div>
        </div>

        {/* --- RIGHT COLUMN --- */}
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Ảnh Thumbnail URL</label>
            <input type="text" name="thumbnailUrl" value={formData.thumbnailUrl} onChange={handleChange} className={inputClass} placeholder="https://..." />
            {formData.thumbnailUrl && (
              <div className="mt-2 w-24 h-24 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden bg-gray-100 dark:bg-gray-800 shadow-sm relative group">
                <img src={formData.thumbnailUrl} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs">Preview</div>
              </div>
            )}
          </div>
          <div>
            <label className={labelClass}>Tags</label>
            <div className="flex gap-2 mb-2">
              <input type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())} className={inputClass} placeholder="Nhập tag..." />
              <button type="button" onClick={handleAddTag} className="px-4 py-2 bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 font-medium rounded-lg hover:bg-emerald-200 dark:hover:bg-emerald-800">Thêm</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags?.map((tag, idx) => (
                <span key={idx} className="px-2 py-1 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded text-xs flex items-center gap-1 text-gray-700 dark:text-gray-300">
                  #{tag} <button type="button" onClick={() => removeTag(idx)} className="text-gray-400 hover:text-red-500">×</button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* --- DESCRIPTION --- */}
        <div className="md:col-span-2 space-y-4">
          <div>
             <label className={labelClass}>Mô tả ngắn</label>
             <input type="text" name="shortDescription" value={formData.shortDescription} onChange={handleChange} className={inputClass} placeholder="Hiện ở trang chủ..." />
          </div>
          <div>
             <div className="flex justify-between items-center mb-1">
                <label className={labelClass}>Mô tả chi tiết (Markdown)</label>
                <button 
                  type="button" 
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs flex items-center gap-1 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 font-medium"
                >
                  <Upload size={14} /> Upload file
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                  className="hidden" 
                  accept=".md,.txt"
                />
             </div>
             <textarea rows={6} name="fullDescription" value={formData.fullDescription} onChange={handleChange} className={`${inputClass} font-mono text-sm`} placeholder="- Dòng 1&#10;- Dòng 2..." />
          </div>
          <div>
             <label className={labelClass}>Lưu ý (Notes)</label>
             <input type="text" name="notes" value={formData.notes || ''} onChange={handleChange} className={`${inputClass} border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/10`} placeholder="VD: Bảo hành 1 đổi 1..." />
          </div>
        </div>
        
        {/* --- PRICING SECTION --- */}
        <div className="md:col-span-2 border-t border-gray-100 dark:border-gray-800 pt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-emerald-800 dark:text-emerald-400 flex items-center gap-2">
                Bảng giá sản phẩm <span className="text-xs font-normal text-gray-500 px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded-full">{formData.priceOptions?.length || 0} gói</span>
            </h3>
            <button type="button" onClick={handleAddPrice} className="text-sm bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 font-medium flex items-center gap-1 shadow-sm">
              <Plus size={16} /> Thêm gói giá
            </button>
          </div>
          
          <div className="space-y-4">
            {formData.priceOptions?.map((opt, idx) => (
              <div key={opt.id} className="relative p-4 bg-gray-50 dark:bg-gray-800/40 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors">
                 
                 {/* Row 1: Basic Info */}
                 <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-3">
                     {/* Name */}
                     <div className="md:col-span-4">
                       <label className="text-[10px] uppercase font-bold text-gray-500 mb-1 block">Tên gói</label>
                       <input 
                         type="text" 
                         value={opt.name} 
                         onChange={e => handlePriceChange(opt.id, 'name', e.target.value)} 
                         className={inputClass} 
                         placeholder="VD: Gói 1 năm" 
                       />
                     </div>
                     
                     {/* Price */}
                     <div className="md:col-span-3">
                       <label className="text-[10px] uppercase font-bold text-gray-500 mb-1 block">Giá (nghìn đồng)</label>
                       <div className="relative">
                           <input 
                             type="number" 
                             value={opt.price} 
                             onChange={e => handlePriceChange(opt.id, 'price', Number(e.target.value))} 
                             className={`${inputClass} pr-8 font-bold text-emerald-600 dark:text-emerald-400`} 
                             placeholder="0" 
                           />
                           <span className="absolute right-3 top-2.5 text-gray-400 text-sm font-bold">K</span>
                       </div>
                     </div>
                     
                     {/* Unit - Expanded Width */}
                     <div className="md:col-span-3">
                       <label className="text-[10px] uppercase font-bold text-gray-500 mb-1 block">Đơn vị / Thời hạn</label>
                       <input 
                         type="text" 
                         value={opt.unit} 
                         onChange={e => handlePriceChange(opt.id, 'unit', e.target.value)} 
                         className={inputClass} 
                         placeholder="tháng / năm / vĩnh viễn" 
                       />
                     </div>

                     {/* Actions */}
                     <div className="md:col-span-2 flex items-end gap-2">
                        <button 
                          type="button" 
                          onClick={() => handleDuplicatePrice(idx)} 
                          className="flex-1 h-[42px] bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 border border-blue-200 dark:border-blue-800 rounded-lg flex justify-center items-center transition-colors" 
                          title="Nhân bản"
                        >
                            <Copy size={18}/>
                        </button>
                        <button 
                          type="button" 
                          onClick={() => handleRemovePrice(opt.id)} 
                          className="flex-1 h-[42px] bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/40 border border-red-200 dark:border-red-800 rounded-lg flex justify-center items-center transition-colors"
                          title="Xoá"
                        >
                            <Trash2 size={18}/>
                        </button>
                     </div>
                 </div>

                 {/* Row 2: Description & Highlight */}
                 <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-2 border-t border-gray-200 dark:border-gray-700 border-dashed">
                     <div className="md:col-span-9">
                        <input 
                          type="text" 
                          value={opt.description || ''} 
                          onChange={e => handlePriceChange(opt.id, 'description', e.target.value)} 
                          className={`${inputClass} text-sm bg-transparent border-transparent hover:border-gray-300 focus:bg-white dark:focus:bg-gray-800`} 
                          placeholder="+ Thêm mô tả phụ (VD: Dùng riêng, Bảo hành trọn đời...)" 
                        />
                     </div>
                     <div className="md:col-span-3 flex items-center justify-end">
                        <label className="flex items-center gap-2 text-sm cursor-pointer select-none text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400">
                          <input type="checkbox" checked={opt.isHighlight || false} onChange={e => handlePriceChange(opt.id, 'isHighlight', e.target.checked)} className="accent-emerald-600 w-4 h-4 rounded"/>
                          <span className="font-medium">Nổi bật</span>
                        </label>
                     </div>
                 </div>
              </div>
            ))}
            
            {formData.priceOptions?.length === 0 && (
                <div className="text-center py-8 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                    <p className="text-gray-500 dark:text-gray-400 italic mb-2">Chưa có gói giá nào</p>
                    <button type="button" onClick={handleAddPrice} className="text-emerald-600 font-medium hover:underline">Click để thêm gói đầu tiên</button>
                </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-gray-100 dark:border-gray-800 sticky bottom-0 bg-white dark:bg-gray-900 p-4 -mx-6 -mb-6 rounded-b-xl z-10 shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
        <button type="button" onClick={onCancel} className="px-6 py-2.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg font-medium transition-colors">Hủy bỏ</button>
        <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 px-8 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 font-bold shadow-lg shadow-emerald-200 dark:shadow-none transition-all hover:-translate-y-0.5">
          <Save size={18} /> {isSubmitting ? 'Đang lưu...' : 'Lưu sản phẩm'}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
