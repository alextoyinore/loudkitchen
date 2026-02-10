import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Utensils, BookOpen, Settings, Home, LogOut } from 'lucide-react';

const DashboardLayout = () => {
    const location = useLocation();

    const sidebarLinks = [
        { name: 'Overview', path: '/admin', icon: <LayoutDashboard size={20} /> },
        { name: 'Menu Editor', path: '/admin/menu', icon: <Utensils size={20} /> },
        { name: 'Blog Posts', path: '/admin/blog', icon: <BookOpen size={20} /> },
        { name: 'Settings', path: '/admin/settings', icon: <Settings size={20} /> },
    ];

    const isActive = (path) => location.pathname === path || (path === '/admin' && location.pathname === '/admin/');

    return (
        <div className="flex h-screen bg-gray-900 text-white">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
                <div className="p-6 border-b border-gray-700">
                    <h2 className="text-xl font-bold text-accent">LoudAdmin</h2>
                </div>

                <nav className="flex-1 p-4">
                    <ul className="space-y-2">
                        {sidebarLinks.map((link) => (
                            <li key={link.path}>
                                <Link
                                    to={link.path}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${isActive(link.path)
                                            ? 'bg-accent text-black font-semibold'
                                            : 'text-gray-300 hover:bg-gray-700'
                                        }`}
                                >
                                    {link.icon}
                                    <span>{link.name}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="p-4 border-t border-gray-700">
                    <Link to="/" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white transition-colors">
                        <Home size={20} />
                        <span>Back to Site</span>
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto bg-gray-900 p-8">
                <Outlet />
            </main>
        </div>
    );
};

export default DashboardLayout;
