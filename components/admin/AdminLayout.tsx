import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutGrid, Package, Settings, LogOut, ExternalLink } from 'lucide-react';

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // In a real app, clear tokens here
    localStorage.removeItem('isAuthenticated');
    navigate('/');
  };

  const navItems = [
    { path: '/admin', icon: LayoutGrid, label: 'Tổng quan' },
    { path: '/admin/products', icon: Package, label: 'Sản phẩm' },
    // Categories would go here in a full implementation, merging into Products or Dashboard for brevity
  ];

  return (
    // Explicitly set bg-gray-50 to be opaque over the dark body
    <div className="min-h-screen bg-gray-50 flex text-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-emerald-100 hidden md:flex flex-col fixed inset-y-0">
        <div className="p-6 border-b border-emerald-100">
          <h2 className="text-2xl font-bold text-emerald-600">HyleHub CMS</h2>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/admin'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive ? 'bg-emerald-50 text-emerald-700 font-medium' : 'text-gray-600 hover:bg-gray-50'
                }`
              }
            >
              <item.icon size={20} />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-emerald-100 space-y-2">
          <a href="/#/" target="_blank" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-500 hover:text-emerald-600">
             <ExternalLink size={16} /> Xem trang chủ
          </a>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg">
            <LogOut size={16} /> Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="md:ml-64 flex-1 flex flex-col min-h-screen">
        <header className="bg-white shadow-sm md:hidden flex items-center justify-between p-4 border-b border-emerald-100">
          <span className="font-bold text-emerald-800">HyleHub CMS</span>
          <button onClick={handleLogout} className="text-gray-500"><LogOut size={20}/></button>
        </header>
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;