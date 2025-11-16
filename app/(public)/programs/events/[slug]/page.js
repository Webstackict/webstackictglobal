import BenefitsGrid from "@/components/cards/benefits-grid";
import EventExperience from "@/components/events/event-experience";
import HeroSection from "@/components/hero/hero-section";
import Section from "@/components/section";
import { faqData } from "@/lib/contents/faqData";

import classes from "./page.module.css";
import EventPricingGrid from "@/components/events/event-pricing-grid";
import FaqSection from "@/components/FAQ/faq";
import { getEventDetails } from "@/lib/db/get-event-deatils";
import { formatDate, separateDepartmentName } from "@/util/util";
import { Suspense } from "react";
import EventPersonnelWrapper from "@/components/serverWrappers/event-personnel-wrapper";
import EventTimelineWrapper from "@/components/serverWrappers/event-timeline-wrapper";
import EventHighlightsWrapper from "@/components/serverWrappers/event-highlights-wrapper";
import UpcomingEventsWrapper from "@/components/serverWrappers/upcoming-events-wrapper";
import { createSupabaseServerClient } from "@/lib/db/supabaseServer";

export async function generateMetadata({ params }) {
  const supabase = await createSupabaseServerClient();

  const eventId = (await params).slug;

  try {
    const { data: event, error } = await supabase
      .from("events")
      .select(
        `
        name, 
        description,
        event_thumbnails (
        image_url
        )
        `
      )
      .eq("id", eventId)
      .single();

    if (error) throw error;

    return {
      title: `Study ${event.name} at WEBSTACK-ICT-GLOBAL`,
      description: event.description,
      openGraph: {
        title: `${event.name} | WEBSTACK-ICT-GLOBAL`,
        description: event.description,
        url: `https://webstack-ict-global.vercel.app/programs/events/${eventId}`,
        siteName: "WEBSTACK-ICT-GLOBAL",
        images: [
          {
            url: event.event_thumbnails.image_url,
            width: 160,
            height: 50,
            alt: "Webstack Banner",
          },
        ],
        locale: "en_US",
        type: "article",
      },
      twitter: {
        card: "summary",
        title: event.name,
        description: event.description,
      },
    };
  } catch (err) {
    console.error("Supabase error:", err);
    return { data: null, error: err };
  }
}

export default async function EventDetail({ params }) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const eventId = (await params).slug;
  const { data: event, error } = await getEventDetails(eventId);
  // console.log(event);

  if (error) return <p className="data-fetching-error">Something went wrong</p>;

  const { firstDeptName, secondDeptName } = separateDepartmentName(
    event.name,
    2
  );

  const todaysDate = new Date();
  const eventDate = new Date(event.event_date);

  const isPassed = eventDate <= todaysDate;

  let isRegistered = false;

  if (user) {
    const { data: IsUserRegistered, error: IsUserRegisteredError } =
      await supabase
        .from("event_registered_attendees")
        .select("*")
        .eq("user_id", user.id)
        .eq("event_id", event.id);

    if (IsUserRegisteredError) throw IsUserRegisteredError;

    isRegistered = IsUserRegistered.length > 0;
  }

  return (
    <>
      <HeroSection
        label="event-detail"
        taglineText="Live Events and Community"
        taglineIcon="event"
        heroImage="https://storage.googleapis.com/uxpilot-auth.appspot.com/3b1c1ed2e9-f662851790e2ee3ea178.png"
        title={
          <>
            <span className="heroGradientText">{firstDeptName} </span>{" "}
            {secondDeptName}
          </>
        }
        description={event.description}
        date={formatDate(event.event_date)}
        startTime={event.start_time}
        dismisalTime={event.dismisal_time}
        venue={event.venue}
        primaryBtnText="Browse Active Cohorts"
        secondaryBtnText="View Upcoming Events"
        primaryBtnRoute="ongoing-cohorts-registration"
        secondaryBtnRoute="contact-options"
      />

      <Section
        label="event-overview"
        title={
          <>
            Event <span className="gradientText">Overview</span>
          </>
        }
        subtitle="Dive deep into the future of technology with hands-on workshops, expert panels, 
        and networking opportunities that will accelerate your career in tech."
      >
        <EventExperience
          experiences={event.experiences}
          quickInfo={[
            {
              icon: "calendar",
              label: "Date",
              value: formatDate(event.event_date),
            },
            {
              icon: "clock",
              label: "Duration",
              value: `${event.total_hours} Hours`,
            },
            {
              icon: "location",
              label: "Venue",
              value: event.venue !== "Online" ? "Physical" : event.venue,
            },
            {
              icon: "tag",
              label: "Category",
              value: event.category_name,
            },
          ]}
        />
        <BenefitsGrid
          className={classes.benefitsGrid}
          items={[
            {
              icon: "group",
              theme: { background: "bluePurple-bg" },
              title: !isPassed
                ? `${event.attendees_capacity}+`
                : `${event.number_of_attendants}+`,
              text: !isPassed ? "Expected Attendees" : "Total Attendants",
            },
            {
              icon: "mic",
              theme: { background: "bluePurple-bg" },
              title: event.number_of_speakers,
              text: "Expert Speakers",
            },
            {
              icon: "handShake",
              theme: { background: "bluePurple-bg" },
              title: "Various",
              text: "Networking Sessions",
            },
          ]}
        />
      </Section>
      <Section
        label="event-hosts"
        title={
          <>
            Event <span className="gradientText">Hosts</span>
          </>
        }
        subtitle="Meet the visionary leaders who will guide you through this transformative experience."
        sectionBgColor="sectionLightBlue"
      >
        <Suspense fallback={<p>loading Hosts</p>}>
          <EventPersonnelWrapper eventId={event.id} />
        </Suspense>
      </Section>
      <Section
        label="featured-speakers"
        title={
          <>
            Featured <span className="gradientText">Speakers</span>
          </>
        }
        subtitle="Learn from industry pioneers, startup founders, and tech visionaries who are shaping the future of technology."
      >
        <Suspense fallback={<p>loading speakers</p>}>
          <EventPersonnelWrapper eventId={event.id} label="event-speakers" />
        </Suspense>
      </Section>
      <Section
        label="timeline"
        title={
          <>
            Event <span className="gradientText">Schedule</span>
          </>
        }
        subtitle="A carefully curated agenda packed with insights, hands-on learning, and networking opportunities."
      >
        <Suspense fallback={<p>loading schedule</p>}>
          <EventTimelineWrapper eventId={event.id} />
        </Suspense>
      </Section>

      <Section
        label="community"
        title={
          <>
            Event <span className="gradientText">Highlights</span>
          </>
        }
        subtitle="Get a glimpse of our previous events and see what makes WEBSTACK gatherings truly special."
        sectionBgColor="sectionLightBlue"
      >
        <Suspense fallback={<p>loading highlights</p>}>
          <EventHighlightsWrapper eventId={event.id} />
        </Suspense>
      </Section>

      <Section
        label="secure-spot"
        title={
          <>
            Secure <span className="gradientText">Your Spot</span>
          </>
        }
        subtitle="Don't miss this opportunity to be part of Africa's premier tech gathering. Limited seats available!"
      >
        <EventPricingGrid
          event={event}
          isPassed={isPassed}
          isRegistered={isRegistered}
        />
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
        label="FAQ "
        title={
          <>
            Frequently <span className="gradientText">Asked Questions</span>
          </>
        }
        subtitle="Everything you need to know about our services."
      >
        <FaqSection faqData={faqData} />
      </Section>
    </>
  );
}
