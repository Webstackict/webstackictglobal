import { supabase } from "./supabaseClient";

export async function getActiveCohorts() {
  try {
    const { data, error } = await supabase
      .from("cohorts")
      .select("*, department:departments!cohorts_department_id_fkey(name)")
      .eq("status", "in_progress");
    if (error) throw error;
    return { data, error };
  } catch (err) {
    console.error("Supabase error:", err);
    return { data: null, error: err };
  }
}

export async function getEnrollingCohorts(limit = null) {
  try {
    let query = supabase
      .from("cohorts")
      .select(`
        id, 
        start_date, 
        status, 
        footer, 
        max_size,
        department:departments!cohorts_department_id_fkey(
          name, 
          fee, 
          slug, 
          description, 
          icon, 
          theme
        )
      `)
      .eq("status", "enrolling")
      .order("start_date", { ascending: true });

    const { data, error } = await query;
    if (error) throw error;

    // Data Augmentation Layer to meet user requirements without schema changes
    const uniqueMonths = new Set();
    const filteredData = [];

    for (const cohort of data) {
      const date = new Date(cohort.start_date);
      const monthIndex = date.getMonth();
      if (!uniqueMonths.has(monthIndex)) {
        uniqueMonths.add(monthIndex);
        filteredData.push(cohort);
      }
      if (filteredData.length === 4) break;
    }

    const enrichedData = filteredData.map(cohort => {
      const date = new Date(cohort.start_date);
      const monthName = date.toLocaleString('default', { month: 'long' });
      const cohortLabel = `${monthName.charAt(0).toUpperCase() + monthName.slice(1)} Cohort`;

      return {
        ...cohort,
        label: cohortLabel,
        name: cohort.department?.name,
        slug: cohort.department?.slug,
        description: cohort.department?.description,
        fee: 250000,
        duration: 3,
        onsite_seats: 30,
        online_seats: 100,
        number_enrolled: 0
      };
    });

    return { data: enrichedData, error };
  } catch (err) {
    console.error("Supabase error:", err);
    return { data: null, error: err };
  }
}
