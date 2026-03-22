"use client";

import { useState } from "react";
import { Star, Send, Loader2, UserCircle, Mail, GraduationCap, Video, ImageIcon, MessageSquareHeart } from "lucide-react";
import { toast } from "sonner";

export default function ReviewForm({ userDetails, enrolledPrograms = [] }) {
    const [formData, setFormData] = useState({
        rating: 5,
        review_message: "",
        program: enrolledPrograms.length > 0 ? enrolledPrograms[0].name : "",
        avatar_url: "",
        video_url: ""
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [hoveredRating, setHoveredRating] = useState(0);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleRatingClick = (rating) => {
        setFormData((prev) => ({ ...prev, rating }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.review_message.trim()) {
            toast.error("Please enter a review message.");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch("/api/testimonials/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to submit review");
            }

            setIsSubmitted(true);
            toast.success("Review submitted for approval!");
        } catch (error) {
            console.error("Submission error:", error);
            toast.error(error.message || "Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="w-full max-w-2xl mx-auto mt-8 bg-[#0a0e17]/80 backdrop-blur-2xl border border-white/5 shadow-2xl rounded-3xl p-12 text-center animate-in zoom-in-95 duration-700 relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-emerald-500/20 to-transparent pointer-events-none"></div>

                <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(16,185,129,0.4)] relative z-10">
                    <Star className="w-12 h-12 text-white fill-current" />
                </div>

                <h2 className="text-3xl font-extrabold text-white mb-4 tracking-tight relative z-10">Review Submitted!</h2>
                <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto leading-relaxed relative z-10">
                    Thank you for sharing your experience. Your feedback helps us grow and inspires others! Your review will be published after our team approves it.
                </p>
                <button
                    onClick={() => {
                        setIsSubmitted(false);
                        setFormData({ ...formData, review_message: "", rating: 5, avatar_url: "", video_url: "" });
                    }}
                    className="px-8 py-3 bg-transparent border border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10 rounded-xl font-semibold transition-all hover:scale-[1.02] relative z-10"
                >
                    Submit Another Review
                </button>
            </div>
        );
    }

    return (
        <div className="w-full max-w-3xl mx-auto bg-[#0b0f19]/80 backdrop-blur-2xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-3xl overflow-hidden relative animate-in fade-in duration-700 mt-6 mb-12">
            {/* Decorative background glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-32 bg-blue-600/20 blur-[100px] rounded-full pointer-events-none"></div>

            <div className="px-8 pt-10 pb-6 border-b border-white/5 relative z-10 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 mb-4 shadow-lg shadow-blue-500/10">
                    <MessageSquareHeart className="w-8 h-8 text-blue-400" />
                </div>
                <h2 className="text-3xl lg:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 tracking-tight mb-3">
                    Share Your Experience
                </h2>
                <p className="text-gray-400 text-sm lg:text-base font-medium max-w-xl mx-auto leading-relaxed">
                    Your feedback is incredibly valuable to us. It helps us grow and empowers others to make the right choice for their tech journey.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8 relative z-10 bg-[#0a0e17]/50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 pl-1">
                            <UserCircle className="w-4 h-4 text-blue-500" /> Full Name
                        </label>
                        <input
                            type="text"
                            className="w-full bg-[#111623]/80 border border-white/5 rounded-xl px-4 py-3.5 text-sm text-gray-400 cursor-not-allowed shadow-inner focus:outline-none"
                            value={userDetails?.fullName || ""}
                            disabled
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 pl-1">
                            <Mail className="w-4 h-4 text-blue-500" /> Email Address
                        </label>
                        <input
                            type="email"
                            className="w-full bg-[#111623]/80 border border-white/5 rounded-xl px-4 py-3.5 text-sm text-gray-400 cursor-not-allowed shadow-inner focus:outline-none"
                            value={userDetails?.email || ""}
                            disabled
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 pl-1">
                        <GraduationCap className="w-4 h-4 text-purple-500" /> Program Attended <span className="text-gray-600 text-[10px] normal-case tracking-normal">(Optional)</span>
                    </label>
                    <select
                        name="program"
                        className="w-full bg-[#111623] border border-white/10 hover:border-white/20 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all shadow-inner appearance-none bg-no-repeat bg-[url('data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2024%2024%22%20stroke%3D%22%239CA3AF%22%3E%3Cpath%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%222%22%20d%3D%22M19%209l-7%207-7-7%22%2F%3E%3C%2Fsvg%3E')] bg-[position:right_1rem_center] bg-[length:1.2em_1.2em]"
                        value={formData.program}
                        onChange={handleChange}
                    >
                        <option value="" className="bg-[#0b0f19] text-gray-400">Select a program</option>
                        {enrolledPrograms.map((prog, idx) => (
                            <option key={idx} value={prog.name} className="bg-[#0b0f19] text-white">
                                {prog.name}
                            </option>
                        ))}
                        <option value="General" className="bg-[#0b0f19] text-white">General / Not Listed</option>
                    </select>
                </div>

                <div className="bg-gradient-to-br from-white/[0.03] to-transparent border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center space-y-3">
                    <label className="text-sm font-bold text-white tracking-wide">Overall Rating</label>
                    <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => {
                            const isActive = (hoveredRating || formData.rating) >= star;
                            return (
                                <button
                                    key={star}
                                    type="button"
                                    className={`p-1 transition-all duration-300 hover:scale-125 focus:outline-none ${isActive ? "text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]" : "text-gray-600 hover:text-gray-400"
                                        }`}
                                    onClick={() => handleRatingClick(star)}
                                    onMouseEnter={() => setHoveredRating(star)}
                                    onMouseLeave={() => setHoveredRating(0)}
                                >
                                    <Star className={`w-10 h-10 ${isActive ? "fill-current" : ""}`} />
                                </button>
                            );
                        })}
                    </div>
                    <span className="text-xs text-gray-500 font-medium">{formData.rating} out of 5 stars</span>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between items-end pl-1 pr-1">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                            Your Testimonial <span className="text-red-500">*</span>
                        </label>
                        <span className={`text-xs font-bold ${formData.review_message.length > 480 ? 'text-orange-500' : 'text-gray-500'}`}>
                            {formData.review_message.length} <span className="text-gray-600 font-medium">/ 500</span>
                        </span>
                    </div>
                    <textarea
                        name="review_message"
                        className="w-full bg-[#111623] border border-white/10 rounded-xl px-5 py-4 text-sm text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all shadow-inner resize-none appearance-none"
                        rows="5"
                        value={formData.review_message}
                        onChange={(e) => {
                            if (e.target.value.length <= 500) {
                                handleChange(e);
                            }
                        }}
                        placeholder="Tell us what you loved about our services, the instructors, and your overall learning experience..."
                        required
                        disabled={isLoading}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 pl-1">
                            <ImageIcon className="w-4 h-4 text-emerald-500" /> Avatar Image URL <span className="text-gray-600 text-[10px] normal-case tracking-normal">(Optional)</span>
                        </label>
                        <input
                            type="url"
                            name="avatar_url"
                            className="w-full bg-[#111623] border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-blue-500/50 focus:bg-[#1a2333] transition-all shadow-inner placeholder-gray-600"
                            value={formData.avatar_url}
                            onChange={handleChange}
                            placeholder="https://example.com/photo.jpg"
                            disabled={isLoading}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 pl-1">
                            <Video className="w-4 h-4 text-pink-500" /> Video Link <span className="text-gray-600 text-[10px] normal-case tracking-normal">(Optional)</span>
                        </label>
                        <input
                            type="url"
                            name="video_url"
                            className="w-full bg-[#111623] border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-blue-500/50 focus:bg-[#1a2333] transition-all shadow-inner placeholder-gray-600"
                            value={formData.video_url}
                            onChange={handleChange}
                            placeholder="YouTube or Vimeo link"
                            disabled={isLoading}
                        />
                    </div>
                </div>

                <div className="pt-6 border-t border-white/5">
                    <button
                        type="submit"
                        className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-500 hover:via-blue-400 hover:to-indigo-500 rounded-xl text-base font-bold text-white shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed group hover:scale-[1.01]"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Submitting Review...
                            </>
                        ) : (
                            <>
                                <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                Submit Your Review
                            </>
                        )}
                    </button>
                    <p className="text-center text-xs text-gray-500 mt-4 font-medium">
                        By submitting, you agree to allow us to feature your review globally on our platform.
                    </p>
                </div>
            </form>
        </div>
    );
}
