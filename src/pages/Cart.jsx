import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ChevronLeft } from 'lucide-react';

const Cart = () => {
    const { cart, updateQuantity, removeFromCart, cartTotal } = useCart();
    const navigate = useNavigate();
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    const totalItems = cart.reduce((a, b) => a + b.quantity, 0);

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-[#080808] flex flex-col items-center justify-center text-white px-4 font-outfit relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[160px] pointer-events-none"></div>
                <div className={`relative z-10 flex flex-col items-center text-center transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <div className="w-24 h-24 md:w-32 md:h-32 bg-secondary/30 backdrop-blur-xl rounded-[32px] md:rounded-[40px] mb-10 flex items-center justify-center border-2 border-white/5 shadow-2xl">
                        <ShoppingBag size={40} className="text-accent" />
                    </div>
                    <h2 className="text-4xl md:text-7xl font-black italic mb-6 tracking-tighter uppercase leading-none">Your <span className="text-accent">Feast</span></h2>
                    <p className="text-gray-500 font-medium italic mb-12 max-w-sm text-base md:text-lg">
                        Your cart sits waiting. Orchestrate your culinary rhythm.
                    </p>
                    <Link to="/menu" className="bg-accent text-black font-black uppercase tracking-[0.2em] text-[10px] md:text-xs py-5 px-12 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all">
                        Explore Menu
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page bg-[#080808] min-h-screen pb-24 text-white font-outfit relative overflow-hidden">
            {/* Header Section with Background */}
            <div className="relative pt-48 pb-32 mb-16 md:mb-24 overflow-hidden">
                {/* Background Image with Dark Overlay */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1556742044-3c52d6e88c62?auto=format&fit=crop&q=80&w=2000"
                        alt="Cart Background"
                        className="w-full h-full object-cover grayscale-[0.8] brightness-[0.2]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#080808] via-transparent to-[#080808]"></div>
                </div>

                <div className="container max-w-7xl px-4 md:px-8 mx-auto relative z-10">
                    <header className={`transition-all duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
                        <button
                            onClick={() => navigate(-1)}
                            className="inline-flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-10 group text-[10px] font-black uppercase tracking-[0.3em]"
                        >
                            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                            Return to Menu
                        </button>
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-12">
                            <div className="space-y-4">
                                <div className="w-12 h-1 bg-accent"></div>
                                <h1 className="text-5xl md:text-8xl font-black uppercase italic leading-[0.9] tracking-tighter">
                                    YOUR <br />
                                    <span className="text-accent italic">FEAST</span>
                                </h1>
                            </div>
                            <p className="text-gray-400 font-medium italic text-lg">{totalItems} curated items</p>
                        </div>
                    </header>
                </div>
            </div>

            {/* Ambient Background */}
            <div className="fixed top-0 right-0 w-[50vw] h-[50vw] bg-accent/3 blur-[160px] pointer-events-none rounded-full"></div>
            <div className="fixed -bottom-20 -left-20 w-[40vw] h-[40vw] bg-white/5 blur-[140px] pointer-events-none rounded-full"></div>

            <div className="container max-w-7xl px-4 md:px-8 mx-auto relative z-10">
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
                    {/* Left: Item List */}
                    <div className="flex-1 space-y-12">
                        {cart.map((item, index) => (
                            <div
                                key={item.id}
                                className={`group flex flex-col sm:flex-row gap-8 transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                                style={{ transitionDelay: `${index * 50}ms` }}
                            >
                                {/* Thumbnail */}
                                <Link
                                    to={`/menu/${item.id}`}
                                    className="relative h-40 w-full sm:w-40 flex-shrink-0 bg-secondary/30 rounded-[32px] overflow-hidden border-2 border-white/5 group-hover:border-accent/20 transition-all duration-700 block shadow-xl"
                                >
                                    <img
                                        src={item.image_url}
                                        alt={item.name}
                                        className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-transform duration-1000 group-hover:scale-105"
                                    />
                                </Link>

                                {/* Content */}
                                <div className="flex flex-col flex-1 py-1">
                                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                                        <div className="flex-1">
                                            <p className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] text-accent mb-2">{item.category}</p>
                                            <Link
                                                to={`/menu/${item.id}`}
                                                className="text-2xl md:text-3xl font-black italic text-white hover:text-accent transition-colors leading-tight uppercase"
                                            >
                                                {item.name}
                                            </Link>
                                        </div>
                                        <div className="text-left sm:text-right">
                                            <p className="text-xl md:text-2xl font-black italic text-white uppercase">
                                                ₦{(item.price * item.quantity).toLocaleString()}
                                            </p>
                                            <p className="text-[9px] font-black uppercase tracking-widest text-gray-600 mt-1">
                                                ₦{item.price.toLocaleString()} each
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/5">
                                        <div className="flex items-center gap-4 bg-white/5 p-1 rounded-full border border-white/5">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                disabled={item.quantity <= 1}
                                                className="w-8 h-8 md:w-10 md:h-10 flex items-center rounded-full justify-center text-gray-500 hover:text-black hover:bg-accent disabled:opacity-20 transition-all"
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span className="w-6 text-center font-black text-xs md:text-sm text-white">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="w-8 h-8 md:w-10 md:h-10 flex items-center rounded-full justify-center text-gray-500 hover:text-black hover:bg-accent transition-all"
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>

                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="text-[9px] font-black uppercase tracking-widest text-gray-600 hover:text-red-500 transition-colors flex items-center gap-2"
                                        >
                                            <Trash2 size={12} />
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Right: Order Summary */}
                    <div className={`w-full lg:w-[400px] h-fit lg:sticky lg:top-32 transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
                        <div className="bg-secondary/30 backdrop-blur-xl border-2 border-white/5 rounded-[40px] p-8 md:p-10 shadow-2xl">
                            <h3 className="text-xl font-black italic text-white mb-10 uppercase tracking-tight">The Bill</h3>

                            <div className="space-y-4 mb-10 pb-8 border-b border-white/5">
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-500">
                                    <span>Subtotal</span>
                                    <span className="text-white">₦{cartTotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-500">
                                    <span>Service</span>
                                    <span className="text-green-500 tracking-normal">Calculated at next step</span>
                                </div>
                                <div className="flex justify-between items-center pt-8">
                                    <span className="text-xs font-black uppercase tracking-[0.2em] text-white">Total Feast</span>
                                    <span className="text-3xl font-black italic text-accent">₦{cartTotal.toLocaleString()}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => navigate('/checkout')}
                                className="w-full bg-accent text-black py-6 rounded-full text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-accent/10"
                            >
                                Secure My Feast <ArrowRight size={16} />
                            </button>
                        </div>

                        <div className="mt-8 p-6 bg-secondary/20 rounded-[32px] border border-white/5 flex items-center gap-4">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-white">Kitchen Status</p>
                                <p className="text-[9px] font-bold text-gray-500 italic mt-0.5">Vibrant & Ready · 25–40 mins</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
