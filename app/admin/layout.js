"use client";

import { useState, useEffect } from "react";
import "./admin.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    BarChart3,
    Users,
    BookOpen,
    Calendar,
    LayoutTemplate,
    Megaphone,
    Briefcase,
    CreditCard,
    ShieldAlert,
    Settings,
    Search,
    Bell,
    Plus,
    LogOut,
    ChevronDown,
    Menu,
    GraduationCap,
    Share2,
    UserPlus,
    MessageSquare,
    X
} from "lucide-react";

export default function AdminLayout({ children }) {
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const isActive = (path) => pathname === path;

    // Close sidebar on path change (mobile)
    useEffect(() => {
        setIsSidebarOpen(false);
    }, [pathname]);

    const NavItem = ({ href, icon: Icon, label }) => (
        <Link
            href={href}
            onClick={() => setIsSidebarOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${isActive(href)
                ? "bg-blue-600/10 text-blue-500"
                : "text-gray-400 hover:bg-white/5 hover:text-gray-200"
                }`}
        >
            <Icon className={`w-5 h-5 ${isActive(href) ? "text-blue-500" : "text-gray-500 group-hover:text-gray-300 transition-colors"}`} />
            {label}
        </Link>
    );

    if (pathname === "/admin/login") {
        return <div className="admin-login-standalone">{children}</div>;
    }

    return (
        <div className="admin-dashboard min-h-screen bg-[#06080d] text-[#F9FAFB] font-sans selection:bg-blue-500/30">
            <div className="flex h-screen overflow-hidden">
                {/* Mobile Backdrop */}
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden transition-opacity duration-300"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}

                {/* Sidebar */}
                <aside className={`fixed inset-y-0 left-0 w-[280px] bg-[#0a0e17] border-r border-white/5 flex-shrink-0 flex flex-col z-40 lg:z-20 shadow-2xl shadow-black/50 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                    }`}>
                    <div className="h-[73px] flex items-center justify-between px-6 border-b border-white/5 bg-[#0a0e17]/80 backdrop-blur-xl shrink-0">
                        <Link href="/admin/dashboard" className="flex items-center gap-3 group">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-all">
                                W
                            </div>
                            <span className="text-lg font-bold tracking-tight text-white/90 group-hover:text-white transition-colors">
                                WEBSTACK Admin
                            </span>
                        </Link>
                        <button
                            className="lg:hidden p-1 text-gray-400 hover:text-white"
                            onClick={() => setIsSidebarOpen(false)}
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-8 scrollbar-thin scrollbar-thumb-white/10 hover:scrollbar-thumb-white/20">
                        {/* CORE */}
                        <div className="space-y-2">
                            <div className="px-3 text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-3">Core</div>
                            <NavItem href="/admin/dashboard" icon={BarChart3} label="Dashboard" />
                        </div>

                        {/* MODULES */}
                        <div className="space-y-2">
                            <div className="px-3 text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-3">Modules</div>
                            <NavItem href="/admin/admissions" icon={Users} label="Admissions" />
                            <NavItem href="/admin/scholarship-applications" icon={GraduationCap} label="Scholarships" />
                            <NavItem href="/admin/programs" icon={BookOpen} label="Programs" />
                            <NavItem href="/admin/instructors" icon={UserPlus} label="Instructors" />
                            <NavItem href="/admin/cohorts" icon={Calendar} label="Cohorts" />
                            <NavItem href="/admin/cms" icon={LayoutTemplate} label="Website CMS" />
                            <NavItem href="/admin/testimonials" icon={MessageSquare} label="Testimonials" />
                            <NavItem href="/admin/marketing" icon={Megaphone} label="Marketing" />
                            <NavItem href="/admin/referrals" icon={Share2} label="Referrals" />
                            <NavItem href="/admin/referrals/requests" icon={Users} label="Affiliate Requests" />
                            <NavItem href="/admin/referrals/commissions" icon={CreditCard} label="Commissions" />
                            <NavItem href="/admin/users/invite" icon={UserPlus} label="Invite User" />
                            <NavItem href="/admin/operations" icon={Briefcase} label="Operations" />
                            <NavItem href="/admin/finance" icon={CreditCard} label="Finance" />
                        </div>

                        {/* SETTINGS */}
                        <div className="space-y-2">
                            <div className="px-3 text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-3">Settings</div>
                            <NavItem href="/admin/users" icon={ShieldAlert} label="Admin Users" />
                            <NavItem href="/admin/settings" icon={Settings} label="Configuration" />
                        </div>
                    </div>
                </aside>

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col min-w-0 bg-[#06080d] relative">

                    {/* Top Navbar */}
                    <header className="h-[73px] bg-[#0a0e17]/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-6 flex-shrink-0 sticky top-0 z-10 w-full">
                        <div className="flex items-center flex-1 gap-6">
                            <button
                                className="text-gray-400 hover:text-white lg:hidden"
                                onClick={() => setIsSidebarOpen(true)}
                            >
                                <Menu className="w-6 h-6" />
                            </button>

                            {/* Search Bar */}
                            <div className="max-w-md w-full hidden md:block relative group">
                                <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-blue-500 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search students, transactions, or programs... (Cmd+K)"
                                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:bg-white/[0.05] focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all shadow-inner hover:bg-white/[0.05]"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            {/* Quick Actions */}
                            <button className="hidden sm:flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-blue-500/20">
                                <Plus className="w-4 h-4" />
                                <span className="hidden lg:inline">Quick Action</span>
                            </button>

                            <div className="w-[1px] h-6 bg-white/10 mx-2 hidden sm:block"></div>

                            {/* Notifications */}
                            <button className="relative p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/5">
                                <Bell className="w-5 h-5" />
                                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full border border-[#0a0e17]"></span>
                            </button>

                            {/* Admin Profile Dropdown (Simulated) */}
                            <div className="flex items-center gap-3 pl-2 cursor-pointer group rounded-lg hover:bg-white/5 p-1.5 transition-colors">
                                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-gray-700 to-gray-500 flex items-center justify-center text-white font-medium border border-white/10 shadow-sm overflow-hidden">
                                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" alt="Admin Avatar" className="w-full h-full object-cover" />
                                </div>
                                <div className="hidden lg:block">
                                    <div className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors">Admin User</div>
                                    <div className="text-[11px] text-gray-500">Super Admin</div>
                                </div>
                                <ChevronDown className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors hidden sm:block" />
                            </div>

                            {/* Logout Button */}
                            <button
                                className="p-2 text-gray-500 hover:text-red-400 transition-colors rounded-full hover:bg-red-500/10 ml-2"
                                onClick={() => {
                                    document.cookie = 'admin_token=; Max-Age=0; path=/;';
                                    window.location.href = '/admin/login';
                                }}
                            >
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    </header>

                    <main className="flex-1 overflow-y-auto p-4 sm:p-8 bg-[#06080d]">
                        <div className="mx-auto max-w-[1600px]">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
