"use client";

import { useState } from "react";
import {
    DollarSign, TrendingUp, CreditCard, FileText,
    Download, Plus, Search, Filter, ArrowUpRight,
    ArrowDownRight, CheckCircle2, Clock, MoreVertical, Target
} from "lucide-react";

export default function FinancePage() {
    const [searchQuery, setSearchQuery] = useState("");

    const metrics = [
        { title: "Total Revenue (YTD)", value: "$845,250", change: "+24.5%", trend: "up", icon: DollarSign, color: "emerald" },
        { title: "Monthly Recurring", value: "$62,400", change: "+5.2%", trend: "up", icon: TrendingUp, color: "blue" },
        { title: "Outstanding Invoices", value: "$45,120", change: "-12.5%", trend: "down", icon: FileText, color: "amber" },
        { title: "Active Subscriptions", value: "342", change: "+18.4%", trend: "up", icon: CreditCard, color: "purple" }
    ];

    const transactions = [
        { id: "TXN-0928", student: "Alex Chen", amount: "$1,200.00", date: "Today, 10:24 AM", status: "Completed", type: "FSD Cohort Installment" },
        { id: "TXN-0927", student: "Corporate: TechCorp", amount: "$15,000.00", date: "Yesterday", status: "Completed", type: "Corporate Training Deposit" },
        { id: "TXN-0926", student: "Sarah Jenkins", amount: "$450.00", date: "Oct 12, 2024", status: "Pending", type: "Coworking Dedicated Desk" },
        { id: "TXN-0925", student: "Michael Chang", amount: "$2,400.00", date: "Oct 11, 2024", status: "Completed", type: "Cybersecurity Full Payment" },
        { id: "TXN-0924", student: "Elena Rodriguez", amount: "$800.00", date: "Oct 10, 2024", status: "Failed", type: "UI/UX Installment" },
    ];

    const invoices = [
        { id: "INV-2024-089", client: "Global Finance Ltd", amount: "$40,000", due: "Oct 30, 2024", status: "Draft" },
        { id: "INV-2024-088", client: "EcoSolutions Inc", amount: "$14,250", due: "Oct 15, 2024", status: "Sent" },
        { id: "INV-2024-087", client: "TechCorp Industries", amount: "$15,000", due: "Oct 01, 2024", status: "Overdue" },
    ];

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
                    <button className="h-10 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 rounded-lg text-sm font-medium text-white shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all flex items-center gap-2">
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
                            <h3 className="text-3xl font-bold text-white mb-1 tracking-tight">{metric.value}</h3>
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
                        <div className="overflow-x-auto">
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
                                    {transactions.map((txn, i) => (
                                        <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center text-gray-400 border border-white/10 shrink-0">
                                                        <DollarSign className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-gray-200 group-hover:text-emerald-400 transition-colors">{txn.student}</div>
                                                        <div className="text-[11px] text-gray-500 mt-0.5">{txn.type} &bull; <span className="font-mono text-gray-600">{txn.id}</span></div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="font-bold text-white">{txn.amount}</span>
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
                                    ))}
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
                            <span className="text-2xl font-bold text-white">$845k</span>
                            <span className="text-sm font-medium text-gray-500">Goal: $1.2M</span>
                        </div>
                        <div className="w-full bg-white/5 rounded-full h-2.5 mb-2 overflow-hidden">
                            <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-2.5 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" style={{ width: `70%` }}></div>
                        </div>
                        <p className="text-xs text-emerald-400 font-medium">+15% ahead of schedule</p>
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
                            {invoices.map((inv, i) => (
                                <div key={i} className="p-3 border border-white/5 bg-[#111623] rounded-xl hover:border-white/10 transition-colors flex flex-col gap-2">
                                    <div className="flex justify-between items-start">
                                        <div className="font-semibold text-sm text-gray-200">{inv.client}</div>
                                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${inv.status === 'Draft' ? 'bg-gray-800 text-gray-400' : inv.status === 'Sent' ? 'bg-blue-500/10 text-blue-400' : 'bg-red-500/10 text-red-400'}`}>
                                            {inv.status}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center mt-1">
                                        <span className="font-mono text-xs text-gray-500">{inv.id}</span>
                                        <div className="text-right flex flex-col">
                                            <span className="text-sm font-bold text-white">{inv.amount}</span>
                                            <span className="text-[10px] text-gray-500 flex items-center gap-1 justify-end"><Clock className="w-3 h-3" /> Due {inv.due}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
