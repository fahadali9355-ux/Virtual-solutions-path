import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function POST(req: Request) {
    try {
        const { name, email, image } = await req.json();

        if (!email || !name) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        await connectDB();

        // Check if user already exists
        let user = await User.findOne({ email });

        if (user) {
            // User exists - Login
            // If they originally signed up with local email/password, we still let them log in
            // Optionally update their picture if they didn't have one
            if (!user.image && image) {
                user.image = image;
                await user.save();
            }

            return NextResponse.json({
                message: "Login Successful",
                user: {
                    name: user.name,
                    email: user.email,
                    role: user.role || "student",
                    image: user.image || "",
                    hasPhone: !!user.phone
                },
            }, { status: 200 });

        } else {
            // User doesn't exist - Sign Up (Create new user)
            user = await User.create({
                name,
                email,
                image: image || "",
                provider: "google",
                isVerified: true, // Google emails are already verified
                // No password needed
            });

            return NextResponse.json({
                message: "Signup Successful",
                user: {
                    name: user.name,
                    email: user.email,
                    role: user.role || "student",
                    image: user.image || "",
                    hasPhone: false // New user, definitely no phone yet
                },
            }, { status: 201 });
        }

    } catch (error: any) {
        console.error("Google Auth Error:", error);
        return NextResponse.json({ error: "Authentication failed. Please try again." }, { status: 500 });
    }
}
