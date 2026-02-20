import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ChevronLeft, ShieldCheck } from 'lucide-react';

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
            <div className="min-h-screen bg-primary flex flex-col items-center justify-center text-white px-4 relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[160px] pointer-events-none"></div>
                <div className={`relative z-10 flex flex-col items-center text-center transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                    <div className="w-24 h-24 bg-secondary rounded-3xl mb-8 flex items-center justify-center border border-gray-800 shadow-2xl">
                        <ShoppingBag size={36} className="text-gray-500" />
                    </div>
                    <h2 className="text-4xl font-heading font-bold mb-3 tracking-tight text-white">Cart is empty</h2>
                    <p className="text-gray-500 mb-8 max-w-xs text-sm leading-relaxed">
                        Browse our menu and add something delicious to get started.
                    </p>
                    <Link to="/menu" className="btn btn-primary px-8 py-3 font-bold text-sm">
                        Browse Menu
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page bg-primary min-h-screen pt-28 pb-24 text-white">
            {/* Background accents */}
            <div className="fixed top-0 right-0 w-[35vw] h-[35vw] bg-accent/5 blur-[140px] pointer-events-none rounded-full"></div>
            <div className="fixed bottom-0 left-0 w-[25vw] h-[25vw] bg-accent/3 blur-[120px] pointer-events-none rounded-full"></div>

            <div className="container max-w-7xl px-4 md:px-8 mx-auto relative z-10">

                {/* Page Header */}
                <header className={`mb-12 transition-all duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-6 group text-xs font-bold uppercase tracking-widest"
                    >
                        <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                        Continue Shopping
                    </button>
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-gray-800 pb-8">
                        <h1 className="text-4xl md:text-5xl font-heading font-black tracking-tight">
                            Your <span className="text-accent">Order</span>
                        </h1>
                        <span className="text-gray-500 text-xs font-bold uppercase tracking-widest">
                            {totalItems} {totalItems === 1 ? 'Item' : 'Items'}
                        </span>
                    </div>
                </header>

                <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">

                    {/* Left: Item Cards */}
                    <div className="flex flex-col gap-10 min-w-0 divide-y divide-gray-800/60">
                        {cart.map((item, index) => (
                            <div
                                key={item.id}
                                className={`group py-6 flex sm:flex-col gap-6 transition-all duration-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                                style={{ transitionDelay: `${index * 60}ms` }}
                            >
                                {/* Thumbnail */}
                                <Link
                                    to={`/menu/${item.id}`}
                                    className="relative h-32 w-32 flex-0 hidden md:block flex-shrink-0 overflow-hidden bg-secondary rounded-lg overflow-hidden border border-gray-800 group-hover:border-accent/30 transition-colors block"
                                >
                                    <img
                                        src={item.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80'}
                                        alt={item.name}
                                        className="w-full h-full aspect-square object-cover group-hover:scale-105 transition-all duration-500"
                                    />
                                </Link>

                                {/* Content */}
                                <div className="flex flex-col flex-1 justify-start">
                                    <div className="flex justify-between items-start gap-6">
                                        <div className="flex-1 min-w-0">
                                            <Link
                                                to={`/menu/${item.id}`}
                                                className="text-lg md:text-xl font-heading font-bold text-white hover:text-accent transition-colors leading-tight block truncate"
                                            >
                                                {item.name}
                                            </Link>
                                            {item.description && (
                                                <p className="text-gray-500 text-sm mt-1 line-clamp-1">{item.description}</p>
                                            )}
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            <p className="font-heading font-bold text-xl text-white">
                                                ₦{(item.price * item.quantity).toLocaleString()}
                                            </p>
                                            <p className="text-xs text-gray-600 mt-0.5">
                                                ₦{item.price.toLocaleString()} each
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between mt-5">
                                        {/* Quantity stepper */}
                                        <div className="flex items-center gap-6 p-2 bg-secondary border border-gray-800 rounded-xl overflow-hidden">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                disabled={item.quantity <= 1}
                                                className="w-12 h-12 flex items-center rounded-full justify-center text-gray-400 hover:text-white hover:bg-white/5 disabled:opacity-30 transition-colors"
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span className="w-10 text-center font-bold text-sm text-white border-x border-gray-800">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="w-12 h-12 flex items-center rounded-full justify-center text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>

                                        {/* Remove */}
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="flex items-center gap-1.5 text-xs font-semibold p-2 text-gray-600 hover:text-red-400 transition-colors py-1.5 px-3 rounded-lg hover:bg-red-500/10"
                                        >
                                            <Trash2 size={13} />
                                            <span>Remove</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Right: Order Summary */}
                    <div className={`w-full lg:w-[360px] xl:w-[400px] flex-shrink-0 lg:sticky lg:top-28 h-fit transition-all duration-700 delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                        <div className="bg-secondary border border-gray-800 rounded-3xl p-8 relative overflow-hidden shadow-2xl">
                            {/* Subtle accent glow */}
                            <div className="absolute -top-8 -right-8 w-32 h-32 bg-accent/10 rounded-full blur-[40px] pointer-events-none"></div>

                            <h3 className="font-heading font-bold text-xl text-white mb-8">Order Summary</h3>

                            {/* Item list preview */}
                            <ul className="space-y-3 mb-6 pb-6 border-b border-gray-800">
                                {cart.map(item => (
                                    <li key={item.id} className="flex justify-between text-sm">
                                        <span className="text-gray-400 truncate flex-1 mr-4">
                                            <span className="text-gray-500 mr-2">×{item.quantity}</span>
                                            {item.name}
                                        </span>
                                        <span className="text-white font-semibold flex-shrink-0">₦{(item.price * item.quantity).toLocaleString()}</span>
                                    </li>
                                ))}
                            </ul>

                            <div className="space-y-3 mb-8">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Subtotal</span>
                                    <span className="text-white">₦{cartTotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Service charge</span>
                                    <span className="text-gray-500">—</span>
                                </div>
                                <div className="flex justify-between items-center pt-4">
                                    <span className="text-white font-bold">Total</span>
                                    <span className="font-heading font-black text-2xl text-accent">₦{cartTotal.toLocaleString()}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => navigate('/checkout')}
                                className="w-full btn btn-primary h-14 text-sm font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:-translate-y-0.5 transition-transform shadow-[0_8px_24px_rgba(212,175,55,0.25)] hover:shadow-[0_12px_32px_rgba(212,175,55,0.4)]"
                            >
                                Place Order <ArrowRight size={17} />
                            </button>

                            {/* <p className="text-[11px] text-center text-gray-600 mt-5 flex items-center justify-center gap-1.5">
                                <ShieldCheck size={12} /> Secure checkout
                            </p> */}
                        </div>

                        {/* Live kitchen status */}
                        <div className="mt-4 bg-secondary border border-gray-800 p-4 flex items-center gap-3">
                            <div className="relative flex-shrink-0 ml-1">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-ping absolute opacity-50"></div>
                                <div className="w-2 h-2 bg-green-500 rounded-full relative"></div>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-white">Kitchen is Open</p>
                                <p className="text-[10px] text-gray-500 mt-0.5">Est. prep time · 25–40 mins</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Cart;
