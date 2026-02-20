import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

const ProtectedRoute = ({ children, superAdminOnly = false }) => {
    const { user, isAdmin, isSuperAdmin, isLoading, status } = useAuth();

    // If we have a user and they are an admin, let them through immediately.
    // We only block with "Verifying access..." if we are in the INITIALIZING phase with no cached role.
    if (user && isAdmin) {
        if (superAdminOnly && !isSuperAdmin) {
            return <Navigate to="/admin" replace />;
        }
        return children;
    }

    // Only show loading if we are definitely checking for the first time
    if (isLoading && status !== 'AUTHENTICATED') {
        return (
            <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                height: '100vh', background: '#0a0a0a', color: '#fff', fontSize: '1.2rem',
                fontFamily: 'Inter, sans-serif'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{
                        width: '40px', height: '40px', border: '3px solid rgba(255,255,255,0.1)',
                        borderTopColor: '#e8b86d', borderRadius: '50%', animation: 'spin 1s linear infinite',
                        margin: '0 auto 1rem'
                    }} />
                    <p style={{ color: '#888', fontSize: '0.9rem' }}>Verifying access...</p>
                    <style>{`
                        @keyframes spin { to { transform: rotate(360deg); } }
                    `}</style>
                </div>
            </div>
        );
    }

    if (!user || !isAdmin) {
        return <Navigate to="/admin/login" replace />;
    }

    if (superAdminOnly && !isSuperAdmin) {
        return <Navigate to="/admin" replace />;
    }

    return children;
};

export default ProtectedRoute;
