"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { ArrowLeft, Edit, Trash2, CheckCircle2, Copy, Loader2, Save, XCircle } from "lucide-react";
import { toast } from "sonner";
import { programs } from "@/lib/contents/programs-data";

export default function StudentDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const { id } = params;

    const [student, setStudent] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeactivating, setIsDeactivating] = useState(false);

    // Form state mirrors student state but is editable
    const [formData, setFormData] = useState({});

    useEffect(() => {
        const fetchStudent = async () => {
            try {
                const res = await fetch(`/api/admin/students/${id}`);
                const json = await res.json();
                if (res.ok) {
                    setStudent(json.data);
                    setFormData(json.data);
                } else {
                    toast.error(json.error || "Failed to load profile");
                    router.push("/admin/students");
                }
            } catch (error) {
                toast.error("Network error");
            } finally {
                setIsLoading(false);
            }
        };
        fetchStudent();
    }, [id, router]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const res = await fetch(`/api/admin/students/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });
            const json = await res.json();
            if (res.ok) {
                toast.success("Profile saved securely");
                setStudent(json.data);
                setIsEditing(false);
            } else {
                toast.error(json.error || "Failed to save profile");
            }
        } catch (error) {
            toast.error("Network error");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeactivate = async () => {
        if (!confirm(`Are you sure you want to archive ${student.full_name}? They will be removed from Active displays.`)) return;

        setIsDeactivating(true);
        try {
            const res = await fetch(`/api/admin/students/${id}`, {
                method: "DELETE"
            });
            if (res.ok) {
                toast.success("Profile permanently archived");
                router.push("/admin/students");
            } else {
                toast.error("Failed to archive profile");
                setIsDeactivating(false);
            }
        } catch (error) {
            toast.error("Network error");
            setIsDeactivating(false);
        }
    };

    const copyId = () => {
        navigator.clipboard.writeText(student.student_id);
        toast.success("WTG ID Copied");
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                <p className="text-gray-400">Loading student profile...</p>
            </div>
        );
    }

    if (!student) return null;

    return (
        <div className="max-w-5xl mx-auto space-y-6 pb-12">
            {/* Header Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-4">
                    <Link href="/admin/students" className="w-10 h-10 rounded-xl bg-[#111623] border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 transition-all">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-white mb-1">Student Details</h1>
                        <p className="text-sm text-gray-400">View and manage the ledger profile for this student.</p>
                    </div>
                </div>

                {!isEditing && (
                    <div className="flex gap-3">
                        <button onClick={() => setIsEditing(true)} className="h-10 px-4 py-2 bg-[#111623] border border-white/10 hover:bg-white/5 rounded-lg text-sm font-medium text-white transition-all flex items-center gap-2">
                            <Edit className="w-4 h-4" /> Edit Profile
                        </button>
                        <button onClick={handleDeactivate} disabled={isDeactivating} className="h-10 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg text-sm font-medium transition-all flex items-center gap-2">
                            {isDeactivating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />} Archive
                        </button>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Col: Identity Card */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-[#0a0e17]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-6 shadow-xl flex flex-col items-center text-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl"></div>

                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-3xl font-bold text-white shadow-xl shadow-blue-500/20 mb-4 ring-4 ring-[#0a0e17]">
                            {student.full_name.charAt(0).toUpperCase()}
                        </div>

                        <h2 className="text-xl font-bold text-white mb-1">{student.full_name}</h2>

                        <div className="flex items-center gap-2 mb-4">
                            <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                                {student.student_id}
                            </span>
                            <button onClick={copyId} className="p-1.5 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-md transition-colors">
                                <Copy className="w-3.5 h-3.5" />
                            </button>
                        </div>

                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs uppercase tracking-wider font-bold rounded-full mb-6
                            ${student.status === 'active' ? 'text-blue-400 bg-blue-400/10' : 'text-gray-400 bg-gray-400/10'}`}>
                            {student.status === 'active' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                            {student.status}
                        </span>

                        <div className="w-full text-left space-y-4 pt-6 border-t border-white/5">
                            <div>
                                <div className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1">Program</div>
                                <div className="text-sm font-medium text-gray-200">{student.program}</div>
                            </div>
                            <div>
                                <div className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1">Registration Date</div>
                                <div className="text-sm text-gray-300">{new Date(student.registration_date).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                            </div>
                            <div>
                                <div className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1">Learning Mode</div>
                                <div className="text-sm text-gray-300">{student.learning_mode || "Not specified"}</div>
                            </div>
                            <div className="space-y-1 pt-2 border-t border-white/5">
                                <div className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1">Duration</div>
                                <div className="text-xs text-blue-400 font-mono bg-blue-500/10 px-3 py-1.5 rounded-lg border border-blue-500/20 inline-flex items-center gap-2">
                                    {student.start_date ? new Date(student.start_date).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' }) : "TBA"}
                                    <span className="text-gray-500">→</span>
                                    {student.end_date ? new Date(student.end_date).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' }) : "TBA"}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Col: Details / Form */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-[#0a0e17]/80 backdrop-blur-xl border border-white/5 rounded-2xl shadow-xl overflow-hidden">
                        <div className="p-6 border-b border-white/5 bg-white/[0.02]">
                            <h2 className="text-lg font-bold text-white">Full Profile Details</h2>
                        </div>

                        {isEditing ? (
                            <form onSubmit={handleSave} className="p-6 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-semibold text-gray-300">Full Name</label>
                                        <input required type="text" name="full_name" value={formData.full_name} onChange={handleChange} className="w-full bg-[#111623] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all shadow-inner" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-semibold text-gray-300">Phone</label>
                                        <input required type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-[#111623] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all shadow-inner" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-semibold text-gray-300">Email Address</label>
                                        <input type="email" name="email" value={formData.email || ""} onChange={handleChange} className="w-full bg-[#111623] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all shadow-inner" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-semibold text-gray-300">Program</label>
                                        <select required name="program" value={formData.program} onChange={handleChange} className="w-full bg-[#111623] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all shadow-inner appearance-none cursor-pointer">
                                            <option value="" disabled>Select a Program...</option>
                                            {programs.map((prog, idx) => (
                                                <option key={idx} value={prog.title}>{prog.title}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-semibold text-gray-300">Status</label>
                                        <select name="status" value={formData.status} onChange={handleChange} className="w-full bg-[#111623] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all shadow-inner">
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                            <option value="suspended">Suspended</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-semibold text-gray-300">Gender</label>
                                        <input type="text" name="gender" value={formData.gender || ""} onChange={handleChange} className="w-full bg-[#111623] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:border-blue-500/50 transition-all shadow-inner" />
                                    </div>
                                    <div className="space-y-1.5 md:col-span-2">
                                        <label className="text-sm font-semibold text-gray-300">Address</label>
                                        <input type="text" name="address" value={formData.address || ""} onChange={handleChange} className="w-full bg-[#111623] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:border-blue-500/50 transition-all shadow-inner" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-semibold text-gray-300">Registration Date</label>
                                        <input type="date" name="registration_date" value={formData.registration_date ? formData.registration_date.split('T')[0] : ""} onChange={handleChange} className="w-full bg-[#111623] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-400 focus:text-gray-200 focus:border-blue-500/50 transition-all shadow-inner [color-scheme:dark]" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-semibold text-gray-300">Amount Paid (NGN)</label>
                                        <input type="number" name="amount_paid" value={formData.amount_paid || 0} onChange={handleChange} className="w-full bg-[#111623] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:border-blue-500/50 transition-all shadow-inner" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-semibold text-gray-300">Payment Status</label>
                                        <select name="payment_status" value={formData.payment_status || "Unpaid"} onChange={handleChange} className="w-full bg-[#111623] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:border-blue-500/50 transition-all shadow-inner">
                                            <option>Unpaid</option>
                                            <option>Part Payment</option>
                                            <option>Full Payment</option>
                                            <option>Scholarship</option>
                                        </select>
                                    </div>
                                    {formData.payment_status === "Part Payment" && (
                                        <div className="space-y-1.5 md:col-span-2">
                                            <label className="text-sm font-semibold text-orange-300">Outstanding Balance (NGN)</label>
                                            <input type="number" name="balance" value={formData.balance || 0} onChange={handleChange} className="w-full bg-[#111623] border border-orange-500/30 rounded-xl px-4 py-2.5 text-sm text-orange-200 focus:border-orange-500/50 transition-all shadow-inner" />
                                        </div>
                                    )}
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-semibold text-gray-300">Start Date</label>
                                        <input type="date" name="start_date" value={formData.start_date ? formData.start_date.split('T')[0] : ""} onChange={handleChange} className="w-full bg-[#111623] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-400 focus:text-gray-200 focus:border-blue-500/50 transition-all shadow-inner [color-scheme:dark]" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-semibold text-gray-300">End Date</label>
                                        <input type="date" name="end_date" value={formData.end_date ? formData.end_date.split('T')[0] : ""} onChange={handleChange} className="w-full bg-[#111623] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-400 focus:text-gray-200 focus:border-blue-500/50 transition-all shadow-inner [color-scheme:dark]" />
                                    </div>
                                </div>
                                <div className="border-t border-white/5 pt-6 flex justify-end gap-3">
                                    <button type="button" onClick={() => { setIsEditing(false); setFormData(student); }} className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
                                        Cancel
                                    </button>
                                    <button type="submit" disabled={isSaving} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-xl shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all flex items-center gap-2">
                                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Changes
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-6">
                                    <div>
                                        <div className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Phone Number</div>
                                        <div className="text-sm font-medium text-gray-200">{student.phone}</div>
                                    </div>
                                    <div>
                                        <div className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Email Address</div>
                                        <div className="text-sm font-medium text-gray-200">{student.email || <span className="text-gray-600 italic">No email provided</span>}</div>
                                    </div>
                                    <div>
                                        <div className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Gender</div>
                                        <div className="text-sm font-medium text-gray-200">{student.gender || <span className="text-gray-600 italic">Prefer not to say</span>}</div>
                                    </div>
                                    <div>
                                        <div className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Date of Birth</div>
                                        <div className="text-sm font-medium text-gray-200">{student.date_of_birth ? new Date(student.date_of_birth).toLocaleDateString() : <span className="text-gray-600 italic">Not provided</span>}</div>
                                    </div>
                                    <div className="md:col-span-2">
                                        <div className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Residential Address</div>
                                        <div className="text-sm font-medium text-gray-200 bg-white/5 p-4 rounded-xl border border-white/5">{student.address || <span className="text-gray-600 italic">No physical address on record</span>}</div>
                                    </div>
                                    <div className="md:col-span-2 pt-4 border-t border-white/5 grid grid-cols-2 gap-4">
                                        <div>
                                            <div className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Amount Paid</div>
                                            <div className="text-lg font-bold text-emerald-400">₦{student.amount_paid?.toLocaleString() || 0}</div>
                                        </div>
                                        <div>
                                            <div className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Payment Status</div>
                                            <div className="text-sm font-medium text-gray-200 inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 rounded-lg">
                                                {student.payment_status || "Unpaid"}
                                            </div>
                                        </div>
                                        {student.payment_status === "Part Payment" && (
                                            <div className="col-span-2">
                                                <div className="text-[11px] font-bold text-orange-500/70 uppercase tracking-widest mb-1.5">Outstanding Balance</div>
                                                <div className="text-lg font-bold text-orange-400">₦{student.balance?.toLocaleString() || 0}</div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
