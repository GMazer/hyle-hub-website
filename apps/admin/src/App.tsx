import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import AdminLayout from './components/AdminLayout';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Categories from './pages/Categories';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuth = localStorage.getItem('isAuthenticated') === 'true';
  if (!isAuth) return <Navigate to="/admin/login" replace />;
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        {/* Redirect root to Login */}
        <Route path="/" element={<Navigate to="/admin/login" replace />} />
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="categories" element={<Categories />} />
          <Route path="products" element={<Products />} />
        </Route>
        <Route path="*" element={<Navigate to="/admin/login" replace />} />
      </Routes>
    </HashRouter>
  );
};

export default App;