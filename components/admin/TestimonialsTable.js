"use client";

import { useState, useEffect } from "react";
import {
    MessageSquare,
    CheckCircle,
    XCircle,
    Trash2,
    Star,
    Clock,
    User,
    Mail,
    Video,
    ExternalLink,
    AlertCircle
} from "lucide-react";
import { toast } from "sonner";

export default function TestimonialsTable() {
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const fetchTestimonials = async () => {
        try {
            const res = await fetch("/api/admin/testimonials");
            const data = await res.json();
            if (res.ok) {
                setTestimonials(data.data || []);
            } else {
                throw new Error(data.error || "Failed to fetch");
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to load testimonials");
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id, action, status) => {
        const confirmMsg = action === "delete"
            ? "Are you sure you want to delete this review permanently?"
            : `Are you sure you want to mark this review as ${status}?`;

        if (!confirm(confirmMsg)) return;

        try {
            const method = action === "delete" ? "DELETE" : "PATCH";
            const body = action === "delete" ? null : JSON.stringify({ status });

            const res = await fetch(`/api/admin/testimonials/${id}`, {
                method,
                headers: { "Content-Type": "application/json" },
                body
            });

            if (res.ok) {
                toast.success(action === "delete" ? "Review deleted" : `Review ${status}`);
                fetchTestimonials();
            } else {
                const data = await res.json();
                throw new Error(data.error || "Action failed");
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-20 text-gray-400">
                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p>Loading testimonials...</p>
            </div>
        );
    }

    return (
        <div className="bg-[#0a0e17] rounded-2xl border border-white/5 overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-white/[0.02] border-b border-white/5">
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Reviewer</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Program & Rating</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Content</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Status</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {testimonials.map((review) => (
                            <tr key={review.id} className="hover:bg-white/[0.01] transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 font-bold border border-blue-500/20 overflow-hidden shrink-0">
                                            {review.avatar_url ? (
                                                <img src={review.avatar_url} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <User size={18} />
                                            )}
                                        </div>
                                        <div className="min-w-0">
                                            <div className="text-sm font-semibold text-white truncate">{review.name}</div>
                                            <div className="text-[11px] text-gray-500 flex items-center gap-1 truncate">
                                                <Mail size={10} /> {review.email}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="space-y-1.5">
                                        <div className="text-xs text-blue-400 font-bold bg-blue-500/10 px-2 py-0.5 rounded-full inline-block uppercase tracking-wider">
                                            {review.program || "General"}
                                        </div>
                                        <div className="flex items-center gap-0.5 text-yellow-500">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    size={12}
                                                    fill={i < review.rating ? "currentColor" : "none"}
                                                    className={i < review.rating ? "text-yellow-500" : "text-gray-600"}
                                                />
                                            ))}
                                        </div>
                                        <div className="text-[10px] text-gray-500 flex items-center gap-1">
                                            <Clock size={10} /> {new Date(review.created_at).toLocaleDateString()}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 max-w-sm">
                                    <div className="text-sm text-gray-400 line-clamp-2 group-hover:line-clamp-none transition-all duration-300">
                                        &quot;{review.review_message}&quot;
                                    </div>
                                    {review.video_url && (
                                        <a
                                            href={review.video_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs text-blue-400 font-medium flex items-center gap-1 mt-2 hover:text-blue-300 transition-colors"
                                        >
                                            <Video size={10} /> Watch Video <ExternalLink size={8} />
                                        </a>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-widest border ${review.status === 'approved' ? 'bg-green-500/5 text-green-500 border-green-500/20' :
                                        review.status === 'declined' ? 'bg-red-500/5 text-red-500 border-red-500/20' :
                                            'bg-yellow-500/5 text-yellow-500 border-yellow-500/20'
                                        }`}>
                                        {review.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        {review.status !== 'approved' && (
                                            <button
                                                onClick={() => handleAction(review.id, 'update', 'approved')}
                                                className="p-2 text-gray-400 hover:text-green-500 hover:bg-green-500/10 rounded-xl transition-all border border-transparent hover:border-green-500/20"
                                                title="Approve Review"
                                            >
                                                <CheckCircle size={18} />
                                            </button>
                                        )}
                                        {review.status !== 'declined' && (
                                            <button
                                                onClick={() => handleAction(review.id, 'update', 'declined')}
                                                className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all border border-transparent hover:border-red-500/20"
                                                title="Decline Review"
                                            >
                                                <XCircle size={18} />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleAction(review.id, 'delete')}
                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-600/10 rounded-xl transition-all border border-transparent hover:border-red-600/10"
                                            title="Permanently Delete"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {testimonials.length === 0 && (
                <div className="flex flex-col items-center justify-center p-20 text-center">
                    <div className="w-16 h-16 bg-white/[0.02] rounded-full flex items-center justify-center mb-4 text-gray-600">
                        <MessageSquare size={32} />
                    </div>
                    <h3 className="text-white font-medium mb-1">No reviews found</h3>
                    <p className="text-gray-500 text-sm max-w-xs">
                        Reviews submitted by students will appear here for your moderation.
                    </p>
                </div>
            )}
        </div>
    );
}

