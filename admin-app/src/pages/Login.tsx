import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
// Lưu ý: Admin App dùng service tại ../services/api
// URL API được lấy từ biến môi trường trong file service đó
const API_URL = (import.meta as any).env?.VITE_API_URL || 'https://hyle-hub-website.onrender.com';

const Login: React.FC = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Hardcode check for Phase 1 as per requirements or calling an auth endpoint
    // Here we simulate the check or call the real backend if implemented
    try {
        const res = await fetch(`${API_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password })
        });
        
        if (res.ok) {
            localStorage.setItem('isAuthenticated', 'true');
            // Store password to send in headers for subsequent requests
            // In a real app, use a JWT token
            localStorage.setItem('adminPassword', password); 
            navigate('/admin');
        } else {
            setError('Mật khẩu không đúng.');
        }
    } catch (e) {
        console.error(e);
        // Fallback for demo/local if backend is not reachable or configured differently
        if (password === 'admin123') {
             localStorage.setItem('isAuthenticated', 'true');
             localStorage.setItem('adminPassword', password);
             navigate('/admin');
        } else {
             setError('Lỗi kết nối hoặc sai mật khẩu.');
        }
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 transition-colors p-4">
      <div className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center text-emerald-600 dark:text-emerald-400">HyleHub Admin</h2>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Mật khẩu quản trị</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="mt-1 w-full p-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500" 
              placeholder="Nhập mật khẩu..." 
            />
          </div>
          
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded p-3 text-sm text-red-600 dark:text-red-400">
               {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-emerald-600 text-white py-2 rounded hover:bg-emerald-700 font-medium transition-colors disabled:opacity-50"
          >
            {loading ? 'Đang kiểm tra...' : 'Đăng nhập'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
           <div className="flex items-start gap-2 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-3 rounded">
              <AlertTriangle size={16} className="shrink-0 text-amber-500" />
              <div>
                <strong>Ghi chú:</strong> Mật khẩu mặc định backend là <code>admin123</code> (nếu chưa đổi).
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Login;