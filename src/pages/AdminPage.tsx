import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const AdminPage: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login', { replace: true, state: null });
    };

    return (
        <div className="admin-page">
            <header className="dashboard-header">
                <div className="header-content">
                    <div className="header-title">
                        <Link to="/dashboard" className="back-link">← 返回</Link>
                        <h1>🛠️ 管理後台</h1>
                    </div>
                    <nav className="header-nav">
                        <span className={`role-badge ${user?.role}`}>
                            {user?.role === 'admin' ? '管理員' : '一般用戶'}
                        </span>
                        <button onClick={handleLogout} className="logout-button">
                            登出
                        </button>
                    </nav>
                </div>
            </header>

            <main className="admin-main">
                <section className="admin-section">
                    <div className="admin-info-card">
                        <div className="admin-icon">🔒</div>
                        <h2>管理員專屬頁面</h2>
                        <div className="admin-features">
                            <div className="feature-item">
                                <span className="feature-icon">✅</span>
                                <span>只有 admin 角色可以訪問</span>
                            </div>
                            <div className="feature-item">
                                <span className="feature-icon">🚫</span>
                                <span>user 角色會被重定向</span>
                            </div>
                            <div className="feature-item">
                                <span className="feature-icon">🔐</span>
                                <span>受路由守衛保護</span>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};
