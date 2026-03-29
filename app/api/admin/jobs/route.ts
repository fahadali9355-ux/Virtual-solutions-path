import { connectDB } from "@/lib/db";
import JobOpportunity from "@/models/JobOpportunity";
import { NextRequest, NextResponse } from "next/server";

// GET: All jobs (admin view, includes inactive)
export async function GET() {
  await connectDB();
  try {
    const jobs = await JobOpportunity.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ jobs });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Create a new job posting
export async function POST(req: NextRequest) {
  await connectDB();
  try {
    const body = await req.json();
    const { title, company, location, type, description, requirements, applyLink, isActive } = body;

    if (!title || !company || !description) {
      return NextResponse.json(
        { error: "Title, company, and description are required." },
        { status: 400 }
      );
    }

    const job = new JobOpportunity({
      title,
      company,
      location: location || "Remote",
      type: type || "Full-time",
      description,
      requirements: Array.isArray(requirements) ? requirements : [],
      applyLink: applyLink || "",
      isActive: isActive !== undefined ? isActive : true,
    });

    await job.save();
    return NextResponse.json({ success: true, job }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT: Update a job posting
export async function PUT(req: NextRequest) {
  await connectDB();
  try {
    const body = await req.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: "Job ID is required." }, { status: 400 });
    }

    const updated = await JobOpportunity.findByIdAndUpdate(id, updateData, { new: true });
    return NextResponse.json({ success: true, job: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE: Remove a job posting
export async function DELETE(req: NextRequest) {
  await connectDB();
  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "Job ID is required." }, { status: 400 });
    }
    await JobOpportunity.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
