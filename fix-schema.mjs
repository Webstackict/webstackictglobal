import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

// Load env vars manually if needed, or rely on .env
const envPath = path.resolve('.env.local');
if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').filter(line => line.trim() && !line.startsWith('#')).forEach(line => {
        const parts = line.split('=');
        if (parts.length >= 2) {
            process.env[parts[0].trim()] = parts.slice(1).join('=').trim().replace(/^"(.*)"$/, '').replace(/^'(.*)'$/, '');
        }
    });
}

const prisma = new PrismaClient();

async function fix() {
    console.log("Refining Supabase schema (individual commands)...");

    try {
        // 1. Create user_enrolled_cohorts view
        console.log("Creating user_enrolled_cohorts view...");
        await prisma.$executeRawUnsafe(`
            CREATE OR REPLACE VIEW user_enrolled_cohorts AS
            SELECT 
                e.id as enrollment_id,
                e.user_id,
                e.payment_status,
                e.created_at as enrollment_date,
                c.id as cohort_id,
                c.cohort_number as cohort_number,
                c.start_date as start_date,
                c.graduation_date as graduation_date,
                c.status as status,
                d.id as department_id,
                d.name as department_name,
                d.slug as department_slug,
                d.theme as department_theme,
                d.icon as department_icon
            FROM enrollments e
            JOIN cohorts c ON e.cohort_id = c.id
            JOIN departments d ON e.department_id = d.id;
        `);

        console.log("Granting SELECT on user_enrolled_cohorts...");
        await prisma.$executeRawUnsafe(`GRANT SELECT ON public.user_enrolled_cohorts TO anon, authenticated, service_role;`);

        // 2. Create get_user_attended_events view
        console.log("Creating get_user_attended_events view...");
        await prisma.$executeRawUnsafe(`
            CREATE OR REPLACE VIEW get_user_attended_events AS
            SELECT 
                era.user_id,
                e.*
            FROM event_attendees ea
            JOIN events e ON ea.event_id = e.id
            JOIN event_registered_attendees era ON ea.registered_attendee_id = era.id;
        `);

        console.log("Granting SELECT on get_user_attended_events...");
        await prisma.$executeRawUnsafe(`GRANT SELECT ON public.get_user_attended_events TO anon, authenticated, service_role;`);

        // 3. Create get_user_academy_journey RPC function with explicit casting
        console.log("Creating get_user_academy_journey RPC function...");
        await prisma.$executeRawUnsafe(`
            CREATE OR REPLACE FUNCTION get_user_academy_journey(
                user_id_input UUID,
                cohort_status_input TEXT DEFAULT NULL,
                cohort_statuses_csv TEXT DEFAULT NULL
            )
            RETURNS TABLE (total BIGINT) AS $$
            BEGIN
                IF cohort_statuses_csv IS NOT NULL THEN
                    RETURN QUERY
                    SELECT COUNT(*)::BIGINT
                    FROM enrollments e
                    JOIN cohorts c ON e.cohort_id = c.id
                    WHERE e.user_id = user_id_input
                    AND c.status::text = ANY(string_to_array(cohort_statuses_csv, ','));
                ELSE
                    RETURN QUERY
                    SELECT COUNT(*)::BIGINT
                    FROM enrollments e
                    JOIN cohorts c ON e.cohort_id = c.id
                    WHERE e.user_id = user_id_input
                    AND c.status::text = cohort_status_input;
                END IF;
            END;
            $$ LANGUAGE plpgsql SECURITY DEFINER;
        `);

        console.log("Granting EXECUTE on get_user_academy_journey...");
        await prisma.$executeRawUnsafe(`GRANT EXECUTE ON FUNCTION public.get_user_academy_journey TO anon, authenticated, service_role;`);

        console.log("✅ Schema refinement completed successfully!");
    } catch (error) {
        console.error("❌ Schema refinement failed:", error);
    } finally {
        await prisma.$disconnect();
    }
}

fix();
