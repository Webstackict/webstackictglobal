"use client";

import { signup } from "@/actions/auth-actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import classes from "../(public)/auth/page.module.css";
import { iconsConfig } from "@/lib/icons/iconsConfig";
import FormSubmitButton from "@/components/ui/form-submit-button";

const EmailIcon = iconsConfig["email"];
const LockIcon = iconsConfig["lock"];
const SecurityIcon = iconsConfig["security"];

export default function SignupPage() {
    const router = useRouter();

    async function handleAction(formData) {
        const res = await signup(null, formData);

        if (res?.errors) {
            Object.values(res.errors).forEach(err => toast.error(err));
        } else if (res?.success) {
            toast.success(res.message);
            // Signup triggers email confirmation, redirect will happen after clicking link
        }
    }

    return (
        <section className={classes.authSection}>
            <div className={classes.wrapper}>
                <div className={classes.card}>
                    <div className={classes.glowBar}></div>
                    <div className={classes.header}>
                        <div className={classes.iconBox}><SecurityIcon /></div>
                        <h1>Create Account</h1>
                        <p>Join Webstack ICT Global today</p>
                    </div>

                    <form action={handleAction} className={classes.form}>
                        <div className={classes.field}>
                            <label htmlFor="email"><EmailIcon /><span>Email Address</span></label>
                            <input type="email" name="email" id="email" required placeholder="name@company.com" />
                        </div>

                        <div className={classes.field}>
                            <label htmlFor="password"><LockIcon /><span>Password</span></label>
                            <input type="password" name="password" id="password" required placeholder="Minimum 8 characters" />
                        </div>

                        <div className={classes.field}>
                            <label htmlFor="confirmPassword"><LockIcon /><span>Confirm Password</span></label>
                            <input type="password" name="confirmPassword" id="confirmPassword" required placeholder="Re-enter password" />
                        </div>

                        <FormSubmitButton className={classes.submitBtn}>
                            Sign Up
                        </FormSubmitButton>
                    </form>

                    <div className={classes.signupRedirect}>
                        <p>Already have an account? <Link href="/login">Login</Link></p>
                    </div>
                </div>
            </div>
        </section>
    );
}
