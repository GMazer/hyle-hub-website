import React, { useState, useEffect } from 'react';
import { Product, Category, PriceOption } from '../../types';
import { Plus, Trash2, Save, ArrowLeft } from 'lucide-react';
import { mockApi } from '../../services/mockApi';

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
    galleryUrls: [], // Deprecated in UI but kept in type
    tags: [],
    status: 'draft',
    priceOptions: [],
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (product) {
      setFormData(product);
    }
  }, [product]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddPrice = () => {
    const newPrice: PriceOption = {
      id: Math.random().toString(36).substr(2, 9),
      name: 'Gói chuẩn',
      price: 0,
      currency: 'k',
      unit: 'tháng',
      isHighlight: false
    };
    setFormData(prev => ({
      ...prev,
      priceOptions: [...(prev.priceOptions || []), newPrice]
    }));
  };

  const handlePriceChange = (id: string, field: keyof PriceOption, value: any) => {
    setFormData(prev => ({
      ...prev,
      priceOptions: prev.priceOptions?.map(p => p.id === id ? { ...p, [field]: value } : p)
    }));
  };

  const handleRemovePrice = (id: string) => {
    setFormData(prev => ({
      ...prev,
      priceOptions: prev.priceOptions?.filter(p => p.id !== id)
    }));
  };

  const handleAddTag = () => {
    if (tagInput.trim()) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (idx: number) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter((_, i) => i !== idx)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Basic validation
      if (!formData.name || !formData.categoryId || !formData.priceOptions?.length) {
        alert("Vui lòng điền các trường bắt buộc và thêm ít nhất một mức giá.");
        setIsSubmitting(false);
        return;
      }
      await mockApi.saveProduct(formData as Product);
      onSave();
    } catch (error) {
      console.error(error);
      alert("Lỗi khi lưu sản phẩm");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg border border-emerald-100 p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
        <button type="button" onClick={onCancel} className="text-gray-500 hover:text-emerald-600 flex items-center gap-1 font-medium transition-colors">
          <ArrowLeft size={18} /> Quay lại
        </button>
        <h2 className="text-2xl font-bold text-emerald-800">{product ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Info */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Tên sản phẩm *</label>
            <input 
              required
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange}
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Đường dẫn (Slug)</label>
            <input 
              type="text" 
              name="slug" 
              value={formData.slug} 
              onChange={handleChange}
              placeholder="tự-động-tạo-nếu-trống"
              className="w-full p-2.5 border border-gray-300 rounded-lg text-gray-500 bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Danh mục *</label>
            <select 
              required
              name="categoryId" 
              value={formData.categoryId} 
              onChange={handleChange}
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">Chọn danh mục</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Trạng thái</label>
            <select 
              name="status" 
              value={formData.status} 
              onChange={handleChange}
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
            >
              <option value="draft">Nháp</option>
              <option value="published">Đang hiện</option>
              <option value="hidden">Đã ẩn</option>
            </select>
          </div>
        </div>

        {/* Media & Tags */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">URL Ảnh đại diện (Duy nhất)</label>
            <input 
              type="text" 
              name="thumbnailUrl" 
              value={formData.thumbnailUrl} 
              onChange={handleChange}
              placeholder="https://..."
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
            />
            {formData.thumbnailUrl && (
              <div className="mt-2 w-24 h-24 rounded border border-gray-200 overflow-hidden">
                <img src={formData.thumbnailUrl} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Thẻ (Tags)</label>
            <div className="flex gap-2 mb-2">
              <input 
                type="text" 
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                className="flex-1 p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                placeholder="Nhập và nhấn Enter"
              />
              <button type="button" onClick={handleAddTag} className="px-4 py-2 bg-emerald-100 text-emerald-700 font-medium rounded-lg hover:bg-emerald-200">Thêm</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags?.map((tag, idx) => (
                <span key={idx} className="px-2 py-1 bg-gray-100 border border-gray-200 rounded text-xs flex items-center gap-1">
                  {tag}
                  <button type="button" onClick={() => removeTag(idx)} className="text-gray-400 hover:text-red-500">×</button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Description Full Width */}
        <div className="md:col-span-2 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Mô tả ngắn</label>
            <input 
              type="text" 
              name="shortDescription" 
              value={formData.shortDescription} 
              onChange={handleChange}
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Mô tả chi tiết (Hỗ trợ xuống dòng)</label>
            <textarea 
              rows={6}
              name="fullDescription" 
              value={formData.fullDescription} 
              onChange={handleChange}
              placeholder="- Dòng 1&#10;- Dòng 2"
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
            />
          </div>
           <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Lưu ý quan trọng</label>
            <input 
              type="text" 
              name="notes" 
              value={formData.notes || ''} 
              onChange={handleChange}
              placeholder="Ví dụ: Không đổi mật khẩu"
              className="w-full p-2.5 border border-amber-200 rounded-lg bg-amber-50 text-amber-900 focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        {/* Pricing Options */}
        <div className="md:col-span-2 border-t border-gray-100 pt-6 mt-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-emerald-800">Bảng giá</h3>
            <button type="button" onClick={handleAddPrice} className="flex items-center gap-1 text-sm bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg hover:bg-emerald-100 font-medium transition-colors">
              <Plus size={16} /> Thêm gói
            </button>
          </div>
          
          <div className="space-y-3">
            {formData.priceOptions?.map((opt, idx) => (
              <div key={opt.id} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end p-4 bg-gray-50 rounded-xl border border-gray-200 shadow-sm">
                 <div className="md:col-span-3">
                    <label className="text-xs font-medium text-gray-500 mb-1 block">Tên gói</label>
                    <input type="text" value={opt.name} onChange={e => handlePriceChange(opt.id, 'name', e.target.value)} className="w-full p-2 border rounded focus:ring-1 focus:ring-emerald-500" />
                 </div>
                 <div className="md:col-span-2">
                    <label className="text-xs font-medium text-gray-500 mb-1 block">Giá</label>
                    <input type="number" value={opt.price} onChange={e => handlePriceChange(opt.id, 'price', Number(e.target.value))} className="w-full p-2 border rounded focus:ring-1 focus:ring-emerald-500" />
                 </div>
                 <div className="md:col-span-1">
                    <label className="text-xs font-medium text-gray-500 mb-1 block">Đơn vị</label>
                    <input type="text" value={opt.unit} onChange={e => handlePriceChange(opt.id, 'unit', e.target.value)} className="w-full p-2 border rounded focus:ring-1 focus:ring-emerald-500" />
                 </div>
                 <div className="md:col-span-4">
                    <label className="text-xs font-medium text-gray-500 mb-1 block">Mô tả thêm</label>
                    <input type="text" value={opt.description || ''} onChange={e => handlePriceChange(opt.id, 'description', e.target.value)} className="w-full p-2 border rounded focus:ring-1 focus:ring-emerald-500" />
                 </div>
                 <div className="md:col-span-2 flex items-center justify-end gap-3 pb-2">
                    <label className="flex items-center gap-1 text-xs cursor-pointer select-none">
                      <input type="checkbox" checked={opt.isHighlight} onChange={e => handlePriceChange(opt.id, 'isHighlight', e.target.checked)} className="accent-emerald-600"/>
                      <span className="text-emerald-700 font-medium">Nổi bật</span>
                    </label>
                    <button type="button" onClick={() => handleRemovePrice(opt.id)} className="text-red-400 p-1 hover:bg-red-50 hover:text-red-600 rounded transition-colors"><Trash2 size={18}/></button>
                 </div>
              </div>
            ))}
             {formData.priceOptions?.length === 0 && (
              <div className="text-center text-gray-400 py-8 border-2 border-dashed border-gray-200 rounded-xl">Chưa có gói giá nào. Hãy thêm gói mới.</div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-gray-100">
        <button type="button" onClick={onCancel} className="px-5 py-2.5 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors">Hủy bỏ</button>
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 font-medium shadow-lg shadow-emerald-200 transition-all"
        >
          <Save size={18} />
          {isSubmitting ? 'Đang lưu...' : 'Lưu sản phẩm'}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;