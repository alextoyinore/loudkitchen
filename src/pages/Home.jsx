import React from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { ArrowRight, Star } from 'lucide-react';
import heroVideo from '../assets/hero_vid.mp4';

const Home = () => {
    const { siteSettings, menuItems } = useData();

    // Get 3 featured items (just taking the first 3 for now)
    const featuredItems = menuItems.slice(0, 3);

    // Use siteSettings video if available, otherwise fallback to local asset
    const videoSource = siteSettings?.heroVideoUrl || heroVideo;

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
                        LOUD<span className="text-accent">KITCHEN</span>
                    </h1>
                    <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto text-gray-300">
                        A symphony of flavors in a vibrant atmosphere.
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
                    <h2 className="text-4xl mb-6">Taste the <span className="text-accent">Rhythm</span></h2>
                    <p className="max-w-3xl mx-auto text-lg text-gray-400 mb-10">
                        At Loudkitchen, we believe dining is an experience that engages all senses.
                        From our carefully curated playlists to our visually stunning dishes,
                        every detail is designed to amplify your evening.
                    </p>
                    <img
                        src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1200"
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

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {featuredItems.map((item) => (
                            <Link to={`/menu/${item.id}`} key={item.id} className="menu-card bg-secondary p-4 rounded-lg hover:transform hover:-translate-y-2 transition-transform duration-300 block">
                                <div className="relative h-64 mb-4 overflow-hidden rounded">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                                    />
                                    <div className="absolute top-2 right-2 bg-black/70 px-3 py-1 rounded text-accent font-bold text-lg">
                                        ₦{item.price}
                                    </div>
                                </div>
                                <h3 className="text-3xl mb-2 uppercase tracking-wide">{item.name}</h3>
                                <p className="text-gray-400 mb-6 text-base">{item.description}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Reviews / Social Proof */}
            <section className="section bg-secondary">
                <div className="container text-center">
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


        </div>
    );
};

export default Home;
