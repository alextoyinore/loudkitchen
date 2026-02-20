import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const MenuCard = ({ item }) => {
    return (
        <div className="bg-secondary/30 backdrop-blur-md rounded-xl overflow-hidden group transition-all duration-500 hover:-translate-y-2 flex flex-col h-full shadow-lg relative">
            {/* Integrated Vertical Ribbon */}
            <div className="absolute top-0 left-0 z-20 h-10 w-1 bg-accent/80 group-hover:h-full transition-all duration-500"></div>

            {/* Image Section - Reduced Height */}
            <Link to={`/menu/${item.id}`} className="block relative h-52 overflow-hidden border-b border-white/5">
                <img
                    src={item.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80'}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />

                {/* Minimal Overlay on Hover */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                    <div className="bg-accent text-black p-2.5 rounded-full transform scale-75 group-hover:scale-100 transition-all duration-500">
                        <ChevronRight size={18} />
                    </div>
                </div>
            </Link>

            {/* Content Section - Tightened Padding */}
            <div className="p-5 flex flex-col flex-1">
                <div className="flex justify-between items-start gap-4 mb-2.5">
                    <Link to={`/menu/${item.id}`} className="text-lg font-bold text-white hover:text-accent transition-colors tracking-tight leading-tight font-heading">
                        {item.name}
                    </Link>
                    <div className="text-lg font-black text-accent whitespace-nowrap">
                        ₦{parseFloat(item.price).toLocaleString()}
                    </div>
                </div>

                <p className="text-gray-500 text-sm line-clamp-2 mb-6 flex-1 leading-relaxed font-medium opacity-60">
                    {item.description}
                </p>

                {/* Refined Footer - Integrated and borderless */}
                <div className="flex items-center justify-between mt-auto">
                    <span className="text-[10px] font-black tracking-[0.2em] text-gray-600 capitalize">
                        {item.category}
                    </span>

                    <Link
                        to={`/menu/${item.id}`}
                        className="flex items-center gap-1.5 bg-accent/10 hover:bg-accent text-accent hover:text-black px-4 py-2 rounded-lg transition-all duration-300 group/btn border border-accent/20 hover:border-transparent active:scale-95"
                    >
                        <span className="text-[10px] font-black tracking-widest whitespace-nowrap capitalize">Details</span>
                        <ChevronRight size={12} className="group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default MenuCard;
