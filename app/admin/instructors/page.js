"use client";

import { useState, useEffect } from "react";
import {
    Search, Filter, Plus, MoreVertical,
    Users, Edit3, Trash2, CheckCircle2,
    X, Mail, Linkedin, Twitter, Globe,
    Briefcase, Award
} from "lucide-react";
import { toast } from "sonner";

export default function InstructorsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [instructors, setInstructors] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [activeInstructorId, setActiveInstructorId] = useState(null);

    const [formData, setFormData] = useState({
        full_name: "",
        title: "",
        expertise: "",
        bio: "",
        photo_url: "",
        is_active: true,
        socials: {
            linkedin: "",
            twitter: "",
            website: ""
        }
    });

    useEffect(() => {
        fetchInstructors();
    }, []);

    const fetchInstructors = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/instructors');
            if (res.ok) {
                const data = await res.json();
                setInstructors(data);
            }
        } catch (error) {
            console.error("Failed to fetch instructors", error);
            toast.error("Failed to load instructors");
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenCreateModal = () => {
        setIsEditMode(false);
        setActiveInstructorId(null);
        setFormData({
            full_name: "",
            title: "",
            expertise: "",
            bio: "",
            photo_url: "",
            is_active: true,
            socials: { linkedin: "", twitter: "", website: "" }
        });
        setIsCreateModalOpen(true);
    };

    const handleOpenEditModal = (instructor) => {
        setIsEditMode(true);
        setActiveInstructorId(instructor.id);
        setFormData({
            full_name: instructor.full_name,
            title: instructor.title || "",
            expertise: instructor.expertise || "",
            bio: instructor.bio || "",
            photo_url: instructor.photo_url || "",
            is_active: instructor.is_active,
            socials: {
                linkedin: instructor.socials?.linkedin || "",
                twitter: instructor.socials?.twitter || "",
                website: instructor.socials?.website || ""
            }
        });
        setIsCreateModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = isEditMode ? `/api/instructors/${activeInstructorId}` : '/api/instructors';
        const method = isEditMode ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                toast.success(`Instructor ${isEditMode ? 'updated' : 'created'} successfully!`);
                setIsCreateModalOpen(false);
                fetchInstructors();
            } else {
                const err = await res.json();
                toast.error(err.error || "Failed to save instructor");
            }
        } catch (error) {
            console.error(error);
            toast.error("An unexpected error occurred");
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this instructor? This action cannot be undone.")) return;

        try {
            const res = await fetch(`/api/instructors/${id}`, { method: 'DELETE' });
            if (res.ok) {
                toast.success("Instructor deleted successfully");
                fetchInstructors();
            } else {
                toast.error("Failed to delete instructor");
            }
        } catch (error) {
            toast.error("An error occurred");
        }
    };

    const filteredInstructors = instructors.filter(ins =>
        ins.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ins.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ins.expertise?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6 pb-12 relative animate-in fade-in duration-500">
            {/* Header Area */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white mb-1">Instructors & Mentors</h1>
                    <p className="text-sm text-gray-400">Manage your teaching staff, their bios, and area of expertise.</p>
                </div>
                <button
                    onClick={handleOpenCreateModal}
                    className="h-10 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 rounded-lg text-sm font-medium text-white shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Add Instructor
                </button>
            </div>

            {/* Toolbar */}
            <div className="bg-[#0a0e17]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-4 flex flex-col sm:flex-row gap-4 justify-between items-center shadow-lg">
                <div className="relative w-full group">
                    <Search className="w-4 h-4 absolute text-gray-500 left-3 top-1/2 -translate-y-1/2 group-focus-within:text-blue-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search by name, title, or expertise..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-[#111623] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all shadow-inner"
                    />
                </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                    Array(6).fill(0).map((_, i) => (
                        <div key={i} className="h-64 rounded-2xl border border-white/5 bg-[#0a0e17]/50 animate-pulse"></div>
                    ))
                ) : filteredInstructors.length === 0 ? (
                    <div className="col-span-full p-12 text-center text-gray-400 border border-white/5 rounded-2xl bg-[#0a0e17]/50 flex flex-col items-center">
                        <Users className="w-12 h-12 text-gray-600 mb-4" />
                        <p>No instructors found. Add your first team member!</p>
                    </div>
                ) : (
                    filteredInstructors.map((ins) => (
                        <div key={ins.id} className="bg-[#0a0e17]/80 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden hover:border-blue-500/30 transition-all group">
                            <div className="relative h-32 bg-gradient-to-br from-blue-900/40 to-black">
                                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => handleOpenEditModal(ins)} className="p-2 bg-black/50 backdrop-blur rounded-lg hover:bg-black/70 text-blue-400 transition-colors">
                                        <Edit3 className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => handleDelete(ins.id)} className="p-2 bg-black/50 backdrop-blur rounded-lg hover:bg-black/70 text-red-400 transition-colors">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="px-6 pb-6 relative">
                                <div className="absolute -top-12 left-6 w-24 h-24 rounded-2xl overflow-hidden border-4 border-[#0a0e17] shadow-xl bg-gray-800">
                                    {ins.photo_url ? (
                                        <img src={ins.photo_url} alt={ins.full_name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-gray-400">
                                            {ins.full_name.charAt(0)}
                                        </div>
                                    )}
                                </div>

                                <div className="mt-14 space-y-3">
                                    <div>
                                        <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">{ins.full_name}</h3>
                                        <p className="text-sm text-blue-500 font-medium">{ins.title}</p>
                                    </div>

                                    <div className="flex items-center gap-2 text-xs text-gray-400">
                                        <Award className="w-3.5 h-3.5" />
                                        <span>{ins.expertise}</span>
                                    </div>

                                    <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed">
                                        {ins.bio || "No bio provided."}
                                    </p>

                                    <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                                        <div className="flex gap-2">
                                            {ins.socials?.linkedin && (
                                                <a href={ins.socials.linkedin} target="_blank" rel="noreferrer" className="p-1.5 text-gray-500 hover:text-[#0077b5] transition-colors">
                                                    <Linkedin className="w-4 h-4" />
                                                </a>
                                            )}
                                            {ins.socials?.twitter && (
                                                <a href={ins.socials.twitter} target="_blank" rel="noreferrer" className="p-1.5 text-gray-500 hover:text-[#1da1f2] transition-colors">
                                                    <Twitter className="w-4 h-4" />
                                                </a>
                                            )}
                                            {ins.socials?.website && (
                                                <a href={ins.socials.website} target="_blank" rel="noreferrer" className="p-1.5 text-gray-500 hover:text-white transition-colors">
                                                    <Globe className="w-4 h-4" />
                                                </a>
                                            )}
                                        </div>
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${ins.is_active ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                                            {ins.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
                    <div className="bg-[#0f1523] border border-white/10 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center p-6 border-b border-white/5 bg-[#141b2d]">
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                <Users className="w-5 h-5 text-blue-500" />
                                {isEditMode ? 'Edit Instructor' : 'Add New Instructor'}
                            </h2>
                            <button onClick={() => setIsCreateModalOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide block">Full Name *</label>
                                    <input required type="text" value={formData.full_name} onChange={(e) => setFormData({ ...formData, full_name: e.target.value })} className="w-full bg-[#1a2333] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide block">Job Title (e.g. Lead Developer)</label>
                                    <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full bg-[#1a2333] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide block">Expertise (e.g. Data Science, UI/UX)</label>
                                    <input type="text" value={formData.expertise} onChange={(e) => setFormData({ ...formData, expertise: e.target.value })} className="w-full bg-[#1a2333] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide block">Photo URL</label>
                                    <input type="text" value={formData.photo_url} onChange={(e) => setFormData({ ...formData, photo_url: e.target.value })} className="w-full bg-[#1a2333] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all" placeholder="https://..." />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide block">Bio</label>
                                <textarea rows={4} value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} className="w-full bg-[#1a2333] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all resize-none"></textarea>
                            </div>

                            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-5 space-y-4">
                                <h3 className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                                    <Globe className="w-3.5 h-3.5" /> Social Links
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Linkedin className="w-3 h-3 text-gray-500" />
                                            <span className="text-[10px] font-bold text-gray-500 uppercase">LinkedIn</span>
                                        </div>
                                        <input type="text" value={formData.socials.linkedin} onChange={(e) => setFormData({ ...formData, socials: { ...formData.socials, linkedin: e.target.value } })} className="w-full bg-[#111623] border border-white/5 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500/50" placeholder="https://..." />
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Twitter className="w-3 h-3 text-gray-500" />
                                            <span className="text-[10px] font-bold text-gray-500 uppercase">Twitter</span>
                                        </div>
                                        <input type="text" value={formData.socials.twitter} onChange={(e) => setFormData({ ...formData, socials: { ...formData.socials, twitter: e.target.value } })} className="w-full bg-[#111623] border border-white/5 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500/50" placeholder="https://..." />
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Globe className="w-3 h-3 text-gray-500" />
                                            <span className="text-[10px] font-bold text-gray-500 uppercase">Website</span>
                                        </div>
                                        <input type="text" value={formData.socials.website} onChange={(e) => setFormData({ ...formData, socials: { ...formData.socials, website: e.target.value } })} className="w-full bg-[#111623] border border-white/5 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500/50" placeholder="https://..." />
                                    </div>
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
                                    {isEditMode ? 'Save Changes' : 'Add Instructor'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
