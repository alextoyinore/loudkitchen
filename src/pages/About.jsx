import React from 'react';
import { Heart, Utensils } from 'lucide-react';

const About = () => {
    return (
        <div className="about-page bg-[#080808] min-h-screen pb-24 font-outfit relative overflow-hidden">
            {/* Header Section with Background */}
            <div className="relative pt-48 pb-32 mb-16 md:mb-24 overflow-hidden">
                {/* Background Image with Dark Overlay */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=2000"
                        alt="About Background"
                        className="w-full h-full object-cover grayscale-[0.8] brightness-[0.2]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#080808] via-transparent to-[#080808]"></div>
                </div>

                <div className="container relative z-10 px-4 max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div className="space-y-4">
                            <div className="w-12 h-1 bg-accent"></div>
                            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase leading-[0.9] tracking-tighter text-white">
                                OUR <br />
                                <span className="text-accent italic">STORY</span>
                            </h1>
                        </div>
                        <p className="max-w-md text-gray-400 font-medium italic text-lg leading-relaxed">
                            A journey of passion, pulse, and precision. Where every note and flavor counts.
                        </p>
                    </div>
                </div>
            </div>

            {/* Ambient Background */}
            <div className="fixed top-0 right-0 w-[50vw] h-[50vw] bg-accent/3 blur-[160px] pointer-events-none rounded-full"></div>
            <div className="fixed -bottom-20 -left-20 w-[40vw] h-[40vw] bg-white/5 blur-[140px] pointer-events-none rounded-full"></div>

            <div className="container relative z-10 px-4 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-center">
                    <div className="relative group order-2 lg:order-1">
                        <div className="absolute -inset-4 bg-accent/10 rounded-[40px] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="relative rounded-[40px] overflow-hidden border-2 border-white/5 shadow-2xl aspect-square md:aspect-video lg:aspect-square">
                            <img
                                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1200"
                                alt="Restaurant Interior"
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 grayscale-[0.2] group-hover:grayscale-0"
                            />
                        </div>
                    </div>

                    <div className="space-y-8 md:space-y-12 order-1 lg:order-2">
                        <div className="space-y-6">
                            <h2 className="text-3xl md:text-5xl font-black italic uppercase leading-none tracking-tight text-white">The <span className="text-accent">Philosophy</span></h2>
                            <p className="text-gray-400 font-medium text-base md:text-lg leading-relaxed italic">
                                LoudKitchen isn't just a restaurant; it's a movement. We believe that food and sound are the two most powerful universal languages. By fusing premium culinary expertise with a pulse-raising atmosphere, we create experiences that resonate deep within.
                            </p>
                            <p className="text-gray-400 font-medium leading-relaxed max-w-xl italic">
                                Founded with the vision to bridge the gap between high-end gastronomy and vibrant nightlife, we've crafted a sanctuary for those who crave more than just a meal.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-6 md:gap-10">
                            <div>
                                <h4 className="text-accent font-black uppercase tracking-widest text-xs mb-2">Sound</h4>
                                <p className="text-gray-500 text-sm italic">Curated rhythms for every mood.</p>
                            </div>
                            <div>
                                <h4 className="text-accent font-black uppercase tracking-widest text-xs mb-2">Taste</h4>
                                <p className="text-gray-500 text-sm italic">Precision in every ingredient.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
