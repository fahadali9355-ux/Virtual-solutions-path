import mongoose from "mongoose";

const JobOpportunitySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    location: { type: String, default: "Remote" },
    type: {
      type: String,
      enum: ["Full-time", "Part-time", "Internship", "Contract", "Freelance"],
      default: "Full-time",
    },
    description: { type: String, required: true },
    requirements: { type: [String], default: [] },
    applyLink: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
    postedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const JobOpportunity =
  mongoose.models.JobOpportunity ||
  mongoose.model("JobOpportunity", JobOpportunitySchema);

export default JobOpportunity;
