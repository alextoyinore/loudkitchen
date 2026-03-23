import React from 'react';
import { Link } from 'react-router-dom';
import { Home, AlertCircle } from 'lucide-react';

const NotFound = () => {
    return (
        <div className="min-h-[70vh] flex items-center justify-center section bg-secondary font-outfit">
            <div className="container text-center px-4">
                <div className="inline-flex items-center justify-center p-6 bg-accent/10 rounded-full mb-8">
                    <AlertCircle size={64} className="text-accent" />
                </div>
                <h1 className="text-7xl md:text-9xl font-black italic mb-6 leading-none">
                    4<span className="text-accent">0</span>4
                </h1>
                <h2 className="text-3xl md:text-5xl font-black mb-6 uppercase tracking-tight">
                    Page Not Found
                </h2>
                <p className="text-gray-400 font-bold max-w-lg mx-auto mb-10 text-lg">
                    The dish you're looking for seems to have been taken off the menu, or the page simply doesn't exist.
                </p>
                <Link to="/" className="btn bg-accent text-black px-10 py-4 font-black uppercase tracking-[0.2em] text-xs rounded-full hover:scale-105 active:scale-95 transition-all shadow-xl shadow-accent/20 inline-flex items-center gap-3">
                    <Home size={16} /> Back to Home
                </Link>
            </div>
        </div>
    );
};

export default NotFound;
