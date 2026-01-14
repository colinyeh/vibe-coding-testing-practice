import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { RoleBasedRoute } from './components/RoleBasedRoute';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { AdminPage } from './pages/AdminPage';
import { DevPanel } from './components/DevPanel';
import './App.css';

const App: React.FC = () => {
  // 沒有設定 API URL 時顯示 DevPanel（使用 MSW 模式）
  const showDevPanel = !import.meta.env.VITE_API_URL;

  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AuthProvider>
        {showDevPanel && (
          <div className="mock-mode-banner">
            🔧 Mock 模式 - API 請求由 MSW 模擬處理，非真實資料
          </div>
        )}
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <RoleBasedRoute allowedRoles={['admin']}>
                  <AdminPage />
                </RoleBasedRoute>
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
        {showDevPanel && <DevPanel />}
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
