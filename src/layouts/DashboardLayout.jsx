import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, Utensils, BookOpen, Settings,
    Home, LogOut, Users, Image, ChevronRight, CalendarCheck,
    ShoppingBag, Menu, X, Bell
} from 'lucide-react';
import { useAuth } from '../context/useAuth';
import { supabase } from '../lib/supabase';
import logoLight from '../assets/logo_light.png';
import useIsMobile from '../hooks/useIsMobile';

// ── tiny audio helper ────────────────────────────────────────────────────────
const playChime = () => {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const gainNode = ctx.createGain();
        gainNode.connect(ctx.destination);
        gainNode.gain.setValueAtTime(0, ctx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.4, ctx.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);

        [880, 1100, 1320].forEach((freq, i) => {
            const osc = ctx.createOscillator();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.12);
            osc.connect(gainNode);
            osc.start(ctx.currentTime + i * 0.12);
            osc.stop(ctx.currentTime + i * 0.12 + 0.5);
        });
    } catch (_) { }
};

const DashboardLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { profile, signOut, isSuperAdmin } = useAuth();
    const [isCollapsed, setIsCollapsed] = React.useState(false);
    const [drawerOpen, setDrawerOpen] = React.useState(false);
    const [newOrder, setNewOrder] = React.useState(false);
    const lastOrderIdRef = React.useRef(null);
    const isMobile = useIsMobile(900);

    // ── New-order polling ─────────────────────────────────────────────────────
    React.useEffect(() => {
        const check = async () => {
            const { data } = await supabase
                .from('orders')
                .select('id')
                .order('created_at', { ascending: false })
                .limit(1)
                .maybeSingle();

            if (!data) return;

            if (lastOrderIdRef.current === null) {
                // first load — just record the latest id, don't alert
                lastOrderIdRef.current = data.id;
                return;
            }

            if (data.id !== lastOrderIdRef.current) {
                lastOrderIdRef.current = data.id;
                playChime();
                setNewOrder(true);
            }
        };

        check(); // run immediately
        const timer = setInterval(check, 15000); // every 15 s
        return () => clearInterval(timer);
    }, []);

    const sidebarLinks = [
        { name: 'Overview', path: '/admin', icon: <LayoutDashboard size={18} />, superAdminOnly: false },
        { name: 'Menu', path: '/admin/menu', icon: <Utensils size={18} />, superAdminOnly: false },
        { name: 'Blog Posts', path: '/admin/blog', icon: <BookOpen size={18} />, superAdminOnly: false },
        { name: 'Staff', path: '/admin/staff', icon: <Users size={18} />, superAdminOnly: false },
        { name: 'Orders', path: '/admin/orders', icon: <ShoppingBag size={18} />, superAdminOnly: false },
        { name: 'Reviews', path: '/admin/reviews', icon: <BookOpen size={18} />, superAdminOnly: false },
        // ── Superadmin only ──
        { name: 'Gallery', path: '/admin/gallery', icon: <Image size={18} />, superAdminOnly: true },
        { name: 'Bookings', path: '/admin/bookings', icon: <CalendarCheck size={18} />, superAdminOnly: true },
        { name: 'Users', path: '/admin/users', icon: <Users size={18} />, superAdminOnly: true },
        { name: 'Settings', path: '/admin/settings', icon: <Settings size={18} />, superAdminOnly: true },
    ].filter(l => !l.superAdminOnly || isSuperAdmin);

    const isActive = (path) =>
        path === '/admin'
            ? location.pathname === '/admin' || location.pathname === '/admin/'
            : location.pathname.startsWith(path);

    const handleSignOut = async () => {
        await signOut();
        navigate('/admin/login');
    };

    const handleNavClick = () => {
        if (isMobile) setDrawerOpen(false);
    };

    const dismissNewOrder = () => setNewOrder(false);

    const sidebarWidth = isCollapsed ? '72px' : '240px';
    const displayName = profile?.full_name?.split(' ').slice(0, 2).join(' ') || profile?.email?.split('@')[0] || 'Admin';

    // ──────────────────────────────────────────────────────────────────────────
    // Shared nav link renderer
    const NavLinks = ({ onClick }) => sidebarLinks.map((link) => {
        const active = isActive(link.path);
        return (
            <Link
                key={link.path}
                to={link.path}
                onClick={onClick}
                style={{
                    display: 'flex', alignItems: 'center', gap: '0.65rem',
                    padding: '0.75rem 0.85rem', borderRadius: '8px',
                    marginBottom: '0.4rem', textDecoration: 'none',
                    fontSize: '0.925rem', fontWeight: active ? '600' : '400',
                    color: active ? '#000' : '#aaa',
                    background: active ? 'var(--color-accent, #e8b86d)' : 'transparent',
                }}
            >
                {link.icon}
                <span>{link.name}</span>
                {link.path === '/admin/orders' && newOrder && (
                    <span style={{ marginLeft: 'auto', width: '8px', height: '8px', borderRadius: '50%', background: '#f87171', flexShrink: 0, boxShadow: '0 0 6px #f87171' }} />
                )}
                {active && link.path !== '/admin/orders' && <ChevronRight size={14} style={{ marginLeft: 'auto' }} />}
            </Link>
        );
    });

    // ── Mobile Layout ────────────────────────────────────────────────────────
    if (isMobile) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#0f0f0f', color: '#fff', fontFamily: 'var(--font-body)' }}>
                {/* Mobile Top Bar */}
                <header style={{
                    height: '56px',
                    background: '#141414',
                    borderBottom: '1px solid rgba(255,255,255,0.07)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 1rem',
                    flexShrink: 0,
                    position: 'sticky',
                    top: 0,
                    zIndex: 50,
                    gap: '0.75rem',
                }}>
                    <img src={logoLight} alt="LoudKitchen" style={{ height: '26px', flexShrink: 0 }} />

                    {/* Greeting */}
                    <span style={{ flex: 1, fontSize: '0.8rem', color: '#777', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        Hi, <strong style={{ color: '#ddd' }}>{displayName}</strong>
                    </span>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                        {/* New-order bell */}
                        {newOrder && (
                            <button
                                onClick={() => { dismissNewOrder(); navigate('/admin/orders'); }}
                                title="New order!"
                                style={{ position: 'relative', background: 'rgba(248,113,113,0.15)', border: '1px solid rgba(248,113,113,0.3)', borderRadius: '8px', padding: '0.4rem', color: '#f87171', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                            >
                                <Bell size={18} />
                                <span style={{ position: 'absolute', top: '-3px', right: '-3px', width: '8px', height: '8px', borderRadius: '50%', background: '#f87171', boxShadow: '0 0 6px #f87171' }} />
                            </button>
                        )}
                        {/* Avatar → opens drawer */}
                        <button
                            onClick={() => setDrawerOpen(true)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}
                        >
                            {profile?.avatar_url ? (
                                <img src={profile.avatar_url} alt={displayName} style={{ width: '34px', height: '34px', borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(232,184,109,0.4)' }} />
                            ) : (
                                <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'var(--color-accent, #e8b86d)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: '700', fontSize: '0.85rem' }}>
                                    {displayName[0].toUpperCase()}
                                </div>
                            )}
                        </button>
                    </div>
                </header>

                {/* Drawer Overlay */}
                {drawerOpen && (
                    <div
                        onClick={() => setDrawerOpen(false)}
                        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 100 }}
                    />
                )}

                {/* Slide-out Drawer */}
                <aside style={{
                    position: 'fixed', top: 0, right: 0, bottom: 0, width: '280px',
                    background: '#141414', borderLeft: '1px solid rgba(255,255,255,0.07)',
                    display: 'flex', flexDirection: 'column', zIndex: 101,
                    transform: drawerOpen ? 'translateX(0)' : 'translateX(100%)',
                    transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    overflowY: 'auto', scrollbarWidth: 'thin', scrollbarColor: '#333 transparent',
                }}>
                    {/* Drawer header */}
                    <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                            <img src={logoLight} alt="LoudKitchen" style={{ height: '26px' }} />
                            <p style={{ color: '#555', fontSize: '0.65rem', marginTop: '0.2rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Admin Panel</p>
                        </div>
                        <button onClick={() => setDrawerOpen(false)} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', padding: '0.5rem' }}>
                            <X size={20} />
                        </button>
                    </div>

                    {/* User info in drawer */}
                    {profile && (
                        <div style={{ padding: '0.85rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                            {profile.avatar_url ? (
                                <img src={profile.avatar_url} alt={displayName} style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: '2px solid rgba(232,184,109,0.35)' }} />
                            ) : (
                                <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'var(--color-accent, #e8b86d)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: '700', fontSize: '0.9rem', flexShrink: 0 }}>
                                    {displayName[0].toUpperCase()}
                                </div>
                            )}
                            <div style={{ minWidth: 0 }}>
                                <p style={{ fontSize: '0.875rem', color: '#ddd', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{displayName}</p>
                                <p style={{ fontSize: '0.72rem', color: '#555', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{profile.email}</p>
                            </div>
                        </div>
                    )}

                    <nav style={{ flex: 1, padding: '0.75rem' }}>
                        <NavLinks onClick={handleNavClick} />
                        <Link to="/admin/profile" onClick={handleNavClick} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.65rem 0.85rem', borderRadius: '8px', marginBottom: '0.4rem', textDecoration: 'none', fontSize: '0.925rem', color: isActive('/admin/profile') ? '#000' : '#aaa', background: isActive('/admin/profile') ? 'var(--color-accent, #e8b86d)' : 'transparent', fontWeight: isActive('/admin/profile') ? '600' : '400' }}>
                            <Users size={18} /><span>My Profile</span>
                        </Link>
                    </nav>

                    {/* Footer */}
                    <div style={{ padding: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                        <Link to="/" target="_blank" rel="noreferrer" onClick={handleNavClick}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.65rem 0.85rem', borderRadius: '8px', textDecoration: 'none', color: '#777', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                            <Home size={18} /><span>View Site</span>
                        </Link>
                        <button onClick={handleSignOut} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.65rem 0.85rem', borderRadius: '8px', background: 'none', border: 'none', color: '#777', fontSize: '0.875rem', cursor: 'pointer', width: '100%' }}>
                            <LogOut size={18} /><span>Sign Out</span>
                        </button>
                    </div>
                </aside>

                {/* New-order banner */}
                {newOrder && (
                    <div style={{ background: 'rgba(248,113,113,0.12)', borderBottom: '1px solid rgba(248,113,113,0.25)', padding: '0.6rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', flexShrink: 0 }}>
                        <p style={{ color: '#fca5a5', fontSize: '0.8rem', fontWeight: '600' }}>🔔 New order received!</p>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button onClick={() => { dismissNewOrder(); navigate('/admin/orders'); }} style={{ background: '#f87171', border: 'none', borderRadius: '6px', padding: '0.3rem 0.65rem', color: '#000', fontWeight: '700', fontSize: '0.75rem', cursor: 'pointer' }}>View</button>
                            <button onClick={dismissNewOrder} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}><X size={14} /></button>
                        </div>
                    </div>
                )}

                {/* Main content */}
                <main style={{ flex: 1, overflowY: 'auto', background: '#0f0f0f', padding: '1.25rem 1rem' }}>
                    <Outlet />
                </main>
            </div>
        );
    }

    // ── Desktop Layout ────────────────────────────────────────────────────────
    return (
        <div style={{ display: 'flex', height: '100vh', background: '#0f0f0f', color: '#fff', fontFamily: 'var(--font-body)' }}>
            {/* Sidebar */}
            <aside style={{
                width: sidebarWidth, minWidth: sidebarWidth,
                background: '#141414', borderRight: '1px solid rgba(255,255,255,0.07)',
                display: 'flex', flexDirection: 'column',
                overflowY: 'auto', overflowX: 'hidden',
                transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                scrollbarWidth: 'thin', scrollbarColor: '#333 transparent',
            }}>
                {/* Logo */}
                <div style={{ padding: isCollapsed ? '1rem 0' : '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', flexDirection: 'column', alignItems: isCollapsed ? 'center' : 'flex-start', position: 'relative' }}>
                    <img src={logoLight} alt="L" style={{ height: '32px', width: 'auto', transition: 'all 0.3s' }} />
                    {!isCollapsed && (
                        <p style={{ color: '#555', fontSize: '0.7rem', marginTop: '0.35rem', letterSpacing: '0.1em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Admin Panel</p>
                    )}
                    <button onClick={() => setIsCollapsed(!isCollapsed)} style={{ position: 'absolute', right: isCollapsed ? '-12px' : '12px', top: '50%', transform: 'translateY(-50%)', background: '#e8b86d', border: 'none', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#000', zIndex: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.3)', opacity: isCollapsed ? 0.8 : 1 }}>
                        {isCollapsed ? <ChevronRight size={14} /> : <div style={{ transform: 'rotate(180deg)', display: 'flex' }}><ChevronRight size={14} /></div>}
                    </button>
                </div>

                {/* Nav */}
                <nav style={{ flex: 1, padding: '1rem 0.75rem' }}>
                    {sidebarLinks.map((link) => {
                        const active = isActive(link.path);
                        return (
                            <Link
                                key={link.path}
                                to={link.path}
                                title={isCollapsed ? link.name : ''}
                                style={{
                                    display: 'flex', alignItems: 'center',
                                    justifyContent: isCollapsed ? 'center' : 'flex-start',
                                    gap: isCollapsed ? '0' : '0.65rem',
                                    padding: '0.65rem 0.85rem', borderRadius: '8px',
                                    marginBottom: '0.5rem', textDecoration: 'none',
                                    fontSize: '0.9rem', fontWeight: active ? '600' : '400',
                                    color: active ? '#000' : '#aaa',
                                    background: active ? 'var(--color-accent, #e8b86d)' : 'transparent',
                                    transition: 'all 0.2s', minHeight: '40px', position: 'relative',
                                }}
                                onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
                                onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
                            >
                                {link.icon}
                                {!isCollapsed && <span style={{ whiteSpace: 'nowrap' }}>{link.name}</span>}
                                {/* New order dot */}
                                {link.path === '/admin/orders' && newOrder && (
                                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f87171', boxShadow: '0 0 6px #f87171', marginLeft: isCollapsed ? '0' : 'auto', position: isCollapsed ? 'absolute' : 'static', top: isCollapsed ? '8px' : 'auto', right: isCollapsed ? '8px' : 'auto' }} />
                                )}
                                {active && !isCollapsed && link.path !== '/admin/orders' && <ChevronRight size={14} style={{ marginLeft: 'auto' }} />}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div style={{ padding: '1rem 0.75rem', borderTop: '1px solid rgba(255,255,255,0.07)', background: '#141414' }}>
                    {profile && (
                        <Link to="/admin/profile" title={isCollapsed ? 'My Profile' : ''} style={{ display: 'flex', alignItems: 'center', justifyContent: isCollapsed ? 'center' : 'flex-start', gap: '0.65rem', padding: '0.65rem 0.85rem', marginBottom: '0.5rem', textDecoration: 'none' }}>
                            {profile.avatar_url ? (
                                <img src={profile.avatar_url} alt={displayName} style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: '2px solid rgba(232,184,109,0.35)' }} />
                            ) : (
                                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--color-accent, #e8b86d)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: '700', fontSize: '0.85rem', flexShrink: 0 }}>
                                    {displayName[0].toUpperCase()}
                                </div>
                            )}
                            {!isCollapsed && (
                                <div style={{ overflow: 'hidden' }}>
                                    <p style={{ fontSize: '0.8rem', color: '#ddd', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{displayName}</p>
                                    <p style={{ fontSize: '0.7rem', color: '#555', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{profile.email}</p>
                                </div>
                            )}
                        </Link>
                    )}
                    <Link to="/" target="_blank" rel="noreferrer" title={isCollapsed ? 'View Site' : ''}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: isCollapsed ? 'center' : 'flex-start', gap: isCollapsed ? '0' : '0.65rem', padding: '0.65rem 0.85rem', borderRadius: '8px', textDecoration: 'none', color: '#777', fontSize: '0.875rem', marginBottom: '0.25rem' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#fff'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#777'; }}>
                        <Home size={18} />
                        {!isCollapsed && <span>View Site</span>}
                    </Link>
                    <button onClick={handleSignOut} title={isCollapsed ? 'Sign Out' : ''}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: isCollapsed ? 'center' : 'flex-start', gap: isCollapsed ? '0' : '0.65rem', padding: '0.65rem 0.85rem', borderRadius: '8px', background: 'none', border: 'none', color: '#777', fontSize: '0.875rem', cursor: 'pointer', width: '100%', transition: 'all 0.15s' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = '#f87171'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#777'; }}>
                        <LogOut size={18} />
                        {!isCollapsed && <span>Sign Out</span>}
                    </button>
                </div>
            </aside>

            {/* Desktop: new-order banner below header */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                {/* Desktop Topbar */}
                <header style={{ height: '56px', background: '#141414', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2rem', flexShrink: 0 }}>
                    <div />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                        {newOrder && (
                            <button onClick={() => { dismissNewOrder(); navigate('/admin/orders'); }} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(248,113,113,0.15)', border: '1px solid rgba(248,113,113,0.3)', borderRadius: '8px', padding: '0.4rem 0.75rem', color: '#f87171', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '600' }}>
                                <Bell size={15} /> New order
                            </button>
                        )}
                        <Link to="/admin/profile" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }}>
                            {profile?.avatar_url ? (
                                <img src={profile.avatar_url} alt={displayName} style={{ width: '34px', height: '34px', borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(232,184,109,0.35)' }} />
                            ) : (
                                <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'var(--color-accent, #e8b86d)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: '700', fontSize: '0.85rem' }}>
                                    {displayName[0].toUpperCase()}
                                </div>
                            )}
                            <span style={{ color: '#ddd', fontSize: '0.875rem', fontWeight: '600' }}>{displayName}</span>
                        </Link>
                    </div>
                </header>
                {newOrder && (
                    <div style={{ background: 'rgba(248,113,113,0.1)', borderBottom: '1px solid rgba(248,113,113,0.2)', padding: '0.65rem 2.5rem', display: 'flex', alignItems: 'center', gap: '1rem', flexShrink: 0 }}>
                        <Bell size={16} style={{ color: '#f87171' }} />
                        <p style={{ color: '#fca5a5', fontSize: '0.875rem', fontWeight: '600', flex: 1 }}>New order received!</p>
                        <button onClick={() => { dismissNewOrder(); navigate('/admin/orders'); }} style={{ background: '#f87171', border: 'none', borderRadius: '6px', padding: '0.35rem 0.85rem', color: '#000', fontWeight: '700', fontSize: '0.8rem', cursor: 'pointer' }}>View Orders</button>
                        <button onClick={dismissNewOrder} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}><X size={16} /></button>
                    </div>
                )}
                <main style={{ flex: 1, overflowY: 'auto', background: '#0f0f0f', padding: '2rem 2.5rem' }}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
