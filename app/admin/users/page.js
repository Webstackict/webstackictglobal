"use client";

import { useState, useEffect } from "react";
import {
    Users, Shield, Key, History, Plus,
    Search, Filter, MoreVertical, CheckCircle2,
    XCircle, Mail, Clock, Loader2
} from "lucide-react";
import { toast } from "sonner";

export default function UsersPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [admins, setAdmins] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAdmins = async () => {
            try {
                const res = await fetch('/api/admin/users');
                const data = await res.json();
                if (res.ok) {
                    setAdmins(data.staff || []);
                } else {
                    toast.error(data.error || "Failed to load staff");
                }
            } catch (err) {
                console.error(err);
                toast.error("Error loading administration staff");
            } finally {
                setIsLoading(false);
            }
        };
        fetchAdmins();
    }, []);

    const roles = [
        { name: "Super Admin", users: admins.filter(a => a.role === 'Super Admin').length, color: "rose" },
        { name: "Staff", users: admins.filter(a => a.role !== 'Super Admin').length, color: "blue" },
    ];

    const activityLogs = [
        { user: "System", action: "Session logs ready", time: "Now" },
    ];

    const filteredAdmins = admins.filter(admin =>
        admin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        admin.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        admin.role.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6 pb-12">
            {/* Header Area */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white mb-1">Users & Roles</h1>
                    <p className="text-sm text-gray-400">Manage internal staff accounts, roles, and access permissions.</p>
                </div>
                <div className="flex gap-3">
                    <button className="h-10 px-4 py-2 bg-[#111623] border border-white/10 hover:bg-white/5 rounded-lg text-sm font-medium text-white transition-all flex items-center gap-2">
                        <History className="w-4 h-4" />
                        Full Audit Log
                    </button>
                    <button className="h-10 px-4 py-2 bg-gradient-to-r from-rose-600 to-red-500 hover:from-red-500 hover:to-red-400 rounded-lg text-sm font-medium text-white shadow-[0_0_15px_rgba(225,29,72,0.3)] transition-all flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        Invite Admin
                    </button>
                </div>
            </div>

            {/* Quick Stats / Roles Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {roles.map((role, i) => (
                    <div key={i} className="bg-[#0a0e17]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-white/10 transition-colors">
                        <div className={`absolute -right-6 -top-6 w-24 h-24 bg-${role.color}-500/10 rounded-full blur-2xl group-hover:bg-${role.color}-500/20 transition-all`}></div>
                        <div className="flex justify-between items-center mb-2 relative z-10">
                            <h3 className="text-sm font-bold text-gray-400">{role.name}</h3>
                            <div className={`w-8 h-8 rounded-lg bg-${role.color}-500/10 flex items-center justify-center text-${role.color}-400 border border-${role.color}-500/20`}>
                                <Shield className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="relative z-10 flex items-end gap-2">
                            <span className="text-3xl font-bold text-white">{isLoading ? "..." : role.users}</span>
                            <span className="text-sm font-medium text-gray-500 mb-1">Users</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Main Users List */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="bg-[#0a0e17]/80 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-full">
                        {/* Table Header / Toolbar */}
                        <div className="p-5 border-b border-white/5 flex flex-col sm:flex-row gap-4 justify-between items-center bg-[#0d1320]">
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                <Users className="w-5 h-5 text-rose-500" /> Administrative Staff
                            </h2>
                            <div className="flex gap-3 w-full sm:w-auto">
                                <div className="relative w-full sm:w-64 group">
                                    <Search className="w-4 h-4 absolute text-gray-500 left-3 top-1/2 -translate-y-1/2 group-focus-within:text-rose-500 transition-colors" />
                                    <input
                                        type="text"
                                        placeholder="Search name, email, role..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full bg-[#111623] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-rose-500/50 transition-all shadow-inner"
                                    />
                                </div>
                                <button className="h-10 px-4 py-2 bg-[#111623] border border-white/10 rounded-xl text-sm font-medium hover:bg-white/5 transition-all text-gray-300 flex items-center gap-2 shadow-inner">
                                    <Filter className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Table Content */}
                        <div className="overflow-x-auto min-h-[300px]">
                            <table className="w-full text-left border-collapse whitespace-nowrap">
                                <thead>
                                    <tr className="bg-[#0d1320]/50 border-b border-white/5 text-xs uppercase tracking-wider text-gray-500">
                                        <th className="px-6 py-4 font-semibold">User Details</th>
                                        <th className="px-6 py-4 font-semibold">Role & Access</th>
                                        <th className="px-6 py-4 font-semibold">Status</th>
                                        <th className="px-6 py-4 font-semibold">Last Login</th>
                                        <th className="px-6 py-4 font-semibold text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5 text-sm">
                                    {isLoading ? (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                                <div className="flex items-center justify-center gap-2">
                                                    <Loader2 className="w-4 h-4 animate-spin text-rose-500" />
                                                    Loading staff members...
                                                </div>
                                            </td>
                                        </tr>
                                    ) : filteredAdmins.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-12 text-center text-gray-500 italic">
                                                No staff members found.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredAdmins.map((admin, i) => (
                                            <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gray-800 to-gray-700 flex items-center justify-center text-white font-bold border border-white/10 shrink-0 overflow-hidden text-sm uppercase">
                                                            {admin.avatar ? (
                                                                <img src={admin.avatar} alt={admin.name} className="w-full h-full object-cover" />
                                                            ) : admin.initials}
                                                        </div>
                                                        <div>
                                                            <div className="font-semibold text-gray-200 group-hover:text-rose-400 transition-colors">{admin.name}</div>
                                                            <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                                                <Mail className="w-3 h-3" /> {admin.email}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-lg border
                                                        ${admin.role === 'Super Admin' ? 'text-rose-400 border-rose-400/30 bg-rose-400/10' :
                                                            admin.role.includes('Finance') ? 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10' :
                                                                'text-blue-400 border-blue-400/30 bg-blue-400/10'}`}>
                                                        <Shield className="w-3.5 h-3.5" />
                                                        {admin.role}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider border ${admin.status === 'Active' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 'text-gray-400 bg-gray-500/10 border-gray-500/20'}`}>
                                                        {admin.status === 'Active' ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                                                        {admin.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-gray-400">
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="w-3.5 h-3.5" />
                                                        {admin.lastLogin ? new Date(admin.lastLogin).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "Never"}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button className="p-1.5 text-gray-500 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                                                        <MoreVertical className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        )))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Sidebar details */}
                <div className="space-y-6">
                    {/* Activity Log Widget */}
                    <div className="bg-[#0a0e17]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-5 shadow-xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-2">
                                <History className="w-4 h-4" /> Recent Activity
                            </h3>
                            <button className="text-xs text-rose-400 hover:text-rose-300 font-medium transition-colors">View All</button>
                        </div>

                        <div className="relative border-l border-white/10 ml-2 space-y-6">
                            {activityLogs.map((log, i) => (
                                <div key={i} className="relative pl-5">
                                    <div className="absolute -left-1.5 top-1 w-3 h-3 rounded-full bg-[#111623] border-2 border-rose-500"></div>
                                    <div className="font-medium text-sm text-gray-200 mb-0.5"><span className="text-rose-400 mr-1">{log.user}</span>{log.action}</div>
                                    <div className="text-xs text-gray-500 flex items-center gap-1"><Clock className="w-3 h-3" /> {log.time}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
