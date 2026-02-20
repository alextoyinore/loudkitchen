import { useContext } from 'react';
import { AuthContext, AUTH_STATUS } from '../constants/auth';

export { AUTH_STATUS };

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}
