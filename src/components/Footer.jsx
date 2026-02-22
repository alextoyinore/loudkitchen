import React from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
    const { siteSettings } = useData();

    return (
        <footer className="footer bg-secondary pt-24 pb-12 mt-auto font-outfit border-t-2 border-white/5">
            <div className="container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">

                {/* Brand */}
                <div className="footer-col">
                    <div className="space-y-8">
                        <Link to="/" className="text-3xl font-black tracking-tighter inline-block">
                            LOUD<span className="text-accent italic">KITCHEN</span>
                        </Link>
                        <p className="text-gray-500 text-sm max-w-xs font-medium leading-relaxed italic">
                            Orchestrating the perfect blend of culinary art and vibrant atmosphere.
                        </p>
                    </div>
                    <div className="socials flex gap-5 mt-8">
                        {siteSettings?.facebook && <a href={siteSettings.facebook} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-gray-400 hover:text-accent hover:bg-accent/10 transition-all"><Facebook size={18} /></a>}
                        {siteSettings?.instagram && <a href={siteSettings.instagram} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-gray-400 hover:text-accent hover:bg-accent/10 transition-all"><Instagram size={18} /></a>}
                        {siteSettings?.twitter && <a href={siteSettings.twitter} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-gray-400 hover:text-accent hover:bg-accent/10 transition-all"><Twitter size={18} /></a>}
                    </div>
                </div>

                {/* Quick Links */}
                <div className="footer-col">
                    <h4 className="text-white font-bold uppercase tracking-widest text-[10px] mb-8">Explore</h4>
                    <ul className="space-y-4 font-bold text-gray-400">
                        <li><Link to="/menu" className="hover:text-accent transition-colors">Our Menu</Link></li>
                        <li><Link to="/reviews" className="hover:text-accent transition-colors">Reviews</Link></li>
                        <li><Link to="/blog" className="hover:text-accent transition-colors">Blog</Link></li>
                        <li><Link to="/staff" className="hover:text-accent transition-colors">Meet the Team</Link></li>
                    </ul>
                </div>

                {/* Contact */}
                <div className="footer-col">
                    <h4 className="text-white font-bold uppercase tracking-widest text-[10px] mb-8">Contact Us</h4>
                    <div className="space-y-6">
                        <div className="flex items-start gap-4 text-gray-400">
                            <MapPin size={18} className="text-accent shrink-0 mt-1" />
                            <span className="font-bold text-sm leading-relaxed">{siteSettings?.address || 'Loading...'}</span>
                        </div>
                        <div className="flex items-center gap-4 text-gray-400">
                            <Phone size={18} className="text-accent shrink-0" />
                            <span className="font-bold text-sm">{siteSettings?.phone || ''}</span>
                        </div>
                        <div className="flex items-center gap-4 text-gray-400">
                            <Mail size={18} className="text-accent shrink-0" />
                            <span className="font-bold text-sm">{siteSettings?.contact_email || ''}</span>
                        </div>
                    </div>
                </div>

                {/* Hours */}
                <div className="footer-col">
                    <h4 className="text-white font-bold uppercase tracking-widest text-[10px] mb-8">Opening Hours</h4>
                    <div className="text-gray-400 font-bold text-sm leading-relaxed">
                        {siteSettings?.opening_hours ? (
                            siteSettings.opening_hours.includes(',') ? (
                                <ul className="space-y-2">
                                    {siteSettings.opening_hours.split(',').map((line, i) => (
                                        <li key={i}>{line.trim()}</li>
                                    ))}
                                </ul>
                            ) : (
                                <p>{siteSettings.opening_hours}</p>
                            )
                        ) : (
                            <p>Loading hours...</p>
                        )}
                    </div>
                </div>
            </div>

            <div className="text-center mt-20 pt-10 border-t border-white/5 text-gray-600 font-bold text-[10px] uppercase tracking-[0.2em]">
                <p>&copy; {new Date().getFullYear()} Loudkitchen. Crafted with ❤️ </p>
                <div className="mt-4">
                    <Link to="/admin" className="opacity-40 hover:opacity-100 transition-opacity">Admin Access</Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
