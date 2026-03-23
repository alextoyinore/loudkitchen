import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ServerCrash } from 'lucide-react';

const ServerError = () => {
    return (
        <div className="min-h-[70vh] flex items-center justify-center section bg-secondary font-outfit">
            <div className="container text-center px-4">
                <div className="inline-flex items-center justify-center p-6 bg-red-500/10 rounded-full mb-8 border border-red-500/20">
                    <ServerCrash size={64} className="text-red-500" />
                </div>
                <h1 className="text-7xl md:text-9xl font-black italic mb-6 leading-none text-red-500">
                    5<span className="text-white">0</span>0
                </h1>
                <h2 className="text-3xl md:text-5xl font-black mb-6 uppercase tracking-tight">
                    Server Error
                </h2>
                <p className="text-gray-400 font-bold max-w-lg mx-auto mb-10 text-lg">
                    Oops! Something went wrong in our kitchen. We're working on fixing the issue. Please try again later.
                </p>
                <Link to="/" className="btn bg-white text-black px-10 py-4 font-black uppercase tracking-[0.2em] text-xs rounded-full hover:scale-105 active:scale-95 transition-all shadow-xl inline-flex items-center gap-3">
                    <Home size={16} /> Back to Home
                </Link>
            </div>
        </div>
    );
};

export default ServerError;
