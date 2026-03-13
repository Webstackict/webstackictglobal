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
import SmallButton from "@/components/ui/small-button";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import BenefitsGrid from "@/components/cards/benefits-grid";
import AuthorityGrid from "@/components/cards/authority-grid";
import ProgramsGrid from "@/components/cards/programs-grid";
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
        primaryBtnRoute="/enroll"
        secondaryBtnRoute="contact-options"
      />

      <div style={{ background: 'var(--charcoal-blue-500)', padding: '4rem 1.5rem', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'radial-gradient(circle at center, rgba(45, 212, 191, 0.1) 0%, transparent 70%)', pointerEvents: 'none' }}></div>
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1rem', color: 'var(--white)' }}>
            2026 <span className="gradientText">Scholarship Program</span>
          </h2>
          <p style={{ marginBottom: '2rem', color: 'var(--gray-text-400)', fontSize: '1.2rem', lineHeight: '1.6' }}>
            Apply for a life-changing opportunity to start your career in technology with Africa&apos;s leading tech hub. Limited slots available.
          </p>
          <SmallButton href="/scholarships" style={{ background: 'var(--blue-500)', fontSize: '1.1rem', padding: '1rem 2.5rem', borderRadius: '50px', boxShadow: '0 10px 25px -5px rgba(0, 150, 255, 0.3)' }}>
            Apply for Scholarship
          </SmallButton>
        </div>
      </div>

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
        primaryBtnRoute="/enroll"
      />
    </>
  );
}
