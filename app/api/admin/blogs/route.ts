import { connectDB } from "@/lib/db";
import Blog from "@/models/Blog";
import { NextRequest, NextResponse } from "next/server";

// Helper: Generate slug from title
function generateSlug(title: string) {
    return title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

// GET: All blogs (for admin - includes drafts)
export async function GET() {
    await connectDB();
    const blogs = await Blog.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ blogs });
}

// POST: Create new blog
export async function POST(req: NextRequest) {
    await connectDB();
    try {
        const body = await req.json();
        const { title, author, category, coverImage, excerpt, content, tags, published } = body;

        if (!title || !category || !excerpt || !content) {
            return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
        }

        const slug = generateSlug(title) + "-" + Date.now();

        const blog = new Blog({
            title, slug, author, category, coverImage, excerpt, content,
            tags: tags ? tags.split(",").map((t: string) => t.trim()) : [],
            published: published === true,
        });

        await blog.save();
        return NextResponse.json({ success: true, blog }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// PUT: Update blog
export async function PUT(req: NextRequest) {
    await connectDB();
    try {
        const body = await req.json();
        const { id, title, author, category, coverImage, excerpt, content, tags, published, featuredOnHome } = body;

        const updated = await Blog.findByIdAndUpdate(id, {
            title, author, category, coverImage, excerpt, content,
            tags: tags ? (Array.isArray(tags) ? tags : tags.split(",").map((t: string) => t.trim())) : [],
            published,
            ...(featuredOnHome !== undefined && { featuredOnHome }),
            updatedAt: new Date(),
        }, { new: true });

        return NextResponse.json({ success: true, blog: updated });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// DELETE: Delete blog by id
export async function DELETE(req: NextRequest) {
    await connectDB();
    try {
        const { id } = await req.json();
        await Blog.findByIdAndDelete(id);
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
