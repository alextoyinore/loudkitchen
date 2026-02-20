import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { uploadToCloudinary } from '../../lib/cloudinary';
import { Plus, Pencil, Trash2, X, Save, ImagePlus, Loader } from 'lucide-react';

const CATEGORIES = ['Starters', 'Mains', 'Sides', 'Pasta', 'Combo', 'Sandwich', 'Grill', 'Desserts', 'Drinks', 'Specials'];

const emptyForm = { name: '', description: '', price: '', category: 'Mains', image_url: '', is_available: true };

const inputStyle = {
    width: '100%', background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px',
    padding: '0.65rem 0.85rem', color: '#fff', fontSize: '0.9rem',
    outline: 'none', boxSizing: 'border-box',
};

const MenuEditor = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState(emptyForm);
    const [editId, setEditId] = useState(null);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [filterCat, setFilterCat] = useState('All');

    const fetchItems = async () => {
        const { data } = await supabase.from('menu_items').select('*').order('created_at', { ascending: false });
        setItems(data || []);
        setLoading(false);
    };

    useEffect(() => { fetchItems(); }, []);

    const openAdd = () => { setForm(emptyForm); setEditId(null); setError(''); setShowForm(true); };
    const openEdit = (item) => { setForm({ ...item, price: String(item.price) }); setEditId(item.id); setError(''); setShowForm(true); };
    const closeForm = () => { setShowForm(false); setEditId(null); setForm(emptyForm); };

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
            const url = await uploadToCloudinary(file, 'loudkitchen/menu');
            setForm(f => ({ ...f, image_url: url }));
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
        const payload = { ...form, price: parseFloat(form.price) };
        let err;
        if (editId) {
            ({ error: err } = await supabase.from('menu_items').update(payload).eq('id', editId));
        } else {
            ({ error: err } = await supabase.from('menu_items').insert(payload));
        }
        setSaving(false);
        if (err) { setError(err.message); return; }
        closeForm();
        fetchItems();
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this menu item?')) return;
        await supabase.from('menu_items').delete().eq('id', id);
        fetchItems();
    };

    const filtered = filterCat === 'All' ? items : items.filter(i => i.category === filterCat);

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#fff' }}>Menu Editor</h1>
                    <p style={{ color: '#666', fontSize: '0.875rem', marginTop: '0.2rem' }}>{items.length} items total</p>
                </div>
                <button onClick={openAdd} style={{
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    background: 'var(--color-accent, #e8b86d)', color: '#000',
                    fontWeight: '700', padding: '0.65rem 1.25rem', borderRadius: '8px',
                    border: 'none', cursor: 'pointer', fontSize: '0.9rem',
                }}>
                    <Plus size={18} /> Add Item
                </button>
            </div>

            {/* Category filter */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                {['All', ...CATEGORIES].map(cat => (
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

            {/* Items grid */}
            {loading ? (
                <div style={{ textAlign: 'center', color: '#555', padding: '3rem' }}>Loading…</div>
            ) : filtered.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#555', padding: '3rem' }}>No items found.</div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                    {filtered.map(item => (
                        <div key={item.id} style={{
                            background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.07)',
                            borderRadius: '12px', overflow: 'hidden',
                        }}>
                            {item.image_url ? (
                                <img src={item.image_url} alt={item.name} style={{ width: '100%', height: '160px', objectFit: 'cover' }} />
                            ) : (
                                <div style={{ width: '100%', height: '160px', background: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#444' }}>
                                    <ImagePlus size={32} />
                                </div>
                            )}
                            <div style={{ padding: '1rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                                    <h3 style={{ color: '#fff', fontWeight: '600', fontSize: '0.95rem' }}>{item.name}</h3>
                                    <span style={{ color: 'var(--color-accent, #e8b86d)', fontWeight: '700', fontSize: '0.95rem', whiteSpace: 'nowrap', marginLeft: '0.5rem' }}>
                                        ₦{parseFloat(item.price).toLocaleString()}
                                    </span>
                                </div>
                                <p style={{ color: '#666', fontSize: '0.8rem', marginBottom: '0.75rem', lineHeight: '1.4' }}>{item.description}</p>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{
                                        fontSize: '0.75rem', padding: '0.2rem 0.6rem', borderRadius: '999px',
                                        background: 'rgba(255,255,255,0.07)', color: '#aaa',
                                    }}>{item.category}</span>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button onClick={() => openEdit(item)} style={{ background: 'rgba(255,255,255,0.07)', border: 'none', borderRadius: '6px', padding: '0.4rem', color: '#aaa', cursor: 'pointer' }}>
                                            <Pencil size={14} />
                                        </button>
                                        <button onClick={() => handleDelete(item.id)} style={{ background: 'rgba(239,68,68,0.1)', border: 'none', borderRadius: '6px', padding: '0.4rem', color: '#f87171', cursor: 'pointer' }}>
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal Form */}
            {showForm && (
                <div style={{
                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 1000, padding: '1rem',
                }}>
                    <div style={{
                        background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '16px', padding: '2rem', width: '100%', maxWidth: '520px',
                        maxHeight: '90vh', overflowY: 'auto',
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ color: '#fff', fontWeight: '700', fontSize: '1.1rem' }}>
                                {editId ? 'Edit Item' : 'Add Menu Item'}
                            </h2>
                            <button onClick={closeForm} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}>
                                <X size={20} />
                            </button>
                        </div>

                        {error && <div style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', padding: '0.75rem', color: '#f87171', fontSize: '0.85rem', marginBottom: '1rem' }}>{error}</div>}

                        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', color: '#aaa', fontSize: '0.8rem', marginBottom: '0.35rem' }}>Name *</label>
                                <input style={inputStyle} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
                            </div>
                            <div>
                                <label style={{ display: 'block', color: '#aaa', fontSize: '0.8rem', marginBottom: '0.35rem' }}>Description</label>
                                <textarea style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', color: '#aaa', fontSize: '0.8rem', marginBottom: '0.35rem' }}>Price (₦) *</label>
                                    <input style={inputStyle} type="number" step="0.01" min="0" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} required />
                                </div>
                                <div>
                                    <label style={{ display: 'block', color: '#aaa', fontSize: '0.8rem', marginBottom: '0.35rem' }}>Category *</label>
                                    <select style={{ ...inputStyle }} value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label style={{ display: 'block', color: '#aaa', fontSize: '0.8rem', marginBottom: '0.35rem' }}>Image</label>
                                {form.image_url && <img src={form.image_url} alt="" style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '8px', marginBottom: '0.5rem' }} />}
                                <label style={{
                                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                                    padding: '0.65rem', borderRadius: '8px',
                                    border: '1px dashed rgba(255,255,255,0.2)',
                                    color: '#aaa', cursor: 'pointer', fontSize: '0.85rem',
                                }}>
                                    {uploading ? <><Loader size={16} className="spin" /> Uploading…</> : <><ImagePlus size={16} /> Upload Image</>}
                                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} disabled={uploading} />
                                </label>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <input type="checkbox" id="available" checked={form.is_available} onChange={e => setForm(f => ({ ...f, is_available: e.target.checked }))} />
                                <label htmlFor="available" style={{ color: '#aaa', fontSize: '0.875rem' }}>Available on menu</label>
                            </div>
                            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                                <button type="button" onClick={closeForm} style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.12)', background: 'none', color: '#aaa', cursor: 'pointer' }}>Cancel</button>
                                <button type="submit" disabled={saving || uploading} style={{
                                    flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                                    padding: '0.75rem', borderRadius: '8px', border: 'none',
                                    background: 'var(--color-accent, #e8b86d)', color: '#000',
                                    fontWeight: '700', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1,
                                }}>
                                    <Save size={16} /> {saving ? 'Saving…' : 'Save Item'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MenuEditor;
