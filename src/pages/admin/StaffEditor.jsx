import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { uploadToCloudinary } from '../../lib/cloudinary';
import { Plus, Pencil, Trash2, X, Save, ImagePlus, Loader } from 'lucide-react';
import useIsMobile from '../../hooks/useIsMobile';

const emptyForm = { name: '', role: '', bio: '', image_url: '', sort_order: 0 };

const inputStyle = {
    width: '100%', background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px',
    padding: '0.65rem 0.85rem', color: '#fff', fontSize: '0.9rem',
    outline: 'none', boxSizing: 'border-box',
};

const StaffEditor = () => {
    const isMobile = useIsMobile();
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState(emptyForm);
    const [editId, setEditId] = useState(null);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');

    const fetchStaff = async () => {
        const { data } = await supabase.from('staff').select('*').order('sort_order', { ascending: true });
        setStaff(data || []);
        setLoading(false);
    };

    useEffect(() => { fetchStaff(); }, []);

    const openAdd = () => { setForm(emptyForm); setEditId(null); setError(''); setShowForm(true); };
    const openEdit = (member) => { setForm({ ...member }); setEditId(member.id); setError(''); setShowForm(true); };
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
            const url = await uploadToCloudinary(file, 'loudkitchen/staff');
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
        let err;
        if (editId) {
            ({ error: err } = await supabase.from('staff').update(form).eq('id', editId));
        } else {
            ({ error: err } = await supabase.from('staff').insert(form));
        }
        setSaving(false);
        if (err) { setError(err.message); return; }
        closeForm();
        fetchStaff();
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this staff member?')) return;
        await supabase.from('staff').delete().eq('id', id);
        fetchStaff();
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div>
                    <h1 style={{ fontSize: isMobile ? '1.3rem' : '1.5rem', fontWeight: '700', color: '#fff' }}>Staff</h1>
                    <p style={{ color: '#666', fontSize: '0.875rem', marginTop: '0.2rem' }}>{staff.length} members</p>
                </div>
                <button onClick={openAdd} style={{
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    background: 'var(--color-accent, #e8b86d)', color: '#000',
                    fontWeight: '700', padding: '0.65rem 1.25rem', borderRadius: '8px',
                    border: 'none', cursor: 'pointer', fontSize: '0.9rem',
                }}>
                    <Plus size={18} /> Add Member
                </button>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', color: '#555', padding: '3rem' }}>Loading…</div>
            ) : staff.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#555', padding: '3rem' }}>No staff members yet.</div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
                    {staff.map(member => (
                        <div key={member.id} style={{
                            background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.07)',
                            borderRadius: '12px', overflow: 'hidden', textAlign: 'center',
                        }}>
                            {member.image_url ? (
                                <img src={member.image_url} alt={member.name} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                            ) : (
                                <div style={{ width: '100%', height: '200px', background: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#444' }}>
                                    <ImagePlus size={32} />
                                </div>
                            )}
                            <div style={{ padding: '1rem' }}>
                                <h3 style={{ color: '#fff', fontWeight: '600', marginBottom: '0.25rem' }}>{member.name}</h3>
                                <p style={{ color: 'var(--color-accent, #e8b86d)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>{member.role}</p>
                                <p style={{ color: '#666', fontSize: '0.8rem', marginBottom: '0.75rem', lineHeight: '1.4' }}>{member.bio}</p>
                                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                                    <button onClick={() => openEdit(member)} style={{ background: 'rgba(255,255,255,0.07)', border: 'none', borderRadius: '6px', padding: '0.4rem 0.75rem', color: '#aaa', cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                        <Pencil size={13} /> Edit
                                    </button>
                                    <button onClick={() => handleDelete(member.id)} style={{ background: 'rgba(239,68,68,0.1)', border: 'none', borderRadius: '6px', padding: '0.4rem 0.75rem', color: '#f87171', cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                        <Trash2 size={13} /> Delete
                                    </button>
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
                    display: 'flex', alignItems: isMobile ? 'flex-end' : 'center', justifyContent: 'center',
                    zIndex: 1000, padding: isMobile ? '0' : '1rem',
                }}>
                    <div style={{
                        background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: isMobile ? '16px 16px 0 0' : '16px',
                        padding: isMobile ? '1.25rem' : '2rem',
                        width: '100%', maxWidth: isMobile ? '100%' : '480px',
                        maxHeight: '90vh', overflowY: 'auto',
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ color: '#fff', fontWeight: '700', fontSize: '1.1rem' }}>
                                {editId ? 'Edit Staff Member' : 'Add Staff Member'}
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
                                <label style={{ display: 'block', color: '#aaa', fontSize: '0.8rem', marginBottom: '0.35rem' }}>Role / Title *</label>
                                <input style={inputStyle} value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} required placeholder="e.g. Head Chef" />
                            </div>
                            <div>
                                <label style={{ display: 'block', color: '#aaa', fontSize: '0.8rem', marginBottom: '0.35rem' }}>Bio</label>
                                <textarea style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} />
                            </div>
                            <div>
                                <label style={{ display: 'block', color: '#aaa', fontSize: '0.8rem', marginBottom: '0.35rem' }}>Display Order</label>
                                <input style={inputStyle} type="number" min="0" value={form.sort_order} onChange={e => setForm(f => ({ ...f, sort_order: parseInt(e.target.value) || 0 }))} />
                            </div>
                            <div>
                                <label style={{ display: 'block', color: '#aaa', fontSize: '0.8rem', marginBottom: '0.35rem' }}>Photo</label>
                                {form.image_url && <img src={form.image_url} alt="" style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '8px', marginBottom: '0.5rem' }} />}
                                <label style={{
                                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                                    padding: '0.65rem', borderRadius: '8px',
                                    border: '1px dashed rgba(255,255,255,0.2)',
                                    color: '#aaa', cursor: 'pointer', fontSize: '0.85rem',
                                }}>
                                    {uploading ? <><Loader size={16} /> Uploading…</> : <><ImagePlus size={16} /> Upload Photo</>}
                                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} disabled={uploading} />
                                </label>
                            </div>
                            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                                <button type="button" onClick={closeForm} style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.12)', background: 'none', color: '#aaa', cursor: 'pointer' }}>Cancel</button>
                                <button type="submit" disabled={saving || uploading} style={{
                                    flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                                    padding: '0.75rem', borderRadius: '8px', border: 'none',
                                    background: 'var(--color-accent, #e8b86d)', color: '#000',
                                    fontWeight: '700', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1,
                                }}>
                                    <Save size={16} /> {saving ? 'Saving…' : 'Save Member'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StaffEditor;
