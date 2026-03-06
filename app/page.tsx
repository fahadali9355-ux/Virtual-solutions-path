"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, CheckCircle, ArrowRight, Star, Users, Briefcase, PlayCircle, Facebook, Twitter, Instagram, Linkedin, Mail, MapPin, Phone, LayoutDashboard, Loader2, Menu, X, Calendar, Tag } from 'lucide-react';
import Link from 'next/link';

// --- ANIMATION CONFIG ---
const fadeInUp: any = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const staggerContainer: any = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const floatAnimation: any = {
  animate: {
    y: [0, -20, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const HERO_IMAGE = "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1470&auto=format&fit=crop";

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // 👇 STATES
  const [courses, setCourses] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]); // 👈 New Category State
  const [featuredBlogs, setFeaturedBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Check Auth & Fetch Data
  useEffect(() => {
    // Auth Check
    const userEmail = localStorage.getItem("userEmail");
    const name = localStorage.getItem("userName");

    if (userEmail) {
      setIsLoggedIn(true);
      if (name) setUserName(name);
    }

    const fetchData = async () => {
      try {
        // 1. Fetch Courses
        const coursesRes = await fetch("/api/courses");
        const coursesData = await coursesRes.json();
        if (coursesData.courses) {
          setCourses(coursesData.courses);
        }

        // 2. Fetch Categories (Dynamic Footer)
        const catRes = await fetch("/api/categories");
        const catData = await catRes.json();
        if (catData.categories) {
          setCategories(catData.categories);
        }

        // 3. Fetch Featured Blogs for Landing Page
        const blogsRes = await fetch("/api/blogs?featured=true");
        const blogsData = await blogsRes.json();
        if (blogsData.blogs) {
          setFeaturedBlogs(blogsData.blogs);
        }

      } catch (error) {
        console.error("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Smooth Scroll Function
  const scrollToCourses = () => {
    const element = document.getElementById('courses-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans overflow-x-hidden selection:bg-blue-100">

      {/* --- NAVBAR --- */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
        className="fixed w-full z-50 bg-white/90 border-b border-slate-100 backdrop-blur-xl"
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-[#082F49]">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg"><img src="/images/img1.png" alt="Course Image" className="w-full h-auto rounded-lg" /></div>
            <span>Virtual Solution Path</span>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex gap-8 text-sm font-semibold text-slate-600">
            <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <button onClick={scrollToCourses} className="hover:text-blue-600 transition-colors">Courses</button>
            <a href="/about" className="hover:text-blue-600 transition-colors">About</a>
            <a href="/blogs" className="hover:text-blue-600 transition-colors">Blog</a>
            <a href="/contact" className="hover:text-blue-600 transition-colors">Contact</a>
          </div>

          {/* Auth Buttons (Dynamic Logic) */}
          <div className="flex gap-3">
            {isLoggedIn ? (
              <Link href="/dashboard/courses" className="hidden md:block">
                <button className="bg-[#082F49] text-white px-6 py-2.5 rounded-full font-bold shadow-lg hover:bg-[#0C4A6E] transition-all text-sm flex items-center gap-2">
                  <LayoutDashboard size={18} />
                  Dashboard
                </button>
              </Link>
            ) : (
              <>
                <Link href="/login" className="hidden md:flex px-6 py-2.5 text-[#082F49] font-bold hover:bg-slate-50 rounded-full transition-all text-sm items-center">
                  Log In
                </Link>
                <Link href="/signup" className="hidden md:block">
                  <button className="bg-[#0284C7] text-white px-6 py-2.5 rounded-full font-bold shadow-lg shadow-blue-500/30 hover:bg-[#0369A1] hover:-translate-y-0.5 transition-all text-sm">
                    Sign up
                  </button>
                </Link>
              </>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              className="md:hidden p-2 text-slate-600 hover:text-blue-600 focus:outline-none"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-20 z-40 bg-white/95 backdrop-blur-3xl shadow-2xl border-b border-slate-100 md:hidden"
          >
            <div className="flex flex-col space-y-6 px-6 py-8 text-center text-lg font-bold text-slate-700">
              <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-blue-600 transition-colors">Home</Link>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  scrollToCourses();
                }}
                className="hover:text-blue-600 transition-colors font-bold text-lg"
              >
                Courses
              </button>
              <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-blue-600 transition-colors">About</Link>
              <Link href="/blogs" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-blue-600 transition-colors">Blog</Link>
              <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-blue-600 transition-colors">Contact</Link>

              <div className="pt-6 border-t border-slate-100 flex flex-col gap-4">
                {isLoggedIn ? (
                  <Link href="/dashboard/courses" onClick={() => setIsMobileMenuOpen(false)} className="w-full bg-[#082F49] text-white py-4 rounded-xl shadow-lg hover:bg-[#0C4A6E] transition-all flex items-center justify-center gap-2">
                    <LayoutDashboard size={18} /> Dashboard
                  </Link>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-[#082F49] py-3 hover:bg-slate-50 rounded-xl transition-all">
                      Log In
                    </Link>
                    <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)} className="w-full bg-[#0284C7] text-white py-4 rounded-xl shadow-lg shadow-blue-500/30 hover:bg-[#0369A1] transition-all flex items-center justify-center">
                      Sign up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- HERO SECTION --- */}
      <section className="pt-32 pb-24 px-6 bg-gradient-to-br from-[#F0F9FF] via-white to-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="z-10"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-blue-100 text-blue-700 rounded-full text-xs font-bold tracking-wide mb-8 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
              FUTURE READY SKILLS
            </motion.div>

            <motion.h1 variants={fadeInUp} className="text-5xl lg:text-7xl font-extrabold mb-6 leading-[1.1] text-[#082F49] tracking-tight">
              {isLoggedIn ? `Welcome Back, ${userName.split(' ')[0]}!` : "Learn In-Demand"} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Digital Skills</span>
            </motion.h1>

            <motion.p variants={fadeInUp} className="text-lg text-slate-600 mb-10 max-w-lg leading-relaxed font-medium">
              Build real-world skills through practical, career-focused online courses. Master Digital Marketing, n8n, Web Dev, and more.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4">

              <Link href={isLoggedIn ? "/dashboard/courses" : "/signup"}>
                <button className="bg-[#0C4A6E] text-white px-8 py-4 rounded-full font-bold text-lg shadow-xl shadow-blue-900/20 hover:bg-[#082F49] hover:-translate-y-1 transition-all flex items-center justify-center gap-2 w-full sm:w-auto">
                  {isLoggedIn ? "Go to Dashboard" : "Enroll Now"} <ArrowRight size={18} />
                </button>
              </Link>

              <button onClick={scrollToCourses} className="bg-white text-[#0C4A6E] border border-slate-200 px-8 py-4 rounded-full font-bold text-lg hover:bg-slate-50 transition-all flex items-center justify-center gap-2 w-full sm:w-auto">
                <PlayCircle size={18} /> View Courses
              </button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <motion.div
              variants={floatAnimation}
              animate="animate"
              className="relative rounded-[2.5rem] h-[550px] border-4 border-white/30 shadow-2xl overflow-hidden group"
            >
              <img src={HERO_IMAGE} alt="Student Learning" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0C4A6E]/40 to-transparent"></div>
            </motion.div>
            <div className="absolute top-10 right-10 w-72 h-72 bg-cyan-400/20 rounded-full blur-[80px] -z-10 mix-blend-multiply"></div>
            <div className="absolute bottom-10 left-10 w-72 h-72 bg-blue-600/20 rounded-full blur-[80px] -z-10 mix-blend-multiply"></div>
          </motion.div>
        </div>
      </section>

      {/* --- FEATURES STRIP --- */}
      <section className="py-20 bg-white">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-6"
        >
          {[
            { icon: BookOpen, title: "Industry Curriculum", text: "Updated for 2026 market needs." },
            { icon: Briefcase, title: "Career Focused", text: "Skills that actually get you hired." },
            { icon: Users, title: "100% Online", text: "Learn at your own pace, anywhere." },
            { icon: CheckCircle, title: "Practical Learning", text: "Hands-on projects, no fluff." }
          ].map((f, i) => (
            <motion.div variants={fadeInUp} key={i} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:shadow-lg hover:border-blue-200 transition-all duration-300 group">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm mb-4 group-hover:scale-110 transition-transform">
                <f.icon size={24} />
              </div>
              <h3 className="font-bold text-[#082F49] text-lg mb-2">{f.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{f.text}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* --- POPULAR COURSES (LINKED WITH DETAIL PAGES) --- */}
      <section id="courses-section" className="py-24 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6"
          >
            <div>
              <h2 className="text-3xl font-bold text-[#082F49]">Explore Popular Courses</h2>
              <p className="text-slate-500 mt-3 text-lg">Choose from our most enrolled programs.</p>
            </div>
            <button onClick={scrollToCourses} className="hidden md:flex items-center gap-2 text-blue-600 font-bold hover:text-blue-700 transition-colors">
              View All Courses <ArrowRight size={18} />
            </button>
          </motion.div>

          {/* 👇 LOADING CHECK */}
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-blue-600" size={40} />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.length > 0 ? (
                courses.map((course, idx) => (
                  <Link key={course._id || idx} href={`/courses/${course.slug}`}>
                    <motion.div
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1, duration: 0.5 }}
                      className="bg-white rounded-2xl overflow-hidden border border-slate-100/80 shadow-sm hover:shadow-2xl hover:shadow-blue-900/5 hover:-translate-y-2 transition-all duration-300 group cursor-pointer flex flex-col h-full"
                    >
                      <div className="h-52 bg-slate-200 relative overflow-hidden">
                        <img src={course.image} alt={course.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        <span className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm text-xs font-bold px-3 py-1.5 rounded-lg text-[#082F49] shadow-sm">{course.category}</span>
                      </div>
                      <div className="p-6 flex flex-col flex-grow">
                        <h3 className="text-xl font-bold text-[#082F49] mb-3 group-hover:text-blue-600 transition-colors line-clamp-1">{course.title}</h3>
                        <p className="text-slate-500 text-sm mb-6 leading-relaxed flex-grow line-clamp-2">{course.desc}</p>
                        <div className="pt-5 border-t border-slate-50 flex justify-between items-center mt-auto">
                          <div className="flex items-center gap-1.5 bg-yellow-50 px-2 py-1 rounded-md text-yellow-600 font-bold text-xs"><Star size={14} fill="currentColor" /> 4.8</div>

                          <span className="text-blue-600 font-bold text-sm group-hover:underline decoration-2 underline-offset-4">
                            View Details
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                ))
              ) : (
                <div className="col-span-full text-center py-10 text-slate-500">No courses available.</div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* --- FEATURED BLOGS SECTION --- */}
      {featuredBlogs.length > 0 && (
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6"
            >
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-100 text-blue-700 rounded-full text-xs font-bold tracking-wide mb-4">
                  <BookOpen size={12} /> FROM OUR BLOG
                </div>
                <h2 className="text-3xl font-bold text-[#082F49]">Latest Articles & Insights</h2>
                <p className="text-slate-500 mt-3 text-lg">Stay updated with our latest tips and guides.</p>
              </div>
              <Link href="/blogs" className="hidden md:flex items-center gap-2 text-blue-600 font-bold hover:text-blue-700 transition-colors shrink-0">
                View All Articles <ArrowRight size={18} />
              </Link>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredBlogs.map((blog, idx) => (
                <Link key={blog._id} href={`/blogs/${blog.slug}`}>
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1, duration: 0.5 }}
                    className="bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group cursor-pointer flex flex-col h-full"
                  >
                    {/* Cover Image */}
                    {blog.coverImage ? (
                      <div className="h-48 overflow-hidden relative">
                        <img
                          src={blog.coverImage}
                          alt={blog.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                      </div>
                    ) : (
                      <div className="h-48 bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
                        <BookOpen size={48} className="text-blue-300" />
                      </div>
                    )}

                    {/* Content */}
                    <div className="p-6 flex flex-col flex-grow">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="flex items-center gap-1 bg-blue-50 text-blue-700 text-xs font-bold px-2 py-1 rounded-lg border border-blue-100">
                          <Tag size={10} /> {blog.category}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-[#082F49] mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {blog.title}
                      </h3>
                      <p className="text-slate-500 text-sm leading-relaxed flex-grow line-clamp-2 mb-4">
                        {blog.excerpt}
                      </p>
                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                        <span className="flex items-center gap-1.5 text-xs text-slate-400">
                          <Calendar size={12} />
                          {new Date(blog.createdAt).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                        <span className="text-blue-600 font-bold text-xs group-hover:underline decoration-2 underline-offset-4">
                          Read More →
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>

            {/* Mobile View All link */}
            <div className="mt-8 flex justify-center md:hidden">
              <Link href="/blogs" className="flex items-center gap-2 text-blue-600 font-bold hover:text-blue-700 transition-colors">
                View All Articles <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* --- CTA SECTION --- */}
      <section className="py-24 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto bg-[#0C4A6E] rounded-[3rem] p-12 md:p-24 text-center text-white relative overflow-hidden shadow-2xl shadow-blue-900/30"
        >
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-8 tracking-tight">Start Your Learning Journey Today</h2>
            <p className="text-blue-100 text-lg md:text-xl mb-10 leading-relaxed font-light">
              Upgrade your skills, boost your income, and shape your future with Virtual Solution Path.
            </p>

            <Link href={isLoggedIn ? "/dashboard/courses" : "/signup"}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-[#0C4A6E] px-10 py-4 rounded-full font-bold text-lg shadow-xl"
              >
                {isLoggedIn ? "Go to Dashboard" : "Get Started Now"}
              </motion.button>
            </Link>

          </div>
          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-600/30 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2"></div>
        </motion.div>
      </section>

      {/* --- FOOTER --- */}
      <motion.footer
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
        className="bg-[#082F49] text-white pt-20 pb-10 border-t border-white/10 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">

          <div className="grid md:grid-cols-4 gap-12">
            <motion.div variants={fadeInUp} className="col-span-1 md:col-span-1 space-y-6">
              <div className="flex items-center gap-2 font-bold text-2xl">
                <span className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-sm"><img src="/images/img1.png" alt="Course Image" className="w-full h-auto rounded-lg" /></span>
                <span>VSP.</span>
              </div>
              <p className="text-slate-400 leading-relaxed text-sm">
                Virtual Solution Path is a leading EdTech platform dedicated to empowering students with future-ready digital skills.
              </p>
              <div className="flex gap-4">
                {[Facebook].map((Icon, i) => (
                  <a key={i} href="https://www.facebook.com/profile.php?id=61578931048075&rdid=b6Qzyk1wOCXcPxgM&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1Ax7ehFaZg%2F#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#0284C7] hover:text-white transition-all text-slate-400">
                    <Icon size={18} />
                  </a>
                ))}
                {[Instagram].map((Icon, i) => (
                  <a key={i} href="https://www.instagram.com/virtualsolutionspath/" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#0284C7] hover:text-white transition-all text-slate-400">
                    <Icon size={18} />
                  </a>
                ))}
                {[Linkedin].map((Icon, i) => (
                  <a key={i} href="https://www.linkedin.com/company/virtual-solutions-path/" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#0284C7] hover:text-white transition-all text-slate-400">
                    <Icon size={18} />
                  </a>
                ))}
              </div>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <h4 className="font-bold text-lg mb-6">Quick Links</h4>
              <ul className="space-y-4 text-sm text-slate-400">
                <li><Link href="/" className="hover:text-cyan-400 transition-colors flex items-center gap-2">Home</Link></li>
                <li><button onClick={scrollToCourses} className="hover:text-cyan-400 transition-colors flex items-center gap-2 text-left"> Courses </button></li>
                <li><Link href="/login" className="hover:text-cyan-400 transition-colors flex items-center gap-2">Login</Link></li>
                <li><Link href="/signup" className="hover:text-cyan-400 transition-colors flex items-center gap-2">Sign Up</Link></li>
              </ul>
            </motion.div>

            {/* 👇 DYNAMIC CATEGORIES IN FOOTER */}
            <motion.div variants={fadeInUp}>
              <h4 className="font-bold text-lg mb-6">Categories</h4>
              <ul className="space-y-4 text-sm text-slate-400">
                {categories.length === 0 ? (
                  <>
                    {/* Loading State or Fallback */}
                    <li>Loading...</li>
                  </>
                ) : (
                  categories.map((item, index) => (
                    <li key={index}>
                      <Link href={`/courses?category=${item}`} className="hover:text-cyan-400 transition-colors capitalize">
                        {item}
                      </Link>
                    </li>
                  ))
                )}
              </ul>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <h4 className="font-bold text-lg mb-6">Contact Us</h4>
              <ul className="space-y-4 text-sm text-slate-400">
                <li className="flex items-start gap-3">
                  <MapPin className="text-[#0284C7] shrink-0" size={20} />
                  <span>Admission Office, Bank Lane near State bank, Faisalabad</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="text-[#0284C7] shrink-0" size={20} />
                  <span>+92 321 0030888</span>
                  <span>+92 318 2009250</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="text-[#0284C7] shrink-0" size={20} />
                  <span>virtualsolutions.path@gmail.com</span>
                </li>
              </ul>
            </motion.div>
          </div>

          <motion.div variants={fadeInUp} className="border-t border-white/10 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
            <p>© 2026 Virtual Solution Path. All rights reserved.</p>

            {/* 👇 UPDATED LEGAL LINKS */}
            <div className="flex gap-6 mt-4 md:mt-0">
              <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
              <Link href="/cookie-policy" className="hover:text-white transition-colors">Cookie Policy</Link>
            </div>
          </motion.div>

        </div>
      </motion.footer>

    </div>
  );
}