import { cookies } from "next/headers";
import { createClient } from "./supabase/server";
import { prisma } from "./prisma";

/**
 * Checks if the current session belongs to a valid admin.
 * @returns {Promise<boolean>}
 */
export async function isAdmin() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return false;

    try {
        // We check the 'is_super_admin' flag in auth.users via Prisma
        const adminUser = await prisma.users.findUnique({
            where: { id: user.id },
            select: { is_super_admin: true }
        });

        return !!adminUser?.is_super_admin;
    } catch (error) {
        console.error("Admin verification error:", error);
        return false;
    }
}

/**
 * Helper to get current admin details
 */
export async function getAdminUser() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    const adminUser = await prisma.users.findUnique({
        where: { id: user.id },
        select: {
            id: true,
            email: true,
            is_super_admin: true
        }
    });

    if (!adminUser?.is_super_admin) return null;

    return adminUser;
}
