"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import PageBanner from '@/components/hero/page-banner';

function SuccessContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const ref = searchParams.get('ref');
    const method = searchParams.get('method');

    // Flutterwave returns tx_ref, Paystack returned reference
    const reference = ref || searchParams.get('reference') || searchParams.get('tx_ref') || searchParams.get('transaction_id');

    if (!reference) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center">
                <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">Notice</h2>
                <p className="text-gray-400 mb-6">Payment status could not be resolved automatically.</p>
                <button
                    onClick={() => router.push('/dashboard')}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-colors font-medium"
                >
                    Return to Home
                </button>
            </div>
        );
    }

    const isTransfer = method === 'transfer';

    return (
        <main className="min-h-screen pb-16">
            <PageBanner
                tagline={
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold mb-6 ${isTransfer ? 'bg-orange-500/10 border border-orange-500/20 text-orange-400' : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'}`}>
                        {isTransfer ? <Clock size={16} /> : <CheckCircle2 size={16} />}
                        {isTransfer ? 'Verification Pending' : 'Payment Successful'}
                    </div>
                }
                title={
                    <>
                        Application <br />
                        <span>Submitted!</span>
                    </>
                }
                subtitle={
                    isTransfer
                        ? "Your application and bank transfer notice have been logged successfully. We are verifying your payment."
                        : "Congratulations! Your application is complete and your payment has been automatically verified."
                }
            />

            <div className="max-w-[800px] mx-auto -mt-12 relative z-10 px-4">
                <div className="premium-card text-center !p-8 lg:!p-12">

                    <div className={`w-24 h-24 rounded-full mx-auto mb-8 flex items-center justify-center shadow-2xl ${isTransfer ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20 shadow-orange-500/20' : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-emerald-500/20'}`}>
                        {isTransfer ? <Clock size={48} /> : <CheckCircle2 size={48} />}
                    </div>

                    <h2 className="text-4xl font-bold text-white mb-6">
                        {isTransfer ? 'We are reviewing your transfer' : 'You are all set!'}
                    </h2>

                    <p className="text-gray-400 text-base mb-10 max-w-lg mx-auto leading-loose">
                        {isTransfer
                            ? "Our finance team is currently validating your payment against our records. This usually takes between 12-24 hours. You will receive an email once your application undergoes formal review."
                            : "Your payment was instantly verified. You will receive a confirmation email shortly with further instructions outlining the next steps for your scholarship evaluation."}
                    </p>

                    <div className="bg-black/20 border border-white/5 inline-flex flex-col items-center justify-center p-8 rounded-2xl mb-12 w-full max-w-sm">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Application Reference</p>
                        <p className="text-3xl font-mono text-blue-400 font-bold tracking-tight">{reference}</p>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link
                            href="/"
                            className="px-8 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold rounded-xl transition-all"
                        >
                            Back to Homepage
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default function SuccessPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><AlertCircle className="w-8 h-8 text-blue-500 animate-spin" /></div>}>
            <SuccessContent />
        </Suspense>
    );
}
