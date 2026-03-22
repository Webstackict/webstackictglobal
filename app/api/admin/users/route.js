import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/admin-auth";

export async function GET() {
    if (!await isAdmin()) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const users = await prisma.users.findMany({
            where: {
                OR: [
                    { is_super_admin: true },
                    // In the future, we could add checks for specific roles in raw_app_meta_data
                ]
            },
            include: {
                user_profile: {
                    select: {
                        full_name: true,
                        display_name: true,
                        photo_url: true
                    }
                }
            },
            orderBy: {
                created_at: 'desc'
            }
        });

        // Map to a cleaner format for the frontend
        const staff = users.map(user => ({
            id: user.id,
            email: user.email,
            name: user.user_profile?.full_name || user.user_profile?.display_name || "Unknown Staff",
            role: user.is_super_admin ? "Super Admin" : "Staff Member",
            status: "Active", // We could check for banned_until etc.
            lastLogin: user.last_sign_in_at,
            avatar: user.user_profile?.photo_url || null,
            initials: (user.user_profile?.full_name || "US").split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        }));

        return NextResponse.json({ success: true, staff });
    } catch (error) {
        console.error("Fetch admin users error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function POST(req) {
    if (!await isAdmin()) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { email, role, name } = body;

        if (!email || !role) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Just mocked for the MVP / mockup. Real Supabase auth invite requires admin-auth setup.
        // We will create a dummy record to simulate the invite being sent and user created.
        const dummyId = crypto.randomUUID();

        // Simulating the user being added
        const user = await prisma.users.create({
            data: {
                id: dummyId,
                email: email,
                role: role,
                is_super_admin: role === 'Super Admin',
                raw_user_meta_data: { full_name: name || email.split('@')[0] },
                created_at: new Date(),
                updated_at: new Date()
            }
        });

        return NextResponse.json({ success: true, message: "Invitation sent", user });
    } catch (error) {
        console.error("Invite admin error:", error);
        return NextResponse.json({ error: "Failed to invite admin" }, { status: 500 });
    }
}
