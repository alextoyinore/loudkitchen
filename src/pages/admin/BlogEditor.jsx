import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { uploadToCloudinary } from '../../lib/cloudinary';
import { Plus, Pencil, Trash2, X, Save, ImagePlus, Loader, Eye, EyeOff } from 'lucide-react';
import useIsMobile from '../../hooks/useIsMobile';

const emptyForm = { title: '', slug: '', excerpt: '', content: '', cover_image: '', author: '', tags: '', published: false };

const inputStyle = {
    width: '100%', background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px',
    padding: '0.65rem 0.85rem', color: '#fff', fontSize: '0.9rem',
    outline: 'none', boxSizing: 'border-box',
};

const slugify = (str) => str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const BlogEditor = () => {
    const isMobile = useIsMobile();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState(emptyForm);
    const [editId, setEditId] = useState(null);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');

    const fetchPosts = async () => {
        const { data } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false });
        setPosts(data || []);
        setLoading(false);
    };

    useEffect(() => { fetchPosts(); }, []);

    const openAdd = () => { setForm(emptyForm); setEditId(null); setError(''); setShowForm(true); };
    const openEdit = (post) => {
        setForm({ ...post, tags: Array.isArray(post.tags) ? post.tags.join(', ') : '' });
        setEditId(post.id); setError(''); setShowForm(true);
    };
    const closeForm = () => { setShowForm(false); setEditId(null); setForm(emptyForm); };

    const handleTitleChange = (e) => {
        const title = e.target.value;
        setForm(f => ({ ...f, title, slug: editId ? f.slug : slugify(title) }));
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setError('');
        const limit = 500 * 1024; // 500KB
        if (file.size > limit) {
            setError('Image file is too large. Max limit is 500KB.');
            return;
        }

        setUploading(true);
        try {
            const url = await uploadToCloudinary(file, 'loudkitchen/blog');
            setForm(f => ({ ...f, cover_image: url }));
        } catch (err) {
            setError('Image upload failed: ' + err.message);
        } finally {
            setUploading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setError('');
        setSaving(true);
        const payload = {
            ...form,
            tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        };
        let err;
        if (editId) {
            ({ error: err } = await supabase.from('blog_posts').update(payload).eq('id', editId));
        } else {
            ({ error: err } = await supabase.from('blog_posts').insert(payload));
        }
        setSaving(false);
        if (err) { setError(err.message); return; }
        closeForm();
        fetchPosts();
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this blog post?')) return;
        await supabase.from('blog_posts').delete().eq('id', id);
        fetchPosts();
    };

    const togglePublish = async (post) => {
        await supabase.from('blog_posts').update({ published: !post.published }).eq('id', post.id);
        fetchPosts();
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div>
                    <h1 style={{ fontSize: isMobile ? '1.3rem' : '1.5rem', fontWeight: '700', color: '#fff' }}>Blog Posts</h1>
                    <p style={{ color: '#666', fontSize: '0.875rem', marginTop: '0.2rem' }}>{posts.length} posts total</p>
                </div>
                <button onClick={openAdd} style={{
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    background: 'var(--color-accent, #e8b86d)', color: '#000',
                    fontWeight: '700', padding: '0.65rem 1.25rem', borderRadius: '8px',
                    border: 'none', cursor: 'pointer', fontSize: '0.9rem',
                }}>
                    <Plus size={18} /> New Post
                </button>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', color: '#555', padding: '3rem' }}>Loading…</div>
            ) : posts.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#555', padding: '3rem' }}>No posts yet.</div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {posts.map(post => (
                        <div key={post.id} style={{
                            background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.07)',
                            borderRadius: '12px', padding: '1rem',
                            display: 'flex', alignItems: isMobile ? 'flex-start' : 'center',
                            flexDirection: isMobile ? 'column' : 'row', gap: '0.75rem',
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', width: '100%' }}>
                                {post.cover_image ? (
                                    <img src={post.cover_image} alt={post.title} style={{ width: '64px', height: '50px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }} />
                                ) : (
                                    <div style={{ width: '64px', height: '50px', background: '#222', borderRadius: '8px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#444' }}>
                                        <ImagePlus size={18} />
                                    </div>
                                )}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <h3 style={{ color: '#fff', fontWeight: '600', fontSize: '0.9rem', marginBottom: '0.2rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{post.title}</h3>
                                    <p style={{ color: '#555', fontSize: '0.78rem' }}>/{post.slug} · {post.author || 'Unknown'}</p>
                                </div>
                                {!isMobile && (
                                    <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.65rem', borderRadius: '999px', background: post.published ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.07)', color: post.published ? '#4ade80' : '#666', flexShrink: 0 }}>
                                        {post.published ? 'Published' : 'Draft'}
                                    </span>
                                )}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0, width: isMobile ? '100%' : 'auto' }}>
                                {isMobile && (
                                    <span style={{ fontSize: '0.72rem', padding: '0.2rem 0.6rem', borderRadius: '999px', background: post.published ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.07)', color: post.published ? '#4ade80' : '#666', marginRight: 'auto' }}>
                                        {post.published ? 'Published' : 'Draft'}
                                    </span>
                                )}
                                <button onClick={() => togglePublish(post)} title={post.published ? 'Unpublish' : 'Publish'} style={{ background: 'rgba(255,255,255,0.07)', border: 'none', borderRadius: '6px', padding: '0.45rem', color: '#aaa', cursor: 'pointer' }}>
                                    {post.published ? <EyeOff size={14} /> : <Eye size={14} />}
                                </button>
                                <button onClick={() => openEdit(post)} style={{ background: 'rgba(255,255,255,0.07)', border: 'none', borderRadius: '6px', padding: '0.45rem', color: '#aaa', cursor: 'pointer' }}>
                                    <Pencil size={14} />
                                </button>
                                <button onClick={() => handleDelete(post.id)} style={{ background: 'rgba(239,68,68,0.1)', border: 'none', borderRadius: '6px', padding: '0.45rem', color: '#f87171', cursor: 'pointer' }}>
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal Form */}
            {showForm && (
                <div style={{
                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)',
                    display: 'flex', alignItems: isMobile ? 'flex-end' : 'center', justifyContent: 'center',
                    zIndex: 1000, padding: isMobile ? '0' : '1rem',
                }}>
                    <div style={{
                        background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: isMobile ? '16px 16px 0 0' : '16px',
                        padding: isMobile ? '1.25rem' : '2rem',
                        width: '100%', maxWidth: isMobile ? '100%' : '600px',
                        maxHeight: '90vh', overflowY: 'auto',
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ color: '#fff', fontWeight: '700', fontSize: '1.1rem' }}>
                                {editId ? 'Edit Post' : 'New Blog Post'}
                            </h2>
                            <button onClick={closeForm} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}>
                                <X size={20} />
                            </button>
                        </div>

                        {error && <div style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', padding: '0.75rem', color: '#f87171', fontSize: '0.85rem', marginBottom: '1rem' }}>{error}</div>}

                        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', color: '#aaa', fontSize: '0.8rem', marginBottom: '0.35rem' }}>Title *</label>
                                <input style={inputStyle} value={form.title} onChange={handleTitleChange} required />
                            </div>
                            <div>
                                <label style={{ display: 'block', color: '#aaa', fontSize: '0.8rem', marginBottom: '0.35rem' }}>Slug *</label>
                                <input style={inputStyle} value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} required />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', color: '#aaa', fontSize: '0.8rem', marginBottom: '0.35rem' }}>Author</label>
                                    <input style={inputStyle} value={form.author} onChange={e => setForm(f => ({ ...f, author: e.target.value }))} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', color: '#aaa', fontSize: '0.8rem', marginBottom: '0.35rem' }}>Tags (comma-separated)</label>
                                    <input style={inputStyle} value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} placeholder="food, recipe, tips" />
                                </div>
                            </div>
                            <div>
                                <label style={{ display: 'block', color: '#aaa', fontSize: '0.8rem', marginBottom: '0.35rem' }}>Excerpt</label>
                                <textarea style={{ ...inputStyle, minHeight: '70px', resize: 'vertical' }} value={form.excerpt} onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))} />
                            </div>
                            <div>
                                <label style={{ display: 'block', color: '#aaa', fontSize: '0.8rem', marginBottom: '0.35rem' }}>Content</label>
                                <textarea style={{ ...inputStyle, minHeight: '140px', resize: 'vertical' }} value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} />
                            </div>
                            <div>
                                <label style={{ display: 'block', color: '#aaa', fontSize: '0.8rem', marginBottom: '0.35rem' }}>Cover Image</label>
                                {form.cover_image && <img src={form.cover_image} alt="" style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '8px', marginBottom: '0.5rem' }} />}
                                <label style={{
                                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                                    padding: '0.65rem', borderRadius: '8px',
                                    border: '1px dashed rgba(255,255,255,0.2)',
                                    color: '#aaa', cursor: 'pointer', fontSize: '0.85rem',
                                }}>
                                    {uploading ? <><Loader size={16} /> Uploading…</> : <><ImagePlus size={16} /> Upload Cover Image</>}
                                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} disabled={uploading} />
                                </label>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <input type="checkbox" id="published" checked={form.published} onChange={e => setForm(f => ({ ...f, published: e.target.checked }))} />
                                <label htmlFor="published" style={{ color: '#aaa', fontSize: '0.875rem' }}>Publish immediately</label>
                            </div>
                            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                                <button type="button" onClick={closeForm} style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.12)', background: 'none', color: '#aaa', cursor: 'pointer' }}>Cancel</button>
                                <button type="submit" disabled={saving || uploading} style={{
                                    flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                                    padding: '0.75rem', borderRadius: '8px', border: 'none',
                                    background: 'var(--color-accent, #e8b86d)', color: '#000',
                                    fontWeight: '700', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1,
                                }}>
                                    <Save size={16} /> {saving ? 'Saving…' : 'Save Post'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BlogEditor;
