"use client";

import { useState, useEffect, Suspense } from "react";
import { Search, ShieldCheck, XCircle, Loader2, ArrowRight, UserCheck, CheckCircle2, QrCode, Copy, Download, Check } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

function VerifyStudentContent() {
    const [studentId, setStudentId] = useState("");
    const [isVerifying, setIsVerifying] = useState(false);
    const [result, setResult] = useState(null); // { status, data, message }
    const [copied, setCopied] = useState(false);
    const [verificationUrl, setVerificationUrl] = useState("");

    const searchParams = useSearchParams();
    const queryStudentId = searchParams.get("student_id");

    const handleVerify = async (e, customId = null) => {
        if (e) e.preventDefault();
        const targetId = customId !== null ? customId : studentId;
        if (!targetId.trim()) return;

        setIsVerifying(true);
        setResult(null);

        try {
            const res = await fetch(`/api/verify-student?student_id=${encodeURIComponent(targetId)}`);
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

    useEffect(() => {
        if (queryStudentId) {
            setStudentId(queryStudentId);
            handleVerify(null, queryStudentId);
        }
    }, [queryStudentId]);

    useEffect(() => {
        if (result?.status === "valid" && result?.data?.student_id) {
            setVerificationUrl(`${window.location.origin}/verify-student?student_id=${result.data.student_id}`);
        } else {
            setVerificationUrl("");
        }
    }, [result]);

    const handleCopyLink = () => {
        if (!verificationUrl) return;
        navigator.clipboard.writeText(verificationUrl);
        setCopied(true);
        toast.success("Verification link copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownloadQR = async () => {
        if (!verificationUrl) return;
        const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(verificationUrl)}&color=06080d&bgcolor=ffffff`;
        try {
            const response = await fetch(qrApiUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `verify_${result.data.student_id}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            toast.success("QR Code downloaded successfully!");
        } catch (err) {
            window.open(qrApiUrl, "_blank");
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
                <div className="bg-[#0a0e17]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"></div>
                    <form onSubmit={(e) => handleVerify(e)} className="relative z-10">
                        <div className="relative flex items-center group">
                            <Search className="absolute left-6 w-6 h-6 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="WTG-STU-XXXXXX"
                                value={studentId}
                                onChange={(e) => setStudentId(e.target.value)}
                                className="w-full h-16 sm:h-[80px] bg-[#111623]/80 border-2 border-white/5 rounded-2xl pl-16 sm:pl-20 pr-32 sm:pr-40 text-center text-lg sm:text-2xl font-mono text-white placeholder-gray-600 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all shadow-inner uppercase"
                            />
                            <button
                                type="submit"
                                disabled={isVerifying || !studentId.trim()}
                                className="absolute right-3 sm:right-4 h-[calc(100%-24px)] px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:scale-95 disabled:from-gray-800 disabled:to-gray-800 disabled:text-gray-500 text-white font-bold rounded-xl transition-all flex items-center gap-2 shadow-lg hover:shadow-blue-500/25 cursor-pointer disabled:cursor-not-allowed"
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
                                <ShieldCheck className="w-12 h-12 text-gray-700 mx-auto mb-4 opacity-50 animate-pulse" />
                                <p className="text-gray-500 text-sm">Waiting for identity query...</p>
                            </div>
                        )}

                        {result?.status === "invalid" && (
                            <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-8 flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-4 relative overflow-hidden">
                                <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-red-500/40 to-transparent"></div>
                                <div className="w-16 h-16 rounded-full bg-red-500/15 flex items-center justify-center mb-4 border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.1)]">
                                    <XCircle className="w-8 h-8 text-red-500" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Verification Failed</h3>
                                <p className="text-red-400 font-medium">No official record found matching "{studentId}"</p>
                                <p className="text-gray-500 text-sm mt-4 max-w-md">Please ensure the exact WTG-STU format is used. If you suspect an error, contact administration immediately.</p>
                            </div>
                        )}

                        {result?.status === "valid" && (
                            <div className="bg-[#0c1220]/90 backdrop-blur-xl border border-blue-500/20 rounded-3xl p-6 sm:p-8 animate-in fade-in slide-in-from-bottom-4 relative overflow-hidden shadow-[0_0_40px_rgba(59,130,246,0.15)]">
                                <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent"></div>
                                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl"></div>

                                <div className="flex flex-col md:flex-row gap-8 items-stretch relative z-10">
                                    <div className="flex-1 flex flex-col sm:flex-row gap-6 items-center sm:items-start">
                                        <div className="w-20 h-20 shrink-0 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 border border-blue-400/20">
                                            <UserCheck className="w-10 h-10 text-white animate-pulse" />
                                        </div>

                                        <div className="flex-1 text-center sm:text-left w-full">
                                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-3 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                                                <span className="relative flex h-2 w-2">
                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                                </span>
                                                <CheckCircle2 className="w-3.5 h-3.5" /> Official Record Found
                                            </div>

                                            <h3 className="text-2xl font-bold text-white mb-1">{result.data.full_name}</h3>
                                            <div className="font-mono text-blue-400 font-bold tracking-wide mb-6">{result.data.student_id}</div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                                                <div className="bg-[#131a2c]/50 hover:bg-[#131a2c]/80 transition-all duration-300 rounded-xl p-4 border border-white/5 relative overflow-hidden group">
                                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-indigo-500"></div>
                                                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Enrolled Program</div>
                                                    <div className="text-sm font-semibold text-gray-200 group-hover:text-white transition-colors">{result.data.program}</div>
                                                </div>
                                                <div className="bg-[#131a2c]/50 hover:bg-[#131a2c]/80 transition-all duration-300 rounded-xl p-4 border border-white/5 relative overflow-hidden group">
                                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-indigo-500"></div>
                                                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Registration Date</div>
                                                    <div className="text-sm font-semibold text-gray-200 group-hover:text-white transition-colors">
                                                        {new Date(result.data.registration_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                                    </div>
                                                </div>
                                                <div className="bg-[#131a2c]/50 hover:bg-[#131a2c]/80 transition-all duration-300 rounded-xl p-4 border border-white/5 relative overflow-hidden group sm:col-span-2">
                                                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${result.data.status === 'active' ? 'bg-emerald-500' : result.data.status === 'completed' ? 'bg-blue-500' : 'bg-amber-500'}`}></div>
                                                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Current Status</div>
                                                    <div className="flex items-center gap-2">
                                                        <span className={`w-2 h-2 rounded-full ${result.data.status === 'active' ? 'bg-emerald-500 animate-pulse' : result.data.status === 'completed' ? 'bg-blue-500' : 'bg-amber-500'}`}></span>
                                                        <div className={`text-sm font-bold uppercase tracking-wider ${result.data.status === 'active' ? 'text-emerald-400' : result.data.status === 'completed' ? 'text-blue-400' : 'text-amber-400'}`}>
                                                            {result.data.status}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Divider for md screens */}
                                    <div className="hidden md:block w-[1px] bg-white/10 shrink-0 self-stretch"></div>

                                    {/* QR Code Container */}
                                    <div className="w-full md:w-[220px] flex flex-col items-center justify-center shrink-0 bg-[#0f172a]/60 border border-white/5 p-5 rounded-2xl text-center">
                                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-1.5 justify-center">
                                            <QrCode className="w-3.5 h-3.5 text-blue-400" /> Verification QR
                                        </div>
                                        
                                        {/* Viewfinder outer wrapper (corners show outside) */}
                                        <div className="relative inline-block mb-4">
                                            {/* Blue corner crop marks */}
                                            <div className="absolute -top-1.5 -left-1.5 w-5 h-5 border-t-[3px] border-l-[3px] border-blue-500 rounded-tl-md z-10"></div>
                                            <div className="absolute -top-1.5 -right-1.5 w-5 h-5 border-t-[3px] border-r-[3px] border-blue-500 rounded-tr-md z-10"></div>
                                            <div className="absolute -bottom-1.5 -left-1.5 w-5 h-5 border-b-[3px] border-l-[3px] border-blue-500 rounded-bl-md z-10"></div>
                                            <div className="absolute -bottom-1.5 -right-1.5 w-5 h-5 border-b-[3px] border-r-[3px] border-blue-500 rounded-br-md z-10"></div>

                                            {/* White QR frame with scanner laser inside */}
                                            <div className="bg-white p-3 rounded-2xl shadow-xl relative overflow-hidden select-none">
                                                {/* Animated laser scan line */}
                                                <div className="scanner-line"></div>

                                                {verificationUrl ? (
                                                    <img
                                                        src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(verificationUrl)}&color=06080d&bgcolor=ffffff`}
                                                        alt="Verification QR Code"
                                                        className="w-[130px] h-[130px] object-contain block"
                                                    />
                                                ) : (
                                                    <div className="w-[130px] h-[130px] flex items-center justify-center bg-gray-50 rounded-lg">
                                                        <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex gap-2 w-full">
                                            <button
                                                type="button"
                                                onClick={handleCopyLink}
                                                className="flex-1 h-9 bg-[#1b253b] hover:bg-[#273554] border border-white/10 active:scale-95 rounded-xl text-xs font-semibold text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                                            >
                                                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                                                {copied ? "Copied" : "Copy"}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleDownloadQR}
                                                className="flex-1 h-9 bg-blue-600 hover:bg-blue-500 active:scale-95 rounded-xl text-xs font-semibold text-white transition-all flex items-center justify-center gap-1.5 shadow-[0_0_10px_rgba(59,130,246,0.2)] cursor-pointer"
                                            >
                                                <Download className="w-3.5 h-3.5" />
                                                Save
                                            </button>
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

export default function VerifyStudentPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#06080d] flex flex-col items-center justify-center relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none"></div>
                <div className="flex flex-col items-center">
                    <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-4" />
                    <p className="text-gray-400 text-sm font-semibold">Loading verification system...</p>
                </div>
            </div>
        }>
            <VerifyStudentContent />
        </Suspense>
    );
}
