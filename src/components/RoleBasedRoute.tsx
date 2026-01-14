import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface RoleBasedRouteProps {
    children: React.ReactNode;
    allowedRoles: string[];
}

export const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({ children, allowedRoles }) => {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner" />
                <p>驗證權限中...</p>
            </div>
        );
    }

    if (!user || !allowedRoles.includes(user.role)) {
        return <Navigate to="/dashboard" replace />;
    }

    return <>{children}</>;
};
