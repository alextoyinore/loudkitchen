import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/useAuth';
import { Shield, RefreshCw } from 'lucide-react';
import useIsMobile from '../../hooks/useIsMobile';

const ROLES = ['user', 'staff', 'admin', 'superadmin'];

const roleColor = (role) => {
    const map = {
        superadmin: { bg: 'rgba(168,85,247,0.15)', color: '#c084fc' },
        admin: { bg: 'rgba(232,184,109,0.15)', color: '#e8b86d' },
        staff: { bg: 'rgba(34,197,94,0.15)', color: '#4ade80' },
        user: { bg: 'rgba(255,255,255,0.07)', color: '#888' },
    };
    return map[role] || map.user;
};

const UsersManager = () => {
    const { profile: currentProfile } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(null);
    const [search, setSearch] = useState('');
    const isMobile = useIsMobile();

    const fetchUsers = async () => {
        const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
        setUsers(data || []);
        setLoading(false);
    };

    useEffect(() => { fetchUsers(); }, []);

    const updateRole = async (userId, newRole) => {
        if (userId === currentProfile?.id) return;
        setUpdating(userId);
        await supabase.from('profiles').update({ role: newRole }).eq('id', userId);
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
        setUpdating(null);
    };

    const filtered = users.filter(u =>
        !search ||
        u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase())
    );

    const inputStyle = { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '0.6rem 0.85rem', color: '#fff', fontSize: '0.875rem', outline: 'none' };

    return (
        <div>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <div>
                    <h1 style={{ fontSize: isMobile ? '1.3rem' : '1.5rem', fontWeight: '700', color: '#fff' }}>Users</h1>
                    <p style={{ color: '#666', fontSize: '0.875rem', marginTop: '0.2rem' }}>{users.length} registered · manage roles</p>
                </div>
                <button onClick={fetchUsers} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '0.6rem', color: '#aaa', cursor: 'pointer' }}>
                    <RefreshCw size={15} />
                    {!isMobile && <span style={{ fontSize: '0.875rem' }}>Refresh</span>}
                </button>
            </div>

            {/* Search */}
            <div style={{ marginBottom: '1.25rem' }}>
                <input style={{ ...inputStyle, width: '100%', boxSizing: 'border-box' }} placeholder="Search name or email…" value={search} onChange={e => setSearch(e.target.value)} />
            </div>

            {/* Content */}
            {loading ? (
                <div style={{ padding: '3rem', textAlign: 'center', color: '#555' }}>Loading…</div>
            ) : filtered.length === 0 ? (
                <div style={{ padding: '3rem', textAlign: 'center', color: '#555' }}>No users found.</div>
            ) : isMobile ? (
                // ── Mobile card list ──
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    {filtered.map(user => {
                        const isSelf = user.id === currentProfile?.id;
                        const rc = roleColor(user.role);
                        return (
                            <div key={user.id} style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '1rem' }}>
                                {/* Row 1: avatar + name + email */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.65rem' }}>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: rc.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: rc.color, fontWeight: '700', fontSize: '0.95rem', flexShrink: 0 }}>
                                        {(user.full_name || user.email || '?')[0].toUpperCase()}
                                    </div>
                                    <div style={{ minWidth: 0 }}>
                                        <p style={{ color: '#fff', fontWeight: '600', fontSize: '0.875rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {user.full_name || '(no name)'}
                                            {isSelf && <span style={{ color: '#555', fontSize: '0.72rem', fontWeight: '400', marginLeft: '0.35rem' }}>(you)</span>}
                                        </p>
                                        <p style={{ color: '#666', fontSize: '0.75rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</p>
                                    </div>
                                </div>
                                {/* Row 2: role control — full width so name isn't squeezed */}
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <span style={{ fontSize: '0.72rem', color: '#555', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Role</span>
                                    {isSelf ? (
                                        <span style={{ background: rc.bg, color: rc.color, padding: '0.3rem 0.75rem', borderRadius: '999px', fontSize: '0.78rem', fontWeight: '600', textTransform: 'capitalize' }}>
                                            <Shield size={11} style={{ display: 'inline', marginRight: '0.3rem', verticalAlign: 'middle' }} />{user.role}
                                        </span>
                                    ) : (
                                        <select value={user.role} disabled={updating === user.id} onChange={e => updateRole(user.id, e.target.value)}
                                            style={{ background: rc.bg, color: rc.color, border: `1px solid ${rc.color}44`, borderRadius: '8px', padding: '0.35rem 0.6rem', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer', outline: 'none', opacity: updating === user.id ? 0.5 : 1, textTransform: 'capitalize' }}>
                                            {ROLES.map(r => <option key={r} value={r} style={{ background: '#1a1a1a', color: '#fff' }}>{r}</option>)}
                                        </select>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                // ── Desktop table ──
                <div style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', overflow: 'hidden' }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                                    {['User', 'Email', 'Joined', 'Role'].map(h => (
                                        <th key={h} style={{ padding: '0.85rem 1.25rem', textAlign: 'left', color: '#555', fontWeight: '500', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(user => {
                                    const isSelf = user.id === currentProfile?.id;
                                    const rc = roleColor(user.role);
                                    return (
                                        <tr key={user.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                                            <td style={{ padding: '1rem 1.25rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: rc.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: rc.color, fontWeight: '700', fontSize: '0.9rem', flexShrink: 0 }}>
                                                        {(user.full_name || user.email || '?')[0].toUpperCase()}
                                                    </div>
                                                    <p style={{ color: '#fff', fontWeight: '600' }}>
                                                        {user.full_name || '—'}
                                                        {isSelf && <span style={{ color: '#555', fontSize: '0.75rem', fontWeight: '400', marginLeft: '0.4rem' }}>(you)</span>}
                                                    </p>
                                                </div>
                                            </td>
                                            <td style={{ padding: '1rem 1.25rem', color: '#aaa' }}>{user.email}</td>
                                            <td style={{ padding: '1rem 1.25rem', color: '#666', whiteSpace: 'nowrap' }}>
                                                {user.created_at ? new Date(user.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                                            </td>
                                            <td style={{ padding: '1rem 1.25rem' }}>
                                                {isSelf ? (
                                                    <span style={{ background: rc.bg, color: rc.color, padding: '0.3rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: '600', textTransform: 'capitalize' }}>
                                                        <Shield size={11} style={{ display: 'inline', marginRight: '0.3rem', verticalAlign: 'middle' }} />{user.role}
                                                    </span>
                                                ) : (
                                                    <select value={user.role} disabled={updating === user.id} onChange={e => updateRole(user.id, e.target.value)}
                                                        style={{ background: rc.bg, color: rc.color, border: `1px solid ${rc.color}44`, borderRadius: '8px', padding: '0.3rem 0.6rem', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer', outline: 'none', opacity: updating === user.id ? 0.5 : 1, textTransform: 'capitalize' }}>
                                                        {ROLES.map(r => <option key={r} value={r} style={{ background: '#1a1a1a', color: '#fff' }}>{r}</option>)}
                                                    </select>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UsersManager;
