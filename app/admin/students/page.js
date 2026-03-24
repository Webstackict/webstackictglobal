"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
    Users, Plus, Search, Filter, MoreVertical,
    CheckCircle2, XCircle, Clock, Copy, Loader2, ArrowRight, BookOpen
} from "lucide-react";
import { toast } from "sonner";

export default function StudentLedgerPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [students, setStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [meta, setMeta] = useState(null);

    const fetchStudents = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/admin/students?search=${searchQuery}&status=${statusFilter}`);
            if (res.ok) {
                const json = await res.json();
                setStudents(json.data);
                setMeta(json.meta);
            } else {
                toast.error("Failed to fetch students");
            }
        } catch (error) {
            console.error(error);
            toast.error("Network error");
        } finally {
            setIsLoading(false);
        }
    };

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => fetchStudents(), 500);
        return () => clearTimeout(timer);
    }, [searchQuery, statusFilter]);

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        toast.success(`Copied ID: ${text}`);
    };

    return (
        <div className="space-y-6 pb-12">
            {/* Header Area */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white mb-1">Student Ledger</h1>
                    <p className="text-sm text-gray-400">Centrally view and manage registered student profiles.</p>
                </div>
                <div className="flex gap-3">
                    <Link href="/admin/students/register" className="h-10 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-500 hover:to-indigo-400 rounded-lg text-sm font-medium text-white shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        Register Student
                    </Link>
                </div>
            </div>

            {/* List and Filters Component */}
            <div className="bg-[#0a0e17]/80 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden shadow-2xl flex flex-col min-h-[500px]">
                {/* Table Header / Toolbar */}
                <div className="p-5 border-b border-white/5 flex flex-col lg:flex-row gap-4 justify-between items-center bg-[#0d1320]">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                            <Users className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-white">Registered Students</h2>
                            <p className="text-xs text-gray-400">{meta ? `${meta.total} total profiles found` : 'Loading profiles...'}</p>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3 w-full lg:w-auto">
                        <div className="relative w-full sm:w-64 group flex-grow lg:flex-grow-0">
                            <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-blue-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search Name, Phone, ID..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-[#111623] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition-all shadow-inner"
                            />
                        </div>

                        <div className="relative flex-grow sm:flex-grow-0 min-w-[140px]">
                            <Filter className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full appearance-none bg-[#111623] border border-white/10 rounded-xl pl-10 pr-8 py-2 text-sm text-gray-300 focus:outline-none focus:border-blue-500/50 transition-all shadow-inner cursor-pointer"
                            >
                                <option value="all">All Status</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Table Content */}
                <div className="overflow-x-auto flex-1">
                    <table className="w-full text-left border-collapse whitespace-nowrap">
                        <thead>
                            <tr className="bg-[#0d1320]/50 border-b border-white/5 text-[11px] uppercase tracking-wider text-gray-500">
                                <th className="px-6 py-4 font-semibold">Student Identity</th>
                                <th className="px-6 py-4 font-semibold">Contact / Location</th>
                                <th className="px-6 py-4 font-semibold">Program</th>
                                <th className="px-6 py-4 font-semibold">Status / Date</th>
                                <th className="px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-sm">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-20 text-center text-gray-500">
                                        <div className="flex flex-col items-center justify-center gap-3">
                                            <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                                            <p>Loading student ledger...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : students.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-20 text-center text-gray-500">
                                        <div className="flex flex-col items-center justify-center gap-3">
                                            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-gray-400">
                                                <Users className="w-6 h-6" />
                                            </div>
                                            <p className="text-gray-400">No students found matching your criteria.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                students.map((student) => (
                                    <tr key={student.id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 flex-shrink-0 flex items-center justify-center rounded-full bg-gradient-to-br from-gray-800 to-gray-700 text-white font-bold text-sm">
                                                    {student.full_name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-gray-200 group-hover:text-blue-400 transition-colors">
                                                        {student.full_name}
                                                    </div>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        <span className="font-mono text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 shadow-[0_0_8px_rgba(16,185,129,0.1)]">
                                                            {student.student_id}
                                                        </span>
                                                        <button
                                                            onClick={() => copyToClipboard(student.student_id)}
                                                            className="text-gray-500 hover:text-white transition-colors"
                                                            title="Copy ID"
                                                        >
                                                            <Copy className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-gray-300 font-medium">{student.phone}</div>
                                            <div className="text-[11px] text-gray-500 mt-1">{student.email || "No email"}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-gray-300">
                                                <BookOpen className="w-3.5 h-3.5 text-blue-500" />
                                                <span className="max-w-[150px] truncate" title={student.program}>{student.program}</span>
                                            </div>
                                            <div className="text-[11px] text-gray-500 mt-1">{student.learning_mode || "Hybrid"}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] uppercase tracking-wider font-bold rounded-full border
                                                ${student.status === 'active' ? 'text-blue-400 border-blue-400/30 bg-blue-400/10' :
                                                    'text-gray-400 border-gray-400/30 bg-gray-400/10'}`}>
                                                {student.status === 'active' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                                                {student.status}
                                            </span>
                                            <div className="text-[11px] text-gray-500 mt-1.5 flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {new Date(student.registration_date).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end items-center gap-2">
                                                <Link href={`/admin/students/${student.id}`} className="text-sm font-medium text-gray-400 hover:text-blue-400 transition-colors flex items-center gap-1 hover:bg-blue-500/10 px-3 py-1.5 rounded-lg">
                                                    Manage <ArrowRight className="w-3 h-3" />
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
