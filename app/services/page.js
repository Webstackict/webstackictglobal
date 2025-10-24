import BenefitsGrid from "@/components/cards/benefits-grid";
import ServicesCardGrid from "@/components/cards/services-card-grid";
import TestimonialGrid from "@/components/cards/testimonial-grid";
import Section from "@/components/section";

import classes from "./page.module.css";

import { techStacks } from "@/lib/contents/tech-stacks";
import PageBanner from "@/components/hero/page-banner";
import StatsBig from "@/components/stats-big";
import PricingGrid from "@/components/pricing/pricing-grid";
import PartnershipsGrid from "@/components/cards/partnerships-grid";

import { processSteps } from "@/lib/contents/services";
import { faqDataServices } from "@/lib/contents/faqData";
import FaqSection from "@/components/FAQ/faq";
import CTASection from "@/components/cta/call-to-action-section";
import Tagline from "@/components/ui/tagline";
import { clientTestimonials } from "@/lib/contents/testimonialData";
import { ctaServicesHighlights } from "@/lib/contents/call-to-actionData";

export default function Services() {
  return (
    <>
      <PageBanner
        title={
          <>
            Our <span>Services</span>
          </>
        }
        subtitle="Empowering Africa's Tech Ecosystem through comprehensive training, incubation, and cutting-edge technology solutions"
        tagline={
          <>
            <Tagline text="Premuim Tech Services" icon="services" />
          </>
        }
        primaryBtnText="Explore Our Services"
        secondaryBtnText="Schedule Consultation"
        primaryBtnRoute="services"
        secondaryBtnRoute="pricing"
      />
      <Section
        label="services"
        title={
          <>
            Our <span className="gradientText">Premuim Services</span>
          </>
        }
        subtitle="Comprehensive tech solutions designed to accelerate your growth and success in the digital economy."
        sectionBgColor="sectionLightBlue"
      >
        <ServicesCardGrid />
      </Section>

      <Section
        label="services process"
        title={
          <>
            Our <span className="gradientText">Process</span>
          </>
        }
        subtitle="A proven methodology that ensures success across all our services"
      >
        <BenefitsGrid
          className={classes.serviceProcessGrid}
          items={processSteps}
        />
      </Section>

      <Section
        label="testimonials"
        title={
          <>
            Successs <span className="gradientText">Stories</span>
          </>
        }
        subtitle="Real transformations from our alumni who are now leading tech innovation across Africa and beyond."
      >
        <TestimonialGrid testimonials={clientTestimonials} />
        <StatsBig />
      </Section>

      <Section
        label="pricing"
        title={
          <>
            Our <span className="gradientText">Service Packages</span>
          </>
        }
        subtitle="Real transformations from our alumni who are now leading tech innovation across Africa and beyond."
        sectionBgColor="sectionLightBlue"
      >
        <PricingGrid />
      </Section>

      <Section
        label="Technology Stack"
        title={
          <>
            Industry <span className="gradientText">Technology Stack</span>
          </>
        }
        subtitle="Cutting-edge technologies and frameworks we master across all our services."
      >
        <PartnershipsGrid items={techStacks} label="tech-stack" />
      </Section>
      <Section
        label="FAQ "
        title={
          <>
            Frequently <span className="gradientText">Asked Questions</span>
          </>
        }
        subtitle="Everything you need to know about our services."
        sectionBgColor="sectionLightBlue"
      >
        <FaqSection faqData={faqDataServices} />
      </Section>

      <CTASection
        title={
          <>
            Ready{" "}
            <span className="gradientText">
              To Transform Your <br /> Business / Career?
            </span>
          </>
        }
        subtitle="Join thousands of professionals and companies whohave accelerated their growth with WEBSTACK. Let's build the future of African tech together."
        ctaHighlights={ctaServicesHighlights}
        primaryBtnText="See Pricing"
        primaryBtnRoute="pricing"
      />
    </>
  );
}
