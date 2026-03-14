"use client";

import { useState, useEffect } from "react";
import {
    Search, Filter, Download, Plus, MoreVertical,
    CheckCircle2, XCircle, Clock, GraduationCap,
    ChevronLeft, ChevronRight, Loader2
} from "lucide-react";
import { toast } from "sonner";
import { formatDate } from "@/util/util";

export default function AdmissionsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [programFilter, setProgramFilter] = useState("");
    const [enrollments, setEnrollments] = useState([]);
    const [stats, setStats] = useState({ total: 0, pending: 0, successful: 0, failed: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const [programs, setPrograms] = useState([]);

    useEffect(() => {
        fetchData();
        fetchPrograms();
    }, [searchQuery, statusFilter, programFilter]);

    const fetchPrograms = async () => {
        try {
            const res = await fetch('/api/programs');
            const data = await res.json();
            setPrograms(data);
        } catch (err) {
            console.error("Error fetching programs:", err);
        }
    }

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams();
            if (searchQuery) params.append('search', searchQuery);
            if (statusFilter) params.append('status', statusFilter);
            if (programFilter) params.append('programId', programFilter);

            const res = await fetch(`/api/admin/admissions?${params.toString()}`);
            const data = await res.json();
            setEnrollments(data.enrollments || []);
            setStats(data.stats || { total: 0, pending: 0, successful: 0, failed: 0 });
        } catch (err) {
            toast.error("Failed to fetch admissions data");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleStatusUpdate = async (id, payment_status, approval_status) => {
        try {
            const res = await fetch('/api/admin/admissions', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, payment_status, approval_status })
            });

            if (res.ok) {
                toast.success("Status updated successfully");
                fetchData();
            } else {
                toast.error("Failed to update status");
            }
        } catch (err) {
            toast.error("An error occurred");
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'PAID': return 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10';
            case 'PENDING': return 'text-orange-400 border-orange-400/30 bg-orange-400/10';
            case 'AWAITING_VERIFICATION': return 'text-purple-400 border-purple-400/30 bg-purple-400/10';
            case 'FAILED': return 'text-red-400 border-red-400/30 bg-red-400/10';
            case 'REJECTED': return 'text-gray-400 border-gray-400/30 bg-gray-400/10';
            default: return 'text-gray-400 border-gray-400/30 bg-gray-400/10';
        }
    };

    return (
        <div className="space-y-6 pb-12">
            {/* Header Area */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white mb-1">Admissions Management</h1>
                    <p className="text-sm text-gray-400">Review student applications, manage approvals, and track enrollment status.</p>
                </div>
                <div className="flex gap-3">
                    <button className="h-10 px-4 py-2 bg-[#0a0e17] border border-white/10 rounded-lg text-sm font-medium hover:bg-white/5 transition-all text-white flex items-center gap-2 shadow-sm">
                        <Download className="w-4 h-4" />
                        Export Data
                    </button>
                    <button className="h-10 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 rounded-lg text-sm font-medium text-white shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        Manual Entry
                    </button>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Applications', value: stats.total, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
                    { label: 'Pending Payment', value: stats.pending, color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
                    { label: 'Paid Enrollments', value: stats.successful, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
                    { label: 'Failed Attempts', value: stats.failed, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' }
                ].map((stat, i) => (
                    <div key={i} className="bg-[#0a0e17]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-5 shadow-xl transition-all hover:-translate-y-1">
                        <div className="flex justify-between items-start mb-4">
                            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{stat.label}</div>
                        </div>
                        <div className="text-3xl font-bold text-white tracking-tight">{stat.value.toLocaleString()}</div>
                    </div>
                ))}
            </div>

            {/* Applications Data Table Area */}
            <div className="bg-[#0a0e17]/80 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden shadow-2xl flex flex-col">

                {/* Table Toolbar */}
                <div className="p-5 border-b border-white/5 flex flex-col lg:flex-row gap-4 justify-between items-center bg-[#0d1320]/50">
                    <div className="relative w-full lg:w-96 group">
                        <Search className="w-4 h-4 absolute text-gray-500 left-3 top-1/2 -translate-y-1/2 group-focus-within:text-blue-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search applicant name, email, or phone..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-[#111623] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all shadow-inner"
                        />
                    </div>

                    <div className="flex flex-wrap gap-3 w-full lg:w-auto">
                        <select
                            value={programFilter}
                            onChange={(e) => setProgramFilter(e.target.value)}
                            className="bg-[#111623] border border-white/10 text-gray-300 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-500/50 shadow-inner appearance-none cursor-pointer pr-8 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCAyNCAyNCIgc3Ryb2tlPSIjOWNhM2FmIiBzdHJva2Utd2lkdGg9IjIiPjxwYXRoIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgZD0iTTE5IDlsLTcgNy03LTciLz48L3N2Zz4=')] bg-no-repeat bg-[right_0.75rem_center] bg-[length:1.25em_1.25em]"
                        >
                            <option value="">All Programs</option>
                            {programs.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="bg-[#111623] border border-white/10 text-gray-300 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-500/50 shadow-inner appearance-none cursor-pointer pr-8 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCAyNCAyNCIgc3Ryb2tlPSIjOWNhM2FmIiBzdHJva2Utd2lkdGg9IjIiPjxwYXRoIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgZD0iTTE5IDlsLTcgNy03LTciLz48L3N2Zz4=')] bg-no-repeat bg-[right_0.75rem_center] bg-[length:1.25em_1.25em]"
                        >
                            <option value="">Status: Any</option>
                            <option value="PAID">Paid</option>
                            <option value="AWAITING_VERIFICATION">Verify Bank</option>
                            <option value="PENDING">Pending</option>
                            <option value="FAILED">Failed</option>
                        </select>
                    </div>
                </div>

                {/* Table Container */}
                <div className="overflow-x-auto min-h-[400px]">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center h-64 text-gray-500 gap-3">
                            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                            <p>Loading enrollment data...</p>
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse whitespace-nowrap">
                            <thead>
                                <tr className="bg-[#0b0f19] border-b border-white/5 text-[11px] uppercase tracking-wider text-gray-500">
                                    <th className="px-6 py-4 font-semibold">Applicant Profile</th>
                                    <th className="px-6 py-4 font-semibold">Contact Info</th>
                                    <th className="px-6 py-4 font-semibold">Program & Cohort</th>
                                    <th className="px-6 py-4 font-semibold">Status</th>
                                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-sm">
                                {enrollments.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                            No enrollments found matching your criteria.
                                        </td>
                                    </tr>
                                ) : (
                                    enrollments.map((row, i) => (
                                        <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-sm font-bold text-blue-400 shadow-lg`}>
                                                        {row.full_name?.charAt(0) || '?'}
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-gray-200 group-hover:text-blue-400 transition-colors">
                                                            {row.full_name}
                                                        </div>
                                                        <div className="text-[11px] text-gray-500 font-mono mt-0.5">#{row.id.slice(-8)}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-sm text-gray-300">{row.email}</span>
                                                    <span className="text-xs text-gray-500">{row.phone}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1">
                                                    <div className="font-medium text-gray-300 flex items-center gap-1.5">
                                                        <GraduationCap className="w-3.5 h-3.5 text-blue-400" />
                                                        {row.program.name}
                                                    </div>
                                                    <span className="text-xs text-gray-500">{row.cohort.name} ({row.cohort.cohort_code})</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] uppercase tracking-wider font-bold rounded-full border ${getStatusColor(row.approval_status === 'AWAITING_VERIFICATION' ? 'AWAITING_VERIFICATION' : (row.approval_status === 'APPROVED' ? 'PAID' : row.payment_status))}`}>
                                                    {row.payment_status === 'PAID' && <CheckCircle2 className="w-3 h-3" />}
                                                    {row.approval_status === 'AWAITING_VERIFICATION' && <Clock className="w-3 h-3 text-purple-400" />}
                                                    {row.payment_status === 'PENDING' && row.approval_status !== 'AWAITING_VERIFICATION' && <Clock className="w-3 h-3" />}
                                                    {row.payment_status === 'FAILED' && <XCircle className="w-3 h-3" />}
                                                    {row.approval_status === 'AWAITING_VERIFICATION' ? 'Awaiting Verification' : (row.approval_status === 'APPROVED' ? 'PAID' : row.payment_status)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                {row.approval_status === 'AWAITING_VERIFICATION' ? (
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            onClick={() => handleStatusUpdate(row.id, 'PAID', 'APPROVED')}
                                                            className="p-1.5 text-emerald-500 hover:bg-emerald-500/10 rounded-lg transition-colors"
                                                            title="Approve & Verify Payment"
                                                        >
                                                            <CheckCircle2 className="w-5 h-5" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleStatusUpdate(row.id, 'FAILED', 'REJECTED')}
                                                            className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                                            title="Reject Payment"
                                                        >
                                                            <XCircle className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button className="p-1.5 text-gray-500 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                                                        <MoreVertical className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Pagination Footer */}
                <div className="p-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-400 bg-[#0d1320]/50">
                    <div>Showing <span className="text-white font-medium">{enrollments.length}</span> entries</div>
                </div>
            </div>
        </div>
    );
}
