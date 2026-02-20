import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Trash2, Star, CheckCircle, XCircle, Search, Filter, Loader2, MessageSquare } from 'lucide-react';

const ReviewManager = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all');
    const [error, setError] = useState('');

    const fetchReviews = async () => {
        const { data, error } = await supabase
            .from('reviews')
            .select('*')
            .order('created_at', { ascending: false });
        if (!error) setReviews(data || []);
        setLoading(false);
    };

    useEffect(() => { fetchReviews(); }, []);

    const toggleFeatured = async (id, currentStatus) => {
        const { error } = await supabase
            .from('reviews')
            .update({ is_featured: !currentStatus })
            .eq('id', id);
        if (!error) fetchReviews();
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this review?')) return;
        const { error } = await supabase.from('reviews').delete().eq('id', id);
        if (!error) fetchReviews();
    };

    const filteredReviews = reviews.filter(r => {
        const matchesSearch = r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.feedback.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filter === 'all' ? true :
            filter === 'featured' ? r.is_featured :
                !r.is_featured;
        return matchesSearch && matchesFilter;
    });

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#fff' }}>Review Manager</h1>
                    <p style={{ color: '#666', fontSize: '0.875rem', marginTop: '0.2rem' }}>{reviews.length} total reviews</p>
                </div>
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', flex: 1, maxWidth: '300px' }}>
                    <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#555' }} />
                    <input
                        style={{ width: '100%', background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '8px', padding: '0.65rem 1rem 0.65rem 2.5rem', color: '#fff', fontSize: '0.9rem', outline: 'none' }}
                        placeholder="Search reviews..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {['all', 'featured', 'standard'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            style={{
                                padding: '0.5rem 1rem', borderRadius: '8px', border: 'none',
                                background: filter === f ? 'var(--color-accent, #e8b86d)' : '#1a1a1a',
                                color: filter === f ? '#000' : '#888',
                                fontWeight: '600', fontSize: '0.85rem', cursor: 'pointer',
                                textTransform: 'capitalize'
                            }}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '4rem', color: '#444' }}>
                    <Loader2 size={32} className="animate-spin mx-auto mb-4" />
                    <p>Loading sessions...</p>
                </div>
            ) : filteredReviews.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem', color: '#444', background: '#141414', borderRadius: '12px', border: '1px dashed rgba(255,255,255,0.05)' }}>
                    <MessageSquare size={48} className="mx-auto mb-4 opacity-10" />
                    <p>No reviews found matching your criteria.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gap: '1rem' }}>
                    {filteredReviews.map(review => (
                        <div key={review.id} style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '1.25rem', display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                    <div style={{ display: 'flex', gap: '0.25rem' }}>
                                        {[1, 2, 3, 4, 5].map(s => <Star key={s} size={14} fill={s <= review.rating ? '#e8b86d' : 'transparent'} color={s <= review.rating ? '#e8b86d' : '#333'} />)}
                                    </div>
                                    <span style={{ fontSize: '0.75rem', color: '#444' }}>{new Date(review.created_at).toLocaleDateString()}</span>
                                </div>
                                <h3 style={{ fontSize: '0.95rem', fontWeight: '600', color: '#fff', marginBottom: '0.25rem' }}>{review.name} <span style={{ color: '#555', fontWeight: '400', fontSize: '0.8rem' }}>({review.email})</span></h3>
                                <p style={{ color: '#aaa', fontSize: '0.9rem', lineHeight: '1.5', italic: 'true' }}>"{review.feedback}"</p>
                            </div>
                            <div style={{ display: 'flex', gap: '0.75rem', alignSelf: 'center' }}>
                                <button
                                    onClick={() => toggleFeatured(review.id, review.is_featured)}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '0.4rem',
                                        padding: '0.5rem 0.85rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)',
                                        background: review.is_featured ? 'rgba(232,184,109,0.1)' : 'transparent',
                                        color: review.is_featured ? '#e8b86d' : '#666',
                                        fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer',
                                    }}
                                >
                                    {review.is_featured ? <CheckCircle size={14} /> : <XCircle size={14} />}
                                    {review.is_featured ? 'Featured' : 'Feature'}
                                </button>
                                <button
                                    onClick={() => handleDelete(review.id)}
                                    style={{ background: 'rgba(239,68,68,0.1)', border: 'none', borderRadius: '8px', padding: '0.5rem', color: '#f87171', cursor: 'pointer' }}
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ReviewManager;
