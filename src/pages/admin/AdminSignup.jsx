import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import { supabase } from '../../lib/supabase';
import logoLight from '../../assets/logo_light.png';
import { UserPlus, Eye, EyeOff, CheckCircle, Loader2 } from 'lucide-react';

const AdminSignup = () => {
    const { user, isAdmin, isLoading } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ full_name: '', email: '', password: '', confirm: '' });

    useEffect(() => {
        if (!isLoading && user) {
            navigate(isAdmin ? '/admin' : '/', { replace: true });
        }
    }, [user, isAdmin, isLoading, navigate]);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (form.password !== form.confirm) {
            setError('Passwords do not match.');
            return;
        }
        if (form.password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }

        setLoading(true);
        try {
            const { error: signUpError } = await supabase.auth.signUp({
                email: form.email,
                password: form.password,
                options: {
                    data: { full_name: form.full_name },
                },
            });

            if (signUpError) {
                setError(signUpError.message);
            } else {
                setSuccess(true);
            }
        } catch (err) {
            console.error('Signup error:', err);
            setError('An unexpected error occurred during registration.');
        } finally {
            setLoading(false);
        }
    };

    const containerStyle = {
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '2rem', fontFamily: 'var(--font-body)',
    };

    const cardStyle = {
        width: '100%', maxWidth: '420px',
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '16px', padding: '2.5rem',
        backdropFilter: 'blur(12px)',
    };

    const inputStyle = {
        width: '100%',
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: '8px',
        padding: '0.75rem 1rem',
        color: '#fff',
        fontSize: '0.95rem',
        outline: 'none',
        boxSizing: 'border-box',
    };

    if (success) {
        return (
            <div style={containerStyle}>
                <div style={{ ...cardStyle, textAlign: 'center' }}>
                    <div style={{
                        width: '64px', height: '64px', borderRadius: '50%',
                        background: 'rgba(34,197,94,0.15)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 1.5rem',
                    }}>
                        <CheckCircle size={32} color="#4ade80" />
                    </div>
                    <h2 style={{ color: '#fff', fontSize: '1.4rem', fontWeight: '700', marginBottom: '0.75rem' }}>
                        Account Created!
                    </h2>
                    <p style={{ color: '#888', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '2rem' }}>
                        Your account has been created successfully. A superadmin will need to upgrade your role before you can access the dashboard.
                    </p>
                    <Link
                        to="/admin/login"
                        style={{
                            display: 'inline-block',
                            background: 'var(--color-accent, #e8b86d)',
                            color: '#000', fontWeight: '700',
                            padding: '0.75rem 2rem', borderRadius: '8px',
                            textDecoration: 'none', fontSize: '0.9rem',
                        }}
                    >
                        Back to Login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div style={containerStyle}>
            <div style={cardStyle}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <img src={logoLight} alt="LoudKitchen" style={{ height: '48px', margin: '0 auto 1rem' }} />
                    <p style={{ color: '#888', fontSize: '0.9rem' }}>Staff Registration</p>
                </div>

                {error && (
                    <div style={{
                        background: 'rgba(239,68,68,0.15)',
                        border: '1px solid rgba(239,68,68,0.3)',
                        borderRadius: '8px', padding: '0.75rem 1rem',
                        color: '#f87171', fontSize: '0.875rem', marginBottom: '1.5rem',
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                    <div>
                        <label style={{ display: 'block', color: '#aaa', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                            Full Name
                        </label>
                        <input
                            type="text"
                            value={form.full_name}
                            onChange={set('full_name')}
                            required
                            placeholder="Jane Smith"
                            style={inputStyle}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', color: '#aaa', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={form.email}
                            onChange={set('email')}
                            required
                            placeholder="jane@loudkitchen.com"
                            style={inputStyle}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', color: '#aaa', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                            Password
                        </label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={form.password}
                                onChange={set('password')}
                                required
                                placeholder="Min. 6 characters"
                                style={{ ...inputStyle, paddingRight: '2.75rem' }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(v => !v)}
                                style={{
                                    position: 'absolute', right: '0.75rem', top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none', border: 'none', color: '#888', cursor: 'pointer',
                                }}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', color: '#aaa', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                            Confirm Password
                        </label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={form.confirm}
                            onChange={set('confirm')}
                            required
                            placeholder="Repeat password"
                            style={inputStyle}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                            background: 'var(--color-accent, #e8b86d)',
                            color: '#000', fontWeight: '700', fontSize: '1rem',
                            padding: '0.85rem', borderRadius: '8px', border: 'none',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            opacity: loading ? 0.7 : 1, transition: 'all 0.2s', marginTop: '0.5rem',
                        }}
                    >
                        {loading ? <Loader2 className="animate-spin" size={18} /> : <UserPlus size={18} />}
                        {loading ? 'Creating account…' : 'Create Account'}
                    </button>
                </form>

                <p style={{ textAlign: 'center', color: '#555', fontSize: '0.85rem', marginTop: '1.5rem' }}>
                    Already have an account?{' '}
                    <Link to="/admin/login" style={{ color: 'var(--color-accent, #e8b86d)', textDecoration: 'none' }}>
                        Sign in
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

export default AdminSignup;
