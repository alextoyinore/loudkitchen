import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { ArrowRight, Utensils } from 'lucide-react';

const Menu = () => {
    const { menuItems } = useData();
    const [activeCategory, setActiveCategory] = useState('All');

    // Get unique categories
    const categories = ['All', ...new Set(menuItems.map(item => item.category))];

    // Filter items
    const filteredItems = activeCategory === 'All'
        ? menuItems
        : menuItems.filter(item => item.category === activeCategory);

    return (
        <div className="menu-page bg-[#080808] min-h-screen pb-24 font-outfit relative overflow-hidden">
            {/* Header Section with Background */}
            <div className="relative pt-48 pb-32 mb-16 md:mb-24 overflow-hidden">
                {/* Background Image with Dark Overlay */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=2000"
                        alt="Menu Background"
                        className="w-full h-full object-cover grayscale-[0.8] brightness-[0.2]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#080808] via-transparent to-[#080808]"></div>
                </div>

                <div className="container relative z-10 px-4 max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div className="space-y-4">
                            <div className="w-12 h-1 bg-accent"></div>
                            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase leading-[0.9] tracking-tighter text-white">
                                THE <br />
                                <span className="text-accent italic">MENU</span>
                            </h1>
                        </div>
                        <p className="max-w-md text-gray-400 font-medium italic text-lg leading-relaxed">
                            A curated selection of rhythms and flavors, orchestrated for the discerning palate.
                        </p>
                    </div>
                </div>
            </div>

            {/* Ambient Background Blur (now starts after the image header) */}
            <div className="fixed top-0 right-0 w-[50vw] h-[50vw] bg-accent/5 blur-[160px] pointer-events-none rounded-full z-0"></div>
            <div className="fixed -bottom-20 -left-20 w-[40vw] h-[40vw] bg-white/5 blur-[140px] pointer-events-none rounded-full z-0"></div>

            <div className="container relative z-10 px-4 max-w-7xl mx-auto">
                {/* Categories */}
                <div className="flex flex-wrap gap-4 mb-16 overflow-x-auto pb-4 scrollbar-hide">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-8 py-3 rounded-full text-[10px] md:text-xs font-black uppercase tracking-[0.2em] transition-all duration-500 whitespace-nowrap border-2
                                ${activeCategory === cat
                                    ? 'bg-accent text-black border-accent'
                                    : 'bg-transparent text-gray-500 border-white/5 hover:border-white/20'}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Menu Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12">
                    {filteredItems.map(item => (
                        <Link
                            to={`/menu/${item.id}`}
                            key={item.id}
                            className="bg-secondary/30 backdrop-blur-xl rounded-[32px] md:rounded-[40px] overflow-hidden group border-2 border-white/5 hover:border-accent/20 transition-all duration-700 shadow-xl"
                        >
                            <div className="h-64 md:h-80 overflow-hidden relative">
                                <img src={item.image_url} alt={item.name} className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110" />
                                <div className="absolute top-6 right-6 bg-accent text-black font-black px-4 py-2 rounded-full text-[10px] md:text-xs shadow-xl">
                                    ₦{item.price.toLocaleString()}
                                </div>
                                {!item.is_available && (
                                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                                        <span className="text-white font-black uppercase tracking-[0.3em] text-[10px] border-2 border-white/20 px-6 py-2 rounded-full">Coming Back Soon</span>
                                    </div>
                                )}
                            </div>
                            <div className="p-8 md:p-10">
                                <p className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] text-accent mb-3">{item.category}</p>
                                <h3 className="text-2xl md:text-3xl font-black italic text-white mb-4 group-hover:text-accent transition-colors truncate uppercase leading-tight">{item.name}</h3>
                                <p className="text-gray-400 font-medium text-xs md:text-sm line-clamp-2 leading-relaxed italic">{item.description}</p>

                                <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-accent flex items-center gap-2 group-hover:translate-x-2 transition-transform">
                                        View Details <ArrowRight size={14} />
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {filteredItems.length === 0 && (
                    <div className="text-center py-24">
                        <p className="text-gray-500 font-bold italic">No items found in this category.</p>
                    </div>
                )}
            </div>

            {/* Dietary Note */}
            <div className="container text-center py-20 text-[10px] font-bold uppercase tracking-widest text-gray-600 px-6">
                <p className="mb-2">* Please inform our staff of any allergies or dietary restrictions.</p>
                <p>* Prices are subject to service charge and applicable taxes.</p>
            </div>
        </div>
    );
};

export default Menu;
