import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';

const Blog = () => {
    const { blogPosts } = useData();

    return (
        <div className="blog-page">
            <div className="bg-secondary py-16 text-center">
                <h1 className="mb-4">Loud <span className="text-accent">Stories</span></h1>
                <p className="text-gray-400">Behind the scenes, recipes, and musical musings.</p>
            </div>

            <div className="container section">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {blogPosts.map(post => (
                        <Link to={`/blog/${post.id}`} key={post.id} className="bg-secondary rounded-lg overflow-hidden flex flex-col h-full border border-gray-800 hover:border-accent transition-colors duration-300 group">
                            <div className="h-64 overflow-hidden relative">
                                <img
                                    src={post.cover_image}
                                    alt={post.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                            </div>
                            <div className="p-8 flex flex-col flex-1">
                                <div className="text-xs text-accent mb-4 uppercase tracking-widest font-bold">
                                    {post.created_at ? new Date(post.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : ''} &bull; {post.author}
                                </div>
                                <h2 className="text-xl mb-4 font-heading leading-tight group-hover:text-accent transition-colors">{post.title}</h2>
                                <p className="text-gray-400 text-sm mb-6 line-clamp-3 flex-1 leading-relaxed">
                                    {post.excerpt}
                                </p>
                                <span className="text-accent group-hover:text-white transition-colors self-start text-xs uppercase font-bold tracking-widest border-b border-accent pb-1">
                                    Read Article
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Blog;


