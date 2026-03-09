import { connectDB } from "@/lib/db";
import Course from "@/models/Course";
import Link from "next/link";
import { Star, Filter } from "lucide-react";
import Navbar from "@/components/Navbar";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function AllCoursesPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams;
  const filter = category ? { category } : {};

  await connectDB();
  const courses = await Course.find(filter).lean();

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />

      {/* Hero Banner */}
      <section className="bg-gradient-to-br from-[#082F49] to-[#0C4A6E] text-white pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-blue-300 text-sm font-bold uppercase tracking-widest mb-3">
            {category ? "Filtered Results" : "Discover"}
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            {category ? `${category} Courses` : "All Available Courses"}
          </h1>
          <p className="text-blue-200 text-lg">
            Browse our expert-crafted courses and start your learning journey today.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">

        {/* Filter Bar */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <p className="text-slate-500 font-medium">
            Showing <span className="font-bold text-slate-800">{courses.length}</span> course{courses.length !== 1 ? "s" : ""}
            {category ? ` in "${category}"` : ""}
          </p>
          {category && (
            <Link href="/courses">
              <button className="flex items-center gap-2 text-red-500 bg-red-50 px-4 py-2 rounded-full text-sm font-bold hover:bg-red-100 transition-all">
                <Filter size={14} /> Clear Filter
              </button>
            </Link>
          )}
        </div>

        {/* Courses Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.length > 0 ? (
            courses.map((course: any) => (
              <Link key={course._id} href={`/courses/${course.slug}`}>
                <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-2xl hover:shadow-blue-900/10 hover:-translate-y-2 transition-all duration-300 group cursor-pointer h-full flex flex-col">

                  {/* Image */}
                  <div className="h-52 bg-slate-200 relative overflow-hidden">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                    <span className="absolute top-4 left-4 bg-white/95 backdrop-blur-md text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm text-[#082F49]">
                      {course.category}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="font-bold text-xl text-[#082F49] mb-3 group-hover:text-blue-600 line-clamp-2 transition-colors leading-snug">
                      {course.title}
                    </h3>
                    <p className="text-slate-500 text-sm mb-6 line-clamp-2 flex-grow leading-relaxed">
                      {course.desc || course.description}
                    </p>
                    <div className="flex justify-between items-center mt-auto pt-4 border-t border-slate-100">
                      <div className="flex items-center gap-1.5 bg-yellow-50 px-2.5 py-1 rounded-md text-yellow-600 font-bold text-xs">
                        <Star size={13} fill="currentColor" /> 4.8
                      </div>
                      <span className="text-blue-600 text-sm font-bold group-hover:underline underline-offset-4 decoration-2">
                        View Details →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-dashed border-slate-300">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-400">
                <Filter size={28} />
              </div>
              <p className="text-slate-500 text-lg font-medium mb-4">No courses found in this category.</p>
              <Link href="/courses">
                <button className="text-white bg-blue-600 px-6 py-3 rounded-full font-bold hover:bg-blue-700 transition-all">
                  View All Courses
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}