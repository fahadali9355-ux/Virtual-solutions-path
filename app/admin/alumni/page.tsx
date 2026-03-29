"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Save,
  GraduationCap,
  Eye,
  EyeOff,
  AlertCircle,
} from "lucide-react";

interface Alumni {
  _id: string;
  name: string;
  email: string;
  phone: string;
  certificationTitle: string;
  graduationYear: number;
  profileImage: string;
  linkedIn: string;
  bio: string;
  isPublic: boolean;
}

const EMPTY_FORM = {
  name: "",
  email: "",
  phone: "",
  certificationTitle: "",
  graduationYear: new Date().getFullYear(),
  profileImage: "",
  linkedIn: "",
  bio: "",
  isPublic: true,
};

export default function AdminAlumniPage() {
  const [alumni, setAlumni] = useState<Alumni[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchAlumni = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/alumni");
    const data = await res.json();
    setAlumni(data.alumni || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchAlumni();
  }, []);

  const openAdd = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setError("");
    setShowModal(true);
  };

  const openEdit = (a: Alumni) => {
    setEditingId(a._id);
    setForm({
      name: a.name,
      email: a.email,
      phone: a.phone,
      certificationTitle: a.certificationTitle,
      graduationYear: a.graduationYear,
      profileImage: a.profileImage,
      linkedIn: a.linkedIn,
      bio: a.bio,
      isPublic: a.isPublic,
    });
    setError("");
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.email || !form.certificationTitle) {
      setError("Name, email, and certification title are required.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const method = editingId ? "PUT" : "POST";
      const body = editingId ? { id: editingId, ...form } : form;
      const res = await fetch("/api/admin/alumni", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save.");
      setShowModal(false);
      fetchAlumni();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this alumni record? This cannot be undone.")) return;
    setDeletingId(id);
    await fetch("/api/admin/alumni", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setDeletingId(null);
    fetchAlumni();
  };

  const togglePublic = async (a: Alumni) => {
    await fetch("/api/admin/alumni", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: a._id, isPublic: !a.isPublic }),
    });
    fetchAlumni();
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-[#082F49] flex items-center gap-2">
            <GraduationCap size={26} /> Alumni Directory
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage certified students displayed on the public Career Hub page.
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-[#082F49] text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-[#0C4A6E] transition-colors shadow"
        >
          <Plus size={16} /> Add Alumni
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl h-16 animate-pulse border border-slate-100" />
          ))}
        </div>
      ) : alumni.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-2xl border border-slate-100">
          <GraduationCap className="mx-auto text-slate-300 mb-3" size={48} />
          <p className="text-slate-400 font-medium">No alumni records yet.</p>
          <button
            onClick={openAdd}
            className="mt-4 text-sm text-blue-600 hover:underline font-semibold"
          >
            Add the first one →
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="text-left px-6 py-3.5 font-semibold text-slate-500">Name</th>
                <th className="text-left px-4 py-3.5 font-semibold text-slate-500 hidden md:table-cell">Certification</th>
                <th className="text-left px-4 py-3.5 font-semibold text-slate-500 hidden lg:table-cell">Email</th>
                <th className="text-left px-4 py-3.5 font-semibold text-slate-500 hidden lg:table-cell">Phone</th>
                <th className="text-left px-4 py-3.5 font-semibold text-slate-500">Visible</th>
                <th className="text-right px-6 py-3.5 font-semibold text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {alumni.map((a) => (
                <tr key={a._id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-[#082F49]">
                    {a.name}
                    <div className="text-xs text-slate-400 font-normal">{a.graduationYear}</div>
                  </td>
                  <td className="px-4 py-4 hidden md:table-cell text-slate-600">{a.certificationTitle}</td>
                  <td className="px-4 py-4 hidden lg:table-cell text-slate-500">{a.email}</td>
                  <td className="px-4 py-4 hidden lg:table-cell text-slate-500">{a.phone || "—"}</td>
                  <td className="px-4 py-4">
                    <button
                      onClick={() => togglePublic(a)}
                      title={a.isPublic ? "Click to hide" : "Click to show"}
                      className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full transition-colors ${
                        a.isPublic
                          ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                          : "bg-slate-100 text-slate-400 hover:bg-slate-200"
                      }`}
                    >
                      {a.isPublic ? <Eye size={12} /> : <EyeOff size={12} />}
                      {a.isPublic ? "Public" : "Hidden"}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEdit(a)}
                        className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        title="Edit"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(a._id)}
                        disabled={deletingId === a._id}
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
                {editingId ? "Edit Alumni" : "Add New Alumni"}
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
                  { label: "Full Name *", key: "name", type: "text" },
                  { label: "Email Address *", key: "email", type: "email" },
                  { label: "Phone Number", key: "phone", type: "tel" },
                  { label: "Certification Title *", key: "certificationTitle", type: "text" },
                  { label: "Graduation Year", key: "graduationYear", type: "number" },
                  { label: "Profile Image URL", key: "profileImage", type: "url" },
                  { label: "LinkedIn Profile URL", key: "linkedIn", type: "url" },
                ] as const
              ).map((field) => (
                <div key={field.key}>
                  <label className="block text-sm font-semibold text-slate-600 mb-1.5">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    value={(form as any)[field.key]}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        [field.key]:
                          field.type === "number"
                            ? Number(e.target.value)
                            : e.target.value,
                      }))
                    }
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ))}

              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1.5">
                  Short Bio
                </label>
                <textarea
                  rows={3}
                  value={form.bio}
                  onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <label className="flex items-center gap-3 cursor-pointer select-none">
                <div
                  onClick={() => setForm((f) => ({ ...f, isPublic: !f.isPublic }))}
                  className={`w-11 h-6 rounded-full transition-colors relative ${
                    form.isPublic ? "bg-emerald-500" : "bg-slate-300"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      form.isPublic ? "translate-x-5" : "translate-x-0"
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
                <Save size={15} /> {saving ? "Saving…" : "Save Alumni"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
