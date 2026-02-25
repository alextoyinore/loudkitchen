import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/useAuth';
import { uploadToCloudinary } from '../../lib/cloudinary';
import { Save, Loader2, Camera, CheckCircle, AlertCircle } from 'lucide-react';
import useIsMobile from '../../hooks/useIsMobile';

const AdminProfile = () => {
    const { profile, refreshProfile, user } = useAuth();
    const isMobile = useIsMobile();

    const [fullName, setFullName] = useState(profile?.full_name || '');
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(profile?.avatar_url || null);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    // Keep form in sync if profile loads after render
    React.useEffect(() => {
        if (profile) {
            setFullName(prev => prev || profile.full_name || '');
            setAvatarPreview(prev => prev || profile.avatar_url || null);
        }
    }, [profile]);

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setAvatarFile(file);
        setAvatarPreview(URL.createObjectURL(file));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        setSuccess(false);
        try {
            let avatarUrl = profile?.avatar_url || null;

            if (avatarFile) {
                avatarUrl = await uploadToCloudinary(avatarFile, 'loudkitchen/avatars');
            }

            const { error: updateError } = await supabase
                .from('profiles')
                .update({
                    full_name: fullName.trim(),
                    ...(avatarUrl ? { avatar_url: avatarUrl } : {}),
                })
                .eq('id', user.id);

            if (updateError) throw updateError;

            refreshProfile();
            setSuccess(true);
            setAvatarFile(null);
        } catch (err) {
            setError(err.message || 'Failed to save profile.');
        } finally {
            setSaving(false);
        }
    };

    const displayName = fullName || profile?.email?.split('@')[0] || 'Admin';
    const avatarLetter = displayName[0]?.toUpperCase() || 'A';

    const inputStyle = {
        width: '100%', background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px',
        padding: '0.75rem 1rem', color: '#fff', fontSize: '0.95rem',
        outline: 'none', boxSizing: 'border-box',
    };

    return (
        <div>
            <div style={{ marginBottom: '1.5rem' }}>
                <h1 style={{ fontSize: isMobile ? '1.3rem' : '1.5rem', fontWeight: '700', color: '#fff' }}>My Profile</h1>
                <p style={{ color: '#666', fontSize: '0.875rem', marginTop: '0.2rem' }}>Update your display name and avatar</p>
            </div>

            <div style={{ maxWidth: isMobile ? '100%' : '520px' }}>
                <form onSubmit={handleSave}>
                    {/* Avatar */}
                    <div style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '1.75rem', marginBottom: '1rem' }}>
                        <p style={{ fontSize: '0.75rem', color: '#555', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1.25rem' }}>Avatar</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                            <div style={{ position: 'relative', flexShrink: 0 }}>
                                {avatarPreview ? (
                                    <img src={avatarPreview} alt="Avatar" style={{ width: '72px', height: '72px', borderRadius: '50%', objectFit: 'cover', border: '3px solid rgba(232,184,109,0.4)' }} />
                                ) : (
                                    <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'var(--color-accent, #e8b86d)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: '800', fontSize: '1.75rem', border: '3px solid rgba(232,184,109,0.4)' }}>
                                        {avatarLetter}
                                    </div>
                                )}
                                <label style={{ position: 'absolute', bottom: -2, right: -2, width: '24px', height: '24px', background: '#e8b86d', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 6px rgba(0,0,0,0.4)' }}>
                                    <Camera size={13} color="#000" />
                                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarChange} />
                                </label>
                            </div>
                            <div>
                                <p style={{ color: '#ddd', fontWeight: '600', fontSize: '0.95rem', marginBottom: '0.2rem' }}>{displayName}</p>
                                <p style={{ color: '#555', fontSize: '0.8rem' }}>{profile?.email}</p>
                                <p style={{ color: '#444', fontSize: '0.72rem', marginTop: '0.35rem' }}>Click the camera icon to change photo</p>
                            </div>
                        </div>
                    </div>

                    {/* Name */}
                    <div style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '1.75rem', marginBottom: '1rem' }}>
                        <p style={{ fontSize: '0.75rem', color: '#555', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1.25rem' }}>Display Name</p>
                        <div>
                            <label style={{ display: 'block', color: '#aaa', fontSize: '0.8rem', marginBottom: '0.4rem' }}>Full Name</label>
                            <input
                                style={inputStyle}
                                value={fullName}
                                onChange={e => setFullName(e.target.value)}
                                placeholder="e.g. Jane Doe"
                            />
                        </div>
                    </div>

                    {/* Account info (read-only) */}
                    <div style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '1.75rem', marginBottom: '1.5rem' }}>
                        <p style={{ fontSize: '0.75rem', color: '#555', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1.25rem' }}>Account</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ color: '#666', fontSize: '0.85rem' }}>Email</span>
                                <span style={{ color: '#aaa', fontSize: '0.85rem' }}>{profile?.email || user?.email}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ color: '#666', fontSize: '0.85rem' }}>Role</span>
                                <span style={{
                                    background: profile?.role === 'superadmin' ? 'rgba(168,85,247,0.15)' : 'rgba(232,184,109,0.15)',
                                    color: profile?.role === 'superadmin' ? '#c084fc' : '#e8b86d',
                                    padding: '0.2rem 0.65rem', borderRadius: '999px', fontSize: '0.78rem', fontWeight: '600', textTransform: 'capitalize',
                                }}>
                                    {profile?.role || '—'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Feedback */}
                    {error && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '10px', padding: '0.75rem 1rem', color: '#f87171', fontSize: '0.875rem', marginBottom: '1rem' }}>
                            <AlertCircle size={15} /> {error}
                        </div>
                    )}
                    {success && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: '10px', padding: '0.75rem 1rem', color: '#4ade80', fontSize: '0.875rem', marginBottom: '1rem' }}>
                            <CheckCircle size={15} /> Profile updated!
                        </div>
                    )}

                    <button type="submit" disabled={saving} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%', padding: '0.85rem', background: 'var(--color-accent, #e8b86d)', border: 'none', borderRadius: '10px', color: '#000', fontWeight: '700', fontSize: '0.95rem', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}>
                        {saving ? <><Loader2 size={16} /> Saving…</> : <><Save size={16} /> Save Profile</>}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminProfile;
