"use client";

import { useState } from "react";
import {
    Briefcase, CodeSquare, Coffee, Building2,
    MoreVertical, Plus, CheckCircle2, Clock,
    Users, FileText, Search, Filter
} from "lucide-react";

export default function OperationsPage() {
    const [activeTab, setActiveTab] = useState("corporate");
    const [searchQuery, setSearchQuery] = useState("");

    const clients = [
        { name: "TechCorp Industries", industry: "Manufacturing", contact: "John Davies", status: "Active", value: "$45,000", employeesTrained: 24 },
        { name: "Global Finance Ltd", industry: "Finance", contact: "Sarah Miles", status: "Negotiating", value: "$120,000", employeesTrained: 0 },
        { name: "EcoSolutions Inc", industry: "Energy", contact: "Michael Chang", status: "Active", value: "$28,500", employeesTrained: 12 },
    ];

    const projects = [
        { name: "Mobile App Development", client: "TechCorp", status: "In Progress", progress: 65, team: 4, deadline: "Oct 15, 2024" },
        { name: "Cloud Migration", client: "EcoSolutions", status: "Planning", progress: 15, team: 2, deadline: "Nov 01, 2024" },
        { name: "E-Commerce Replatform", client: "RetailPlus", status: "Completed", progress: 100, team: 5, deadline: "Sep 01, 2024" },
    ];

    const coworkers = [
        { name: "Alex Mercer", role: "Freelance Designer", plan: "Dedicated Desk", status: "Active", joined: "Jan 2024" },
        { name: "Priya Sharma", role: "Remote Developer", plan: "Hot Desk", status: "Active", joined: "Mar 2024" },
        { name: "James Wilson", role: "Startup Founder", plan: "Private Office", status: "Past Due", joined: "Nov 2023" },
        { name: "Elena Rodriguez", role: "Content Creator", plan: "Hot Desk", status: "Active", joined: "May 2024" },
    ];

    return (
        <div className="space-y-6 pb-12">
            {/* Header Area */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white mb-1">Business Operations</h1>
                    <p className="text-sm text-gray-400">Manage corporate training clients, consulting projects, and coworking spaces.</p>
                </div>
                <div className="flex gap-3">
                    <button className="h-10 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 rounded-lg text-sm font-medium text-white shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        {activeTab === 'corporate' ? "New Client" : activeTab === 'projects' ? "New Project" : "Add Member"}
                    </button>
                </div>
            </div>

            {/* Custom Tabs */}
            <div className="flex space-x-1 bg-[#0a0e17]/80 backdrop-blur-xl border border-white/5 p-1 rounded-xl w-fit overflow-x-auto">
                <button
                    onClick={() => setActiveTab('corporate')}
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${activeTab === 'corporate' ? 'bg-[#111623] text-white shadow-sm border border-white/5' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                >
                    <Building2 className="w-4 h-4" /> Corporate Clients
                </button>
                <button
                    onClick={() => setActiveTab('projects')}
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${activeTab === 'projects' ? 'bg-[#111623] text-white shadow-sm border border-white/5' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                >
                    <CodeSquare className="w-4 h-4" /> Consulting Projects
                </button>
                <button
                    onClick={() => setActiveTab('coworking')}
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${activeTab === 'coworking' ? 'bg-[#111623] text-white shadow-sm border border-white/5' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                >
                    <Coffee className="w-4 h-4" /> Coworking Hub
                </button>
            </div>

            {/* Tab content areas */}
            <div className="bg-[#0a0e17]/80 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden shadow-2xl">

                {/* 1. Corporate Clients Tab */}
                {activeTab === 'corporate' && (
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {clients.map((client, i) => (
                                <div key={i} className="bg-[#111623] border border-white/5 rounded-2xl p-5 hover:border-emerald-500/30 transition-all group flex flex-col justify-between">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20">
                                                <Briefcase className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-200 group-hover:text-emerald-400 transition-colors">{client.name}</h3>
                                                <span className="text-[11px] text-gray-500 uppercase tracking-wider font-semibold">{client.industry}</span>
                                            </div>
                                        </div>
                                        <button className="p-1.5 text-gray-500 hover:text-white rounded-lg transition-colors">
                                            <MoreVertical className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <div className="space-y-3 mt-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Contract Value:</span>
                                            <span className="font-medium text-emerald-400">{client.value}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Employees Trained:</span>
                                            <span className="text-gray-300 flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> {client.employeesTrained}</span>
                                        </div>
                                        <div className="flex justify-between text-sm pt-3 border-t border-white/5">
                                            <span className="text-gray-500">{client.contact}</span>
                                            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${client.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-orange-500/10 text-orange-400'}`}>
                                                {client.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 2. Consulting Projects Tab */}
                {activeTab === 'projects' && (
                    <div className="p-6">
                        <div className="space-y-4">
                            {projects.map((project, i) => (
                                <div key={i} className="bg-[#111623] border border-white/5 rounded-2xl p-5 hover:border-indigo-500/30 transition-all group flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-lg font-bold text-gray-200 group-hover:text-indigo-400 transition-colors truncate">{project.name}</h3>
                                            <span className={`shrink-0 px-2.5 py-0.5 text-[10px] uppercase tracking-wider font-bold rounded-full 
                                                ${project.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                                    project.status === 'In Progress' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                                                        'bg-orange-500/10 text-orange-400 border border-orange-500/20'}`}>
                                                {project.status}
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                                            <span className="flex items-center gap-1.5"><Building2 className="w-4 h-4 text-gray-400" /> {project.client}</span>
                                            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-gray-400" /> Due: {project.deadline}</span>
                                            <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-gray-400" /> {project.team} Assigned</span>
                                        </div>
                                    </div>
                                    <div className="w-full sm:w-64 shrink-0 flex flex-col gap-2">
                                        <div className="flex justify-between text-xs font-semibold">
                                            <span className="text-gray-400">Progress</span>
                                            <span className="text-indigo-400">{project.progress}%</span>
                                        </div>
                                        <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                                            <div className="bg-indigo-500 h-2 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)] transition-all duration-500" style={{ width: `${project.progress}%` }}></div>
                                        </div>
                                    </div>
                                    <button className="hidden sm:block p-2 text-gray-500 hover:text-white rounded-lg transition-colors">
                                        <MoreVertical className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 3. Coworking Members Tab */}
                {activeTab === 'coworking' && (
                    <div className="flex flex-col">
                        <div className="p-4 border-b border-white/5 flex flex-col sm:flex-row gap-4 justify-between items-center bg-[#0d1320]">
                            <div className="relative w-full sm:w-80 group">
                                <Search className="w-4 h-4 absolute text-gray-500 left-3 top-1/2 -translate-y-1/2 group-focus-within:text-emerald-500 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search members..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-[#111623] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 transition-all"
                                />
                            </div>
                            <button className="h-10 px-4 py-2 bg-[#111623] border border-white/10 rounded-xl text-sm font-medium hover:bg-white/5 transition-all text-gray-300 flex items-center gap-2">
                                <Filter className="w-4 h-4" /> Filters
                            </button>
                        </div>
                        <div className="overflow-x-auto min-h-[300px]">
                            <table className="w-full text-left border-collapse whitespace-nowrap">
                                <thead>
                                    <tr className="bg-[#0d1320]/50 border-b border-white/5 text-[11px] uppercase tracking-wider text-gray-500">
                                        <th className="px-6 py-4 font-semibold">Member</th>
                                        <th className="px-6 py-4 font-semibold">Plan Type</th>
                                        <th className="px-6 py-4 font-semibold">Status</th>
                                        <th className="px-6 py-4 font-semibold">Joined At</th>
                                        <th className="px-6 py-4 font-semibold text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5 text-sm">
                                    {coworkers.map((member, i) => (
                                        <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-600 flex items-center justify-center text-white font-bold shrink-0">
                                                        {member.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-gray-200 group-hover:text-emerald-400 transition-colors">{member.name}</div>
                                                        <div className="text-[11px] text-gray-500 mt-0.5">{member.role}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-gray-300 font-medium flex items-center gap-1.5">
                                                    <Coffee className="w-4 h-4 text-gray-500" /> {member.plan}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-bold border ${member.status === 'Active' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 'text-red-400 bg-red-500/10 border-red-500/20'}`}>
                                                    {member.status === 'Active' ? <CheckCircle2 className="w-3 h-3" /> : <div className="w-1.5 h-1.5 rounded-full bg-red-500 ml-0.5 mr-1 animate-pulse"></div>}
                                                    {member.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-400">{member.joined}</td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="p-1.5 text-gray-500 hover:text-white rounded-lg transition-colors">
                                                    <MoreVertical className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
