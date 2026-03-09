import { supabaseAdmin } from "../db/supabaseAdmin.js";
import { prisma } from "../prisma.js";
import { transporter } from "../nodemailer.js";

/**
 * Processes the scholarship approval automation:
 * 1. Create a user account if it does not exist.
 * 2. Assign the applicant to the selected department.
 * 3. Enroll them into the next available cohort.
 * 4. Create a record in the enrollments table.
 * 5. Send a confirmation email.
 * 
 * @param {string} applicationId - The ID of the scholarship application.
 */
export async function processScholarshipApproval(applicationId) {
    console.log(`Starting scholarship approval process for application: ${applicationId}`);

    try {
        // 1. Fetch application details
        const application = await prisma.scholarship_applications.findUnique({
            where: { id: applicationId }
        });

        if (!application) {
            throw new Error(`Application not found: ${applicationId}`);
        }

        const { email, full_name, department_id, phone } = application;

        // 2. Fetch department details
        const department = await prisma.departments.findUnique({
            where: { id: department_id }
        });

        if (!department) {
            throw new Error(`Could not find department with ID: ${department_id}`);
        }

        console.log(`Processing application for department: ${department.name}`);

        // 3. Find next available "enrolling" cohort for the department
        const nextCohort = await prisma.cohorts.findFirst({
            where: {
                department_id: department.id,
                status: 'enrolling',
                start_date: { gte: new Date() }
            },
            orderBy: {
                start_date: 'asc'
            }
        });

        if (!nextCohort) {
            throw new Error(`No available enrolling cohorts found for department: ${department.name}`);
        }

        console.log(`Found next available cohort: ${nextCohort.label || nextCohort.cohort_number} starting ${nextCohort.start_date}`);

        // 4. Create user account if it doesn't exist
        let userId;
        const { data: userResponse, error: getUserError } = await supabaseAdmin.auth.admin.listUsers();
        // search for user by email in the list (Supabase admin doesn't have a direct "get by email" that is easy without filtering sometimes, though getUserByEmail exists in some versions)

        // Let's try to get user by email directly
        const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers();
        let existingUser = users.find(u => u.email === email);

        if (existingUser) {
            userId = existingUser.id;
            console.log(`User already exists with ID: ${userId}`);
        } else {
            console.log(`Creating new user account for: ${email}`);
            const tempPassword = Math.random().toString(36).slice(-12) + "!";
            const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
                email,
                password: tempPassword,
                email_confirm: true,
                user_metadata: { full_name }
            });

            if (createError) throw createError;
            userId = newUser.user.id;
            console.log(`New user created with ID: ${userId}. Temp password: ${tempPassword}`);

            // Note: In a real scenario, we might want to send the temp password or an invite link.
            // For now, we'll just proceed with enrollment.
        }

        // 5. Ensure user profile exists
        await prisma.user_profile.upsert({
            where: { user_id: userId },
            update: {
                full_name,
                phone
            },
            create: {
                user_id: userId,
                full_name,
                phone
            }
        });

        // 6. Create enrollment record
        const enrollment = await prisma.enrollments.create({
            data: {
                user_id: userId,
                department_id: department.id,
                cohort_id: nextCohort.id,
                full_name,
                email,
                phone,
                program: department.name,
                payment_status: 'paid', // Scholarship recipients usually have their fee covered
                referral_code: application.referral_code
            }
        });

        // Handle scholarship referral commission
        if (application.referral_code) {
            try {
                const referrer = await prisma.referrals.findUnique({
                    where: { referral_code: application.referral_code }
                });

                if (referrer) {
                    // Assuming a fixed fee for scholarship processing or just tracking it
                    // For now, we'll create the activity. Commission amount might be 0 if fully free, 
                    // but we'll use 10% of a default if applicable or just 0. 
                    // Given "10% of payment", if payment is 0, it's 0. 
                    // But usually there is a value assigned to it.
                    await prisma.referral_activities.create({
                        data: {
                            referrer_id: referrer.user_id,
                            referred_user_id: userId,
                            cohort_id: nextCohort.id,
                            enrollment_id: enrollment.id,
                            commission_amount: 0, // Placeholder
                            payment_amount: 0,
                            referral_type: 'scholarship',
                            status: 'approved'
                        }
                    });
                }
            } catch (err) {
                console.error("Failed to create scholarship referral activity:", err);
            }
        }

        console.log(`Created enrollment record: ${enrollment.id}`);

        // 7. Send confirmation email
        const mailOptions = {
            from: process.env.GMAIL_USER,
            to: email,
            subject: 'Congratulations! Your Scholarship Application has been Approved',
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee;">
                    <h2 style="color: #2563eb;">Scholarship Approved!</h2>
                    <p>Dear ${full_name},</p>
                    <p>We are thrilled to inform you that your application for the <strong>Webstack Academy Scholarship Program</strong> has been approved!</p>
                    <p>You have been enrolled in the following program:</p>
                    <ul>
                        <li><strong>Department:</strong> ${department.name}</li>
                        <li><strong>Cohort:</strong> ${nextCohort.label || `Cohort ${nextCohort.cohort_number}`}</li>
                        <li><strong>Start Date:</strong> ${new Date(nextCohort.start_date).toLocaleDateString()}</li>
                    </ul>
                    <p>An account has been created for you on our platform. You can now log in to the student dashboard to access your learning materials and meet your cohort mates.</p>
                    <p>If you have any questions, please feel free to reply to this email.</p>
                    <p>Best regards,<br>The Webstack Team</p>
                </div>
            `
        };

        try {
            await transporter.sendMail(mailOptions);
            console.log(`Confirmation email sent to: ${email}`);
        } catch (emailError) {
            console.error('Failed to send confirmation email:', emailError);
            // We don't throw here to avoid failing the whole process if only email fails
        }

        return { success: true, userId, enrollmentId: enrollment.id };

    } catch (error) {
        console.error('Error in processScholarshipApproval:', error);
        throw error;
    }
}
