"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import classes from '@/components/scholarships/scholarship-form.module.css';
import Section from '@/components/section';
import PageBanner from '@/components/hero/page-banner';
import Tagline from '@/components/ui/tagline';
import { toast } from 'sonner';
import { useSearchParams } from 'next/navigation';

export default function ScholarshipApplyPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const preselectedProgramSlug = searchParams.get('program');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [programs, setPrograms] = useState([]);
    const [isLoadingPrograms, setIsLoadingPrograms] = useState(true);
    const [errorMsg, setErrorMsg] = useState("");

    // Fetch active scholarship programs
    useEffect(() => {
        const fetchPrograms = async () => {
            try {
                const res = await fetch('/api/scholarship-programs?status=active');
                if (res.ok) {
                    const data = await res.json();
                    setPrograms(data);
                } else {
                    toast.error("Failed to load available programs.");
                }
            } catch (err) {
                toast.error("Network error while loading programs.");
            } finally {
                setIsLoadingPrograms(false);
            }
        };
        fetchPrograms();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMsg("");

        const formData = {
            full_name: e.target.fullName.value,
            email: e.target.email.value,
            phone: e.target.phone.value,
            program_id: e.target.programId.value,
            short_about_you: e.target.shortAboutYou.value,
            referral_code: e.target.referralCode.value || ""
        };

        try {
            const response = await fetch('/api/scholarship-applications', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (!response.ok) {
                setErrorMsg(result.error || "Submission failed. Please try again.");
            } else {
                toast.success("Application registered. Redirecting to secure payment portal...");
                // Redirect to payment portal
                router.push(`/scholarships/payment?ref=${result.applicationReference}`);
            }
        } catch (err) {
            setErrorMsg("A network error occurred. Please check your connection and try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="min-h-screen pb-16">
            <PageBanner
                tagline={<Tagline text="Step 1 of 2: Application" icon="rocket" />}
                title={
                    <>
                        Complete Your <br />
                        <span>Scholarship Application</span>
                    </>
                }
                subtitle="Join Webstack ICT Global. Fill out this brief form to initiate your application process."
                primaryBtnText="Go Back"
                secondaryBtnText="Explore Tracks"
                primaryBtnRoute="/scholarships"
                secondaryBtnRoute="/scholarships/programs"
            />

            <Section
                label="scholarship-form-section"
                title={
                    <>
                        Applicant <span className="gradientText">Details</span>
                    </>
                }
                subtitle="Please provide accurate information. Your scholarship evaluation depends on it."
                sectionBgColor="sectionDark"
            >
                <div id="form-container" className="card premium-glow-blue" style={{ maxWidth: '45rem', margin: '0 auto' }}>
                    <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                        {errorMsg && <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm">{errorMsg}</div>}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-2">
                                <label htmlFor="fullName" className="text-sm font-bold text-gray-400 uppercase tracking-widest">Legal Full Name <span className="text-red-500">*</span></label>
                                <input type="text" id="fullName" name="fullName" className="w-full bg-[#111623] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium" required placeholder="John Doe" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label htmlFor="email" className="text-sm font-bold text-gray-400 uppercase tracking-widest">Email Address <span className="text-red-500">*</span></label>
                                <input type="email" id="email" name="email" className="w-full bg-[#111623] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium" required placeholder="john@example.com" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-2">
                                <label htmlFor="phone" className="text-sm font-bold text-gray-400 uppercase tracking-widest">Phone Number <span className="text-red-500">*</span></label>
                                <input type="tel" id="phone" name="phone" className="w-full bg-[#111623] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium" required placeholder="+234..." />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label htmlFor="programId" className="text-sm font-bold text-gray-400 uppercase tracking-widest">Target Program <span className="text-red-500">*</span></label>
                                <select
                                    id="programId"
                                    name="programId"
                                    className="w-full bg-[#111623] border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium appearance-none"
                                    required
                                    defaultValue={programs.find(p => p.slug === preselectedProgramSlug)?.id || ""}
                                    key={programs.length} // Force re-render once programs load to apply defaultValue correctly if needed
                                >
                                    <option value="" disabled>Select a Program...</option>
                                    {!isLoadingPrograms && programs.map(prog => (
                                        <option key={prog.id} value={prog.id}>{prog.title}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="referralCode" className="text-sm font-bold text-gray-400 uppercase tracking-widest">Referral Code (Optional)</label>
                            <input
                                type="text"
                                id="referralCode"
                                name="referralCode"
                                className="w-full bg-[#111623] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium"
                                placeholder="Enter referral code if you have one"
                                defaultValue={typeof document !== 'undefined' ? document.cookie.split('; ').find(row => row.startsWith('webstack_referral_code='))?.split('=')[1] : ""}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="shortAboutYou" className="text-sm font-bold text-gray-400 uppercase tracking-widest">Personal Statement / About You <span className="text-red-500">*</span></label>
                            <textarea
                                id="shortAboutYou"
                                name="shortAboutYou"
                                className="w-full bg-[#111623] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium resize-y min-h-[140px]"
                                required
                                rows={5}
                                placeholder="Tell us about yourself and why you're applying for this scholarship..."
                            ></textarea>
                        </div>

                        <div className="pt-4 border-t border-white/5 mt-2">
                            <button
                                type="submit"
                                disabled={isSubmitting || isLoadingPrograms}
                                className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 text-lg tracking-wide"
                            >
                                {isSubmitting ? 'Processing Application...' : 'Proceed to Payment (₦30,000)'}
                            </button>
                        </div>
                    </form>
                </div>
            </Section>
        </main>
    );
}
