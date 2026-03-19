import Section from '@/components/section';
import PageBanner from '@/components/hero/page-banner';
import Tagline from '@/components/ui/tagline';
import ValueQuote from '@/components/cards/value-quote';
import FaqSection from '@/components/FAQ/faq';
import { scholarshipFaqData } from '@/lib/contents/scholarshipFaqData';
import { CheckCircle2, Code, Shield, BarChart, Palette, Brain, TrendingUp, DollarSign, Smartphone, GraduationCap, ArrowRight } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import LinkWithProgress from '@/components/ui/Link-with-progress';

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
    title: 'Webstack ICT Global Scholarship Program 2026',
    description: 'Apply for a life-changing opportunity to start your career in technology with Webstack ICT Global scholarships.',
};

export default async function ScholarshipPage() {

    return (
        <>
            <PageBanner
                tagline={
                    <Tagline text="Limited Opportunity" icon="rocket" />
                }
                title={
                    <>
                        Webstack ICT Global <br />
                        <span>Scholarship Program</span>
                    </>
                }
                subtitle="Apply for a life-changing opportunity to start your career in technology with Africa's leading tech hub."
                primaryBtnText="Apply for Scholarship"
                secondaryBtnText="Explore Tracks"
                primaryBtnRoute="/scholarships/apply"
                secondaryBtnRoute="/scholarships/programs"
            />

            <Section
                label="about-scholarship"
                title={
                    <>
                        About the <span className="gradientText">Scholarship</span>
                    </>
                }
                subtitle="We are offering scholarships to help individuals gain essential skills in today's most in-demand technology fields."
            >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    <div className="card !p-8 lg:!p-10">
                        <h3 className="text-xl lg:text-2xl font-bold text-blue-400 mb-6 flex items-center gap-2">
                            Why Apply?
                        </h3>
                        <p className="text-gray-400 text-base mb-8 leading-relaxed">
                            This is a rare opportunity for beginners and tech enthusiasts to fast-track their careers and become highly employable with industry-grade skills.
                        </p>
                        <ul className="space-y-5 text-gray-400">
                            <li className="flex gap-3 leading-relaxed">
                                <span className="bg-blue-500/10 text-blue-400 p-1 rounded-md h-fit mt-1"><CheckCircle2 size={14} /></span>
                                <span><strong className="text-white">100% Tuition Covered:</strong> Learn high-income skills without the burden of expensive tuition fees.</span>
                            </li>
                            <li className="flex gap-3 leading-relaxed">
                                <span className="bg-blue-500/10 text-blue-400 p-1 rounded-md h-fit mt-1"><CheckCircle2 size={14} /></span>
                                <span><strong className="text-white">Beginner Friendly:</strong> Designed for absolute beginners with zero prior coding or tech experience.</span>
                            </li>
                            <li className="flex gap-3 leading-relaxed">
                                <span className="bg-blue-500/10 text-blue-400 p-1 rounded-md h-fit mt-1"><CheckCircle2 size={14} /></span>
                                <span><strong className="text-white">Hands-on Projects:</strong> Build a professional portfolio through real-world, practical applications.</span>
                            </li>
                            <li className="flex gap-3 leading-relaxed">
                                <span className="bg-blue-500/10 text-blue-400 p-1 rounded-md h-fit mt-1"><CheckCircle2 size={14} /></span>
                                <span><strong className="text-white">Recognized Certification:</strong> Receive an industry-recognized certificate upon passing assessment.</span>
                            </li>
                        </ul>
                    </div>
                    <div className="card !p-8 lg:!p-10 flex flex-col">
                        <h3 className="text-xl lg:text-2xl font-bold text-orange-400 mb-6">
                            Important Notice
                        </h3>
                        <p className="text-gray-400 text-base mb-8 leading-relaxed">
                            While the tuition for the program is heavily subsidized or covered by the scholarship, all applicants are required to pay a non-refundable administrative fee of <strong className="text-white">₦30,000</strong>.
                        </p>
                        <div className="mt-auto">
                            <ValueQuote
                                title="Registration Fee: ₦30,000"
                                text="This fee must be paid during the application process for your profile to be reviewed by the board."
                            />
                        </div>
                    </div>
                </div>
            </Section>


            <Section
                label="eligibility"
                title={
                    <>
                        Eligibility <span className="gradientText">Requirements</span>
                    </>
                }
            >
                <div className="flex justify-center w-full">
                    <div className="card !p-8 lg:!p-12 max-w-2xl w-full backdrop-blur-md bg-white/[0.02] border-white/5 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 blur-3xl -mr-16 -mt-16 group-hover:bg-blue-600/10 transition-colors duration-700" />
                        <ul className="grid grid-cols-1 gap-y-10 text-gray-400 relative z-10">
                            <li className="flex gap-5 items-start">
                                <div className="bg-blue-500/10 text-blue-400 p-2.5 rounded-xl flex-shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                                    <CheckCircle2 size={22} />
                                </div>
                                <div className="pt-0.5">
                                    <span className="text-white text-lg font-semibold block mb-1">Age Limit</span>
                                    <span className="text-gray-400">Must be at least <strong className="text-blue-400">16 years old</strong> to apply.</span>
                                </div>
                            </li>
                            <li className="flex gap-5 items-start">
                                <div className="bg-blue-500/10 text-blue-400 p-2.5 rounded-xl flex-shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                                    <Smartphone size={22} />
                                </div>
                                <div className="pt-0.5">
                                    <span className="text-white text-lg font-semibold block mb-1">Tech Access</span>
                                    <span className="text-gray-400">Must have access to a <strong className="text-blue-400">smartphone or computer</strong>.</span>
                                </div>
                            </li>
                            <li className="flex gap-5 items-start">
                                <div className="bg-blue-500/10 text-blue-400 p-2.5 rounded-xl flex-shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                                    <GraduationCap size={22} />
                                </div>
                                <div className="pt-0.5">
                                    <span className="text-white text-lg font-semibold block mb-1">Commitment</span>
                                    <span className="text-gray-400">Highly committed to <strong className="text-blue-400">intensive technical training</strong>.</span>
                                </div>
                            </li>
                            <li className="flex gap-5 items-start">
                                <div className="bg-blue-500/10 text-blue-400 p-2.5 rounded-xl flex-shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                                    <CheckCircle2 size={22} />
                                </div>
                                <div className="pt-0.5">
                                    <span className="text-white text-lg font-semibold block mb-1">Application Process</span>
                                    <span className="text-gray-400">Must complete the <strong className="text-blue-400">official application</strong> process.</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </Section>

            <Section
                label="faq"
                title={
                    <>
                        Frequently Asked <span className="gradientText">Questions</span>
                    </>
                }
                subtitle="Everything you need to know about the scholarship application process."
            >
                <div style={{ maxWidth: '50rem', margin: '0 auto' }}>
                    <FaqSection faqData={scholarshipFaqData} />
                </div>
            </Section>
        </>
    );
}
