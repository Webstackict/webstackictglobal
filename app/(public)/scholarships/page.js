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
                <div className="card !p-8 lg:!p-10 max-w-3xl mx-auto">
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 text-gray-400">
                        <li className="flex gap-4">
                            <span className="text-blue-500 mt-1"><CheckCircle2 size={18} /></span>
                            <span>Must be at least <strong className="text-white">16 years old</strong>.</span>
                        </li>
                        <li className="flex gap-4">
                            <span className="text-blue-500 mt-1"><CheckCircle2 size={18} /></span>
                            <span>Must have access to a <strong className="text-white">smartphone or computer</strong>.</span>
                        </li>
                        <li className="flex gap-4">
                            <span className="text-blue-500 mt-1"><CheckCircle2 size={18} /></span>
                            <span>Highly committed to intensive training.</span>
                        </li>
                        <li className="flex gap-4">
                            <span className="text-blue-500 mt-1"><CheckCircle2 size={18} /></span>
                            <span>Complete official application process.</span>
                        </li>
                    </ul>
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
