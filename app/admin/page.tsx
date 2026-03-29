"use client";

import { useEffect, useState } from "react";
import { Users, Award, Loader2, CreditCard, DollarSign, GraduationCap, Briefcase } from "lucide-react";
import Link from "next/link"; 

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    pendingPayments: 0,
    pendingCertificates: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // 1. Fetch Data from all APIs
        const [paymentsRes, studentsRes, certRes] = await Promise.all([
            fetch("/api/admin/payments"),
            fetch("/api/admin/students"),
            fetch("/api/admin/certificates")
        ]);

        const paymentsData = await paymentsRes.json();
        const studentsData = await studentsRes.json();
        const certData = await certRes.json();
        
        // 2. Calculations
        // Payments
        const pendingPay = paymentsData.payments?.filter((p: any) => p.status === "pending").length || 0;
        const revenue = paymentsData.payments?.filter((p: any) => p.status === "approved")
                        .reduce((acc: number, curr: any) => acc + Number(curr.amount || 0), 0) || 0;

        // Students (Fix: Ab ye real DB count layega)
        const studentCount = studentsData.users ? studentsData.users.length : 0;

        // Certificates
        const certCount = certData.requests ? certData.requests.filter((r:any) => r.status === 'pending').length : 0;

        // 3. Set State
        setStats({
            totalStudents: studentCount, 
            pendingPayments: pendingPay,
            pendingCertificates: certCount,
            totalRevenue: revenue
        });

      } catch (error) {
        console.error("Error fetching stats");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div className="p-10 flex items-center gap-2"><Loader2 className="animate-spin"/> Loading Dashboard...</div>;

  return (
    <div className="space-y-8 pb-10">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Dashboard Overview</h1>
        <p className="text-slate-500">Welcome back, Administrator.</p>
      </div>

      {/* --- STATS CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         
         {/* 1. Card: Total Students */}
         <Link href="/admin/students">
             <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer group">
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                   <Users size={24} />
                </div>
                <div>
                   <p className="text-slate-500 text-xs font-bold uppercase tracking-wide">Total Students</p>
                   {/* 👇 Real Data */}
                   <h3 className="text-2xl font-bold text-slate-800">{stats.totalStudents}</h3>
                </div>
             </div>
         </Link>

         {/* 2. Card: Pending Payments */}
         <Link href="/admin/payments">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer group">
                <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center group-hover:bg-orange-600 group-hover:text-white transition-colors">
                   <CreditCard size={24} />
                </div>
                <div>
                   <p className="text-slate-500 text-xs font-bold uppercase tracking-wide">Fee Verification</p>
                   <h3 className="text-2xl font-bold text-slate-800">{stats.pendingPayments}</h3>
                   <span className="text-xs text-orange-600 font-bold">Pending Review</span>
                </div>
            </div>
         </Link>

         {/* 3. Card: Certificate Requests */}
         <Link href="/admin/certificates">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer group">
                <div className="w-12 h-12 rounded-xl bg-yellow-100 text-yellow-600 flex items-center justify-center group-hover:bg-yellow-600 group-hover:text-white transition-colors">
                   <Award size={24} />
                </div>
                <div>
                   <p className="text-slate-500 text-xs font-bold uppercase tracking-wide">Certificates</p>
                   <h3 className="text-2xl font-bold text-slate-800">{stats.pendingCertificates}</h3>
                   <span className="text-xs text-yellow-600 font-bold">Requests</span>
                </div>
            </div>
         </Link>

         {/* 4. Card: Total Revenue */}
         <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-100 text-green-600 flex items-center justify-center">
               <DollarSign size={24} />
            </div>
            <div>
               <p className="text-slate-500 text-xs font-bold uppercase tracking-wide">Total Revenue</p>
               <h3 className="text-2xl font-bold text-slate-800">Rs {stats.totalRevenue.toLocaleString()}</h3>
            </div>
         </div>
         {/* 5. Card: Alumni */}
         <Link href="/admin/alumni">
             <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer group">
                <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white transition-colors">
                   <GraduationCap size={24} />
                </div>
                <div>
                   <p className="text-slate-500 text-xs font-bold uppercase tracking-wide">Alumni</p>
                   <h3 className="text-2xl font-bold text-slate-800">Directory</h3>
                   <span className="text-xs text-teal-600 font-bold">Manage Records</span>
                </div>
             </div>
         </Link>

         {/* 6. Card: Jobs */}
         <Link href="/admin/jobs">
             <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer group">
                <div className="w-12 h-12 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center group-hover:bg-violet-600 group-hover:text-white transition-colors">
                   <Briefcase size={24} />
                </div>
                <div>
                   <p className="text-slate-500 text-xs font-bold uppercase tracking-wide">Jobs</p>
                   <h3 className="text-2xl font-bold text-slate-800">Opportunities</h3>
                   <span className="text-xs text-violet-600 font-bold">Manage Postings</span>
                </div>
             </div>
         </Link>
      </div>

      {/* --- QUICK ACTIONS SECTION --- */}
      <div className="grid md:grid-cols-2 gap-6">
          
          {/* Action 1: Verify Payments */}
          <div className="bg-[#082F49] rounded-3xl p-8 text-white relative overflow-hidden flex flex-col justify-between">
             <div className="relative z-10">
                <h2 className="text-2xl font-bold mb-2">New Enrollments</h2>
                <p className="text-blue-200 mb-6">
                   You have <strong>{stats.pendingPayments} new fee submissions</strong>. Approve them to enroll students.
                </p>
                <Link href="/admin/payments" className="bg-white text-[#082F49] px-6 py-3 rounded-xl font-bold hover:bg-blue-50 transition-colors inline-flex items-center gap-2">
                   Verify Payments <CreditCard size={18} />
                </Link>
             </div>
             <CreditCard className="absolute -right-6 -bottom-6 text-white/5 w-48 h-48 rotate-12" />
          </div>

          {/* Action 2: Issue Certificates */}
          <div className="bg-blue-600 rounded-3xl p-8 text-white relative overflow-hidden flex flex-col justify-between">
             <div className="relative z-10">
                <h2 className="text-2xl font-bold mb-2">Certificate Requests</h2>
                <p className="text-blue-100 mb-6">
                   <strong>{stats.pendingCertificates} students</strong> have completed courses and are waiting for certificates.
                </p>
                <Link href="/admin/certificates" className="bg-white text-blue-600 px-6 py-3 rounded-xl font-bold hover:bg-blue-50 transition-colors inline-flex items-center gap-2">
                   Issue Certificates <Award size={18} />
                </Link>
             </div>
             <Award className="absolute -right-6 -bottom-6 text-white/10 w-48 h-48 -rotate-12" />
          </div>

          {/* Action 3: Manage Alumni */}
          <div className="bg-teal-600 rounded-3xl p-8 text-white relative overflow-hidden flex flex-col justify-between">
             <div className="relative z-10">
                <h2 className="text-2xl font-bold mb-2">Alumni Directory</h2>
                <p className="text-teal-100 mb-6">
                   Add, update, and manage certified graduates shown on the public <strong>Career Hub</strong> page.
                </p>
                <Link href="/admin/alumni" className="bg-white text-teal-700 px-6 py-3 rounded-xl font-bold hover:bg-teal-50 transition-colors inline-flex items-center gap-2">
                   Manage Alumni <GraduationCap size={18} />
                </Link>
             </div>
             <GraduationCap className="absolute -right-6 -bottom-6 text-white/10 w-48 h-48 rotate-6" />
          </div>

          {/* Action 4: Manage Jobs */}
          <div className="bg-violet-700 rounded-3xl p-8 text-white relative overflow-hidden flex flex-col justify-between">
             <div className="relative z-10">
                <h2 className="text-2xl font-bold mb-2">Job Opportunities</h2>
                <p className="text-violet-100 mb-6">
                   Post and manage career opportunities for VSP students and alumni through partner companies.
                </p>
                <Link href="/admin/jobs" className="bg-white text-violet-700 px-6 py-3 rounded-xl font-bold hover:bg-violet-50 transition-colors inline-flex items-center gap-2">
                   Manage Jobs <Briefcase size={18} />
                </Link>
             </div>
             <Briefcase className="absolute -right-6 -bottom-6 text-white/10 w-48 h-48 -rotate-6" />
          </div>

      </div>

    </div>
  );
}