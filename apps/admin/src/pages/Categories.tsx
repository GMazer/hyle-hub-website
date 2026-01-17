import React, { useEffect, useState } from 'react';
import { adminApi } from '../services/api';
import { Category } from '../../../packages/shared/types';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const [formData, setFormData] = useState<Partial<Category>>({
    name: '',
    slug: '',
    description: '',
    order: 0,
    isVisible: true
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const cats = await adminApi.getCategories();
      setCategories(cats);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleEdit = (cat: Category) => {
    setFormData(cat);
    setEditingCategory(cat);
    setIsCreating(false);
  };

  const handleCreate = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      order: categories.length + 1,
      isVisible: true
    });
    setEditingCategory({} as Category);
    setIsCreating(true);
  };

  const handleCloseModal = () => {
    setEditingCategory(null);
    setIsCreating(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xoá danh mục này? Các sản phẩm thuộc danh mục này sẽ bị mất liên kết.')) {
      try {
        await adminApi.deleteCategory(id);
        loadData();
      } catch (e) {
        alert('Xoá thất bại');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminApi.saveCategory(formData as Category);
      handleCloseModal();
      loadData();
    } catch (e) {
      alert('Lưu thất bại');
    }
  };

  const inputClass = "w-full p-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500";
  const labelClass = "block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1";

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold text-emerald-800 dark:text-emerald-400">Quản lý Danh mục</h1>
        <button 
          onClick={handleCreate} 
          className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700 transition-colors"
        >
          <Plus size={18} /> Thêm Danh mục
        </button>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-emerald-100 dark:border-gray-800 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-emerald-50 dark:bg-gray-800 text-emerald-700 dark:text-emerald-400 text-sm uppercase">
            <tr>
              <th className="p-4 font-semibold w-16">ID</th>
              <th className="p-4 font-semibold">Tên Danh mục</th>
              <th className="p-4 font-semibold">Slug</th>
              <th className="p-4 font-semibold text-center">Thứ tự</th>
              <th className="p-4 font-semibold text-center">Hiển thị</th>
              <th className="p-4 text-right font-semibold">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-gray-900 dark:text-gray-300">
            {loading ? <tr><td colSpan={6} className="p-8 text-center text-gray-500">Đang tải...</td></tr> : 
             categories.length === 0 ? <tr><td colSpan={6} className="p-8 text-center text-gray-500">Chưa có danh mục nào.</td></tr> :
             categories.map(cat => (
              <tr key={cat.id} className="hover:bg-emerald-50/50 dark:hover:bg-gray-800 transition-colors">
                <td className="p-4 text-sm text-gray-500">{cat.id}</td>
                <td className="p-4 font-medium">{cat.name}</td>
                <td className="p-4 text-sm text-gray-500">{cat.slug}</td>
                <td className="p-4 text-center">{cat.order}</td>
                <td className="p-4 text-center">
                  <span className={`px-2 py-1 text-xs rounded-full font-medium ${cat.isVisible ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-700'}`}>
                    {cat.isVisible ? 'Hiện' : 'Ẩn'}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => handleEdit(cat)} className="p-2 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-gray-700 rounded transition-colors"><Edit size={18}/></button>
                    <button onClick={() => handleDelete(cat.id)} className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-gray-700 rounded transition-colors"><Trash2 size={18}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-lg border border-gray-200 dark:border-gray-700 animate-in zoom-in duration-200">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                {isCreating ? 'Thêm Danh mục Mới' : 'Sửa Danh mục'}
              </h2>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"><X size={24}/></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className={labelClass}>Tên danh mục *</label>
                <input 
                  required 
                  type="text" 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})} 
                  className={inputClass}
                  placeholder="Ví dụ: Công cụ AI"
                />
              </div>

              <div>
                <label className={labelClass}>Slug (Đường dẫn)</label>
                <input 
                  type="text" 
                  value={formData.slug} 
                  onChange={e => setFormData({...formData, slug: e.target.value})} 
                  className={inputClass}
                  placeholder="cong-cu-ai"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className={labelClass}>Thứ tự hiển thị</label>
                   <input 
                     type="number" 
                     value={formData.order} 
                     onChange={e => setFormData({...formData, order: Number(e.target.value)})} 
                     className={inputClass}
                   />
                </div>
                <div className="flex items-end pb-3">
                   <label className="flex items-center gap-2 cursor-pointer select-none text-gray-700 dark:text-gray-300">
                      <input 
                        type="checkbox" 
                        checked={formData.isVisible} 
                        onChange={e => setFormData({...formData, isVisible: e.target.checked})} 
                        className="w-5 h-5 accent-emerald-600"
                      />
                      Hiển thị trên web
                   </label>
                </div>
              </div>

              <div>
                <label className={labelClass}>Mô tả (Tuỳ chọn)</label>
                <textarea 
                  rows={3}
                  value={formData.description || ''} 
                  onChange={e => setFormData({...formData, description: e.target.value})} 
                  className={inputClass}
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg font-medium"
                >
                  Hủy
                </button>
                <button 
                  type="submit" 
                  className="flex items-center gap-2 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium"
                >
                  <Save size={18} /> Lưu lại
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;