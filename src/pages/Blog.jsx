import React from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { ArrowRight, Newspaper } from 'lucide-react';

const Blog = () => {
    const { blogPosts } = useData();

    return (
        <div className="blog-page bg-[#080808] min-h-screen pb-24 font-outfit relative overflow-hidden">
            {/* Header Section with Background */}
            <div className="relative pt-48 pb-32 mb-16 md:mb-24 overflow-hidden">
                {/* Background Image with Dark Overlay */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=2000"
                        alt="Blog Background"
                        className="w-full h-full object-cover grayscale-[0.8] brightness-[0.2]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#080808] via-transparent to-[#080808]"></div>
                </div>

                <div className="container relative z-10 px-4 max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div className="space-y-4">
                            <div className="w-12 h-1 bg-accent"></div>
                            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase leading-[0.9] tracking-tighter text-white">
                                THE <br />
                                <span className="text-accent italic">PULSE</span>
                            </h1>
                        </div>
                        <p className="max-w-md text-gray-400 font-medium italic text-lg leading-relaxed">
                            Insights into the rhythm of food, sound, and culture.
                        </p>
                    </div>
                </div>
            </div>

            {/* Ambient Background */}
            <div className="fixed top-0 right-0 w-[50vw] h-[50vw] bg-accent/3 blur-[160px] pointer-events-none rounded-full"></div>
            <div className="fixed -bottom-20 -left-20 w-[40vw] h-[40vw] bg-white/5 blur-[140px] pointer-events-none rounded-full"></div>

            <div className="container relative z-10 px-4 max-w-7xl mx-auto">
                <div className="flex flex-col gap-10 md:gap-16">
                    {blogPosts.map(post => (
                        <Link
                            to={`/blog/${post.id}`}
                            key={post.id}
                            className="group bg-secondary/30 backdrop-blur-xl rounded-[32px] md:rounded-[40px] overflow-hidden border-2 border-white/5 hover:border-accent/20 transition-all duration-700 shadow-xl flex flex-col md:flex-row h-full md:min-h-[300px]"
                        >
                            <div className="h-48 md:h-auto md:w-[35%] lg:w-[380px] overflow-hidden relative flex-shrink-0">
                                <img
                                    src={post.cover_image}
                                    alt={post.title}
                                    className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-transform duration-1000 group-hover:scale-105"
                                />
                                <div className="absolute top-4 left-4 bg-accent text-black font-black px-3 py-1.5 rounded-full text-[9px] uppercase tracking-widest shadow-xl">
                                    {post.category}
                                </div>
                            </div>
                            <div className="p-6 md:p-10 lg:p-12 flex flex-col justify-center flex-1">
                                <div className="flex items-center gap-3 mb-4 text-[9px] font-black uppercase tracking-[0.3em] text-gray-500">
                                    <span>{new Date(post.created_at).toLocaleDateString()}</span>
                                    <span className="w-1 h-1 bg-accent rounded-full"></span>
                                    <span>5 min read</span>
                                </div>
                                <h2 className="text-xl md:text-2xl lg:text-3xl font-black italic text-white mb-4 uppercase leading-[0.9] tracking-tighter group-hover:text-accent transition-colors">{post.title}</h2>
                                <p className="text-gray-400 font-medium text-xs md:text-sm lg:text-base italic mb-8 line-clamp-2 leading-relaxed">{post.content.replace(/<[^>]*>?/gm, '').substring(0, 160)}...</p>
                                <div className="flex items-center gap-2 text-white font-black uppercase tracking-[0.2em] text-[10px] md:text-xs group/btn hover:text-accent transition-colors pt-4 border-t border-white/5 self-start">
                                    Read Pulse <ArrowRight size={14} className="group-hover/btn:translate-x-2 transition-transform" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Blog;
