"use client";

import { useState, useEffect } from "react";
import {
    Search, Plus, Edit, Trash2,
    CheckCircle2, XCircle, RefreshCw, Layers
} from "lucide-react";
import { toast } from "sonner";
import { formatDate } from "@/util/util";

export default function ScholarshipProgramsPage() {
    const [programs, setPrograms] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProgram, setEditingProgram] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        short_description: "",
        full_description: "",
        duration: "3 months",
        application_fee: 30000,
        status: "active",
        display_order: 0
    });

    const fetchPrograms = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/scholarship-programs');
            const data = await response.json();
            if (response.ok) {
                setPrograms(data);
            } else {
                toast.error(data.error || "Failed to fetch programs");
            }
        } catch (error) {
            toast.error("An error occurred while fetching programs");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPrograms();
    }, []);

    const handleOpenModal = (program = null) => {
        if (program) {
            setEditingProgram(program);
            setFormData({
                title: program.title,
                slug: program.slug,
                short_description: program.short_description,
                full_description: program.full_description || "",
                duration: program.duration,
                application_fee: program.application_fee,
                status: program.status,
                display_order: program.display_order
            });
        } else {
            setEditingProgram(null);
            setFormData({
                title: "",
                slug: "",
                short_description: "",
                full_description: "",
                duration: "3 months",
                application_fee: 30000,
                status: "active",
                display_order: 0
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingProgram(null);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            const url = editingProgram
                ? `/api/scholarship-programs/${editingProgram.id}`
                : '/api/scholarship-programs';
            const method = editingProgram ? 'PATCH' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (response.ok) {
                toast.success(editingProgram ? "Program updated successfully" : "Program created successfully");
                fetchPrograms();
                handleCloseModal();
            } else {
                toast.error(result.error || "Failed to save program");
            }
        } catch (error) {
            toast.error("An error occurred while saving");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this program? This will also delete all associated applications.")) return;

        try {
            const response = await fetch(`/api/scholarship-programs/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                toast.success("Program deleted successfully");
                fetchPrograms();
            } else {
                const data = await response.json();
                toast.error(data.error || "Failed to delete program");
            }
        } catch (error) {
            toast.error("An error occurred while deleting");
        }
    };

    const filteredPrograms = programs.filter(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.slug.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6 pb-12">
            {/* Header Area */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white mb-1">Scholarship Programs</h1>
                    <p className="text-sm text-gray-400">Manage the elite tier scholarship catalogs available to applicants.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={fetchPrograms}
                        className="h-10 px-4 flex items-center gap-2 bg-[#0a0e17] hover:bg-white/5 border border-white/10 text-white rounded-lg transition-colors text-sm font-medium shadow-sm"
                    >
                        <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                        Refresh
                    </button>
                    <button
                        onClick={() => handleOpenModal()}
                        className="h-10 px-4 flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors text-sm font-medium shadow-lg shadow-blue-500/20"
                    >
                        <Plus className="w-4 h-4" />
                        New Program
                    </button>
                </div>
            </div>

            {/* Data Table */}
            <div className="bg-[#0a0e17]/80 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
                <div className="p-5 border-b border-white/5 flex flex-col lg:flex-row gap-4 justify-between items-center bg-[#0d1320]/50">
                    <div className="relative w-full lg:w-96 group">
                        <Search className="w-4 h-4 absolute text-gray-500 left-3 top-1/2 -translate-y-1/2 group-focus-within:text-blue-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search programs by title or slug..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-[#111623] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all shadow-inner"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto min-h-[300px]">
                    <table className="w-full text-left border-collapse whitespace-nowrap">
                        <thead>
                            <tr className="bg-[#0b0f19] border-b border-white/5 text-xs uppercase tracking-wider text-gray-500">
                                <th className="px-6 py-4 font-semibold">Program Series</th>
                                <th className="px-6 py-4 font-semibold">Fee / Duration</th>
                                <th className="px-6 py-4 font-semibold">Status</th>
                                <th className="px-6 py-4 font-semibold text-center">Applications</th>
                                <th className="px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-sm">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                        <div className="flex flex-col items-center gap-2">
                                            <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
                                            <p>Loading programs...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredPrograms.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                        <div className="flex flex-col items-center gap-2">
                                            <Layers className="w-10 h-10 text-gray-600 mb-2" />
                                            <p className="text-gray-400 font-medium">No programs found.</p>
                                            <button
                                                onClick={() => handleOpenModal()}
                                                className="text-blue-400 hover:text-blue-300 text-sm mt-2"
                                            >
                                                Create your first program
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredPrograms.map((program) => (
                                    <tr key={program.id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-gray-200 font-semibold">{program.title}</span>
                                                <span className="text-xs text-blue-400 font-mono mt-0.5">/{program.slug}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-gray-300 font-medium">₦{Number(program.application_fee).toLocaleString()}</span>
                                                <span className="text-xs text-gray-500 mt-0.5">{program.duration}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs uppercase tracking-wider font-bold rounded-full border
                                                ${program.status === 'active' ? 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10' :
                                                    'text-gray-400 border-gray-400/30 bg-gray-400/10'}`}>
                                                {program.status === 'active' ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                                                {program.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="inline-flex items-center justify-center min-w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 font-bold border border-blue-500/20">
                                                {program._count?.applications || 0}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 text-gray-500">
                                                <button
                                                    onClick={() => handleOpenModal(program)}
                                                    className="p-1.5 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                                                    title="Edit Program"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(program.id)}
                                                    className="p-1.5 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                                    title="Delete Program"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Program Modal Form */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-[#0d1320] border border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in duration-200">
                        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#111623]">
                            <h2 className="text-xl font-bold text-white tracking-tight">
                                {editingProgram ? "Edit Program" : "Create New Program"}
                            </h2>
                            <button
                                onClick={handleCloseModal}
                                className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                            >
                                <XCircle className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="flex flex-col">
                            <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto w-full">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="col-span-2 md:col-span-1">
                                        <label className="block text-xs text-gray-500 uppercase font-bold tracking-wider mb-2">Program Title *</label>
                                        <input
                                            required
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            className="w-full bg-[#111623] border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-200 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all shadow-inner"
                                            placeholder="e.g. Software Engineering 2026"
                                        />
                                    </div>
                                    <div className="col-span-2 md:col-span-1">
                                        <label className="block text-xs text-gray-500 uppercase font-bold tracking-wider mb-2">URL Slug *</label>
                                        <input
                                            required
                                            value={formData.slug}
                                            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                            className="w-full bg-[#111623] border border-white/10 rounded-xl px-4 py-3 text-sm text-blue-400 font-mono focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all shadow-inner"
                                            placeholder="e.g. software-engineering-2026"
                                        />
                                    </div>

                                    <div className="col-span-2">
                                        <label className="block text-xs text-gray-500 uppercase font-bold tracking-wider mb-2">Short Description *</label>
                                        <input
                                            required
                                            value={formData.short_description}
                                            onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                                            className="w-full bg-[#111623] border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-200 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all shadow-inner"
                                            placeholder="Brief one-liner describing the program"
                                            maxLength={250}
                                        />
                                    </div>

                                    <div className="col-span-2 md:col-span-1">
                                        <label className="block text-xs text-gray-500 uppercase font-bold tracking-wider mb-2">Duration</label>
                                        <input
                                            value={formData.duration}
                                            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                            className="w-full bg-[#111623] border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-200 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all shadow-inner"
                                            placeholder="e.g. 3 months"
                                        />
                                    </div>

                                    <div className="col-span-2 md:col-span-1">
                                        <label className="block text-xs text-gray-500 uppercase font-bold tracking-wider mb-2">Application Fee (₦)</label>
                                        <input
                                            type="number"
                                            required
                                            value={formData.application_fee}
                                            onChange={(e) => setFormData({ ...formData, application_fee: parseInt(e.target.value) || 0 })}
                                            className="w-full bg-[#111623] border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-200 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all shadow-inner"
                                        />
                                    </div>

                                    <div className="col-span-2 md:col-span-1">
                                        <label className="block text-xs text-gray-500 uppercase font-bold tracking-wider mb-2">Status</label>
                                        <select
                                            value={formData.status}
                                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                            className="w-full bg-[#111623] border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-200 focus:outline-none focus:border-blue-500/50 transition-all shadow-inner appearance-none cursor-pointer pr-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCAyNCAyNCIgc3Ryb2tlPSIjOWNhM2FmIiBzdHJva2Utd2lkdGg9IjIiPjxwYXRoIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgZD0iTTE5IDlsLTcgNy03LTciLz48L3N2Zz4=')] bg-no-repeat bg-[right_1rem_center] bg-[length:1.2em_1.2em]"
                                        >
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                        </select>
                                    </div>

                                    <div className="col-span-2 md:col-span-1">
                                        <label className="block text-xs text-gray-500 uppercase font-bold tracking-wider mb-2">Display Order</label>
                                        <input
                                            type="number"
                                            value={formData.display_order}
                                            onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                                            className="w-full bg-[#111623] border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-200 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all shadow-inner"
                                        />
                                    </div>

                                    <div className="col-span-2">
                                        <label className="block text-xs text-gray-500 uppercase font-bold tracking-wider mb-2">Full Description (Optional)</label>
                                        <textarea
                                            value={formData.full_description}
                                            onChange={(e) => setFormData({ ...formData, full_description: e.target.value })}
                                            className="w-full bg-[#111623] border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-200 min-h-[120px] focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all shadow-inner"
                                            placeholder="Detailed information about requirements, curriculum, etc."
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 border-t border-white/5 bg-[#111623] flex justify-end gap-3 shrink-0">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="px-6 py-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl font-bold transition-all text-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-blue-500/20 disabled:opacity-50 flex items-center gap-2 text-sm"
                                >
                                    {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                                    {editingProgram ? "Update Program" : "Save Program"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
