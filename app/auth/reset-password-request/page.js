"use client";

import { resetPasswordForEmail } from "@/actions/auth-actions";
import { toast } from "sonner";
import Link from "next/link";
import classes from "../page.module.css";
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
        <div className={classes.card}>
            <div className={classes.glowBar}></div>
            <div className={classes.header}>
                <div className={classes.iconBox}><SecurityIcon /></div>
                <h1>Forgot Password?</h1>
                <p>Enter your email and we'll send you a reset link</p>
            </div>

            <form action={handleAction} className={classes.form}>
                <div className={classes.field}>
                    <label htmlFor="email"><EmailIcon /><span>Email Address</span></label>
                    <input type="email" name="email" id="email" required placeholder="name@company.com" />
                </div>

                <FormSubmitButton className={classes.submitBtn}>
                    Send Reset Link
                </FormSubmitButton>
            </form>

            <div className={classes.signupRedirect}>
                <p><Link href="/login">Back to Login</Link></p>
            </div>
        </div>
    );
}
