import React, { useState, useEffect, useRef } from 'react';
import { Product, Category, PriceOption } from '../../types';
import { Plus, Trash2, Save, ArrowLeft, Upload } from 'lucide-react';
import { adminApi } from '../../services/adminApi';

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
    notes: ''
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      let content = event.target?.result as string;
      if (content) {
        // 1. Remove footnotes/citations like [^1], [^1_15]
        content = content.replace(/\[\^.*?\]/g, '');
        // 2. Remove ChatGPT style citations like 【1:0†source】
        content = content.replace(/【.*?】/g, '');
        // 3. Remove numeric citations like [1], [12]
        content = content.replace(/\[\d+\]/g, '');
        // 4. Strip links but keep text: [text](url) -> text
        content = content.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
        
        setFormData(prev => ({ ...prev, fullDescription: content }));
      }
    };
    reader.readAsText(file);
    // Reset so the same file can be selected again
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAddPrice = () => {
    const newPrice: PriceOption = {
      id: Math.random().toString(36).substr(2, 9),
      name: 'Gói chuẩn',
      price: 0,
      currency: 'K',
      unit: 'tháng',
      isHighlight: false
    };
    setFormData(prev => ({ ...prev, priceOptions: [...(prev.priceOptions || []), newPrice] }));
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
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Tên sản phẩm *</label>
            <input required type="text" name="name" value={formData.name} onChange={handleChange} className={inputClass} placeholder="Nhập tên sản phẩm..." />
          </div>
          <div>
            <label className={labelClass}>Slug (Đường dẫn)</label>
            <input 
              type="text" 
              name="slug" 
              value={formData.slug} 
              onChange={handleChange} 
              className={`${inputClass} bg-gray-50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400`} 
              placeholder="tự-động-tạo-nếu-trống" 
            />
          </div>
          <div>
            <label className={labelClass}>Danh mục *</label>
            <select required name="categoryId" value={formData.categoryId} onChange={handleChange} className={inputClass}>
              <option value="">Chọn danh mục</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Trạng thái</label>
            <select name="status" value={formData.status} onChange={handleChange} className={inputClass}>
              <option value="draft">Nháp</option>
              <option value="published">Đang hiện</option>
              <option value="hidden">Đã ẩn</option>
            </select>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Ảnh Thumbnail URL</label>
            <input type="text" name="thumbnailUrl" value={formData.thumbnailUrl} onChange={handleChange} className={inputClass} placeholder="https://..." />
            {formData.thumbnailUrl && (
              <div className="mt-2 w-20 h-20 rounded border border-gray-200 dark:border-gray-700 overflow-hidden bg-gray-100 dark:bg-gray-800">
                <img src={formData.thumbnailUrl} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>
          <div>
            <label className={labelClass}>Tags</label>
            <div className="flex gap-2 mb-2">
              <input type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())} className={inputClass} placeholder="Nhập tag rồi Enter" />
              <button type="button" onClick={handleAddTag} className="px-4 py-2 bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 font-medium rounded-lg hover:bg-emerald-200 dark:hover:bg-emerald-800">Thêm</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags?.map((tag, idx) => (
                <span key={idx} className="px-2 py-1 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded text-xs flex items-center gap-1 text-gray-700 dark:text-gray-300">
                  {tag} <button type="button" onClick={() => removeTag(idx)} className="text-gray-400 hover:text-red-500">×</button>
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="md:col-span-2 space-y-4">
          <div>
             <label className={labelClass}>Mô tả ngắn</label>
             <input type="text" name="shortDescription" value={formData.shortDescription} onChange={handleChange} className={inputClass} placeholder="Mô tả ngắn gọn..." />
          </div>
          <div>
             <div className="flex justify-between items-center mb-1">
                <label className={labelClass}>Mô tả chi tiết</label>
                <button 
                  type="button" 
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs flex items-center gap-1 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors font-medium"
                >
                  <Upload size={14} /> Tải file Markdown
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                  className="hidden" 
                  accept=".md,.txt"
                />
             </div>
             <textarea rows={5} name="fullDescription" value={formData.fullDescription} onChange={handleChange} className={inputClass} placeholder="- Dòng 1&#10;- Dòng 2..." />
          </div>
          <div>
             <label className={labelClass}>Lưu ý (Notes)</label>
             <input type="text" name="notes" value={formData.notes || ''} onChange={handleChange} className={`${inputClass} border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/10`} placeholder="Lưu ý đặc biệt..." />
          </div>
        </div>
        
        <div className="md:col-span-2 border-t border-gray-100 dark:border-gray-800 pt-6">
          <div className="flex justify-between mb-4">
            <h3 className="font-bold text-emerald-800 dark:text-emerald-400">Bảng giá</h3>
            <button type="button" onClick={handleAddPrice} className="text-sm bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-3 py-1.5 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/50 font-medium flex items-center gap-1">
              <Plus size={16} /> Thêm gói
            </button>
          </div>
          <div className="space-y-3">
            {formData.priceOptions?.map((opt) => (
              <div key={opt.id} className="grid grid-cols-1 md:grid-cols-12 gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
                 <div className="md:col-span-3">
                   <input type="text" value={opt.name} onChange={e => handlePriceChange(opt.id, 'name', e.target.value)} className={inputClass} placeholder="Tên gói" />
                 </div>
                 <div className="md:col-span-2">
                   <input type="number" value={opt.price} onChange={e => handlePriceChange(opt.id, 'price', Number(e.target.value))} className={inputClass} placeholder="Giá" />
                 </div>
                 <div className="md:col-span-1">
                   <input type="text" value={opt.unit} onChange={e => handlePriceChange(opt.id, 'unit', e.target.value)} className={inputClass} placeholder="Đơn vị" />
                 </div>
                 <div className="md:col-span-5 flex items-center gap-2">
                    <input type="text" value={opt.description || ''} onChange={e => handlePriceChange(opt.id, 'description', e.target.value)} className={`${inputClass} flex-1`} placeholder="Mô tả" />
                    <button type="button" onClick={() => handleRemovePrice(opt.id)} className="text-red-500 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"><Trash2 size={18}/></button>
                 </div>
                 <div className="md:col-span-12 flex items-center gap-2 pt-1">
                    <label className="flex items-center gap-2 text-sm cursor-pointer select-none text-gray-600 dark:text-gray-400">
                      <input type="checkbox" checked={opt.isHighlight} onChange={e => handlePriceChange(opt.id, 'isHighlight', e.target.checked)} className="accent-emerald-600 w-4 h-4"/>
                      Nổi bật
                    </label>
                 </div>
              </div>
            ))}
            {formData.priceOptions?.length === 0 && <p className="text-center text-gray-500 dark:text-gray-400 italic py-4 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">Chưa có gói giá nào</p>}
          </div>
        </div>
      </div>
      <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-gray-100 dark:border-gray-800">
        <button type="button" onClick={onCancel} className="px-5 py-2.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg font-medium">Hủy bỏ</button>
        <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 font-medium shadow-lg dark:shadow-none">
          <Save size={18} /> {isSubmitting ? 'Đang lưu...' : 'Lưu sản phẩm'}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;