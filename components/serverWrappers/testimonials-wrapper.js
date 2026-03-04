import { getTestimonials } from "@/lib/db/get-testimonials";
import TestimonialCarousel from "../cards/testimonial-carousel";
import { successStories } from "@/lib/contents/testimonialData";

export default async function TestimonialsWrapper() {
    const { data: testimonials, error } = await getTestimonials();

    let listToFormat = testimonials;

    if (error || !testimonials || testimonials.length === 0) {
        // Fallback to static data if DB fetch fails or is empty
        listToFormat = successStories;
    }

    // Formatting for the component
    const formattedTestimonials = listToFormat.map(t => ({
        name: t.name,
        role: t.role_at_company || t.role,
        program: t.program_studied || t.cohort,
        text: t.testimonial_text || t.text,
        image: t.student_photo || t.image
    }));

    return <TestimonialCarousel testimonials={formattedTestimonials} />;
}
