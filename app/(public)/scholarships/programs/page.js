import Section from '@/components/section';
import PageBanner from '@/components/hero/page-banner';
import Tagline from '@/components/ui/tagline';
import { prisma } from '@/lib/prisma';
import LinkWithProgress from '@/components/ui/Link-with-progress';
import { Code, Shield, BarChart, Palette, Brain, TrendingUp, DollarSign, Smartphone, GraduationCap, ArrowRight } from 'lucide-react';

const ICON_MAP = {
    'web development': Code,
    'cybersecurity': Shield,
    'data analytics': BarChart,
    'ui/ux design': Palette,
    'ai automation': Brain,
    'digital marketing': TrendingUp,
    'forex trading': DollarSign,
    'mobile app development': Smartphone
};

export const metadata = {
    title: 'Scholarship Tracks | Webstack ICT Global 2026',
    description: 'Explore the technical tracks eligible for the Webstack ICT Global scholarship program.',
};

export default async function ScholarshipProgramsPage() {
    let programs = [];
    try {
        programs = await prisma.scholarship_programs.findMany({
            where: { status: 'active' },
            orderBy: { display_order: 'asc' }
        });
    } catch (error) {
        console.error('Error in ScholarshipProgramsPage:', error);
        // We'll proceed with an empty array to show a "No programs found" state instead of a generic 500 error
    }

    return (
        <main className="min-h-screen">
            <PageBanner
                tagline={<Tagline text="Program Catalog" icon="rocket" />}
                title={
                    <>
                        Scholarship <br />
                        <span>Available Tracks</span>
                    </>
                }
                subtitle="Choose from our industry-leading technical tracks eligible for the 2026 scholarship cycle."
                primaryBtnText="Apply Now"
                primaryBtnRoute="/scholarships/apply"
                secondaryBtnText="Back to Info"
                secondaryBtnRoute="/scholarships"
            />

            <Section
                label="available-tracks"
                title={
                    <>
                        Choose Your <span className="gradientText">Path</span>
                    </>
                }
                subtitle="High-impact technical training designed for absolute beginners and enthusiasts."
                sectionBgColor="sectionDark"
            >
                <div className="pb-16 min-h-[400px]">
                    {programs.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {programs.map((program) => {
                                const IconComponent = ICON_MAP[program.title.toLowerCase()] || GraduationCap;
                                return (
                                    <div key={program.id} className="premium-card flex flex-col group hover:border-blue-500/30 transition-all duration-500">
                                        <div className="mb-6 flex items-start justify-between">
                                            <div className="bg-blue-500/10 text-blue-400 p-4 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                                                <IconComponent size={28} />
                                            </div>
                                            <div className="bg-white/5 border border-white/10 px-3 py-1 rounded-full text-blue-400">
                                                <span className="text-[10px] font-bold uppercase tracking-widest">{program.duration}</span>
                                            </div>
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">{program.title}</h3>
                                        <p className="text-gray-400 text-sm leading-relaxed mb-8 flex-grow">
                                            {program.short_description}
                                        </p>
                                        <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Entry Fee</span>
                                                <span className="text-lg font-bold text-white">₦{(Number(program.application_fee)).toLocaleString()}</span>
                                            </div>
                                            <LinkWithProgress
                                                href={`/scholarships/apply?program=${program.slug}`}
                                                className="bg-white/5 hover:bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 group/btn"
                                            >
                                                Apply Now <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                                            </LinkWithProgress>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10 max-w-2xl mx-auto backdrop-blur-sm">
                            <div className="bg-blue-600/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 text-blue-400">
                                <GraduationCap size={32} />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4">No Scholarship Tracks Active</h3>
                            <p className="text-gray-400 mb-8 max-w-md mx-auto">
                                We're currently updating our 2026 catalog. Please check back shortly or reach out to our team for updates.
                            </p>
                            <LinkWithProgress
                                href="/scholarships"
                                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-bold transition-all"
                            >
                                Back to Scholarship Hub
                            </LinkWithProgress>
                        </div>
                    )}
                </div>
            </Section>
        </main>
    );
}
