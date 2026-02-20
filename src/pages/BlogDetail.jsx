import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { ArrowLeft, Calendar, User, Share2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const markdownComponents = {
    h1: ({ children }) => <h1 className="text-3xl md:text-4xl font-heading font-bold text-white mb-6 mt-10 leading-tight">{children}</h1>,
    h2: ({ children }) => <h2 className="text-2xl md:text-3xl font-heading font-bold text-white mb-5 mt-8 leading-tight">{children}</h2>,
    h3: ({ children }) => <h3 className="text-xl md:text-2xl font-heading font-semibold text-white mb-4 mt-6">{children}</h3>,
    h4: ({ children }) => <h4 className="text-lg font-heading font-semibold text-gray-200 mb-3 mt-5">{children}</h4>,
    p: ({ children }) => <p className="text-gray-300 leading-relaxed mb-8 text-base md:text-lg">{children}</p>,
    strong: ({ children }) => <strong className="text-white font-bold">{children}</strong>,
    em: ({ children }) => <em className="text-gray-200 italic">{children}</em>,
    ul: ({ children }) => <ul className="list-disc list-outside pl-8 my-6 space-y-3 text-gray-300">{children}</ul>,
    ol: ({ children }) => <ol className="list-decimal list-outside pl-8 my-6 space-y-3 text-gray-300">{children}</ol>,
    li: ({ children }) => <li className="leading-relaxed text-base md:text-lg pl-1">{children}</li>,
    blockquote: ({ children }) => (
        <blockquote className="border-l-4 border-accent pl-6 py-2 my-6 bg-white/5 rounded-r-xl italic text-gray-300">
            {children}
        </blockquote>
    ),
    code: ({ inline, children }) => inline
        ? <code className="bg-white/10 text-accent font-mono text-sm px-1.5 py-0.5 rounded">{children}</code>
        : <pre className="bg-[#0a0a0a] border border-white/10 rounded-xl p-5 my-6 overflow-x-auto"><code className="font-mono text-sm text-gray-300 leading-relaxed">{children}</code></pre>,
    a: ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer" className="text-accent underline underline-offset-4 hover:text-white transition-colors">{children}</a>,
    hr: () => <hr className="border-t border-white/10 my-10" />,
    img: ({ src, alt }) => <img src={src} alt={alt} className="rounded-2xl max-w-full my-8 shadow-lg" />,
    table: ({ children }) => <div className="overflow-x-auto my-8"><table className="w-full border-collapse text-gray-300">{children}</table></div>,
    th: ({ children }) => <th className="border border-white/10 bg-white/5 px-4 py-3 text-left text-white font-heading font-semibold text-sm uppercase tracking-wider">{children}</th>,
    td: ({ children }) => <td className="border border-white/10 px-4 py-3 text-sm">{children}</td>,
};

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
                        <div className="prose prose-invert max-w-none">
                            <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                                {post.content}
                            </ReactMarkdown>
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
