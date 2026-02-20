import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, Utensils, BookOpen, Settings,
    Home, LogOut, Users, Image, ChevronRight, CalendarCheck
} from 'lucide-react';
import { useAuth } from '../context/useAuth';
import logoLight from '../assets/logo_light.png';

const DashboardLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { profile, signOut, isSuperAdmin } = useAuth();
    const [isCollapsed, setIsCollapsed] = React.useState(false);

    const sidebarLinks = [
        { name: 'Overview', path: '/admin', icon: <LayoutDashboard size={18} /> },
        { name: 'Menu', path: '/admin/menu', icon: <Utensils size={18} /> },
        { name: 'Blog Posts', path: '/admin/blog', icon: <BookOpen size={18} /> },
        { name: 'Staff', path: '/admin/staff', icon: <Users size={18} /> },
        { name: 'Gallery', path: '/admin/gallery', icon: <Image size={18} /> },
        { name: 'Bookings', path: '/admin/bookings', icon: <CalendarCheck size={18} /> },
        ...(isSuperAdmin ? [
            { name: 'Users', path: '/admin/users', icon: <Users size={18} /> },
            { name: 'Settings', path: '/admin/settings', icon: <Settings size={18} /> }
        ] : []),
    ];

    const isActive = (path) =>
        path === '/admin'
            ? location.pathname === '/admin' || location.pathname === '/admin/'
            : location.pathname.startsWith(path);

    const handleSignOut = async () => {
        await signOut();
        navigate('/admin/login');
    };

    const sidebarWidth = isCollapsed ? '72px' : '240px';

    return (
        <div style={{ display: 'flex', height: '100vh', background: '#0f0f0f', color: '#fff', fontFamily: 'var(--font-body)' }}>
            {/* Sidebar */}
            <aside style={{
                width: sidebarWidth,
                minWidth: sidebarWidth,
                background: '#141414',
                borderRight: '1px solid rgba(255,255,255,0.07)',
                display: 'flex',
                flexDirection: 'column',
                overflowY: 'auto',
                overflowX: 'hidden',
                transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                scrollbarWidth: 'thin',
                scrollbarColor: '#333 transparent'
            }}>
                {/* Logo & Toggle */}
                <div style={{
                    padding: isCollapsed ? '1rem 0' : '1.5rem',
                    borderBottom: '1px solid rgba(255,255,255,0.07)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isCollapsed ? 'center' : 'flex-start',
                    position: 'relative'
                }}>
                    <img
                        src={logoLight}
                        alt="L"
                        style={{
                            height: '32px',
                            width: 'auto',
                            transition: 'all 0.3s'
                        }}
                    />
                    {!isCollapsed && (
                        <p style={{
                            color: '#555',
                            fontSize: '0.7rem',
                            marginTop: '0.35rem',
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase',
                            whiteSpace: 'nowrap'
                        }}>
                            Admin Panel
                        </p>
                    )}

                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        style={{
                            position: 'absolute',
                            right: isCollapsed ? '-12px' : '12px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: '#e8b86d',
                            border: 'none',
                            borderRadius: '50%',
                            width: '24px',
                            height: '24px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            color: '#000',
                            zIndex: 10,
                            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                            opacity: isCollapsed ? 0.8 : 1
                        }}
                    >
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
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: isCollapsed ? 'center' : 'flex-start',
                                    gap: isCollapsed ? '0' : '0.65rem',
                                    padding: '0.65rem 0.85rem',
                                    borderRadius: '8px',
                                    marginBottom: '0.5rem',
                                    textDecoration: 'none',
                                    fontSize: '0.9rem',
                                    fontWeight: active ? '600' : '400',
                                    color: active ? '#000' : '#aaa',
                                    background: active ? 'var(--color-accent, #e8b86d)' : 'transparent',
                                    transition: 'all 0.2s',
                                    minHeight: '40px'
                                }}
                                onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
                                onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
                            >
                                {link.icon}
                                {!isCollapsed && <span style={{ whiteSpace: 'nowrap' }}>{link.name}</span>}
                                {active && !isCollapsed && <ChevronRight size={14} style={{ marginLeft: 'auto' }} />}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div style={{
                    padding: '1rem 0.75rem',
                    borderTop: '1px solid rgba(255,255,255,0.07)',
                    background: '#141414'
                }}>
                    {/* User info */}
                    {profile && (
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: isCollapsed ? 'center' : 'flex-start',
                            gap: '0.65rem',
                            padding: '0.65rem 0.85rem',
                            marginBottom: '0.5rem',
                        }}>
                            <div style={{
                                width: '32px', height: '32px', borderRadius: '50%',
                                background: 'var(--color-accent, #e8b86d)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: '#000', fontWeight: '700', fontSize: '0.85rem', flexShrink: 0,
                            }}>
                                {(profile.full_name || profile.email || 'A')[0].toUpperCase()}
                            </div>
                            {!isCollapsed && (
                                <div style={{ overflow: 'hidden' }}>
                                    <p style={{ fontSize: '0.8rem', color: '#ddd', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {profile.full_name || 'Admin'}
                                    </p>
                                    <p style={{ fontSize: '0.7rem', color: '#555', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {profile.email}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    <Link
                        to="/"
                        title={isCollapsed ? 'View Site' : ''}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: isCollapsed ? 'center' : 'flex-start',
                            gap: isCollapsed ? '0' : '0.65rem',
                            padding: '0.65rem 0.85rem', borderRadius: '8px',
                            textDecoration: 'none', color: '#777', fontSize: '0.875rem',
                            marginBottom: '0.25rem',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#fff'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#777'; }}
                    >
                        <Home size={18} />
                        {!isCollapsed && <span>View Site</span>}
                    </Link>

                    <button
                        onClick={handleSignOut}
                        title={isCollapsed ? 'Sign Out' : ''}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: isCollapsed ? 'center' : 'flex-start',
                            gap: isCollapsed ? '0' : '0.65rem',
                            padding: '0.65rem 0.85rem', borderRadius: '8px',
                            background: 'none', border: 'none', color: '#777',
                            fontSize: '0.875rem', cursor: 'pointer', width: '100%',
                            transition: 'all 0.15s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = '#f87171'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#777'; }}
                    >
                        <LogOut size={18} />
                        {!isCollapsed && <span>Sign Out</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, overflowY: 'auto', background: '#0f0f0f', padding: '2rem 2.5rem' }}>
                <Outlet />
            </main>
        </div>
    );
};

export default DashboardLayout;
