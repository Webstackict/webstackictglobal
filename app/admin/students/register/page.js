"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserPlus, ArrowLeft, Send, Loader2, BookOpen, GraduationCap } from "lucide-react";
import { toast } from "sonner";
import { programs } from "@/lib/contents/programs-data";

export default function RegisterStudentPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        full_name: "",
        phone: "",
        email: "",
        program: "",
        gender: "Prefer not to say",
        date_of_birth: "",
        address: "",
        learning_mode: "Hybrid",
        start_date: "",
        end_date: "",
        registration_date: new Date().toISOString().split('T')[0],
        amount_paid: 0,
        payment_status: "Unpaid",
        balance: 0
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const res = await fetch("/api/admin/students", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (res.ok) {
                toast.success(`Registered successfully! ID: ${data.data.student_id}`, {
                    description: "Student profile securely created in the ledger."
                });
                router.push("/admin/students");
            } else {
                toast.error(data.error || "Failed to register student");
            }
        } catch (error) {
            console.error(error);
            toast.error("Network error occurred.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-12">
            {/* Header Area */}
            <div className="flex items-center gap-4">
                <Link href="/admin/students" className="w-10 h-10 rounded-xl bg-[#111623] border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 transition-all">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white mb-1 flex items-center gap-2">
                        <UserPlus className="w-6 h-6 text-blue-500" /> Register Student
                    </h1>
                    <p className="text-sm text-gray-400">Manually enroll a new student to generate their permanent WTG-STU identity.</p>
                </div>
            </div>

            <div className="bg-[#0a0e17]/80 backdrop-blur-xl border border-white/5 rounded-2xl shadow-2xl overflow-hidden">
                <form onSubmit={handleSubmit} className="divide-y divide-white/5">
                    {/* Basic Info Section */}
                    <div className="p-6 md:p-8">
                        <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
                            <BookOpen className="w-5 h-5 text-gray-400" /> Identity Information
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1.5 md:col-span-2">
                                <label className="text-sm font-semibold text-gray-300">Full Legal Name <span className="text-red-400">*</span></label>
                                <input
                                    required
                                    type="text"
                                    name="full_name"
                                    value={formData.full_name}
                                    onChange={handleChange}
                                    placeholder="e.g. John Doe"
                                    className="w-full bg-[#111623] border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-200 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all shadow-inner"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-gray-300">Phone Number <span className="text-red-400">*</span></label>
                                <input
                                    required
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="+234 800 000 0000"
                                    className="w-full bg-[#111623] border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-200 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all shadow-inner"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-gray-300">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="john@example.com"
                                    className="w-full bg-[#111623] border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-200 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all shadow-inner"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-gray-300">Gender</label>
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    className="w-full bg-[#111623] border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-200 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all shadow-inner appearance-none cursor-pointer"
                                >
                                    <option>Male</option>
                                    <option>Female</option>
                                    <option>Prefer not to say</option>
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-gray-300">Date of Birth</label>
                                <input
                                    type="date"
                                    name="date_of_birth"
                                    value={formData.date_of_birth}
                                    onChange={handleChange}
                                    className="w-full bg-[#111623] border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-400 focus:text-gray-200 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all shadow-inner [color-scheme:dark]"
                                />
                            </div>
                            <div className="space-y-1.5 md:col-span-2">
                                <label className="text-sm font-semibold text-gray-300">Residential Address</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder="Enter full physical address..."
                                    className="w-full bg-[#111623] border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-200 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all shadow-inner"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Academic Section */}
                    <div className="p-6 md:p-8">
                        <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
                            <GraduationCap className="w-5 h-5 text-gray-400" /> Academic Information
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1.5 md:col-span-2">
                                <label className="text-sm font-semibold text-gray-300">Enrolled Program <span className="text-red-400">*</span></label>
                                <select
                                    required
                                    name="program"
                                    value={formData.program}
                                    onChange={handleChange}
                                    className="w-full bg-[#111623] border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-200 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all shadow-inner appearance-none cursor-pointer"
                                >
                                    <option value="" disabled>Select a Program...</option>
                                    {programs.map((prog, idx) => (
                                        <option key={idx} value={prog.title}>{prog.title}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-1.5 md:col-span-2">
                                <label className="text-sm font-semibold text-gray-300">Learning Mode</label>
                                <select
                                    name="learning_mode"
                                    value={formData.learning_mode}
                                    onChange={handleChange}
                                    className="w-full bg-[#111623] border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-200 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all shadow-inner appearance-none cursor-pointer"
                                >
                                    <option>Online</option>
                                    <option>Physical</option>
                                    <option>Hybrid</option>
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-gray-300">Registration Date</label>
                                <input
                                    type="date"
                                    name="registration_date"
                                    value={formData.registration_date || ""}
                                    onChange={handleChange}
                                    className="w-full bg-[#111623] border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-400 focus:text-gray-200 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all shadow-inner [color-scheme:dark]"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-gray-300">Start Date</label>
                                <input
                                    type="date"
                                    name="start_date"
                                    value={formData.start_date || ""}
                                    onChange={handleChange}
                                    className="w-full bg-[#111623] border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-400 focus:text-gray-200 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all shadow-inner [color-scheme:dark]"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-gray-300">Expected End Date</label>
                                <input
                                    type="date"
                                    name="end_date"
                                    value={formData.end_date || ""}
                                    onChange={handleChange}
                                    className="w-full bg-[#111623] border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-400 focus:text-gray-200 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all shadow-inner [color-scheme:dark]"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Payment Section */}
                    <div className="p-6 md:p-8 border-t border-white/5">
                        <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
                            <span className="w-5 h-5 flex items-center justify-center bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-bold">$</span> Payment Tracking
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-gray-300">Amount Paid (NGN)</label>
                                <input
                                    type="number"
                                    name="amount_paid"
                                    value={formData.amount_paid}
                                    onChange={handleChange}
                                    placeholder="e.g. 150000"
                                    className="w-full bg-[#111623] border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-200 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all shadow-inner"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-gray-300">Payment Status</label>
                                <select
                                    name="payment_status"
                                    value={formData.payment_status}
                                    onChange={handleChange}
                                    className="w-full bg-[#111623] border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-200 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all shadow-inner appearance-none cursor-pointer"
                                >
                                    <option>Unpaid</option>
                                    <option>Part Payment</option>
                                    <option>Full Payment</option>
                                    <option>Scholarship</option>
                                </select>
                            </div>
                            {formData.payment_status === "Part Payment" && (
                                <div className="space-y-1.5 md:col-span-2">
                                    <label className="text-sm font-semibold text-orange-300">Outstanding Balance (NGN)</label>
                                    <input
                                        type="number"
                                        name="balance"
                                        value={formData.balance || 0}
                                        onChange={handleChange}
                                        placeholder="Enter remaining balance"
                                        className="w-full bg-[#111623] border border-orange-500/30 rounded-xl px-4 py-3 text-sm text-orange-200 focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all shadow-inner"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-6 md:p-8 bg-[#0d1320] flex items-center justify-end gap-4">
                        <Link href="/admin/students" className="px-6 py-3 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-500 hover:to-indigo-400 text-white text-sm font-bold rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.2)] transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Send className="w-4 h-4" /> Save & Generate ID</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
