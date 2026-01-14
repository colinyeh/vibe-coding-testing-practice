import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SCENARIO_KEYS } from '../mocks/handlers';
import { TOKEN_KEY } from '../api/axiosInstance';

type LoginScenario = 'success' | 'invalid_password' | 'email_not_found' | 'server_error';
type MeScenario = 'success' | 'token_expired' | 'server_error';
type ProductsScenario = 'success' | 'server_error';
type UserRole = 'admin' | 'user';
type DelayValue = '0' | '500' | '1000';

export const DevPanel: React.FC = () => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [loginScenario, setLoginScenario] = useState<LoginScenario>('success');
    const [meScenario, setMeScenario] = useState<MeScenario>('success');
    const [productsScenario, setProductsScenario] = useState<ProductsScenario>('success');
    const [userRole, setUserRole] = useState<UserRole>('admin');
    const [delay, setDelay] = useState<DelayValue>('0');

    // Load initial values from localStorage
    useEffect(() => {
        setLoginScenario((localStorage.getItem(SCENARIO_KEYS.login) as LoginScenario) || 'success');
        setMeScenario((localStorage.getItem(SCENARIO_KEYS.me) as MeScenario) || 'success');
        setProductsScenario((localStorage.getItem(SCENARIO_KEYS.products) as ProductsScenario) || 'success');
        setUserRole((localStorage.getItem(SCENARIO_KEYS.userRole) as UserRole) || 'admin');
        setDelay((localStorage.getItem(SCENARIO_KEYS.delay) as DelayValue) || '0');
    }, []);

    const handleLoginScenarioChange = (value: LoginScenario) => {
        setLoginScenario(value);
        localStorage.setItem(SCENARIO_KEYS.login, value);
    };

    const handleMeScenarioChange = (value: MeScenario) => {
        setMeScenario(value);
        localStorage.setItem(SCENARIO_KEYS.me, value);
    };

    const handleProductsScenarioChange = (value: ProductsScenario) => {
        setProductsScenario(value);
        localStorage.setItem(SCENARIO_KEYS.products, value);
    };

    const handleUserRoleChange = (value: UserRole) => {
        setUserRole(value);
        localStorage.setItem(SCENARIO_KEYS.userRole, value);
    };

    const handleDelayChange = (value: DelayValue) => {
        setDelay(value);
        localStorage.setItem(SCENARIO_KEYS.delay, value);
    };

    const handleClearToken = () => {
        localStorage.removeItem(TOKEN_KEY);
        navigate('/login');
    };

    const handleResetScenarios = () => {
        handleLoginScenarioChange('success');
        handleMeScenarioChange('success');
        handleProductsScenarioChange('success');
        handleUserRoleChange('admin');
        handleDelayChange('0');
    };

    if (!isOpen) {
        return (
            <button
                className="dev-panel-toggle"
                onClick={() => setIsOpen(true)}
                title="開啟測試面板"
            >
                🧪
            </button>
        );
    }

    return (
        <div className="dev-panel">
            <div className="dev-panel-header">
                <h3>🧪 測試面板</h3>
                <button onClick={() => setIsOpen(false)} className="close-btn">✕</button>
            </div>

            <div className="dev-panel-content">
                {/* Login Scenario */}
                <div className="scenario-group">
                    <label>POST /api/login</label>
                    <select
                        value={loginScenario}
                        onChange={(e) => handleLoginScenarioChange(e.target.value as LoginScenario)}
                    >
                        <option value="success">✅ success</option>
                        <option value="invalid_password">❌ invalid_password</option>
                        <option value="email_not_found">❌ email_not_found</option>
                        <option value="server_error">🔥 server_error</option>
                    </select>
                </div>

                {/* Me Scenario */}
                <div className="scenario-group">
                    <label>GET /api/me</label>
                    <select
                        value={meScenario}
                        onChange={(e) => handleMeScenarioChange(e.target.value as MeScenario)}
                    >
                        <option value="success">✅ success</option>
                        <option value="token_expired">⏰ token_expired</option>
                        <option value="server_error">🔥 server_error</option>
                    </select>
                </div>

                {/* Products Scenario */}
                <div className="scenario-group">
                    <label>GET /api/products</label>
                    <select
                        value={productsScenario}
                        onChange={(e) => handleProductsScenarioChange(e.target.value as ProductsScenario)}
                    >
                        <option value="success">✅ success</option>
                        <option value="server_error">🔥 server_error</option>
                    </select>
                </div>

                {/* User Role */}
                <div className="scenario-group">
                    <label>User Role</label>
                    <select
                        value={userRole}
                        onChange={(e) => handleUserRoleChange(e.target.value as UserRole)}
                    >
                        <option value="admin">👑 admin</option>
                        <option value="user">👤 user</option>
                    </select>
                </div>

                {/* Delay */}
                <div className="scenario-group">
                    <label>API 延遲</label>
                    <select
                        value={delay}
                        onChange={(e) => handleDelayChange(e.target.value as DelayValue)}
                    >
                        <option value="0">0ms (無延遲)</option>
                        <option value="500">500ms</option>
                        <option value="1000">1000ms</option>
                    </select>
                </div>

                {/* Actions */}
                <div className="dev-panel-actions">
                    <button onClick={handleClearToken} className="danger-btn">
                        🗑️ 清除 Token
                    </button>
                    <button onClick={handleResetScenarios} className="secondary-btn">
                        🔄 重置所有情境
                    </button>
                </div>

                <div className="dev-panel-info">
                    <p>💡 切換情境後，重新觸發對應 API 即可套用</p>
                </div>
            </div>
        </div>
    );
};
