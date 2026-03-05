"use server";

import { supabaseAdmin as supabase } from "../db/supabaseAdmin";

export async function joinWaitlist(prevState, formData) {
    const email = formData.get("email");

    if (!email || !email.includes("@")) {
        return { error: "Please provide a valid email address." };
    }

    try {
        const { error } = await supabase
            .from("waitlist")
            .insert([{ email, created_at: new Date().toISOString() }]);

        if (error) {
            if (error.code === "23505") {
                return { message: "You are already on the waitlist!" };
            }
            throw error;
        }

        return { message: "Successfully joined the waitlist!" };
    } catch (err) {
        console.error("Waitlist error:", err);
        return { error: "Failed to join waitlist. Please try again later." };
    }
}
