import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { CalendarCheck, Clock, CheckCircle, XCircle, Search, RefreshCw } from 'lucide-react';
import useIsMobile from '../../hooks/useIsMobile';

const STATUS_OPTIONS = ['pending', 'confirmed', 'cancelled'];

const statusStyle = (status) => {
    const map = {
        pending: { bg: 'rgba(234,179,8,0.15)', color: '#facc15', label: 'Pending' },
        confirmed: { bg: 'rgba(34,197,94,0.15)', color: '#4ade80', label: 'Confirmed' },
        cancelled: { bg: 'rgba(239,68,68,0.15)', color: '#f87171', label: 'Cancelled' },
    };
    return map[status] || map.pending;
};

const Badge = ({ status }) => {
    const s = statusStyle(status);
    return (
        <span style={{ background: s.bg, color: s.color, padding: '0.25rem 0.65rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: '600', textTransform: 'capitalize', whiteSpace: 'nowrap' }}>
            {s.label}
        </span>
    );
};

const Bookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');
    const [updating, setUpdating] = useState(null);
    const isMobile = useIsMobile();

    const fetchBookings = async () => {
        const { data } = await supabase.from('bookings').select('*').order('created_at', { ascending: false });
        setBookings(data || []);
        setLoading(false);
    };

    useEffect(() => { fetchBookings(); }, []);

    const updateStatus = async (id, newStatus) => {
        setUpdating(id);
        await supabase.from('bookings').update({ status: newStatus }).eq('id', id);
        setBookings(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
        setUpdating(null);
    };

    const filtered = bookings.filter(o => {
        const matchStatus = filter === 'all' || o.status === filter;
        const matchSearch = !search ||
            o.name?.toLowerCase().includes(search.toLowerCase()) ||
            o.email?.toLowerCase().includes(search.toLowerCase()) ||
            o.phone?.toLowerCase().includes(search.toLowerCase());
        return matchStatus && matchSearch;
    });

    const counts = {
        all: bookings.length,
        pending: bookings.filter(o => o.status === 'pending').length,
        confirmed: bookings.filter(o => o.status === 'confirmed').length,
        cancelled: bookings.filter(o => o.status === 'cancelled').length,
    };

    const inputStyle = { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '0.6rem 0.85rem', color: '#fff', fontSize: '0.875rem', outline: 'none' };

    return (
        <div>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <div>
                    <h1 style={{ fontSize: isMobile ? '1.3rem' : '1.5rem', fontWeight: '700', color: '#fff' }}>Bookings</h1>
                    <p style={{ color: '#666', fontSize: '0.875rem', marginTop: '0.2rem' }}>{bookings.length} total · {counts.pending} pending</p>
                </div>
                <button onClick={fetchBookings} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '0.6rem', color: '#aaa', cursor: 'pointer' }}>
                    <RefreshCw size={15} />
                    {!isMobile && <span style={{ fontSize: '0.875rem' }}>Refresh</span>}
                </button>
            </div>

            {/* Search */}
            <div style={{ position: 'relative', marginBottom: '0.75rem' }}>
                <Search size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#555' }} />
                <input style={{ ...inputStyle, paddingLeft: '2.25rem', width: '100%', boxSizing: 'border-box' }} placeholder="Search name, email…" value={search} onChange={e => setSearch(e.target.value)} />
            </div>

            {/* Filter pills */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
                {['all', 'pending', 'confirmed', 'cancelled'].map(s => (
                    <button key={s} onClick={() => setFilter(s)} style={{
                        padding: '0.35rem 0.75rem', borderRadius: '999px', border: 'none',
                        background: filter === s ? 'var(--color-accent, #e8b86d)' : 'rgba(255,255,255,0.07)',
                        color: filter === s ? '#000' : '#aaa',
                        fontWeight: filter === s ? '600' : '400',
                        cursor: 'pointer', fontSize: '0.78rem', textTransform: 'capitalize',
                    }}>
                        {s === 'all' ? 'All' : s} ({counts[s]})
                    </button>
                ))}
            </div>

            {/* Content */}
            {loading ? (
                <div style={{ padding: '3rem', textAlign: 'center', color: '#555' }}>Loading…</div>
            ) : filtered.length === 0 ? (
                <div style={{ padding: '3rem', textAlign: 'center', color: '#555' }}>No bookings found.</div>
            ) : isMobile ? (
                // ── Mobile card list ──
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    {filtered.map(order => (
                        <div key={order.id} style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                <div>
                                    <p style={{ color: '#fff', fontWeight: '600', fontSize: '0.9rem' }}>{order.name}</p>
                                    <p style={{ color: '#666', fontSize: '0.75rem', marginTop: '0.1rem' }}>{order.email}</p>
                                </div>
                                <Badge status={order.status} />
                            </div>
                            <p style={{ color: '#aaa', fontSize: '0.8rem', marginBottom: '0.75rem' }}>
                                <CalendarCheck size={12} style={{ display: 'inline', marginRight: '0.3rem', verticalAlign: 'middle' }} />
                                {order.date} · {order.time} · {order.guests} guests
                            </p>
                            {order.notes && <p style={{ color: '#666', fontSize: '0.78rem', fontStyle: 'italic', marginBottom: '0.75rem' }}>"{order.notes}"</p>}
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                {order.status !== 'confirmed' && (
                                    <button onClick={() => updateStatus(order.id, 'confirmed')} disabled={updating === order.id}
                                        style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', padding: '0.5rem', background: 'rgba(34,197,94,0.12)', border: 'none', borderRadius: '8px', color: '#4ade80', cursor: 'pointer', fontSize: '0.8rem', opacity: updating === order.id ? 0.5 : 1 }}>
                                        <CheckCircle size={14} /> Confirm
                                    </button>
                                )}
                                {order.status !== 'cancelled' && (
                                    <button onClick={() => updateStatus(order.id, 'cancelled')} disabled={updating === order.id}
                                        style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', padding: '0.5rem', background: 'rgba(239,68,68,0.12)', border: 'none', borderRadius: '8px', color: '#f87171', cursor: 'pointer', fontSize: '0.8rem', opacity: updating === order.id ? 0.5 : 1 }}>
                                        <XCircle size={14} /> Cancel
                                    </button>
                                )}
                                {order.status !== 'pending' && (
                                    <button onClick={() => updateStatus(order.id, 'pending')} disabled={updating === order.id}
                                        style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', padding: '0.5rem', background: 'rgba(234,179,8,0.12)', border: 'none', borderRadius: '8px', color: '#facc15', cursor: 'pointer', fontSize: '0.8rem', opacity: updating === order.id ? 0.5 : 1 }}>
                                        <Clock size={14} /> Reset
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                // ── Desktop table ──
                <div style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', overflow: 'hidden' }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                                    {['Guest', 'Contact', 'Date & Time', 'Guests', 'Notes', 'Status', 'Actions'].map(h => (
                                        <th key={h} style={{ padding: '0.85rem 1.25rem', textAlign: 'left', color: '#555', fontWeight: '500', whiteSpace: 'nowrap', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(order => (
                                    <tr key={order.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                                        <td style={{ padding: '1rem 1.25rem' }}>
                                            <p style={{ color: '#fff', fontWeight: '600', marginBottom: '0.1rem' }}>{order.name}</p>
                                            <p style={{ color: '#555', fontSize: '0.75rem' }}>{new Date(order.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                                        </td>
                                        <td style={{ padding: '1rem 1.25rem' }}>
                                            <p style={{ color: '#aaa', fontSize: '0.8rem' }}>{order.email}</p>
                                            <p style={{ color: '#666', fontSize: '0.75rem' }}>{order.phone}</p>
                                        </td>
                                        <td style={{ padding: '1rem 1.25rem', color: '#aaa', whiteSpace: 'nowrap' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}><CalendarCheck size={13} style={{ color: '#666' }} />{order.date}</div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#666', fontSize: '0.8rem' }}><Clock size={13} />{order.time}</div>
                                        </td>
                                        <td style={{ padding: '1rem 1.25rem', color: '#aaa', textAlign: 'center' }}>{order.guests}</td>
                                        <td style={{ padding: '1rem 1.25rem', color: '#666', fontSize: '0.8rem', maxWidth: '180px' }}>
                                            <span style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{order.notes || '—'}</span>
                                        </td>
                                        <td style={{ padding: '1rem 1.25rem' }}><Badge status={order.status} /></td>
                                        <td style={{ padding: '1rem 1.25rem' }}>
                                            <div style={{ display: 'flex', gap: '0.4rem' }}>
                                                {order.status !== 'confirmed' && (
                                                    <button onClick={() => updateStatus(order.id, 'confirmed')} disabled={updating === order.id} title="Confirm"
                                                        style={{ background: 'rgba(34,197,94,0.12)', border: 'none', borderRadius: '6px', padding: '0.4rem 0.6rem', color: '#4ade80', cursor: 'pointer', opacity: updating === order.id ? 0.5 : 1 }}>
                                                        <CheckCircle size={15} />
                                                    </button>
                                                )}
                                                {order.status !== 'cancelled' && (
                                                    <button onClick={() => updateStatus(order.id, 'cancelled')} disabled={updating === order.id} title="Cancel"
                                                        style={{ background: 'rgba(239,68,68,0.12)', border: 'none', borderRadius: '6px', padding: '0.4rem 0.6rem', color: '#f87171', cursor: 'pointer', opacity: updating === order.id ? 0.5 : 1 }}>
                                                        <XCircle size={15} />
                                                    </button>
                                                )}
                                                {order.status !== 'pending' && (
                                                    <button onClick={() => updateStatus(order.id, 'pending')} disabled={updating === order.id} title="Reset to pending"
                                                        style={{ background: 'rgba(234,179,8,0.12)', border: 'none', borderRadius: '6px', padding: '0.4rem 0.6rem', color: '#facc15', cursor: 'pointer', opacity: updating === order.id ? 0.5 : 1 }}>
                                                        <Clock size={15} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Bookings;
