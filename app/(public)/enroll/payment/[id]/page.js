"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import classes from "./page.module.css";
import { toast } from "sonner";
import { CreditCard, Landmark, ArrowRight, CheckCircle2, AlertCircle, FileUp, Copy, Loader2, ShieldCheck, Clock } from "lucide-react";

export default function PaymentPage() {
    const { id } = useParams();
    const router = useRouter();
    const [enrollment, setEnrollment] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [paymentMethod, setPaymentMethod] = useState("card");
    const [isProcessing, setIsProcessing] = useState(false);
    const [hasSubmittedTransfer, setHasSubmittedTransfer] = useState(false);

    // Bank Details
    const bankDetails = {
        name: "KUDA BANK",
        accountName: "WEBSTACK ICT GLOBAL",
        accountNumber: "2044813585",
        narration: enrollment ? `ENR-${enrollment.id.slice(0, 8).toUpperCase()}` : "ENR-PAYMENT"
    };

    useEffect(() => {
        const fetchEnrollment = async () => {
            try {
                const res = await fetch(`/api/enrollments/${id}`);
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || "Enrollment not found");

                // Redirect if already PAID or APPROVED
                if (data.payment_status === 'PAID' || data.approval_status === 'APPROVED') {
                    router.push(`/dashboard/enrollments`);
                    return;
                }

                setEnrollment(data);
                if (data.approval_status === 'AWAITING_VERIFICATION') {
                    setHasSubmittedTransfer(true);
                }
            } catch (err) {
                console.error(err);
                toast.error(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        if (id) fetchEnrollment();
    }, [id, router]);

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        toast.success("Copied to clipboard");
    };

    const initCardPayment = async () => {
        setIsProcessing(true);
        try {
            const res = await fetch('/api/paystack/init', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ enrollmentId: id })
            });

            const data = await res.json();
            if (res.ok && data.url) {
                window.location.href = data.url;
            } else {
                throw new Error(data.error || "Failed to initialize payment");
            }
        } catch (err) {
            toast.error(err.message);
            setIsProcessing(false);
        }
    };

    const handleMarkAsPaid = async () => {
        setIsProcessing(true);
        try {
            const res = await fetch(`/api/enrollments/verify-transfer`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    enrollmentId: id,
                    reference: bankDetails.narration
                })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to submit verification");

            toast.success("Payment submitted for verification!");
            setHasSubmittedTransfer(true);
        } catch (err) {
            toast.error(err.message);
        } finally {
            setIsProcessing(false);
        }
    };

    if (isLoading) {
        return (
            <div className={classes.paymentContainer}>
                <div className={classes.loadingState}>
                    <Loader2 className="animate-spin" size={48} color="#3b82f6" />
                    <p>Securing your enrollment record...</p>
                </div>
            </div>
        );
    }

    if (!enrollment) {
        return (
            <div className={classes.paymentContainer}>
                <div className={classes.paymentCard}>
                    <div className={classes.errorState}>
                        <div className={classes.statusIcon} style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
                            <AlertCircle size={40} />
                        </div>
                        <h2>Enrollment record not found</h2>
                        <p>We couldn't find the enrollment you're looking for. Please contact support if you believe this is an error.</p>
                        <button onClick={() => router.push('/enroll')} className={classes.submitBtn}>
                            Go Back to Enrollment
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (hasSubmittedTransfer) {
        return (
            <div className={classes.paymentContainer}>
                <div className={classes.paymentCard}>
                    <div className={classes.header}>
                        <div className={classes.statusIcon}>
                            <Clock size={40} className="animate-pulse" />
                        </div>
                        <h1>Verification Pending</h1>
                        <p>Your payment submission has been received.</p>
                    </div>
                    <div className={classes.infoBox}>
                        <p>Your enrollment is now in the <strong>AWAITING_VERIFICATION</strong> stage. Our admin team will review your transfer and notify you once approved.</p>
                        <div className={classes.referenceSection}>
                            <span className={classes.label}>Reference Number</span>
                            <p className={classes.referenceValue}>{bankDetails.narration}</p>
                        </div>
                    </div>
                    <button onClick={() => router.push('/dashboard/enrollments')} className={classes.submitBtn}>
                        Go to My Dashboard
                        <ArrowRight size={20} />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={classes.paymentContainer}>
            <div className={classes.paymentCard}>
                <div className={classes.header}>
                    <h1>Secure Checkout</h1>
                    <p>Finalizing your registration for {enrollment.cohort.name}</p>
                </div>

                <div className={classes.summarySection}>
                    <div className={classes.summaryGrid}>
                        <div className={classes.summaryItem}>
                            <span className={classes.label}>Program</span>
                            <span className={classes.value}>{enrollment.program.name}</span>
                        </div>
                        <div className={classes.summaryItem}>
                            <span className={classes.label}>Student</span>
                            <span className={classes.value}>{enrollment.full_name}</span>
                        </div>
                        <div className={classes.summaryItem}>
                            <span className={classes.label}>Enrollment ID</span>
                            <span className={classes.value}>{enrollment.id.slice(0, 8).toUpperCase()}</span>
                        </div>
                        <div className={classes.summaryItem}>
                            <span className={classes.label}>Status</span>
                            <span className={classes.value}>{enrollment.payment_status}</span>
                        </div>
                        <div className={classes.amountBox}>
                            <span className={classes.totalLabel}>Total Investment</span>
                            <span className={classes.totalValue}>
                                ₦{Number(enrollment.applied_price).toLocaleString()}
                            </span>
                        </div>
                    </div>
                </div>

                <div className={classes.methodsSection}>
                    <span className={classes.label}>Select Payment Method</span>
                    <div className={classes.methodToggle}>
                        <button
                            className={`${classes.methodBtn} ${paymentMethod === 'card' ? classes.active : ''}`}
                            onClick={() => setPaymentMethod('card')}
                        >
                            <CreditCard size={20} />
                            Pay with Card
                        </button>
                        <button
                            className={`${classes.methodBtn} ${paymentMethod === 'bank' ? classes.active : ''}`}
                            onClick={() => setPaymentMethod('bank')}
                        >
                            <Landmark size={20} />
                            Direct Transfer
                        </button>
                    </div>

                    <div className={classes.methodContent}>
                        {paymentMethod === 'card' ? (
                            <div className={classes.infoBox}>
                                <h3><ShieldCheck size={20} /> Paystack Security</h3>
                                <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: '1.6' }}>
                                    Your transaction is secured by Paystack. Pay via debit card, transfer, or USSD. Your enrollment will be activated instantly upon payment.
                                </p>
                                <button
                                    onClick={initCardPayment}
                                    className={classes.submitBtn}
                                    disabled={isProcessing}
                                >
                                    {isProcessing ? <Loader2 className="animate-spin" /> : "Initiate Secure Payment"}
                                    {!isProcessing && <ArrowRight size={20} />}
                                </button>
                            </div>
                        ) : (
                            <div className={classes.infoBox}>
                                <h3><Landmark size={20} /> Official Bank Details</h3>
                                <div className={classes.bankDetails}>
                                    <div className={classes.bankRow}>
                                        <span className={classes.bankLabel}>Bank Name</span>
                                        <span className={classes.bankValue}>{bankDetails.name}</span>
                                    </div>
                                    <div className={classes.bankRow}>
                                        <span className={classes.bankLabel}>Account Name</span>
                                        <span className={classes.bankValue}>{bankDetails.accountName}</span>
                                    </div>
                                    <div className={classes.bankRow}>
                                        <span className={classes.bankLabel}>Account Number</span>
                                        <span className={classes.bankValue}>
                                            {bankDetails.accountNumber}
                                            <button onClick={() => handleCopy(bankDetails.accountNumber)} className={classes.copyBtn} title="Copy Account Number">
                                                <Copy size={14} />
                                            </button>
                                        </span>
                                    </div>
                                    <div className={classes.bankRow}>
                                        <span className={classes.bankLabel}>Narration / Reference</span>
                                        <span className={classes.bankValue} style={{ color: 'var(--blue-400)' }}>
                                            {bankDetails.narration}
                                            <button onClick={() => handleCopy(bankDetails.narration)} className={classes.copyBtn} title="Copy Reference">
                                                <Copy size={14} />
                                            </button>
                                        </span>
                                    </div>
                                </div>

                                <div className={classes.uploadSection}>
                                    <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                                        Please use the reference above in your transfer narration. Once completed, notify our verification team below.
                                    </p>
                                    <button
                                        onClick={handleMarkAsPaid}
                                        className={classes.submitBtn}
                                        disabled={isProcessing}
                                    >
                                        {isProcessing ? <Loader2 className="animate-spin" /> : "Confirm Bank Transfer"}
                                        {!isProcessing && <ArrowRight size={20} />}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
