import React, { useEffect, useState } from 'react';
import { adminApi } from '../services/api';
import { Product, Category } from '../types';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import ProductForm from '../components/ProductForm';

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null | undefined>(undefined);
  const [search, setSearch] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [prods, cats] = await Promise.all([adminApi.getProducts(), adminApi.getCategories()]);
      setProducts(prods);
      setCategories(cats);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xoá sản phẩm này?')) {
      await adminApi.deleteProduct(id);
      loadData();
    }
  };

  const handleSaveComplete = () => {
    setEditingProduct(undefined);
    loadData();
  };

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  if (editingProduct !== undefined) {
    return <ProductForm product={editingProduct} categories={categories} onSave={handleSaveComplete} onCancel={() => setEditingProduct(undefined)} />;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-emerald-100">
      <div className="p-6 border-b border-emerald-100 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-xl font-bold text-emerald-800">Danh sách sản phẩm</h1>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-2 top-2.5 text-gray-400" size={18} />
            <input type="text" placeholder="Tìm kiếm..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2 border rounded focus:ring-2 focus:ring-emerald-500" />
          </div>
          <button onClick={() => setEditingProduct(null)} className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700">
            <Plus size={18} /> Thêm mới
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-emerald-50 text-emerald-700 text-sm uppercase">
            <tr>
              <th className="p-4 font-semibold">Sản phẩm</th>
              <th className="p-4 font-semibold">Danh mục</th>
              <th className="p-4 font-semibold">Giá</th>
              <th className="p-4 font-semibold">Trạng thái</th>
              <th className="p-4 text-right font-semibold">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? <tr><td colSpan={5} className="p-8 text-center text-gray-500">Đang tải...</td></tr> : 
             filteredProducts.length === 0 ? <tr><td colSpan={5} className="p-8 text-center text-gray-500">Không tìm thấy sản phẩm.</td></tr> :
             filteredProducts.map(product => {
                const category = categories.find(c => c.id === product.categoryId);
                const minPrice = product.priceOptions.length > 0 ? Math.min(...product.priceOptions.map(p => p.price)) : 0;
                return (
                  <tr key={product.id} className="hover:bg-emerald-50/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img src={product.thumbnailUrl} alt="" className="w-10 h-10 rounded object-cover bg-gray-200 border border-gray-200" />
                        <div>
                          <div className="font-medium text-gray-900">{product.name}</div>
                          <div className="text-xs text-gray-500">{product.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-600">{category?.name || 'Chưa phân loại'}</td>
                    <td className="p-4 text-sm font-medium">{minPrice > 0 ? new Intl.NumberFormat('vi-VN').format(minPrice) + 'k' : '0k'}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${product.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                        {product.status === 'published' ? 'Đang hiện' : 'Nháp/Ẩn'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => setEditingProduct(product)} className="p-2 text-emerald-600 hover:bg-emerald-50 rounded"><Edit size={18}/></button>
                        <button onClick={() => handleDelete(product.id)} className="p-2 text-red-600 hover:bg-red-50 rounded"><Trash2 size={18}/></button>
                      </div>
                    </td>
                  </tr>
                );
             })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Products;