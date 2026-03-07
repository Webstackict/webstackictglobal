"use client";

import {
    Users,
    BookOpen,
    DollarSign,
    TrendingUp,
    FileText,
    ArrowUpRight,
    ArrowDownRight,
    Activity,
    CreditCard,
    Target,
    Clock
} from "lucide-react";

export default function AdminDashboardPage() {
    return (
        <div className="space-y-8 pb-12">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Dashboard Overview</h1>
                    <p className="text-gray-400 text-sm mt-1">Real-time metrics and activity for Webstack ICT Global.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-[#0a0e17] border border-white/10 rounded-lg px-3 py-1.5 text-sm text-gray-300">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        Live Updates
                    </div>
                    <button className="bg-white text-black hover:bg-gray-100 px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg">
                        Download Report
                    </button>
                </div>
            </div>

            {/* Top Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* 1. Total Students */}
                <div className="bg-[#0a0e17]/80 backdrop-blur-xl border border-white/5 p-5 rounded-2xl shadow-xl relative overflow-hidden group hover:border-blue-500/30 transition-all">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -mr-10 -mt-10 transition-all group-hover:bg-blue-500/10"></div>
                    <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                            <Users className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-medium text-emerald-400 flex items-center bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                            <ArrowUpRight className="w-3 h-3 mr-1" /> +12.5%
                        </span>
                    </div>
                    <div className="relative z-10">
                        <div className="text-3xl font-bold text-white tracking-tight">2,845</div>
                        <div className="text-xs font-medium text-gray-400 mt-1 uppercase tracking-wider">Total Students</div>
                    </div>
                </div>

                {/* 2. Active Programs */}
                <div className="bg-[#0a0e17]/80 backdrop-blur-xl border border-white/5 p-5 rounded-2xl shadow-xl relative overflow-hidden group hover:border-purple-500/30 transition-all">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl -mr-10 -mt-10 transition-all group-hover:bg-purple-500/10"></div>
                    <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
                            <BookOpen className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-medium text-gray-500 flex items-center bg-gray-500/10 px-2 py-0.5 rounded-full border border-gray-500/20">
                            Constant
                        </span>
                    </div>
                    <div className="relative z-10">
                        <div className="text-3xl font-bold text-white tracking-tight">18</div>
                        <div className="text-xs font-medium text-gray-400 mt-1 uppercase tracking-wider">Active Programs</div>
                    </div>
                </div>

                {/* 3. Monthly Revenue */}
                <div className="bg-[#0a0e17]/80 backdrop-blur-xl border border-white/5 p-5 rounded-2xl shadow-xl relative overflow-hidden group hover:border-emerald-500/30 transition-all">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl -mr-10 -mt-10 transition-all group-hover:bg-emerald-500/10"></div>
                    <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <DollarSign className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-medium text-emerald-400 flex items-center bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                            <ArrowUpRight className="w-3 h-3 mr-1" /> +8.2%
                        </span>
                    </div>
                    <div className="relative z-10">
                        <div className="text-3xl font-bold text-white tracking-tight">$84.2K</div>
                        <div className="text-xs font-medium text-gray-400 mt-1 uppercase tracking-wider">Monthly Revenue</div>
                    </div>
                </div>

                {/* 4. New Leads */}
                <div className="bg-[#0a0e17]/80 backdrop-blur-xl border border-white/5 p-5 rounded-2xl shadow-xl relative overflow-hidden group hover:border-orange-500/30 transition-all">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-3xl -mr-10 -mt-10 transition-all group-hover:bg-orange-500/10"></div>
                    <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className="p-2 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20">
                            <Target className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-medium text-emerald-400 flex items-center bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                            <ArrowUpRight className="w-3 h-3 mr-1" /> +24%
                        </span>
                    </div>
                    <div className="relative z-10">
                        <div className="text-3xl font-bold text-white tracking-tight">142</div>
                        <div className="text-xs font-medium text-gray-400 mt-1 uppercase tracking-wider">New Leads</div>
                    </div>
                </div>

                {/* 5. Applications Today */}
                <div className="bg-[#0a0e17]/80 backdrop-blur-xl border border-white/5 p-5 rounded-2xl shadow-xl relative overflow-hidden group hover:border-blue-500/30 transition-all">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -mr-10 -mt-10 transition-all group-hover:bg-blue-500/10"></div>
                    <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                            <FileText className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-medium text-red-400 flex items-center bg-red-500/10 px-2 py-0.5 rounded-full border border-red-500/20">
                            <ArrowDownRight className="w-3 h-3 mr-1" /> -4%
                        </span>
                    </div>
                    <div className="relative z-10">
                        <div className="text-3xl font-bold text-white tracking-tight">38</div>
                        <div className="text-xs font-medium text-gray-400 mt-1 uppercase tracking-wider">Apps Today</div>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Wide Chart: Enrollment Growth */}
                <div className="lg:col-span-2 bg-[#0a0e17]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-base font-semibold text-white">Student Enrollment Growth</h3>
                            <p className="text-xs text-gray-500 mt-1">Total cumulative enrollments across all programs</p>
                        </div>
                        <select className="bg-transparent border border-white/10 text-gray-300 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-500">
                            <option>Last 6 Months</option>
                            <option>This Year</option>
                            <option>All Time</option>
                        </select>
                    </div>

                    {/* Simulated Recharts/Vercel Area Chart */}
                    <div className="h-[260px] w-full relative flex items-end justify-between px-2 pb-6 pt-10 border-b border-l border-white/10">
                        {/* Grid lines */}
                        <div className="absolute inset-0 border-b border-white/5 top-1/4"></div>
                        <div className="absolute inset-0 border-b border-white/5 top-2/4"></div>
                        <div className="absolute inset-0 border-b border-white/5 top-3/4"></div>

                        {/* Bars / Data Points */}
                        {[35, 45, 40, 60, 55, 75, 80, 70, 90, 85, 95, 100].map((height, i) => (
                            <div key={i} className="relative group w-full flex justify-center h-full items-end z-10">
                                <div
                                    className="w-[80%] max-w-[30px] rounded-t-[4px] bg-gradient-to-t from-blue-600/20 to-blue-400 group-hover:to-blue-300 group-hover:shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-all relative overflow-hidden"
                                    style={{ height: `${height}%` }}
                                >
                                    <div className="absolute top-0 inset-x-0 h-1 bg-white/30"></div>
                                </div>
                                <div className="absolute -bottom-6 text-[10px] text-gray-500 font-medium">
                                    {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i]}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Secondary Chart: Revenue Growth */}
                <div className="bg-[#0a0e17]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-6 shadow-xl w-full">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-base font-semibold text-white">Revenue Growth</h3>
                            <p className="text-xs text-gray-500 mt-1">Monthly collection</p>
                        </div>
                    </div>

                    <div className="h-[260px] w-full flex flex-col justify-end gap-3 pb-6 border-l border-white/10 px-4">
                        {[40, 60, 30, 80, 70, 100].map((width, i) => (
                            <div key={i} className="w-full flex items-center gap-3">
                                <div className="text-[10px] text-gray-500 w-6">M{i + 1}</div>
                                <div className="flex-1 h-6 rounded-full bg-white/5 overflow-hidden flex items-center">
                                    <div
                                        className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-emerald-400 relative overflow-hidden"
                                        style={{ width: `${width}%` }}
                                    >
                                        <div className="absolute top-0 inset-x-0 h-[1px] bg-white/40"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Widgets Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                {/* Widget 1: Recent Applications */}
                <div className="bg-[#0a0e17]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-5 shadow-xl flex flex-col h-[320px]">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                            <FileText className="w-4 h-4 text-blue-400" /> Recent Apps
                        </h3>
                        <a href="#" className="text-xs text-blue-400 hover:text-blue-300">View All</a>
                    </div>
                    <div className="flex-1 overflow-y-auto pr-2 space-y-4 scrollbar-thin scrollbar-thumb-white/10">
                        {[
                            { name: "Sarah Jenkins", prog: "Full Stack Dev", status: "Pending", color: "orange" },
                            { name: "Michael Chen", prog: "Data Science", status: "Approved", color: "emerald" },
                            { name: "Emma Wilson", prog: "UI/UX Design", status: "Under Review", color: "blue" },
                            { name: "David Okafor", prog: "Cybersecurity", status: "Pending", color: "orange" },
                            { name: "Lisa Thompson", prog: "Product Mgt", status: "Rejected", color: "red" }
                        ].map((app, i) => (
                            <div key={i} className="flex flex-col gap-1 pb-3 border-b border-white/5 last:border-0">
                                <div className="flex justify-between items-start">
                                    <span className="text-sm font-medium text-gray-200">{app.name}</span>
                                    <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-${app.color}-500/10 text-${app.color}-400 border border-${app.color}-500/20`}>
                                        {app.status}
                                    </span>
                                </div>
                                <span className="text-xs text-gray-500">{app.prog}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Widget 2: Latest Payments */}
                <div className="bg-[#0a0e17]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-5 shadow-xl flex flex-col h-[320px]">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                            <CreditCard className="w-4 h-4 text-emerald-400" /> Latest Payments
                        </h3>
                    </div>
                    <div className="flex-1 overflow-y-auto pr-2 space-y-4 scrollbar-thin scrollbar-thumb-white/10">
                        {[
                            { name: "James Anderson", amount: "$1,200", date: "2 mins ago" },
                            { name: "TechNova Inc.", amount: "$4,500", date: "1 hr ago" },
                            { name: "Sophia Martinez", amount: "$850", date: "3 hrs ago" },
                            { name: "Global Systems", amount: "$12,000", date: "Yesterday" },
                            { name: "Robert Taylor", amount: "$1,200", date: "Yesterday" }
                        ].map((payment, i) => (
                            <div key={i} className="flex items-center gap-3 pb-3 border-b border-white/5 last:border-0">
                                <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                                    <DollarSign className="w-4 h-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-medium text-gray-200 truncate">{payment.name}</div>
                                    <div className="text-xs text-gray-500">{payment.date}</div>
                                </div>
                                <div className="text-sm font-bold text-white">{payment.amount}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Widget 3: Program Popularity */}
                <div className="bg-[#0a0e17]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-5 shadow-xl flex flex-col h-[320px]">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-purple-400" /> Program Popularity
                        </h3>
                    </div>
                    <div className="flex-1 flex flex-col justify-center space-y-5">
                        {[
                            { name: "Full Stack Development", percent: 85, color: "blue" },
                            { name: "Data Science & AI", percent: 65, color: "purple" },
                            { name: "UI/UX UI Design", percent: 45, color: "pink" },
                            { name: "Cybersecurity", percent: 30, color: "emerald" }
                        ].map((prog, i) => (
                            <div key={i} className="space-y-1.5">
                                <div className="flex justify-between text-xs font-medium">
                                    <span className="text-gray-300">{prog.name}</span>
                                    <span className="text-gray-500">{prog.percent}%</span>
                                </div>
                                <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                                    <div className={`h-full rounded-full bg-${prog.color}-500/80 shadow-[0_0_10px_rgba(currentColor,0.5)]`} style={{ width: `${prog.percent}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Widget 4: Admin Activity Log */}
                <div className="bg-[#0a0e17]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-5 shadow-xl flex flex-col h-[320px]">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                            <Activity className="w-4 h-4 text-gray-400" /> Activity Log
                        </h3>
                    </div>
                    <div className="flex-1 overflow-y-auto pr-2 relative scrollbar-thin scrollbar-thumb-white/10">
                        <div className="absolute left-[11px] top-2 bottom-2 w-px bg-white/10"></div>
                        <div className="space-y-4">
                            {[
                                { user: "Super Admin", action: "Updated CMS settings", time: "10:42 AM" },
                                { user: "Finance Team", action: "Exported Q3 revenue", time: "09:15 AM" },
                                { user: "Admissions", action: "Approved 12 applications", time: "Yesterday" },
                                { user: "Super Admin", action: "Added new instructor", time: "Yesterday" },
                                { user: "Marketing", action: "Sent newsletter batch", time: "2 days ago" }
                            ].map((log, i) => (
                                <div key={i} className="relative pl-7">
                                    <div className="absolute left-0 top-1.5 w-6 h-6 rounded-full bg-[#0a0e17] border-2 border-white/20 flex items-center justify-center z-10">
                                        <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                                    </div>
                                    <div className="text-sm text-gray-300">
                                        <span className="font-medium text-white">{log.user}</span> {log.action}
                                    </div>
                                    <div className="text-[10px] text-gray-500 mt-0.5 flex items-center gap-1">
                                        <Clock className="w-3 h-3" /> {log.time}
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
