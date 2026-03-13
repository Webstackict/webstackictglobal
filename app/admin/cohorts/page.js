"use client";

import { useState, useEffect } from "react";
import {
    Search, Filter, Plus, Calendar,
    MoreVertical, Edit3, Trash2, CheckCircle2,
    X, Clock, Users, Globe, Eye, EyeOff
} from "lucide-react";
import { toast } from "sonner";

// Native replacement for date-fns format
const formatDateISO = (date) => new Date(date).toISOString().split('T')[0];
const formatDatePretty = (date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

export default function CohortsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [cohorts, setCohorts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [activeId, setActiveId] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        cohort_code: "",
        cohort_number: "",
        start_date: "",
        graduation_date: "",
        enrollment_deadline: "",
        max_size: 100,
        status: "enrolling",
        visibility_logic: "public",
        description: "",
        label: "",
        duration: 3,
        online_seats: 0,
        onsite_seats: 0
    });

    useEffect(() => {
        fetchCohorts();
    }, []);

    const fetchCohorts = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/cohorts');
            if (res.ok) {
                const data = await res.json();
                setCohorts(data);
            }
        } catch (error) {
            console.error("Failed to fetch cohorts", error);
            toast.error("Failed to load cohorts");
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenCreate = () => {
        setIsEditMode(false);
        setActiveId(null);
        setFormData({
            name: "",
            cohort_code: "",
            cohort_number: "",
            start_date: "",
            graduation_date: "",
            enrollment_deadline: "",
            max_size: 100,
            status: "enrolling",
            visibility_logic: "public",
            description: "",
            label: "",
            duration: 3,
            online_seats: 0,
            onsite_seats: 0
        });
        setIsModalOpen(true);
    };

    const handleOpenEdit = (cohort) => {
        setIsEditMode(true);
        setActiveId(cohort.id);
        setFormData({
            name: cohort.name || "",
            cohort_code: cohort.cohort_code || "",
            cohort_number: cohort.cohort_number || "",
            start_date: cohort.start_date ? formatDateISO(cohort.start_date) : "",
            graduation_date: cohort.graduation_date ? formatDateISO(cohort.graduation_date) : "",
            enrollment_deadline: cohort.enrollment_deadline ? formatDateISO(cohort.enrollment_deadline) : "",
            max_size: cohort.max_size,
            status: cohort.status,
            visibility_logic: cohort.visibility_logic,
            description: cohort.description || "",
            label: cohort.label || "",
            duration: cohort.duration,
            online_seats: cohort.online_seats,
            onsite_seats: cohort.onsite_seats
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = isEditMode ? `/api/cohorts/${activeId}` : '/api/cohorts';
        const method = isEditMode ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                toast.success(`Cohort ${isEditMode ? 'updated' : 'created'} successfully!`);
                setIsModalOpen(false);
                fetchCohorts();
            } else {
                const err = await res.json();
                toast.error(err.error || "Failed to save cohort");
            }
        } catch (error) {
            console.error(error);
            toast.error("An unexpected error occurred");
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure? This will delete the cohort and all related enrollment constraints.")) return;
        try {
            const res = await fetch(`/api/cohorts/${id}`, { method: 'DELETE' });
            if (res.ok) {
                toast.success("Cohort deleted");
                fetchCohorts();
            }
        } catch (error) { toast.error("Error deleting cohort"); }
    };

    const filtered = cohorts.filter(c =>
        (c.name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
        (c.cohort_code?.toLowerCase() || "").includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6 pb-12 relative animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white mb-1">Cohort Management</h1>
                    <p className="text-sm text-gray-400">Manage intake periods, deadlines, and seat availability.</p>
                </div>
                <button
                    onClick={handleOpenCreate}
                    className="h-10 px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 rounded-lg text-sm font-medium text-white shadow-[0_0_15px_rgba(147,51,234,0.3)] transition-all flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    New Cohort
                </button>
            </div>

            <div className="bg-[#0a0e17]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-4 flex flex-col sm:flex-row gap-4 justify-between items-center shadow-lg">
                <div className="relative w-full group">
                    <Search className="w-4 h-4 absolute text-gray-500 left-3 top-1/2 -translate-y-1/2 group-focus-within:text-purple-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search by name or cohort code..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-[#111623] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-gray-200 focus:outline-none focus:border-purple-500/50 shadow-inner"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {isLoading ? (
                    Array(3).fill(0).map((_, i) => (
                        <div key={i} className="h-64 rounded-2xl border border-white/5 bg-[#0a0e17]/50 animate-pulse"></div>
                    ))
                ) : filtered.length === 0 ? (
                    <div className="col-span-full p-20 text-center text-gray-500 bg-[#0a0e17]/40 rounded-3xl border border-dashed border-white/10">
                        <Calendar className="w-12 h-12 mx-auto mb-4 opacity-20" />
                        <p>No cohorts found.</p>
                    </div>
                ) : (
                    filtered.map((c) => (
                        <div key={c.id} className="bg-[#0a0e17]/80 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden hover:border-purple-500/30 transition-all group p-6 space-y-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors">{c.name}</h3>
                                    <p className="text-xs font-mono text-purple-500">{c.cohort_code}</p>
                                </div>
                                <div className="flex gap-1">
                                    <button onClick={() => handleOpenEdit(c)} className="p-2 text-gray-500 hover:text-white transition-colors"><Edit3 className="w-4 h-4" /></button>
                                    <button onClick={() => handleDelete(c.id)} className="p-2 text-gray-500 hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-2">
                                <div className="space-y-1">
                                    <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider block">Starts</span>
                                    <div className="flex items-center gap-2 text-sm text-gray-300">
                                        <Calendar className="w-3.5 h-3.5 text-gray-600" />
                                        {formatDatePretty(c.start_date)}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider block">Deadline</span>
                                    <div className="flex items-center gap-2 text-sm text-pink-400">
                                        <Clock className="w-3.5 h-3.5" />
                                        {formatDatePretty(c.enrollment_deadline)}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                <div className="flex gap-4">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-gray-500 uppercase font-bold">Seats</span>
                                        <span className="text-sm text-gray-300 font-medium">{c.max_size}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-gray-500 uppercase font-bold">Status</span>
                                        <span className={`text-[10px] font-bold uppercase mt-1 px-2 py-0.5 rounded-full ${c.status === 'enrolling' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-gray-500/10 text-gray-400'
                                            }`}>
                                            {c.status}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {c.visibility_logic === 'public' ? <Globe className="w-4 h-4 text-emerald-500" /> : <EyeOff className="w-4 h-4 text-orange-500" />}
                                    <span className="text-xs text-gray-400 capitalize">{c.visibility_logic}</span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                    <div className="bg-[#0f1523] border border-white/10 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95">
                        <div className="flex justify-between items-center p-6 border-b border-white/5 bg-[#141b2d]">
                            <h2 className="text-xl font-bold text-white flex items-center gap-3">
                                <Calendar className="w-6 h-6 text-purple-500" />
                                {isEditMode ? 'Edit Cohort' : 'Create New Cohort'}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Intake Name *</label>
                                    <input required type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full bg-[#1a2333] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500/50" placeholder="e.g. April 2026 Shift" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Cohort Code *</label>
                                    <input required type="text" value={formData.cohort_code} onChange={(e) => setFormData({ ...formData, cohort_code: e.target.value })} className="w-full bg-[#1a2333] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500/50" placeholder="WS-2026-APR" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Start Date *</label>
                                    <input required type="date" value={formData.start_date} onChange={(e) => setFormData({ ...formData, start_date: e.target.value })} className="w-full bg-[#1a2333] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500/50" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Graduation *</label>
                                    <input required type="date" value={formData.graduation_date} onChange={(e) => setFormData({ ...formData, graduation_date: e.target.value })} className="w-full bg-[#1a2333] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500/50" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Deadline *</label>
                                    <input required type="date" value={formData.enrollment_deadline} onChange={(e) => setFormData({ ...formData, enrollment_deadline: e.target.value })} className="w-full bg-[#1a2333] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500/50" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Max Size</label>
                                    <input type="number" value={formData.max_size} onChange={(e) => setFormData({ ...formData, max_size: e.target.value })} className="w-full bg-[#1a2333] border border-white/10 rounded-xl px-4 py-3 text-white" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Status</label>
                                    <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full bg-[#1a2333] border border-white/10 rounded-xl px-4 py-3 text-white">
                                        <option value="enrolling">Enrolling</option>
                                        <option value="in_progress">In Progress</option>
                                        <option value="completed">Completed</option>
                                        <option value="closed">Closed</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Visibility</label>
                                    <select value={formData.visibility_logic} onChange={(e) => setFormData({ ...formData, visibility_logic: e.target.value })} className="w-full bg-[#1a2333] border border-white/10 rounded-xl px-4 py-3 text-white">
                                        <option value="public">Public</option>
                                        <option value="private">Private</option>
                                        <option value="hidden">Hidden</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Duration (Mo)</label>
                                    <input type="number" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} className="w-full bg-[#1a2333] border border-white/10 rounded-xl px-4 py-3 text-white" />
                                </div>
                            </div>

                            <div className="pt-8 flex gap-4 justify-end">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-8 py-3 rounded-xl text-sm font-bold text-gray-500 hover:text-white transition-all">Cancel</button>
                                <button type="submit" className="px-10 py-3 bg-purple-600 hover:bg-purple-500 rounded-xl text-sm font-bold text-white shadow-xl shadow-purple-600/30 transition-all">
                                    {isEditMode ? 'Update Intake' : 'Launch Cohort'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
