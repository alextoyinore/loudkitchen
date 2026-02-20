import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { supabase } from '../lib/supabase';
import { CheckCircle2, ChevronLeft, CreditCard, Loader2, Truck, Timer, ShieldCheck } from 'lucide-react';

const Checkout = () => {
    const { cart, cartTotal, clearCart } = useCart();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [orderComplete, setOrderComplete] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        notes: ''
    });

    if (cart.length === 0 && !orderComplete) {
        navigate('/cart');
        return null;
    }

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 1. Create Order
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

            // 2. Create Order Items
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

            // 3. Complete
            setOrderComplete(true);
            clearCart();
        } catch (error) {
            console.error("Order failed", error);
            alert("Sorry, something went wrong with your order. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (orderComplete) {
        return (
            <div className="min-h-screen bg-primary flex flex-col items-center justify-center text-white px-4 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent rounded-full blur-[180px]"></div>
                </div>

                <div className="relative z-10 flex flex-col items-center">
                    <div className="bg-green-500/10 p-20 rounded-full mb-10 border border-green-500/20 shadow-2xl shadow-green-500/10">
                        <CheckCircle2 size={80} className="text-green-500" />
                    </div>
                    <h2 className="text-5xl font-bold mb-6 tracking-tight">Order Received!</h2>
                    <p className="text-gray-400 mb-12 max-w-xl text-center text-xl leading-relaxed">
                        Thank you for choosing <span className="text-white font-bold">LoudKitchen</span>. Our chefs are already getting to work! We'll contact you at <span className="text-accent font-bold">{formData.phone}</span> once your meal is ready.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-6 w-full max-w-md">
                        <Link to="/menu" className="flex-1 btn btn-primary py-5 text-center font-bold text-lg hover:scale-105 transition-all">
                            Back to Menu
                        </Link>
                        <Link to="/" className="flex-1 btn btn-outline py-5 text-center font-bold text-lg hover:bg-white/5 transition-all">
                            Return Home
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="checkout-page bg-primary min-h-screen pt-32 pb-24 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-accent/5 blur-[150px] pointer-events-none"></div>

            <div className="container max-w-6xl relative z-10">
                <button
                    onClick={() => navigate('/cart')}
                    className="flex items-center gap-2 text-gray-500 hover:text-accent mb-12 transition-colors group"
                >
                    <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="font-medium">Return to Cart</span>
                </button>

                <h1 className="text-5xl md:text-6xl font-heading font-bold mb-16">Finalize Your <span className="text-accent">Order</span></h1>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    {/* User Info */}
                    <div className="lg:col-span-7 space-y-12">
                        <section>
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-10 h-10 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent font-bold">1</div>
                                <h3 className="text-2xl font-bold text-white">Contact Information</h3>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-500 uppercase tracking-widest mb-3">Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="John Doe"
                                        className="w-full bg-secondary/40 backdrop-blur-md border border-white/5 rounded-2xl px-6 py-5 text-white focus:border-accent/40 focus:ring-1 focus:ring-accent/40 focus:outline-none transition-all placeholder:text-gray-600"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-500 uppercase tracking-widest mb-3">Email Address</label>
                                        <input
                                            type="email"
                                            name="email"
                                            required
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="john@example.com"
                                            className="w-full bg-secondary/40 backdrop-blur-md border border-white/5 rounded-2xl px-6 py-5 text-white focus:border-accent/40 focus:ring-1 focus:ring-accent/40 focus:outline-none transition-all placeholder:text-gray-600"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-500 uppercase tracking-widest mb-3">Phone Number</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            required
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="080 0000 0000"
                                            className="w-full bg-secondary/40 backdrop-blur-md border border-white/5 rounded-2xl px-6 py-5 text-white focus:border-accent/40 focus:ring-1 focus:ring-accent/40 focus:outline-none transition-all placeholder:text-gray-600"
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section>
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-10 h-10 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent font-bold">2</div>
                                <h3 className="text-2xl font-bold text-white">Preference & Notes</h3>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-500 uppercase tracking-widest mb-3">Special Instructions (Optional)</label>
                                <textarea
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleChange}
                                    rows="4"
                                    placeholder="Any allergies, spice level preferences, or delivery instructions?"
                                    className="w-full bg-secondary/40 backdrop-blur-md border border-white/5 rounded-2xl px-6 py-5 text-white focus:border-accent/40 focus:ring-1 focus:ring-accent/40 focus:outline-none transition-all resize-none placeholder:text-gray-600"
                                ></textarea>
                            </div>
                        </section>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-white/5">
                            <div className="flex flex-col items-center text-center p-6 bg-secondary/20 rounded-3xl border border-white/5">
                                <Timer className="text-accent mb-3" size={32} />
                                <h4 className="text-white font-bold mb-1">Fast Prep</h4>
                                <p className="text-xs text-gray-500">~25-40 min</p>
                            </div>
                            <div className="flex flex-col items-center text-center p-6 bg-secondary/20 rounded-3xl border border-white/5">
                                <Truck className="text-accent mb-3" size={32} />
                                <h4 className="text-white font-bold mb-1">Pickup/Delivery</h4>
                                <p className="text-xs text-gray-500">Available Now</p>
                            </div>
                            <div className="flex flex-col items-center text-center p-6 bg-secondary/20 rounded-3xl border border-white/5">
                                <ShieldCheck className="text-accent mb-3" size={32} />
                                <h4 className="text-white font-bold mb-1">Secure</h4>
                                <p className="text-xs text-gray-500">Safe Handling</p>
                            </div>
                        </div>
                    </div>

                    {/* Payment & Summary */}
                    <div className="lg:col-span-5">
                        <div className="sticky top-32 space-y-8">
                            <div className="bg-secondary p-10 rounded-[40px] border border-white/5 shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 blur-[60px]"></div>

                                <h3 className="text-2xl font-bold text-white mb-8">Summary</h3>

                                <div className="space-y-4 mb-8 max-h-64 overflow-y-auto pr-4 custom-scrollbar">
                                    {cart.map(item => (
                                        <div key={item.id} className="flex justify-between items-center group">
                                            <div className="flex-1">
                                                <p className="text-white font-medium group-hover:text-accent transition-colors">{item.name}</p>
                                                <p className="text-xs text-gray-500 italic">Qty: {item.quantity}</p>
                                            </div>
                                            <span className="text-accent/80 font-bold ml-4">₦{(item.price * item.quantity).toLocaleString()}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-4 pt-8 border-t border-white/5">
                                    <div className="flex justify-between text-gray-400">
                                        <span>Order Subtotal</span>
                                        <span>₦{cartTotal.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-400">
                                        <span>Estimated VAT</span>
                                        <span>₦0.00</span>
                                    </div>
                                    <div className="flex justify-between items-end pt-4">
                                        <span className="text-xl font-bold text-white">Grand Total</span>
                                        <span className="text-3xl font-black text-accent">₦{cartTotal.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-accent p-10 rounded-[40px] shadow-2xl shadow-accent/20 relative group">
                                <div className="absolute top-4 right-8 opacity-20 group-hover:opacity-40 transition-opacity">
                                    <CreditCard size={120} />
                                </div>

                                <h3 className="text-2xl font-bold text-black mb-4 flex items-center gap-3">
                                    Payment
                                </h3>
                                <p className="text-black/70 text-sm mb-10 leading-relaxed font-medium">
                                    Currently we only support **Pay on Pick-up/Delivery** or Bank Transfer at the location.
                                </p>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-black text-white hover:bg-neutral-900 py-6 rounded-2xl flex items-center justify-center gap-4 text-xl font-black shadow-2xl transition-all hover:-translate-y-1 active:scale-95 disabled:opacity-70"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="animate-spin" size={24} />
                                            Confirming Order...
                                        </>
                                    ) : (
                                        'Place Order Now'
                                    )}
                                </button>

                                <p className="text-black/40 text-[10px] text-center mt-6 font-bold uppercase tracking-widest">
                                    Secure Ordering Process
                                </p>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Checkout;
