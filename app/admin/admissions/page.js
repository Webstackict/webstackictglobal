"use client";

import { useState, useEffect } from "react";
import {
    Search, Filter, Download, Plus, MoreVertical,
    CheckCircle2, XCircle, Clock, GraduationCap,
    ChevronLeft, ChevronRight, Loader2, Users
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

    const [selectedEnrollment, setSelectedEnrollment] = useState(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);

    useEffect(() => {
        fetchData();
        fetchPrograms();
    }, [searchQuery, statusFilter, programFilter]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = () => setActiveDropdown(null);
        window.addEventListener('click', handleClickOutside);
        return () => window.removeEventListener('click', handleClickOutside);
    }, []);

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
                if (isDetailsOpen) setIsDetailsOpen(false);
            } else {
                toast.error("Failed to update status");
            }
        } catch (err) {
            toast.error("An error occurred");
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'PAID': return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10 shadow-[0_0_10px_rgba(16,185,129,0.1)]';
            case 'PENDING': return 'text-amber-400 border-amber-500/30 bg-amber-500/10 shadow-[0_0_10px_rgba(245,158,11,0.1)]';
            case 'AWAITING_VERIFICATION': return 'text-violet-400 border-violet-500/30 bg-violet-500/10 shadow-[0_0_10px_rgba(139,92,246,0.1)]';
            case 'FAILED': return 'text-rose-400 border-rose-500/30 bg-rose-500/10 shadow-[0_0_10px_rgba(244,63,94,0.1)]';
            case 'REJECTED': return 'text-slate-400 border-slate-500/30 bg-slate-500/10 opacity-70';
            default: return 'text-slate-400 border-slate-500/30 bg-slate-500/10';
        }
    };

    const handleExport = () => {
        if (enrollments.length === 0) {
            toast.error("No data to export");
            return;
        }

        const headers = ["ID", "Full Name", "Email", "Phone", "Program", "Cohort", "Status", "Date"];
        const csvRows = enrollments.map(e => [
            e.id,
            e.full_name,
            e.email,
            e.phone,
            e.program.name,
            e.cohort.name,
            e.payment_status,
            formatDate(e.created_at)
        ].join(','));

        const csvContent = [headers.join(','), ...csvRows].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `admissions_export_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
        toast.success("Export started");
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
                    <button
                        onClick={handleExport}
                        className="h-10 px-4 py-2 bg-[#0a0e17] border border-white/10 rounded-lg text-sm font-medium hover:bg-white/5 transition-all text-white flex items-center gap-2 shadow-sm"
                    >
                        <Download className="w-4 h-4" />
                        Export Data
                    </button>
                    <button
                        onClick={() => toast.info("Manual entry feature coming soon")}
                        className="h-10 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 rounded-lg text-sm font-medium text-white shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Manual Entry
                    </button>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Applications', value: stats.total, color: 'text-blue-400', bg: 'bg-blue-600/10', border: 'border-blue-500/20', icon: Users, glow: 'blue' },
                    { label: 'Pending Payment', value: stats.pending, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', icon: Clock, glow: 'amber' },
                    { label: 'Paid Enrollments', value: stats.successful, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: CheckCircle2, glow: 'emerald' },
                    { label: 'Failed Attempts', value: stats.failed, color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20', icon: XCircle, glow: 'rose' }
                ].map((stat, i) => (
                    <div key={i} className="bg-[#0a0e17]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-5 shadow-xl transition-all hover:-translate-y-1 relative group overflow-hidden text-left">
                        {/* Shimmer Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent -translate-x-full group-hover:translate-x-full duration-1000 transition-transform"></div>

                        <div className="flex justify-between items-start mb-4 relative z-10">
                            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{stat.label}</div>
                            <div className={`p-2 rounded-lg ${stat.bg} ${stat.color} border ${stat.border} shadow-sm`}>
                                <stat.icon className="w-3.5 h-3.5" />
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-white tracking-tight relative z-10">{stat.value.toLocaleString()}</div>
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
                            className="bg-[#111623] border border-white/10 text-gray-300 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-500/50 shadow-inner appearance-none cursor-pointer pr-8 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My4wcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCAyNCAyNCIgc3Ryb2tlPSIjOWNhM2FmIiBzdHJva2Utd2lkdGg9IjIiPjxwYXRoIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgZD0iTTE5IDlsLTcgNy03LTciLz48L3N2Z24=')] bg-no-repeat bg-[right_0.75rem_center] bg-[length:1.25em_1.25em]"
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
                                    <th className="px-6 py-4 font-semibold text-right text-[10px] tracking-[0.2em]">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-sm font-sans">
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
                                            <td className="px-6 py-4 font-sans text-sm">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-gray-300">{row.email}</span>
                                                    <span className="text-xs text-gray-500 tabular-nums">{row.phone}</span>
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
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-[10px] uppercase tracking-wider font-bold rounded-full border ${getStatusColor(row.approval_status === 'AWAITING_VERIFICATION' ? 'AWAITING_VERIFICATION' : (row.approval_status === 'APPROVED' ? 'PAID' : row.payment_status))}`}>
                                                    {row.payment_status === 'PAID' && <CheckCircle2 className="w-3 h-3" />}
                                                    {row.approval_status === 'AWAITING_VERIFICATION' && <Clock className="w-3 h-3 animate-pulse" />}
                                                    {row.payment_status === 'PENDING' && row.approval_status !== 'AWAITING_VERIFICATION' && <Clock className="w-3 h-3" />}
                                                    {row.payment_status === 'FAILED' && <XCircle className="w-3 h-3" />}
                                                    {row.approval_status === 'AWAITING_VERIFICATION' ? 'Awaiting Verification' : (row.approval_status === 'APPROVED' ? 'PAID' : row.payment_status)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right relative">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setActiveDropdown(activeDropdown === row.id ? null : row.id);
                                                    }}
                                                    className={`p-2 rounded-lg transition-all ${activeDropdown === row.id ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'text-gray-500 hover:text-white hover:bg-white/10'}`}
                                                >
                                                    <MoreVertical className="w-4 h-4" />
                                                </button>

                                                {/* Actions Dropdown */}
                                                {activeDropdown === row.id && (
                                                    <div className="absolute right-6 top-12 w-48 bg-[#0d1320] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in duration-200 text-left">
                                                        <div className="p-1.5 space-y-1">
                                                            <button
                                                                onClick={() => {
                                                                    setSelectedEnrollment(row);
                                                                    setIsDetailsOpen(true);
                                                                    setActiveDropdown(null);
                                                                }}
                                                                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-300 hover:bg-white/5 hover:text-white rounded-lg transition-colors"
                                                            >
                                                                <Search className="w-3.5 h-3.5" />
                                                                View Details
                                                            </button>
                                                            {row.approval_status === 'AWAITING_VERIFICATION' && (
                                                                <>
                                                                    <div className="h-px bg-white/5 my-1 mx-2"></div>
                                                                    <button
                                                                        onClick={() => handleStatusUpdate(row.id, 'PAID', 'APPROVED')}
                                                                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors"
                                                                    >
                                                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                                                        Approve Admission
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleStatusUpdate(row.id, 'FAILED', 'REJECTED')}
                                                                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                                                                    >
                                                                        <XCircle className="w-3.5 h-3.5" />
                                                                        Reject Admission
                                                                    </button>
                                                                </>
                                                            )}
                                                            <div className="h-px bg-white/5 my-1 mx-2"></div>
                                                            <button className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors opacity-50 cursor-not-allowed">
                                                                <XCircle className="w-3.5 h-3.5" />
                                                                Delete Record
                                                            </button>
                                                        </div>
                                                    </div>
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
                <div className="p-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-gray-500 bg-[#0d1320]/50">
                    <div>
                        Showing <span className="text-white">{enrollments.length}</span> of <span className="text-white">{stats.total}</span> entries
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="p-2 border border-white/5 rounded-lg hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all" disabled>
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        {[1].map(page => (
                            <button key={page} className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 text-xs font-bold transition-all">
                                {page}
                            </button>
                        ))}
                        <button className="p-2 border border-white/5 rounded-lg hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all" disabled>
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Student Details Slide-over/Modal */}
            {isDetailsOpen && selectedEnrollment && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
                        onClick={() => setIsDetailsOpen(false)}
                    ></div>
                    <div className="bg-[#0b0f19] border border-white/10 w-full max-w-2xl rounded-3xl shadow-2xl relative z-10 overflow-hidden animate-in slide-in-from-bottom-8 duration-500">
                        {/* Modal Header */}
                        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-blue-600/10 to-transparent">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-blue-500 border border-blue-400 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                                    {selectedEnrollment.full_name?.charAt(0)}
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white tracking-tight">{selectedEnrollment.full_name}</h2>
                                    <p className="text-xs text-gray-500 font-mono tracking-wider">#{selectedEnrollment.id}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsDetailsOpen(false)}
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all font-bold"
                            >
                                <XCircle className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Basic Info */}
                                <div className="space-y-4">
                                    <h3 className="text-[10px] font-bold text-blue-400 uppercase tracking-widest border-b border-blue-400/20 pb-2">Personal Information</h3>
                                    <div className="space-y-3">
                                        <div>
                                            <div className="text-[11px] text-gray-500 mb-0.5">Contact Method</div>
                                            <div className="text-sm text-gray-200">{selectedEnrollment.email}</div>
                                            <div className="text-sm text-gray-400 font-sans tabular-nums">{selectedEnrollment.phone}</div>
                                        </div>
                                        <div>
                                            <div className="text-[11px] text-gray-500 mb-0.5">Gender & Address</div>
                                            <div className="text-sm text-gray-200 capitalize">{selectedEnrollment.gender || 'Not specified'}</div>
                                            <div className="text-sm text-gray-400 italic">{selectedEnrollment.address || 'No address provided'}</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Program Info */}
                                <div className="space-y-4">
                                    <h3 className="text-[10px] font-bold text-amber-400 uppercase tracking-widest border-b border-amber-400/20 pb-2">Program & Cohort</h3>
                                    <div className="space-y-3">
                                        <div className="bg-amber-400/5 border border-amber-400/10 rounded-2xl p-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <GraduationCap className="w-4 h-4 text-amber-400" />
                                                <div className="text-sm font-bold text-amber-200">{selectedEnrollment.program.name}</div>
                                            </div>
                                            <div className="text-[11px] text-amber-400/60 font-medium">#{selectedEnrollment.program.slug}</div>
                                        </div>
                                        <div>
                                            <div className="text-[11px] text-gray-500 mb-0.5">Assigned Cohort</div>
                                            <div className="text-sm text-gray-300">{selectedEnrollment.cohort.name}</div>
                                            <div className="text-xs text-gray-500 font-mono">{selectedEnrollment.cohort.cohort_code}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Additional Details */}
                            <div className="space-y-4 bg-white/[0.02] border border-white/5 rounded-3xl p-6">
                                <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                    <Clock className="w-3.5 h-3.5" />
                                    Profile Details
                                </h3>
                                <p className="text-sm text-gray-300 leading-relaxed italic">
                                    {selectedEnrollment.profile_details?.bio || "No additional bio or profile details were provided by the applicant."}
                                </p>
                            </div>

                            {/* Verification Actions */}
                            {selectedEnrollment.approval_status === 'AWAITING_VERIFICATION' && (
                                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                    <button
                                        onClick={() => handleStatusUpdate(selectedEnrollment.id, 'PAID', 'APPROVED')}
                                        className="flex-1 h-12 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl shadow-lg shadow-emerald-500/20 transition-all"
                                    >
                                        <CheckCircle2 className="w-5 h-5" />
                                        Verify & Approve
                                    </button>
                                    <button
                                        onClick={() => handleStatusUpdate(selectedEnrollment.id, 'FAILED', 'REJECTED')}
                                        className="flex-1 h-12 flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-2xl shadow-lg shadow-rose-500/20 transition-all"
                                    >
                                        <XCircle className="w-5 h-5" />
                                        Decline Enrollment
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="p-6 bg-[#0d1320] border-t border-white/5 flex justify-between items-center">
                            <div className={`px-4 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-widest ${getStatusColor(selectedEnrollment.approval_status === 'AWAITING_VERIFICATION' ? 'AWAITING_VERIFICATION' : (selectedEnrollment.approval_status === 'APPROVED' ? 'PAID' : selectedEnrollment.payment_status))}`}>
                                STATUS: {selectedEnrollment.approval_status === 'AWAITING_VERIFICATION' ? 'Awaiting Verification' : (selectedEnrollment.approval_status === 'APPROVED' ? 'Verified & Paid' : selectedEnrollment.payment_status)}
                            </div>
                            <span className="text-[10px] text-gray-600 font-mono">ENROLLED ON: {formatDate(selectedEnrollment.created_at)}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
