import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Star, MessageSquare, Send, X, Loader2, CheckCircle2 } from 'lucide-react';

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

    const StarRating = ({ rating, setRating, interactive = false }) => (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map(star => (
                <Star
                    key={star}
                    size={interactive ? 24 : 16}
                    fill={star <= rating ? 'var(--color-accent, #e8b86d)' : 'transparent'}
                    color={star <= rating ? 'var(--color-accent, #e8b86d)' : '#444'}
                    style={{ cursor: interactive ? 'pointer' : 'default' }}
                    onClick={() => interactive && setRating(star)}
                />
            ))}
        </div>
    );

    return (
        <div className="reviews-page min-h-screen bg-primary">
            {/* Header */}
            <div className="py-20 bg-secondary text-center relative overflow-hidden">
                <div className="container relative z-10">
                    <h1 className="text-5xl md:text-6xl mb-4">Guest <span className="text-accent">Reviews</span></h1>
                    <p className="max-w-xl mx-auto text-gray-400 mb-8">
                        Your feedback helps us create better experiences. Read what our guests have to say or share your own story.
                    </p>
                    <button
                        onClick={() => setShowForm(true)}
                        className="btn btn-primary flex items-center gap-2 mx-auto"
                    >
                        <MessageSquare size={18} /> Write a Review
                    </button>
                </div>
                <div className="absolute top-0 left-0 w-full h-full bg-accent opacity-5 transform rotate-3 scale-110 origin-top-left"></div>
            </div>

            <div className="container section">
                {loading ? (
                    <div className="text-center py-20 text-gray-500">Loading reviews...</div>
                ) : reviews.length === 0 ? (
                    <div className="text-center py-20 text-gray-500">No reviews yet. Be the first to tell us what you think!</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {reviews.map(review => (
                            <div key={review.id} className="bg-secondary p-8 rounded-2xl border border-white/5 hover:border-accent/20 transition-all duration-300">
                                <div className="flex justify-between items-start mb-4">
                                    <StarRating rating={review.rating} />
                                    <span className="text-xs text-gray-600">{new Date(review.created_at).toLocaleDateString()}</span>
                                </div>
                                <p className="text-gray-300 mb-6 italic leading-relaxed">"{review.feedback}"</p>
                                <div className="flex items-center gap-3">
                                    {/* <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold">
                                        {review.name[0].toUpperCase()}
                                    </div> */}
                                    <h4 className="font-bold text-white uppercase tracking-wider text-sm">{review.name}</h4>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal Form */}
            {showForm && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
                    <div className="bg-secondary w-full max-w-2xl md:max-w-xl lg:max-w-lg mx-auto rounded-3xl p-8 border border-white/10 relative">
                        <button
                            onClick={() => setShowForm(false)}
                            className="absolute top-6 right-6 text-gray-500 hover:text-white"
                        >
                            <X size={24} />
                        </button>

                        <h2 className="text-3xl font-heading mb-2">Write a <span className="text-accent">Review</span></h2>
                        <p className="text-gray-400 mb-8 text-sm">Tell us about your experience at LoudKitchen.</p>

                        {error && <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl mb-6 text-sm">{error}</div>}

                        {submitted ? (
                            <div className="text-center py-12">
                                <CheckCircle2 size={64} className="text-green-500 mx-auto mb-4" />
                                <h3 className="text-2xl font-bold mb-2">Thank You!</h3>
                                <p className="text-gray-400">Your review has been submitted successfully.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Name</label>
                                        <input
                                            type="text" required
                                            className="w-full bg-primary border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-accent transition-colors"
                                            value={form.name}
                                            onChange={e => setForm({ ...form, name: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Email</label>
                                        <input
                                            type="email" required
                                            className="w-full bg-primary border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-accent transition-colors"
                                            value={form.email}
                                            onChange={e => setForm({ ...form, email: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Rating</label>
                                    <StarRating rating={form.rating} setRating={r => setForm({ ...form, rating: r })} interactive={true} />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Your Feedback</label>
                                    <textarea
                                        required rows="4"
                                        className="w-full bg-primary border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-accent transition-colors resize-none"
                                        value={form.feedback}
                                        onChange={e => setForm({ ...form, feedback: e.target.value })}
                                    />
                                </div>

                                <button
                                    disabled={submitting}
                                    className="w-full btn btn-primary flex items-center justify-center gap-2 py-4"
                                >
                                    {submitting ? <><Loader2 size={18} className="animate-spin" /> Submitting...</> : <><Send size={18} /> Submit Review</>}
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
