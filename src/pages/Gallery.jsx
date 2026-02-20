import React from 'react';
import { useData } from '../context/DataContext';

const Gallery = () => {
    const { galleryItems } = useData();

    // Fallback placeholder images if no gallery items in DB yet
    const fallbackImages = [
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1550966871-3ed3c47e2ce2?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1551632436-cbf8dd354ca8?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1525610553991-31ddbb07fae4?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&q=80&w=800"
    ];

    const images = galleryItems.length > 0
        ? galleryItems.map(item => ({ src: item.image_url, caption: item.caption, id: item.id }))
        : fallbackImages.map((src, i) => ({ src, caption: '', id: i }));

    return (
        <div className="gallery-page">
            <div className="container section text-center">
                <h1 className="mb-4">Visual <span className="text-accent">Vibes</span></h1>
                <p className="max-w-2xl mx-auto text-gray-400 mb-12">
                    A glimpse into the atmosphere, the people, and the plates that make Loudkitchen unique.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {images.map((img) => (
                        <div key={img.id} className="gallery-item overflow-hidden rounded-lg aspect-square relative group">
                            <img
                                src={img.src}
                                alt={img.caption || `Gallery image`}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                            />
                            {img.caption && (
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                                    <p className="text-white text-sm font-medium">{img.caption}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Gallery;
