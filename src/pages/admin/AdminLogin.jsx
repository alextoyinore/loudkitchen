import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import logoLight from '../../assets/logo_light.png';
import { LogIn, Eye, EyeOff, Loader2 } from 'lucide-react';

const AdminLogin = () => {
    const { signIn, profile, user, isLoading, isAdmin, signOut, status } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (user) {
            if (isAdmin) {
                navigate('/admin', { replace: true });
            } else if (status === 'AUTHENTICATED') {
                // Only redirect to home if we are 100% sure it's a non-admin account
                navigate('/', { replace: true });
            }
        }
    }, [user, isAdmin, isLoading, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);

        try {
            await signIn(email, password);
            // Redirection is handled by the useEffect above
        } catch (err) {
            console.error('Login error:', err);
            setError(err.message || 'Invalid email or password.');
            setSubmitting(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            fontFamily: 'var(--font-body)',
        }}>
            <div style={{
                width: '100%',
                maxWidth: '420px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '16px',
                padding: '2.5rem',
                backdropFilter: 'blur(12px)',
            }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <img src={logoLight} alt="LoudKitchen" style={{ height: '48px', margin: '0 auto 1rem' }} />
                    <p style={{ color: '#888', fontSize: '0.9rem' }}>Admin Portal</p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div>
                        <label style={{ display: 'block', color: '#aaa', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            placeholder="admin@loudkitchen.com"
                            style={{
                                width: '100%',
                                background: 'rgba(255,255,255,0.06)',
                                border: '1px solid rgba(255,255,255,0.12)',
                                borderRadius: '8px',
                                padding: '0.75rem 1rem',
                                color: '#fff',
                                fontSize: '0.95rem',
                                outline: 'none',
                                boxSizing: 'border-box',
                            }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', color: '#aaa', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                            Password
                        </label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                                placeholder="••••••••"
                                style={{
                                    width: '100%',
                                    background: 'rgba(255,255,255,0.06)',
                                    border: '1px solid rgba(255,255,255,0.12)',
                                    borderRadius: '8px',
                                    padding: '0.75rem 2.75rem 0.75rem 1rem',
                                    color: '#fff',
                                    fontSize: '0.95rem',
                                    outline: 'none',
                                    boxSizing: 'border-box',
                                }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(v => !v)}
                                style={{
                                    position: 'absolute', right: '0.75rem', top: '35%',
                                    transform: 'translateY(-50%)',
                                    background: 'none', border: 'none', color: '#888', cursor: 'pointer',
                                }}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={submitting || isLoading}
                        style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                            background: 'var(--color-accent, #e8b86d)',
                            color: '#000',
                            fontWeight: '700',
                            fontSize: '1rem',
                            padding: '0.85rem',
                            borderRadius: '8px',
                            border: 'none',
                            cursor: (submitting || isLoading) ? 'not-allowed' : 'pointer',
                            opacity: (submitting || isLoading) ? 0.7 : 1,
                            transition: 'all 0.2s',
                            marginTop: '0.5rem',
                        }}
                    >
                        {submitting ? <Loader2 className="animate-spin" size={18} /> : <LogIn size={18} />}
                        {submitting ? 'Authenticating...' : 'Sign In'}
                    </button>
                </form>

                {user && (
                    <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.08)', textAlign: 'center' }}>
                        <p style={{ color: '#888', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                            Currently signed in as <span style={{ color: '#fff' }}>{user.email}</span>
                        </p>
                        <button
                            onClick={signOut}
                            style={{
                                background: 'transparent',
                                border: '1px solid rgba(255,255,255,0.2)',
                                color: '#aaa',
                                padding: '0.5rem 1rem',
                                borderRadius: '6px',
                                fontSize: '0.8rem',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                            }}
                        >
                            Log Out to Switch Account
                        </button>
                    </div>
                )}

                <p style={{ textAlign: 'center', color: '#555', fontSize: '0.85rem', marginTop: '1.5rem' }}>
                    Staff member?{' '}
                    <Link to="/admin/signup" style={{ color: 'var(--color-accent, #e8b86d)', textDecoration: 'none' }}>
                        Create account
                    </Link>
                </p>
            </div>
            <style>{`
                .animate-spin { animation: spin 1s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
};

export default AdminLogin;
