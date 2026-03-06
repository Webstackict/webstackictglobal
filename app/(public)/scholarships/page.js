import ScholarshipForm from '@/components/scholarships/scholarship-form';
import Section from '@/components/section';
import ProgramsGrid from '@/components/cards/programs-grid';
import PageBanner from '@/components/hero/page-banner';
import Tagline from '@/components/ui/tagline';
import ValueQuote from '@/components/cards/value-quote';
import FaqSection from '@/components/FAQ/faq';
import { scholarshipFaqData } from '@/lib/contents/scholarshipFaqData';

export const metadata = {
    title: 'Webstack ICT Global Scholarship Program 2026',
    description: 'Apply for a life-changing opportunity to start your career in technology with Webstack ICT Global scholarships.',
};

export default function ScholarshipPage() {
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
                secondaryBtnText="View Eligibility"
                primaryBtnRoute="#application-form"
                secondaryBtnRoute="#eligibility"
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
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                    <div className="card">
                        <h3 style={{ color: 'var(--teal-400)', marginBottom: '1rem', fontSize: '1.25rem' }}>Why Apply?</h3>
                        <p style={{ color: 'var(--gray-text-400)', marginBottom: '1rem' }}>This is a rare opportunity for beginners and tech enthusiasts to fast-track their careers and become highly employable.</p>
                        <ul style={{ color: 'var(--gray-text-400)', listStyleType: 'disc', paddingLeft: '1.5rem', lineHeight: '1.8' }}>
                            <li><strong style={{ color: 'var(--white)' }}>100% Tuition Covered:</strong> Learn high-income skills without the burden of expensive tuition fees.</li>
                            <li><strong style={{ color: 'var(--white)' }}>Beginner Friendly:</strong> Designed for absolute beginners with zero prior coding or tech experience.</li>
                            <li><strong style={{ color: 'var(--white)' }}>Hands-on Projects:</strong> Build a professional portfolio through real-world, practical applications.</li>
                            <li><strong style={{ color: 'var(--white)' }}>Recognized Certification:</strong> Receive an industry-recognized certificate upon passing the final assessment.</li>
                            <li><strong style={{ color: 'var(--white)' }}>Limited Slots:</strong> This highly competitive program only accepts the most dedicated applicants.</li>
                        </ul>
                    </div>
                    <div className="card">
                        <h3 style={{ color: 'var(--teal-400)', marginBottom: '1rem', fontSize: '1.25rem' }}>Important Notice</h3>
                        <p style={{ color: 'var(--gray-text-400)', marginBottom: '1rem', lineHeight: '1.6' }}>While the tuition for the program is heavily subsidized or covered by the scholarship, all applicants are required to pay a non-refundable administrative fee of <strong style={{ color: 'var(--white)' }}>₦30,000</strong>.</p>
                        <ValueQuote
                            title="Application Processing Fee: ₦30,000"
                            text="This fee must be paid during the application process in order for your application to be reviewed by the board."
                        />
                    </div>
                </div>
            </Section>

            <Section
                label="available-programs"
                title={
                    <>
                        Available <span className="gradientText">Programs</span>
                    </>
                }
                subtitle="Choose from our comprehensive list of high-income tech skills."
                sectionBgColor="sectionLightBlue"
            >
                <ProgramsGrid featuredTitles={["Data Analytics", "Cybersecurity", "UI/UX Design", "Web Development", "Mobile App Development", "Forex Trading"]} />
            </Section>

            <Section
                label="eligibility"
                title={
                    <>
                        Eligibility <span className="gradientText">Requirements</span>
                    </>
                }
            >
                <div className="card" style={{ maxWidth: '40rem', margin: '0 auto' }}>
                    <ul style={{ color: 'var(--gray-text-400)', listStyleType: 'disc', paddingLeft: '1.5rem', lineHeight: '2' }}>
                        <li>Must be at least <strong style={{ color: 'var(--white)' }}>16 years old</strong>.</li>
                        <li>Must be highly committed to completing the intensive training program.</li>
                        <li>Must have access to a <strong style={{ color: 'var(--white)' }}>smartphone or computer</strong>.</li>
                        <li>Must complete the official scholarship application form below.</li>
                    </ul>
                </div>
            </Section>

            <Section
                label="application-form"
                title={
                    <>
                        Scholarship <span className="gradientText">Application Form</span>
                    </>
                }
                subtitle="Please fill out all required fields accurately. This form is strictly for the scholarship program."
                sectionBgColor="sectionLightBlue"
            >
                <div id="application-form" style={{ maxWidth: '45rem', margin: '0 auto' }}>
                    <ScholarshipForm />
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
