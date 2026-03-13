"use client";

import { useState, useEffect } from "react";
import {
    Search, Filter, MoreVertical,
    CheckCircle2, XCircle, Clock, GraduationCap,
    ChevronLeft, ChevronRight, Eye, RefreshCw
} from "lucide-react";
import { toast } from "sonner";
import { formatDate } from "@/util/util";

export default function ScholarshipApplicationsPage() {
    const [applications, setApplications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);

    const fetchApplications = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/scholarship-applications?status=${statusFilter}`);
            const data = await response.json();
            if (response.ok) {
                setApplications(data);
            } else {
                toast.error(data.error || "Failed to fetch applications");
            }
        } catch (error) {
            toast.error("An error occurred while fetching applications");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, [statusFilter]);

    const handleUpdateStatus = async (id, newStatus) => {
        setIsUpdating(true);
        try {
            const response = await fetch(`/api/scholarship-applications/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });

            if (response.ok) {
                toast.success(`Application ${newStatus} successfully`);
                fetchApplications();
                if (selectedApplication?.id === id) {
                    setSelectedApplication(null);
                }
            } else {
                const data = await response.json();
                toast.error(data.error || "Update failed");
            }
        } catch (error) {
            toast.error("An error occurred during update");
        } finally {
            setIsUpdating(false);
        }
    };

    const filteredApplications = applications.filter(app =>
        app.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6 pb-12">
            {/* Header Area */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white mb-1">Scholarship Management</h1>
                    <p className="text-sm text-gray-400">Review and manage scholarship applications from prospective students.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={fetchApplications}
                        className="h-10 px-4 py-2 bg-[#0a0e17] border border-white/10 rounded-lg text-sm font-medium hover:bg-white/5 transition-all text-white flex items-center gap-2 shadow-sm"
                    >
                        <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                        Refresh
                    </button>
                </div>
            </div>

            {/* Applications Data Table Area */}
            <div className="bg-[#0a0e17]/80 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
                {/* Table Toolbar */}
                <div className="p-5 border-b border-white/5 flex flex-col lg:flex-row gap-4 justify-between items-center bg-[#0d1320]/50">
                    <div className="relative w-full lg:w-96 group">
                        <Search className="w-4 h-4 absolute text-gray-500 left-3 top-1/2 -translate-y-1/2 group-focus-within:text-blue-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search applicant name or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-[#111623] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all shadow-inner"
                        />
                    </div>

                    <div className="flex flex-wrap gap-3 w-full lg:w-auto">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="bg-[#111623] border border-white/10 text-gray-300 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-500/50 shadow-inner appearance-none cursor-pointer pr-8 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCAyNCAyNCIgc3Ryb2tlPSIjOWNhM2FmIiBzdHJva2Utd2lkdGg9IjIiPjxwYXRoIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgZD0iTTE5IDlsLTcgNy03LTciLz48L3N2Zz4=')] bg-no-repeat bg-[right_0.75rem_center] bg-[length:1.25em_1.25em]"
                        >
                            <option value="All">All Statuses</option>
                            <option value="Pending">Pending</option>
                            <option value="Approved">Approved</option>
                            <option value="Rejected">Rejected</option>
                        </select>
                    </div>
                </div>

                {/* Table Container */}
                <div className="overflow-x-auto min-h-[400px]">
                    <table className="w-full text-left border-collapse whitespace-nowrap">
                        <thead>
                            <tr className="bg-[#0b0f19] border-b border-white/5 text-xs uppercase tracking-wider text-gray-500">
                                <th className="px-6 py-4 font-semibold">Applicant</th>
                                <th className="px-6 py-4 font-semibold">Contact Info</th>
                                <th className="px-6 py-4 font-semibold">Program & Date</th>
                                <th className="px-6 py-4 font-semibold">Status</th>
                                <th className="px-6 py-4 font-semibold">Referral</th>
                                <th className="px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-sm">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                        <div className="flex flex-col items-center gap-2">
                                            <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
                                            <p>Loading applications...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredApplications.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                        <div className="flex flex-col items-center gap-2">
                                            <p className="text-gray-400 mt-2 text-sm max-w-lg mx-auto">
                                                We couldn&apos;t find any applications matching your current filters. Try adjusting your search criteria or clear the filters to see all applications.
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredApplications.map((app) => (
                                    <tr key={app.id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-6 py-4 text-gray-200 font-medium">{app.full_name}</td>
                                        <td className="px-6 py-4 text-gray-400">{app.email}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-gray-300 flex items-center gap-1.5 font-medium">
                                                    < GraduationCap className="w-3.5 h-3.5 text-blue-400" />
                                                    {app.program}
                                                </span>
                                                <span className="text-xs text-gray-500">{formatDate(app.submitted_at)}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs uppercase tracking-wider font-bold rounded-full border
                                                ${app.status === 'approved' ? 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10' :
                                                    app.status === 'pending' ? 'text-orange-400 border-orange-400/30 bg-orange-400/10' :
                                                        'text-red-400 border-red-400/30 bg-red-400/10'
                                                }`}>
                                                {app.status === 'approved' && <CheckCircle2 className="w-3 h-3" />}
                                                {app.status === 'pending' && <Clock className="w-3 h-3" />}
                                                {app.status === 'rejected' && <XCircle className="w-3 h-3" />}
                                                {app.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-gray-400 font-mono text-xs">
                                                {app.referral_code || "—"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => setSelectedApplication(app)}
                                                    className="p-1.5 text-gray-500 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                                                    title="View Details"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                {app.status === 'pending' && (
                                                    <>
                                                        <button
                                                            disabled={isUpdating}
                                                            onClick={() => handleUpdateStatus(app.id, 'approved')}
                                                            className="text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                                                        >
                                                            Approve
                                                        </button>
                                                        <button
                                                            disabled={isUpdating}
                                                            onClick={() => handleUpdateStatus(app.id, 'rejected')}
                                                            className="text-xs font-semibold text-white bg-red-600/20 hover:bg-red-600/40 border border-red-600/30 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                                                        >
                                                            Reject
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer Info */}
                <div className="p-4 border-t border-white/5 text-sm text-gray-500 bg-[#0d1320]/50">
                    Total Applications: <span className="text-white font-medium">{filteredApplications.length}</span>
                </div>
            </div>

            {/* Details Modal */}
            {selectedApplication && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-[#0d1320] border border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in duration-200">
                        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#111623]">
                            <h2 className="text-xl font-bold text-white">Application Details</h2>
                            <button
                                onClick={() => setSelectedApplication(null)}
                                className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                            >
                                <XCircle className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="text-xs text-gray-500 uppercase font-bold tracking-wider">Full Name</label>
                                    <p className="text-gray-200 mt-1">{selectedApplication.full_name}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 uppercase font-bold tracking-wider">Email Address</label>
                                    <p className="text-gray-200 mt-1">{selectedApplication.email}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 uppercase font-bold tracking-wider">Phone Number</label>
                                    <p className="text-gray-200 mt-1">{selectedApplication.phone}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 uppercase font-bold tracking-wider">Location</label>
                                    <p className="text-gray-200 mt-1">{selectedApplication.state}, {selectedApplication.country}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 uppercase font-bold tracking-wider">Experience Level</label>
                                    <p className="text-gray-200 mt-1">{selectedApplication.experience_level}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 uppercase font-bold tracking-wider">Preferred Program</label>
                                    <p className="text-gray-200 mt-1 font-semibold text-blue-400">{selectedApplication.program}</p>
                                </div>
                                <div className="col-span-2">
                                    <label className="text-xs text-gray-500 uppercase font-bold tracking-wider">Referral Source</label>
                                    <p className="text-gray-200 mt-1 font-mono text-blue-300">
                                        {selectedApplication.referral_code || "None (Direct Application)"}
                                    </p>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 uppercase font-bold tracking-wider">Motivation / Personal Statement</label>
                                <div className="mt-2 p-4 bg-white/5 border border-white/10 rounded-xl text-gray-300 leading-relaxed italic">
                                    &quot;{selectedApplication.reason}&quot;
                                </div>
                            </div>
                        </div>
                        <div className="p-6 border-t border-white/5 bg-[#111623] flex justify-end gap-3">
                            {selectedApplication.status === 'pending' ? (
                                <>
                                    <button
                                        disabled={isUpdating}
                                        onClick={() => handleUpdateStatus(selectedApplication.id, 'approved')}
                                        className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-emerald-500/20"
                                    >
                                        Approve Application
                                    </button>
                                    <button
                                        disabled={isUpdating}
                                        onClick={() => handleUpdateStatus(selectedApplication.id, 'rejected')}
                                        className="px-6 py-2 bg-red-600/20 hover:bg-red-600/40 border border-red-600/30 text-white rounded-xl font-bold transition-all"
                                    >
                                        Reject
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => setSelectedApplication(null)}
                                    className="px-6 py-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl font-bold transition-all"
                                >
                                    Close
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
