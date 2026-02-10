import React from 'react';

const Gallery = () => {
    const images = [
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1550966871-3ed3c47e2ce2?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1551632436-cbf8dd354ca8?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1525610553991-31ddbb07fae4?auto=format&fit=crop&q=80&w=800", // Music/Vibe
        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&q=80&w=800"
    ];

    return (
        <div className="gallery-page">
            <div className="container section text-center">
                <h1 className="mb-4">Visual <span className="text-accent">Vibes</span></h1>
                <p className="max-w-2xl mx-auto text-gray-400 mb-12">
                    A glimpse into the atmosphere, the people, and the plates that make Loudkitchen unique.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {images.map((src, index) => (
                        <div key={index} className="gallery-item overflow-hidden rounded-lg aspect-square relative group">
                            <img
                                src={src}
                                alt={`Gallery ${index + 1}`}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Gallery;
