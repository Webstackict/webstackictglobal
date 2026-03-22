
import DashboardHeader from "@/components/dashboard/dashboard-header";
import Section from "@/components/dashboard/section";
import { prisma } from "@/lib/prisma";
import { createSupabaseServerClient } from "@/lib/db/supabaseServer";
import { redirect, notFound } from "next/navigation";
import { iconsConfig } from "@/lib/icons/iconsConfig";
import { webDevCurriculum } from "@/lib/contents/curriculum/web-dev-curriculum";
import { uiUxCurriculum } from "@/lib/contents/curriculum/ui-ux-curriculum";
import { mobileAppDevCurriculum } from "@/lib/contents/curriculum/mobile-app-dev-curriculum";
import { dataScienceCurriculum } from "@/lib/contents/curriculum/data-science-curriculum";
import { cybersecurityCurriculum } from "@/lib/contents/curriculum/cybersecurity-curriculum";
import { digitalMarketingCurriculum } from "@/lib/contents/curriculum/digital-marketing-curriculum";
import { aiAutomationCurriculum } from "@/lib/contents/curriculum/ai-automation-curriculum";
import { forexCurriculum } from "@/lib/contents/curriculum/forex-curriculum";

const curriculumMap = {
    'web-development': webDevCurriculum,
    'ui-ux-design': uiUxCurriculum,
    'mobile-app-development': mobileAppDevCurriculum,
    'data-analytics': dataScienceCurriculum,
    'cybersecurity': cybersecurityCurriculum,
    'digital-marketing': digitalMarketingCurriculum,
    'ai-automation': aiAutomationCurriculum,
    'forex-trading': forexCurriculum
};

export default async function CourseDetailPage({ params }) {
    const { id } = await params;
    const supabase = await createSupabaseServerClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const enrollment = await prisma.enrollments.findUnique({
        where: { id },
        include: {
            program: true,
            cohort: true
        }
    });

    if (!enrollment || enrollment.user_id !== user.id) {
        notFound();
    }

    const curriculum = curriculumMap[enrollment.program.slug] || [];

    return (
        <div className="max-w-6xl mx-auto space-y-10 pb-24 animate-in fade-in duration-700">
            <DashboardHeader
                title={enrollment.program.title}
                subtitle={`Cohort: ${enrollment.cohort.cohort_code}`}
                userId={user.id}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                {/* Main Content: Curriculum */}
                <div className="lg:col-span-2 space-y-8">
                    <Section title="Course Curriculum" description="Detailed roadmap of your learning journey">
                        <div className="space-y-6 mt-6">
                            {curriculum.length > 0 ? (
                                curriculum.map((module, mIdx) => (
                                    <div key={mIdx} className="premium-card p-6 md:p-8 bg-[#0a0e17]/80 backdrop-blur-xl border border-white/5 rounded-3xl relative overflow-hidden group shadow-lg hover:shadow-blue-500/5 transition-all">
                                        {/* Decorative subtle gradient */}
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-[40px] pointer-events-none group-hover:bg-blue-500/10 transition-colors"></div>

                                        <div className="flex items-start md:items-center gap-5 mb-6 relative z-10">
                                            <div className="shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center border border-white/10 shadow-inner">
                                                <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-blue-200">{mIdx + 1}</span>
                                            </div>
                                            <div className="flex-1 pt-1 md:pt-0">
                                                <h3 className="text-lg md:text-xl font-extrabold text-white mb-1.5 tracking-tight leading-tight group-hover:text-blue-400 transition-colors">{module.title}</h3>
                                                <p className="text-sm font-medium text-blue-400/80 leading-snug">{module.subtitle}</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
                                            {module.topics.map((topic, tIdx) => (
                                                <div key={tIdx} className="p-5 bg-white/[0.02] hover:bg-white/[0.04] rounded-2xl border border-white-5 hover:border-white/10 transition-all group/topic flex flex-col justify-between">
                                                    <h4 className="text-sm md:text-base font-bold text-white mb-2 leading-snug group-hover/topic:text-blue-300 transition-colors">{topic.title}</h4>
                                                    <p className="text-xs md:text-sm text-gray-400 leading-relaxed font-medium">{topic.desc}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-16 text-center bg-[#0a0e17]/50 border border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center backdrop-blur-sm">
                                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                                        <span className="text-2xl">📚</span>
                                    </div>
                                    <h3 className="text-lg font-bold text-white mb-2">Curriculum Pending</h3>
                                    <p className="text-gray-400 text-sm max-w-sm">Detailed syllabus for this program is currently being structured by your instructors.</p>
                                </div>
                            )}
                        </div>
                    </Section>
                </div>

                {/* Sidebar: Resources & Support */}
                <div className="space-y-8">
                    <Section title="Resources">
                        <div className="space-y-4 mt-6">
                            {[
                                { name: "Learning Portal", desc: "Access video lectures and assignments", link: "https://learning.webstackict.com", icon: "🎓" },
                                { name: "Student Guide", desc: "Essential info for your journey", link: "https://guide.webstackict.com", icon: "📖" },
                                { name: "Community Discord", desc: "Connect with peers and mentors", link: "https://discord.gg/webstackict", icon: "💬" }
                            ].map((res, i) => (
                                <a key={i} href={res.link} target="_blank" rel="noopener noreferrer" className="flex items-start gap-4 p-5 bg-[#0a0e17]/80 backdrop-blur-xl border border-white/5 rounded-2xl hover:bg-white/[0.05] hover:border-blue-500/30 transition-all group shadow-sm hover:shadow-lg hover:-translate-y-1 duration-300">
                                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 border border-white/5 group-hover:bg-blue-500/10 group-hover:border-blue-500/20 transition-all">
                                        <span className="text-lg group-hover:scale-110 transition-transform">{res.icon}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm md:text-base font-bold text-white mb-1 group-hover:text-blue-400 transition-colors tracking-tight">{res.name}</span>
                                        <span className="text-xs text-gray-400 leading-relaxed font-medium">{res.desc}</span>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </Section>

                    <Section title="Direct Support">
                        <div className="p-8 mt-6 bg-gradient-to-br from-[#0a0e17] via-blue-900/10 to-[#0a0e17] border border-blue-500/20 rounded-3xl space-y-6 relative overflow-hidden group shadow-lg">
                            {/* Decorative glow */}
                            <div className="absolute top-0 right-0 w-full h-full bg-blue-500/5 blur-[50px] pointer-events-none group-hover:bg-blue-500/10 transition-colors duration-700"></div>

                            <div className="relative z-10 flex flex-col items-center text-center">
                                <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-4 border border-blue-500/30">
                                    <span className="text-xl">🤝</span>
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">Need Assistance?</h3>
                                <p className="text-sm text-blue-100/70 leading-relaxed font-medium mb-6">Our dedicated student success mentors are available around the clock to assist you with any questions.</p>

                                <a href="https://wa.me/2349026902323" target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 relative z-10 overflow-hidden group/btn">
                                    <span className="relative z-10">Contact Support</span>
                                </a>
                            </div>
                        </div>
                    </Section>
                </div>
            </div>
        </div>
    );
}
