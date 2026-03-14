/**
 * WhatsApp Notification Service for Webstack Academy
 * This utility handles sending real-time alerts to admins via WhatsApp.
 * 
 * To enable real-time messaging, configure the WHATSAPP_API_URL and AUTH_TOKEN
 * in your .env file.
 */

export async function sendWhatsAppAdminAlert(message) {
    const adminPhone = process.env.WHATSAPP_ADMIN_PHONE;
    const apiUrl = process.env.WHATSAPP_API_URL;
    const authToken = process.env.WHATSAPP_AUTH_TOKEN;

    console.log("--- WhatsApp Admin Alert ---");
    console.log(`To: ${adminPhone || "Unconfigured"}`);
    console.log(`Message: ${message}`);
    console.log("----------------------------");

    if (!adminPhone || !apiUrl || !authToken) {
        console.warn("WhatsApp notification skipped: Missing configuration (PHONE, URL, or TOKEN).");
        return { success: false, error: "Missing config" };
    }

    try {
        // Example implementation for a generic WhatsApp API Gateway (e.g. Twilio, UltraMsg, etc.)
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({
                to: adminPhone,
                message: message
            })
        });

        if (!response.ok) {
            throw new Error(`WhatsApp API error: ${response.statusText}`);
        }

        return { success: true };
    } catch (error) {
        console.error("WhatsApp Notification failed:", error.message);
        return { success: false, error: error.message };
    }
}

/**
 * Formats an enrollment alert for WhatsApp
 */
export function formatEnrollmentAlert(enrollment) {
    const { full_name, email, phone, program, cohort, payment_method } = enrollment;

    return `🚀 *New Enrollment alert!*
    
*Student:* ${full_name}
*Program:* ${program.name}
*Cohort:* ${cohort.name}
*Payment:* ${payment_method === 'bank' ? '🏦 Bank Transfer (Verification Needed)' : '💳 Card'}
*Contact:* ${phone} (${email})

Check the dashboard for details: https://webstackictglobal.com/admin/admissions`;
}
