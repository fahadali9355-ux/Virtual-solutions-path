"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import {
  Users,
  Briefcase,
  ShieldCheck,
  ClipboardCheck,
  MapPin,
  Clock,
  ExternalLink,
  Mail,
  Phone,
  Award,
  Linkedin,
  ArrowRight,
  Star,
  CheckCircle2,
  Building2,
  GraduationCap,
  TrendingUp,
  Search,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface AlumniMember {
  _id: string;
  name: string;
  email: string;
  phone: string;
  certificationTitle: string;
  graduationYear: number;
  profileImage: string;
  linkedIn: string;
  bio: string;
}

interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  description: string;
  requirements: string[];
  applyLink: string;
  postedAt: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const AVATAR_COLORS = [
  "from-blue-600 to-indigo-700",
  "from-teal-500 to-cyan-600",
  "from-violet-600 to-purple-700",
  "from-rose-500 to-pink-600",
  "from-amber-500 to-orange-600",
  "from-emerald-500 to-green-600",
];

function avatarColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + hash * 31;
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function CareerHubPage() {
  const [alumni, setAlumni] = useState<AlumniMember[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [alumniSearch, setAlumniSearch] = useState("");
  const [loadingAlumni, setLoadingAlumni] = useState(true);
  const [loadingJobs, setLoadingJobs] = useState(true);

  useEffect(() => {
    fetch("/api/alumni")
      .then((r) => r.json())
      .then((d) => setAlumni(d.alumni || []))
      .finally(() => setLoadingAlumni(false));

    fetch("/api/jobs")
      .then((r) => r.json())
      .then((d) => setJobs(d.jobs || []))
      .finally(() => setLoadingJobs(false));
  }, []);

  const filteredAlumni = alumni.filter(
    (a) =>
      a.name.toLowerCase().includes(alumniSearch.toLowerCase()) ||
      a.certificationTitle.toLowerCase().includes(alumniSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-24 overflow-hidden bg-gradient-to-br from-[#082F49] via-[#0C4A6E] to-[#0369A1]">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-sky-400/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-600/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 backdrop-blur-sm text-sky-200 text-sm font-semibold px-4 py-2 rounded-full mb-6">
            <TrendingUp size={14} /> VSP Career Hub & Alumni Network
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight mb-6">
            Your Career Starts
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-cyan-300">
              Right Here.
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-sky-100 leading-relaxed mb-10">
            VSP bridges the gap between skilled graduates and industry-leading
            companies. Explore our alumni network, discover open opportunities,
            and learn how VSP backs every student it places.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#alumni"
              className="bg-white text-[#082F49] px-7 py-3.5 rounded-full font-bold text-sm shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
            >
              <GraduationCap size={18} /> Meet Our Alumni
            </a>
            <a
              href="#opportunities"
              className="bg-transparent border-2 border-white/40 text-white px-7 py-3.5 rounded-full font-bold text-sm hover:bg-white/10 transition-all flex items-center justify-center gap-2"
            >
              <Briefcase size={18} /> View Open Roles
            </a>
          </div>

          {/* Stats row */}
          <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {[
              { label: "Certified Alumni", value: "500+", icon: GraduationCap },
              { label: "Partner Companies", value: "40+", icon: Building2 },
              { label: "Placement Rate", value: "85%", icon: TrendingUp },
              { label: "Active Opportunities", value: "20+", icon: Briefcase },
            ].map((s) => (
              <div
                key={s.label}
                className="bg-white/10 border border-white/20 backdrop-blur-sm rounded-2xl p-4 text-center"
              >
                <s.icon className="mx-auto mb-2 text-sky-300" size={22} />
                <p className="text-2xl font-extrabold text-white">{s.value}</p>
                <p className="text-xs text-sky-200 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ALUMNI DIRECTORY ──────────────────────────────────────────────── */}
      <section id="alumni" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Section header */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
            <div>
              <span className="inline-block text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full mb-3">
                Certified Graduates
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#082F49]">
                Our Alumni Directory
              </h2>
              <p className="text-slate-500 mt-2 max-w-lg">
                Every name here represents a VSP-certified professional, ready
                to add real value to your team.
              </p>
            </div>
            {/* Search */}
            <div className="relative w-full md:w-72">
              <Search
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Search by name or certification…"
                value={alumniSearch}
                onChange={(e) => setAlumniSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              />
            </div>
          </div>

          {loadingAlumni ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-6 animate-pulse border border-slate-100"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-full bg-slate-200" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-slate-200 rounded w-3/4" />
                      <div className="h-3 bg-slate-100 rounded w-1/2" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-slate-100 rounded" />
                    <div className="h-3 bg-slate-100 rounded w-5/6" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredAlumni.length === 0 ? (
            <div className="text-center py-20">
              <GraduationCap className="mx-auto text-slate-300 mb-4" size={56} />
              <p className="text-slate-400 font-medium text-lg">
                {alumniSearch
                  ? "No alumni match your search."
                  : "Alumni records will appear here once published."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAlumni.map((a) => (
                <div
                  key={a._id}
                  className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden group"
                >
                  {/* Top gradient bar */}
                  <div className={`h-1.5 w-full bg-gradient-to-r ${avatarColor(a.name)}`} />

                  <div className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      {a.profileImage ? (
                        <img
                          src={a.profileImage}
                          alt={a.name}
                          className="w-14 h-14 rounded-full object-cover ring-2 ring-white shadow"
                        />
                      ) : (
                        <div
                          className={`w-14 h-14 rounded-full bg-gradient-to-br ${avatarColor(a.name)} flex items-center justify-center text-white font-bold text-lg shadow`}
                        >
                          {getInitials(a.name)}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-[#082F49] text-base truncate">
                          {a.name}
                        </h3>
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full mt-1">
                          <Award size={11} /> {a.certificationTitle}
                        </span>
                      </div>
                    </div>

                    {a.bio && (
                      <p className="text-slate-500 text-sm mb-4 line-clamp-2 leading-relaxed">
                        {a.bio}
                      </p>
                    )}

                    <div className="space-y-1.5 text-sm text-slate-600">
                      {a.email && (
                        <div className="flex items-center gap-2">
                          <Mail size={13} className="text-slate-400 shrink-0" />
                          <a
                            href={`mailto:${a.email}`}
                            className="hover:text-blue-600 truncate transition-colors"
                          >
                            {a.email}
                          </a>
                        </div>
                      )}
                      {a.phone && (
                        <div className="flex items-center gap-2">
                          <Phone size={13} className="text-slate-400 shrink-0" />
                          <a
                            href={`tel:${a.phone}`}
                            className="hover:text-blue-600 transition-colors"
                          >
                            {a.phone}
                          </a>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-slate-400">
                        <GraduationCap size={13} className="shrink-0" />
                        <span>Class of {a.graduationYear}</span>
                      </div>
                    </div>

                    {a.linkedIn && (
                      <a
                        href={a.linkedIn}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-[#0A66C2] hover:underline"
                      >
                        <Linkedin size={14} /> View LinkedIn Profile
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── GUARANTOR PROGRAM ─────────────────────────────────────────────── */}
      <section id="guarantor" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left — copy */}
            <div>
              <span className="inline-block text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full mb-4">
                VSP Guarantor Program
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#082F49] leading-tight mb-5">
                We Don't Just Train —{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-600">
                  We Guarantee.
                </span>
              </h2>
              <p className="text-slate-600 text-base leading-relaxed mb-6">
                When a VSP-certified student joins your organisation, Virtual
                Solution Path formally assumes the role of their professional
                guarantor. This means your company benefits from a layer of
                institutional accountability that goes beyond a standard
                reference letter.
              </p>
              <p className="text-slate-600 text-base leading-relaxed mb-8">
                Our guarantee covers the candidate's core technical
                competencies, professional ethics, and the integrity of their
                certification — all verified and backed by VSP's academic
                record. Hiring a VSP graduate means hiring with confidence.
              </p>

              <ul className="space-y-3">
                {[
                  "Formal written guarantee of candidate's certified skill set",
                  "Direct point of contact at VSP for any professional concerns",
                  "Continued mentorship support during the candidate's probation period",
                  "Backed by VSP's institutional reputation and track record",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-slate-700">
                    <CheckCircle2
                      size={18}
                      className="text-emerald-500 shrink-0 mt-0.5"
                    />
                    {item}
                  </li>
                ))}
              </ul>

              <Link
                href="/contact"
                className="mt-10 inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold px-7 py-3.5 rounded-full shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:-translate-y-0.5 transition-all text-sm"
              >
                Partner With Us <ArrowRight size={16} />
              </Link>
            </div>

            {/* Right — visual card */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-100 to-teal-50 rounded-3xl rotate-3 scale-[1.02]" />
              <div className="relative bg-white rounded-3xl shadow-xl p-8 border border-emerald-100">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg mb-6">
                  <ShieldCheck className="text-white" size={32} />
                </div>
                <h3 className="text-xl font-extrabold text-[#082F49] mb-2">
                  The VSP Guarantee
                </h3>
                <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                  A partnership built on trust, accountability, and verified
                  excellence.
                </p>
                <div className="space-y-4">
                  {[
                    { label: "Guarantor", value: "Virtual Solution Path" },
                    { label: "Scope", value: "Technical Skills & Professional Conduct" },
                    { label: "Duration", value: "Full probation period" },
                    { label: "Support", value: "Dedicated VSP liaison" },
                  ].map((row) => (
                    <div
                      key={row.label}
                      className="flex justify-between items-center py-3 border-b border-slate-100 last:border-0"
                    >
                      <span className="text-sm font-semibold text-slate-500">
                        {row.label}
                      </span>
                      <span className="text-sm font-bold text-[#082F49] text-right max-w-[55%]">
                        {row.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── JOB OPPORTUNITIES ─────────────────────────────────────────────── */}
      <section id="opportunities" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full mb-3">
              Open Positions
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#082F49]">
              Career Opportunities
            </h2>
            <p className="text-slate-500 mt-3 max-w-xl mx-auto">
              These roles are available exclusively to VSP-certified students and
              alumni through our partner company network.
            </p>
          </div>

          {loadingJobs ? (
            <div className="space-y-4 max-w-3xl mx-auto">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-6 animate-pulse border border-slate-100"
                >
                  <div className="h-5 bg-slate-200 rounded w-1/2 mb-3" />
                  <div className="h-3 bg-slate-100 rounded w-1/3 mb-4" />
                  <div className="h-3 bg-slate-100 rounded w-full" />
                </div>
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-20">
              <Briefcase className="mx-auto text-slate-300 mb-4" size={56} />
              <p className="text-slate-400 font-medium text-lg">
                New opportunities are posted regularly — check back soon!
              </p>
            </div>
          ) : (
            <div className="space-y-4 max-w-3xl mx-auto">
              {jobs.map((job) => (
                <div
                  key={job._id}
                  className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h3 className="font-bold text-[#082F49] text-lg">
                          {job.title}
                        </h3>
                        <span
                          className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                            job.type === "Full-time"
                              ? "bg-blue-50 text-blue-600"
                              : job.type === "Internship"
                              ? "bg-amber-50 text-amber-600"
                              : "bg-purple-50 text-purple-600"
                          }`}
                        >
                          {job.type}
                        </span>
                      </div>
                      <p className="text-slate-500 font-semibold text-sm mb-1">
                        {job.company}
                      </p>
                      <div className="flex flex-wrap gap-3 text-xs text-slate-400 mb-3">
                        <span className="flex items-center gap-1">
                          <MapPin size={12} /> {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} />{" "}
                          {new Date(job.postedAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      <p className="text-slate-600 text-sm leading-relaxed line-clamp-2">
                        {job.description}
                      </p>
                      {job.requirements.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {job.requirements.slice(0, 4).map((r) => (
                            <span
                              key={r}
                              className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-medium"
                            >
                              {r}
                            </span>
                          ))}
                          {job.requirements.length > 4 && (
                            <span className="text-xs text-slate-400 px-2 py-1">
                              +{job.requirements.length - 4} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    {job.applyLink && (
                      <a
                        href={job.applyLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 self-start bg-[#082F49] text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-[#0C4A6E] transition-colors flex items-center gap-2"
                      >
                        Apply <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── PROFESSIONAL EVALUATION SERVICE ───────────────────────────────── */}
      <section id="evaluation" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="bg-gradient-to-br from-[#082F49] to-[#0C4A6E] rounded-3xl p-10 sm:p-16 relative overflow-hidden">
            {/* Decorative */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative grid lg:grid-cols-2 gap-12 items-center">
              {/* Left */}
              <div>
                <span className="inline-block text-xs font-bold uppercase tracking-widest text-sky-300 bg-white/10 px-3 py-1 rounded-full mb-4">
                  For Employers · B2B Service
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight mb-5">
                  Hire Smarter with VSP's
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-cyan-300">
                    Professional Evaluation Service
                  </span>
                </h2>
                <p className="text-sky-100 text-base leading-relaxed mb-4">
                  Finding the right technical talent is time-consuming and
                  expensive. VSP eliminates that uncertainty by conducting
                  rigorous, multi-stage professional evaluations on your behalf —
                  before a single candidate walks through your door.
                </p>
                <p className="text-sky-100 text-base leading-relaxed mb-8">
                  Our evaluation framework assesses not only raw technical
                  skills, but also real-world problem-solving ability,
                  communication, team readiness, and professional demeanor. We
                  then provide you with a detailed candidate report and our
                  official recommendation.
                </p>

                <div className="grid sm:grid-cols-2 gap-3 mb-8">
                  {[
                    { icon: ClipboardCheck, label: "Multi-stage Skill Testing" },
                    { icon: Users, label: "Behavioural Assessment" },
                    { icon: Star, label: "VSP Score & Ranking" },
                    { icon: ShieldCheck, label: "Detailed Candidate Report" },
                  ].map((f) => (
                    <div
                      key={f.label}
                      className="flex items-center gap-3 bg-white/10 border border-white/15 rounded-xl px-4 py-3"
                    >
                      <f.icon size={18} className="text-sky-300 shrink-0" />
                      <span className="text-sm font-semibold text-white">
                        {f.label}
                      </span>
                    </div>
                  ))}
                </div>

                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 bg-white text-[#082F49] font-bold px-7 py-3.5 rounded-full shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all text-sm"
                >
                  Request an Evaluation <ArrowRight size={16} />
                </Link>
              </div>

              {/* Right — process steps */}
              <div className="space-y-4">
                {[
                  {
                    step: "01",
                    title: "Submit Your Requirements",
                    desc: "Share the role details, required skills, and any specific assessment criteria with our team.",
                  },
                  {
                    step: "02",
                    title: "VSP Conducts the Evaluation",
                    desc: "We run structured technical tests, practical assignments, and professional interviews with shortlisted candidates.",
                  },
                  {
                    step: "03",
                    title: "Receive a Curated Shortlist",
                    desc: "You receive a detailed report for each recommended candidate along with their VSP score and our official endorsement.",
                  },
                  {
                    step: "04",
                    title: "Hire with Confidence",
                    desc: "Choose your candidate knowing that VSP has fully vetted and backs every individual on your shortlist.",
                  },
                ].map((s) => (
                  <div
                    key={s.step}
                    className="flex gap-5 bg-white/8 border border-white/15 rounded-2xl p-5 hover:bg-white/12 transition-colors"
                  >
                    <span className="text-3xl font-black text-white/20 leading-none shrink-0">
                      {s.step}
                    </span>
                    <div>
                      <h4 className="font-bold text-white mb-1">{s.title}</h4>
                      <p className="text-sky-200 text-sm leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER CTA ────────────────────────────────────────────────────── */}
      <section className="py-16 bg-slate-50 border-t border-slate-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#082F49] mb-4">
            Ready to Take the Next Step?
          </h2>
          <p className="text-slate-500 mb-8">
            Whether you are a student looking for your first role, or an
            employer seeking verified talent — VSP is your partner.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-[#082F49] text-white px-8 py-3.5 rounded-full font-bold text-sm shadow-lg hover:-translate-y-0.5 hover:shadow-xl transition-all"
            >
              Get In Touch
            </Link>
            <Link
              href="/courses"
              className="bg-white border border-slate-200 text-[#082F49] px-8 py-3.5 rounded-full font-bold text-sm hover:bg-slate-50 hover:border-slate-300 transition-all"
            >
              Explore Our Courses
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
