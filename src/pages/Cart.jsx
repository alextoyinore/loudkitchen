import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ChevronLeft, Clock, ShieldCheck, CreditCard } from 'lucide-react';

const Cart = () => {
    const { cart, updateQuantity, removeFromCart, cartTotal } = useCart();
    const navigate = useNavigate();
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-white px-4 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[160px]"></div>
                </div>

                <div className={`relative z-10 flex flex-col items-center text-center transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <div className="w-24 h-24 bg-white/5 backdrop-blur-3xl rounded-3xl mb-8 flex items-center justify-center border border-white/10 shadow-2xl relative group">
                        <ShoppingBag size={32} className="text-gray-500 group-hover:text-accent transition-colors duration-500" />
                        <div className="absolute -inset-1 bg-accent/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4 tracking-tight text-white">Your cart is empty</h2>
                    <p className="text-gray-400 mb-8 max-w-xs text-sm font-medium leading-relaxed opacity-70">
                        Looks like you haven't added anything to your cart yet.
                    </p>
                    <Link to="/menu" className="px-8 py-3 rounded-full bg-white text-black font-bold text-sm hover:bg-gray-200 transition-colors">
                        Browse Menu
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page bg-[#050505] min-h-screen pt-32 pb-24 text-white selection:bg-accent selection:text-black">
            {/* Background Atmosphere */}
            <div className="fixed top-0 right-0 w-[40vw] h-[40vw] bg-accent/5 blur-[150px] pointer-events-none"></div>
            <div className="fixed bottom-0 left-0 w-[30vw] h-[30vw] bg-accent/3 blur-[120px] pointer-events-none"></div>

            <div className="container max-w-7xl px-4 md:px-8 mx-auto relative z-10">
                <header className={`mb-12 transition-all duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
                    <button
                        onClick={() => navigate('/menu')}
                        className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-6 group text-xs font-bold uppercase tracking-widest"
                    >
                        <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                        Back to Menu
                    </button>
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
                        <h1 className="text-4xl md:text-6xl font-heading font-black tracking-tighter text-white">
                            Your <span className="text-accent">Order</span>
                        </h1>
                        <p className="text-gray-500 font-mono text-xs uppercase tracking-widest">
                            {cart.reduce((a, b) => a + b.quantity, 0)} Items Selected
                        </p>
                    </div>
                </header>

                <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">

                    {/* Left Column: Card-Based List (Flex-grow) */}
                    <div className="flex-1 lg:min-w-0 space-y-6">
                        {cart.map((item, index) => (
                            <div
                                key={item.id}
                                className={`group bg-white/[0.03] backdrop-blur-md border border-white/5 rounded-3xl p-4 flex flex-col sm:flex-row gap-6 hover:bg-white/[0.05] hover:border-white/10 transition-all duration-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                                style={{ transitionDelay: `${index * 50}ms` }}
                            >
                                {/* Thumbnail */}
                                <div className="relative w-full sm:w-32 aspect-[4/3] sm:aspect-square flex-shrink-0 bg-white/5 rounded-2xl overflow-hidden">
                                    <Link to={`/menu/${item.id}`} className="block w-full h-full">
                                        <img
                                            src={item.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80'}
                                            alt={item.name}
                                            className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                                        />
                                    </Link>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent sm:hidden"></div>
                                </div>

                                {/* Content */}
                                <div className="flex-1 flex flex-col justify-between py-1">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <Link to={`/menu/${item.id}`} className="text-xl font-heading font-bold text-white hover:text-accent transition-colors leading-tight">
                                                {item.name}
                                            </Link>
                                            <p className="text-sm text-gray-400 mt-1 line-clamp-1 font-medium max-w-md">
                                                {item.description}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-heading font-bold text-lg text-white">
                                                ₦{(item.price * item.quantity).toLocaleString()}
                                            </p>
                                            <p className="text-xs text-gray-500 font-mono">
                                                ₦{item.price.toLocaleString()} / ea
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between mt-4 sm:mt-0">
                                        {/* Quantity Control (Consistent with Menu) */}
                                        <div className="flex items-center gap-1 bg-black/40 rounded-xl p-1 border border-white/10">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                disabled={item.quantity <= 1}
                                                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 text-gray-400 hover:text-white disabled:opacity-30 transition-colors"
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span className="w-8 text-center font-bold text-sm text-white">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>

                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-red-400 transition-colors px-3 py-2 rounded-lg hover:bg-red-500/10"
                                        >
                                            <Trash2 size={14} />
                                            <span className="hidden sm:inline">Remove</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Right Column: Sticky Sidebar (Fixed Width) */}
                    <div className={`w-full lg:w-[380px] flex-shrink-0 lg:sticky lg:top-32 h-fit transition-all duration-700 delay-300 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
                        <div className="bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/10 p-8 rounded-[2rem] relative shadow-2xl">
                            {/* Decorative Blur */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-[60px] opacity-20 pointer-events-none"></div>

                            <h3 className="font-heading font-bold text-xl text-white mb-6 flex items-center gap-3">
                                Summary
                                <span className="h-[1px] flex-1 bg-white/10"></span>
                            </h3>

                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500 font-medium">Subtotal</span>
                                    <span className="font-mono text-white">₦{cartTotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500 font-medium">Service Fee</span>
                                    <span className="font-mono text-gray-500">Included</span>
                                </div>
                                <div className="flex justify-between items-center text-sm pt-4 border-t border-white/5">
                                    <span className="text-white font-bold">Total</span>
                                    <span className="font-heading font-black text-2xl text-accent">₦{cartTotal.toLocaleString()}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => navigate('/checkout')}
                                className="w-full bg-accent hover:bg-white text-black h-16 rounded-xl text-sm font-black uppercase tracking-widest hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 shadow-[0_10px_30px_-10px_rgba(212,175,55,0.3)] hover:shadow-[0_20px_40px_-10px_rgba(212,175,55,0.5)]"
                            >
                                Proceed to Checkout <ArrowRight size={18} />
                            </button>

                            <div className="mt-6 flex items-center justify-center gap-2 text-[10px] text-gray-600 font-bold uppercase tracking-widest">
                                <ShieldCheck size={12} /> Secure Checkout
                            </div>
                        </div>

                        {/* Live Kitchen Badge */}
                        <div className="mt-6 bg-white/[0.03] backdrop-blur-md p-5 rounded-2xl border border-white/5 flex items-center gap-4">
                            <div className="relative flex-shrink-0">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-ping absolute opacity-40"></div>
                                <div className="w-2 h-2 bg-green-500 rounded-full relative"></div>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-white uppercase tracking-wider mb-0.5">Kitchen is Live</p>
                                <p className="text-[9px] text-gray-500">Estimated prep time: ~35 mins</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
