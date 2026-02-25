import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/useAuth';
import { Utensils, BookOpen, Users, Image, CalendarCheck } from 'lucide-react';
import useIsMobile from '../../hooks/useIsMobile';

const StatCard = (props) => {
    const { title, value, icon: Icon, accent } = props;
    return (
        <div style={{
            background: '#1a1a1a',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '12px',
            padding: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
        }}>
            <div style={{
                width: '46px', height: '46px', borderRadius: '12px',
                background: accent + '22',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: accent, flexShrink: 0,
            }}>
                <Icon size={20} />
            </div>
            <div>
                <p style={{ color: '#666', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.2rem' }}>{title}</p>
                <p style={{ fontSize: '1.6rem', fontWeight: '700', color: '#fff' }}>{value ?? '—'}</p>
            </div>
        </div>
    );
};

const statusStyle = (status) => {
    const map = {
        pending: { bg: 'rgba(234,179,8,0.15)', color: '#facc15' },
        confirmed: { bg: 'rgba(34,197,94,0.15)', color: '#4ade80' },
        cancelled: { bg: 'rgba(239,68,68,0.15)', color: '#f87171' },
    };
    return map[status] || map.pending;
};

const Dashboard = () => {
    const { profile } = useAuth();
    const isMobile = useIsMobile();
    const [stats, setStats] = useState({ menu: null, blog: null, staff: null, gallery: null, pending: null });
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [menu, blog, staff, gallery, pending, recentBookings] = await Promise.all([
                    supabase.from('menu_items').select('id', { count: 'exact', head: true }),
                    supabase.from('blog_posts').select('id', { count: 'exact', head: true }),
                    supabase.from('staff').select('id', { count: 'exact', head: true }),
                    supabase.from('gallery').select('id', { count: 'exact', head: true }),
                    supabase.from('bookings').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
                    supabase.from('bookings').select('*').order('created_at', { ascending: false }).limit(8),
                ]);
                setStats({ menu: menu.count, blog: blog.count, staff: staff.count, gallery: gallery.count, pending: pending.count });
                setBookings(recentBookings.data || []);
            } catch (err) {
                console.error('Error fetching dashboard stats:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

    return (
        <div>
            {/* Header */}
            <div style={{ marginBottom: '1.5rem' }}>
                <h1 style={{ fontSize: isMobile ? '1.4rem' : '1.75rem', fontWeight: '700', color: '#fff' }}>
                    {greeting}, {profile?.full_name?.split(' ')[0] || 'Admin'} 👋
                </h1>
                <p style={{ color: '#666', marginTop: '0.25rem', fontSize: '0.875rem' }}>Here's what's happening with LoudKitchen today.</p>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.85rem', marginBottom: '2rem' }}>
                <StatCard title="Menu Items" value={stats.menu} icon={Utensils} accent="#e8b86d" />
                <StatCard title="Blog Posts" value={stats.blog} icon={BookOpen} accent="#818cf8" />
                <StatCard title="Staff Members" value={stats.staff} icon={Users} accent="#34d399" />
                <StatCard title="Gallery Images" value={stats.gallery} icon={Image} accent="#f472b6" />
                <StatCard title="Pending Bookings" value={stats.pending} icon={CalendarCheck} accent="#fb923c" />
            </div>

            {/* Recent Bookings */}
            <div style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', overflow: 'hidden' }}>
                <div style={{ padding: '1.1rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ fontSize: '1rem', fontWeight: '600', color: '#fff' }}>Recent Bookings</h2>
                    <span style={{ fontSize: '0.8rem', color: '#555' }}>Latest 8</span>
                </div>
                {loading ? (
                    <div style={{ padding: '2rem', textAlign: 'center', color: '#555' }}>Loading…</div>
                ) : bookings.length === 0 ? (
                    <div style={{ padding: '2rem', textAlign: 'center', color: '#555' }}>No bookings yet.</div>
                ) : isMobile ? (
                    // Mobile: Card list
                    <div style={{ padding: '0.5rem 0' }}>
                        {bookings.map(b => {
                            const s = statusStyle(b.status);
                            return (
                                <div key={b.id} style={{ padding: '0.85rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.04)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <p style={{ color: '#ddd', fontWeight: '600', fontSize: '0.875rem' }}>{b.name}</p>
                                        <p style={{ color: '#555', fontSize: '0.75rem', marginTop: '0.15rem' }}>{b.date} · {b.time} · {b.guests} guests</p>
                                    </div>
                                    <span style={{ background: s.bg, color: s.color, padding: '0.2rem 0.55rem', borderRadius: '999px', fontSize: '0.7rem', fontWeight: '600', textTransform: 'capitalize', flexShrink: 0 }}>
                                        {b.status}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    // Desktop: Full table
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                                    {['Name', 'Date', 'Time', 'Guests', 'Status'].map(h => (
                                        <th key={h} style={{ padding: '0.75rem 1.5rem', textAlign: 'left', color: '#555', fontWeight: '500', whiteSpace: 'nowrap' }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {bookings.map(b => {
                                    const s = statusStyle(b.status);
                                    return (
                                        <tr key={b.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                                            <td style={{ padding: '0.85rem 1.5rem', color: '#ddd' }}>{b.name}</td>
                                            <td style={{ padding: '0.85rem 1.5rem', color: '#aaa' }}>{b.date}</td>
                                            <td style={{ padding: '0.85rem 1.5rem', color: '#aaa' }}>{b.time}</td>
                                            <td style={{ padding: '0.85rem 1.5rem', color: '#aaa' }}>{b.guests}</td>
                                            <td style={{ padding: '0.85rem 1.5rem' }}>
                                                <span style={{ background: s.bg, color: s.color, padding: '0.25rem 0.65rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: '600', textTransform: 'capitalize' }}>
                                                    {b.status}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
