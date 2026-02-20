import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import logo from '../assets/logo.png';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();
    const { cartCount } = useCart();

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
        { name: 'Reviews', path: '/reviews' },
        { name: 'Blog', path: '/blog' },
        { name: 'About', path: '/about' },
        { name: 'Contact', path: '/contact' },
    ];

    const isActive = (path) => location.pathname === path;

    const isHome = location.pathname === '/';

    return (
        <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`} style={{
            left: isHome ? '0' : 'var(--page-margin, 0)',
            right: isHome ? '0' : 'var(--page-margin, 0)'
        }}>
            <div className="container navbar-inner">
                <Link to="/" className="logo">
                    <img src={logo} alt="LoudKitchen" style={{ height: '40px', width: 'auto', display: 'block' }} />
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

                    <Link to="/cart" className="relative p-2 text-white hover:text-accent transition-all duration-300 ml-4 flex items-center group">
                        <ShoppingBag size={24} className="group-hover:scale-110 transition-transform" />
                        {cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-[0_0_12px_rgba(220,38,38,0.4)]">
                                {cartCount}
                            </span>
                        )}
                    </Link>
                </div>

                {/* Mobile Toggle */}
                <div className="mobile-toggle flex items-center gap-4">
                    <Link to="/cart" className="relative p-2 text-white flex items-center">
                        <ShoppingBag size={24} />
                        {cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-[0_0_12px_rgba(220,38,38,0.4)]">
                                {cartCount}
                            </span>
                        )}
                    </Link>
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
