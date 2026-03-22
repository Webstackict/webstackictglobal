"use client";

import { useState, useEffect } from "react";
import {
    DollarSign, TrendingUp, CreditCard, FileText,
    Download, Plus, Search, Filter, ArrowUpRight,
    ArrowDownRight, CheckCircle2, Clock, MoreVertical, Target, Loader2, X, Send
} from "lucide-react";
import { toast } from "sonner";

export default function FinancePage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [financeData, setFinanceData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Invoice Modal State
    const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
    const [isCreatingInvoice, setIsCreatingInvoice] = useState(false);
    const [invoiceData, setInvoiceData] = useState({
        client_name: "", client_email: "", amount: "", due_date: "", description: ""
    });

    const fetchFinanceData = async () => {
        try {
            const res = await fetch("/api/admin/finance");
            if (res.ok) {
                const data = await res.json();
                setFinanceData(data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchFinanceData();
    }, []);

    const handleCreateInvoice = async (e) => {
        e.preventDefault();
        setIsCreatingInvoice(true);
        try {
            const res = await fetch('/api/admin/invoices', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...invoiceData, status: 'Sent' })
            });
            const data = await res.json();
            if (res.ok) {
                toast.success(`Invoice ${data.invoice.invoice_number} created!`);
                setIsInvoiceModalOpen(false);
                setInvoiceData({ client_name: "", client_email: "", amount: "", due_date: "", description: "" });
                fetchFinanceData(); // Refresh payload
            } else {
                toast.error(data.error || "Failed to create invoice");
            }
        } catch (err) {
            toast.error("Network error");
        } finally {
            setIsCreatingInvoice(false);
        }
    };

    // Format currency internally (Naira)
    const formatNaira = (amount) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount || 0);
    };

    const metrics = [
        { title: "Total Revenue (YTD)", value: formatNaira(financeData?.metrics?.totalRevenue), change: "Active", trend: "up", icon: DollarSign, color: "emerald" },
        { title: "Monthly Revenue", value: formatNaira(financeData?.metrics?.monthlyRevenue), change: "30 Days", trend: "up", icon: TrendingUp, color: "blue" },
        { title: "Pending Payments", value: formatNaira(financeData?.metrics?.outstandingRevenue), change: "Outstanding", trend: "down", icon: FileText, color: "amber" },
        { title: "Active Enrollments", value: financeData?.metrics?.activeEnrollmentsCount || 0, change: "Live", trend: "up", icon: CreditCard, color: "purple" }
    ];

    const transactions = financeData?.transactions || [];
    const invoices = financeData?.invoices || [];

    const filteredTransactions = transactions.filter(txn =>
        txn.student.toLowerCase().includes(searchQuery.toLowerCase()) ||
        txn.id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6 pb-12">
            {/* Header Area */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white mb-1">Financial Overview</h1>
                    <p className="text-sm text-gray-400">Track revenue, manage student payments, and generate corporate invoices.</p>
                </div>
                <div className="flex gap-3">
                    <button className="h-10 px-4 py-2 bg-[#111623] border border-white/10 hover:bg-white/5 rounded-lg text-sm font-medium text-white transition-all flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Export Report
                    </button>
                    <button onClick={() => setIsInvoiceModalOpen(true)} className="h-10 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 rounded-lg text-sm font-medium text-white shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        Create Invoice
                    </button>
                </div>
            </div>

            {/* Financial Revenue Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {metrics.map((metric, i) => (
                    <div key={i} className="bg-[#0a0e17]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-white/10 transition-colors">
                        <div className={`absolute -right-6 -top-6 w-24 h-24 bg-${metric.color}-500/10 rounded-full blur-2xl group-hover:bg-${metric.color}-500/20 transition-all`}></div>
                        <div className="flex justify-between items-start mb-4 relative z-10">
                            <div className={`w-10 h-10 rounded-xl bg-${metric.color}-500/10 flex items-center justify-center text-${metric.color}-400 border border-${metric.color}-500/20 shadow-[0_0_10px_rgba(currentColor,0.2)]`}>
                                <metric.icon className="w-5 h-5" />
                            </div>
                            <span className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full 
                                ${metric.trend === 'up' ? 'text-emerald-400 bg-emerald-500/10' :
                                    metric.trend === 'down' ? 'text-emerald-400 bg-emerald-500/10' : // Outstanding down is good here
                                        'text-gray-400 bg-white/5'}`}>
                                {metric.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                {metric.change}
                            </span>
                        </div>
                        <div className="relative z-10">
                            {isLoading ? (
                                <div className="h-8 w-24 bg-white/5 rounded-lg animate-pulse mb-1 mt-1"></div>
                            ) : (
                                <h3 className="text-3xl font-bold text-white mb-1 tracking-tight">{metric.value}</h3>
                            )}
                            <p className="text-sm font-medium text-gray-500">{metric.title}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Main Transaction List */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="bg-[#0a0e17]/80 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-full">
                        {/* Table Header / Toolbar */}
                        <div className="p-5 border-b border-white/5 flex flex-col sm:flex-row gap-4 justify-between items-center bg-[#0d1320]">
                            <h2 className="text-lg font-bold text-white">Recent Transactions</h2>
                            <div className="flex gap-3 w-full sm:w-auto">
                                <div className="relative w-full sm:w-64 group">
                                    <Search className="w-4 h-4 absolute text-gray-500 left-3 top-1/2 -translate-y-1/2 group-focus-within:text-emerald-500 transition-colors" />
                                    <input
                                        type="text"
                                        placeholder="Search TXN ID or Name..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full bg-[#111623] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 transition-all shadow-inner"
                                    />
                                </div>
                                <button className="h-10 px-4 py-2 bg-[#111623] border border-white/10 rounded-xl text-sm font-medium hover:bg-white/5 transition-all text-gray-300 flex items-center gap-2 shadow-inner">
                                    <Filter className="w-4 h-4" /> Filters
                                </button>
                            </div>
                        </div>

                        {/* Table Content */}
                        <div className="overflow-x-auto min-h-[300px]">
                            <table className="w-full text-left border-collapse whitespace-nowrap">
                                <thead>
                                    <tr className="bg-[#0d1320]/50 border-b border-white/5 text-[11px] uppercase tracking-wider text-gray-500">
                                        <th className="px-6 py-4 font-semibold">Transaction Details</th>
                                        <th className="px-6 py-4 font-semibold">Amount</th>
                                        <th className="px-6 py-4 font-semibold">Status</th>
                                        <th className="px-6 py-4 font-semibold">Date</th>
                                        <th className="px-6 py-4 font-semibold text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5 text-sm">
                                    {isLoading ? (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                                <div className="flex justify-center items-center gap-2">
                                                    <Loader2 className="w-5 h-5 text-emerald-500 animate-spin" /> Fetching transactions...
                                                </div>
                                            </td>
                                        </tr>
                                    ) : filteredTransactions.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-12 text-center text-gray-500 italic">
                                                No transactions found in the database.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredTransactions.map((txn, i) => (
                                            <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center text-gray-400 border border-white/10 shrink-0">
                                                            <DollarSign className="w-5 h-5" />
                                                        </div>
                                                        <div>
                                                            <div className="font-semibold text-gray-200 group-hover:text-emerald-400 transition-colors">{txn.student}</div>
                                                            <div className="text-[11px] text-gray-500 mt-0.5" title={txn.type}>{txn.type.substring(0, 25)}{txn.type.length > 25 ? '...' : ''} &bull; <span className="font-mono text-gray-600">{txn.id}</span></div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="font-bold text-white">{formatNaira(txn.amount)}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] uppercase tracking-wider font-bold rounded-full border
                                                        ${txn.status === 'Completed' ? 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10' :
                                                            txn.status === 'Pending' ? 'text-amber-400 border-amber-400/30 bg-amber-400/10' :
                                                                'text-red-400 border-red-400/30 bg-red-400/10'}`}>
                                                        {txn.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-gray-400 text-xs">{txn.date}</td>
                                                <td className="px-6 py-4 text-right">
                                                    <button className="p-1.5 text-gray-500 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                                                        <MoreVertical className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Sidebar details */}
                <div className="space-y-6">
                    {/* Revenue Target Widget */}
                    <div className="bg-[#0a0e17]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-5 shadow-xl">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-5 flex items-center gap-2">
                            <Target className="w-4 h-4" /> Q4 Revenue Target
                        </h3>
                        <div className="flex items-end justify-between mb-2">
                            {isLoading ? <div className="h-6 w-20 bg-white/5 rounded animate-pulse"></div> : <span className="text-2xl font-bold text-white">{formatNaira(financeData?.metrics?.totalRevenue)}</span>}
                            <span className="text-sm font-medium text-gray-500">Goal: ₦150M</span>
                        </div>
                        <div className="w-full bg-white/5 rounded-full h-2.5 mb-2 overflow-hidden">
                            <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-2.5 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" style={{ width: `${Math.min(((financeData?.metrics?.totalRevenue || 0) / 150000000) * 100, 100)}%` }}></div>
                        </div>
                        <p className="text-xs text-emerald-400 font-medium">Tracking automatically from db</p>
                    </div>

                    {/* Outstanding Invoices */}
                    <div className="bg-[#0a0e17]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-5 shadow-xl">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-2">
                                <FileText className="w-4 h-4" /> Invoices
                            </h3>
                            <button className="text-xs text-emerald-400 hover:text-emerald-300 font-medium transition-colors">View All</button>
                        </div>

                        <div className="space-y-3">
                            {isLoading ? (
                                <div className="p-4 text-center text-gray-500 text-sm flex items-center justify-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Fetching invoices...</div>
                            ) : invoices.length === 0 ? (
                                <div className="p-4 bg-[#111623] border border-white/5 rounded-xl text-center text-sm text-gray-500 italic">No invoices found. Generate one to start!</div>
                            ) : invoices.map((inv, i) => (
                                <div key={i} className="p-3 border border-white/5 bg-[#111623] rounded-xl hover:border-white/10 transition-colors flex flex-col gap-2">
                                    <div className="flex justify-between items-start">
                                        <div className="font-semibold text-sm text-gray-200">{inv.client}</div>
                                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${inv.status === 'Draft' ? 'bg-gray-800 text-gray-400' : inv.status === 'Sent' ? 'bg-blue-500/10 text-blue-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                                            {inv.status}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center mt-1">
                                        <span className="font-mono text-xs text-emerald-500">{inv.id}</span>
                                        <div className="text-right flex flex-col">
                                            <span className="text-sm font-bold text-white">{formatNaira(inv.amount)}</span>
                                            <span className="text-[10px] text-gray-500 flex items-center gap-1 justify-end"><Clock className="w-3 h-3" /> Due {inv.due}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Create Invoice Modal */}
            {isInvoiceModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-[#0a0e17] border border-white/10 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center p-6 border-b border-white/5 bg-white/[0.02]">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <FileText className="w-5 h-5 text-teal-500" /> Create Corporate Invoice
                            </h2>
                            <button onClick={() => setIsInvoiceModalOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleCreateInvoice} className="p-6 space-y-5">
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-gray-300">Client / Company Name</label>
                                <input required type="text" value={invoiceData.client_name} onChange={e => setInvoiceData({ ...invoiceData, client_name: e.target.value })} placeholder="e.g. Acme Corp" className="w-full bg-[#111623] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-teal-500/50 transition-all shadow-inner" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-gray-300">Client Email</label>
                                <input required type="email" value={invoiceData.client_email} onChange={e => setInvoiceData({ ...invoiceData, client_email: e.target.value })} placeholder="billing@acme.com" className="w-full bg-[#111623] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-teal-500/50 transition-all shadow-inner" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-gray-300">Amount (₦)</label>
                                    <input required type="number" min="0" value={invoiceData.amount} onChange={e => setInvoiceData({ ...invoiceData, amount: e.target.value })} placeholder="500000" className="w-full bg-[#111623] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-teal-500/50 transition-all shadow-inner" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-gray-300">Due Date</label>
                                    <input required type="date" value={invoiceData.due_date} onChange={e => setInvoiceData({ ...invoiceData, due_date: e.target.value })} className="w-full bg-[#111623] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-400 focus:text-gray-200 focus:outline-none focus:border-teal-500/50 transition-all shadow-inner" />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-gray-300">Description / Memo</label>
                                <textarea rows={2} value={invoiceData.description} onChange={e => setInvoiceData({ ...invoiceData, description: e.target.value })} placeholder="Software Engineering Cohort Training..." className="w-full bg-[#111623] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-teal-500/50 transition-all shadow-inner resize-none"></textarea>
                            </div>
                            <div className="pt-4 flex gap-3">
                                <button type="button" onClick={() => setIsInvoiceModalOpen(false)} className="flex-1 py-2.5 bg-transparent border border-white/10 hover:bg-white/5 rounded-xl text-gray-300 font-semibold transition-all">Cancel</button>
                                <button type="submit" disabled={isCreatingInvoice} className="flex-1 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 text-white font-semibold rounded-xl shadow-lg transition-all disabled:opacity-70 flex items-center justify-center gap-2">
                                    {isCreatingInvoice ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Send className="w-4 h-4" /> Send Invoice</>}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
