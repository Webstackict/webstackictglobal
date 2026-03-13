import TestimonialsTable from "@/components/admin/TestimonialsTable";
import { MessageSquare } from "lucide-react";

export const metadata = {
    title: "Testimonial Moderation | Admin",
};

export default function AdminTestimonialsPage() {
    return (
        <div className="space-y-8">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="animate-in fade-in slide-in-from-left duration-700">
                    <div className="flex items-center gap-2 text-blue-500 font-semibold mb-2">
                        <MessageSquare className="w-4 h-4" />
                        <span className="text-xs uppercase tracking-[0.2em] font-bold">Content Moderation</span>
                    </div>
                    <h1 className="text-4xl font-extrabold text-white tracking-tight">
                        Student <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">Reviews</span>
                    </h1>
                    <p className="text-gray-400 mt-3 text-sm max-w-xl leading-relaxed">
                        Curate the best student experiences. Approved testimonials will be featured on the homepage carousel to inspire prospective students.
                    </p>
                </div>

                {/* Stats overview boxes */}
                <div className="flex items-center gap-4 animate-in fade-in slide-in-from-right duration-700">
                    <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5 flex items-center gap-6 shadow-xl shadow-black/20">
                        <div className="space-y-1">
                            <div className="text-xs text-gray-500 uppercase tracking-widest font-extrabold">Live Reviews</div>
                            <div className="text-2xl font-black text-white">5 <span className="text-xs text-green-500 ml-1 font-bold italic">Latest</span></div>
                        </div>
                        <div className="w-[1px] h-10 bg-white/10"></div>
                        <div className="space-y-1">
                            <div className="text-xs text-gray-500 uppercase tracking-widest font-extrabold">Total Approved</div>
                            <div className="text-2xl font-black text-blue-500">Featured</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Table component */}
            <div className="animate-in fade-in slide-in-from-bottom duration-1000">
                <TestimonialsTable />
            </div>
        </div>
    );
}
