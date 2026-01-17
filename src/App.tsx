import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        {/* Public Visitor Route */}
        <Route path="/" element={<LandingPage />} />

        {/* Fallback - Redirect unknown routes to Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
};

export default App;