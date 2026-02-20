import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ChevronLeft } from 'lucide-react';

const Cart = () => {
    const { cart, updateQuantity, removeFromCart, cartTotal } = useCart();
    const navigate = useNavigate();

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-primary flex flex-col items-center justify-center text-white px-4 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-accent rounded-full blur-[120px]"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent rounded-full blur-[150px]"></div>
                </div>

                <div className="relative z-10 flex flex-col items-center">
                    <div className="bg-secondary/50 backdrop-blur-xl p-16 rounded-full mb-10 border border-white/5 shadow-2xl">
                        <ShoppingBag size={80} className="text-gray-700" />
                    </div>
                    <h2 className="text-4xl font-bold mb-4 tracking-tight">Your cart is empty</h2>
                    <p className="text-gray-400 mb-10 max-w-sm text-center text-lg leading-relaxed">
                        Delicious moments are just a few clicks away. Explore our menu and start your order.
                    </p>
                    <Link to="/menu" className="btn btn-primary px-10 py-4 text-lg font-bold hover:scale-105 transition-transform">
                        Explore Our Menu
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page bg-primary min-h-screen pt-32 pb-24 relative">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-accent/5 blur-[120px] pointer-events-none"></div>

            <div className="container relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
                    <div>
                        <button
                            onClick={() => navigate('/menu')}
                            className="flex items-center gap-2 text-gray-500 hover:text-accent transition-colors mb-4 group"
                        >
                            <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                            <span>Continue Browsing</span>
                        </button>
                        <h1 className="text-5xl md:text-6xl font-heading font-bold">Your <span className="text-accent">Order</span></h1>
                    </div>
                    <div className="bg-secondary/50 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/5">
                        <span className="text-gray-400 mr-2">Items in Cart:</span>
                        <span className="text-white font-bold text-xl">{cart.reduce((a, b) => a + b.quantity, 0)}</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Cart Items */}
                    <div className="lg:col-span-8 space-y-8">
                        {cart.map(item => (
                            <div key={item.id} className="bg-secondary/40 backdrop-blur-md p-6 rounded-3xl border border-white/5 flex flex-col md:flex-row gap-8 items-center group hover:border-accent/20 transition-all duration-300">
                                <Link to={`/menu/${item.id}`} className="w-32 h-32 rounded-2xl overflow-hidden flex-shrink-0 shadow-xl">
                                    <img
                                        src={item.image_url || 'https://via.placeholder.com/150'}
                                        alt={item.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                </Link>

                                <div className="flex-1 text-center md:text-left">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
                                        <Link to={`/menu/${item.id}`} className="text-2xl font-bold text-white hover:text-accent transition-colors">
                                            {item.name}
                                        </Link>
                                        <div className="text-accent font-bold text-xl">
                                            ₦{(item.price * item.quantity).toLocaleString()}
                                        </div>
                                    </div>
                                    <p className="text-gray-400 text-sm line-clamp-2 mb-6 max-w-xl">{item.description}</p>

                                    <div className="flex items-center justify-center md:justify-between gap-6">
                                        <div className="flex items-center bg-primary/50 border border-white/10 rounded-xl p-1.5 min-w-[140px] justify-between">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/5 hover:text-accent transition-all"
                                                disabled={item.quantity <= 1}
                                            >
                                                <Minus size={18} />
                                            </button>
                                            <span className="w-8 text-center font-bold text-lg">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/5 hover:text-accent transition-all"
                                            >
                                                <Plus size={18} />
                                            </button>
                                        </div>

                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="text-gray-500 hover:text-red-500 transition-all duration-300 flex items-center gap-2 group/remove"
                                            title="Remove item"
                                        >
                                            <Trash2 size={20} className="group-hover/remove:rotate-12 transition-transform" />
                                            <span className="text-sm font-medium">Remove</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Summary */}
                    <div className="lg:col-span-4">
                        <div className="bg-secondary p-10 rounded-[32px] border border-accent/10 sticky top-32 shadow-2xl shadow-accent/5">
                            <h3 className="text-2xl font-bold mb-8 text-white border-b border-white/5 pb-4">Order Summary</h3>

                            <div className="space-y-5 mb-10">
                                <div className="flex justify-between text-gray-400 text-lg">
                                    <span>Subtotal</span>
                                    <span className="text-white">₦{cartTotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-gray-400 text-lg">
                                    <span>Preparation Time</span>
                                    <span className="text-white">~30 mins</span>
                                </div>
                                <div className="pt-6 mt-6 border-t border-white/5 flex justify-between items-end">
                                    <span className="text-xl font-bold text-white">Total</span>
                                    <div className="text-right">
                                        <div className="text-accent text-4xl font-black">₦{cartTotal.toLocaleString()}</div>
                                        <div className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">VAT Included</div>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => navigate('/checkout')}
                                className="w-full btn btn-primary py-5 flex items-center justify-center gap-3 text-xl font-bold shadow-xl shadow-accent/20 hover:-translate-y-1 transition-all"
                            >
                                Proceed to Checkout <ArrowRight size={22} />
                            </button>

                            <div className="mt-8 flex items-center justify-center gap-4 py-4 bg-white/5 rounded-2xl border border-white/5">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                <p className="text-sm font-medium text-gray-400">Kitchen is currently active</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
