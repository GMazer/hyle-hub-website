
import React, { useEffect, useState, useRef } from 'react';
import { adminApi } from '../services/api';
import { Product, Category } from '../types';
import { Plus, Edit, Trash2, Search, Upload, Download, FileText, FileSpreadsheet } from 'lucide-react';
import ProductForm from '../components/ProductForm';
import { generateSampleCSV, parseProductCSV, exportProductsToCSV } from '../utils/csvHelper';

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null | undefined>(undefined);
  const [search, setSearch] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleDownloadSample = () => {
    const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent(generateSampleCSV());
    const link = document.createElement("a");
    link.setAttribute("href", csvContent);
    link.setAttribute("download", "mau_san_pham.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExport = () => {
      // Export filtered products if search is active, otherwise all
      const productsToExport = filteredProducts.length > 0 ? filteredProducts : products;
      if (productsToExport.length === 0) {
          alert("Không có sản phẩm nào để xuất.");
          return;
      }
      exportProductsToCSV(productsToExport);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      const text = evt.target?.result as string;
      if (!text) return;

      try {
        const parsedProducts = parseProductCSV(text);
        if (parsedProducts.length === 0) {
          alert('Không tìm thấy dữ liệu hợp lệ trong file CSV.');
          return;
        }

        const confirmMsg = `Tìm thấy ${parsedProducts.length} sản phẩm. Bạn có muốn nhập không?\nLưu ý: ID Danh mục (Category ID) phải khớp với hệ thống.`;
        if (window.confirm(confirmMsg)) {
          const res = await adminApi.bulkCreateProducts(parsedProducts);
          alert(`Đã nhập thành công ${res.count} sản phẩm!`);
          loadData();
        }
      } catch (err) {
        console.error(err);
        alert('Có lỗi xảy ra khi nhập file.');
      } finally {
        // Reset input
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsText(file);
  };

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  if (editingProduct !== undefined) {
    return <ProductForm product={editingProduct} categories={categories} onSave={handleSaveComplete} onCancel={() => setEditingProduct(undefined)} />;
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-emerald-100 dark:border-gray-800 transition-colors">
      <div className="p-6 border-b border-emerald-100 dark:border-gray-800 flex flex-col xl:flex-row justify-between items-center gap-4">
        <h1 className="text-xl font-bold text-emerald-800 dark:text-emerald-400">Danh sách sản phẩm</h1>
        <div className="flex flex-col sm:flex-row gap-2 w-full xl:w-auto">
          {/* Search Box */}
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-2 top-2.5 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Tìm kiếm..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              className="w-full pl-9 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500 cursor-text" 
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 flex-wrap sm:flex-nowrap">
            <button 
              onClick={handleExport}
              className="flex items-center gap-2 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-2 rounded hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors text-sm font-medium border border-green-200 dark:border-green-800"
              title="Xuất ra file Excel"
            >
              <FileSpreadsheet size={16} /> Xuất Excel
            </button>

            <button 
              onClick={handleDownloadSample}
              className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-3 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm font-medium border border-gray-200 dark:border-gray-700"
              title="Tải file mẫu CSV để nhập liệu"
            >
              <Download size={16} /> Mẫu nhập
            </button>
            
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-3 py-2 rounded hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors text-sm font-medium border border-blue-100 dark:border-blue-800"
              title="Nhập sản phẩm từ file CSV"
            >
              <Upload size={16} /> Nhập CSV
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
              accept=".csv" 
              hidden 
            />

            <button onClick={() => setEditingProduct(null)} className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700 transition-colors text-sm font-medium whitespace-nowrap">
              <Plus size={18} /> Thêm mới
            </button>
          </div>
        </div>
      </div>
      
      {/* Category Hint for CSV */}
      <div className="px-6 py-2 bg-gray-50 dark:bg-gray-800/50 text-xs text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800 flex gap-4 overflow-x-auto">
         <span className="font-bold shrink-0 flex items-center gap-1"><FileText size={12}/> ID Danh mục (Dùng cho CSV):</span>
         {categories.map(c => (
           <span key={c.id} className="whitespace-nowrap"><strong className="text-gray-700 dark:text-gray-300">{c.name}:</strong> {c.id}</span>
         ))}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-emerald-50 dark:bg-gray-800 text-emerald-700 dark:text-emerald-400 text-sm uppercase">
            <tr>
              <th className="p-4 font-semibold">Sản phẩm</th>
              <th className="p-4 font-semibold">Danh mục</th>
              <th className="p-4 font-semibold">Giá</th>
              <th className="p-4 font-semibold">Trạng thái</th>
              <th className="p-4 text-right font-semibold">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-gray-900 dark:text-gray-300">
            {loading ? <tr><td colSpan={5} className="p-8 text-center text-gray-500 dark:text-gray-400">Đang tải...</td></tr> : 
             filteredProducts.length === 0 ? <tr><td colSpan={5} className="p-8 text-center text-gray-500 dark:text-gray-400">Không tìm thấy sản phẩm.</td></tr> :
             filteredProducts.map(product => {
                const category = categories.find(c => c.id === product.categoryId);
                const minPrice = product.priceOptions.length > 0 ? Math.min(...product.priceOptions.map(p => p.price)) : 0;
                return (
                  <tr key={product.id} className="hover:bg-emerald-50/50 dark:hover:bg-gray-800 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img src={product.thumbnailUrl} alt="" className="w-10 h-10 rounded object-cover bg-gray-200 dark:bg-gray-700 border border-gray-200 dark:border-gray-700" />
                        <div>
                          <div className="font-medium text-gray-900 dark:text-gray-100">{product.name}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{product.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-600 dark:text-gray-400">{category?.name || <span className="text-red-400" title={`ID: ${product.categoryId}`}>Sai ID ({product.categoryId})</span>}</td>
                    <td className="p-4 text-sm font-medium">{minPrice > 0 ? new Intl.NumberFormat('vi-VN').format(minPrice) + 'K' : '0K'}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                        product.status === 'published' 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                      }`}>
                        {product.status === 'published' ? 'Đang hiện' : 'Nháp/Ẩn'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => setEditingProduct(product)} className="p-2 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-gray-700 rounded transition-colors"><Edit size={18}/></button>
                        <button onClick={() => handleDelete(product.id)} className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-gray-700 rounded transition-colors"><Trash2 size={18}/></button>
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
