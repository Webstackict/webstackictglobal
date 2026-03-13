import { getApprovedTestimonials } from "@/lib/db/get-approved-testimonials";
import TestimonialCarousel from "../cards/TestimonialCarousel";
import { successStories } from "@/lib/contents/testimonialData";

export default async function TestimonialsWrapper() {
    const { data: testimonials, error } = await getApprovedTestimonials();

    let listToFormat = testimonials;

    if (error || !testimonials || testimonials.length === 0) {
        // Fallback to static data if DB fetch fails or is empty
        // Map static data to the same structure as DB testimonials
        listToFormat = successStories.map(s => ({
            id: s.name, // dummy id
            name: s.name,
            program: s.cohort || s.role,
            rating: 5,
            review_message: s.text,
            avatar_url: s.image,
            status: 'approved'
        }));
    }

    return <TestimonialCarousel testimonials={listToFormat} />;
}
