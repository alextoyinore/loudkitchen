import React from 'react';

const About = () => {
    return (
        <div className="about-page">
            <div className="container section">
                <div className="flex flex-col md:flex-row gap-12 items-center">
                    <div className="md:w-1/2">
                        <h1 className="mb-6">Who We <span className="text-accent">Are</span></h1>
                        <p className="text-lg text-gray-300 mb-6">
                            Loudkitchen wasn't born in a boardroom; it was born in a jam session.
                            Founded by Chef Michael and DJ Alex, we wanted to create a space where the
                            energy of a concert meets the refinement of fine dining.
                        </p>
                        <p className="text-gray-400 mb-6">
                            We believe that food tastes better when the vibe is right. That's why we
                            curate our playlists as carefully as our wine list. Every beat, every bite,
                            is designed to amplify your night.
                        </p>
                        <img
                            src="https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&q=80&w=800"
                            alt="Kitchen Team"
                            className="rounded-lg shadow-lg"
                        />
                    </div>
                    <div className="md:w-1/2 grid grid-cols-2 gap-4">
                        <img
                            src="https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&q=80&w=600"
                            alt="Bar Vibes"
                            className="rounded-lg w-full h-full object-cover mt-12"
                        />
                        <img
                            src="https://images.unsplash.com/photo-1550966871-3ed3c47e2ce2?auto=format&fit=crop&q=80&w=600"
                            alt="Dining Room"
                            className="rounded-lg w-full h-full object-cover -mb-12"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
