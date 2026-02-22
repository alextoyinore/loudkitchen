import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Star, MessageSquare, Send, X, Loader2, CheckCircle2 } from 'lucide-react';
import ReviewCard from '../components/ReviewCard';

const Reviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');
    const [form, setForm] = useState({ name: '', email: '', rating: 5, feedback: '' });

    const fetchReviews = async () => {
        const { data, error } = await supabase
            .from('reviews')
            .select('*')
            .order('created_at', { ascending: false });
        if (!error) setReviews(data || []);
        setLoading(false);
    };

    useEffect(() => { fetchReviews(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);
        const { error: err } = await supabase.from('reviews').insert([form]);
        setSubmitting(false);
        if (err) { setError(err.message); return; }
        setSubmitted(true);
        setForm({ name: '', email: '', rating: 5, feedback: '' });
        fetchReviews();
        setTimeout(() => { setSubmitted(false); setShowForm(false); }, 3000);
    };

    return (
        <div className="reviews-page min-h-screen bg-primary font-outfit">
            {/* Header Section with Background */}
            <div className="relative min-h-[60vh] flex items-center justify-center mb-16 overflow-hidden">
                {/* Background Image with Dark Overlay */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&q=80&w=2000"
                        alt="Reviews Background"
                        className="w-full h-full object-cover grayscale-[0.8] brightness-[0.2]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#080808] via-transparent to-[#080808]"></div>
                </div>

                <div className="container relative z-10 px-4 max-w-7xl mx-auto text-center pt-40 pb-20">
                    <div className="inline-flex items-center gap-2 bg-accent/10 px-4 py-1.5 rounded-full border border-accent/20 mb-8 backdrop-blur-sm">
                        <Star size={14} className="text-accent" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-accent">Guest Stories</span>
                    </div>
                    <h1 className="text-5xl md:text-8xl font-black uppercase leading-[0.9] tracking-tighter text-white mb-6 italic">
                        Voice of <br />
                        <span className="text-accent">LoudKitchen</span>
                    </h1>
                    <p className="max-w-xl mx-auto text-gray-400 font-medium italic text-lg leading-relaxed mb-10">
                        Your insights orchestrate our progress. Read the pulse of our community or share your own rhythm.
                    </p>
                    <button
                        onClick={() => setShowForm(true)}
                        className="btn bg-accent text-black font-black uppercase tracking-[0.2em] text-xs py-5 px-10 md:px-16 rounded-full shadow-2xl shadow-accent/20 hover:scale-110 active:scale-95 transition-all flex items-center justify-center gap-3 whitespace-nowrap w-full sm:w-auto mx-auto"
                    >
                        <MessageSquare size={18} className="flex-shrink-0" /> <span className="whitespace-nowrap">Write a Review</span>
                    </button>
                </div>
            </div>

            <div className="container section px-4 max-w-7xl mx-auto">
                {loading ? (
                    <div className="text-center py-20 text-gray-500 font-bold italic">Loading reviews...</div>
                ) : reviews.length === 0 ? (
                    <div className="text-center py-20 text-gray-500 font-bold italic">No reviews yet. Be the first to tell us what you think!</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {reviews.map(review => (
                            <ReviewCard key={review.id} review={review} showDate={true} />
                        ))}
                    </div>
                )}
            </div>

            {/* Modal Form */}
            {showForm && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-black/90 backdrop-blur-md">
                    <div className="bg-secondary w-full max-w-2xl mx-auto rounded-[40px] p-8 md:p-12 border-2 border-white/5 relative shadow-2xl">
                        <button
                            onClick={() => setShowForm(false)}
                            className="absolute top-8 right-8 text-gray-500 hover:text-white transition-colors"
                        >
                            <X size={24} />
                        </button>

                        <h2 className="text-3xl md:text-4xl font-black italic uppercase mb-2 text-white">Share Your <span className="text-accent">Pulse</span></h2>
                        <p className="text-gray-400 font-medium italic mb-10 text-sm">Tell us about your experience at LoudKitchen.</p>

                        {error && <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl mb-8 text-xs font-bold uppercase tracking-widest">{error}</div>}

                        {submitted ? (
                            <div className="text-center py-12">
                                <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-green-500/20">
                                    <CheckCircle2 size={40} className="text-green-500" />
                                </div>
                                <h3 className="text-2xl font-black italic uppercase text-white mb-2">Thank You!</h3>
                                <p className="text-gray-400 font-medium italic">Your review has been submitted successfully.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 ml-4">Name</label>
                                        <input
                                            type="text" required
                                            className="w-full bg-primary/50 border-2 border-white/5 rounded-3xl px-6 py-4 outline-none focus:border-accent transition-all font-medium text-white"
                                            value={form.name}
                                            onChange={e => setForm({ ...form, name: e.target.value })}
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 ml-4">Email</label>
                                        <input
                                            type="email" required
                                            className="w-full bg-primary/50 border-2 border-white/5 rounded-3xl px-6 py-4 outline-none focus:border-accent transition-all font-medium text-white"
                                            value={form.email}
                                            onChange={e => setForm({ ...form, email: e.target.value })}
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 ml-4">Rating</label>
                                    <div className="flex gap-3 ml-4">
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <Star
                                                key={star}
                                                size={28}
                                                fill={star <= form.rating ? 'var(--accent-color, #d4af37)' : 'transparent'}
                                                color={star <= form.rating ? 'var(--accent-color, #d4af37)' : '#333'}
                                                className="cursor-pointer transition-transform hover:scale-110 active:scale-95"
                                                onClick={() => setForm({ ...form, rating: star })}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 ml-4">Your Experience</label>
                                    <textarea
                                        required rows="4"
                                        className="w-full bg-primary/50 border-2 border-white/5 rounded-[32px] px-6 py-5 outline-none focus:border-accent transition-all font-medium text-white resize-none italic"
                                        value={form.feedback}
                                        onChange={e => setForm({ ...form, feedback: e.target.value })}
                                        placeholder="How was the rhythm of the night?"
                                    />
                                </div>

                                <button
                                    disabled={submitting}
                                    className="w-full btn bg-accent text-black font-black uppercase tracking-[0.2em] text-xs py-5 rounded-full shadow-2xl shadow-accent/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                                >
                                    {submitting ? <><Loader2 size={18} className="animate-spin" /> Harmonizing...</> : <><Send size={18} /> Submit Review</>}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Reviews;
