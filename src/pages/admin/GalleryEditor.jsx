import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { uploadToCloudinary } from '../../lib/cloudinary';
import { Plus, Trash2, X, ImagePlus, Loader, Pencil, Save } from 'lucide-react';
import useIsMobile from '../../hooks/useIsMobile';

const CATEGORIES = ['All', 'Food', 'Ambience', 'Events', 'Kitchen', 'Team'];

const inputStyle = {
    width: '100%', background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px',
    padding: '0.65rem 0.85rem', color: '#fff', fontSize: '0.9rem',
    outline: 'none', boxSizing: 'border-box',
};

const GalleryEditor = () => {
    const isMobile = useIsMobile();
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [filterCat, setFilterCat] = useState('All');
    const [editItem, setEditItem] = useState(null);
    const [editForm, setEditForm] = useState({ caption: '', category: '' });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const fetchImages = async () => {
        const { data } = await supabase.from('gallery').select('*').order('sort_order', { ascending: true });
        setImages(data || []);
        setLoading(false);
    };

    useEffect(() => { fetchImages(); }, []);

    const handleUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;

        setUploading(true);
        setError('');

        const limit = 500 * 1024; // 500KB
        const oversized = files.filter(f => f.size > limit);
        const validFiles = files.filter(f => f.size <= limit);

        if (oversized.length > 0) {
            setError(`${oversized.length} image(s) exceed the 500KB limit and were skipped.`);
        }

        if (validFiles.length === 0) {
            setUploading(false);
            return;
        }

        try {
            for (const file of validFiles) {
                const url = await uploadToCloudinary(file, 'loudkitchen/gallery');
                await supabase.from('gallery').insert({ image_url: url, sort_order: images.length });
            }
            fetchImages();
        } catch (err) {
            setError('Upload failed: ' + err.message);
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this image?')) return;
        await supabase.from('gallery').delete().eq('id', id);
        fetchImages();
    };

    const openEdit = (item) => {
        setEditItem(item);
        setEditForm({ caption: item.caption || '', category: item.category || '' });
    };

    const handleEditSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        await supabase.from('gallery').update(editForm).eq('id', editItem.id);
        setSaving(false);
        setEditItem(null);
        fetchImages();
    };

    const filtered = filterCat === 'All' ? images : images.filter(i => i.category === filterCat);

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div>
                    <h1 style={{ fontSize: isMobile ? '1.3rem' : '1.5rem', fontWeight: '700', color: '#fff' }}>Gallery</h1>
                    <p style={{ color: '#666', fontSize: '0.875rem', marginTop: '0.2rem' }}>{images.length} images</p>
                </div>
                <label style={{
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    background: 'var(--color-accent, #e8b86d)', color: '#000',
                    fontWeight: '700', padding: '0.65rem 1.25rem', borderRadius: '8px',
                    cursor: uploading ? 'not-allowed' : 'pointer', fontSize: '0.9rem',
                    opacity: uploading ? 0.7 : 1,
                }}>
                    {uploading ? <><Loader size={18} /> Uploading…</> : <><Plus size={18} /> Upload Images</>}
                    <input type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={handleUpload} disabled={uploading} />
                </label>
            </div>

            {error && <div style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', padding: '0.75rem', color: '#f87171', fontSize: '0.85rem', marginBottom: '1rem' }}>{error}</div>}

            {/* Category filter */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                {CATEGORIES.map(cat => (
                    <button key={cat} onClick={() => setFilterCat(cat)} style={{
                        padding: '0.4rem 0.9rem', borderRadius: '999px', border: 'none',
                        background: filterCat === cat ? 'var(--color-accent, #e8b86d)' : 'rgba(255,255,255,0.07)',
                        color: filterCat === cat ? '#000' : '#aaa',
                        fontWeight: filterCat === cat ? '600' : '400',
                        cursor: 'pointer', fontSize: '0.8rem',
                    }}>
                        {cat}
                    </button>
                ))}
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', color: '#555', padding: '3rem' }}>Loading…</div>
            ) : filtered.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#555', padding: '3rem' }}>No images yet. Upload some!</div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem' }}>
                    {filtered.map(item => (
                        <div key={item.id} style={{ position: 'relative', borderRadius: '10px', overflow: 'hidden', aspectRatio: '1', background: '#1a1a1a' }}>
                            <img src={item.image_url} alt={item.caption || ''} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            {/* Overlay */}
                            <div style={{
                                position: 'absolute', inset: 0,
                                background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 50%)',
                                opacity: 0, transition: 'opacity 0.2s',
                                display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '0.75rem',
                            }}
                                onMouseEnter={e => e.currentTarget.style.opacity = 1}
                                onMouseLeave={e => e.currentTarget.style.opacity = 0}
                            >
                                {item.caption && <p style={{ color: '#fff', fontSize: '0.75rem', marginBottom: '0.5rem' }}>{item.caption}</p>}
                                <div style={{ display: 'flex', gap: '0.4rem' }}>
                                    <button onClick={() => openEdit(item)} style={{ flex: 1, background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '6px', padding: '0.35rem', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Pencil size={13} />
                                    </button>
                                    <button onClick={() => handleDelete(item.id)} style={{ flex: 1, background: 'rgba(239,68,68,0.3)', border: 'none', borderRadius: '6px', padding: '0.35rem', color: '#f87171', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Trash2 size={13} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Edit Modal */}
            {editItem && (
                <div style={{
                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)',
                    display: 'flex', alignItems: isMobile ? 'flex-end' : 'center', justifyContent: 'center',
                    zIndex: 1000, padding: isMobile ? '0' : '1rem',
                }}>
                    <div style={{
                        background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: isMobile ? '16px 16px 0 0' : '16px',
                        padding: isMobile ? '1.25rem' : '2rem',
                        width: '100%', maxWidth: isMobile ? '100%' : '400px',
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                            <h2 style={{ color: '#fff', fontWeight: '700', fontSize: '1.1rem' }}>Edit Image</h2>
                            <button onClick={() => setEditItem(null)} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}><X size={20} /></button>
                        </div>
                        <img src={editItem.image_url} alt="" style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '8px', marginBottom: '1rem' }} />
                        <form onSubmit={handleEditSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', color: '#aaa', fontSize: '0.8rem', marginBottom: '0.35rem' }}>Caption</label>
                                <input style={inputStyle} value={editForm.caption} onChange={e => setEditForm(f => ({ ...f, caption: e.target.value }))} />
                            </div>
                            <div>
                                <label style={{ display: 'block', color: '#aaa', fontSize: '0.8rem', marginBottom: '0.35rem' }}>Category</label>
                                <select style={inputStyle} value={editForm.category} onChange={e => setEditForm(f => ({ ...f, category: e.target.value }))}>
                                    <option value="">None</option>
                                    {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div style={{ display: 'flex', gap: '0.75rem' }}>
                                <button type="button" onClick={() => setEditItem(null)} style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.12)', background: 'none', color: '#aaa', cursor: 'pointer' }}>Cancel</button>
                                <button type="submit" disabled={saving} style={{
                                    flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                                    padding: '0.75rem', borderRadius: '8px', border: 'none',
                                    background: 'var(--color-accent, #e8b86d)', color: '#000',
                                    fontWeight: '700', cursor: 'pointer',
                                }}>
                                    <Save size={16} /> {saving ? 'Saving…' : 'Save'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GalleryEditor;
