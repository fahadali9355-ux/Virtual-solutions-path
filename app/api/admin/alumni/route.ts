import { connectDB } from "@/lib/db";
import Alumni from "@/models/Alumni";
import { NextRequest, NextResponse } from "next/server";

// GET: All alumni (admin view, includes private ones)
export async function GET() {
  await connectDB();
  try {
    const alumni = await Alumni.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ alumni });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Add new alumni record
export async function POST(req: NextRequest) {
  await connectDB();
  try {
    const body = await req.json();
    const { name, email, phone, certificationTitle, graduationYear, profileImage, linkedIn, bio, isPublic } = body;

    if (!name || !email || !certificationTitle) {
      return NextResponse.json(
        { error: "Name, email, and certification title are required." },
        { status: 400 }
      );
    }

    const existing = await Alumni.findOne({ email });
    if (existing) {
      return NextResponse.json(
        { error: "An alumni with this email already exists." },
        { status: 409 }
      );
    }

    const alumni = new Alumni({
      name,
      email,
      phone: phone || "",
      certificationTitle,
      graduationYear: graduationYear || new Date().getFullYear(),
      profileImage: profileImage || "",
      linkedIn: linkedIn || "",
      bio: bio || "",
      isPublic: isPublic !== undefined ? isPublic : true,
    });

    await alumni.save();
    return NextResponse.json({ success: true, alumni }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT: Update alumni record
export async function PUT(req: NextRequest) {
  await connectDB();
  try {
    const body = await req.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: "Alumni ID is required." }, { status: 400 });
    }

    const updated = await Alumni.findByIdAndUpdate(id, updateData, { new: true });
    return NextResponse.json({ success: true, alumni: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE: Remove alumni record
export async function DELETE(req: NextRequest) {
  await connectDB();
  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "Alumni ID is required." }, { status: 400 });
    }
    await Alumni.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
