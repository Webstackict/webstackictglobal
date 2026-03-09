"use client";

import { completeOnboarding } from "@/actions/auth-actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import classes from "../(public)/auth/page.module.css";
import { iconsConfig } from "@/lib/icons/iconsConfig";
import FormSubmitButton from "@/components/ui/form-submit-button";

const SecurityIcon = iconsConfig["security"];

export default function OnboardingPage() {
    const router = useRouter();

    async function handleAction(formData) {
        const res = await completeOnboarding(null, formData);

        if (res?.errors) {
            if (res.errors.global) toast.error(res.errors.global);
            if (res.errors.fullName) toast.error(res.errors.fullName);
        } else if (res?.success) {
            toast.success("Welcome aboard!");
            router.push("/dashboard");
        }
    }

    return (
        <section className={classes.authSection}>
            <div className={classes.wrapper}>
                <div className={classes.card}>
                    <div className={classes.glowBar}></div>
                    <div className={classes.header}>
                        <div className={classes.iconBox}><SecurityIcon /></div>
                        <h1>Complete Your Profile</h1>
                        <p>Tell us a bit about yourself to get started</p>
                    </div>

                    <form action={handleAction} className={classes.form}>
                        <div className={classes.field}>
                            <label htmlFor="fullName"><span>Full Name</span></label>
                            <input type="text" name="fullName" id="fullName" required placeholder="John Doe" />
                        </div>

                        <FormSubmitButton className={classes.submitBtn}>
                            Start Learning
                        </FormSubmitButton>
                    </form>
                </div>
            </div>
        </section>
    );
}
