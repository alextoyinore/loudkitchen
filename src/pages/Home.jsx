import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { ArrowRight, Star, Heart, Sparkles, Utensils } from 'lucide-react';
import heroVideo from '../assets/hero_vid.mp4';
import { supabase } from '../lib/supabase';
import ReviewCard from '../components/ReviewCard';

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
        <section className="section bg-secondary overflow-hidden py-32 font-outfit">
            <div className="container">
                <div className="text-center mb-20">
                    <div className="inline-flex items-center gap-2 bg-accent/10 px-4 py-1.5 rounded-full border border-accent/20 mb-6">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-accent">Loved by many</span>
                    </div>
                    <h2 className="text-5xl md:text-7xl font-outfit font-black italic mb-6 leading-tight">
                        Guest <span className="text-accent">Stories</span>
                    </h2>
                    <p className="text-gray-400 font-bold max-w-xl mx-auto">What people are saying about their LoudKitchen experience.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {reviews.map(review => (
                        <ReviewCard key={review.id} review={review} />
                    ))}
                </div>

                <div className="text-center mt-20">
                    <Link to="/reviews" className="btn bg-white/5 text-white border-2 border-white/5 hover:border-accent/20 transition-all font-black uppercase tracking-widest text-xs py-5 px-10 rounded-full">
                        Read All Stories
                    </Link>
                </div>
            </div>
        </section>
    );
};

