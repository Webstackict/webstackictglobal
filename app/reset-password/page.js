"use client";

import { updatePassword } from "@/actions/auth-actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import classes from "../(public)/auth/page.module.css";
import { iconsConfig } from "@/lib/icons/iconsConfig";
import FormSubmitButton from "@/components/ui/form-submit-button";

const LockIcon = iconsConfig["lock"];
const SecurityIcon = iconsConfig["security"];

export default function ResetPasswordPage() {
    const router = useRouter();

    async function handleAction(formData) {
        const res = await updatePassword(null, formData);

        if (res?.errors) {
            Object.values(res.errors).forEach(err => toast.error(err));
        } else if (res?.success) {
            toast.success(res.message);
            router.push("/login");
        }
    }

    return (
        <section className={classes.authSection}>
            <div className={classes.wrapper}>
                <div className={classes.card}>
                    <div className={classes.glowBar}></div>
                    <div className={classes.header}>
                        <div className={classes.iconBox}><SecurityIcon /></div>
                        <h1>Reset Password</h1>
                        <p>Enter your new password below</p>
                    </div>

                    <form action={handleAction} className={classes.form}>
                        <div className={classes.field}>
                            <label htmlFor="password"><LockIcon /><span>New Password</span></label>
                            <input type="password" name="password" id="password" required placeholder="Minimum 8 characters" />
                        </div>

                        <div className={classes.field}>
                            <label htmlFor="confirmPassword"><LockIcon /><span>Confirm New Password</span></label>
                            <input type="password" name="confirmPassword" id="confirmPassword" required placeholder="Re-enter password" />
                        </div>

                        <FormSubmitButton className={classes.submitBtn}>
                            Update Password
                        </FormSubmitButton>
                    </form>
                </div>
            </div>
        </section>
    );
}
