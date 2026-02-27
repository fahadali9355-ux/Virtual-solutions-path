"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft, CreditCard } from "lucide-react";
import Link from "next/link";

export default function PaymentForm({ course }: { course: any }) {
   const router = useRouter();
   const [trxId, setTrxId] = useState("");
   const [method, setMethod] = useState("NAYAPAY");
   const [loading, setLoading] = useState(false);

   // 👇 FIX: Price Logic Updated (NaN issue solved)
   // 1. Sirf numbers nikalo
   const rawPrice = course?.price ? course.price.toString().replace(/[^0-9]/g, "") : "";

   // 2. Agar number hai tu parseInt karo, warna 0 rakho
   const actualPrice = rawPrice ? parseInt(rawPrice) : 0;

   const handleSubmit = async (e: any) => {
      e.preventDefault();
      setLoading(true);

      const email = localStorage.getItem("userEmail");
      const name = localStorage.getItem("userName");

      if (!email) {
         alert("Please login first!");
         router.push("/login");
         return;
      }

      try {
         const res = await fetch("/api/payment/submit", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
               studentName: name,
               email,
               courseTitle: course.title,
               courseSlug: course.slug,
               amount: actualPrice, // Ab ye hamesha number hoga
               trxId,
               method
            }),
         });

         const data = await res.json();
         if (res.ok) {
            alert("Payment Sent! Wait for Admin Approval.");
            router.push("/dashboard/courses");
         } else {
            alert(data.error || "Payment Failed");
         }
      } catch (error) {
         alert("Error submitting.");
      } finally {
         setLoading(false);
      }
   };

   return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
         <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full border border-slate-100">

            <Link href={`/courses/${course.slug}`} className="flex items-center gap-2 text-slate-500 mb-6 hover:text-blue-600">
               <ArrowLeft size={18} /> Cancel
            </Link>

            <div className="text-center mb-8">
               <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <CreditCard size={32} />
               </div>
               <h1 className="text-2xl font-bold text-slate-800">Enroll in {course.title}</h1>
               <p className="text-slate-500 text-sm mt-2">
                  Total Fee:
                  <span className="font-bold text-slate-800 text-lg ml-1">
                     {/* 👇 Agar price 0 hai tu "Free" dikhao */}
                     {actualPrice > 0 ? `Rs ${actualPrice.toLocaleString()}` : "Free / Contact Admin"}
                  </span>
               </p>
            </div>

            {/* Bank Details */}
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl mb-6 text-sm">
               <p className="font-bold text-slate-800">EasyPaisa:</p>
               <p className="text-slate-600 font-mono text-lg tracking-wider mt-1">0318-2009250</p>
               <p className="font-bold text-slate-800">NAYA PAY:</p>
               <p className="text-slate-600 font-mono text-lg tracking-wider mt-1">PK80NAYA1234503182009250</p>
               <p className="text-slate-500 text-xs mt-1">Title: Virtual Solution Path</p>
               <p className="text-green-700 font-bold text-xs mt-2">✨ You can pay in installments.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
               <div>
                  <label className="text-sm font-bold text-slate-700">Payment Method</label>
                  <select value={method} onChange={(e) => setMethod(e.target.value)} className="w-full p-3 border rounded-xl mt-1 bg-white">
                     <option>NAYA PAY</option>
                     <option>EasyPaisa</option>
                  </select>
               </div>

               <div>
                  <label className="text-sm font-bold text-slate-700">Transaction ID (Trx ID)</label>
                  <input
                     required
                     placeholder="e.g. 832928392"
                     className="w-full p-3 border rounded-xl mt-1"
                     value={trxId}
                     onChange={(e) => setTrxId(e.target.value)}
                  />
               </div>

               <button disabled={loading} className="w-full bg-[#082F49] text-white py-3 rounded-xl font-bold hover:bg-[#0C4A6E] flex justify-center gap-2">
                  {loading ? <Loader2 className="animate-spin" /> : "Submit Payment"}
               </button>
            </form>
         </div>
      </div>
   );
}