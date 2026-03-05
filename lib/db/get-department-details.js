import { supabaseAdmin as supabase } from "./supabaseAdmin";
import { getDepartmentCurriculum } from "@/util/util";

export async function getDepartmentDetails(deptSlug) {
  try {
    const { data: department, error } = await supabase
      .from("departments")
      .select("*")
      .eq("slug", deptSlug)
      .maybeSingle();

    if (error) {
      console.error("Supabase query error in getDepartmentDetails:", {
        message: error.message,
        code: error.code,
        details: error.details,
      });
      return { data: null, error };
    }

    if (!department) {
      console.warn(`Department with slug "${deptSlug}" not found.`);
      return { data: null, error: new Error("Department not found") };
    }

    // Fetch the next available enrolling cohort for this department
    const { data: cohort, error: cohortError } = await supabase
      .from("cohorts")
      .select("id, start_date, enrollment_deadline, graduation_date, max_size")
      .eq("department_id", department.id)
      .eq("status", "enrolling")
      .order("start_date", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (cohortError) {
      console.error("Supabase cohort query error in getDepartmentDetails:", {
        message: cohortError.message,
        code: cohortError.code,
        details: cohortError.details,
      });
    }

    if (cohort) {
      department.next_cohort_id = cohort.id;
      department.next_cohort = cohort.start_date;
      department.enrollment_deadline = cohort.enrollment_deadline;
      department.graduation_date = cohort.graduation_date;
      department.max_size = cohort.max_size || 30; // Fallback
    } else {
      department.next_cohort_id = null;
      department.next_cohort = "TBA";
      department.enrollment_deadline = "TBA";
      department.graduation_date = "TBA";
      department.max_size = 30;
    }

    // Map database department names/slugs to detailed curriculum constants
    const curriculumData = getDepartmentCurriculum(department.name);
    if (curriculumData) {
      department.curriculum = curriculumData.curriculum;
      department.additional_skills = curriculumData.additionalSkills;
    }

    // Ensure common fields are defaults if missing
    department.duration = department.duration || 3;
    department.job_placement = department.job_placement || 100;

    return { data: department, error: null };
  } catch (err) {
    console.error("Supabase catch error in getDepartmentDetails:", err);
    return { data: null, error: err };
  }
}
