"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, Plus, Edit, Trash2, Eye, EyeOff, Star } from "lucide-react";

export default function AdminBlogsPage() {
    const [blogs, setBlogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState<string | null>(null);
    const [featuring, setFeaturing] = useState<string | null>(null);

    const fetchBlogs = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/blogs");
            const data = await res.json();
            if (data.blogs) setBlogs(data.blogs);
        } catch {
            console.error("Error fetching blogs");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchBlogs(); }, []);

    const handleDelete = async (id: string, title: string) => {
        if (!confirm(`"${title}" ko delete karna chahte hain? Yeh undo nahi ho sakta.`)) return;
        setDeleting(id);
        try {
            const res = await fetch("/api/admin/blogs", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });
            if (res.ok) setBlogs(blogs.filter((b) => b._id !== id));
            else alert("Delete failed.");
        } catch {
            alert("Server error.");
        } finally {
            setDeleting(null);
        }
    };

    const handleFeatureToggle = async (id: string, currentFeatured: boolean) => {
        // If trying to feature and already 3 featured, block it
        if (!currentFeatured) {
            const featuredCount = blogs.filter((b) => b.featuredOnHome).length;
            if (featuredCount >= 3) {
                alert("Maximum 3 featured blogs allowed!\n\nPehle kisi aur blog ko un-feature karo, phir naya feature karo.");
                return;
            }
        }
        setFeaturing(id);
        try {
            const res = await fetch("/api/admin/blogs/feature", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, featuredOnHome: !currentFeatured }),
            });
            const data = await res.json();
            if (res.ok) {
                setBlogs(blogs.map((b) =>
                    b._id === id ? { ...b, featuredOnHome: !currentFeatured } : b
                ));
            } else {
                alert(data.error || "Feature toggle failed.");
            }
        } catch {
            alert("Server error.");
        } finally {
            setFeaturing(null);
        }
    };

    if (loading) return <div className="p-10 flex items-center gap-2"><Loader2 className="animate-spin text-blue-600" /> Loading Blogs...</div>;

    const featuredCount = blogs.filter((b) => b.featuredOnHome).length;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Blogs & Articles</h1>
                    <p className="text-slate-500">Manage your blog posts and articles.</p>
                </div>
                <Link href="/admin/add-blog" className="bg-[#082F49] text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-[#0C4A6E] w-full md:w-auto justify-center">
                    <Plus size={18} /> Write New Blog
                </Link>
            </div>

            {/* Featured Info Banner */}
            <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-xl text-sm font-medium">
                <Star size={16} className="fill-amber-400 text-amber-400 shrink-0" />
                <span>
                    <strong>{featuredCount}/3</strong> blogs featured on landing page.
                    {featuredCount === 3 && <span className="text-amber-700 ml-1">— Kisi ko un-feature karo naya add karne ke liye.</span>}
                </span>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto w-full">
                    <table className="w-full min-w-[750px] text-left border-collapse text-sm">
                        <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold border-b border-slate-200">
                            <tr>
                                <th className="p-4">Title</th>
                                <th className="p-4">Category</th>
                                <th className="p-4">Author</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Featured</th>
                                <th className="p-4">Date</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {blogs.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="p-10 text-center text-slate-400">
                                        No blogs yet. Click "Write New Blog" to get started!
                                    </td>
                                </tr>
                            ) : (
                                blogs.map((blog) => (
                                    <tr key={blog._id} className="hover:bg-slate-50/60 transition-colors">
                                        <td className="p-4 font-bold text-slate-800 max-w-[220px]">
                                            <span className="line-clamp-2">{blog.title}</span>
                                        </td>
                                        <td className="p-4">
                                            <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-bold border border-blue-100">
                                                {blog.category}
                                            </span>
                                        </td>
                                        <td className="p-4 text-slate-600">{blog.author}</td>
                                        <td className="p-4">
                                            {blog.published ? (
                                                <span className="flex items-center gap-1 text-green-600 font-bold text-xs bg-green-50 px-2 py-1 rounded-full w-fit">
                                                    <Eye size={12} /> Published
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1 text-slate-500 font-bold text-xs bg-slate-100 px-2 py-1 rounded-full w-fit">
                                                    <EyeOff size={12} /> Draft
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            <button
                                                onClick={() => handleFeatureToggle(blog._id, blog.featuredOnHome)}
                                                disabled={featuring === blog._id}
                                                title={blog.featuredOnHome ? "Landing page se hatao" : "Landing page par dikhaao"}
                                                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all disabled:opacity-50 ${blog.featuredOnHome
                                                        ? "bg-amber-50 text-amber-600 border border-amber-200 hover:bg-amber-100"
                                                        : "bg-slate-50 text-slate-400 border border-slate-200 hover:bg-slate-100 hover:text-amber-500"
                                                    }`}
                                            >
                                                {featuring === blog._id ? (
                                                    <Loader2 size={14} className="animate-spin" />
                                                ) : (
                                                    <Star
                                                        size={14}
                                                        className={blog.featuredOnHome ? "fill-amber-400 text-amber-400" : ""}
                                                    />
                                                )}
                                                {blog.featuredOnHome ? "Featured" : "Feature"}
                                            </button>
                                        </td>
                                        <td className="p-4 text-xs text-slate-400">
                                            {new Date(blog.createdAt).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" })}
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link href={`/admin/edit-blog/${blog._id}`} className="flex items-center gap-1 text-blue-600 border border-blue-200 px-3 py-1.5 rounded hover:bg-blue-50 text-xs font-bold transition-colors">
                                                    <Edit size={14} /> Edit
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(blog._id, blog.title)}
                                                    disabled={deleting === blog._id}
                                                    className="text-red-500 bg-red-50 p-1.5 rounded hover:bg-red-100 transition-colors disabled:opacity-50"
                                                >
                                                    {deleting === blog._id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
