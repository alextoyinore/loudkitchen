import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useCart } from '../context/CartContext';
import { ArrowLeft, Clock, ShoppingBag, Share2, Check, Utensils } from 'lucide-react';

const DishDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { menuItems } = useData();
    const { addToCart } = useCart();
    const [added, setAdded] = useState(false);

    const dish = menuItems.find(item => String(item.id) === id);

    if (!dish) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#080808] text-white font-outfit">
                <h2 className="text-3xl font-black mb-8 uppercase tracking-tighter">Dish not found</h2>
                <button
                    onClick={() => navigate('/menu')}
                    className="px-8 py-3 bg-accent text-black rounded-full font-black uppercase tracking-widest text-xs hover:scale-105 transition-all"
                >
                    Back to Menu
                </button>
            </div>
        );
    }

    const handleAddToCart = () => {
        addToCart(dish, 1);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    return (
        <div className="dish-detail-page bg-[#080808] min-h-screen pt-32 pb-24 font-outfit relative overflow-hidden">
            {/* Ambient Background */}
            <div className="fixed top-0 right-0 w-[50vw] h-[50vw] bg-accent/3 blur-[160px] pointer-events-none rounded-full"></div>
            <div className="fixed -bottom-20 -left-20 w-[40vw] h-[40vw] bg-white/5 blur-[140px] pointer-events-none rounded-full"></div>

            <div className="container relative z-10 px-4 max-w-7xl mx-auto">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center gap-2 text-gray-400 hover:text-accent transition-colors mb-12 group"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Back to Menu</span>
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-stretch">
                    {/* Left Column: Image */}
                    <div className="relative group">
                        <div className="rounded-[32px] md:rounded-[40px] overflow-hidden border-2 border-white/5 shadow-2xl relative bg-secondary aspect-square md:aspect-video lg:aspect-square">
                            <img
                                src={dish.image_url}
                                alt={dish.name}
                                className="w-full h-full object-cover grayscale-[0.2] transition-transform duration-1000 group-hover:scale-105 group-hover:grayscale-0"
                            />
                        </div>
                        <div className="absolute top-6 right-6 bg-accent text-black font-black px-6 py-3 rounded-full text-sm md:text-lg shadow-2xl">
                            ₦{dish.price.toLocaleString()}
                        </div>
                    </div>

                    {/* Right Column: Details */}
                    <div className="flex flex-col justify-center space-y-10">
                        <div>
                            <div className="inline-flex items-center gap-2 bg-accent/5 px-4 py-1.5 rounded-full border border-accent/10 mb-6">
                                <Utensils size={14} className="text-accent" />
                                <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-accent">{dish.category}</span>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-black italic mb-6 uppercase leading-[0.9] tracking-tighter text-white">
                                {dish.name}
                            </h1>
                            <div className="flex flex-wrap items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
                                <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/5">
                                    <Clock size={14} className="text-accent" />
                                    <span>20 Mins Prep</span>
                                </div>
                                {!dish.is_available && (
                                    <div className="flex items-center gap-2 bg-red-500/10 text-red-500 px-4 py-2 rounded-full border border-red-500/20">
                                        <span>Sold Out</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-accent">Experience</h3>
                            <p className="text-gray-400 font-medium italic text-base md:text-lg leading-relaxed">
                                {dish.description}
                                <br /><br />
                                <span className="text-gray-500 text-sm">
                                    Our chefs recommend pairing this with a light white wine or our signature cocktail to fully unlock the flavor profile.
                                </span>
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={handleAddToCart}
                                disabled={!dish.is_available}
                                className={`flex-[2] py-5 font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 transition-all duration-500 text-[10px] rounded-full shadow-2xl
                                    ${added
                                        ? 'bg-success text-black'
                                        : 'bg-accent text-black hover:scale-[1.02] active:scale-[0.98]'
                                    } disabled:opacity-50 disabled:grayscale`}
                            >
                                {added ? (
                                    <>
                                        <Check size={18} />
                                        Added to Feast
                                    </>
                                ) : (
                                    <>
                                        <ShoppingBag size={18} />
                                        Add to My Feast
                                    </>
                                )}
                            </button>

                            <button
                                className="flex-1 w-full bg-white/5 text-white py-5 rounded-full flex items-center justify-center gap-3 hover:bg-white/10 transition-all font-black uppercase tracking-widest text-[10px] border border-white/10"
                                onClick={() => {
                                    if (navigator.share) {
                                        navigator.share({
                                            title: dish.name,
                                            text: dish.description,
                                            url: window.location.href,
                                        }).catch(console.error);
                                    } else {
                                        navigator.clipboard.writeText(window.location.href);
                                        alert('Link copied to clipboard!');
                                    }
                                }}
                            >
                                <Share2 size={16} />
                                Share
                            </button>
                        </div>

                        {added && (
                            <p className="text-[10px] text-center font-black uppercase tracking-widest text-success animate-fade-in">
                                Item secured. <Link to="/cart" className="underline underline-offset-4">Browse your feast</Link>
                            </p>
                        )}
                    </div>
                </div>

                <div className="mt-20 pt-10 border-t border-white/5 text-center">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-700">
                        * All items are prepared fresh to order. Please notify us of any dietary requirements.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default DishDetail;
