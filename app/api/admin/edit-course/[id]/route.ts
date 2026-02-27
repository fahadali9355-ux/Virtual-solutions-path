import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Course from "@/models/Course";
import { v2 as cloudinary } from "cloudinary";

// Cloudinary Config
cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// GET: Single course fetch karo (edit form fill karne ke liye)
export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await context.params;
        await connectDB();
        const course = await Course.findById(id);
        if (!course) {
            return NextResponse.json({ error: "Course not found" }, { status: 404 });
        }
        return NextResponse.json({ course });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// PUT: Course update karo
export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await context.params;
        const formData = await req.formData();

        const title = formData.get("title") as string;
        const slug = formData.get("slug") as string;
        const category = formData.get("category") as string;
        const price = formData.get("price") as string;
        const duration = formData.get("duration") as string;
        const lessons = formData.get("lessons") as string;
        const desc = formData.get("desc") as string;
        const curriculumString = formData.get("curriculum") as string;
        const learningString = formData.get("learningPoints") as string;
        const imageFile = formData.get("image") as File | null;

        await connectDB();

        // Learning points array mein convert karo
        let learningPoints: string[] = [];
        if (learningString) {
            learningPoints = learningString.split(",").map((p) => p.trim()).filter((p) => p !== "");
        }

        // Curriculum parse karo
        let curriculum: string[] = [];
        try {
            curriculum = JSON.parse(curriculumString);
        } catch (e) {
            curriculum = [];
        }

        // Base update data
        const updateData: any = {
            title,
            slug,
            category,
            price,
            duration,
            lessons,
            desc,
            learningPoints,
            curriculum,
        };

        // Agar naya image upload kiya hai toh Cloudinary pe upload karo
        if (imageFile && imageFile.size > 0) {
            const arrayBuffer = await imageFile.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            const uploadResponse: any = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    { folder: "vsp_courses" },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                ).end(buffer);
            });

            updateData.image = uploadResponse.secure_url;
        }

        const updatedCourse = await Course.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedCourse) {
            return NextResponse.json({ error: "Course not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Course Updated Successfully!", course: updatedCourse });
    } catch (error: any) {
        console.error("Edit Course Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
