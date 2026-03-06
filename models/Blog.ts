import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    author: { type: String, default: "VSP Admin" },
    category: { type: String, required: true },
    coverImage: { type: String, default: "" },
    excerpt: { type: String, required: true }, // Short description
    content: { type: String, required: true }, // Full article body
    tags: { type: [String], default: [] },
    published: { type: Boolean, default: false },
    featuredOnHome: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

const Blog = mongoose.models.Blog || mongoose.model("Blog", BlogSchema);
export default Blog;
