import mongoose from "mongoose";

// 🛑 SECURITY UPDATE: Link ko direct likhne ke bajaye .env file se get kar rahe hain
const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("Bhai, .env file mein MONGODB_URI missing hai! Fauran add karo.");
}

// 👇 Ye caching logic zaroori hai Next.js/Vercel k liye, warna "Too Many Connections" ka error ayega
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

// 👇 Note: Humne "export const" use kia hai (Default nahi)
export const connectDB = async () => {
  if (cached.conn) {
    console.log("🚀 Using Existing Database Connection");
    return cached.conn;
  }

  if (!cached.promise) {
    console.log("⚡ Connecting to MongoDB...");
    
    // 👇 UPDATE: maxPoolSize add kiya hai taake Vercel achanak se limit cross na kare
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10, // Traffic Police: Ek waqt mein sirf 10 active connections banenge
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log("✅ KAMAAL HO GAYA! Database Connected!");
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null; // Agar error aaye toh promise reset kardo
    console.log("❌ Connection Failed:", e);
    throw e;
  }

  return cached.conn;
};