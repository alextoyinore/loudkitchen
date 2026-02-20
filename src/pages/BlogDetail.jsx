import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { ArrowLeft, Calendar, User, Share2 } from 'lucide-react';

const BlogDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { blogPosts } = useData();

    const post = blogPosts.find(item => String(item.id) === id);

    if (!post) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-primary text-white">
                <h2 className="text-3xl mb-4">Article not found</h2>
                <button onClick={() => navigate('/blog')} className="btn btn-primary">
                    Back to Blog
                </button>
            </div>
        );
    }

    return (
        <div className="blog-detail-page bg-primary min-h-screen pt-12 md:pt-20 pb-20">
            <div className="container mx-auto px-4 md:px-0">
                <div className="blog-content-wrapper">
                    {/* Back Link */}
                    <Link to="/blog" className="inline-flex items-center gap-2 text-gray-400 hover:text-accent transition-colors mb-8">
                        <ArrowLeft size={16} /> <span className="text-sm font-bold uppercase tracking-wider">Back to Blog</span>
                    </Link>

                    {/* Header */}
                    <header className="mb-12">
                        <div className="flex gap-6 text-sm font-medium text-accent mb-4 uppercase tracking-wider">
                            <span>{post.created_at ? new Date(post.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}</span>
                            <span>By {post.author}</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-heading mb-8 leading-tight">{post.title}</h1>
                    </header>

                    {/* Hero Image */}
                    <div className="rounded-2xl overflow-hidden mb-16 shadow-2xl">
                        <img
                            src={post.cover_image}
                            alt={post.title}
                            className="w-full h-auto object-cover max-h-[200px]"
                        />
                    </div>

                    {/* Main Content */}
                    <div className="max-w-none mx-auto">
                        <p className="text-xl md:text-2xl text-gray-300 leading-relaxed mb-12">
                            {post.excerpt}
                        </p>
                        <div className="text-gray-400 space-y-10 leading-loose whitespace-pre-line text-lg">
                            {post.content}
                        </div>
                    </div>

                    {/* Footer / Share / Author Card */}
                    <div className="mt-32 py-16">
                        <div className="bg-secondary/30 p-8 rounded-3xl border border-gray-800 flex flex-col md:flex-row justify-between items-center gap-10">
                            <div className="flex items-center gap-8">
                                <div className="w-16 h-16 rounded-2xl bg-gray-700 overflow-hidden ring-2 ring-accent/20">
                                    <img src={`https://ui-avatars.com/api/?name=${post.author}&background=d4af37&color=fff`} alt={post.author} className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <p className="text-xs text-accent uppercase tracking-widest mb-1 font-bold">Written By</p>
                                    <h4 className="text-2xl font-heading text-white">{post.author}</h4>
                                    <p className="text-sm text-gray-500 uppercase tracking-wider">Loudkitchen Editorial Team</p>
                                </div>
                            </div>

                            <button className="group flex items-center gap-3 bg-primary px-6 py-4 rounded-2xl border border-gray-800 hover:border-accent transition-all">
                                <Share2 size={18} className="text-gray-400 group-hover:text-accent" />
                                <span className="uppercase tracking-[0.2em] text-xs font-bold text-gray-400 group-hover:text-white">Share Article</span>
                            </button>
                        </div>
                    </div>

                    {/* More Stories */}
                    <div className="mt-32">
                        <h3 className="text-2xl font-heading mb-12 text-center uppercase tracking-[0.3em] text-accent">More Stories</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {blogPosts.filter(p => p.id !== post.id).slice(0, 3).map(related => (
                                <Link to={`/blog/${related.id}`} key={related.id} className="group block bg-secondary/50 rounded-2xl overflow-hidden p-6 border border-gray-800 hover:border-accent hover:bg-secondary transition-all">
                                    <p className="text-[10px] text-accent uppercase tracking-widest mb-3 font-bold">{related.created_at ? new Date(related.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}</p>
                                    <h4 className="font-heading text-xl group-hover:text-white transition-colors mb-2 line-clamp-2 leading-snug">{related.title}</h4>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogDetail;
