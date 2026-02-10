import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Save } from 'lucide-react';

const Settings = () => {
    const { siteSettings, updateSettings } = useData();
    const [formData, setFormData] = useState(siteSettings);
    const [saved, setSaved] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        updateSettings(formData);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Site Settings</h1>

            <div className="bg-gray-800 p-6 rounded-lg max-w-3xl">
                <form onSubmit={handleSubmit} className="space-y-6">

                    <div>
                        <h2 className="text-xl font-bold mb-4 text-accent border-b border-gray-700 pb-2">General</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Restaurant Name</label>
                                <input type="text" value="Loudkitchen" disabled className="w-full bg-gray-700 border-gray-600 rounded p-2 text-gray-400 cursor-not-allowed" />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Language</label>
                                <select className="w-full bg-gray-700 border-gray-600 rounded p-2 text-white">
                                    <option>English</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-xl font-bold mb-4 text-accent border-b border-gray-700 pb-2">Media</h2>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Hero Video URL</label>
                            <input
                                type="text"
                                value={formData.heroVideoUrl}
                                onChange={e => setFormData({ ...formData, heroVideoUrl: e.target.value })}
                                className="w-full bg-gray-700 border-gray-600 rounded p-2 text-white"
                                placeholder="https://..."
                            />
                            <p className="text-xs text-gray-500 mt-1">Direct link to MP4 video for homepage background.</p>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-xl font-bold mb-4 text-accent border-b border-gray-700 pb-2">Contact Information</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Email</label>
                                <input
                                    type="email"
                                    value={formData.contactEmail}
                                    onChange={e => setFormData({ ...formData, contactEmail: e.target.value })}
                                    className="w-full bg-gray-700 border-gray-600 rounded p-2 text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Phone</label>
                                <input
                                    type="text"
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full bg-gray-700 border-gray-600 rounded p-2 text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Address</label>
                                <input
                                    type="text"
                                    value={formData.address}
                                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                                    className="w-full bg-gray-700 border-gray-600 rounded p-2 text-white"
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-xl font-bold mb-4 text-accent border-b border-gray-700 pb-2">Social Media</h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Instagram</label>
                                <input
                                    type="text"
                                    value={formData.socials.instagram}
                                    onChange={e => setFormData({ ...formData, socials: { ...formData.socials, instagram: e.target.value } })}
                                    className="w-full bg-gray-700 border-gray-600 rounded p-2 text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Facebook</label>
                                <input
                                    type="text"
                                    value={formData.socials.facebook}
                                    onChange={e => setFormData({ ...formData, socials: { ...formData.socials, facebook: e.target.value } })}
                                    className="w-full bg-gray-700 border-gray-600 rounded p-2 text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Twitter</label>
                                <input
                                    type="text"
                                    value={formData.socials.twitter}
                                    onChange={e => setFormData({ ...formData, socials: { ...formData.socials, twitter: e.target.value } })}
                                    className="w-full bg-gray-700 border-gray-600 rounded p-2 text-white"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 flex items-center gap-4">
                        <button type="submit" className="bg-accent text-black font-bold px-6 py-3 rounded flex items-center gap-2">
                            <Save size={20} /> Save Settings
                        </button>
                        {saved && <span className="text-green-400 animate-pulse">Settings saved successfully!</span>}
                    </div>

                </form>
            </div>
        </div>
    );
};

export default Settings;
