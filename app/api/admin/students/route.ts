import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Payment from "@/models/Payment";
import Course from "@/models/Course";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();

    const [users, payments, courses] = await Promise.all([
      User.find({ role: "student" }).sort({ createdAt: -1 }).select("-password").lean(),
      Payment.find({ status: "approved" }).lean(),
      Course.find({}).lean()
    ]);

    const usersWithDetails = users.map((user: any) => {

      // Is user ki approved payments
      const userPayments = payments.filter((p: any) => p.email === user.email);

      const enrollmentDetails = userPayments.map((p: any) => {
        // Course data dhundo
        const courseData: any = courses.find((c: any) => c.slug === p.courseSlug);

        // --- PRIORITY LOGIC ---

        // 1. Admin ki Custom Fee (DB se uthao)
        const adminPrice = p.customTotalFee ? Number(p.customTotalFee) : 0;

        // 2. Original Course Price
        const coursePrice = courseData?.price ? Number(courseData.price) : 0;

        // 3. Final Decision
        let finalFee = 5000; // Default fallback

        if (adminPrice > 0) {
          finalFee = adminPrice; // Priority 1: Admin Override
        } else if (coursePrice > 0) {
          finalFee = coursePrice; // Priority 2: Course Default
        }
        // Else: 5000 hi rahega

        return {
          courseSlug: p.courseSlug,
          courseTitle: p.courseTitle || courseData?.title || p.courseSlug,
          paidAmount: Number(p.amount) || 0,
          actualCourseFee: finalFee // ✅ Ab ye 0 nahi hoga
        };
      });

      return {
        ...user,
        enrollments: enrollmentDetails
      };
    });

    return NextResponse.json({ users: usersWithDetails });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}