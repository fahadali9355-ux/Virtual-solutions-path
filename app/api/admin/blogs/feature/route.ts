import { connectDB } from "@/lib/db";
import Blog from "@/models/Blog";
import { NextRequest, NextResponse } from "next/server";

// PATCH: Toggle featuredOnHome for a blog (max 3 allowed)
export async function PATCH(req: NextRequest) {
    await connectDB();
    try {
        const { id, featuredOnHome } = await req.json();

        if (!id) {
            return NextResponse.json({ error: "Blog ID required." }, { status: 400 });
        }

        // If trying to feature, check current count
        if (featuredOnHome === true) {
            const featuredCount = await Blog.countDocuments({ featuredOnHome: true });
            if (featuredCount >= 3) {
                return NextResponse.json(
                    { error: "Max 3 featured blogs allowed. Pehle kisi aur ko un-feature karo." },
                    { status: 400 }
                );
            }
        }

        const updated = await Blog.findByIdAndUpdate(
            id,
            { featuredOnHome, updatedAt: new Date() },
            { new: true }
        );

        if (!updated) {
            return NextResponse.json({ error: "Blog not found." }, { status: 404 });
        }

        return NextResponse.json({ success: true, blog: updated });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
