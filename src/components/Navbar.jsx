import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingBag } from 'lucide-react';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    // Handle scroll effect
    React.useEffect(() => {
        const handleScroll = () => {
            const offset = window.scrollY;
            const threshold = window.innerHeight - 80; // Viewport height minus navbar height
            if (offset > threshold) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const toggleMenu = () => setIsOpen(!isOpen);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Menu', path: '/menu' },
        { name: 'Book a Table', path: '/book' },
        { name: 'Gallery', path: '/gallery' },
        { name: 'Blog', path: '/blog' },
        { name: 'About', path: '/about' },
        { name: 'Contact', path: '/contact' },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="navbar" style={{
            position: 'fixed',
            top: 0,
            width: '100%',
            zIndex: 1000,
            background: scrolled ? 'rgba(10, 10, 10, 0.9)' : 'transparent',
            backdropFilter: scrolled ? 'blur(10px)' : 'none',
            borderBottom: scrolled ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
            transition: 'all 0.3s ease-in-out'
        }}>
            <div className="container flex justify-between items-center" style={{ height: '80px' }}>
                <Link to="/" className="logo" style={{ fontSize: '1.5rem', fontFamily: 'var(--font-heading)', fontWeight: 'bold' }}>
                    LOUD<span className="text-accent">KITCHEN</span>
                </Link>

                {/* Desktop Menu */}
                <div className="desktop-menu" style={{ display: 'flex', gap: '2rem' }}>
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            className={`nav-link ${isActive(link.path) ? 'text-accent' : ''}`}
                            style={{ fontWeight: 500, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                {/* Mobile Toggle */}
                <div className="mobile-toggle" style={{ display: 'none' }}>
                    <button onClick={toggleMenu} className="text-white">
                        {isOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay (Simplified for now, can be improved with CSS media queries later) */}
            <style>{`
        @media (max-width: 768px) {
          .desktop-menu { display: none !important; }
          .mobile-toggle { display: block !important; }
        }
      `}</style>

            {isOpen && (
                <div className="mobile-menu" style={{
                    position: 'absolute',
                    top: '80px',
                    left: 0,
                    width: '100%',
                    backgroundColor: 'var(--bg-secondary)',
                    padding: '2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '1.5rem',
                    borderBottom: '1px solid var(--bg-tertiary)'
                }}>
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            onClick={() => setIsOpen(false)}
                            style={{ fontSize: '1.2rem', textTransform: 'uppercase' }}
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
