"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, Calendar, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";

export default function BlogsPage() {
    const [blogs, setBlogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState("All");

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const res = await fetch("/api/blogs");
                const data = await res.json();
                if (data.blogs) setBlogs(data.blogs);
            } catch {
                console.error("Error fetching blogs");
            } finally {
                setLoading(false);
            }
        };
        fetchBlogs();
    }, []);

    const categories = ["All", ...Array.from(new Set(blogs.map((b) => b.category)))];
    const filtered = activeCategory === "All" ? blogs : blogs.filter((b) => b.category === activeCategory);

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            {/* Hero */}
            <section className="bg-gradient-to-br from-[#082F49] to-[#0C4A6E] text-white pt-32 pb-16 px-4">
                <div className="max-w-5xl mx-auto text-center">
                    <p className="text-blue-300 text-sm font-bold uppercase tracking-widest mb-3">Knowledge Hub</p>
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Blogs & Articles</h1>
                    <p className="text-blue-200 text-lg max-w-2xl mx-auto">
                        Explore tips, tutorials, and insights from the VSP team to boost your skills and career.
                    </p>
                </div>
            </section>

            {/* Content */}
            <section className="max-w-6xl mx-auto px-4 py-16">
                {/* Category Filter */}
                {!loading && blogs.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-10">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${activeCategory === cat
                                    ? "bg-[#082F49] text-white shadow-md"
                                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                )}

                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="animate-spin text-blue-600" size={32} />
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-20 text-slate-400">
                        <p className="text-xl font-bold mb-2">No articles yet</p>
                        <p>Check back soon — new content is coming!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filtered.map((blog) => (
                            <Link key={blog._id} href={`/blogs/${blog.slug}`} className="group bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                {/* Cover Image */}
                                <div className="h-48 bg-gradient-to-br from-blue-100 to-slate-200 overflow-hidden">
                                    {blog.coverImage ? (
                                        <img src={blog.coverImage} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold text-lg">
                                            VSP Blog
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="p-5">
                                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                                        <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full text-xs font-bold border border-blue-100">
                                            {blog.category}
                                        </span>
                                        <span className="flex items-center text-xs text-slate-400 gap-1">
                                            <Calendar size={11} />
                                            {new Date(blog.createdAt).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" })}
                                        </span>
                                    </div>

                                    <h2 className="font-extrabold text-slate-800 text-lg mb-2 group-hover:text-blue-700 transition-colors line-clamp-2 leading-tight">{blog.title}</h2>
                                    <p className="text-slate-500 text-sm line-clamp-3 mb-4">{blog.excerpt}</p>

                                    <div className="flex items-center gap-1 text-blue-600 font-bold text-sm">
                                        Read More <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
