import ImmersiveCardGrid from "@/components/cards/immersive-card-grid";
import PartnershipsGrid from "@/components/cards/partnerships-grid";
import ServicesCardGrid from "@/components/cards/services-card-grid";
import TestimonialGrid from "@/components/cards/testimonial-grid";
import TestimonialsWrapper from "@/components/serverWrappers/testimonials-wrapper";
import CTASection from "@/components/cta/call-to-action-section";

import classes from "./page.module.css";

import HeroSection from "@/components/hero/hero-section";
import Section from "@/components/section";

import { benefits } from "@/lib/contents/partnershipsData";
import { ctaHomeHighlights } from "@/lib/contents/call-to-actionData";
import { partnerLogos } from "@/lib/contents/partnershipsData";
import LinkWithProgress from "@/components/ui/Link-with-progress";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import BenefitsGrid from "@/components/cards/benefits-grid";
import AuthorityGrid from "@/components/cards/authority-grid";
import ProgramsGrid from "@/components/cards/programs-grid";
import OngoingCohortsEnrollmentsWrapper from "@/components/serverWrappers/ongoing-cohorts-enrollments-wrapper";
import { Suspense } from "react";
import CohortSkeleton from "@/components/ui/cohort-skeleton";

export default async function Home() {
  return (
    <>
      <HeroSection
        taglineText="Africa's Premier Tech Training Hub"
        taglineIcon="rocket"
        heroImage="https://storage.googleapis.com/uxpilot-auth.appspot.com/098a301275-17fc37a3ca371ad63e71.png"
        title={
          <>
            Become a <span className="heroGradientText">Job-Ready</span> Tech Professional in 12 Weeks
          </>
        }
        description="Hands-on training in Web Development, Data Analytics, Cybersecurity, Forex trading, Mobile app development and AI Automation with real-world projects and mentorship."
        primaryBtnText="Enroll in Next Cohort"
        secondaryBtnText="Explore Programs"
        primaryBtnRoute="ongoing-cohorts-registration"
        secondaryBtnRoute="contact-options"
      />

      <Section
        label="premium-programs"
        title={
          <>
            Our <span className="gradientText">Premium Programs</span>
          </>
        }
        subtitle="Master in-demand tech skills with our industry-led training programs designed for global opportunities."
      >
        <ProgramsGrid featuredTitles={["Web Development", "Cybersecurity", "Data Analytics", "Forex Trading"]} />
        <div className={classes.viewAllContainer}>
          <LinkWithProgress href="/programs/academy" className={classes.viewAllBtn}>
            View All Programs <ArrowForwardIcon />
          </LinkWithProgress>
        </div>
      </Section>

      <Section
        label="ongoing-cohorts-registration"
        title={
          <>
            Ongoing Cohorts <span className="gradientText">Enrollments</span>
          </>
        }
        subtitle="Join our ongoing programs and start your journey to becoming a tech professional. Limited seats available."
      >
        <Suspense fallback={<CohortSkeleton />}>
          <OngoingCohortsEnrollmentsWrapper />
        </Suspense>
      </Section>
      <Section
        label="why-choose-us-authority"
        title={
          <>
            Why Students Choose <span className="gradientText">Webstack ICT Global</span>
          </>
        }
        subtitle="We provide a comprehensive ecosystem designed to transform beginners into world-class tech professionals."
      >
        <AuthorityGrid />
      </Section>

      <Section
        label="services"
        title={
          <>
            Our <span className="gradientText">Premium Services</span>
          </>
        }
        subtitle="Comprehensive tech solutions designed to accelerate your growth and success in the digital economy."
        sectionBgColor="sectionLightBlue"
      >
        <ServicesCardGrid limit={3} />
        <div className={classes.viewAllContainer}>
          <LinkWithProgress href="/services" className={classes.viewAllBtn}>
            View All Services <ArrowForwardIcon />
          </LinkWithProgress>
        </div>
      </Section>
      <Section
        label="why choose us"
        title={
          <>
            Immersive <span className="gradientText">Learning Experience</span>
          </>
        }
        subtitle="Our methodology combines theoretical knowledge with practical application, ensuring you're ready for real-world challenges."
      >
        <ImmersiveCardGrid />
      </Section>
      <Section
        label="testimonials"
        title={
          <>
            Success <span className="gradientText">Stories</span>
          </>
        }
        subtitle="Real transformations from our alumni who are now leading tech innovation across Africa and beyond."
        sectionBgColor="sectionLightBlue"
      >
        <Suspense fallback={<CohortSkeleton />}>
          <TestimonialsWrapper />
        </Suspense>
      </Section>

      <Section
        label="partnerships"
        title={
          <>
            Trusted by <span className="gradientText">Industry Leaders</span>
          </>
        }
        subtitle="Our partnerships with leading companies ensure our curriculum stays cutting-edge and our graduates get the best opportunities."
      >
        <PartnershipsGrid items={partnerLogos} />
        <div className={classes.benefitsSection}>
          <h3>Partnership Benefits</h3>
          <BenefitsGrid className={classes.benefitsGrid} items={benefits} />
        </div>
      </Section>

      <CTASection
        label="home"
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
