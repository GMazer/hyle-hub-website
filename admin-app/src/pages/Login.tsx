import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminApi, API_URL } from '../../services/api'; // Corrected import path
import { AlertTriangle } from 'lucide-react';

const Login: React.FC = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const isValid = await adminApi.login(password);
      if (isValid) {
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('adminPassword', password);
        navigate('/admin');
      } else {
        setError('Mật khẩu không đúng.');
      }
    } catch (e) {
      console.error(e);
      setError('Lỗi kết nối Server! Vui lòng kiểm tra API URL.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 transition-colors p-4">
      <div className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center text-emerald-600 dark:text-emerald-400">Admin Portal</h2>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Mật khẩu</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="mt-1 w-full p-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 cursor-text" 
              placeholder="Nhập mật khẩu..." 
            />
          </div>
          
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded p-3 text-sm text-red-600 dark:text-red-400">
               <p className="font-bold">{error}</p>
               <p className="mt-1 text-xs opacity-80 break-all">API: {API_URL}</p>
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-emerald-600 text-white py-2 rounded hover:bg-emerald-700 font-medium transition-colors disabled:opacity-50"
          >
            {loading ? 'Đang kết nối...' : 'Đăng nhập'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
           <div className="flex items-start gap-2 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-3 rounded">
              <AlertTriangle size={16} className="shrink-0 text-amber-500" />
              <div>
                <strong>Lưu ý cấu hình:</strong><br/>
                Nếu lỗi kết nối, hãy vào <a href="https://app.netlify.com" target="_blank" className="underline hover:text-emerald-500">Netlify</a> &gt; Site settings &gt; Environment variables.<br/>
                Thêm key: <code>VITE_API_URL</code><br/>
                Value: Link backend Render của bạn.
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Login;