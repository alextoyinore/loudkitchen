import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { uploadToCloudinary } from '../../lib/cloudinary';
import { Save, Loader, ImagePlus, Video, Globe, Smartphone, Mail, MapPin, Instagram, Facebook as FacebookIcon, Twitter as TwitterIcon, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

const inputStyle = {
    width: '100%', background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px',
    padding: '0.65rem 0.85rem', color: '#fff', fontSize: '0.9rem',
    outline: 'none', boxSizing: 'border-box',
};

const SectionTitle = ({ children }) => (
    <h2 style={{
        fontSize: '0.85rem', fontWeight: '600', color: 'var(--color-accent, #e8b86d)',
        textTransform: 'uppercase', letterSpacing: '0.08em',
        paddingBottom: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.07)',
        marginBottom: '1.25rem',
    }}>
        {children}
    </h2>
);

const Field = ({ label, children }) => (
    <div>
        <label style={{ display: 'block', color: '#aaa', fontSize: '0.8rem', marginBottom: '0.35rem' }}>{label}</label>
        {children}
    </div>
);

const Settings = () => {
    const [form, setForm] = useState({
        site_name: '',
        hero_video_url: '',
        hero_title: '',
        hero_subtitle: '',
        about_title: '',
        about_text: '',
        about_image_url: '',
        contact_email: '',
        phone: '',
        address: '',
        instagram: '',
        facebook: '',
        twitter: '',
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState({ hero: false, about: false });
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState('');

    const handleUpload = async (e, type) => {
        const file = e.target.files[0];
        if (!file) return;

        setError('');
        const isVideo = file.type.startsWith('video/');
        const limit = isVideo ? 3 * 1024 * 1024 : 500 * 1024; // 3MB video, 500KB image
        const limitText = isVideo ? '3MB' : '500KB';

        if (file.size > limit) {
            setError(`${isVideo ? 'Video' : 'Image'} file is too large. Max limit is ${limitText}.`);
            return;
        }

        setUploading(prev => ({ ...prev, [type]: true }));
        try {
            const url = await uploadToCloudinary(file, `loudkitchen/settings/${type}`);
            setForm(prev => ({ ...prev, [type === 'hero' ? 'hero_video_url' : 'about_image_url']: url }));
        } catch (err) {
            setError(`Upload failed: ${err.message}`);
        } finally {
            setUploading(prev => ({ ...prev, [type]: false }));
        }
    };

    useEffect(() => {
        const fetchSettings = async () => {
            const { data } = await supabase.from('site_settings').select('*').eq('id', 1).single();
            if (data) {
                setForm({
                    site_name: data.site_name || '',
                    hero_video_url: data.hero_video_url || '',
                    hero_title: data.hero_title || '',
                    hero_subtitle: data.hero_subtitle || '',
                    about_title: data.about_title || '',
                    about_text: data.about_text || '',
                    about_image_url: data.about_image_url || '',
                    contact_email: data.contact_email || '',
                    phone: data.phone || '',
                    address: data.address || '',
                    instagram: data.instagram || '',
                    facebook: data.facebook || '',
                    twitter: data.twitter || '',
                });
            }
            setLoading(false);
        };
        fetchSettings();
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        setError('');
        setSaving(true);
        const { error: err } = await supabase
            .from('site_settings')
            .update({ ...form, updated_at: new Date().toISOString() })
            .eq('id', 1);
        setSaving(false);
        if (err) { setError(err.message); return; }
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));

    if (loading) return <div style={{ color: '#555', padding: '3rem', textAlign: 'center' }}>Loading settings…</div>;

    return (
        <div>
            <div style={{ marginBottom: '1.5rem' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#fff' }}>Site Settings</h1>
                <p style={{ color: '#666', fontSize: '0.875rem', marginTop: '0.2rem' }}>Manage global site configuration</p>
            </div>

            {error && <div style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', padding: '0.75rem', color: '#f87171', fontSize: '0.85rem', marginBottom: '1.5rem' }}>{error}</div>}

            <form onSubmit={handleSave}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '680px' }}>

                    {/* General */}
                    <div style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '1.5rem' }}>
                        <SectionTitle>General</SectionTitle>
                        <Field label="Site Name">
                            <input style={inputStyle} value={form.site_name} onChange={set('site_name')} placeholder="LoudKitchen" />
                        </Field>
                    </div>

                    {/* Hero Section */}
                    <div style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '1.5rem' }}>
                        <SectionTitle><Video size={18} /> Hero Section</SectionTitle>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <Field label="Hero Title (use [brackets] for accent color)">
                                <input style={inputStyle} value={form.hero_title} onChange={set('hero_title')} placeholder="LOUD[KITCHEN]" />
                            </Field>
                            <Field label="Hero Subtitle">
                                <textarea
                                    style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
                                    value={form.hero_subtitle}
                                    onChange={set('hero_subtitle')}
                                    placeholder="A symphony of flavors in a vibrant atmosphere."
                                />
                            </Field>
                            <Field label="Background Video">
                                {form.hero_video_url && (
                                    <div style={{ marginBottom: '0.75rem', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                                        <video src={form.hero_video_url} style={{ width: '100%', maxHeight: '150px', objectFit: 'cover' }} muted />
                                    </div>
                                )}
                                <label style={{
                                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                                    padding: '0.65rem 1rem', borderRadius: '8px',
                                    border: '1px dashed rgba(255,255,255,0.2)',
                                    color: '#aaa', cursor: 'pointer', fontSize: '0.85rem',
                                    background: 'rgba(255,255,255,0.02)', marginTop: '0.5rem'
                                }}>
                                    {uploading.hero ? <><Loader2 size={16} className="animate-spin" /> Uploading...</> : <><Video size={16} /> {form.hero_video_url ? 'Change Video' : 'Upload Video'} (Max 3MB)</>}
                                    <input type="file" accept="video/mp4" style={{ display: 'none' }} onChange={(e) => handleUpload(e, 'hero')} disabled={uploading.hero} />
                                </label>
                                <input
                                    style={{ ...inputStyle, marginTop: '0.5rem', fontSize: '0.8rem', padding: '0.5rem' }}
                                    value={form.hero_video_url}
                                    onChange={set('hero_video_url')}
                                    placeholder="Or paste video URL here"
                                />
                            </Field>
                        </div>
                    </div>

                    {/* About Section */}
                    <div style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '1.5rem' }}>
                        <SectionTitle><ImagePlus size={18} /> About Section</SectionTitle>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <Field label="About Title (use [brackets] for accent color)">
                                <input style={inputStyle} value={form.about_title} onChange={set('about_title')} placeholder="Taste the [Rhythm]" />
                            </Field>
                            <Field label="About Description">
                                <textarea
                                    style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }}
                                    value={form.about_text}
                                    onChange={set('about_text')}
                                    placeholder="Tell your story..."
                                />
                            </Field>
                            <Field label="About Image">
                                {form.about_image_url && (
                                    <img src={form.about_image_url} alt="Preview" style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '8px', marginBottom: '0.75rem' }} />
                                )}
                                <label style={{
                                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                                    padding: '0.65rem 1rem', borderRadius: '8px',
                                    border: '1px dashed rgba(255,255,255,0.2)',
                                    color: '#aaa', cursor: 'pointer', fontSize: '0.85rem',
                                    background: 'rgba(255,255,255,0.02)', marginTop: '0.5rem'
                                }}>
                                    {uploading.about ? <><Loader2 size={16} className="animate-spin" /> Uploading...</> : <><ImagePlus size={16} /> {form.about_image_url ? 'Change Image' : 'Upload Image'} (Max 500KB)</>}
                                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleUpload(e, 'about')} disabled={uploading.about} />
                                </label>
                                <input
                                    style={{ ...inputStyle, marginTop: '0.5rem', fontSize: '0.8rem', padding: '0.5rem' }}
                                    value={form.about_image_url}
                                    onChange={set('about_image_url')}
                                    placeholder="Or paste image URL here"
                                />
                            </Field>
                        </div>
                    </div>

                    {/* Contact */}
                    <div style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '1.5rem' }}>
                        <SectionTitle><Mail size={18} /> Contact Information</SectionTitle>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <Field label="Email">
                                <div style={{ position: 'relative' }}>
                                    <input style={inputStyle} type="email" value={form.contact_email} onChange={set('contact_email')} placeholder="hello@loudkitchen.com" />
                                </div>
                            </Field>
                            <Field label="Phone">
                                <input style={inputStyle} type="tel" value={form.phone} onChange={set('phone')} placeholder="+44 20 0000 0000" />
                            </Field>
                        </div>
                        <div style={{ marginTop: '1rem' }}>
                            <Field label="Address">
                                <textarea style={{ ...inputStyle, minHeight: '60px', resize: 'vertical' }} value={form.address} onChange={set('address')} placeholder="123 Food Street, London" />
                            </Field>
                        </div>
                    </div>

                    {/* Social */}
                    <div style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '1.5rem' }}>
                        <SectionTitle><Instagram size={18} /> Social Media</SectionTitle>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                            <Field label="Instagram">
                                <input style={inputStyle} value={form.instagram} onChange={set('instagram')} placeholder="@loudkitchen" />
                            </Field>
                            <Field label="Facebook">
                                <input style={inputStyle} value={form.facebook} onChange={set('facebook')} placeholder="facebook.com/loudkitchen" />
                            </Field>
                            <Field label="Twitter / X">
                                <input style={inputStyle} value={form.twitter} onChange={set('twitter')} placeholder="@loudkitchen" />
                            </Field>
                        </div>
                    </div>

                    {/* Save */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <button type="submit" disabled={saving || uploading.hero || uploading.about} style={{
                            display: 'flex', alignItems: 'center', gap: '0.65rem',
                            background: 'var(--color-accent, #e8b86d)', color: '#000',
                            fontWeight: '700', padding: '0.75rem 2rem', borderRadius: '8px',
                            border: 'none', cursor: (saving || uploading.hero || uploading.about) ? 'not-allowed' : 'pointer', fontSize: '0.95rem',
                            opacity: (saving || uploading.hero || uploading.about) ? 0.7 : 1, transition: 'transform 0.1s'
                        }}
                            onMouseDown={e => e.currentTarget.style.transform = 'scale(0.98)'}
                            onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            {saving ? <><Loader2 size={18} className="animate-spin" /> Saving...</> : <><Save size={18} /> Save Settings</>}
                        </button>
                        {saved && (
                            <span style={{ color: '#4ade80', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                ✓ Settings saved!
                            </span>
                        )}
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Settings;
