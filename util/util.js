import {
  webDevCurriculum,
  webDevAdditionalSkills,
} from "@/lib/contents/curriculum/web-dev-curriculum";
import {
  dataScienceCurriculum,
  dataScienceAdditionalSkills,
} from "@/lib/contents/curriculum/data-science-curriculum";
import {
  cybersecurityCurriculum,
  cybersecurityAdditionalSkills,
} from "@/lib/contents/curriculum/cybersecurity-curriculum";
import {
  mobileAppDevCurriculum,
  mobileDevAppAdditionalSkills,
} from "@/lib/contents/curriculum/mobile-app-dev-curriculum";

export function separateDepartmentName(deptName) {
  let firstDeptName = deptName;
  let secondDeptName;

  const deptStrings = deptName.split(" ");

  if (deptStrings.length > 1) {
    firstDeptName = deptStrings.slice(0, 2).join(" ");
    secondDeptName = deptStrings.slice(2).join(" ");
  }

  return {
    firstDeptName,
    secondDeptName,
  };
}

export function getDepartmentHighlights(department) {
  const highlights = [
    {
      title: "Duration",
      text: `${department.duration} Months`,
      icon: "clock",
      theme: { background: "greenTeal-bg " },
    },
    {
      title: "Cohort Size",
      text: `Max ${department.maxSize} Students`,
      icon: "group",
      theme: { background: "purplePink-bg" },
    },
    {
      title: "Certification",
      text: "Industry Recognized",
      icon: "certificate",
      theme: { background: "orangeRed-bg" },
    },
    {
      title: "Job Placement",
      text: `${department.jobPlacement} Success Rate`,
      icon: "briefcase",
      theme: { background: "bluePurple-bg" },
    },
  ];

  return highlights;
}
export function getDepartmentCurriculum(departmentName) {
  if (departmentName === "full-stack Web Dev") {
    return {
      curriculum: webDevCurriculum,
      additionalSkills: webDevAdditionalSkills,
    };
  } else if (departmentName === "data science & analytics") {
    return {
      curriculum: dataScienceCurriculum,
      additionalSkills: dataScienceAdditionalSkills,
    };
  } else if (departmentName === "cybersecurity") {
    return {
      curriculum: cybersecurityCurriculum,
      additionalSkills: cybersecurityAdditionalSkills,
    };
  } else if (departmentName === "mobile app development") {
    return {
      curriculum: mobileAppDevCurriculum,
      additionalSkills: mobileDevAppAdditionalSkills,
    };
  }
}

export const currencyFormatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
});
