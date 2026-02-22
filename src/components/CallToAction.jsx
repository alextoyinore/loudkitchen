import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Utensils } from 'lucide-react';

const CallToAction = () => {
    return (
        <section className="section relative overflow-hidden py-32 md:py-48 font-outfit">
            {/* Background Image with Dark Overlay */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=2000"
                    alt="Premium Ambiance"
                    className="w-full h-full object-cover grayscale-[0.8] brightness-[0.2]"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#080808] via-transparent to-[#080808]"></div>
            </div>

            {/* Ambient effects */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[160px] pointer-events-none z-10"></div>

            <div className="container relative z-10 text-center">
                <div className="inline-flex items-center gap-2 bg-accent/20 px-4 py-1.5 rounded-full border border-accent/30 mb-8 backdrop-blur-sm">
                    <Utensils size={14} className="text-accent" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-accent">Join the Pulse</span>
                </div>
                <h2 className="text-5xl md:text-8xl font-black uppercase leading-[0.9] tracking-tighter mb-10 italic text-white">
                    Ready to turn up <br />
                    <span className="text-accent">the volume?</span>
                </h2>
                <Link
                    to="/menu"
                    className="btn bg-accent text-black font-black uppercase tracking-[0.2em] text-xs py-5 px-10 md:px-12 rounded-full shadow-2xl shadow-accent/40 hover:scale-110 active:scale-95 transition-all flex sm:inline-flex items-center justify-center gap-3 whitespace-nowrap w-full sm:w-auto mx-auto"
                >
                    Explore the Menu <ArrowRight size={18} />
                </Link>
            </div>
        </section>
    );
};

export default CallToAction;
