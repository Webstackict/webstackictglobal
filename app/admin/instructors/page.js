"use client";

import { useState, useEffect } from "react";
import {
    Search, Filter, Plus, MoreVertical,
    Users, Edit3, Trash2, CheckCircle2,
    X, Mail, Linkedin, Twitter, Globe,
    Briefcase, Award, GraduationCap, ArrowRight
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
        },
        programIds: []
    });

    const [programs, setPrograms] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [insRes, progRes] = await Promise.all([
                fetch('/api/instructors'),
                fetch('/api/programs')
            ]);

            if (insRes.ok && progRes.ok) {
                const insData = await insRes.json();
                const progData = await progRes.json();
                setInstructors(insData);
                setPrograms(progData);
            }
        } catch (error) {
            console.error("Failed to fetch data", error);
            toast.error("Failed to load instructors and programs");
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
            socials: { linkedin: "", twitter: "", website: "" },
            programIds: []
        });
        setIsCreateModalOpen(true);
    };

    const handleOpenEditModal = (instructor) => {
        setIsEditMode(true);
        setActiveInstructorId(instructor.id);
        const assignedProgramIds = instructor.programs?.map(p => p.program_id) || [];

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
            },
            programIds: assignedProgramIds
        });
        setIsCreateModalOpen(true);
    };

    const toggleProgram = (id) => {
        setFormData(prev => ({
            ...prev,
            programIds: prev.programIds.includes(id)
                ? prev.programIds.filter(p => p !== id)
                : [...prev.programIds, id]
        }));
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
                fetchData();
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
                fetchData();
            } else {
                toast.error("Failed to delete instructor");
            }
        } catch (error) {
            toast.error("An error occurred");
        }
    };

    const filteredInstructors = instructors.filter(ins =>
        ins.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ins.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ins.expertise?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8 pb-12 relative animate-in fade-in duration-700">
            {/* Header & Actions */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center shadow-lg shadow-blue-500/10">
                        <Users className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 tracking-tight mb-1">
                            Instructors & Mentors
                        </h1>
                        <p className="text-sm text-gray-400 font-medium">Manage your elite teaching staff and their expertise.</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative w-full md:w-64 group">
                        <Search className="w-4 h-4 absolute text-gray-400 left-3.5 top-1/2 -translate-y-1/2 group-focus-within:text-blue-400 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search instructors..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-[#0a0e17]/80 backdrop-blur-md border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all shadow-inner"
                        />
                    </div>
                    <button
                        onClick={handleOpenCreateModal}
                        className="h-10 px-5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 rounded-xl text-sm font-semibold text-white shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all flex items-center gap-2 shrink-0 group"
                    >
                        <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                        <span className="hidden sm:inline">Add Instructor</span>
                    </button>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pt-2">
                {isLoading ? (
                    Array(6).fill(0).map((_, i) => (
                        <div key={i} className="h-[340px] rounded-3xl border border-white/5 bg-[#0a0e17]/40 animate-pulse"></div>
                    ))
                ) : filteredInstructors.length === 0 ? (
                    <div className="col-span-full py-20 text-center border border-white/5 rounded-3xl bg-[#0a0e17]/40 flex flex-col items-center backdrop-blur-xl">
                        <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mb-6">
                            <Users className="w-10 h-10 text-blue-400 opacity-80" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">No Instructors Found</h3>
                        <p className="text-gray-400 max-w-sm mb-6">Build your world-class faculty by adding your first instructor or mentor.</p>
                        <button onClick={handleOpenCreateModal} className="px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-medium text-white transition-all">
                            Add New Instructor
                        </button>
                    </div>
                ) : (
                    filteredInstructors.map((ins) => (
                        <div key={ins.id} className="bg-[#0b0f19]/80 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden hover:border-blue-500/30 transition-all duration-500 group shadow-lg hover:shadow-[0_0_40px_rgba(59,130,246,0.1)] hover:-translate-y-1 relative flex flex-col">
                            {/* Decorative Background */}
                            <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-br from-blue-600/20 via-purple-600/10 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[50px] rounded-full"></div>

                            {/* Actions Overlay */}
                            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 z-20">
                                <button onClick={() => handleOpenEditModal(ins)} className="p-2.5 bg-[#0a0e17]/80 backdrop-blur-md border border-white/10 rounded-xl hover:bg-blue-500/20 hover:border-blue-500/50 text-blue-400 transition-all shadow-lg" title="Edit Instructor">
                                    <Edit3 className="w-4 h-4" />
                                </button>
                                <button onClick={() => handleDelete(ins.id)} className="p-2.5 bg-[#0a0e17]/80 backdrop-blur-md border border-white/10 rounded-xl hover:bg-red-500/20 hover:border-red-500/50 text-red-400 transition-all shadow-lg" title="Delete Instructor">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="px-6 pt-8 pb-6 relative z-10 flex-1 flex flex-col">
                                <div className="flex justify-between items-start mb-5">
                                    <div className="relative">
                                        <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-white/10 shadow-xl bg-[#111623] relative z-10 group-hover:scale-105 transition-transform duration-500">
                                            {ins.photo_url ? (
                                                <img src={ins.photo_url} alt={ins.full_name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-3xl font-black text-transparent bg-clip-text bg-gradient-to-br from-blue-400 to-purple-500 uppercase">
                                                    {ins.full_name?.charAt(0) || "I"}
                                                </div>
                                            )}
                                        </div>
                                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#0b0f19] z-20 ${ins.is_active ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-red-500'}`}></div>
                                    </div>
                                </div>

                                <div className="space-y-1.5 mb-4">
                                    <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors tracking-tight line-clamp-1">{ins.full_name}</h3>
                                    <p className="text-sm font-medium text-blue-400 flex items-center gap-1.5 opacity-90">
                                        <Briefcase className="w-3.5 h-3.5" />
                                        <span className="line-clamp-1">{ins.title || "Instructor"}</span>
                                    </p>
                                </div>

                                <div className="flex flex-wrap gap-2 mb-4">
                                    {ins.expertise?.split(',').slice(0, 3).map((skill, idx) => (
                                        <span key={idx} className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/5 text-[11px] font-semibold text-gray-300 tracking-wide">
                                            {skill.trim()}
                                        </span>
                                    ))}
                                    {ins.expertise?.split(',').length > 3 && (
                                        <span className="px-2 py-1 rounded-lg bg-white/5 border border-white/5 text-[11px] font-semibold text-gray-500 hover:bg-white/10 cursor-default transition-colors" title={ins.expertise}>
                                            +{ins.expertise.split(',').length - 3}
                                        </span>
                                    )}
                                </div>

                                <p className="text-sm text-gray-400 line-clamp-3 leading-relaxed mb-6 flex-1">
                                    {ins.bio || "No professional biography provided."}
                                </p>

                                <div className="pt-5 border-t border-white/5 flex items-center justify-between mt-auto">
                                    <div className="flex gap-2.5">
                                        {ins.socials?.linkedin && (
                                            <a href={ins.socials.linkedin.startsWith('http') ? ins.socials.linkedin : `https://${ins.socials.linkedin}`} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#0077b5] hover:border-[#0077b5] transition-all shadow-sm">
                                                <Linkedin className="w-3.5 h-3.5" />
                                            </a>
                                        )}
                                        {ins.socials?.twitter && (
                                            <a href={ins.socials.twitter.startsWith('http') ? ins.socials.twitter : `https://${ins.socials.twitter}`} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#1da1f2] hover:border-[#1da1f2] transition-all shadow-sm">
                                                <Twitter className="w-3.5 h-3.5" />
                                            </a>
                                        )}
                                        {ins.socials?.website && (
                                            <a href={ins.socials.website.startsWith('http') ? ins.socials.website : `https://${ins.socials.website}`} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-white hover:border-white transition-all shadow-sm">
                                                <Globe className="w-3.5 h-3.5" />
                                            </a>
                                        )}
                                    </div>
                                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5 bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/5">
                                        <GraduationCap className="w-3.5 h-3.5 text-blue-500" />
                                        {ins.programs?.length || 0} Programs
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
                    <div className="bg-[#0b0f19] border border-white/10 rounded-3xl w-full max-w-3xl shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden animate-in zoom-in-95 duration-300 relative">
                        {/* Decorative modal header background */}
                        <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-blue-900/20 to-transparent pointer-events-none"></div>

                        <div className="flex justify-between items-center p-6 border-b border-white/5 relative z-10">
                            <div>
                                <h2 className="text-xl font-extrabold text-white flex items-center gap-2 tracking-tight">
                                    <Users className="w-5 h-5 text-blue-500" />
                                    {isEditMode ? 'Edit Instructor Profile' : 'Add New Instructor'}
                                </h2>
                                <p className="text-xs text-gray-400 mt-1 font-medium">Configure instructor details, bio, and assignments.</p>
                            </div>
                            <button onClick={() => setIsCreateModalOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all">
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8 max-h-[75vh] overflow-y-auto custom-scrollbar relative z-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block pl-1">Full Name <span className="text-red-500">*</span></label>
                                    <input required type="text" value={formData.full_name} onChange={(e) => setFormData({ ...formData, full_name: e.target.value })} className="w-full bg-[#111623] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500/50 focus:bg-[#1a2333] transition-all shadow-inner" placeholder="e.g. Sarah Adebayo" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block pl-1">Job Title</label>
                                    <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full bg-[#111623] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500/50 focus:bg-[#1a2333] transition-all shadow-inner" placeholder="e.g. Senior Data Scientist" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block pl-1">Expertise</label>
                                    <input type="text" value={formData.expertise} onChange={(e) => setFormData({ ...formData, expertise: e.target.value })} className="w-full bg-[#111623] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500/50 focus:bg-[#1a2333] transition-all shadow-inner" placeholder="Comma separated (e.g. Python, AI)" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block pl-1">Photo URL</label>
                                    <input type="text" value={formData.photo_url} onChange={(e) => setFormData({ ...formData, photo_url: e.target.value })} className="w-full bg-[#111623] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500/50 focus:bg-[#1a2333] transition-all shadow-inner" placeholder="https://" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block pl-1">Bio</label>
                                <textarea rows={4} value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} className="w-full bg-[#111623] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500/50 focus:bg-[#1a2333] transition-all resize-none shadow-inner" placeholder="Brief professional background..."></textarea>
                            </div>

                            <div className="bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/5 rounded-2xl p-6 space-y-5">
                                <h3 className="text-xs font-extrabold text-white uppercase tracking-widest flex items-center gap-2">
                                    <Globe className="w-4 h-4 text-gray-400" /> Social Links
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                    <div className="space-y-1.5">
                                        <div className="flex items-center gap-2 mb-1 pl-1">
                                            <Linkedin className="w-3.5 h-3.5 text-gray-400" />
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">LinkedIn</span>
                                        </div>
                                        <input type="text" value={formData.socials.linkedin} onChange={(e) => setFormData({ ...formData, socials: { ...formData.socials, linkedin: e.target.value } })} className="w-full bg-[#0a0e17] border border-white/5 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500/40 focus:bg-[#111623] transition-colors" placeholder="URL" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <div className="flex items-center gap-2 mb-1 pl-1">
                                            <Twitter className="w-3.5 h-3.5 text-gray-400" />
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Twitter / X</span>
                                        </div>
                                        <input type="text" value={formData.socials.twitter} onChange={(e) => setFormData({ ...formData, socials: { ...formData.socials, twitter: e.target.value } })} className="w-full bg-[#0a0e17] border border-white/5 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500/40 focus:bg-[#111623] transition-colors" placeholder="URL" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <div className="flex items-center gap-2 mb-1 pl-1">
                                            <Globe className="w-3.5 h-3.5 text-gray-400" />
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Website</span>
                                        </div>
                                        <input type="text" value={formData.socials.website} onChange={(e) => setFormData({ ...formData, socials: { ...formData.socials, website: e.target.value } })} className="w-full bg-[#0a0e17] border border-white/5 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500/40 focus:bg-[#111623] transition-colors" placeholder="URL" />
                                    </div>
                                </div>
                            </div>

                            {/* Program Assignment */}
                            <div className="space-y-4 pt-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block pl-1">Assigned Programs</label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                                    {programs.map(prog => {
                                        const isSelected = formData.programIds.includes(prog.id);
                                        return (
                                            <button
                                                key={prog.id}
                                                type="button"
                                                onClick={() => toggleProgram(prog.id)}
                                                className={`relative overflow-hidden p-3.5 rounded-xl border text-xs font-bold text-left transition-all group ${isSelected
                                                    ? 'bg-blue-600/10 border-blue-500 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.1)]'
                                                    : 'bg-[#111623] border-white/5 text-gray-500 hover:border-white/20 hover:text-gray-300'
                                                    }`}
                                            >
                                                {isSelected && <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-blue-400 to-blue-600"></div>}
                                                <div className="flex justify-between items-center">
                                                    <span className="line-clamp-1">{prog.name}</span>
                                                    {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" checked={formData.is_active} onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })} />
                                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                    <span className="ml-3 text-sm font-semibold text-gray-300">Active status (public view)</span>
                                </label>
                            </div>

                            <div className="pt-6 border-t border-white/5 flex flex-col-reverse sm:flex-row gap-3 justify-end items-center">
                                <button type="button" onClick={() => setIsCreateModalOpen(false)} className="w-full sm:w-auto px-6 py-3 rounded-xl text-sm font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-all">
                                    Cancel
                                </button>
                                <button type="submit" className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 rounded-xl text-sm font-bold text-white shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all flex items-center justify-center gap-2 group">
                                    {isEditMode ? 'Save Changes' : 'Add Instructor'}
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
