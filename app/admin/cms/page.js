"use client";

import { useState } from "react";
import {
    LayoutTemplate, Image as ImageIcon, FileText,
    MoreVertical, Plus, UploadCloud, Edit3, Trash2,
    Globe, Eye, MessageSquare, Folders
} from "lucide-react";

export default function CMSPage() {
    const [activeTab, setActiveTab] = useState("pages");

    const pages = [
        { name: "Homepage", url: "/", status: "Live", lastEdited: "2 hours ago", author: "Super Admin" },
        { name: "About Us", url: "/about", status: "Live", lastEdited: "5 days ago", author: "Marketing Team" },
        { name: "Contact", url: "/contact", status: "Draft", lastEdited: "Just now", author: "Super Admin" },
        { name: "Programs Index", url: "/programs", status: "Live", lastEdited: "1 week ago", author: "Super Admin" }
    ];

    const contentBlocks = [
        { title: "Student Testimonials", items: 24, type: "Carousel", status: "Active" },
        { title: "FAQ Section", items: 15, type: "Accordion", status: "Active" },
        { title: "Homepage Hero Banner", items: 1, type: "Hero", status: "Active" },
        { title: "Partner Logos", items: 12, type: "Grid", status: "Active" }
    ];

    const mediaList = [
        { name: "hero-bg-2024.jpg", size: "2.4 MB", type: "Image", img: "bg-blue-500/20" },
        { name: "student-interview-01.mp4", size: "45 MB", type: "Video", img: "bg-purple-500/20" },
        { name: "webstack-logo-white.svg", size: "12 KB", type: "Vector", img: "bg-emerald-500/20" },
        { name: "cohort-graduation.jpg", size: "3.1 MB", type: "Image", img: "bg-blue-500/20" },
        { name: "curriculum-syllabus.pdf", size: "1.2 MB", type: "Document", img: "bg-orange-500/20" },
        { name: "instructor-headshots.zip", size: "14 MB", type: "Archive", img: "bg-gray-500/20" }
    ];

    return (
        <div className="space-y-6 pb-12">
            {/* Header Area */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white mb-1">Content Management</h1>
                    <p className="text-sm text-gray-400">Manage website pages, dynamic content blocks, and media assets.</p>
                </div>
                <div className="flex gap-3">
                    <button className="h-10 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 rounded-lg text-sm font-medium text-white shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all flex items-center gap-2">
                        {activeTab === "media" ? <UploadCloud className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                        {activeTab === "media" ? "Upload Asset" : "Create New"}
                    </button>
                </div>
            </div>

            {/* Custom Tabs */}
            <div className="flex space-x-1 bg-[#0a0e17]/80 backdrop-blur-xl border border-white/5 p-1 rounded-xl w-fit">
                <button
                    onClick={() => setActiveTab('pages')}
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'pages' ? 'bg-[#111623] text-white shadow-sm border border-white/5' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                >
                    <Globe className="w-4 h-4" /> Website Pages
                </button>
                <button
                    onClick={() => setActiveTab('blocks')}
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'blocks' ? 'bg-[#111623] text-white shadow-sm border border-white/5' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                >
                    <LayoutTemplate className="w-4 h-4" /> Content Blocks
                </button>
                <button
                    onClick={() => setActiveTab('media')}
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'media' ? 'bg-[#111623] text-white shadow-sm border border-white/5' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                >
                    <Folders className="w-4 h-4" /> Media Library
                </button>
            </div>

            {/* Tab content areas */}
            <div className="bg-[#0a0e17]/80 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden shadow-2xl">

                {/* 1. Pages Tab */}
                {activeTab === 'pages' && (
                    <div className="overflow-x-auto min-h-[400px]">
                        <table className="w-full text-left border-collapse whitespace-nowrap">
                            <thead>
                                <tr className="bg-[#0d1320] border-b border-white/5 text-[11px] uppercase tracking-wider text-gray-500">
                                    <th className="px-6 py-4 font-semibold">Page Name</th>
                                    <th className="px-6 py-4 font-semibold">Status</th>
                                    <th className="px-6 py-4 font-semibold">Last Modified</th>
                                    <th className="px-6 py-4 font-semibold">Author</th>
                                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-sm">
                                {pages.map((row, i) => (
                                    <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20">
                                                    <FileText className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-gray-200 group-hover:text-blue-400 transition-colors flex items-center gap-2">
                                                        {row.name}
                                                    </div>
                                                    <div className="text-[11px] text-gray-500 font-mono mt-0.5">{row.url}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] uppercase tracking-wider font-bold rounded-full border
                                                ${row.status === 'Live' ? 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10' : 'text-orange-400 border-orange-400/30 bg-orange-400/10'}`}>
                                                {row.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-400">{row.lastEdited}</td>
                                        <td className="px-6 py-4 text-gray-300">{row.author}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button className="p-1.5 text-gray-500 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors">
                                                    <Edit3 className="w-4 h-4" />
                                                </button>
                                                <button className="p-1.5 text-gray-500 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors">
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* 2. Content Blocks Tab */}
                {activeTab === 'blocks' && (
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[400px]">
                        {contentBlocks.map((block, i) => (
                            <div key={i} className="bg-[#111623] border border-white/5 rounded-2xl p-5 hover:border-blue-500/30 transition-all group flex flex-col justify-between">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 border border-purple-500/20">
                                            <MessageSquare className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-200 group-hover:text-blue-400 transition-colors">{block.title}</h3>
                                            <span className="text-[11px] text-gray-500 uppercase tracking-wider font-semibold">{block.type}</span>
                                        </div>
                                    </div>
                                    <button className="p-1.5 text-gray-500 hover:text-white rounded-lg transition-colors">
                                        <MoreVertical className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="flex justify-between items-end border-t border-white/5 pt-4">
                                    <div className="text-sm text-gray-400"><span className="text-white font-bold">{block.items}</span> items</div>
                                    <button className="text-sm font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1">
                                        Edit Content <Edit3 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* 3. Media Library Tab */}
                {activeTab === 'media' && (
                    <div className="p-6 min-h-[400px]">
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {/* Upload Card */}
                            <div className="border border-dashed border-white/20 rounded-2xl flex flex-col items-center justify-center h-40 bg-white/[0.02] hover:bg-white/[0.04] hover:border-blue-500/50 transition-all cursor-pointer group">
                                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 mb-2 group-hover:scale-110 transition-transform">
                                    <UploadCloud className="w-5 h-5" />
                                </div>
                                <span className="text-xs font-semibold text-gray-400 group-hover:text-white">Upload New</span>
                            </div>

                            {/* Media Items */}
                            {mediaList.map((media, i) => (
                                <div key={i} className="border border-white/5 rounded-2xl overflow-hidden bg-[#111623] hover:border-blue-500/30 transition-all group flex flex-col h-40">
                                    <div className={`flex-1 ${media.img} flex items-center justify-center border-b border-white/5 relative`}>
                                        <ImageIcon className="w-8 h-8 text-white/50" />
                                        {/* Hover Overlay */}
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-sm">
                                            <button className="p-1.5 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors"><Eye className="w-4 h-4" /></button>
                                            <button className="p-1.5 bg-red-500/40 hover:bg-red-500/60 text-white rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                    </div>
                                    <div className="p-3">
                                        <div className="text-[11px] font-semibold text-gray-300 truncate mb-0.5">{media.name}</div>
                                        <div className="flex justify-between items-center text-[10px] text-gray-500">
                                            <span>{media.type}</span>
                                            <span>{media.size}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
