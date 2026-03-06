import { connectDB } from "@/lib/db";
import Blog from "@/models/Blog";
import { NextRequest, NextResponse } from "next/server";

// GET: Published blogs (public). Pass ?featured=true for landing page featured blogs only.
export async function GET(req: NextRequest) {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const featured = searchParams.get("featured");
    const query: any = { published: true };
    if (featured === "true") query.featuredOnHome = true;
    const blogs = await Blog.find(query).sort({ createdAt: -1 });
    return NextResponse.json({ blogs });
}
