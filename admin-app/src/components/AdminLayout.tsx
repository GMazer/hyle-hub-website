import React, { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutGrid, Package, LogOut, Moon, Sun, List } from 'lucide-react';

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('theme') === 'dark' || document.documentElement.classList.contains('dark');
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/admin/login');
  };

  const navItems = [
    { path: '/admin', icon: LayoutGrid, label: 'Tổng quan', end: true },
    { path: '/admin/categories', icon: List, label: 'Danh mục' },
    { path: '/admin/products', icon: Package, label: 'Sản phẩm' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex text-gray-900 dark:text-gray-100 transition-colors duration-200 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-900 border-r border-emerald-100 dark:border-gray-800 hidden md:flex flex-col fixed inset-y-0 transition-colors duration-200">
        <div className="p-6 border-b border-emerald-100 dark:border-gray-800 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">HyleHub CMS</h2>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-medium' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`
              }
            >
              <item.icon size={20} />
              {item.label}
            </NavLink>
          ))}
        </nav>
        
        <div className="p-4 border-t border-emerald-100 dark:border-gray-800 space-y-2">
          <button 
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
            {isDark ? 'Chế độ Sáng' : 'Chế độ Tối'}
          </button>
          
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
            <LogOut size={16} /> Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="md:ml-64 flex-1 flex flex-col min-h-screen">
        <header className="bg-white dark:bg-gray-900 shadow-sm md:hidden flex items-center justify-between p-4 border-b border-emerald-100 dark:border-gray-800">
          <span className="font-bold text-emerald-800 dark:text-emerald-400">HyleHub CMS</span>
          <div className="flex items-center gap-2">
            <button onClick={toggleTheme} className="p-2 text-gray-500 dark:text-gray-400">
               {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button onClick={handleLogout} className="text-gray-500 dark:text-gray-400"><LogOut size={20}/></button>
          </div>
        </header>
        <main className="flex-1 p-6 md:p-8 overflow-y-auto bg-gray-50 dark:bg-gray-950 transition-colors duration-200">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;