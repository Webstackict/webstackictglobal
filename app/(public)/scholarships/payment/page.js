"use client";

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { CreditCard, Landmark, ShieldCheck, CheckCircle2, Copy, RefreshCw, AlertCircle } from 'lucide-react';
import PageBanner from '@/components/hero/page-banner';
import Section from '@/components/section';

function PaymentPortalContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const ref = searchParams.get('ref');

    const [application, setApplication] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isProcessingPaystack, setIsProcessingPaystack] = useState(false);
    const [isVerifyingTransfer, setIsVerifyingTransfer] = useState(false);
    const [activeTab, setActiveTab] = useState('card'); // 'card' or 'transfer'
    const [publicBankDetails, setPublicBankDetails] = useState({
        bank_name: "KUDA BANK",
        bank_account_name: "WEBSTACK ICT GLOBAL",
        bank_account_number: "2044813585"
    });

    useEffect(() => {
        if (!ref) {
            setIsLoading(false);
            return;
        }

        const fetchApplication = async () => {
            try {
                const [res, settingsRes] = await Promise.all([
                    fetch(`/api/scholarship-applications/by-ref/${ref}`),
                    fetch(`/api/settings/public`)
                ]);

                const settingsData = await settingsRes.json();
                if (settingsRes.ok && settingsData.settings) {
                    setPublicBankDetails(settingsData.settings);
                }

                if (res.ok) {
                    const data = await res.json();
                    setApplication(data);

                    // If already paid, redirect to success
                    if (data.payment_status === 'paid' || data.payment_status === 'pending_approval') {
                        router.push(`/scholarships/payment/success?ref=${ref}`);
                    }
                } else {
                    toast.error("Invalid Application Reference");
                }
            } catch (err) {
                toast.error("Failed to load application details");
            } finally {
                setIsLoading(false);
            }
        };

        fetchApplication();
    }, [ref, router]);

    const handlePaystackCheckout = async () => {
        setIsProcessingPaystack(true);
        try {
            const res = await fetch('/api/paystack/scholarship-init', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ applicationReference: ref })
            });
            const data = await res.json();

            if (res.ok && data.url) {
                window.location.href = data.url;
            } else {
                toast.error(data.message || "Failed to initialize secure checkout");
                setIsProcessingPaystack(false);
            }
        } catch (err) {
            toast.error("Network error analyzing checkout");
            setIsProcessingPaystack(false);
        }
    };

    const handleBankTransferComplete = async () => {
        setIsVerifyingTransfer(true);
        try {
            // Update DB to denote pending manual verification
            const res = await fetch(`/api/scholarship-applications/${application.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    payment_status: 'pending_approval',
                    payment_method: 'bank_transfer'
                })
            });

            if (res.ok) {
                toast.success("Transfer logged. Pending admin approval.");
                router.push(`/scholarships/payment/success?ref=${ref}&method=transfer`);
            } else {
                toast.error("Failed to log transfer. Please contact support.");
            }
        } catch (error) {
            toast.error("A network error occurred.");
        } finally {
            setIsVerifyingTransfer(false);
        }
    };

    const copyToClipboard = (text, label) => {
        navigator.clipboard.writeText(text);
        toast.success(`${label} copied to clipboard!`);
    };

    if (isLoading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center">
                <RefreshCw className="w-10 h-10 text-blue-500 animate-spin mb-4" />
                <p className="text-gray-400 font-medium">Securing payment channel...</p>
            </div>
        );
    }

    if (!application) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center">
                <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">Invalid Session</h2>
                <p className="text-gray-400 mb-6">We could not locate your application reference.</p>
                <button
                    onClick={() => router.push('/scholarships')}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-colors font-medium"
                >
                    Return to Scholarships
                </button>
            </div>
        );
    }

    return (
        <main className="min-h-screen pb-16">
            <PageBanner
                tagline={<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-semibold mb-6"><ShieldCheck size={16} /> Secure Payment Portal</div>}
                title={
                    <>
                        Complete Your <br />
                        <span>Application Fee</span>
                    </>
                }
                subtitle="Select a payment method below to finalize your application to Webstack ICT Global."
            />

            <Section sectionBgColor="sectionDark">
                <div className="max-w-[1000px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Left Column: Order Summary */}
                    <div className="lg:col-span-5 order-2 lg:order-1">
                        <div className="premium-card sticky top-24 !p-6 lg:!p-8">
                            <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">Application Summary</h3>

                            <div className="space-y-6">
                                <div>
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Applicant Name</p>
                                    <p className="text-base font-semibold text-white">{application.full_name}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Email Address</p>
                                    <p className="text-base text-gray-300">{application.email}</p>
                                </div>
                                <div className="pt-5 border-t border-white/5">
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Target Program</p>
                                    <p className="text-lg font-bold text-blue-400">{application.program_title}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center justify-between">
                                        Application Reference
                                        <span className="text-[10px] bg-red-500/20 border border-red-500/20 text-red-300 px-2 py-0.5 rounded-full tracking-normal">Keep Safe</span>
                                    </p>
                                    <div className="flex items-center justify-between bg-black/20 border border-white/5 p-3 rounded-xl mt-1">
                                        <code className="text-base text-gray-300 font-mono font-bold">
                                            {application.application_reference}
                                        </code>
                                        <button
                                            onClick={() => copyToClipboard(application.application_reference, 'Reference')}
                                            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors bg-white/5 border border-white/5"
                                        >
                                            <Copy size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-dashed border-white/20">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-gray-400">Administrative Fee</span>
                                    <span className="text-white font-medium">₦{Number(application.application_fee).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center pt-2">
                                    <span className="text-lg font-bold text-white">Total Output</span>
                                    <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                                        ₦{Number(application.application_fee).toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Payment Methods */}
                    <div className="lg:col-span-7 order-1 lg:order-2">
                        <div className="premium-card !p-6 lg:!p-8">
                            <h3 className="text-xl font-bold text-white mb-6">Payment Method</h3>

                            <div className="flex flex-col sm:flex-row gap-4 mb-10 bg-black/20 p-2 rounded-2xl border border-white/5">
                                <button
                                    onClick={() => setActiveTab('card')}
                                    className={`flex-1 flex items-center justify-center gap-2 py-4 px-4 rounded-xl text-sm font-bold transition-all ${activeTab === 'card' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'}`}
                                >
                                    <CreditCard size={18} /> Pay Online securely
                                </button>
                                <button
                                    onClick={() => setActiveTab('transfer')}
                                    className={`flex-1 flex items-center justify-center gap-2 py-4 px-4 rounded-xl text-sm font-bold transition-all ${activeTab === 'transfer' ? 'bg-white/10 text-white shadow-lg backdrop-blur-sm border border-white/5' : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'}`}
                                >
                                    <Landmark size={18} /> Direct Bank Transfer
                                </button>
                            </div>

                            {/* Paystack Panel */}
                            {activeTab === 'card' && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <div className="p-5 border border-blue-500/20 bg-blue-500/5 rounded-xl text-blue-100/80 leading-relaxed text-sm">
                                        You will be redirected to Paystack&apos;s highly secure payment gateway where you can pay via <strong>Debit Card, USSD, or Bank Transfer</strong>. Your scholarship application will be automatically approved immediately upon successful payment.
                                    </div>

                                    <div className="flex items-center gap-3 text-sm text-gray-400 justify-center mb-6">
                                        <ShieldCheck size={16} className="text-emerald-500" />
                                        Guaranteed safe & encrypted transaction
                                    </div>

                                    <button
                                        onClick={handlePaystackCheckout}
                                        disabled={isProcessingPaystack}
                                        className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold rounded-xl shadow-xl shadow-blue-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 text-lg"
                                    >
                                        {isProcessingPaystack ? <RefreshCw className="animate-spin" size={20} /> : <CreditCard size={20} />}
                                        {isProcessingPaystack ? "Initializing Secure Gateway..." : `Pay ₦${Number(application.application_fee).toLocaleString()} Now`}
                                    </button>
                                </div>
                            )}

                            {/* Bank Transfer Panel */}
                            {activeTab === 'transfer' && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <div className="p-5 border border-orange-500/20 bg-orange-500/5 rounded-xl text-orange-200/80 leading-relaxed text-sm mb-6">
                                        Please transfer exactly <strong>₦{Number(application.application_fee).toLocaleString()}</strong> to the account details below. Manual verification typically takes 12-24 hours.
                                    </div>

                                    <div className="bg-black/20 border border-white/10 rounded-2xl p-6 lg:p-8 space-y-6">
                                        <div>
                                            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1.5">Bank Name</p>
                                            <p className="text-xl text-white font-bold">{publicBankDetails.bank_name}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-2 flex justify-between items-center">
                                                Account Number
                                            </p>
                                            <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/5">
                                                <p className="text-3xl lg:text-4xl text-blue-400 font-bold tracking-tight font-mono">{publicBankDetails.bank_account_number}</p>
                                                <button onClick={() => copyToClipboard(publicBankDetails.bank_account_number, 'Account Number')} className="flex items-center gap-2 px-4 py-2 text-sm font-bold bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors">
                                                    <Copy size={16} /> Copy
                                                </button>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1.5">Account Name</p>
                                            <p className="text-xl text-white font-bold flex items-center gap-2">{publicBankDetails.bank_account_name} <CheckCircle2 size={20} className="text-emerald-500" /></p>
                                        </div>

                                        <div className="pt-5 border-t border-white/10 mt-5">
                                            <p className="text-xs text-red-400/80 font-bold uppercase tracking-wider mb-2">Must Read: Payment Narration</p>
                                            <p className="text-sm text-gray-300 leading-relaxed">
                                                When making the transfer, you MUST use your exact Application Reference <strong className="text-white bg-white/10 px-1.5 py-0.5 rounded font-mono break-all">{application.application_reference}</strong> as the payment strictly as the remark/narration.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="pt-4">
                                        <button
                                            onClick={handleBankTransferComplete}
                                            disabled={isVerifyingTransfer}
                                            className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 text-lg"
                                        >
                                            {isVerifyingTransfer ? <RefreshCw className="animate-spin" size={20} /> : null}
                                            I have sent the money
                                        </button>
                                        <p className="text-center text-xs text-gray-500 mt-4">By clicking this, you confirm you have initiated the transfer from your bank app.</p>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </Section>
        </main>
    );
}

export default function ScholarshipPaymentPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><RefreshCw className="w-8 h-8 text-blue-500 animate-spin" /></div>}>
            <PaymentPortalContent />
        </Suspense>
    );
}
