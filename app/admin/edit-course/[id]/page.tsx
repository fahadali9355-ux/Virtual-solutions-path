"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Save, Plus, Trash, Loader2, ArrowLeft, UploadCloud, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function EditCoursePage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        category: "",
        price: "",
        duration: "",
        lessons: "",
        desc: "",
        learningPoints: "",
    });

    const [currentImage, setCurrentImage] = useState<string>("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [topic, setTopic] = useState("");
    const [curriculum, setCurriculum] = useState<string[]>([]);

    // Course data fetch karo
    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const res = await fetch(`/api/admin/edit-course/${id}`);
                const data = await res.json();
                if (data.course) {
                    const c = data.course;
                    setFormData({
                        title: c.title || "",
                        slug: c.slug || "",
                        category: c.category || "",
                        price: c.price || "",
                        duration: c.duration || "",
                        lessons: c.lessons || "",
                        desc: c.desc || "",
                        learningPoints: Array.isArray(c.learningPoints) ? c.learningPoints.join(", ") : "",
                    });
                    setCurrentImage(c.image || "");
                    setCurriculum(Array.isArray(c.curriculum) ? c.curriculum : []);
                } else {
                    alert("Course not found!");
                    router.push("/admin/manage-courses");
                }
            } catch (error) {
                alert("Error loading course.");
                router.push("/admin/manage-courses");
            } finally {
                setLoading(false);
            }
        };
        fetchCourse();
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

    const removeNewImage = () => {
        setImageFile(null);
        setPreview(null);
    };

    const addTopic = () => {
        if (topic.trim()) {
            setCurriculum([...curriculum, topic]);
            setTopic("");
        }
    };

    const removeTopic = (index: number) => {
        setCurriculum(curriculum.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setSaving(true);

        try {
            const data = new FormData();
            data.append("title", formData.title);
            data.append("slug", formData.slug);
            data.append("category", formData.category);
            data.append("price", formData.price);
            data.append("duration", formData.duration);
            data.append("lessons", formData.lessons);
            data.append("desc", formData.desc);
            data.append("learningPoints", formData.learningPoints);
            data.append("curriculum", JSON.stringify(curriculum));

            // Sirf tab image append karo agar naya file select kiya ho
            if (imageFile) {
                data.append("image", imageFile);
            }

            const res = await fetch(`/api/admin/edit-course/${id}`, {
                method: "PUT",
                body: data,
            });

            const responseData = await res.json();

            if (res.ok) {
                alert("Course Updated Successfully! ✅");
                router.push("/admin/manage-courses");
            } else {
                alert(responseData.error || "Failed to update course.");
            }
        } catch (error) {
            alert("Error occurred while saving.");
        } finally {
            setSaving(false);
        }
    };

    if (loading)
        return (
            <div className="p-10 flex items-center gap-2">
                <Loader2 className="animate-spin" /> Loading Course...
            </div>
        );

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-10 p-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/manage-courses" className="p-2 bg-white rounded-lg border hover:bg-slate-50">
                    <ArrowLeft size={20} className="text-slate-600" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Edit Course</h1>
                    <p className="text-slate-500">Update course details and thumbnail.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 space-y-6">

                {/* Row 1: Title & Slug */}
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Course Title</label>
                        <input
                            name="title"
                            required
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none"
                            placeholder="e.g. Graphic Design Masterclass"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Slug (URL)</label>
                        <input
                            name="slug"
                            value={formData.slug}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none"
                            placeholder="e.g. graphic-design-masterclass"
                        />
                    </div>
                </div>

                {/* Row 2: Price, Duration, Lessons */}
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Price</label>
                        <input
                            name="price"
                            required
                            value={formData.price}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none"
                            placeholder="Rs. 5,000"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Duration</label>
                        <input
                            name="duration"
                            required
                            value={formData.duration}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none"
                            placeholder="2 Months"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Total Lessons</label>
                        <input
                            name="lessons"
                            required
                            value={formData.lessons}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none"
                            placeholder="24 Lessons"
                        />
                    </div>
                </div>

                {/* Row 3: Category & Image */}
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Category</label>
                        <input
                            name="category"
                            required
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none"
                            placeholder="e.g. Design, Tech"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Course Thumbnail</label>

                        {/* Naya image select kiya hai */}
                        {preview ? (
                            <div className="relative w-full h-32 rounded-xl overflow-hidden border border-slate-200 group">
                                <Image src={preview} alt="New Preview" fill className="object-cover" />
                                <button
                                    type="button"
                                    onClick={removeNewImage}
                                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-80 hover:opacity-100 transition-opacity"
                                >
                                    <X size={16} />
                                </button>
                                <span className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                                    New Image
                                </span>
                            </div>
                        ) : currentImage ? (
                            /* Pehle se saved image dikhayen */
                            <div className="relative w-full h-32 rounded-xl overflow-hidden border border-slate-200 group">
                                <Image src={currentImage} alt="Current" fill className="object-cover" />
                                <label className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                    <div className="text-white text-center">
                                        <UploadCloud size={24} className="mx-auto mb-1" />
                                        <span className="text-xs font-bold">Change Image</span>
                                    </div>
                                    <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                </label>
                            </div>
                        ) : (
                            <label className="flex flex-col items-center justify-center w-full h-14 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                                <div className="flex items-center gap-2 text-slate-400">
                                    <UploadCloud size={20} />
                                    <span className="text-sm">Upload Image</span>
                                </div>
                                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                            </label>
                        )}
                    </div>
                </div>

                {/* Learning Points */}
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">What You Will Learn (Comma Separated)</label>
                    <textarea
                        name="learningPoints"
                        value={formData.learningPoints}
                        onChange={handleChange}
                        rows={2}
                        className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                        placeholder="e.g. React Basics, Frontend Design, Backend API"
                    ></textarea>
                    <p className="text-xs text-slate-500">Separate each point with a comma (,)</p>
                </div>

                {/* Description */}
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Description</label>
                    <textarea
                        name="desc"
                        required
                        value={formData.desc}
                        onChange={handleChange}
                        rows={4}
                        className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                        placeholder="Course details..."
                    ></textarea>
                </div>

                {/* Curriculum Builder */}
                <div className="space-y-2 p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <label className="text-sm font-bold text-slate-700">Curriculum (Topics)</label>
                    <div className="flex gap-2">
                        <input
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTopic())}
                            className="flex-1 p-3 border rounded-xl"
                            placeholder="Add a topic (e.g. Intro to Photoshop)"
                        />
                        <button
                            type="button"
                            onClick={addTopic}
                            className="bg-slate-800 text-white px-4 rounded-xl font-bold hover:bg-slate-900"
                        >
                            <Plus size={20} />
                        </button>
                    </div>
                    <div className="mt-4 space-y-2">
                        {curriculum.map((item, index) => (
                            <div
                                key={index}
                                className="flex justify-between items-center bg-white p-3 rounded-lg border border-slate-200"
                            >
                                <span className="text-sm font-medium">
                                    {index + 1}. {item}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => removeTopic(index)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <Trash size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    disabled={saving}
                    className="w-full bg-[#082F49] text-white py-4 rounded-xl font-bold hover:bg-[#0C4A6E] transition-all flex justify-center items-center gap-2 shadow-lg"
                >
                    {saving ? <Loader2 className="animate-spin" /> : <><Save size={20} /> Update Course</>}
                </button>
            </form>
        </div>
    );
}
