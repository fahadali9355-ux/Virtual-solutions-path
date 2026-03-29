import { connectDB } from "@/lib/db";
import Alumni from "@/models/Alumni";
import { NextResponse } from "next/server";

// GET: All public alumni
export async function GET() {
  await connectDB();
  try {
    const alumni = await Alumni.find({ isPublic: true })
      .sort({ createdAt: -1 })
      .select("name email phone certificationTitle graduationYear profileImage linkedIn bio");
    return NextResponse.json({ alumni });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
