import React from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
    const { siteSettings } = useData();

    return (
        <footer style={{ backgroundColor: 'var(--bg-secondary)', padding: '4rem 0 2rem', marginTop: 'auto' }}>
            <div className="container grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>

                {/* Brand */}
                <div className="footer-col">
                    <h3 className="text-accent" style={{ marginBottom: '1.5rem' }}>LOUDKITCHEN</h3>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                        Experience the fusion of culinary art and vibrant atmosphere.
                        Where taste meets sound.
                    </p>
                    <div className="socials flex gap-4">
                        {siteSettings?.facebook && <a href={siteSettings.facebook} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-accent transition-colors"><Facebook size={20} /></a>}
                        {siteSettings?.instagram && <a href={siteSettings.instagram} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-accent transition-colors"><Instagram size={20} /></a>}
                        {siteSettings?.twitter && <a href={siteSettings.twitter} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-accent transition-colors"><Twitter size={20} /></a>}
                    </div>
                </div>

                {/* Quick Links */}
                <div className="footer-col">
                    <h4>Explore</h4>
                    <ul style={{ listStyle: 'none' }}>
                        <li className="mb-2"><Link to="/menu">Our Menu</Link></li>
                        <li className="mb-2"><Link to="/gallery">Gallery</Link></li>
                        <li className="mb-2"><Link to="/blog">Blog</Link></li>
                        <li className="mb-2"><Link to="/staff">Meet the Team</Link></li>
                    </ul>
                </div>

                {/* Contact */}
                <div className="footer-col">
                    <h4 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '1.5rem', fontWeight: '600' }}>Contact Us</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div className="flex items-start gap-3" style={{ color: 'var(--text-secondary)' }}>
                            <MapPin size={18} className="text-accent" style={{ marginTop: '3px', flexShrink: 0 }} />
                            <span style={{ fontSize: '0.95rem', lineHeight: '1.5' }}>{siteSettings?.address || 'Loading...'}</span>
                        </div>
                        <div className="flex items-center gap-3" style={{ color: 'var(--text-secondary)' }}>
                            <Phone size={18} className="text-accent" style={{ flexShrink: 0 }} />
                            <span style={{ fontSize: '0.95rem' }}>{siteSettings?.phone || ''}</span>
                        </div>
                        <div className="flex items-center gap-3" style={{ color: 'var(--text-secondary)' }}>
                            <Mail size={18} className="text-accent" style={{ flexShrink: 0 }} />
                            <span style={{ fontSize: '0.95rem' }}>{siteSettings?.contact_email || ''}</span>
                        </div>
                    </div>
                </div>

                {/* Hours */}
                <div className="footer-col">
                    <h4>Opening Hours</h4>
                    <ul style={{ listStyle: 'none', color: 'var(--text-secondary)' }}>
                        <li className="flex justify-between mb-1">
                            <span>Mon - Thu:</span>
                            <span>17:00 - 23:00</span>
                        </li>
                        <li className="flex justify-between mb-1">
                            <span>Fri - Sat:</span>
                            <span>17:00 - 01:00</span>
                        </li>
                        <li className="flex justify-between mb-1">
                            <span>Sunday:</span>
                            <span>16:00 - 22:00</span>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="text-center mt-8 pt-8" style={{ borderTop: '1px solid var(--bg-tertiary)', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                <p>&copy; {new Date().getFullYear()} Loudkitchen. All rights reserved.</p>
                <div className="mt-2">
                    <Link to="/admin" style={{ opacity: 0.5, fontSize: '0.8rem' }}>Admin Access</Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
