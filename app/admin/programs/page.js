"use client";

import { useState, useEffect } from "react";
import {
    Search, Filter, Plus, MoreVertical,
    BookOpen, Users, Calendar, Image as ImageIcon,
    Edit3, Trash2, CheckCircle2, Star, BookMarked, X
} from "lucide-react";
import { toast } from "sonner";

export default function ProgramsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [programs, setPrograms] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        description: "",
        duration: "",
        price: "",
        instructor: "",
        status: "ACTIVE"
    });

    useEffect(() => {
        fetchPrograms();
    }, []);

    const fetchPrograms = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/programs');
            if (res.ok) {
                const data = await res.json();
                setPrograms(data);
            }
        } catch (error) {
            console.error("Failed to fetch programs", error);
            toast.error("Failed to load programs");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateProgram = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/programs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                toast.success("Program created successfully!");
                setIsCreateModalOpen(false);
                setFormData({ title: "", slug: "", description: "", duration: "", price: "", instructor: "", status: "ACTIVE" });
                fetchPrograms();
            } else {
                const err = await res.json();
                toast.error(err.error || "Failed to create program");
            }
        } catch (error) {
            console.error(error);
            toast.error("An unexpected error occurred");
        }
    };

    const handleDeleteProgram = async (id) => {
        if (!confirm("Are you sure you want to delete this program?")) return;

        try {
            const res = await fetch(`/api/programs/${id}`, { method: 'DELETE' });
            if (res.ok) {
                toast.success("Program deleted successfully");
                fetchPrograms();
            } else {
                toast.error("Failed to delete program");
            }
        } catch (error) {
            toast.error("An error occurred");
        }
    };

    // Helper to generate fake styling based on random/index
    const getCardStyles = (i) => {
        const styles = [
            { color: 'from-blue-600 to-cyan-500', bg: 'bg-blue-500/10' },
            { color: 'from-purple-600 to-pink-500', bg: 'bg-purple-500/10' },
            { color: 'from-emerald-600 to-teal-500', bg: 'bg-emerald-500/10' },
            { color: 'from-orange-600 to-amber-500', bg: 'bg-orange-500/10' }
        ];
        return styles[i % styles.length];
    };

    return (
        <div className="space-y-6 pb-12 relative">
            {/* Header Area */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white mb-1">Programs & Curriculums</h1>
                    <p className="text-sm text-gray-400">Manage tech courses, assign instructors, and update curriculum content.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="h-10 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 rounded-lg text-sm font-medium text-white shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Create Program
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Main Programs List */}
                <div className="lg:col-span-2 space-y-4">

                    {/* Toolbar */}
                    <div className="bg-[#0a0e17]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-4 flex flex-col sm:flex-row gap-4 justify-between items-center shadow-lg">
                        <div className="relative w-full sm:w-80 group">
                            <Search className="w-4 h-4 absolute text-gray-500 left-3 top-1/2 -translate-y-1/2 group-focus-within:text-blue-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search programs..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-[#111623] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all shadow-inner"
                            />
                        </div>
                        <div className="flex gap-3 w-full sm:w-auto">
                            <button className="h-10 px-4 py-2 bg-[#111623] border border-white/10 rounded-xl text-sm font-medium hover:bg-white/5 transition-all text-gray-300 flex items-center gap-2 shadow-inner">
                                <Filter className="w-4 h-4" />
                                Filter
                            </button>
                        </div>
                    </div>

                    {/* Loading State */}
                    {isLoading && (
                        <div className="p-12 text-center text-gray-400 flex flex-col items-center justify-center border border-white/5 rounded-2xl bg-[#0a0e17]/50">
                            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                            Loading programs...
                        </div>
                    )}

                    {/* Empty State */}
                    {!isLoading && programs.length === 0 && (
                        <div className="p-12 text-center text-gray-400 border border-white/5 rounded-2xl bg-[#0a0e17]/50 flex flex-col items-center">
                            <BookOpen className="w-12 h-12 text-gray-600 mb-4" />
                            <p>No programs found. Create your first program to get started!</p>
                        </div>
                    )}

                    {/* Program Cards */}
                    {!isLoading && programs.map((prog, i) => {
                        const style = getCardStyles(i);
                        return (
                            <div key={prog.id} className="bg-[#0a0e17]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-5 hover:-translate-y-1 hover:shadow-xl hover:border-blue-500/30 transition-all flex flex-col sm:flex-row gap-6 items-start sm:items-center group">

                                {/* Icon / Image Placeholder */}
                                <div className="relative w-full sm:w-32 h-32 sm:h-24 rounded-xl overflow-hidden shrink-0 shadow-lg border border-white/10 group-hover:border-white/20 transition-colors">
                                    <div className={`absolute inset-0 bg-gradient-to-br ${style.color} opacity-20 group-hover:opacity-40 transition-opacity`}></div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <BookMarked className={`w-8 h-8 text-white drop-shadow-md`} />
                                    </div>
                                    <button className="absolute bottom-2 right-2 p-1.5 bg-black/50 backdrop-blur rounded-lg hover:bg-black/70 transition-colors opacity-0 group-hover:opacity-100">
                                        <ImageIcon className="w-4 h-4 text-white" />
                                    </button>
                                </div>

                                {/* Details */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                                        <div className="flex items-center gap-3">
                                            <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors truncate">{prog.title}</h3>
                                            <span className={`shrink-0 px-2.5 py-0.5 text-[10px] uppercase tracking-wider font-bold rounded-full 
                                                ${prog.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                                    prog.status === 'DRAFT' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' :
                                                        'bg-gray-500/10 text-gray-400 border border-gray-500/20'}`}>
                                                {prog.status}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors">
                                                <Edit3 className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => handleDeleteProgram(prog.id)} className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[10px] text-gray-500 uppercase font-semibold tracking-wider">Duration</span>
                                            <span className="text-sm font-medium text-gray-300 flex items-center gap-1.5">
                                                <Calendar className="w-3.5 h-3.5 text-gray-500" /> {prog.duration}
                                            </span>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[10px] text-gray-500 uppercase font-semibold tracking-wider">Instructor</span>
                                            <span className="text-sm font-medium text-gray-300 flex items-center gap-1.5 truncate">
                                                <Star className="w-3.5 h-3.5 text-orange-400" /> {prog.instructor || "Unassigned"}
                                            </span>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[10px] text-gray-500 uppercase font-semibold tracking-wider">Price</span>
                                            <span className="text-sm font-medium text-gray-300 flex items-center gap-1.5">
                                                <span className="text-blue-400 font-bold">$</span> {prog.price}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Sidebar Details Panels */}
                <div className="space-y-6">

                    {/* Active Cohorts Widget */}
                    <div className="bg-[#0a0e17]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-5 shadow-xl">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-5 flex items-center gap-2">
                            <BookOpen className="w-4 h-4" /> Active Cohorts Progress
                        </h3>
                        <div className="space-y-5">
                            {[
                                { name: 'FSD-2024-Q1', date: 'Jan 15 - Jun 15', percent: 75, color: "blue" },
                                { name: 'DSA-2024-Winter', date: 'Feb 01 - Jul 15', percent: 40, color: "purple" }
                            ].map((c, i) => (
                                <div key={i}>
                                    <div className="flex justify-between text-sm mb-1.5">
                                        <span className="font-semibold text-gray-200">{c.name}</span>
                                        <span className={`text-xs font-bold text-${c.color}-400`}>{c.percent}%</span>
                                    </div>
                                    <div className="w-full bg-white/5 rounded-full h-2 mb-1.5 overflow-hidden">
                                        <div className={`bg-${c.color}-500 h-2 rounded-full shadow-[0_0_10px_rgba(currentColor,0.5)]`} style={{ width: `${c.percent}%` }}></div>
                                    </div>
                                    <div className="text-[10px] text-gray-500 uppercase tracking-wider">{c.date}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Instructor Management Widget */}
                    <div className="bg-[#0a0e17]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-5 shadow-xl">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4 flex items-center gap-2">
                            <Users className="w-4 h-4" /> Lead Instructors
                        </h3>
                        <div className="space-y-3">
                            {[
                                { name: "Dr. Alan Turing", role: "Full-Stack Dev", status: "Available" },
                                { name: "Sarah Jenkins", role: "Data Science", status: "In Class" }
                            ].map((instructor, i) => (
                                <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors cursor-pointer">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gray-700 to-gray-500 flex items-center justify-center text-white font-bold border border-white/10 shrink-0">
                                        {instructor.name.charAt(0)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm font-semibold text-gray-200 truncate">{instructor.name}</div>
                                        <div className="text-[11px] text-gray-500">{instructor.role}</div>
                                    </div>
                                    <div className={`w-2 h-2 rounded-full ${instructor.status === "Available" ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" : "bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8)]"}`}></div>
                                </div>
                            ))}
                            <button className="w-full mt-2 py-2.5 border border-dashed border-white/20 rounded-xl text-xs font-semibold text-gray-400 hover:text-white hover:border-white/40 transition-colors flex items-center justify-center gap-2">
                                <Plus className="w-3.5 h-3.5" /> Assign New Instructor
                            </button>
                        </div>
                    </div>

                </div>
            </div>

            {/* Create Program Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-[#0f1523] border border-white/10 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center p-6 border-b border-white/5 bg-[#141b2d]">
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                <BookOpen className="w-5 h-5 text-blue-500" /> New Program
                            </h2>
                            <button onClick={() => setIsCreateModalOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleCreateProgram} className="p-6 space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide block">Program Title *</label>
                                    <input required type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full bg-[#1a2333] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all" placeholder="e.g. Master Front-End Design" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide block">Slug (URL) *</label>
                                    <input required type="text" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} className="w-full bg-[#1a2333] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all" placeholder="e.g. front-end-design" />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide block">Description *</label>
                                <textarea required rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full bg-[#1a2333] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all resize-none" placeholder="Provide a detailed overview of the curriculum..."></textarea>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide block">Duration *</label>
                                    <input required type="text" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} className="w-full bg-[#1a2333] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all" placeholder="e.g. 12 Weeks" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide block">Price (USD)</label>
                                    <input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className="w-full bg-[#1a2333] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all" placeholder="0.00" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide block">Status</label>
                                    <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full bg-[#1a2333] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all appearance-none cursor-pointer">
                                        <option value="ACTIVE">ACTIVE</option>
                                        <option value="DRAFT">DRAFT</option>
                                        <option value="ARCHIVED">ARCHIVED</option>
                                    </select>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-white/5 flex gap-3 justify-end">
                                <button type="button" onClick={() => setIsCreateModalOpen(false)} className="px-5 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all">
                                    Cancel
                                </button>
                                <button type="submit" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-medium text-white shadow-lg shadow-blue-600/20 transition-all">
                                    Create Program
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
