"use client";

import { useState, useEffect } from "react";
import {
    Search, Filter, Plus, MoreVertical,
    BookOpen, Users, Calendar, Image as ImageIcon,
    Edit3, Trash2, CheckCircle2, Star, BookMarked, X,
    ChevronRight, Info, BarChart3
} from "lucide-react";
import { toast } from "sonner";

export default function ProgramsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [programs, setPrograms] = useState([]);
    const [instructors, setInstructors] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [activeProgramId, setActiveProgramId] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        short_description: "",
        full_description: "",
        duration: "",
        price: "",
        discount_price: "",
        is_active: true,
        instructorIds: [] // Array of selected instructor IDs
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [progRes, insRes] = await Promise.all([
                fetch('/api/programs'),
                fetch('/api/instructors')
            ]);

            if (progRes.ok && insRes.ok) {
                const progData = await progRes.json();
                const insData = await insRes.json();
                setPrograms(progData);
                setInstructors(insData);
            }
        } catch (error) {
            console.error("Failed to fetch data", error);
            toast.error("Failed to load systems data");
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenCreateModal = () => {
        setIsEditMode(false);
        setActiveProgramId(null);
        setFormData({
            name: "",
            slug: "",
            short_description: "",
            full_description: "",
            duration: "",
            price: "",
            discount_price: "",
            is_active: true,
            instructorIds: []
        });
        setIsCreateModalOpen(true);
    };

    const handleOpenEditModal = (prog) => {
        setIsEditMode(true);
        setActiveProgramId(prog.id);
        const assignedInstructorIds = prog.instructors?.map(pi => pi.instructor_id) || [];

        setFormData({
            name: prog.name,
            slug: prog.slug,
            short_description: prog.short_description,
            full_description: prog.full_description || "",
            duration: prog.duration,
            price: prog.price,
            discount_price: prog.discount_price || "",
            is_active: prog.is_active,
            instructorIds: assignedInstructorIds
        });
        setIsCreateModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = isEditMode ? `/api/programs/${activeProgramId}` : '/api/programs';
        const method = isEditMode ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                toast.success(`Program ${isEditMode ? 'updated' : 'created'} successfully!`);
                setIsCreateModalOpen(false);
                fetchData();
            } else {
                const err = await res.json();
                toast.error(err.error || "Failed to save program");
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
                fetchData();
            } else {
                toast.error("Failed to delete program");
            }
        } catch (error) {
            toast.error("An error occurred");
        }
    };

    const toggleInstructor = (id) => {
        setFormData(prev => ({
            ...prev,
            instructorIds: prev.instructorIds.includes(id)
                ? prev.instructorIds.filter(i => i !== id)
                : [...prev.instructorIds, id]
        }));
    };

    const getCardStyles = (i) => {
        const styles = [
            { color: 'from-blue-600 to-cyan-500', bg: 'bg-blue-500/10' },
            { color: 'from-purple-600 to-pink-500', bg: 'bg-purple-500/10' },
            { color: 'from-emerald-600 to-teal-500', bg: 'bg-emerald-500/10' },
            { color: 'from-orange-600 to-amber-500', bg: 'bg-orange-500/10' }
        ];
        return styles[i % styles.length];
    };

    const filteredPrograms = programs.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.slug.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6 pb-12 relative animate-in fade-in duration-500">
            {/* Header Area */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white mb-1">Programs & Curriculums</h1>
                    <p className="text-sm text-gray-400">Manage tech courses, assign instructors, and update curriculum content.</p>
                </div>
                <button
                    onClick={handleOpenCreateModal}
                    className="h-10 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 rounded-lg text-sm font-medium text-white shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Create Program
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Programs List */}
                <div className="lg:col-span-2 space-y-4">
                    {/* Toolbar */}
                    <div className="bg-[#0a0e17]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-4 flex flex-col sm:flex-row gap-4 justify-between items-center shadow-lg">
                        <div className="relative w-full group">
                            <Search className="w-4 h-4 absolute text-gray-500 left-3 top-1/2 -translate-y-1/2 group-focus-within:text-blue-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search programs..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-[#111623] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all shadow-inner"
                            />
                        </div>
                    </div>

                    {/* Loading State */}
                    {isLoading && (
                        <div className="p-12 text-center text-gray-400 flex flex-col items-center justify-center border border-white/5 rounded-2xl bg-[#0a0e17]/50 animate-pulse">
                            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                            Syncing programs...
                        </div>
                    )}

                    {/* Empty State */}
                    {!isLoading && filteredPrograms.length === 0 && (
                        <div className="p-12 text-center text-gray-400 border border-white/5 rounded-2xl bg-[#0a0e17]/50 flex flex-col items-center">
                            <BookOpen className="w-12 h-12 text-gray-600 mb-4" />
                            <p>No programs found. Create your first program to get started!</p>
                        </div>
                    )}

                    {/* Program Cards */}
                    {!isLoading && filteredPrograms.map((prog, i) => {
                        const style = getCardStyles(i);
                        return (
                            <div key={prog.id} className="bg-[#0a0e17]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-5 hover:-translate-y-1 hover:shadow-xl hover:border-blue-500/30 transition-all flex flex-col sm:flex-row gap-6 items-start sm:items-center group">
                                <div className="relative w-full sm:w-32 h-32 sm:h-24 rounded-xl overflow-hidden shrink-0 shadow-lg border border-white/10 group-hover:border-white/20 transition-colors">
                                    <div className={`absolute inset-0 bg-gradient-to-br ${style.color} opacity-20 group-hover:opacity-40 transition-opacity`}></div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <BookMarked className="w-8 h-8 text-white drop-shadow-md" />
                                    </div>
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors truncate">{prog.name}</h3>
                                            <span className={`shrink-0 px-2.5 py-0.5 text-[10px] uppercase tracking-wider font-bold rounded-full 
                                                ${prog.is_active ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                                                {prog.is_active ? 'Active' : 'Hidden'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <button onClick={() => handleOpenEditModal(prog)} className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors">
                                                <Edit3 className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => handleDeleteProgram(prog.id)} className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    <p className="text-sm text-gray-500 line-clamp-1 mb-4">{prog.short_description}</p>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[10px] text-gray-500 uppercase font-semibold tracking-wider">Duration</span>
                                            <span className="text-sm font-medium text-gray-300 flex items-center gap-1.5">
                                                <Calendar className="w-3.5 h-3.5 text-gray-500" /> {prog.duration}
                                            </span>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[10px] text-gray-500 uppercase font-semibold tracking-wider">Price</span>
                                            <span className="text-sm font-medium text-gray-300 flex items-center gap-1.5">
                                                <span className="text-blue-400 font-bold">₦</span> {Number(prog.price).toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="flex flex-col gap-1 col-span-2">
                                            <span className="text-[10px] text-gray-500 uppercase font-semibold tracking-wider">Instructors</span>
                                            <div className="flex -space-x-2 overflow-hidden">
                                                {prog.instructors?.length > 0 ? prog.instructors.map((pi, idx) => (
                                                    <div key={idx} className="w-6 h-6 rounded-full border border-white/10 bg-gray-700 flex items-center justify-center text-[10px] text-white" title={pi.instructor.full_name}>
                                                        {pi.instructor.full_name.charAt(0)}
                                                    </div>
                                                )) : <span className="text-xs text-gray-600">Unassigned</span>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Sidebar Details Panels */}
                <div className="space-y-6">
                    {/* Stats Widget */}
                    <div className="bg-[#0a0e17]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-5 shadow-xl">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-5 flex items-center gap-2">
                            <BarChart3 className="w-4 h-4" /> Program Stats
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3">
                                <div className="text-2xl font-bold text-white">{programs.length}</div>
                                <div className="text-[10px] text-gray-500 uppercase">Total Courses</div>
                            </div>
                            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3">
                                <div className="text-2xl font-bold text-emerald-400">{programs.filter(p => p.is_active).length}</div>
                                <div className="text-[10px] text-gray-500 uppercase">Active</div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Access */}
                    <div className="bg-[#0a0e17]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-5 shadow-xl">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4 flex items-center gap-2">
                            <Info className="w-4 h-4" /> Quick Links
                        </h3>
                        <div className="space-y-2">
                            <button onClick={() => window.location.href = '/admin/instructors'} className="w-full flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-all text-sm group">
                                <div className="flex items-center gap-3">
                                    <Users className="w-4 h-4 text-blue-500" />
                                    <span className="text-gray-300">Manage Instructors</span>
                                </div>
                                <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-blue-500 transition-colors" />
                            </button>
                            <button onClick={() => window.location.href = '/admin/cohorts'} className="w-full flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-all text-sm group">
                                <div className="flex items-center gap-3">
                                    <Calendar className="w-4 h-4 text-purple-500" />
                                    <span className="text-gray-300">Manage Cohorts</span>
                                </div>
                                <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-purple-500 transition-colors" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Create Program Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
                    <div className="bg-[#0f1523] border border-white/10 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center p-6 border-b border-white/5 bg-[#141b2d]">
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                <BookOpen className="w-5 h-5 text-blue-500" />
                                {isEditMode ? 'Edit Program' : 'New Program'}
                            </h2>
                            <button onClick={() => setIsCreateModalOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto custom-scrollbar">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide block">Program Name *</label>
                                    <input required type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full bg-[#1a2333] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all" placeholder="e.g. Master Website Development" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide block">Slug (URL) *</label>
                                    <input required type="text" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} className="w-full bg-[#1a2333] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all" placeholder="master-website-dev" />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide block">Short Description *</label>
                                <input required type="text" value={formData.short_description} onChange={(e) => setFormData({ ...formData, short_description: e.target.value })} className="w-full bg-[#1a2333] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all" placeholder="A catchy 1-liner for cards..." />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide block">Full Description</label>
                                <textarea rows={4} value={formData.full_description} onChange={(e) => setFormData({ ...formData, full_description: e.target.value })} className="w-full bg-[#1a2333] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all resize-none" placeholder="Detailed curriculum overview..."></textarea>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide block">Duration *</label>
                                    <input required type="text" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} className="w-full bg-[#1a2333] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all" placeholder="3 Months" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide block">Price (₦) *</label>
                                    <input required type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className="w-full bg-[#1a2333] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide block">Discount Price (₦)</label>
                                    <input type="number" value={formData.discount_price} onChange={(e) => setFormData({ ...formData, discount_price: e.target.value })} className="w-full bg-[#1a2333] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all" />
                                </div>
                            </div>

                            {/* Instructor Selection */}
                            <div className="space-y-3">
                                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide block">Assign Instructors</label>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                    {instructors.map(ins => (
                                        <button
                                            key={ins.id}
                                            type="button"
                                            onClick={() => toggleInstructor(ins.id)}
                                            className={`p-2 rounded-xl border text-[10px] font-bold text-left transition-all ${formData.instructorIds.includes(ins.id)
                                                ? 'bg-blue-600/20 border-blue-500 text-blue-400'
                                                : 'bg-white/[0.02] border-white/5 text-gray-500 hover:border-white/10'
                                                }`}
                                        >
                                            {ins.full_name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <input type="checkbox" id="is_active" checked={formData.is_active} onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })} className="w-4 h-4 rounded border-white/10 bg-[#1a2333] text-blue-600 focus:ring-blue-500" />
                                <label htmlFor="is_active" className="text-sm font-medium text-gray-300">Active status (publicly visible)</label>
                            </div>

                            <div className="pt-6 border-t border-white/5 flex gap-3 justify-end">
                                <button type="button" onClick={() => setIsCreateModalOpen(false)} className="px-5 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all">
                                    Cancel
                                </button>
                                <button type="submit" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-medium text-white shadow-lg shadow-blue-600/20 transition-all">
                                    {isEditMode ? 'Update Program' : 'Create Program'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
