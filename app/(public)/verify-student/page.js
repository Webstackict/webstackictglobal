"use client";

import { useState } from "react";
import { Search, ShieldCheck, XCircle, Loader2, ArrowRight, UserCheck, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function VerifyStudentPage() {
    const [studentId, setStudentId] = useState("");
    const [isVerifying, setIsVerifying] = useState(false);
    const [result, setResult] = useState(null); // { status, data, message }

    const handleVerify = async (e) => {
        e.preventDefault();
        if (!studentId.trim()) return;

        setIsVerifying(true);
        setResult(null);

        try {
            const res = await fetch(`/api/verify-student?student_id=${encodeURIComponent(studentId)}`);
            const json = await res.json();

            if (res.ok && json.status === "valid") {
                setResult(json);
                toast.success("Student successfully verified!");
            } else {
                setResult({ status: "invalid", message: json.message || "No student record found with this ID" });
            }
        } catch (error) {
            setResult({ status: "invalid", message: "Network error. Please try again later." });
        } finally {
            setIsVerifying(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#06080d] flex flex-col items-center justify-start pt-44 pb-16 md:justify-center md:py-0 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none"></div>

            <div className="max-w-3xl w-full mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-semibold mb-6 shadow-[0_0_15px_rgba(59,130,246,0.15)]">
                        <ShieldCheck className="w-4 h-4" /> Global Verification System
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4 drop-shadow-sm">
                        Verify <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Student Identity</span>
                    </h1>
                    <p className="text-gray-400 text-lg max-w-xl mx-auto">
                        Enter a Webstack ICT Global WTG-STU identification number below to verify official enrollment records.
                    </p>
                </div>

                {/* Search Card */}
                <div className="bg-[#0a0e17]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-6 sm:p-10 shadow-2xl relative">
                    <form onSubmit={handleVerify} className="relative">
                        <div className="relative flex items-center group">
                            <Search className="absolute left-6 w-6 h-6 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="WTG-STU-XXXXXX"
                                value={studentId}
                                onChange={(e) => setStudentId(e.target.value)}
                                className="w-full h-16 sm:h-[80px] bg-[#111623] border-2 border-white/5 rounded-2xl pl-16 sm:pl-20 pr-32 sm:pr-40 text-center text-lg sm:text-2xl font-mono text-white placeholder-gray-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all shadow-inner uppercase uppercase-placeholder"
                            />
                            <button
                                type="submit"
                                disabled={isVerifying || !studentId.trim()}
                                className="absolute right-3 sm:right-4 h-[calc(100%-24px)] px-6 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 disabled:bg-gray-700 disabled:text-gray-400 text-white font-bold rounded-xl transition-all flex items-center gap-2 shadow-lg hover:shadow-blue-500/25"
                            >
                                {isVerifying ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>Verify <span className="hidden sm:inline"><ArrowRight className="w-4 h-4" /></span></>
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Verification Result Area */}
                    <div className="mt-8 transition-all duration-500">
                        {!result && !isVerifying && (
                            <div className="text-center py-8">
                                <ShieldCheck className="w-12 h-12 text-gray-700 mx-auto mb-4 opacity-50" />
                                <p className="text-gray-500 text-sm">Waiting for identity query...</p>
                            </div>
                        )}

                        {result?.status === "invalid" && (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-4">
                                <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mb-4">
                                    <XCircle className="w-8 h-8 text-red-500" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Verification Failed</h3>
                                <p className="text-red-400 font-medium">No official record found matching "{studentId}"</p>
                                <p className="text-gray-500 text-sm mt-4 max-w-md">Please ensure the exact WTG-STU format is used. If you suspect an error, contact administration immediately.</p>
                            </div>
                        )}

                        {result?.status === "valid" && (
                            <div className="bg-[#111623] border border-blue-500/30 rounded-2xl p-6 sm:p-8 animate-in fade-in slide-in-from-bottom-4 relative overflow-hidden shadow-[0_0_30px_rgba(59,130,246,0.1)]">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl"></div>

                                <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start relative z-10">
                                    <div className="w-20 h-20 shrink-0 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                                        <UserCheck className="w-10 h-10 text-white" />
                                    </div>

                                    <div className="flex-1 text-center sm:text-left">
                                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-3">
                                            <CheckCircle2 className="w-3.5 h-3.5" /> Official Record Found
                                        </div>

                                        <h3 className="text-2xl font-bold text-white mb-1">{result.data.full_name}</h3>
                                        <div className="font-mono text-blue-400 font-bold tracking-wide mb-6">{result.data.student_id}</div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                                            <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                                                <div className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1">Enrolled Program</div>
                                                <div className="text-sm font-semibold text-gray-200">{result.data.program}</div>
                                            </div>
                                            <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                                                <div className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1">Registration Date</div>
                                                <div className="text-sm font-semibold text-gray-200">
                                                    {new Date(result.data.registration_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                                </div>
                                            </div>
                                            <div className="bg-white/5 rounded-xl p-4 border border-white/5 sm:col-span-2">
                                                <div className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1">Current Status</div>
                                                <div className={`text-sm font-bold uppercase tracking-wider ${result.data.status === 'active' ? 'text-emerald-400' : result.data.status === 'completed' ? 'text-blue-400' : 'text-amber-400'}`}>
                                                    {result.data.status}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="text-center mt-8">
                    <Link href="/" className="text-sm text-gray-500 hover:text-white transition-colors">
                        &larr; Return to main site
                    </Link>
                </div>
            </div>
        </div>
    );
}
