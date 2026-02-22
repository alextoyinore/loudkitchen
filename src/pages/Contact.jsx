import React from 'react';
import { useData } from '../context/DataContext';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

const Contact = () => {
    const { siteSettings } = useData();

    return (
        <div className="contact-page bg-[#080808] min-h-screen pb-24 font-outfit relative overflow-hidden">
            {/* Header Section with Background */}
            <div className="relative pt-48 pb-32 mb-16 md:mb-24 overflow-hidden text-center">
                {/* Background Image with Dark Overlay */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1534536281715-e28d76689b4d?auto=format&fit=crop&q=80&w=2000"
                        alt="Contact Background"
                        className="w-full h-full object-cover grayscale-[0.8] brightness-[0.2]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#080808] via-transparent to-[#080808]"></div>
                </div>

                <div className="container relative z-10 px-4 max-w-7xl mx-auto">
                    <div className="w-12 h-1 bg-accent mx-auto mb-8"></div>
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase leading-[0.9] tracking-tighter text-white">
                        WAVE <br />
                        <span className="text-accent italic">HELLO</span>
                    </h1>
                    <p className="max-w-md mx-auto text-gray-400 font-medium italic text-lg leading-relaxed mt-10">
                        Whether it's a booking or a beat, we'd love to hear from you.
                    </p>
                </div>
            </div>

            {/* Ambient Background */}
            <div className="fixed top-0 right-0 w-[50vw] h-[50vw] bg-accent/3 blur-[160px] pointer-events-none rounded-full"></div>
            <div className="fixed -bottom-20 -left-20 w-[40vw] h-[40vw] bg-white/5 blur-[140px] pointer-events-none rounded-full"></div>

            <div className="container relative z-10 px-4 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
                    {/* Info */}
                    <div className="space-y-6">
                        <div className="flex gap-6 items-center bg-secondary/30 backdrop-blur-xl p-8 rounded-[32px] md:rounded-[40px] border-2 border-white/5 hover:border-accent/10 transition-all group shadow-xl">
                            <div className="bg-accent p-4 md:p-5 rounded-[20px] text-black shadow-xl group-hover:scale-105 transition-transform">
                                <MapPin size={24} />
                            </div>
                            <div>
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-accent mb-1 md:mb-2">Location</h3>
                                <p className="text-white font-bold italic text-base md:text-xl">{siteSettings?.address || 'Loading...'}</p>
                            </div>
                        </div>

                        <div className="flex gap-6 items-center bg-secondary/30 backdrop-blur-xl p-8 rounded-[32px] md:rounded-[40px] border-2 border-white/5 hover:border-accent/10 transition-all group shadow-xl">
                            <div className="bg-white/5 p-4 md:p-5 rounded-[20px] text-accent shadow-xl group-hover:scale-105 transition-transform">
                                <Phone size={24} />
                            </div>
                            <div>
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 mb-1 md:mb-2">Phone</h3>
                                <p className="text-white font-bold italic text-base md:text-lg">{siteSettings?.phone || ''}</p>
                            </div>
                        </div>

                        <div className="flex gap-6 items-center bg-secondary/30 backdrop-blur-xl p-8 rounded-[32px] md:rounded-[40px] border-2 border-white/5 hover:border-accent/10 transition-all group shadow-xl">
                            <div className="bg-white/5 p-4 md:p-5 rounded-[20px] text-accent shadow-xl group-hover:scale-105 transition-transform">
                                <Mail size={24} />
                            </div>
                            <div>
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 mb-1 md:mb-2">Email</h3>
                                <p className="text-white font-bold italic text-base md:text-lg">{siteSettings?.contact_email || siteSettings?.email || 'Loading...'}</p>
                            </div>
                        </div>

                        <div className="flex gap-6 items-center bg-secondary/30 backdrop-blur-xl p-8 rounded-[32px] md:rounded-[40px] border-2 border-white/5 hover:border-accent/10 transition-all group shadow-xl">
                            <div className="bg-white/5 p-4 md:p-5 rounded-[20px] text-accent shadow-xl group-hover:scale-105 transition-transform">
                                <Clock size={24} />
                            </div>
                            <div>
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 mb-1 md:mb-2">Hours</h3>
                                <div className="text-white font-bold italic text-xs md:text-sm">
                                    {siteSettings?.opening_hours ? (
                                        siteSettings.opening_hours.includes(',') ? (
                                            <ul className="space-y-0.5">
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
                    </div>

                    {/* Map Area */}
                    <div className="min-h-[400px] md:min-h-[500px] rounded-[32px] md:rounded-[40px] overflow-hidden border-2 border-white/5 relative group shadow-2xl bg-secondary/30 backdrop-blur-xl flex flex-col items-center justify-center p-8 md:p-12 text-center">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent/5 rounded-full blur-3xl pointer-events-none"></div>

                        <div className="relative mb-8 w-24 h-24 md:w-32 md:h-32 flex items-center justify-center">
                            <MapPin size={48} className="text-accent relative z-10" />
                        </div>

                        <h3 className="text-2xl md:text-3xl font-black italic text-white mb-4 uppercase">Our Location</h3>
                        <p className="text-gray-500 font-medium italic mb-10 max-w-xs text-sm md:text-base">{siteSettings?.address || 'Discover our vibrant space where taste meets sound.'}</p>

                        <div className="inline-flex items-center gap-2 bg-white/5 px-6 py-2.5 rounded-full border border-white/10">
                            <span className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] text-gray-500">Live Map Coming Soon</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
