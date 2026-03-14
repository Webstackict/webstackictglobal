import BenefitsGrid from "@/components/cards/benefits-grid";
import PageBanner from "@/components/hero/page-banner";
import Section from "@/components/section";
import Tagline from "@/components/ui/tagline";
import classes from "./page.module.css";
import CurriculumGrid from "@/components/academy/curriculum-grid";
import { getDepartmentHighlights, separateDepartmentName } from "@/util/util";

import PricingAndTimelineGrid from "@/components/academy/pricing-and-timeline-grid";
import PartnershipsGrid from "@/components/cards/partnerships-grid";
import { techStacks } from "@/lib/contents/tech-stacks";
import FaqSection from "@/components/FAQ/faq";
import CTASection from "@/components/cta/call-to-action-section";
import { faqData } from "@/lib/contents/faqData";
import { ctaHomeHighlights } from "@/lib/contents/call-to-actionData";
import { supabaseAdmin as supabase } from "@/lib/db/supabaseAdmin";
import { getDepartmentDetails } from "@/lib/db/get-department-details";
import { createSupabaseServerClient } from "@/lib/db/supabaseServer";

export async function generateMetadata({ params }) {
  const deptSlug = (await params).slug;

  try {
    const { data: department, error } = await supabase
      .from("departments")
      .select("name, description")
      .eq("slug", deptSlug)
      .maybeSingle();

    if (error) {
      console.error("Supabase error in academy generateMetadata:", {
        message: error.message,
        code: error.code,
        details: error.details,
      });
      throw error;
    }

    if (!department) {
      return {
        title: "Program Not Found | WEBSTACK-ICT-GLOBAL",
        description: "The requested training program could not be found.",
      };
    }

    return {
      title: `Study ${department.name} at WEBSTACK-ICT-GLOBAL`,
      description: department.description,
      openGraph: {
        title: `Registration is Ongoing for ${department.name} | WEBSTACK-ICT-GLOBAL`,
        description: department.description,
        url: `/programs/academy/${deptSlug}`,
        siteName: "WEBSTACK-ICT-GLOBAL",
        images: [
          {
            url: "/logo/webstack-logo-dark.png",
            width: 160,
            height: 50,
            alt: "Webstack Banner",
          },
        ],
        locale: "en_US",
        type: "article",
      },
      alternates: {
        canonical: `/programs/academy/${deptSlug}`,
      },
      twitter: {
        card: "summary",
        title: department.name,
        description: department.description,
      },
    };
  } catch (err) {
    console.error("Critical metadata fetch failure:", err);
    return {
      title: "Program Details | WEBSTACK-ICT-GLOBAL",
      description: "Explore our intensive tech programs and community events.",
    };
  }
}

export default async function DepartmentDetails({ params }) {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const deptSlug = (await params).slug;

    const { data: department, error } = await getDepartmentDetails(deptSlug);

    if (error) {
      console.error("error fetching department details", error);
      return <p className="data-fetching-error">Something went wrong</p>;
    }

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

    if (user && department.next_cohort_id) {
      const { data: isEnrolled, error: isEnrolledError } = await supabase
        .from("enrollments")
        .select("*")
        .eq("user_id", user.id)
        .eq("department_id", department.id)
        .eq("cohort_id", department.next_cohort_id);

      if (isEnrolledError) {
        console.error("Enrollment check error:", {
          message: isEnrolledError.message,
          code: isEnrolledError.code,
          details: isEnrolledError.details,
          hint: isEnrolledError.hint
        });

        // Don't crash the whole page if enrollment check fails, just assume not enrolled
        isUserEnrolled = false;
      } else {
        isUserEnrolled = isEnrolled.length > 0;

        if (isEnrolled.length > 0) {
          paymentStatus = isEnrolled[0].payment_status === "PAID";
        }
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
          <PartnershipsGrid items={techStacks[deptSlug] || techStacks["default"]} label="tech-stack" />
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
  } catch (err) {
    console.error("Critical error in DepartmentDetails component:", err);
    return (
      <div style={{ padding: '50px', textAlign: 'center' }}>
        <h2>Something went wrong loading this program.</h2>
        <p>Please try refreshing the page or contact support if the problem persists.</p>
      </div>
    );
  }
}
