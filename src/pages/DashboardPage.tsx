import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { productApi, type Product } from '../api/productApi';
import { AxiosError } from 'axios';

export const DashboardPage: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await productApi.getProducts();
                setProducts(data);
                setError(null);
            } catch (err) {
                const axiosError = err as AxiosError<{ message: string }>;
                if (axiosError.response?.status === 401) {
                    // Token expired or invalid - handled by axios interceptor
                    return;
                }
                setError(axiosError.response?.data?.message || '無法載入商品資料');
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login', { replace: true, state: null });
    };

    return (
        <div className="dashboard-page">
            <header className="dashboard-header">
                <div className="header-content">
                    <h1>儀表板</h1>
                    <nav className="header-nav">
                        {user?.role === 'admin' && (
                            <Link to="/admin" className="nav-link admin-link">
                                🛠️ 管理後台
                            </Link>
                        )}
                        <button onClick={handleLogout} className="logout-button">
                            登出
                        </button>
                    </nav>
                </div>
            </header>

            <main className="dashboard-main">
                <section className="welcome-section">
                    <div className="welcome-card">
                        <div className="avatar">
                            {user?.username?.charAt(0).toUpperCase() || '?'}
                        </div>
                        <div className="welcome-text">
                            <h2>Welcome, {user?.username || 'User'} 👋</h2>
                            <span className={`role-badge ${user?.role}`}>
                                {user?.role === 'admin' ? '管理員' : '一般用戶'}
                            </span>
                        </div>
                    </div>
                </section>

                <section className="products-section">
                    <h3>商品列表</h3>

                    {isLoading ? (
                        <div className="loading-container">
                            <div className="loading-spinner" />
                            <p>載入商品中...</p>
                        </div>
                    ) : error ? (
                        <div className="error-container">
                            <span className="error-icon">⚠️</span>
                            <p>{error}</p>
                        </div>
                    ) : (
                        <div className="products-grid">
                            {products.map((product) => (
                                <div key={product.id} className="product-card">
                                    <div className="product-image">
                                        <span className="product-emoji">📦</span>
                                    </div>
                                    <div className="product-info">
                                        <h4>{product.name}</h4>
                                        <p className="product-description">{product.description}</p>
                                        <p className="product-price">NT$ {product.price.toLocaleString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
};
