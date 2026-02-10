import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Edit, Trash, Plus, X } from 'lucide-react';

const MenuEditor = () => {
    const { menuItems, addMenuItem, updateMenuItem, deleteMenuItem } = useData();
    const [isEditing, setIsEditing] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);

    const initialFormState = {
        name: '',
        category: 'Mains',
        price: '',
        description: '',
        image: '',
        available: true
    };

    const [formData, setFormData] = useState(initialFormState);

    const handleEdit = (item) => {
        setIsEditing(true);
        setCurrentItem(item);
        setFormData(item);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            deleteMenuItem(id);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (currentItem) {
            updateMenuItem(currentItem.id, formData);
        } else {
            addMenuItem(formData);
        }
        closeModal();
    };

    const closeModal = () => {
        setIsEditing(false);
        setCurrentItem(null);
        setFormData(initialFormState);
    };

    const categories = ['Starters', 'Mains', 'Desserts', 'Drinks'];

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Menu Management</h1>
                <button
                    onClick={() => setIsEditing(true)}
                    className="bg-accent text-black px-4 py-2 rounded flex items-center gap-2 font-bold"
                >
                    <Plus size={20} /> Add Item
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {menuItems.map(item => (
                    <div key={item.id} className="bg-gray-800 rounded-lg overflow-hidden flex flex-col">
                        <div className="h-48 relative">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            <div className="absolute top-2 right-2 flex gap-2">
                                <button
                                    onClick={() => handleEdit(item)}
                                    className="p-2 bg-blue-600 rounded-full text-white hover:bg-blue-700"
                                >
                                    <Edit size={16} />
                                </button>
                                <button
                                    onClick={() => handleDelete(item.id)}
                                    className="p-2 bg-red-600 rounded-full text-white hover:bg-red-700"
                                >
                                    <Trash size={16} />
                                </button>
                            </div>
                        </div>
                        <div className="p-4 flex-1">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-lg">{item.name}</h3>
                                <span className="text-accent font-mono">${item.price}</span>
                            </div>
                            <span className="text-xs bg-gray-700 px-2 py-1 rounded mb-2 inline-block text-gray-300">
                                {item.category}
                            </span>
                            <p className="text-gray-400 text-sm mt-2">{item.description}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {isEditing && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md relative">
                        <button
                            onClick={closeModal}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white"
                        >
                            <X />
                        </button>

                        <h2 className="text-2xl font-bold mb-6">
                            {currentItem ? 'Edit Item' : 'Add New Item'}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-gray-700 border-gray-600 rounded p-2 text-white"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Category</label>
                                    <select
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full bg-gray-700 border-gray-600 rounded p-2 text-white"
                                    >
                                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Price</label>
                                    <input
                                        type="number"
                                        value={formData.price}
                                        onChange={e => setFormData({ ...formData, price: e.target.value })}
                                        className="w-full bg-gray-700 border-gray-600 rounded p-2 text-white"
                                        required
                                    />
                                </div>
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
                                <label className="block text-sm text-gray-400 mb-1">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full bg-gray-700 border-gray-600 rounded p-2 text-white"
                                    rows="3"
                                ></textarea>
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={formData.available}
                                    onChange={e => setFormData({ ...formData, available: e.target.checked })}
                                    id="available"
                                />
                                <label htmlFor="available" className="text-sm text-gray-300">Available</label>
                            </div>

                            <button type="submit" className="w-full bg-accent text-black font-bold py-2 rounded mt-4">
                                Save Item
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MenuEditor;
