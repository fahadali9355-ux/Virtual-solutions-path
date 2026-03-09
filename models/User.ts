import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Made optional for Google Auth users
  provider: { type: String, default: "local" }, // "local" or "google"
  role: { type: String, default: "student" },
  enrolledCourses: { type: [String], default: [] },
  resetPasswordToken: { type: String },
  resetPasswordExpire: { type: Date },
  phone: { type: String, default: "" },
  image: { type: String, default: "" },
  isVerified: { type: Boolean, default: false, },
  verificationCode: String,
  verificationCodeExpire: Date,
  feeRecords: [{ courseSlug: String, totalFee: Number, paidAmount: Number, discount: { type: Number, default: 0 } }]
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;