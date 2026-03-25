import { connectDB } from "@/lib/db";
import Blog from "@/models/Blog";
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// Cloudinary Config
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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
        const formData = await req.formData();
        const title = formData.get("title") as string;
        const author = formData.get("author") as string;
        const category = formData.get("category") as string;
        const excerpt = formData.get("excerpt") as string;
        const content = formData.get("content") as string;
        const tagsString = formData.get("tags") as string;
        const publishedString = formData.get("published") as string;
        const published = publishedString === "true";

        let coverImage = formData.get("coverImage") as string || "";
        const imageFile = formData.get("image") as File;

        if (!title || !category || !excerpt || !content) {
            return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
        }

        if (imageFile) {
            const arrayBuffer = await imageFile.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            const uploadResponse: any = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    { folder: "vsp_blogs" },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                ).end(buffer);
            });
            coverImage = uploadResponse.secure_url;
        }

        const slug = generateSlug(title) + "-" + Date.now();

        const blog = new Blog({
            title, slug, author, category, coverImage, excerpt, content,
            tags: tagsString ? tagsString.split(",").map((t: string) => t.trim()) : [],
            published,
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
        const formData = await req.formData();
        const id = formData.get("id") as string;
        const title = formData.get("title") as string;
        const author = formData.get("author") as string;
        const category = formData.get("category") as string;
        const excerpt = formData.get("excerpt") as string;
        const content = formData.get("content") as string;
        const tagsString = formData.get("tags") as string;
        const publishedString = formData.get("published") as string;
        const published = publishedString === "true";
        const featuredOnHomeString = formData.get("featuredOnHome") as string;
        const featuredOnHome = featuredOnHomeString === "true";

        let coverImage = formData.get("coverImage") as string;
        const imageFile = formData.get("image") as File;

        if (imageFile && imageFile.size > 0) {
            const arrayBuffer = await imageFile.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            const uploadResponse: any = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    { folder: "vsp_blogs" },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                ).end(buffer);
            });
            coverImage = uploadResponse.secure_url;
        }

        let parsedTags: string[] = [];
        if (tagsString) {
           parsedTags = tagsString.split(",").map((t: string) => t.trim());
        }

        const updateData: any = {
            title, author, category, excerpt, content,
            tags: parsedTags,
            published,
            ...(featuredOnHomeString && { featuredOnHome }),
            updatedAt: new Date(),
        };

        if (coverImage) {
            updateData.coverImage = coverImage;
        }

        const updated = await Blog.findByIdAndUpdate(id, updateData, { new: true });

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
