"use client";

import { resetPasswordForEmail } from "@/actions/auth-actions";
import { toast } from "sonner";
import Link from "next/link";
import styles from "./page.module.css";
import { iconsConfig } from "@/lib/icons/iconsConfig";
import FormSubmitButton from "@/components/ui/form-submit-button";

const EmailIcon = iconsConfig["email"];
const SecurityIcon = iconsConfig["security"];

export default function ResetPasswordRequestPage() {
    async function handleAction(formData) {
        const res = await resetPasswordForEmail(null, formData);

        if (res?.errors) {
            Object.values(res.errors).forEach(err => toast.error(err));
        } else if (res?.success) {
            toast.success(res.message);
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Forgot Password?</h1>
                <p>Enter your email and we&apos;ll send you a reset link</p>
            </div>

            <form action={handleAction} className={styles.form}>
                <div className={styles.field}>
                    <label htmlFor="email">Email Address</label>
                    <input type="email" name="email" id="email" required placeholder="name@company.com" />
                </div>

                <FormSubmitButton className={styles.submitBtn}>
                    Send Reset Link
                </FormSubmitButton>
            </form>

            <div className={styles.signupRedirect}>
                <p><Link href="/login">Back to Login</Link></p>
            </div>
        </div>
    );
}
