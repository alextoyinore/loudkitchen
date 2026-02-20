import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { ArrowRight, Star, Quote } from 'lucide-react';
import heroVideo from '../assets/hero_vid.mp4';
import { supabase } from '../lib/supabase';

const FeaturedReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeatured = async () => {
            const { data } = await supabase
                .from('reviews')
                .select('*')
                .eq('is_featured', true)
                .limit(3);
            if (data) setReviews(data);
            setLoading(false);
        };
        fetchFeatured();
    }, []);

    if (loading) return null;
    if (reviews.length === 0) return (
        <section className="section bg-secondary text-center">
            <div className="container">
                <div className="flex justify-center gap-1 text-accent mb-4">
                    <Star fill="currentColor" />
                    <Star fill="currentColor" />
                    <Star fill="currentColor" />
                    <Star fill="currentColor" />
                    <Star fill="currentColor" />
                </div>
                <h2 className="text-3xl mb-8">"The vibe is unmatched."</h2>
                <p className="text-gray-400">- Food & Wine Magazine</p>
            </div>
        </section>
    );

    return (
        <section className="section bg-secondary overflow-hidden">
            <div className="container">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl mb-4">Guest <span className="text-accent">Testimonials</span></h2>
                    <p className="text-gray-400">What people are saying about their LoudKitchen experience.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {reviews.map(review => (
                        <div key={review.id} className="bg-primary p-8 rounded-3xl relative border border-white/5 hover:border-accent/20 transition-all duration-300">
                            <Quote size={40} className="absolute top-4 right-8 opacity-5 text-accent" />
                            <div className="flex gap-1 mb-6">
                                {[...Array(review.rating)].map((_, i) => <Star key={i} size={14} fill="var(--color-accent, #e8b86d)" color="var(--color-accent, #e8b86d)" />)}
                            </div>
                            <p className="text-gray-300 mb-8 italic leading-relaxed">"{review.feedback}"</p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-accent text-black flex items-center justify-center font-bold">
                                    {review.name[0].toUpperCase()}
                                </div>
                                <h4 className="font-bold text-white uppercase tracking-wider text-xs">{review.name}</h4>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <Link to="/reviews" className="inline-flex items-center gap-2 text-accent hover:underline font-medium">
                        Read All Reviews <ArrowRight size={16} />
                    </Link>
                </div>
            </div>
        </section>
    );
};

const Home = () => {
    const { siteSettings, menuItems } = useData();

    // Get 3 featured items (just taking the first 3 for now)
    const featuredItems = menuItems.slice(0, 3);

    // Use siteSettings video if available, otherwise fallback to local asset
    const videoSource = siteSettings?.hero_video_url || heroVideo;

    // Helper to style bracketed text (e.g. LOUD[KITCHEN] -> LOUD<span class="text-accent">KITCHEN</span>)
    const renderStyledText = (text, defaultContent) => {
        if (!text) return defaultContent;
        const parts = text.split(/\[(.*?)\]/);
        if (parts.length < 2) return text;
        return (
            <>
                {parts[0]}
                <span className="text-accent">{parts[1]}</span>
                {parts[2]}
            </>
        );
    };

    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero relative h-screen w-full overflow-hidden flex items-center justify-center">
                <video
                    key={videoSource}
                    autoPlay
                    muted
                    loop
                    playsInline
                    webkit-playsinline="true"
                    preload="auto"
                    className="absolute top-0 left-0 w-full h-full object-cover z-0"
                    style={{ filter: 'brightness(0.3)' }}
                >
                    <source src={videoSource} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>

                <div className="relative z-10 text-center container">
                    <h1 className="text-6xl md:text-8xl font-bold mb-4 tracking-tight animate-fade-in-up">
                        {renderStyledText(siteSettings?.hero_title, <>LOUD<span className="text-accent">KITCHEN</span></>)}
                    </h1>
                    <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto text-gray-300">
                        {siteSettings?.hero_subtitle || 'A symphony of flavors in a vibrant atmosphere.'}
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Link to="/book" className="btn btn-primary">Book a Table</Link>
                        <Link to="/menu" className="btn btn-outline">View Menu</Link>
                    </div>
                </div>
            </section>

            {/* Intro Section */}
            <section className="section bg-secondary text-center">
                <div className="container">
                    <h2 className="text-4xl mb-6">
                        {renderStyledText(siteSettings?.about_title, <>Taste the <span className="text-accent">Rhythm</span></>)}
                    </h2>
                    <p className="max-w-3xl mx-auto text-lg text-gray-400 mb-10">
                        {siteSettings?.about_text || 'At Loudkitchen, we believe dining is an experience that engages all senses. From our carefully curated playlists to our visually stunning dishes, every detail is designed to amplify your evening.'}
                    </p>
                    <img
                        src={siteSettings?.about_image_url || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1200"}
                        alt="Restaurant Interior"
                        className="w-full h-96 object-cover rounded-lg shadow-2xl opacity-80"
                    />
                </div>
            </section>

            {/* Featured Menu */}
            <section className="section bg-primary">
                <div className="container">
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <h2 className="mb-2">Signature <span className="text-accent">Dishes</span></h2>
                            <p className="text-gray-400">Culinary masterpieces you shouldn't miss.</p>
                        </div>
                        <Link to="/menu" className="flex items-center gap-2 text-accent hover:text-white transition-colors">
                            View Full Menu <ArrowRight size={20} />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                        {featuredItems.map(item => (
                            <Link
                                to={`/menu/${item.id}`}
                                key={item.id}
                                className="bg-secondary rounded-xl overflow-hidden group hover:-translate-y-2 transition-all duration-300 block border border-transparent hover:border-gray-800"
                            >
                                {/* Image Container */}
                                <div className="relative h-64 overflow-hidden">
                                    <img
                                        src={item.image_url}
                                        alt={item.name}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    {/* Price Overlay */}
                                    <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 shadow-lg">
                                        <span className="text-accent font-bold text-lg">₦{item.price}</span>
                                    </div>
                                </div>

                                {/* Content Container */}
                                <div className="p-6">
                                    <div className="mb-4">
                                        <h3 className="text-2xl font-heading uppercase tracking-wide mb-2 group-hover:text-accent transition-colors">
                                            {item.name}
                                        </h3>
                                        <p className="text-gray-400 text-sm line-clamp-3 leading-relaxed">
                                            {item.description}
                                        </p>
                                    </div>

                                    <div className="flex justify-between items-center pt-4">
                                        <span className={`text-xs px-2.5 py-1 rounded-full ${item.is_available
                                            ? 'text-green-400 bg-green-500/10'
                                            : 'text-red-400 bg-red-500/10'
                                            }`}>
                                            {item.is_available ? 'In Stock' : 'Sold Out'}
                                        </span>

                                        <span className="text-accent text-sm font-medium flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                            Details <ArrowRight size={14} />
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Reviews / Social Proof */}
            <FeaturedReviews />


        </div>
    );
};

export default Home;
