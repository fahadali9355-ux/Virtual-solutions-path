"use client";

import { useRef, useState, useEffect } from "react";
import { useParams, notFound } from "next/navigation";
import { useRouter } from "next/navigation";
import { Download, Award, Loader2, CheckCircle } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function CertificatePage() {
  const params = useParams();
  const slug = params.slug as string;
  const router = useRouter();
  const certificateRef = useRef<HTMLDivElement>(null);

  const [course, setCourse] = useState<any>(null);
  const [studentName, setStudentName] = useState("Student Name");
  const [downloading, setDownloading] = useState(false);
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Student name from localStorage
    const name = localStorage.getItem("userName");
    if (name) setStudentName(name);

    // Date
    setDate(new Date().toLocaleDateString("en-US", {
      year: "numeric", month: "long", day: "numeric",
    }));

    // Fetch course from DB by slug
    const fetchCourse = async () => {
      try {
        const res = await fetch(`/api/courses?slug=${slug}`);
        const data = await res.json();

        // Try matching by slug in the returned courses array
        if (data.courses && data.courses.length > 0) {
          const matched = data.courses.find((c: any) => c.slug === slug);
          if (matched) {
            setCourse(matched);
          } else {
            setError(true);
          }
        } else if (data.course) {
          setCourse(data.course);
        } else {
          setError(true);
        }
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [slug]);

  // PDF Download - Pure jsPDF (no html2canvas issues)
  const handleDownload = async () => {
    if (!course) return;
    setDownloading(true);
    try {
      const { jsPDF } = await import("jspdf");
      const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

      const W = pdf.internal.pageSize.getWidth();   // 297
      const H = pdf.internal.pageSize.getHeight();  // 210

      // --- Background ---
      pdf.setFillColor(255, 255, 255);
      pdf.rect(0, 0, W, H, "F");

      // --- Outer Gold Border ---
      pdf.setDrawColor(184, 134, 11);
      pdf.setLineWidth(3);
      pdf.rect(8, 8, W - 16, H - 16);
      pdf.setLineWidth(0.5);
      pdf.rect(12, 12, W - 24, H - 24);

      // --- Top header bar ---
      pdf.setFillColor(8, 47, 73);
      pdf.rect(0, 0, W, 22, "F");
      pdf.setTextColor(255, 255, 255);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(13);
      pdf.text("VIRTUAL SOLUTION PATH", W / 2, 14, { align: "center" });

      // --- Bottom bar ---
      pdf.setFillColor(8, 47, 73);
      pdf.rect(0, H - 18, W, 18, "F");
      pdf.setTextColor(147, 197, 253);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(8);
      pdf.text(`© ${new Date().getFullYear()} Virtual Solution Path  |  Faisalabad, Pakistan`, W / 2, H - 7, { align: "center" });

      // --- "Certificate of Completion" ---
      pdf.setTextColor(184, 134, 11);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(11);
      pdf.text("CERTIFICATE OF COMPLETION", W / 2, 38, { align: "center" });

      // --- Decorative line ---
      pdf.setDrawColor(184, 134, 11);
      pdf.setLineWidth(0.4);
      pdf.line(60, 42, W - 60, 42);

      // --- "This is to certify that" ---
      pdf.setTextColor(120, 120, 120);
      pdf.setFont("helvetica", "italic");
      pdf.setFontSize(11);
      pdf.text("This is to certify that", W / 2, 54, { align: "center" });

      // --- Student Name ---
      pdf.setTextColor(8, 47, 73);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(36);
      pdf.text(studentName, W / 2, 78, { align: "center" });

      // --- Name underline ---
      pdf.setDrawColor(200, 200, 200);
      pdf.setLineWidth(0.3);
      const nameWidth = pdf.getStringUnitWidth(studentName) * 36 * 0.352; // approx mm
      pdf.line(W / 2 - Math.min(nameWidth / 2, 80), 81, W / 2 + Math.min(nameWidth / 2, 80), 81);

      // --- Description text ---
      pdf.setTextColor(80, 80, 80);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(11);
      const descLine1 = "has successfully completed the course:";
      pdf.text(descLine1, W / 2, 94, { align: "center" });

      // --- Course Title ---
      pdf.setTextColor(8, 47, 73);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(18);
      const courseTitle = course.title || "Course";
      pdf.text(courseTitle, W / 2, 108, { align: "center" });

      // --- Institution line ---
      pdf.setTextColor(80, 80, 80);
      pdf.setFont("helvetica", "italic");
      pdf.setFontSize(10);
      pdf.text("at Virtual Solution Path", W / 2, 118, { align: "center" });

      // --- Divider ---
      pdf.setDrawColor(200, 200, 200);
      pdf.setLineWidth(0.3);
      pdf.line(40, 130, W - 40, 130);

      // --- Footer: Date | Seal | Signature ---  
      const footerY = 152;

      // Date (left)
      pdf.setTextColor(60, 60, 60);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(10);
      pdf.text(date, 65, footerY, { align: "center" });
      pdf.setDrawColor(180, 180, 180);
      pdf.setLineWidth(0.3);
      pdf.line(25, footerY + 3, 105, footerY + 3);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(7.5);
      pdf.setTextColor(150, 150, 150);
      pdf.text("DATE ISSUED", 65, footerY + 9, { align: "center" });

      // VSP Seal (center)
      pdf.setDrawColor(184, 134, 11);
      pdf.setLineWidth(1.5);
      pdf.circle(W / 2, footerY - 3, 14, "S");
      pdf.setLineWidth(0.5);
      pdf.circle(W / 2, footerY - 3, 11, "S");
      pdf.setFillColor(184, 134, 11);
      pdf.circle(W / 2, footerY - 3, 8.5, "F");
      pdf.setTextColor(255, 255, 255);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(7);
      pdf.text("VSP", W / 2, footerY - 4.5, { align: "center" });
      pdf.text("CERTIFIED", W / 2, footerY + 0.5, { align: "center" });

      // Signature (right)
      pdf.setTextColor(8, 47, 73);
      pdf.setFont("helvetica", "bolditalic");
      pdf.setFontSize(13);
      pdf.text("CEO, VSP", W - 65, footerY, { align: "center" });
      pdf.setDrawColor(180, 180, 180);
      pdf.setLineWidth(0.3);
      pdf.line(W - 105, footerY + 3, W - 25, footerY + 3);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(7.5);
      pdf.setTextColor(150, 150, 150);
      pdf.text("AUTHORIZED SIGNATURE", W - 65, footerY + 9, { align: "center" });

      // --- Save ---
      const safeName = studentName.replace(/[^a-zA-Z0-9 ]/g, "").replace(/ /g, "-");
      const safeTitle = (course.title || "Course").replace(/[^a-zA-Z0-9 ]/g, "").replace(/ /g, "-");
      pdf.save(`${safeName}-${safeTitle}-Certificate.pdf`);

    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("PDF download failed. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="text-center">
          <Loader2 className="animate-spin text-blue-600 mx-auto mb-4" size={48} />
          <p className="text-slate-500 font-medium">Loading your certificate...</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="text-center max-w-md mx-auto p-10">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Award className="text-red-400" size={40} />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mb-3">Certificate Not Found</h1>
          <p className="text-slate-500 mb-8">
            This certificate could not be generated. Please make sure you have completed the course.
          </p>
          <button
            onClick={() => router.push("/dashboard/courses")}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all"
          >
            Back to My Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-slate-100 flex flex-col items-center justify-center p-4 md:p-10">

      {/* Action Buttons */}
      <div className="mb-8 flex flex-col sm:flex-row gap-4 items-center">
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-blue-500/30 flex items-center gap-2 hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-70"
        >
          {downloading ? (
            <><Loader2 className="animate-spin" size={20} /> Generating PDF...</>
          ) : (
            <><Download size={20} /> Download Certificate (PDF)</>
          )}
        </button>
        <div className="flex items-center gap-2 text-sm text-green-600 font-semibold bg-green-50 border border-green-200 px-4 py-2 rounded-full">
          <CheckCircle size={16} />
          Course Completed
        </div>
      </div>

      {/* CERTIFICATE (A4 Landscape ratio) */}
      <div
        ref={certificateRef}
        className="w-full max-w-[960px] bg-white shadow-2xl relative overflow-hidden"
        style={{ aspectRatio: "1.414/1", fontFamily: "Georgia, serif" }}
      >
        {/* Outer Gold Border */}
        <div className="absolute inset-0 border-[14px] border-double border-[#B8860B] pointer-events-none z-10" />

        {/* Inner Border */}
        <div className="absolute inset-5 border border-[#B8860B]/40 pointer-events-none z-10" />

        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#fffdf5] via-white to-[#f0f7ff]" />

        {/* Top Left Ornament */}
        <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-yellow-400/20 to-transparent rounded-br-full" />
        {/* Bottom Right Ornament */}
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-blue-600/15 to-transparent rounded-tl-full" />

        {/* Watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.025] pointer-events-none z-0">
          <Award size={420} className="text-blue-900" />
        </div>

        {/* CONTENT */}
        <div className="relative z-5 h-full flex flex-col items-center justify-center px-12 py-8 text-center">

          {/* VSP Logo + Name */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#B8860B] shadow">
              <img src="/images/img1.png" alt="VSP" className="w-full h-full object-cover" />
            </div>
            <span className="text-2xl font-bold text-[#082F49] tracking-widest uppercase" style={{ fontFamily: "Georgia, serif" }}>
              Virtual Solution Path
            </span>
          </div>

          {/* Decorative Line */}
          <div className="flex items-center gap-3 mb-4 w-full max-w-md">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#B8860B] to-transparent" />
            <span className="text-yellow-600 text-lg">✦</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#B8860B] to-transparent" />
          </div>

          {/* "Certificate of Completion" */}
          <p className="text-[#B8860B] tracking-[0.3em] uppercase text-sm font-semibold mb-2">Certificate of Completion</p>
          <p className="text-slate-500 text-sm italic mb-3">This is to certify that</p>

          {/* Student Name */}
          <h2 className="text-4xl md:text-5xl font-bold text-[#082F49] mb-4 capitalize leading-tight" style={{ fontFamily: "Georgia, serif" }}>
            {studentName}
          </h2>

          {/* Separator */}
          <div className="w-48 h-0.5 bg-gradient-to-r from-transparent via-slate-300 to-transparent mb-4" />

          {/* Description */}
          <p className="text-slate-600 text-base md:text-lg max-w-2xl leading-relaxed mb-6">
            has successfully completed the&nbsp;
            <strong className="text-[#082F49] font-bold">{course.title}</strong>&nbsp;
            course with dedication and excellence at&nbsp;
            <strong className="text-[#082F49]">Virtual Solution Path</strong>.
          </p>

          {/* Footer Row */}
          <div className="w-full flex justify-between items-end px-8 mt-auto">
            {/* Date */}
            <div className="text-center">
              <p className="font-bold text-slate-700 text-sm mb-1">{date}</p>
              <div className="h-px w-36 bg-slate-300 mx-auto" />
              <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest">Date Issued</p>
            </div>

            {/* Seal */}
            <div className="w-20 h-20 relative">
              <div className="absolute inset-0 border-4 border-[#B8860B] rounded-full border-dashed opacity-80" />
              <div className="absolute inset-2 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex flex-col items-center justify-center shadow-inner">
                <span className="text-white font-black text-xs leading-tight text-center">VSP<br />✓</span>
              </div>
            </div>

            {/* Signature */}
            <div className="text-center">
              <p className="text-[#082F49] font-semibold italic text-lg mb-1" style={{ fontFamily: "Georgia, serif" }}>CEO, VSP</p>
              <div className="h-px w-36 bg-slate-300 mx-auto" />
              <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest">Authorized Signature</p>
            </div>
          </div>

        </div>
      </div>

      <p className="mt-6 text-slate-400 text-sm">
        💡 Click &ldquo;Download Certificate&rdquo; to save as PDF
      </p>
    </div>
  );
}