"use client";

import { useState, useEffect } from "react";
import {
    Search, CheckCircle2, XCircle, Clock, GraduationCap,
    Eye, RefreshCw, Layers, Banknote, CreditCard, Copy
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
                body: JSON.stringify({ payment_status: newStatus })
            });

            if (response.ok) {
                toast.success(`Application marked as ${newStatus}`);
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

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        toast.success("Copied to clipboard!");
    }

    const filteredApplications = applications.filter(app =>
        app.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.application_reference?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6 pb-12">
            {/* Header Area */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white mb-1">Scholarship Applications</h1>
                    <p className="text-sm text-gray-400">Review applicants and manually verify pending bank transfer payments.</p>
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
                            placeholder="Search by name, email, or reference id..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-[#111623] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all shadow-inner"
                        />
                    </div>

                    <div className="flex flex-wrap gap-3 w-full lg:w-auto">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="bg-[#111623] border border-white/10 text-gray-300 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-500/50 shadow-inner appearance-none cursor-pointer pr-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCAyNCAyNCIgc3Ryb2tlPSIjOWNhM2FmIiBzdHJva2Utd2lkdGg9IjIiPjxwYXRoIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgZD0iTTE5IDlsLTcgNy03LTciLz48L3N2Zz4=')] bg-no-repeat bg-[right_1rem_center] bg-[length:1em_1em]"
                        >
                            <option value="All">All Payment Statuses</option>
                            <option value="paid">Paid Evaluated</option>
                            <option value="pending_approval">Pending Bank Transfer</option>
                            <option value="unpaid">Unpaid Intention</option>
                            <option value="failed">Failed Payment</option>
                        </select>
                    </div>
                </div>

                {/* Table Container */}
                <div className="overflow-x-auto min-h-[400px]">
                    <table className="w-full text-left border-collapse whitespace-nowrap">
                        <thead>
                            <tr className="bg-[#0b0f19] border-b border-white/5 text-xs uppercase tracking-wider text-gray-500">
                                <th className="px-6 py-4 font-semibold">Applicant</th>
                                <th className="px-6 py-4 font-semibold">Program & Date</th>
                                <th className="px-6 py-4 font-semibold">Payment Status</th>
                                <th className="px-6 py-4 font-semibold">Gateway</th>
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
                                            <Layers className="w-10 h-10 text-gray-600 mb-2" />
                                            <p className="text-gray-400 font-medium">No scholarship applications matching this criteria.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredApplications.map((app) => (
                                    <tr key={app.id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-gray-200 font-medium">{app.full_name}</span>
                                                <span className="text-gray-400 text-xs mt-0.5">{app.email}</span>
                                                <span className="text-gray-500 text-xs font-mono mt-0.5" onClick={() => copyToClipboard(app.application_reference)} title="Click to copy Ref">Ref: {app.application_reference}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-gray-300 flex items-center gap-1.5 font-medium">
                                                    <GraduationCap className="w-3.5 h-3.5 text-blue-400" />
                                                    {app.program?.title || 'Unknown Program'}
                                                </span>
                                                <span className="text-xs text-gray-500">{formatDate(app.submitted_at)}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs uppercase tracking-wider font-bold rounded-full border
                                                ${app.payment_status === 'paid' ? 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10' :
                                                    app.payment_status === 'pending_approval' ? 'text-orange-400 border-orange-400/30 bg-orange-400/10' :
                                                        app.payment_status === 'unpaid' ? 'text-gray-400 border-gray-400/30 bg-gray-400/10' :
                                                            'text-red-400 border-red-400/30 bg-red-400/10'
                                                }`}>
                                                {app.payment_status === 'paid' && <CheckCircle2 className="w-3 h-3" />}
                                                {app.payment_status === 'pending_approval' && <Clock className="w-3 h-3" />}
                                                {app.payment_status === 'unpaid' && <Clock className="w-3 h-3" />}
                                                {app.payment_status === 'failed' && <XCircle className="w-3 h-3" />}
                                                {app.payment_status.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {app.payment_method === 'paystack' ? (
                                                <span className="inline-flex items-center gap-1.5 text-blue-400 bg-blue-500/10 px-2 py-1 rounded text-xs">
                                                    <CreditCard className="w-3.5 h-3.5" /> Paystack
                                                </span>
                                            ) : app.payment_method === 'bank_transfer' ? (
                                                <span className="inline-flex items-center gap-1.5 text-yellow-400 bg-yellow-500/10 px-2 py-1 rounded text-xs">
                                                    <Banknote className="w-3.5 h-3.5" /> Bank Trf
                                                </span>
                                            ) : (
                                                <span className="text-gray-600 text-xs">—</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => setSelectedApplication(app)}
                                                    className="p-1.5 text-gray-500 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                                                    title="View Full Profile"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                {app.payment_status === 'pending_approval' && (
                                                    <button
                                                        disabled={isUpdating}
                                                        onClick={() => handleUpdateStatus(app.id, 'paid')}
                                                        className="text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                                                    >
                                                        Verify Payment
                                                    </button>
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
                    Total Listed: <span className="text-white font-medium">{filteredApplications.length}</span>
                </div>
            </div>

            {/* Details Modal */}
            {selectedApplication && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-[#0d1320] border border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in duration-200">
                        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#111623]">
                            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                                <GraduationCap className="w-6 h-6 text-blue-500" /> Applicant Dossier
                            </h2>
                            <button
                                onClick={() => setSelectedApplication(null)}
                                className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                            >
                                <XCircle className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                            <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/10 border border-blue-500/20 rounded-xl p-5 mb-6">
                                <div className="flex flex-col md:flex-row gap-4 justify-between md:items-center">
                                    <div>
                                        <div className="text-xs text-blue-300 font-bold uppercase tracking-wider mb-1">Target Program</div>
                                        <div className="text-xl font-bold text-white">{selectedApplication.program?.title}</div>
                                        <div className="text-sm text-blue-200 flex items-center gap-2 mt-1 font-mono">
                                            Application Ref: {selectedApplication.application_reference}
                                            <Copy className="w-3 h-3 cursor-pointer hover:text-white" onClick={() => copyToClipboard(selectedApplication.application_reference)} />
                                        </div>
                                    </div>
                                    <div className="text-left md:text-right shrink-0">
                                        <div className="text-xl font-bold text-white">₦{Number(selectedApplication.application_fee).toLocaleString()}</div>
                                        <div className={`text-sm font-bold uppercase mt-1 ${selectedApplication.payment_status === 'paid' ? 'text-emerald-400' : 'text-orange-400'}`}>
                                            {selectedApplication.payment_status.replace('_', ' ')}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-y-6 gap-x-8">
                                <div>
                                    <label className="text-xs text-gray-500 uppercase font-bold tracking-wider">Full Legal Name</label>
                                    <p className="text-gray-200 mt-1.5 font-medium">{selectedApplication.full_name}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 uppercase font-bold tracking-wider">Contact Email</label>
                                    <p className="text-gray-200 mt-1.5 font-medium flex items-center gap-2">
                                        {selectedApplication.email}
                                        <Copy className="w-3.5 h-3.5 text-gray-500 cursor-pointer hover:text-white" onClick={() => copyToClipboard(selectedApplication.email)} />
                                    </p>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 uppercase font-bold tracking-wider">Phone</label>
                                    <p className="text-gray-200 mt-1.5 font-medium">{selectedApplication.phone}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 uppercase font-bold tracking-wider">Referral Code Used</label>
                                    <p className="text-gray-200 mt-1.5 font-mono text-blue-400 font-medium bg-blue-500/10 px-2 py-1 rounded inline-block">
                                        {selectedApplication.referral_code || "Direct (No Code)"}
                                    </p>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-white/5">
                                <label className="text-xs text-gray-500 uppercase font-bold tracking-wider">Personal Statement / About</label>
                                <div className="mt-3 p-5 bg-white/[0.03] border border-white/10 rounded-xl text-gray-300 leading-relaxed italic whitespace-pre-wrap">
                                    &quot;{selectedApplication.short_about_you}&quot;
                                </div>
                            </div>
                        </div>
                        <div className="p-6 border-t border-white/5 bg-[#111623] flex justify-between items-center gap-3">
                            <span className="text-xs text-gray-500">
                                Applied: {formatDate(selectedApplication.submitted_at)}
                            </span>

                            <div className="flex gap-3">
                                {selectedApplication.payment_status === 'pending_approval' && (
                                    <button
                                        disabled={isUpdating}
                                        onClick={() => handleUpdateStatus(selectedApplication.id, 'paid')}
                                        className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-emerald-500/20"
                                    >
                                        Verify Bank Transfer
                                    </button>
                                )}
                                <button
                                    onClick={() => setSelectedApplication(null)}
                                    className="px-6 py-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl font-bold transition-all"
                                >
                                    Close Dossier
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
