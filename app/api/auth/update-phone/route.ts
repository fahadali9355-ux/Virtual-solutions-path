import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function POST(req: Request) {
    try {
        const { email, phone } = await req.json();

        if (!email || !phone) {
            return NextResponse.json({ error: "Email and phone number are required" }, { status: 400 });
        }

        await connectDB();

        // Find user and update phone
        const updatedUser = await User.findOneAndUpdate(
            { email },
            { phone },
            { new: true }
        );

        if (!updatedUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Phone number updated successfully" }, { status: 200 });

    } catch (error: any) {
        console.error("Update Phone Error:", error);
        return NextResponse.json({ error: "Failed to update phone number" }, { status: 500 });
    }
}
