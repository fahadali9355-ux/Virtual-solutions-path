"use client";

import { useEffect, useState } from "react";
import { Loader2, Edit, Save, X, Trash2, Search } from "lucide-react";

export default function AllStudentsPage() {
    const [students, setStudents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    // Editing States
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingCourseSlug, setEditingCourseSlug] = useState<string>("");

    // Form Values
    const [tempPaid, setTempPaid] = useState<number>(0);
    const [tempTotal, setTempTotal] = useState<number>(0);

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const res = await fetch("/api/admin/students");
            const data = await res.json();
            if (data.users && Array.isArray(data.users)) {
                setStudents(data.users);
            } else {
                setStudents([]);
            }
        } catch (error) {
            console.error("Error fetching students", error);
        } finally {
            setLoading(false);
        }
    };

    // 👇 DELETE FUNCTION
    const handleDelete = async (studentId: string, studentName: string) => {
        if (!confirm(`⚠️ Are you sure you want to delete "${studentName}"?\n\nThis cannot be undone!`)) return;

        try {
            const res = await fetch("/api/admin/student/delete", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ studentId })
            });

            if (res.ok) {
                setStudents(prev => prev.filter(s => s._id !== studentId));
            } else {
                alert("Failed to delete.");
            }
        } catch (error) { alert("Server Error"); }
    };

    // 👇 EDIT START
    const startEditing = (studentId: string, enrollment: any) => {
        setEditingId(studentId);
        setEditingCourseSlug(enrollment.courseSlug);
        setTempPaid(enrollment.paidAmount);
        setTempTotal(enrollment.actualCourseFee); // 👈 Ab ye Real Course Price uthayega
    };

    // 👇 SAVE FEE CHANGES
    const saveFee = async () => {
        try {
            const res = await fetch("/api/admin/update-fee", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: editingId,
                    courseSlug: editingCourseSlug,
                    newPaidAmount: tempPaid,
                    newTotalFee: tempTotal
                })
            });

            if (res.ok) {
                setEditingId(null);
                fetchStudents(); // Refresh Data
            } else {
                alert("Update Failed");
            }
        } catch (error) { alert("Server Error"); }
    };

    // Filter Logic
    const filteredStudents = students.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.phone && s.phone.includes(searchTerm))
    );

    // Check if student is new (registered within the last 7 days)
    const isNewStudent = (dateString?: string) => {
        if (!dateString) return false;
        const createdAt = new Date(dateString);
        const now = new Date();
        const diffInTime = now.getTime() - createdAt.getTime();
        const diffInDays = diffInTime / (1000 * 3600 * 24);
        return diffInDays <= 7;
    };

    if (loading) return <div className="p-10 flex items-center gap-2"><Loader2 className="animate-spin text-blue-600" /> Loading Students...</div>;

    return (
        <div className="p-6 space-y-6">

            {/* Header & Search */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h1 className="text-2xl font-bold text-slate-800">Student Management</h1>
                <div className="relative w-full md:w-auto">
                    <Search className="absolute left-3 top-3 text-slate-400" size={16} />
                    <input
                        type="text"
                        placeholder="Search student by name, email, or phone..."
                        className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 w-full md:w-80"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-white rounded-xl shadow border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto w-full">
                    <table className="w-full min-w-[900px] text-left text-sm text-slate-600">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-800 font-bold uppercase text-xs">
                            <tr>
                                <th className="p-4">Student Info</th>
                                <th className="p-4">Enrolled Course</th>
                                <th className="p-4">Fee Status (Paid / Course Fee)</th>
                                <th className="p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredStudents.length === 0 ? (
                                <tr><td colSpan={4} className="p-8 text-center text-slate-400">No students found.</td></tr>
                            ) : (
                                filteredStudents.map((student) => {

                                    // CASE 1: Student registered but NO payment/enrollment
                                    if (!student.enrollments || student.enrollments.length === 0) {
                                        return (
                                            <tr key={student._id} className="hover:bg-slate-50">
                                                <td className="p-4">
                                                    <div className="font-bold text-slate-800 flex items-center gap-2">
                                                        {student.name}
                                                        {isNewStudent(student.createdAt) && (
                                                            <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">New</span>
                                                        )}
                                                    </div>
                                                    <div className="text-xs text-slate-500">{student.email}</div>
                                                    {student.phone && <div className="text-xs text-blue-600 font-medium font-mono mt-0.5">{student.phone}</div>}
                                                </td>
                                                <td className="p-4 italic text-slate-400">Not Enrolled</td>
                                                <td className="p-4"><span className="bg-slate-100 text-slate-500 text-xs px-2 py-1 rounded">Unpaid</span></td>
                                                <td className="p-4">
                                                    <button onClick={() => handleDelete(student._id, student.name)} className="text-red-500 bg-red-50 p-2 rounded hover:bg-red-100">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    }

                                    // CASE 2: Student has enrollments (Loop through them)
                                    return student.enrollments.map((enrollment: any, idx: number) => {
                                        const isEditing = editingId === student._id && editingCourseSlug === enrollment.courseSlug;
                                        const isPaidFull = enrollment.paidAmount >= enrollment.actualCourseFee;

                                        return (
                                            <tr key={`${student._id}-${idx}`} className="hover:bg-slate-50">
                                                {/* Student Name (Only on first row logic removed for simplicity, showing on all for clarity) */}
                                                <td className="p-4 align-top">
                                                    <div className="font-bold text-slate-800 flex items-center gap-2">
                                                        {student.name}
                                                        {isNewStudent(student.createdAt) && (
                                                            <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">New</span>
                                                        )}
                                                    </div>
                                                    <div className="text-xs text-slate-500">{student.email}</div>
                                                    {student.phone && <div className="text-xs text-blue-600 font-medium font-mono mt-0.5">{student.phone}</div>}
                                                </td>

                                                {/* Course Name */}
                                                <td className="p-4 align-top">
                                                    <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md text-xs font-bold border border-blue-100">
                                                        {enrollment.courseTitle}
                                                    </span>
                                                </td>

                                                {/* Fee Section */}
                                                <td className="p-4 align-top">
                                                    {isEditing ? (
                                                        <div className="flex flex-col gap-2 bg-slate-100 p-3 rounded border border-blue-200 shadow-sm animate-in fade-in">
                                                            <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                                                                <span>Paid:</span>
                                                                <input type="number" value={tempPaid} onChange={e => setTempPaid(Number(e.target.value))} className="w-20 p-1 border rounded text-black" />
                                                            </div>
                                                            <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                                                                <span>Total Fee:</span>
                                                                <input type="number" value={tempTotal} onChange={e => setTempTotal(Number(e.target.value))} className="w-20 p-1 border rounded text-black" />
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div>
                                                            <span className={isPaidFull ? "text-green-600 font-bold text-lg" : "text-orange-600 font-bold text-lg"}>
                                                                {enrollment.paidAmount.toLocaleString()}
                                                            </span>
                                                            <span className="text-xs text-slate-400 mx-1">/</span>
                                                            <span className="text-sm text-slate-500 font-medium">
                                                                {(enrollment.actualCourseFee || 0).toLocaleString()}
                                                            </span>

                                                            {!isPaidFull && (
                                                                <div className="text-[10px] text-orange-500 font-bold mt-1">Pending: {((enrollment.actualCourseFee || 0) - (enrollment.paidAmount || 0)).toLocaleString()}</div>
                                                            )}
                                                        </div>
                                                    )}
                                                </td>

                                                {/* Actions */}
                                                <td className="p-4 align-top">
                                                    {isEditing ? (
                                                        <div className="flex gap-2">
                                                            <button onClick={saveFee} className="bg-green-600 text-white p-1.5 rounded hover:bg-green-700 shadow" title="Save"><Save size={16} /></button>
                                                            <button onClick={() => setEditingId(null)} className="bg-gray-300 text-gray-700 p-1.5 rounded hover:bg-gray-400" title="Cancel"><X size={16} /></button>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center gap-2">
                                                            <button onClick={() => startEditing(student._id, enrollment)} className="flex items-center gap-1 text-blue-600 border border-blue-200 px-3 py-1.5 rounded hover:bg-blue-50 text-xs font-bold transition-colors">
                                                                <Edit size={14} /> Edit Fee
                                                            </button>
                                                            <button onClick={() => handleDelete(student._id, student.name)} className="text-red-500 bg-red-50 p-1.5 rounded hover:bg-red-100 transition-colors" title="Delete Student">
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    });
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}