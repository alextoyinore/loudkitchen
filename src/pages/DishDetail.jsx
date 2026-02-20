import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { ArrowLeft, Clock, CheckCircle, XCircle } from 'lucide-react';

const DishDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { menuItems } = useData();

    const dish = menuItems.find(item => String(item.id) === id);

    if (!dish) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-primary text-white">
                <h2 className="text-3xl mb-4">Dish not found</h2>
                <button onClick={() => navigate('/menu')} className="btn btn-primary">
                    Back to Menu
                </button>
            </div>
        );
    }

    return (
        <div className="dish-detail-page bg-primary min-h-screen">
            <div className="container py-12">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-400 hover:text-accent transition-colors mb-8"
                >
                    <ArrowLeft size={20} />
                    <span>Back</span>
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    {/* Left Column: Image */}
                    <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-800 relative bg-secondary h-72 md:h-96 lg:h-[500px]">
                        <img
                            src={dish.image_url}
                            alt={dish.name}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute top-4 right-4 bg-black-70 backdrop-blur-md px-4 py-2 rounded-lg border border-white-10">
                            <span className="text-accent font-bold text-xl">₦{dish.price}</span>
                        </div>
                    </div>

                    {/* Right Column: Details */}
                    <div className="space-y-8">
                        <div>
                            <span className="inline-block px-3 py-1 bg-accent-10 text-accent border border-accent-20 rounded-full text-xs font-bold tracking-wider uppercase mb-4">
                                {dish.category}
                            </span>
                            <h1 className="text-4xl md:text-5xl font-heading mb-4 leading-tight">{dish.name}</h1>
                            <div className="flex items-center gap-8 text-sm text-gray-400 border-b border-gray-800 pb-6">
                                <div className="flex items-center gap-4">
                                    <Clock size={18} className="text-accent" />
                                    <span>20 Mins Preparation</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    {dish.is_available ? (
                                        <>
                                            <CheckCircle size={18} className="text-green-500" />
                                            <span>In Stock</span>
                                        </>
                                    ) : (
                                        <>
                                            <XCircle size={18} className="text-red-500" />
                                            <span>Out of Stock</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xl font-bold mb-3 text-white">Description</h3>
                            <p className="text-gray-400 leading-relaxed text-lg">
                                {dish.description}
                            </p>
                        </div>

                        <div className="bg-secondary p-6 rounded-xl border border-gray-800">
                            <p className="text-gray-300 italic mb-4">
                                "Our chefs recommend pairing this with a light white wine or our signature cocktail."
                            </p>
                            <div className="flex gap-4 border-gray-700-50">
                                <button className="flex-1 btn btn-primary py-3">
                                    Add to Order
                                </button>
                                <button className="flex-1 btn btn-outline py-3">
                                    Share
                                </button>
                            </div>
                        </div>

                        <p className="text-xs text-center text-gray-500 mt-4">
                            * Prices may vary based on customization.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DishDetail;
