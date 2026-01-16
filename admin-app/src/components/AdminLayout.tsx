import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutGrid, Package, LogOut, ExternalLink } from 'lucide-react';

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  const navItems = [
    { path: '/', icon: LayoutGrid, label: 'Tổng quan' },
    { path: '/products', icon: Package, label: 'Sản phẩm' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex text-gray-900">
      <aside className="w-64 bg-white border-r border-emerald-100 hidden md:flex flex-col fixed inset-y-0">
        <div className="p-6 border-b border-emerald-100">
          <h2 className="text-2xl font-bold text-emerald-600">HyleHub CMS</h2>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
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
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg">
            <LogOut size={16} /> Đăng xuất
          </button>
        </div>
      </aside>
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