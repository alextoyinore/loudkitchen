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
        <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`} style={{
            left: 'var(--page-margin, 0)',
            right: 'var(--page-margin, 0)'
        }}>
            <div className="container navbar-inner">
                <Link to="/" className="logo">
                    LOUD<span className="text-accent">KITCHEN</span>
                </Link>

                {/* Desktop Menu */}
                <div className="desktop-menu">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            className={`nav-link ${isActive(link.path) ? 'active' : ''}`}
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                {/* Mobile Toggle */}
                <div className="mobile-toggle">
                    <button onClick={toggleMenu} aria-label="Toggle menu">
                        {isOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <div className={`mobile-menu ${isOpen ? 'open' : ''}`}>
                <button
                    className="absolute top-6 right-6 text-white p-2"
                    onClick={() => setIsOpen(false)}
                    aria-label="Close menu"
                    style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', zIndex: 1001 }}
                >
                    <X size={32} />
                </button>
                <div className="mobile-menu-inner">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            className={`mobile-nav-link ${isActive(link.path) ? 'active' : ''}`}
                            onClick={() => setIsOpen(false)}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <Link to="/book" className="btn btn-primary mt-8" onClick={() => setIsOpen(false)}>
                        Book Now
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
