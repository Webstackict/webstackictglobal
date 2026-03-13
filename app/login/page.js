"use client";

import { useState } from "react";
import { signin, signinWithMagicLink } from "@/actions/auth-actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import classes from "../(public)/auth/page.module.css";
import { iconsConfig } from "@/lib/icons/iconsConfig";
import FormSubmitButton from "@/components/ui/form-submit-button";

const EmailIcon = iconsConfig["email"];
const LockIcon = iconsConfig["lock"];
const SecurityIcon = iconsConfig["security"];

export default function LoginPage() {
    const [useMagicLink, setUseMagicLink] = useState(false);
    const router = useRouter();

    async function handleAction(formData) {
        const action = useMagicLink ? signinWithMagicLink : signin;
        const res = await action(null, formData);

        if (res?.errors) {
            Object.values(res.errors).forEach(err => toast.error(err));
        } else if (res?.success) {
            toast.success(res.message);
            if (!useMagicLink) router.push("/dashboard");
        }
    }

    return (
        <section className={classes.authSection}>
            <div className={classes.wrapper}>
                <div className={classes.card}>
                    <div className={classes.glowBar}></div>
                    <div className={classes.header}>
                        <div className={classes.iconBox}><SecurityIcon /></div>
                        <h1>Welcome Back</h1>
                        <p>Login to your Webstack account</p>
                    </div>

                    <form action={handleAction} className={classes.form}>
                        <div className={classes.field}>
                            <label htmlFor="email"><EmailIcon /><span>Email Address</span></label>
                            <input type="email" name="email" id="email" required placeholder="name@company.com" />
                        </div>

                        {!useMagicLink && (
                            <div className={classes.field}>
                                <label htmlFor="password"><LockIcon /><span>Password</span></label>
                                <input type="password" name="password" id="password" required placeholder="••••••••" />
                                <div className={classes.fieldFooter}>
                                    <Link href="/auth/reset-password-request" style={{ fontSize: '12px', color: '#3b82f6' }}>Forgot Password?</Link>
                                </div>
                            </div>
                        )}

                        <FormSubmitButton className={classes.submitBtn}>
                            {useMagicLink ? "Send Magic Link" : "Login"}
                        </FormSubmitButton>
                    </form>

                    <div className={classes.divider}><span>or</span></div>

                    <button
                        onClick={() => setUseMagicLink(!useMagicLink)}
                        className={classes.socialBtn}
                        style={{ justifyContent: 'center' }}
                    >
                        {useMagicLink ? "Login with Password" : "Login with Magic Link"}
                    </button>

                    <div className={classes.signupRedirect}>
                        <p>Don&apos;t have an account? <Link href="/signup">Sign Up</Link></p>
                    </div>
                </div>
            </div>
        </section>
    );
}
