import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { ArrowRight } from 'lucide-react';

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
        <div className="menu-page">
            {/* Header */}
            <div className="menu-header bg-secondary py-20 text-center relative overflow-hidden">
                <div className="container relative z-10">
                    <h1 className="text-5xl md:text-6xl mb-4">Our <span className="text-accent">Menu</span></h1>
                    <p className="max-w-xl mx-auto text-gray-400">
                        A curated selection of dishes prepared with passion and precision.
                    </p>
                </div>
                {/* Background decorative element */}
                <div className="absolute top-0 left-0 w-full h-full bg-accent opacity-5 transform rotate-3 scale-110 origin-top-left"></div>
            </div>

            <div className="container section">
                {/* Category Filter */}
                <div className="flex flex-wrap justify-center gap-4 mb-16">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-6 py-2 rounded-full border transition-all duration-300 ${activeCategory === cat
                                ? 'bg-accent border-accent text-black font-bold'
                                : 'bg-transparent border-gray-700 text-gray-300 hover:border-accent hover:text-accent'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Menu Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {filteredItems.map(item => (
                        <Link
                            to={`/menu/${item.id}`}
                            key={item.id}
                            className="bg-secondary rounded-xl overflow-hidden group hover:-translate-y-2 transition-all duration-300 block border border-transparent hover:border-gray-800"
                        >
                            {/* Image Container */}
                            <div className="relative h-64 overflow-hidden">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                {/* Price Overlay */}
                                <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 shadow-lg">
                                    <span className="text-accent font-bold text-lg">₦{item.price}</span>
                                </div>
                            </div>

                            {/* Content Container */}
                            <div className="p-6">
                                <div className="mb-4">
                                    <h3 className="text-2xl font-heading uppercase tracking-wide mb-2 group-hover:text-accent transition-colors">
                                        {item.name}
                                    </h3>
                                    <p className="text-gray-400 text-sm line-clamp-3 leading-relaxed">
                                        {item.description}
                                    </p>
                                </div>

                                <div className="flex justify-between items-center pt-4">
                                    <span className={`text-xs px-2.5 py-1 rounded-full ${item.available
                                        ? 'text-green-400 bg-green-500/10'
                                        : 'text-red-400 bg-red-500/10'
                                        }`}>
                                        {item.available ? 'In Stock' : 'Sold Out'}
                                    </span>

                                    <span className="text-accent text-sm font-medium flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                        Details <ArrowRight size={14} />
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {filteredItems.length === 0 && (
                    <div className="text-center py-20 text-gray-500">
                        <p>No items found in this category.</p>
                    </div>
                )}
            </div>

            {/* Dietary Note */}
            <div className="container text-center pb-20 text-sm text-gray-500">
                <p>* Please inform our staff of any allergies or dietary restrictions.</p>
                <p>* Prices are subject to service charge and applicable taxes.</p>
            </div>
        </div>
    );
};

export default Menu;
