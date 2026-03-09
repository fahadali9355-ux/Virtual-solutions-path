import { connectDB } from "@/lib/db";
import Course from "@/models/Course";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, PlayCircle, Star, CheckCircle } from "lucide-react";
import CourseEnrollment from "@/components/CourseEnrollment";
import Navbar from "@/components/Navbar";

export default async function CourseDetail({ params }: { params: Promise<{ slug: string }> }) {

  const { slug } = await params;

  await connectDB();

  const courseRaw = await Course.findOne({ slug }).lean();

  if (!courseRaw) return notFound();

  // MongoDB object ko simple JSON main convert kar rahe hain
  const course = JSON.parse(JSON.stringify(courseRaw));

  // 👇 SUPER FIX 1: Learning Points ko hamesha Array banayen
  let finalLearningPoints = [];
  if (course.learningPoints) {
    if (Array.isArray(course.learningPoints)) {
      finalLearningPoints = course.learningPoints;
    } else if (typeof course.learningPoints === "string") {
      try { finalLearningPoints = JSON.parse(course.learningPoints); } catch (e) { }
    }
  }

  // 👇 SUPER FIX 2: Curriculum ko hamesha Array banayen (Ye error khatam karega)
  let finalCurriculum = [];
  if (course.curriculum) {
    if (Array.isArray(course.curriculum)) {
      finalCurriculum = course.curriculum;
    } else if (typeof course.curriculum === "string") {
      try { finalCurriculum = JSON.parse(course.curriculum); } catch (e) { }
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      <Navbar />

      {/* HERO SECTION */}
      <div className="relative h-[540px] w-full bg-[#082F49]">
        <img src={course.image} alt={course.title} className="w-full h-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#082F49] via-[#082F49]/60 to-transparent"></div>

        <div className="absolute bottom-0 left-0 w-full p-6 md:p-14 text-white max-w-7xl mx-auto flex flex-col items-start">
          <Link href="/" className="inline-flex items-center text-blue-200 hover:text-white mb-4 transition-colors font-medium text-sm">
            <ArrowLeft size={18} className="mr-2" /> Back to Home
          </Link>
          <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide mb-3">
            {course.category}
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4 leading-tight">
            {course.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-blue-100">
            <span className="flex items-center gap-1.5"><Clock size={16} /> {course.duration}</span>
            <span className="flex items-center gap-1.5"><PlayCircle size={16} /> {course.lessons || "Multiple"} Lessons</span>
            <span className="flex items-center gap-1.5 text-yellow-400"><Star size={16} fill="currentColor" /> 4.9 Rating</span>
          </div>
        </div>
      </div>

      {/* CONTENT SECTION */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* Details (Left Side) */}
        <div className="md:col-span-2 space-y-8">

          {/* 1. About This Course */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
            <h2 className="text-2xl font-bold text-[#082F49] mb-4">About This Course</h2>
            <p className="text-slate-600 leading-relaxed text-lg whitespace-pre-line">
              {course.description || course.desc}
            </p>
          </div>

          {/* 2. What You Will Learn */}
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-slate-100">
            <h2 className="text-xl md:text-2xl font-bold text-[#082F49] mb-6">What You Will Learn</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {finalLearningPoints.length > 0 ? (
                finalLearningPoints.map((item: string, index: number) => (
                  <div key={index} className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-green-200 hover:bg-green-50 transition-colors">
                    <CheckCircle className="text-green-500 shrink-0 mt-0.5" size={20} />
                    <span className="text-slate-700 font-medium text-sm">{item}</span>
                  </div>
                ))
              ) : (
                <p className="text-slate-500 italic col-span-2">Learning points will be updated soon.</p>
              )}
            </div>
          </div>

          {/* 3. Course Curriculum (Topics) */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
            <h2 className="text-2xl font-bold text-[#082F49] mb-6">Course Curriculum</h2>
            <div className="space-y-3">
              {finalCurriculum.length > 0 ? (
                finalCurriculum.map((item: string, index: number) => (
                  <div key={index} className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-blue-200 hover:bg-blue-50 transition-colors">
                    <div className="bg-blue-100 p-2 rounded-full text-blue-600 shrink-0">
                      <PlayCircle size={20} />
                    </div>
                    <span className="text-slate-700 font-medium">Lesson {index + 1}: {item}</span>
                  </div>
                ))
              ) : (
                <p className="text-slate-500 italic">Curriculum details updated soon.</p>
              )}
            </div>
          </div>

        </div>

        {/* ENROLL CARD (Right Side) */}
        <div className="md:col-span-1 order-first md:order-last">
          <CourseEnrollment course={course} slug={slug} />
        </div>

      </div>
    </div>
  );
}