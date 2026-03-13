import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSupabaseServerClient } from "@/lib/db/supabaseServer";

export async function POST(req) {
    try {
        const supabase = await createSupabaseServerClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { rating, review_message, program, avatar_url, video_url } = body;

        // Validation
        if (!rating || !review_message) {
            return NextResponse.json({ error: "Rating and review message are required" }, { status: 400 });
        }

        const numericRating = parseInt(rating);
        if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
            return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 });
        }

        // Anti-spam check: prevent multiple submissions within 5 minutes
        const lastReview = await prisma.testimonials.findFirst({
            where: {
                user_id: user.id,
                created_at: {
                    gt: new Date(Date.now() - 5 * 60 * 1000)
                }
            }
        });

        if (lastReview) {
            return NextResponse.json({
                error: "Please wait a few minutes before submitting another review to prevent spam."
            }, { status: 429 });
        }

        // Fetch user profile to get the most accurate name
        const profile = await prisma.user_profile.findUnique({
            where: { user_id: user.id }
        });

        const testimonial = await prisma.testimonials.create({
            data: {
                user_id: user.id,
                name: profile?.full_name || user.user_metadata?.full_name || "Webstack Student",
                email: user.email,
                rating: numericRating,
                review_message,
                program: program || null,
                avatar_url: avatar_url || null,
                video_url: video_url || null,
                status: "pending"
            }
        });

        return NextResponse.json({
            message: "Thank you for sharing your experience. Your review will be published after approval.",
            data: testimonial
        }, { status: 201 });

    } catch (error) {
        console.error("Testimonial submission error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
