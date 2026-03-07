"use client";

import { useState } from "react";
import {
    Search, Filter, Download, Plus, MoreVertical,
    CheckCircle2, XCircle, Clock, GraduationCap,
    ChevronLeft, ChevronRight
} from "lucide-react";

export default function AdmissionsPage() {
    const [searchQuery, setSearchQuery] = useState("");

    const applications = [
        { id: "APP-001", name: 'Michael Chen', email: 'm.chen@example.com', phone: "+1 (555) 123-4567", program: 'Full-Stack Web Dev', date: 'Oct 24, 2023', status: 'Approved', payment: 'Completed', initial: 'M', color: 'bg-blue-500' },
        { id: "APP-002", name: 'Sarah Jenkins', email: 'sarah.j@example.com', phone: "+1 (555) 987-6543", program: 'Data Science & AI', date: 'Oct 23, 2023', status: 'Pending', payment: 'Pending', initial: 'S', color: 'bg-purple-500' },
        { id: "APP-003", name: 'David Okafor', email: 'dok@example.com', phone: "+234 801 234 5678", program: 'Cybersecurity', date: 'Oct 22, 2023', status: 'Approved', payment: 'Partial', initial: 'D', color: 'bg-emerald-500' },
        { id: "APP-004", name: 'Aisha Bello', email: 'aisha.b@example.com', phone: "+234 902 345 6789", program: 'Cloud Computing', date: 'Oct 20, 2023', status: 'Waitlisted', payment: 'N/A', initial: 'A', color: 'bg-rose-500' },
        { id: "APP-005", name: 'James Wilson', email: 'jwilson@example.com', phone: "+44 7700 900077", program: 'Full-Stack Web Dev', date: 'Oct 19, 2023', status: 'Rejected', payment: 'Failed', initial: 'J', color: 'bg-amber-500' },
        { id: "APP-006", name: 'Elena Rodriguez', email: 'elena.r@example.com', phone: "+34 600 123 456", program: 'UI/UX Design', date: 'Oct 18, 2023', status: 'Pending', payment: 'Pending', initial: 'E', color: 'bg-indigo-500' },
    ];

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
                        Export Formats
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
                    { label: 'Total Applications', value: '4,209', trend: '+12%', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
                    { label: 'Pending Review', value: '142', trend: '+5%', color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
                    { label: 'Approved Students', value: '1,893', trend: '+3%', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
                    { label: 'Rejected / Withdrawn', value: '84', trend: '-2%', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' }
                ].map((stat, i) => (
                    <div key={i} className="bg-[#0a0e17]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-5 shadow-xl transition-all hover:-translate-y-1">
                        <div className="flex justify-between items-start mb-4">
                            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{stat.label}</div>
                            <span className={`text-[10px] font-bold ${stat.color} ${stat.bg} border ${stat.border} px-2 py-0.5 rounded-full`}>
                                {stat.trend}
                            </span>
                        </div>
                        <div className="text-3xl font-bold text-white tracking-tight">{stat.value}</div>
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
                            placeholder="Search applicant name, email, or ID..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-[#111623] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all shadow-inner"
                        />
                    </div>

                    <div className="flex flex-wrap gap-3 w-full lg:w-auto">
                        <select className="bg-[#111623] border border-white/10 text-gray-300 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-500/50 shadow-inner appearance-none cursor-pointer pr-8 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCAyNCAyNCIgc3Ryb2tlPSIjOWNhM2FmIiBzdHJva2Utd2lkdGg9IjIiPjxwYXRoIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgZD0iTTE5IDlsLTcgNy03LTciLz48L3N2Zz4=')] bg-no-repeat bg-[right_0.75rem_center] bg-[length:1.25em_1.25em]">
                            <option>All Programs</option>
                            <option>Full-Stack Web Dev</option>
                            <option>Data Science & AI</option>
                            <option>Cybersecurity</option>
                        </select>
                        <select className="bg-[#111623] border border-white/10 text-gray-300 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-500/50 shadow-inner appearance-none cursor-pointer pr-8 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCAyNCAyNCIgc3Ryb2tlPSIjOWNhM2FmIiBzdHJva2Utd2lkdGg9IjIiPjxwYXRoIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgZD0iTTE5IDlsLTcgNy03LTciLz48L3N2Zz4=')] bg-no-repeat bg-[right_0.75rem_center] bg-[length:1.25em_1.25em]">
                            <option>Status: Any</option>
                            <option>Approved</option>
                            <option>Pending</option>
                            <option>Waitlisted</option>
                            <option>Rejected</option>
                        </select>
                        <button className="h-10 px-4 py-2 bg-[#111623] border border-white/10 rounded-xl text-sm font-medium hover:bg-white/5 transition-all text-gray-300 flex items-center gap-2 shadow-inner">
                            <Filter className="w-4 h-4" />
                            More Filters
                        </button>
                    </div>
                </div>

                {/* Table Container */}
                <div className="overflow-x-auto min-h-[400px]">
                    <table className="w-full text-left border-collapse whitespace-nowrap">
                        <thead>
                            <tr className="bg-[#0b0f19] border-b border-white/5 text-[11px] uppercase tracking-wider text-gray-500">
                                <th className="px-6 py-4 font-semibold">Applicant Profile</th>
                                <th className="px-6 py-4 font-semibold">Contact Info</th>
                                <th className="px-6 py-4 font-semibold">Program & Date</th>
                                <th className="px-6 py-4 font-semibold">Application Status</th>
                                <th className="px-6 py-4 font-semibold">Payment Status</th>
                                <th className="px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-sm">
                            {applications.map((row, i) => (
                                <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                                    {/* Applicant Column */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-xl ${row.color} flex items-center justify-center text-sm font-bold text-white shadow-lg`}>
                                                {row.initial}
                                            </div>
                                            <div>
                                                <div className="font-semibold text-gray-200 group-hover:text-blue-400 transition-colors flex items-center gap-2">
                                                    {row.name}
                                                </div>
                                                <div className="text-[11px] text-gray-500 font-mono mt-0.5">{row.id}</div>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Contact Info Column */}
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-sm text-gray-300">{row.email}</span>
                                            <span className="text-xs text-gray-500">{row.phone}</span>
                                        </div>
                                    </td>

                                    {/* Program Column */}
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1">
                                            <div className="font-medium text-gray-300 flex items-center gap-1.5">
                                                <GraduationCap className="w-3.5 h-3.5 text-gray-500" />
                                                {row.program}
                                            </div>
                                            <span className="text-xs text-gray-500">{row.date}</span>
                                        </div>
                                    </td>

                                    {/* Status Column */}
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] uppercase tracking-wider font-bold rounded-full border
                                            ${row.status === 'Approved' ? 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10' :
                                                row.status === 'Pending' ? 'text-orange-400 border-orange-400/30 bg-orange-400/10' :
                                                    row.status === 'Waitlisted' ? 'text-gray-400 border-gray-400/30 bg-gray-400/10' :
                                                        'text-red-400 border-red-400/30 bg-red-400/10'
                                            }`}>
                                            {row.status === 'Approved' && <CheckCircle2 className="w-3 h-3" />}
                                            {row.status === 'Pending' && <Clock className="w-3 h-3" />}
                                            {row.status === 'Waitlisted' && <Clock className="w-3 h-3" />}
                                            {row.status === 'Rejected' && <XCircle className="w-3 h-3" />}
                                            {row.status}
                                        </span>
                                    </td>

                                    {/* Payment Column */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2.5 text-xs font-medium">
                                            {row.payment === 'Completed' && <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span></span>}
                                            {row.payment === 'Partial' && <span className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]"></span>}
                                            {row.payment === 'Pending' && <span className="w-2 h-2 rounded-full bg-gray-600"></span>}
                                            {row.payment === 'Failed' && <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"></span>}
                                            {row.payment === 'N/A' && <span className="w-2 h-2 rounded-full bg-white/10"></span>}

                                            <span className={
                                                row.payment === 'Completed' ? 'text-emerald-400' :
                                                    row.payment === 'Partial' ? 'text-amber-400' :
                                                        row.payment === 'Failed' ? 'text-red-400' :
                                                            'text-gray-500'
                                            }>{row.payment}</span>
                                        </div>
                                    </td>

                                    {/* Actions Column */}
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {row.status === 'Pending' && (
                                                <button className="text-[11px] font-semibold text-white bg-emerald-600 hover:bg-emerald-500 px-3 py-1.5 rounded-lg transition-colors">
                                                    Approve
                                                </button>
                                            )}
                                            <button className="p-1.5 text-gray-500 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                                                <MoreVertical className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Footer */}
                <div className="p-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-400 bg-[#0d1320]/50">
                    <div>Showing <span className="text-white font-medium">1</span> to <span className="text-white font-medium">6</span> of <span className="text-white font-medium">4,209</span> entries</div>
                    <div className="flex items-center gap-1.5">
                        <button className="p-2 rounded-lg bg-[#111623] border border-white/10 hover:bg-white/5 transition-colors disabled:opacity-50 text-gray-400 hover:text-white flex items-center">
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button className="w-8 h-8 rounded-lg bg-blue-600 text-white font-medium shadow-[0_0_15px_rgba(59,130,246,0.3)] flex items-center justify-center">1</button>
                        <button className="w-8 h-8 rounded-lg bg-[#111623] border border-white/10 hover:bg-white/5 transition-colors text-gray-400 hover:text-white flex items-center justify-center">2</button>
                        <button className="w-8 h-8 rounded-lg bg-[#111623] border border-white/10 hover:bg-white/5 transition-colors text-gray-400 hover:text-white flex items-center justify-center">3</button>
                        <span className="px-1 text-gray-600">...</span>
                        <button className="w-8 h-8 rounded-lg bg-[#111623] border border-white/10 hover:bg-white/5 transition-colors text-gray-400 hover:text-white flex items-center justify-center">42</button>
                        <button className="p-2 rounded-lg bg-[#111623] border border-white/10 hover:bg-white/5 transition-colors disabled:opacity-50 text-gray-400 hover:text-white flex items-center">
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
