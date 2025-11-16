import React, { Suspense } from "react";
import CTASection from "@/components/cta/call-to-action-section";
import VideosSectionGrid from "@/components/gallery/video-section-grid";
import PageBanner from "@/components/hero/page-banner";
import Section from "@/components/section";
import FeaturedEventWrapper from "@/components/serverWrappers/featured-event-wrapper";
import GalleryWrapper from "@/components/serverWrappers/gallery-wrapper";
import UpcomingEventsWrapper from "@/components/serverWrappers/upcoming-events-wrapper";
import SeeMoreButton from "@/components/ui/see-more-button";
import Tagline from "@/components/ui/tagline";
import { ctaHomeHighlights } from "@/lib/contents/call-to-actionData";
import EventCategoriesWrapper from "@/components/serverWrappers/event-categories-wrapper";

export default function Gallery() {
  return (
    <>
      <PageBanner
        label="gallery"
        title={
          <>
            Webstack{" "}
            <span>
              Moments <br />
            </span>
          </>
        }
        subtitle="Explore the highlights from our transformative bootcamps, inspiring demo days, competitive hackathons,
      and vibrant community events that shape Africa's tech future."
        tagline={
          <>
            <Tagline text="Relieve Our Moments" icon="event" />
          </>
        }
        primaryBtnText="View Gallery"
        secondaryBtnText="See Video Higlights"
        primaryBtnRoute="event-gallery"
        secondaryBtnRoute="video-gallery"
      />

      <Section
        label="featured-event"
        title={
          <>
            Featured <span className="gradientText">Event</span>
          </>
        }
        subtitle="Relive the moments in our top featured event."
      >
        <Suspense fallback={<p>Loading Featured Event</p>}>
          <FeaturedEventWrapper />
        </Suspense>
      </Section>

      <Section
        label="event-gallery"
        title={
          <>
            Event <span className="gradientText">Gallery</span>
          </>
        }
        subtitle="Immerse yourself in the energy and innovation of WEBSTACK events through our comprehensive photo gallery."
        // sectionBgColor="sectionLightBlue"
      >
        <Suspense fallback={<p>Loading Featured Event</p>}>
          <GalleryWrapper />
        </Suspense>
      </Section>
      <Section
        label="video-gallery"
        title={
          <>
            Video <span className="gradientText">Highlights</span>
          </>
        }
        subtitle="Experience the energy and excitement of WEBSTACK events through our curated video highlights"
      >
        <VideosSectionGrid />
        <SeeMoreButton>View All Videos on Youtube</SeeMoreButton>
      </Section>

      <Section
        label="event-categories"
        title={
          <>
            Event <span className="gradientText">Categories</span>
          </>
        }
        subtitle="Explore our diverse range of tech events designed to empower Africa's next generation of innovators"
        sectionBgColor="sectionLightBlue"
      >
        <Suspense fallback={<p>Loading Event Categories</p>}>
          <EventCategoriesWrapper />
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

        <SeeMoreButton>View All Upcoming events</SeeMoreButton>
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
        subtitle="Don't miss out on our latest events, training programs, and community highlights. 
        Follow us on social media for real-time updates, behind-the-scenes content, and exclusive opportunities."
        ctaHighlights={ctaHomeHighlights}
        primaryBtnText="Join Our Next Cohort"
        primaryBtnRoute="/programs/academy"
      />
    </>
  );
}
