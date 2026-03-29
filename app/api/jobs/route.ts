import { connectDB } from "@/lib/db";
import JobOpportunity from "@/models/JobOpportunity";
import { NextResponse } from "next/server";

// GET: All active job listings
export async function GET() {
  await connectDB();
  try {
    const jobs = await JobOpportunity.find({ isActive: true }).sort({
      postedAt: -1,
    });
    return NextResponse.json({ jobs });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
