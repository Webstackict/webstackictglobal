"use server";

import { supabaseAdmin as supabase } from "./supabaseAdmin.js";
import { cookies } from "next/headers";

export async function submitScholarshipApplication(formData) {
    try {
        const rawFormData = Object.fromEntries(formData.entries());
        const {
            fullName, email, phone, country, state, departmentId, experienceLevel, motivation, portfolioUrl, linkedinUrl, referralCode
        } = rawFormData;

        // Validation for required text fields
        if (!fullName || !email || !phone || !state || !departmentId || !experienceLevel || !motivation) {
            return { error: "Please fill in all required fields." };
        }

        // Insert into Database
        const { data, error } = await supabase
            .from('scholarship_applications')
            .insert([
                {
                    full_name: fullName,
                    email: email,
                    phone: phone,
                    country: country || "Nigeria",
                    state: state,
                    department_id: departmentId,
                    experience_level: experienceLevel.toLowerCase(),
                    motivation: motivation,
                    portfolio_url: portfolioUrl,
                    linkedin_url: linkedinUrl,
                    referral_code: referralCode || (await cookies()).get('webstack_referral_code')?.value || null,
                    status: 'pending'
                }
            ]);

        if (error) {
            console.error("Database insert error:", error);
            return { error: "Failed to submit application. Please try again." };
        }

        return { success: true, message: "Application submitted successfully!" };

    } catch (err) {
        console.error("Caught error in submitScholarshipApplication:", err);
        return { error: "An unexpected error occurred. Please try again later." };
    }
}
