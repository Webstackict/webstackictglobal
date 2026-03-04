"use client";

import { useActionState } from "react";
import { joinWaitlist } from "@/lib/actions/waitlist-action";
import classes from "./waitlist-form.module.css";
import { toast } from "sonner";
import { useEffect } from "react";

export default function WaitlistForm() {
    const [state, action, isPending] = useActionState(joinWaitlist, null);

    useEffect(() => {
        if (state?.message) {
            toast.success(state.message);
        }
        if (state?.error) {
            toast.error(state.error);
        }
    }, [state]);

    return (
        <div className={classes.waitlistContainer}>
            <p className={classes.waitlistMsg}>Next cohort opens soon. Join the waitlist.</p>
            <form action={action} className={classes.form}>
                <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    required
                    className={classes.input}
                    disabled={isPending}
                />
                <button type="submit" className={classes.button} disabled={isPending}>
                    {isPending ? "Joining..." : "Join Waitlist"}
                </button>
            </form>
        </div>
    );
}
