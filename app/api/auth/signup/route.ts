import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { sendEmail } from "@/lib/sendEmail"; // 👈 New Helper Import kia

export async function POST(req: Request) {
  try {
    const { name, email, password, phone } = await req.json();
    await connectDB();

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate 6-Digit Verification Code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Create User (isVerified: false)
    await User.create({
      name,
      email,
      password: hashedPassword,
      phone: phone || "", // Save phone number if provided
      isVerified: false, // Abhi verify nahi hua
      verificationCode,
      verificationCodeExpire: Date.now() + 10 * 60 * 1000, // 10 Minutes expiry
    });

    // Send Professional Email
    await sendEmail({
      to: email,
      subject: "Verify Your Account - VSP",
      text: `Hello ${name}, welcome to Virtual Solution Path! Please use the code below to verify your account.`,
      code: verificationCode,
    });

    return NextResponse.json({ message: "Signup successful! Check email for code." });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}