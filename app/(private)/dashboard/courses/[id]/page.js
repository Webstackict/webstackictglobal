
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
        <div className="max-w-6xl mx-auto space-y-8 pb-24">
            <DashboardHeader
                title={enrollment.program.title}
                subtitle={`Cohort: ${enrollment.cohort.cohort_code}`}
                userId={user.id}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content: Curriculum */}
                <div className="lg:col-span-2 space-y-6">
                    <Section title="Course Curriculum" description="Detailed roadmap of your learning journey">
                        <div className="space-y-4">
                            {curriculum.length > 0 ? (
                                curriculum.map((module, mIdx) => (
                                    <div key={mIdx} className="premium-card p-6 bg-white/[0.02] border-white/5">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                                                <span className="text-blue-400 font-bold">{mIdx + 1}</span>
                                            </div>
                                            <div>
                                                <h3 className="text-white font-bold">{module.title}</h3>
                                                <p className="text-xs text-gray-400">{module.subtitle}</p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {module.topics.map((topic, tIdx) => (
                                                <div key={tIdx} className="p-4 bg-white/[0.03] rounded-xl border border-white/5 hover:border-blue-500/30 transition-all group">
                                                    <h4 className="text-sm font-semibold text-white mb-1 group-hover:text-blue-400 transition-colors">{topic.title}</h4>
                                                    <p className="text-[11px] text-gray-500 leading-relaxed line-clamp-2">{topic.desc}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-12 text-center bg-white/[0.02] border border-dashed border-white/10 rounded-2xl">
                                    <p className="text-gray-500">Curriculum details for this program are being updated.</p>
                                </div>
                            )}
                        </div>
                    </Section>
                </div>

                {/* Sidebar: Resources & Support */}
                <div className="space-y-6">
                    <Section title="Resources">
                        <div className="space-y-3">
                            {[
                                { name: "Learning Portal", desc: "Access video lectures and assignments", link: "https://learning.webstackict.com" },
                                { name: "Student Guide", desc: "Essential info for your journey", link: "https://guide.webstackict.com" },
                                { name: "Community Discord", desc: "Connect with peers and mentors", link: "https://discord.gg/webstackict" }
                            ].map((res, i) => (
                                <a key={i} href={res.link} target="_blank" rel="noopener noreferrer" className="flex flex-col p-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.05] hover:border-blue-500/30 transition-all group">
                                    <span className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">{res.name}</span>
                                    <span className="text-[11px] text-gray-500">{res.desc}</span>
                                </a>
                            ))}
                        </div>
                    </Section>

                    <Section title="Direct Support">
                        <div className="p-6 bg-gradient-to-br from-blue-600/10 to-transparent border border-blue-500/20 rounded-2xl space-y-4">
                            <p className="text-xs text-blue-100/70 leading-relaxed">Need help with your course? Our mentors are available to assist you.</p>
                            <a href="https://wa.me/2349026902323" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-blue-500/20">
                                Contact Student Success
                            </a>
                        </div>
                    </Section>
                </div>
            </div>
        </div>
    );
}
