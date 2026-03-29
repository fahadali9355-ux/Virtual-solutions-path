import mongoose from "mongoose";

const AlumniSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    phone: { type: String, default: "" },
    certificationTitle: { type: String, required: true, trim: true },
    graduationYear: { type: Number, default: new Date().getFullYear() },
    profileImage: { type: String, default: "" },
    linkedIn: { type: String, default: "" },
    isPublic: { type: Boolean, default: true }, // controls visibility in public directory
    bio: { type: String, default: "" },
  },
  { timestamps: true }
);

const Alumni =
  mongoose.models.Alumni || mongoose.model("Alumni", AlumniSchema);

export default Alumni;
