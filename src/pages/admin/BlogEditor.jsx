import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Edit, Trash, Plus, X } from 'lucide-react';

const BlogEditor = () => {
    const { blogPosts, addBlogPost } = useData();
    const [isEditing, setIsEditing] = useState(false);

    // For now, we only support adding new posts in this simple mock
    // In a real app, we'd have full edit capability similar to MenuEditor

    const initialFormState = {
        title: '',
        excerpt: '',
        content: '',
        image: '',
        author: 'Admin'
    };

    const [formData, setFormData] = useState(initialFormState);

    const handleSubmit = (e) => {
        e.preventDefault();
        addBlogPost(formData);
        closeModal();
    };

    const closeModal = () => {
        setIsEditing(false);
        setFormData(initialFormState);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Blog Management</h1>
                <button
                    onClick={() => setIsEditing(true)}
                    className="bg-accent text-black px-4 py-2 rounded flex items-center gap-2 font-bold"
                >
                    <Plus size={20} /> New Post
                </button>
            </div>

            <div className="space-y-4">
                {blogPosts.map(post => (
                    <div key={post.id} className="bg-gray-800 p-4 rounded-lg flex gap-4 items-start">
                        <div className="w-24 h-24 flex-shrink-0 bg-gray-700 rounded overflow-hidden">
                            <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-xl font-bold mb-1">{post.title}</h3>
                            <p className="text-sm text-gray-400 mb-2">{post.date} by {post.author}</p>
                            <p className="text-gray-300">{post.excerpt}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {isEditing && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-800 p-6 rounded-lg w-full max-w-2xl relative max-h-[90vh] overflow-y-auto">
                        <button
                            onClick={closeModal}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white"
                        >
                            <X />
                        </button>

                        <h2 className="text-2xl font-bold mb-6">Create New Post</h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Title</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full bg-gray-700 border-gray-600 rounded p-2 text-white"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Image URL</label>
                                <input
                                    type="text"
                                    value={formData.image}
                                    onChange={e => setFormData({ ...formData, image: e.target.value })}
                                    className="w-full bg-gray-700 border-gray-600 rounded p-2 text-white"
                                    placeholder="https://..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Excerpt</label>
                                <textarea
                                    value={formData.excerpt}
                                    onChange={e => setFormData({ ...formData, excerpt: e.target.value })}
                                    className="w-full bg-gray-700 border-gray-600 rounded p-2 text-white"
                                    rows="2"
                                    required
                                ></textarea>
                            </div>

                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Content</label>
                                <textarea
                                    value={formData.content}
                                    onChange={e => setFormData({ ...formData, content: e.target.value })}
                                    className="w-full bg-gray-700 border-gray-600 rounded p-2 text-white font-mono"
                                    rows="10"
                                    required
                                ></textarea>
                            </div>

                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Author</label>
                                <input
                                    type="text"
                                    value={formData.author}
                                    onChange={e => setFormData({ ...formData, author: e.target.value })}
                                    className="w-full bg-gray-700 border-gray-600 rounded p-2 text-white"
                                />
                            </div>

                            <button type="submit" className="w-full bg-accent text-black font-bold py-2 rounded mt-4">
                                Publish Post
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BlogEditor;
