"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Save, ArrowLeft, Loader2, Eye, EyeOff, UploadCloud, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function EditBlogPage() {
    const router = useRouter();
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [published, setPublished] = useState(false);
    
    // Image Upload States
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        title: "",
        author: "",
        category: "",
        coverImage: "",
        excerpt: "",
        content: "",
        tags: "",
    });

    // Load existing blog data
    useEffect(() => {
        const loadBlog = async () => {
            try {
                const res = await fetch("/api/admin/blogs");
                const data = await res.json();
                const blog = data.blogs?.find((b: any) => b._id === id);
                if (blog) {
                    setFormData({
                        title: blog.title || "",
                        author: blog.author || "",
                        category: blog.category || "",
                        coverImage: blog.coverImage || "",
                        excerpt: blog.excerpt || "",
                        content: blog.content || "",
                        tags: Array.isArray(blog.tags) ? blog.tags.join(", ") : "",
                    });
                    setPublished(blog.published || false);
                    if (blog.coverImage) {
                        setPreview(blog.coverImage);
                    }
                }
            } catch {
                console.error("Failed to load blog");
            } finally {
                setFetching(false);
            }
        };
        loadBlog();
    }, [id]);

    const handleChange = (e: any) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const removeImage = () => {
        setImageFile(null);
        setPreview(null);
        // Also remove from formData to indicate it's cleared if the user saves
        setFormData({ ...formData, coverImage: "" });
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = new FormData();
            
            // Explicit check to ensure id is treated as string.
            if (id) {
                const idStr = Array.isArray(id) ? id[0] : id;
                data.append("id", idStr);
            }
            
            data.append("title", formData.title);
            data.append("author", formData.author);
            data.append("category", formData.category);
            data.append("excerpt", formData.excerpt);
            data.append("content", formData.content);
            data.append("tags", formData.tags);
            data.append("coverImage", formData.coverImage); // existing image if any
            data.append("published", String(published));

            if (imageFile) {
                data.append("image", imageFile);
            }

            const res = await fetch("/api/admin/blogs", {
                method: "PUT",
                body: data,
            });
            if (res.ok) {
                alert("Blog Updated! ✅");
                router.push("/admin/blogs");
            } else {
                alert("Update failed.");
            }
        } catch {
            alert("Server error.");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return <div className="p-10 flex items-center gap-2"><Loader2 className="animate-spin" /> Loading Blog...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-10">
            <div className="flex items-center gap-4">
                <Link href="/admin/blogs" className="p-2 bg-white rounded-lg border hover:bg-slate-50">
                    <ArrowLeft size={20} className="text-slate-600" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Edit Blog</h1>
                    <p className="text-slate-500">Update your blog post.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200 space-y-6">

                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Blog Title *</label>
                    <input name="title" value={formData.title} required onChange={handleChange} className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none" />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Author</label>
                        <input name="author" value={formData.author} onChange={handleChange} className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Category *</label>
                        <input name="category" value={formData.category} required onChange={handleChange} className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none" />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Cover Image</label>
                    
                    {!preview ? (
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                            <div className="flex flex-col items-center gap-2 text-slate-400">
                                <UploadCloud size={24} />
                                <span className="text-sm">Upload Image</span>
                            </div>
                            <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                        </label>
                    ) : (
                        <div className="relative w-full h-48 rounded-xl overflow-hidden border border-slate-200 group">
                            <Image src={preview} alt="Preview" fill className="object-cover" />
                            <button type="button" onClick={removeImage} 
                                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-80 hover:opacity-100 transition-opacity">
                                <X size={16} />
                            </button>
                        </div>
                    )}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Short Description (Excerpt) *</label>
                    <textarea name="excerpt" value={formData.excerpt} required onChange={handleChange} rows={2} className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none" />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Main Content *</label>
                    <textarea name="content" value={formData.content} required onChange={handleChange} rows={12} className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none font-mono text-sm" />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Tags (comma separated)</label>
                    <input name="tags" value={formData.tags} onChange={handleChange} className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none" />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div>
                        <p className="font-bold text-slate-700">Publish Status</p>
                        <p className="text-xs text-slate-500">{published ? "Visible to all visitors." : "Draft – only admin can see."}</p>
                    </div>
                    <button
                        type="button"
                        onClick={() => setPublished(!published)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all ${published ? "bg-green-600 text-white" : "bg-slate-200 text-slate-600"}`}
                    >
                        {published ? <><Eye size={16} /> Published</> : <><EyeOff size={16} /> Draft</>}
                    </button>
                </div>

                <button type="submit" disabled={loading} className="w-full bg-[#082F49] text-white py-4 rounded-xl font-bold hover:bg-[#0C4A6E] transition-all flex justify-center items-center gap-2 shadow-lg disabled:opacity-70">
                    {loading ? <Loader2 className="animate-spin" /> : <><Save size={20} /> Update Blog</>}
                </button>
            </form>
        </div>
    );
}
