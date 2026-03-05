"use server";

import { supabaseAdmin } from "../db/supabaseAdmin";

// Regular expression for basic email validation
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Regular expression for UUID validation
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Server action to handle student enrollment.
 */
export async function enrollStudent(prevState, formData) {
    const full_name = formData.get("full_name")?.toString().trim();
    const email = formData.get("email")?.toString().trim().toLowerCase();
    const phone = formData.get("phone")?.toString().trim();
    const program = formData.get("program")?.toString().trim();
    const cohort_id = formData.get("cohort_id")?.toString().trim();

    // 1. Required fields validation
    if (!full_name || !email || !phone || !program || !cohort_id) {
        return {
            success: false,
            message: "All fields are required. Please complete the form.",
        };
    }

    // 2. Email format validation
    if (!EMAIL_REGEX.test(email)) {
        return {
            success: false,
            message: "Please enter a valid email address.",
        };
    }

    // 3. Cohort ID validation (must be a valid UUID)
    if (!UUID_REGEX.test(cohort_id)) {
        console.error("Invalid cohort_id submitted:", cohort_id);
        return {
            success: false,
            message: "Invalid cohort selection. Please try again.",
        };
    }

    try {
        // Fetch department_id from the cohort
        const { data: cohortData, error: cohortError } = await supabaseAdmin
            .from("cohorts")
            .select("department_id")
            .eq("id", cohort_id)
            .maybeSingle();

        if (cohortError) {
            console.error("Supabase query error in enrollStudent:", {
                message: cohortError.message,
                code: cohortError.code,
                details: cohortError.details,
            });
            return {
                success: false,
                message: "An error occurred. Please try again later.",
            };
        }

        if (!cohortData) {
            return {
                success: false,
                message: "Invalid cohort selection. Please try again.",
            };
        }

        const { error } = await supabaseAdmin
            .from("enrollments")
            .insert({
                full_name,
                email,
                phone,
                program,
                cohort_id,
                department_id: cohortData.department_id,
                payment_status: "pending",
            });

        if (error) {
            console.error("Supabase enrollment error:", error);
            throw error;
        }

        return {
            success: true,
            message: "Enrollment successful! We will contact you shortly.",
        };
    } catch (err) {
        console.error("Enrollment server action error:", err);
        return {
            success: false,
            message: "Something went wrong. Please try again later.",
        };
    }
}
