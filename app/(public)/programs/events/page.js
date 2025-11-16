import { successStories } from "@/lib/contents/testimonialData";
import { ctaHomeHighlights } from "@/lib/contents/call-to-actionData";
import HeroSection from "@/components/hero/hero-section";
import Section from "@/components/section";
import TestimonialGrid from "@/components/cards/testimonial-grid";
import CTASection from "@/components/cta/call-to-action-section";
import { Suspense } from "react";
import ActiveCohortsWrapper from "@/components/serverWrappers/active-cohorts-wrapper";
import UpcomingEventsWrapper from "@/components/serverWrappers/upcoming-events-wrapper";
import PastEventsWrapper from "@/components/serverWrappers/past-events-wrapper";

export const metadata = {
  title: "Explore Webstack Events",
  description:
    "Join Africa's most innovative tech community. Discover immersive training programs, exclusive events, and collaborative learning experiences designed to accelerate your tech career.",
};

export default function Events() {
  return (
    <>
      <HeroSection
        taglineText="Live Events and Community"
        taglineIcon="event"
        heroImage="https://storage.googleapis.com/uxpilot-auth.appspot.com/3b1c1ed2e9-f662851790e2ee3ea178.png"
        title={
          <>
            Explore Our <span className="heroGradientText">Tech Events</span>{" "}
            and Vibrant Community
          </>
        }
        description="Join Africa's most innovative tech community. Discover immersive training programs, 
      exclusive events, and collaborative learning experiences designed to accelerate your tech career."
        primaryBtnText="Browse Active Cohorts"
        secondaryBtnText="View Upcoming Events"
        primaryBtnRoute="active-cohorts"
        secondaryBtnRoute="upcoming-events"
        image="https://storage.googleapis.com/uxpilot-auth.appspot.com/dcd76d399c-46cc394601647344f22a.png"
      />

      <Section
        label="active-cohorts"
        title={
          <>
            Active <span className="gradientText">Cohorts</span>
          </>
        }
        subtitle="Currently running programs and their progress"
      >
        <Suspense fallback={<p>Loading Cohorts</p>}>
          <ActiveCohortsWrapper />
        </Suspense>
      </Section>

      <Section
        label="upcoming-events"
        title={
          <>
            Upcoming <span className="gradientText">Events</span>
          </>
        }
        subtitle="Don't miss these exclusive tech events, workshops, and networking opportunities"
        sectionBgColor="sectionLightBlue"
      >
        <Suspense fallback={<p>Loading Upcoming Events</p>}>
          <UpcomingEventsWrapper />
        </Suspense>
      </Section>
      <Section
        label="events-gallery"
        title={
          <>
            Past <span className="gradientText">Events Gallery</span>
          </>
        }
        subtitle="Relive the moments from our successful events and celebrations"
      >
        <Suspense fallback={<p>Loading Upcoming Events</p>}>
          <PastEventsWrapper />
        </Suspense>
      </Section>

      <Section
        label="testimonials"
        title={
          <>
            Successs <span className="gradientText">Stories</span>
          </>
        }
        subtitle="Real transformations from our alumni who are now leading tech innovation across Africa and beyond."
        sectionBgColor="sectionLightBlue"
      >
        <TestimonialGrid testimonials={successStories} />
      </Section>

      <CTASection
        title={
          <>
            Ready{" "}
            <span className="gradientText">
              to Transform Your <br /> Future?
            </span>
          </>
        }
        subtitle="   Join thousands of successful graduates who've launched their tech
                careers with WEBSTACK. Your journey to becoming a world-class
                developer starts here."
        ctaHighlights={ctaHomeHighlights}
        primaryBtnText="Join Our Next Cohort"
        primaryBtnRoute="/programs/academy"
      />
    </>
  );
}