const Home = () => {
    const { siteSettings, menuItems } = useData();
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    // Get 3 featured items (just taking the first 3 for now)
    const featuredItems = menuItems.slice(0, 3);
    const featuredMenu = menuItems; // Using full menu for categories section

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
                    <div className={`hero-content max-w-4xl mx-auto transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
                        <div className="inline-flex items-center gap-2 bg-accent/10 px-4 py-1.5 rounded-full border border-accent/20 mb-8 backdrop-blur-sm">
                            <Utensils size={14} className="text-accent" />
                            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent">LoudKitchen Experience</span>
                        </div>
                        {/* <h1 className="text-5xl md:text-7xl lg:text-9xl font-black mb-8 leading-[0.9] tracking-tighter">
                            SOUND OF <br />
                            <span className="text-accent italic">FLAVOUR</span>
                        </h1> */}
                        {/* <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto font-medium leading-relaxed italic">
                            Experience the fusion of culinary art and vibrant atmosphere. <br className="hidden md:block" />
                            Where every bite has a rhythm of its own.
                        </p> */}
                        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                            <Link to="/menu" className="btn bg-accent text-black px-12 py-5 font-black uppercase tracking-[0.2em] text-xs rounded-full hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-accent/20 w-full sm:w-auto">
                                Explore Menu
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Intro Section */}
            <section className="section bg-secondary text-center py-32 rounded-t-[80px] -mt-20 relative z-10 font-outfit">
                <div className="container">
                    <div className="mb-10 inline-block bg-accent/10 p-4 rounded-[30px]">
                        <Utensils size={32} className="text-accent" />
                    </div>
                    <h2 className="text-5xl md:text-7xl font-outfit font-black italic mb-8 leading-tight">
                        {renderStyledText(siteSettings?.about_title, <>Taste the <span className="text-accent">Rhythm</span></>)}
                    </h2>
                    <p className="max-w-3xl mx-auto text-xl text-gray-400 mb-16 font-bold leading-relaxed italic">
                        {siteSettings?.about_text || 'At Loudkitchen, we believe dining is an experience that engages all senses. From our carefully curated playlists to our visually stunning dishes, every detail is designed to amplify your evening.'}
                    </p>
                    <div className="relative inline-block group">
                        <div className="absolute -inset-4 bg-accent/20 blur-2xl rounded-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                        <img
                            src={siteSettings?.about_image_url || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1200"}
                            alt="Restaurant Interior"
                            className="relative w-full h-[600px] object-cover rounded-[60px] shadow-2xl transition-transform duration-700 group-hover:scale-[1.02]"
                        />
                    </div>
                </div>
            </section>

            {/* Categories / Teaser */}
            <section className="py-24 md:py-32 relative">
                <div className="container px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-16">
                        <div className="space-y-6">
                            <div className="w-16 h-1 bg-accent mb-10"></div>
                            <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-none uppercase italic">The Kitchen <br /> <span className="text-accent">Rhythm</span></h2>
                            <p className="text-gray-400 font-medium leading-relaxed">
                                Our kitchen operates like a symphony. Every ingredient is a note, and every dish is a masterpiece designed to move your soul.
                            </p>
                            <Link to="/about" className="inline-flex items-center gap-2 text-accent font-black uppercase tracking-[0.2em] text-[10px] group">
                                Learn Our Story <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
                            </Link>
                        </div>

                        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-10">
                            {featuredMenu.slice(0, 4).map((dish, i) => (
                                <Link
                                    to={`/menu/${dish.id}`}
                                    key={dish.id}
                                    className="group relative h-[300px] md:h-[400px] rounded-[40px] overflow-hidden border-2 border-white/5 shadow-xl hover:border-accent/20 transition-all duration-700"
                                >
                                    <img src={dish.image_url} alt={dish.name} className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110" />
                                    <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
                                        <p className="text-[10px] font-black tracking-[0.3em] uppercase text-accent mb-2">{dish.category}</p>
                                        <h3 className="text-2xl font-black text-white italic truncate">{dish.name}</h3>
                                    </div>
                                    <div className="absolute top-6 right-6 bg-accent text-black font-black px-4 py-2 rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                                        ₦{dish.price.toLocaleString()}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Menu */}
            <section className="section bg-[#080808] py-40 font-outfit">
                <div className="container">
                    <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-20 text-center md:text-left gap-8">
                        <div>
                            <div className="inline-flex items-center gap-2 bg-accent/10 px-4 py-1.5 rounded-full border border-accent/20 mb-6">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-accent">Chef's Favorites</span>
                            </div>
                            <h2 className="text-5xl md:text-7xl font-outfit font-black italic leading-tight">Signature <span className="text-accent">Dishes</span></h2>
                            <p className="text-gray-400 font-bold mt-4">Culinary masterpieces you shouldn't miss.</p>
                        </div>
                        <Link to="/menu" className="btn bg-accent text-black font-black uppercase tracking-widest text-xs py-5 px-10 rounded-full shadow-xl hover:scale-110 active:scale-95 transition-all flex items-center justify-center gap-2 whitespace-nowrap w-full sm:w-auto">
                            Explore Menu <ArrowRight size={18} />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                        {featuredItems.map(item => (
                            <Link
                                to={`/menu/${item.id}`}
                                key={item.id}
                                className="bg-secondary/40 backdrop-blur-xl rounded-[60px] overflow-hidden group hover:bg-secondary/60 transition-all duration-700 block border-2 border-white/5 hover:border-accent/20 shadow-xl"
                            >
                                {/* Image Container */}
                                <div className="relative h-80 overflow-hidden m-4 rounded-[45px]">
                                    <img
                                        src={item.image_url}
                                        alt={item.name}
                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                    />
                                    {/* Price Overlay */}
                                    <div className="absolute bottom-6 right-6 bg-accent p-4 rounded-full shadow-2xl -rotate-12 group-hover:rotate-0 transition-transform duration-500">
                                        <span className="text-black font-black text-xs uppercase tracking-widest leading-none">₦{item.price.toLocaleString()}</span>
                                    </div>
                                </div>

                                {/* Content Container */}
                                <div className="p-10 pt-4">
                                    <div className="mb-6">
                                        <h3 className="text-3xl font-outfit font-black italic mb-4 group-hover:text-accent transition-colors leading-tight">
                                            {item.name}
                                        </h3>
                                        <p className="text-gray-400 font-bold text-sm line-clamp-2 leading-relaxed italic">
                                            {item.description}
                                        </p>
                                    </div>

                                    <div className="flex justify-between items-center pt-6 border-t border-white/5">
                                        <span className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full ${item.is_available
                                            ? 'text-accent bg-accent/10'
                                            : 'text-gray-500 bg-white/5'
                                            }`}>
                                            {item.is_available ? 'Ready Now ✨' : 'Sold Out'}
                                        </span>

                                        <span className="text-accent font-black uppercase tracking-widest text-[10px] flex items-center gap-2 group-hover:translate-x-2 transition-transform">
                                            Taste It <ArrowRight size={14} />
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
