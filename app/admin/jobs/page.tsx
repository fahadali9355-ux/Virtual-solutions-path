"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Save,
  Briefcase,
  AlertCircle,
  CheckCircle2,
  XCircle,
} from "lucide-react";

interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  description: string;
  requirements: string[];
  applyLink: string;
  isActive: boolean;
  postedAt: string;
}

const JOB_TYPES = ["Full-time", "Part-time", "Internship", "Contract", "Freelance"];

const EMPTY_FORM = {
  title: "",
  company: "",
  location: "Remote",
  type: "Full-time",
  description: "",
  requirements: "",
  applyLink: "",
  isActive: true,
};

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchJobs = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/jobs");
    const data = await res.json();
    setJobs(data.jobs || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const openAdd = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setError("");
    setShowModal(true);
  };

  const openEdit = (j: Job) => {
    setEditingId(j._id);
    setForm({
      title: j.title,
      company: j.company,
      location: j.location,
      type: j.type,
      description: j.description,
      requirements: j.requirements.join(", "),
      applyLink: j.applyLink,
      isActive: j.isActive,
    });
    setError("");
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.company || !form.description) {
      setError("Title, company, and description are required.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const method = editingId ? "PUT" : "POST";
      const payload = {
        ...(editingId ? { id: editingId } : {}),
        ...form,
        requirements: form.requirements
          ? form.requirements.split(",").map((r) => r.trim()).filter(Boolean)
          : [],
      };
      const res = await fetch("/api/admin/jobs", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save.");
      setShowModal(false);
      fetchJobs();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this job posting? This cannot be undone.")) return;
    setDeletingId(id);
    await fetch("/api/admin/jobs", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setDeletingId(null);
    fetchJobs();
  };

  const toggleActive = async (j: Job) => {
    await fetch("/api/admin/jobs", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: j._id, isActive: !j.isActive }),
    });
    fetchJobs();
  };

  const typeBadge = (type: string) => {
    const map: Record<string, string> = {
      "Full-time": "bg-blue-50 text-blue-600",
      "Part-time": "bg-purple-50 text-purple-600",
      Internship: "bg-amber-50 text-amber-600",
      Contract: "bg-teal-50 text-teal-600",
      Freelance: "bg-rose-50 text-rose-600",
    };
    return map[type] || "bg-slate-100 text-slate-500";
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-[#082F49] flex items-center gap-2">
            <Briefcase size={26} /> Job Opportunities
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage career opportunities shown on the public Career Hub page.
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-[#082F49] text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-[#0C4A6E] transition-colors shadow"
        >
          <Plus size={16} /> Post a Job
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl h-16 animate-pulse border border-slate-100" />
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-2xl border border-slate-100">
          <Briefcase className="mx-auto text-slate-300 mb-3" size={48} />
          <p className="text-slate-400 font-medium">No job postings yet.</p>
          <button
            onClick={openAdd}
            className="mt-4 text-sm text-blue-600 hover:underline font-semibold"
          >
            Post the first opportunity →
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="text-left px-6 py-3.5 font-semibold text-slate-500">Job Title</th>
                <th className="text-left px-4 py-3.5 font-semibold text-slate-500 hidden md:table-cell">Company</th>
                <th className="text-left px-4 py-3.5 font-semibold text-slate-500 hidden lg:table-cell">Type</th>
                <th className="text-left px-4 py-3.5 font-semibold text-slate-500 hidden lg:table-cell">Location</th>
                <th className="text-left px-4 py-3.5 font-semibold text-slate-500">Status</th>
                <th className="text-right px-6 py-3.5 font-semibold text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {jobs.map((j) => (
                <tr key={j._id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-[#082F49]">
                    {j.title}
                    <div className="text-xs text-slate-400 font-normal mt-0.5">
                      {new Date(j.postedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                  </td>
                  <td className="px-4 py-4 hidden md:table-cell text-slate-600">{j.company}</td>
                  <td className="px-4 py-4 hidden lg:table-cell">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${typeBadge(j.type)}`}>
                      {j.type}
                    </span>
                  </td>
                  <td className="px-4 py-4 hidden lg:table-cell text-slate-500">{j.location}</td>
                  <td className="px-4 py-4">
                    <button
                      onClick={() => toggleActive(j)}
                      title={j.isActive ? "Click to deactivate" : "Click to activate"}
                      className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full transition-colors ${
                        j.isActive
                          ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                          : "bg-slate-100 text-slate-400 hover:bg-slate-200"
                      }`}
                    >
                      {j.isActive ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                      {j.isActive ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEdit(j)}
                        className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        title="Edit"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(j._id)}
                        disabled={deletingId === j._id}
                        className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                        title="Delete"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <h2 className="font-extrabold text-[#082F49] text-lg">
                {editingId ? "Edit Job" : "Post New Job"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {error && (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm font-medium">
                  <AlertCircle size={16} /> {error}
                </div>
              )}
              {(
                [
                  { label: "Job Title *", key: "title", type: "text" },
                  { label: "Company Name *", key: "company", type: "text" },
                  { label: "Location", key: "location", type: "text" },
                  { label: "Apply Link", key: "applyLink", type: "url" },
                ] as const
              ).map((f) => (
                <div key={f.key}>
                  <label className="block text-sm font-semibold text-slate-600 mb-1.5">
                    {f.label}
                  </label>
                  <input
                    type={f.type}
                    value={(form as any)[f.key]}
                    onChange={(e) => setForm((prev) => ({ ...prev, [f.key]: e.target.value }))}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ))}

              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1.5">
                  Employment Type
                </label>
                <select
                  value={form.type}
                  onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  {JOB_TYPES.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1.5">
                  Job Description *
                </label>
                <textarea
                  rows={4}
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1.5">
                  Requirements{" "}
                  <span className="font-normal text-slate-400">(comma-separated)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. React, Node.js, 1 year experience"
                  value={form.requirements}
                  onChange={(e) => setForm((f) => ({ ...f, requirements: e.target.value }))}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <label className="flex items-center gap-3 cursor-pointer select-none">
                <div
                  onClick={() => setForm((f) => ({ ...f, isActive: !f.isActive }))}
                  className={`w-11 h-6 rounded-full transition-colors relative ${
                    form.isActive ? "bg-emerald-500" : "bg-slate-300"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      form.isActive ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </div>
                <span className="text-sm font-semibold text-slate-600">
                  Show publicly on Career Hub
                </span>
              </label>
            </div>

            <div className="px-6 pb-6 flex gap-3 justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#082F49] text-white text-sm font-bold hover:bg-[#0C4A6E] transition-colors shadow disabled:opacity-60"
              >
                <Save size={15} /> {saving ? "Saving…" : "Save Job"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
