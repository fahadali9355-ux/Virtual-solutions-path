"use client";

import { useEffect, useState } from "react";
import { Trash, Edit, Plus, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ManageCoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  // 1. Fetch Courses
  const fetchCourses = async () => {
    try {
      const res = await fetch("/api/courses");
      const data = await res.json();
      if (data.courses) setCourses(data.courses);
    } catch (error) {
      console.error("Error fetching courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // 2. DELETE FUNCTION
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this course? This action cannot be undone.")) return;

    setDeleting(id);
    try {
      const res = await fetch("/api/courses", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        // List se bhi hatao taake refresh na karna pare
        setCourses(courses.filter((course) => course._id !== id));
        alert("Course Deleted!");
      } else {
        alert("Failed to delete");
      }
    } catch (error) {
      alert("Error deleting course");
    } finally {
      setDeleting(null);
    }
  };

  if (loading) return <div className="p-10 flex items-center gap-2"><Loader2 className="animate-spin" /> Loading Courses...</div>;

  return (
    <div className="space-y-6">

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Manage Courses</h1>
          <p className="text-slate-500">Edit or Delete existing courses.</p>
        </div>
        <Link href="/admin/add-course" className="bg-[#082F49] text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-[#0C4A6E] w-full md:w-auto justify-center">
          <Plus size={18} /> Add New
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full min-w-[700px] text-left border-collapse">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold border-b border-slate-200">
              <tr>
                <th className="p-4">Course Title</th>
                <th className="p-4">Price</th>
                <th className="p-4">Category</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {courses.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-400">No courses found.</td>
                </tr>
              ) : (
                courses.map((course) => (
                  <tr key={course._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img src={course.image} alt="" className="w-10 h-10 rounded-lg object-cover bg-slate-100" />
                        <span className="font-bold text-slate-800">{course.title}</span>
                      </div>
                    </td>
                    <td className="p-4 font-medium text-slate-600">{course.price}</td>
                    <td className="p-4 text-sm text-slate-500">
                      <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded text-xs font-bold">{course.category}</span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/edit-course/${course._id}`}
                          className="text-blue-500 hover:bg-blue-50 p-2 rounded-lg transition-colors"
                          title="Edit Course"
                        >
                          <Edit size={18} />
                        </Link>
                        <button
                          onClick={() => handleDelete(course._id)}
                          disabled={deleting === course._id}
                          className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors disabled:opacity-50"
                          title="Delete Course"
                        >
                          {deleting === course._id ? <Loader2 size={18} className="animate-spin" /> : <Trash size={18} />}
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