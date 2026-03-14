import { transporter } from "./nodemailer";

const COMPANY_NAME = "Webstack Academy";
const DASHBOARD_URL = "https://webstackictglobal.com/dashboard";

/**
 * Sends an initial enrollment confirmation email.
 */
export async function sendEnrollmentConfirmation(enrollment) {
    const { full_name, email, program, cohort, payment_status, approval_status } = enrollment;

    let messageHtml = `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 12px;">
            <h2 style="color: #2563eb;">Enrollment Received!</h2>
            <p>Dear ${full_name},</p>
            <p>Thank you for enrolling in <strong>${program.name}</strong> at ${COMPANY_NAME}. We have successfully received your application.</p>
    `;

    if (approval_status === 'AWAITING_VERIFICATION') {
        messageHtml += `
            <div style="background: #fdf2f8; border-left: 4px solid #db2777; padding: 15px; margin: 20px 0;">
                <p style="margin: 0; font-weight: bold; color: #9d174d;">Action Required: Bank Transfer Verification</p>
                <p style="margin: 5px 0 0; color: #be185d;">Since you selected Bank Transfer, our team is currently verifying your payment. Once confirmed, your seat will be secured.</p>
            </div>
        `;
    } else if (payment_status === 'PENDING') {
        messageHtml += `
            <p>Your enrollment is currently <strong>pending payment</strong>. Please complete your transaction to secure your spot.</p>
        `;
    }

    messageHtml += `
            <p><strong>Cohort Details:</strong></p>
            <ul>
                <li><strong>Cohort:</strong> ${cohort.name}</li>
                <li><strong>Start Date:</strong> ${new Date(cohort.start_date).toLocaleDateString()}</li>
            </ul>
            <p>You can track your status anytime on your dashboard:</p>
            <a href="${DASHBOARD_URL}" style="display: inline-block; background: #2563eb; color: white; padding: 12px 25px; border-radius: 8px; text-decoration: none; font-weight: bold;">Go to Dashboard</a>
            <p>Best regards,<br>The ${COMPANY_NAME} Team</p>
        </div>
    `;

    try {
        await transporter.sendMail({
            from: process.env.GMAIL_USER,
            to: email,
            subject: `Enrollment Received: ${program.name}`,
            html: messageHtml
        });
    } catch (error) {
        console.error("Email Error (Enrollment Confirmation):", error);
    }

    // Trigger WhatsApp Admin Alert
    try {
        const { sendWhatsAppAdminAlert, formatEnrollmentAlert } = await import('./whatsapp-notifier');
        const waMessage = formatEnrollmentAlert(enrollment);
        await sendWhatsAppAdminAlert(waMessage);
    } catch (waErr) {
        console.error("WhatsApp Alert Error:", waErr);
    }
}

/**
 * Sends a notification when payment is verified/successful.
 */
export async function sendPaymentVerified(enrollment) {
    const { full_name, email, program, cohort } = enrollment;

    const messageHtml = `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 12px;">
            <h2 style="color: #10b981;">Payment Verified!</h2>
            <p>Dear ${full_name},</p>
            <p>Great news! Your payment for <strong>${program.name}</strong> has been verified. Your seat in the <strong>${cohort.name}</strong> is now officially secured.</p>
            <p>We are excited to have you join us! Look out for further instructions as we get closer to the start date (${new Date(cohort.start_date).toLocaleDateString()}).</p>
            <a href="${DASHBOARD_URL}" style="display: inline-block; background: #10b981; color: white; padding: 12px 25px; border-radius: 8px; text-decoration: none; font-weight: bold;">Access Student Portal</a>
            <p>Welcome aboard!<br>The ${COMPANY_NAME} Team</p>
        </div>
    `;

    try {
        await transporter.sendMail({
            from: process.env.GMAIL_USER,
            to: email,
            subject: `Seat Secured: ${program.name}`,
            html: messageHtml
        });
    } catch (error) {
        console.error("Email Error (Payment Verified):", error);
    }
}

/**
 * Sends a notification if enrollment is rejected.
 */
export async function sendAdmissionRejected(enrollment) {
    const { full_name, email, program } = enrollment;

    const messageHtml = `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 12px;">
            <h2 style="color: #ef4444;">Admission Status Update</h2>
            <p>Dear ${full_name},</p>
            <p>Thank you for your interest in <strong>${program.name}</strong> at ${COMPANY_NAME}.</p>
            <p>Unfortunately, we are unable to approve your recent enrollment at this time. This may be due to incomplete payment verification or other administrative reasons.</p>
            <p>If you believe this is an error or would like to appeal, please contact our support team.</p>
            <p>Best regards,<br>The ${COMPANY_NAME} Team</p>
        </div>
    `;

    try {
        await transporter.sendMail({
            from: process.env.GMAIL_USER,
            to: email,
            subject: `Update on your Enrollment: ${program.name}`,
            html: messageHtml
        });
    } catch (error) {
        console.error("Email Error (Admission Rejected):", error);
    }
}
