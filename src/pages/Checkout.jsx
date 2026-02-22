import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { supabase } from '../lib/supabase';
import {
    CheckCircle2,
    ChevronLeft,
    Loader2,
    Timer,
    ShieldCheck,
    ShoppingBag,
    ArrowRight,
    Utensils,
    Info,
    Check
} from 'lucide-react';

const Checkout = () => {
    const { cart, cartTotal, clearCart } = useCart();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [orderComplete, setOrderComplete] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        notes: ''
    });

    useEffect(() => {
        setIsLoaded(true);
        if (cart.length === 0 && !orderComplete) {
            navigate('/cart');
        }
    }, [cart.length, navigate, orderComplete]);

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data: order, error: orderError } = await supabase
                .from('orders')
                .insert([{
                    customer_name: formData.name,
                    customer_email: formData.email,
                    customer_phone: formData.phone,
                    total_amount: cartTotal,
                    notes: formData.notes,
                    status: 'pending'
                }])
                .select()
                .single();

            if (orderError) throw orderError;

            const orderItems = cart.map(item => ({
                order_id: order.id,
                item_id: item.id,
                item_name: item.name,
                quantity: item.quantity,
                unit_price: item.price,
                subtotal: item.price * item.quantity
            }));

            const { error: itemsError } = await supabase
                .from('order_items')
                .insert(orderItems);

            if (itemsError) throw itemsError;

            setOrderComplete(true);
            clearCart();
        } catch (error) {
            console.error("Order failed", error);
            alert("Order failed. Please check your connection and try again.");
        } finally {
            setLoading(false);
        }
    };

    if (orderComplete) {
        return (
            <div className="min-h-screen bg-[#080808] flex flex-col items-center justify-center text-white px-4 relative overflow-hidden font-outfit">
                {/* Ambient Background */}
                <div className="fixed top-0 right-0 w-[50vw] h-[50vw] bg-accent/3 blur-[160px] pointer-events-none rounded-full"></div>
                <div className="fixed -bottom-20 -left-20 w-[40vw] h-[40vw] bg-white/5 blur-[140px] pointer-events-none rounded-full"></div>

                <div className={`relative z-10 flex flex-col items-center max-w-xl text-center transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <div className="w-24 h-24 bg-success p-6 rounded-[32px] md:rounded-[40px] mb-10 shadow-[0_0_50px_rgba(34,197,94,0.3)] flex items-center justify-center text-black">
                        <Check size={48} />
                    </div>

                    <h2 className="text-4xl md:text-7xl font-black mb-6 uppercase tracking-tighter italic leading-none">
                        ORDER <span className="text-accent">SECURED</span>
                    </h2>
                    <p className="text-gray-500 text-base md:text-lg leading-relaxed mb-12 font-medium italic">
                        Your rhythm is now in our kitchen. We'll contact you at <span className="text-white font-bold">{formData.phone}</span> once the feast is ready.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 w-full">
                        <Link to="/menu" className="flex-1 bg-accent text-black h-16 rounded-full flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] hover:scale-[1.02] transition-all shadow-xl">
                            Explore More <ArrowRight size={16} />
                        </Link>
                        <Link to="/" className="flex-1 bg-white/5 text-white h-16 rounded-full flex items-center justify-center text-[10px] font-black uppercase tracking-[0.2em] border border-white/10 hover:bg-white/10 transition-all">
                            Back to Studio
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="checkout-page bg-[#080808] min-h-screen pb-40 relative overflow-hidden font-outfit text-white">
            {/* Header Section with Background */}
            <div className="relative pt-28 pb-32 mb-16 md:mb-24 overflow-hidden">
                {/* Background Image with Dark Overlay */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=2000"
                        alt="Checkout Background"
                        className="w-full h-full object-cover grayscale-[0.8] brightness-[0.2]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#080808] via-transparent to-[#080808]"></div>
                </div>

                <div className="container max-w-7xl px-4 mx-auto relative z-10 text-center">
                    <button
                        onClick={() => navigate('/cart')}
                        className="inline-flex items-center gap-2 text-gray-500 hover:text-white mb-10 transition-colors group text-[10px] font-black uppercase tracking-[0.3em]"
                    >
                        <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        Modify Feast
                    </button>
                    <div className="w-12 h-1 bg-accent mx-auto mb-8"></div>
                    <h1 className="text-5xl md:text-8xl font-black uppercase italic leading-[0.9] tracking-tighter mb-8 text-white">
                        FINAL <br />
                        <span className="text-accent italic">VALSES</span>
                    </h1>
                    <p className="max-w-md mx-auto text-gray-400 font-medium italic text-lg leading-relaxed">
                        Complete your selection and let the kitchen begin its work.
                    </p>
                </div>
            </div>

            {/* Ambient Background */}
            <div className="fixed top-0 right-0 w-[50vw] h-[50vw] bg-accent/3 blur-[160px] pointer-events-none rounded-full"></div>
            <div className="fixed -bottom-20 -left-20 w-[40vw] h-[40vw] bg-white/5 blur-[140px] pointer-events-none rounded-full"></div>

            <div className={`container max-w-7xl px-4 mx-auto relative z-10 transition-all duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
                    {/* Left Column: Details */}
                    <div className="lg:col-span-7 space-y-12">
                        <div className="space-y-12">
                            {/* Contact Info */}
                            <div className="space-y-8">
                                <div className="flex items-center gap-4 border-b border-white/5 pb-4">
                                    <span className="text-[10px] font-black text-accent uppercase tracking-[0.3em]">01. Contact</span>
                                </div>
                                <div className="space-y-6">
                                    <div className="group">
                                        <p className="text-[9px] font-black text-gray-600 uppercase tracking-[0.2em] mb-3 ml-4">Full Name</p>
                                        <input
                                            type="text"
                                            name="name"
                                            required
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="Michael Scott"
                                            className="w-full bg-white/5 border border-white/5 rounded-full px-8 py-5 text-white focus:border-accent/40 focus:outline-none transition-all placeholder:text-gray-500 text-sm font-bold"
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="group">
                                            <p className="text-[9px] font-black text-gray-600 uppercase tracking-[0.2em] mb-3 ml-4">Email</p>
                                            <input
                                                type="email"
                                                name="email"
                                                required
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder="scott@dundermifflin.com"
                                                className="w-full bg-white/5 border border-white/5 rounded-full px-8 py-5 text-white focus:border-accent/40 focus:outline-none transition-all placeholder:text-gray-500 text-sm font-bold"
                                            />
                                        </div>
                                        <div className="group">
                                            <p className="text-[9px] font-black text-gray-600 uppercase tracking-[0.2em] mb-3 ml-4">Phone</p>
                                            <input
                                                type="tel"
                                                name="phone"
                                                required
                                                value={formData.phone}
                                                onChange={handleChange}
                                                placeholder="0800 000 0000"
                                                className="w-full bg-white/5 border border-white/5 rounded-full px-8 py-5 text-white focus:border-accent/40 focus:outline-none transition-all placeholder:text-gray-500 text-sm font-bold"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Special Requests */}
                            <div className="space-y-8">
                                <div className="flex items-center gap-4 border-b border-white/5 pb-4">
                                    <span className="text-[10px] font-black text-accent uppercase tracking-[0.3em]">02. Requests</span>
                                </div>
                                <div className="group">
                                    <p className="text-[9px] font-black text-gray-600 uppercase tracking-[0.2em] mb-3 ml-4">Any dietary notes?</p>
                                    <textarea
                                        name="notes"
                                        value={formData.notes}
                                        onChange={handleChange}
                                        rows="4"
                                        placeholder="Extra heat, no allergens, or a birthday shoutout..."
                                        className="w-full bg-white/5 border border-white/5 rounded-[32px] px-8 py-6 text-white focus:border-accent/40 focus:outline-none transition-all resize-none placeholder:text-gray-500 text-sm font-bold italic"
                                    ></textarea>
                                </div>
                            </div>
                        </div>

                        {/* Badges */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div className="bg-secondary/20 p-6 rounded-[32px] border border-white/5 text-center">
                                <Timer className="text-accent mx-auto mb-3" size={24} />
                                <p className="text-[10px] font-black uppercase tracking-widest text-white">~40 min</p>
                            </div>
                            <div className="bg-secondary/20 p-6 rounded-[32px] border border-white/5 text-center">
                                <ShoppingBag className="text-accent mx-auto mb-3" size={24} />
                                <p className="text-[10px] font-black uppercase tracking-widest text-white">Live Status</p>
                            </div>
                            <div className="hidden md:block bg-secondary/20 p-6 rounded-[32px] border border-white/5 text-center">
                                <Utensils className="text-accent mx-auto mb-3" size={24} />
                                <p className="text-[10px] font-black uppercase tracking-widest text-white">Freshly Orchestrated</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Summary */}
                    <div className="lg:col-span-5 h-fit lg:sticky lg:top-32">
                        <div className="bg-secondary/30 backdrop-blur-xl border-2 border-white/5 rounded-[40px] p-8 md:p-10 shadow-2xl space-y-10">
                            <div>
                                <h3 className="text-xl font-black italic text-white mb-8 uppercase tracking-tight">Your Feast</h3>
                                <div className="space-y-4 max-h-48 overflow-y-auto pr-4 custom-scrollbar">
                                    {cart.map(item => (
                                        <div key={item.id} className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <p className="text-white font-bold text-sm uppercase">{item.name}</p>
                                                <p className="text-[9px] text-gray-600 font-black uppercase tracking-widest mt-1">×{item.quantity}</p>
                                            </div>
                                            <span className="text-white font-bold text-sm">₦{(item.price * item.quantity).toLocaleString()}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4 pt-8 border-t border-white/5">
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-600">
                                    <span>Subtotal</span>
                                    <span className="text-white">₦{cartTotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-600">
                                    <span>Service</span>
                                    <span className="text-accent italic tracking-normal">Complimentary</span>
                                </div>
                                <div className="flex items-end justify-between pt-6">
                                    <span className="text-xs font-black uppercase tracking-[0.2em] text-white">Total</span>
                                    <span className="text-4xl font-black italic text-accent">₦{cartTotal.toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="p-6 bg-white/5 rounded-[24px] border border-white/5">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Info size={14} className="text-gray-500" />
                                        <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">Payment</span>
                                    </div>
                                    <p className="text-xs font-bold text-white mb-1">Pay on Arrival</p>
                                    <p className="text-[10px] font-medium text-gray-600 italic leading-relaxed">Cash, Card, or Transfer at our station.</p>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-accent text-black h-20 rounded-full flex items-center justify-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="animate-spin" size={20} />
                                            Wait a moment
                                        </>
                                    ) : (
                                        <>
                                            Secure My Feast <ArrowRight size={18} />
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Checkout;
