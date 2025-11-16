import BenefitsGrid from "@/components/cards/benefits-grid";
import PageBanner from "@/components/hero/page-banner";
import Section from "@/components/section";
import Tagline from "@/components/ui/tagline";
import classes from "./page.module.css";
import CurriculumGrid from "@/components/academy/curriculum-grid";
import { getDepartmentHighlights, separateDepartmentName } from "@/util/util";

import PricingAndTimelineGrid from "@/components/academy/pricing-&-timeline-grid";
import PartnershipsGrid from "@/components/cards/partnerships-grid";
import { techStacks } from "@/lib/contents/tech-stacks";
import TestimonialGrid from "@/components/cards/testimonial-grid";
import StatsBig from "@/components/stats-big";
import FaqSection from "@/components/FAQ/faq";
import CTASection from "@/components/cta/call-to-action-section";
import { faqData } from "@/lib/contents/faqData";
import { graduateTestiomnials } from "@/lib/contents/testimonialData";
import { ctaHomeHighlights } from "@/lib/contents/call-to-actionData";
import { getDepartmentDetails } from "@/lib/db/get-department-details";
import { createSupabaseServerClient } from "@/lib/db/supabaseServer";

export async function generateMetadata({ params }) {
  const supabase = await createSupabaseServerClient();

  const deptSlug = (await params).slug;

  try {
    const { data: department, error } = await supabase
      .from("departments")
      .select("name, description")
      .eq("slug", deptSlug)
      .single();

    if (error) throw error;

    return {
      title: `Study ${department.name} at WEBSTACK-ICT-GLOBAL`,
      description: department.description,
      openGraph: {
        title: `Registration is Ongoing for ${department.name} | WEBSTACK-ICT-GLOBAL`,
        description: department.description,
        url: `https://webstack-ict-global.vercel.app/programs/academy/${deptSlug}`,
        siteName: "WEBSTACK-ICT-GLOBAL",
        images: [
          {
            url: "https://webstack-ict-global.vercel.app/logo/webstack-logo-dark.png",
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
        title: department.name,
        description: department.description,
      },
    };
  } catch (err) {
    console.error("Supabase error:", err);
    return { data: null, error: err };
  }
}

export default async function DepartmentDetails({ params }) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const deptSlug = (await params).slug;

  const { data: department, error } = await getDepartmentDetails(deptSlug);

  if (error) return <p className="data-fetching-error">Something went wrong</p>;

  const { firstDeptName, secondDeptName } = separateDepartmentName(
    department.name,
    2
  );

  const highlights = getDepartmentHighlights(
    department.duration,
    department.max_size,
    department.job_placement
  );

  let isUserEnrolled = false;
  let paymentStatus = false;

  if (user) {
    const { data: isEnrolled, error: isEnrolledError } = await supabase
      .from("enrollments")
      .select("*")
      .eq("user_id", user.id)
      .eq("department_id", department.id)
      .eq("cohort_id", department.next_cohort_id);

    if (isEnrolledError) {
      console.error("err", isEnrolledError);

      return <p className="data-fetching-error">Something went wrong</p>;
    }

    isUserEnrolled = isEnrolled.length > 0;

    if (isEnrolled.length > 0) {
      paymentStatus = isEnrolled[0].payment_status === "paid";
    }
  }

  return (
    <>
      <PageBanner
        title={
          <>
            Learn{" "}
            <span>
              {firstDeptName} <br /> {secondDeptName}
            </span>
          </>
        }
        subtitle={department.description}
        tagline={
          <>
            <Tagline text={department.name} icon={department.icon} />
          </>
        }
        primaryBtnText="Pricing"
        secondaryBtnText="See Curriculum"
        primaryBtnRoute="pricing-and-timeline"
        secondaryBtnRoute="curriculum"
      />

      <Section label="highlights">
        <BenefitsGrid
          className={classes.departmentHighlightsGrid}
          items={highlights}
        />
      </Section>

      <Section
        label="curriculum"
        title={
          <>
            Complete <span className="gradientText">Learning Path</span>
          </>
        }
        subtitle="Our carefully crafted curriculum takes you from beginner to professional developer 
                 through hands-on projects and industry best practices."
      >
        <CurriculumGrid
          items={department.curriculum}
          department={department.name}
        />
        <BenefitsGrid
          className={classes.additionalSkillsGrid}
          items={department.additional_skills}
        />
      </Section>
      <Section
        label="pricing-and-timeline"
        title={
          <>
            Pricing <span className="gradientText">&amp; Timeline</span>
          </>
        }
        subtitle="Transparent pricing with flexible payment options and upcoming cohort dates"
        sectionBgColor="sectionLightBlue"
      >
        <PricingAndTimelineGrid
          department={department}
          isEnrolled={isUserEnrolled}
          paymentStatus={paymentStatus}
        />
      </Section>

      <Section
        label="Technology Stack"
        title={
          <>
            Technology <span className="gradientText">Stack</span>
          </>
        }
        subtitle="Master the same tools used by top tech companies worldwide"
      >
        <PartnershipsGrid items={techStacks} label="tech-stack" />
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
        <TestimonialGrid testimonials={graduateTestiomnials} />
        <StatsBig />
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
        ctaHighlights={ctaHomeHighlights}
        primaryBtnText="Join the Next Cohort"
        primaryBtnRoute="pricing-and-timeline"
      />
    </>
  );
}
