"use client";

import { useState } from "react";
import {
    Search, Filter, Plus, TrendingUp, Users, Target,
    Mail, Phone, MailOpen, PieChart, Activity,
    MoreVertical, Eye, MessageSquare
} from "lucide-react";

export default function MarketingPage() {
    const [searchQuery, setSearchQuery] = useState("");

    const metrics = [
        { title: "Total Active Leads", value: "1,284", change: "+12.5%", trend: "up", icon: Users, color: "blue" },
        { title: "Conversion Rate", value: "8.4%", change: "+2.1%", trend: "up", icon: TrendingUp, color: "emerald" },
        { title: "Active Campaigns", value: "6", change: "0%", trend: "neutral", icon: Target, color: "purple" },
        { title: "Cost Per Lead", value: "$42.50", change: "-5.2%", trend: "down", icon: PieChart, color: "orange" }
    ];

    const leads = [
        {
            id: "LD-8042", name: "Alex Chen", email: "alex.chen@example.com", phone: "+1 (555) 019-2834",
            source: "Google Ads - FSD Campaign", status: "Hot", score: 92, lastContact: "2 hours ago", assignedTo: "Sarah J."
        },
        {
            id: "LD-8041", name: "Maria Garcia", email: "m.garcia99@example.com", phone: "+1 (555) 837-1122",
            source: "Organic Search", status: "Warm", score: 65, lastContact: "1 day ago", assignedTo: "Mike T."
        },
        {
            id: "LD-8040", name: "David Kim", email: "dkim_dev@example.com", phone: "+1 (555) 443-9812",
            source: "LinkedIn Post", status: "Cold", score: 28, lastContact: "3 days ago", assignedTo: "Sarah J."
        },
        {
            id: "LD-8039", name: "Jessica Smith", email: "jess.smith@example.com", phone: "+1 (555) 128-4455",
            source: "Referral", status: "Hot", score: 88, lastContact: "Just now", assignedTo: "Unassigned"
        },
        {
            id: "LD-8038", name: "Thomas Wilson", email: "twilson.tech@example.com", phone: "+1 (555) 998-3321",
            source: "Tech Meetup Event", status: "Warm", score: 55, lastContact: "5 hours ago", assignedTo: "Mike T."
        }
    ];

    return (
        <div className="space-y-6 pb-12">
            {/* Header Area */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white mb-1">Marketing & Leads</h1>
                    <p className="text-sm text-gray-400">Track campaign performance and manage the prospect pipeline.</p>
                </div>
                <div className="flex gap-3">
                    <button className="h-10 px-4 py-2 bg-[#111623] border border-white/10 hover:bg-white/5 rounded-lg text-sm font-medium text-white transition-all flex items-center gap-2">
                        <Activity className="w-4 h-4" />
                        View Reports
                    </button>
                    <button className="h-10 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 rounded-lg text-sm font-medium text-white shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        New Campaign
                    </button>
                </div>
            </div>

            {/* Campaign Analytics Overview */}
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
                                    metric.trend === 'down' ? 'text-emerald-400 bg-emerald-500/10' : // Cost down is good
                                        'text-gray-400 bg-white/5'}`}>
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

            {/* Lead Management CRM */}
            <div className="bg-[#0a0e17]/80 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden shadow-2xl flex flex-col mt-6">

                {/* Table Header / Toolbar */}
                <div className="p-5 border-b border-white/5 flex flex-col sm:flex-row gap-4 justify-between items-center bg-[#0d1320]">
                    <div className="flex items-center gap-4">
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                            <Users className="w-5 h-5 text-blue-500" />
                            Lead Pipeline
                        </h2>
                        <span className="px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-400 text-xs font-bold border border-blue-500/20">
                            {leads.length} Pending Contact
                        </span>
                    </div>
                    <div className="flex gap-3 w-full sm:w-auto">
                        <div className="relative w-full sm:w-64 group">
                            <Search className="w-4 h-4 absolute text-gray-500 left-3 top-1/2 -translate-y-1/2 group-focus-within:text-blue-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search leads by name, email..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-[#111623] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all shadow-inner"
                            />
                        </div>
                        <button className="h-10 px-4 py-2 bg-[#111623] border border-white/10 rounded-xl text-sm font-medium hover:bg-white/5 transition-all text-gray-300 flex items-center gap-2 shadow-inner">
                            <Filter className="w-4 h-4" />
                            <span className="hidden sm:inline">Filters</span>
                        </button>
                    </div>
                </div>

                {/* Table Content */}
                <div className="overflow-x-auto min-h-[400px]">
                    <table className="w-full text-left border-collapse whitespace-nowrap">
                        <thead>
                            <tr className="bg-[#0d1320]/50 border-b border-white/5 text-[11px] uppercase tracking-wider text-gray-500">
                                <th className="px-6 py-4 font-semibold">Lead Information</th>
                                <th className="px-6 py-4 font-semibold">Source & Score</th>
                                <th className="px-6 py-4 font-semibold">Status / Pipeline</th>
                                <th className="px-6 py-4 font-semibold">Last Contact</th>
                                <th className="px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-sm">
                            {leads.map((lead, i) => (
                                <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gray-800 to-gray-700 flex items-center justify-center text-white font-bold border border-white/10 shrink-0">
                                                {lead.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-semibold text-gray-200 group-hover:text-blue-400 transition-colors">{lead.name}</div>
                                                <div className="text-[11px] text-gray-500 flex items-center gap-2 mt-0.5">
                                                    <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {lead.email}</span>
                                                    <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {lead.phone}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1.5">
                                            <span className="text-xs text-gray-300">{lead.source}</span>
                                            <div className="flex items-center gap-2">
                                                <div className="w-24 bg-white/5 rounded-full h-1.5">
                                                    <div className={`h-1.5 rounded-full ${lead.score > 80 ? 'bg-emerald-500' : lead.score > 50 ? 'bg-blue-500' : 'bg-gray-500'}`} style={{ width: `${lead.score}%` }}></div>
                                                </div>
                                                <span className="text-[10px] font-bold text-gray-400">{lead.score} / 100</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1.5 items-start">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] uppercase tracking-wider font-bold rounded-full border
                                                ${lead.status === 'Hot' ? 'text-orange-400 border-orange-400/30 bg-orange-400/10 shadow-[0_0_10px_rgba(249,115,22,0.2)]' :
                                                    lead.status === 'Warm' ? 'text-blue-400 border-blue-400/30 bg-blue-400/10' :
                                                        'text-gray-400 border-white/10 bg-white/5'}`}>
                                                {lead.status === 'Hot' && <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse"></span>}
                                                {lead.status} Lead
                                            </span>
                                            <span className="text-[10px] text-gray-500 flex items-center gap-1">
                                                Assigned: <span className="text-gray-300 font-medium">{lead.assignedTo}</span>
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-gray-400 text-xs">
                                            <MailOpen className="w-3.5 h-3.5" /> {lead.lastContact}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="p-1.5 text-gray-500 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors" title="Message Lead">
                                                <MessageSquare className="w-4 h-4" />
                                            </button>
                                            <button className="p-1.5 text-gray-500 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors" title="View Profile">
                                                <Eye className="w-4 h-4" />
                                            </button>
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

                {/* Pagination Placeholder */}
                <div className="px-6 py-4 border-t border-white/5 bg-[#0d1320]/50 flex items-center justify-between text-sm">
                    <span className="text-gray-500">Showing <span className="text-white font-medium">1</span> to <span className="text-white font-medium">5</span> of <span className="text-white font-medium">1,284</span> entries</span>
                    <div className="flex gap-1">
                        <button className="px-3 py-1.5 border border-white/10 bg-[#111623] text-gray-400 rounded-md hover:text-white hover:border-white/20 transition-colors disabled:opacity-50" disabled>Prev</button>
                        <button className="px-3 py-1.5 border border-white/10 bg-blue-600/20 text-blue-400 rounded-md transition-colors font-medium">1</button>
                        <button className="px-3 py-1.5 border border-white/10 bg-[#111623] text-gray-400 rounded-md hover:text-white hover:border-white/20 transition-colors">2</button>
                        <button className="px-3 py-1.5 border border-white/10 bg-[#111623] text-gray-400 rounded-md hover:text-white hover:border-white/20 transition-colors">3</button>
                        <span className="px-2 py-1.5 text-gray-600">...</span>
                        <button className="px-3 py-1.5 border border-white/10 bg-[#111623] text-gray-400 rounded-md hover:text-white hover:border-white/20 transition-colors">Next</button>
                    </div>
                </div>

            </div>
        </div>
    );
}
