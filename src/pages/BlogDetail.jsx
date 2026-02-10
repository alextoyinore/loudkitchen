import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { ArrowLeft, Calendar, User, Share2 } from 'lucide-react';

const BlogDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { blogPosts } = useData();

    // Convert id to number
    const post = blogPosts.find(item => item.id === parseInt(id));

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
        <div className="blog-detail-page max-w-2xl mx-auto bg-primary min-h-screen pt-12 md:pt-20 pb-20">
            <div className="container px-4 md:px-8">
                {/* Back Link */}
                <Link to="/blog" className="inline-flex items-center gap-2 text-gray-400 hover:text-accent transition-colors mb-8">
                    <ArrowLeft size={16} /> <span className="text-sm font-bold uppercase tracking-wider">Back to Blog</span>
                </Link>

                {/* Header */}
                <header className="text-center mb-12">
                    <div className="flex justify-center gap-6 text-sm font-medium text-accent mb-4 uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                            <span>{post.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span>By {post.author}</span>
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading mb-8 leading-tight">{post.title}</h1>
                </header>

                {/* Hero Image */}
                <div className="rounded-xl overflow-hidden mb-12 shadow-2xl">
                    <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-auto object-cover max-h-[600px]"
                    />
                </div>

                {/* Main Content */}
                <div className="prose prose-invert prose-lg max-w-none mx-auto">
                    <p className="text-xl md:text-2xl text-gray-400 leading-relaxed mb-12 font-light text-center italic py-4">
                        {post.excerpt}
                    </p>
                    <div className="text-gray-300 space-y-6 leading-loose whitespace-pre-line font-light text-lg">
                        {post.content}
                    </div>
                </div>

                {/* Footer / Share */}
                <div className="my-24 py-12 flex flex-col md:flex-row justify-between items-center gap-10">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gray-700 overflow-hidden">
                            <img src={`https://ui-avatars.com/api/?name=${post.author}&background=random`} alt={post.author} className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <h4 className="font-bold text-white">{post.author}</h4>
                            <p className="text-xs text-gray-500 uppercase tracking-wider">Loudkitchen Team</p>
                        </div>
                    </div>

                    <button className="my-12 flex items-center gap-2 text-gray-400 hover:text-accent transition-colors">
                        <Share2 size={18} /> <span className="uppercase tracking-widest text-sm font-bold">Share Article</span>
                    </button>
                </div>

                {/* More Stories */}
                <div className="mt-20">
                    <h3 className="text-2xl font-heading mb-8 text-center uppercase">More Stories</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {blogPosts.filter(p => p.id !== post.id).slice(0, 3).map(related => (
                            <Link to={`/blog/${related.id}`} key={related.id} className="group block bg-secondary rounded-lg overflow-hidden p-4 hover:bg-neutral-800 transition-colors">
                                <h4 className="font-bold text-lg group-hover:text-accent transition-colors mb-2 line-clamp-2">{related.title}</h4>
                                <p className="text-xs text-gray-500 uppercase">{related.date}</p>
                            </Link>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default BlogDetail;
