"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, Globe, Users, Award, Rocket } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

// Animation Variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const stagger = {
  visible: { transition: { staggerChildren: 0.2 } }
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-200">
      <Navbar />

      {/* --- HERO SECTION --- */}
      <section className="relative pt-40 pb-20 px-6 overflow-hidden bg-[#082F49] text-white">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2"></div>

        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeIn}>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
              We Are Shaping the <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">Future of Education.</span>
            </h1>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Virtual Solution Path isn&apos;t just a platform; it&apos;s a movement. We are bridging the gap between academic learning and industry demands.
            </p>
          </motion.div>
        </div>
      </section>

      {/* --- STATS STRIP --- */}
      <div className="max-w-6xl mx-auto px-6 -mt-10 relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
        >
          {[
            { icon: Users, label: "Students", val: "5,000+" },
            { icon: Award, label: "Certified", val: "3,200+" },
            { icon: Globe, label: "Countries", val: "12+" },
            { icon: Rocket, label: "Courses", val: "50+" },
          ].map((stat, idx) => (
            <div key={idx} className="space-y-2">
              <stat.icon className="mx-auto text-blue-600 mb-2" size={28} />
              <h3 className="text-3xl font-bold text-slate-900">{stat.val}</h3>
              <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* --- MISSION & VISION --- */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.h2 variants={fadeIn} className="text-blue-600 font-bold tracking-wide uppercase text-sm mb-2">Our Mission</motion.h2>
            <motion.h3 variants={fadeIn} className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Democratizing Tech Skills for Everyone</motion.h3>
            <motion.div variants={fadeIn} className="space-y-6 text-slate-600 text-lg leading-relaxed">
              <p>
                The world is changing fast. Traditional education often struggles to keep up with the pace of technology. That&apos;s where <strong>VSP</strong> comes in.
              </p>
              <p>
                We provide high-quality, hands-on courses in Web Development, Digital Marketing, and Freelancing that are designed to make you job-ready from day one. No fluff, just skills.
              </p>
            </motion.div>

            <motion.div variants={fadeIn} className="mt-8 grid grid-cols-2 gap-4">
              {["Expert Mentors", "Lifetime Access", "Practical Projects", "24/7 Support"].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-slate-700 font-medium">
                  <CheckCircle size={20} className="text-green-500" /> {item}
                </div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute inset-0 bg-blue-600 rounded-3xl rotate-3 opacity-10"></div>
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1471&auto=format&fit=crop"
              alt="Team working"
              className="rounded-3xl shadow-2xl relative z-10 w-full"
            />
          </motion.div>
        </div>
      </section>

      {/* --- CTA --- */}
      <section className="py-20 bg-slate-900 text-white text-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to start your journey?</h2>
          <p className="text-slate-400 mb-8 text-lg">Join thousands of students who are already learning with VSP.</p>
          <Link href="/courses">
            <button className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-lg hover:shadow-blue-500/30">
              Explore Our Courses
            </button>
          </Link>
        </motion.div>
      </section>

    </div>
  );
}