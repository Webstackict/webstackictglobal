"use server";

import { supabaseAdmin as supabase } from "./supabaseAdmin";

export async function submitScholarshipApplication(formData) {
    try {
        const rawFormData = Object.fromEntries(formData.entries());
        const {
            fullName, email, phone, age, state, program, reason, hasLaptop, passportPhoto, validId
        } = rawFormData;

        // Validation for required text/boolean fields
        if (!fullName || !email || !phone || !age || !state || !program || !reason || hasLaptop === undefined) {
            return { error: "Please fill in all required fields." };
        }

        // Validation for passport photo (Required)
        if (!passportPhoto || passportPhoto.size === 0) {
            return { error: "Passport photograph is required." };
        }

        // Validate File Sizes (Max 5MB)
        const MAX_SIZE = 5 * 1024 * 1024;
        if (passportPhoto.size > MAX_SIZE) {
            return { error: "Passport photo exceeds the 5MB limit." };
        }
        if (validId && validId.size > MAX_SIZE) {
            return { error: "Valid ID exceeds the 5MB limit." };
        }

        // Validation for File Types (Images only)
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        if (!allowedTypes.includes(passportPhoto.type)) {
            return { error: "Passport photo must be a JPG, JPEG, or PNG." };
        }
        if (validId && validId.size > 0 && !allowedTypes.includes(validId.type)) {
            return { error: "Valid ID must be a JPG, JPEG, or PNG." };
        }

        // Function to upload file and get public URL
        const uploadFile = async (file, folderPath) => {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
            const filePath = `${folderPath}/${fileName}`;

            const { data, error } = await supabase.storage
                .from('scholarships')
                .upload(filePath, file, { upsert: false });

            if (error) {
                console.error(`Error uploading to ${folderPath}:`, error);
                throw new Error(`Failed to upload ${folderPath.replace('scholarships/', '')} document.`);
            }

            const { data: { publicUrl } } = supabase.storage
                .from('scholarships')
                .getPublicUrl(filePath);

            return publicUrl;
        };

        // Upload files
        let passportUrl = null;
        let idUrl = null;

        try {
            passportUrl = await uploadFile(passportPhoto, "passports");
            if (validId && validId.size > 0) {
                idUrl = await uploadFile(validId, "ids");
            }
        } catch (uploadError) {
            return { error: uploadError.message };
        }

        // Insert into Database
        const { data, error } = await supabase
            .from('scholarship_applications')
            .insert([
                {
                    full_name: fullName,
                    email: email,
                    phone: phone,
                    age: parseInt(age, 10),
                    state: state,
                    program: program,
                    reason: reason,
                    has_laptop: hasLaptop === "yes" || hasLaptop === "true",
                    passport_url: passportUrl,
                    id_url: idUrl
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
