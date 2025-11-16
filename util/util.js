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

export function separateDepartmentName(deptName, delta) {
  let firstDeptName = deptName;
  let secondDeptName;

  const deptStrings = deptName.split(" ");

  if (deptStrings.length > 1) {
    firstDeptName = deptStrings.slice(0, delta).join(" ");
    secondDeptName = deptStrings.slice(delta).join(" ");
  }

  return {
    firstDeptName,
    secondDeptName,
  };
}

export function getDepartmentHighlights(duration, maxSize, jobPlacement) {
  const highlights = [
    {
      title: "Duration",
      text: `${duration} Months`,
      icon: "clock",
      theme: { background: "greenTeal-bg " },
    },
    {
      title: "Cohort Size",
      text: `Max ${maxSize} Students`,
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
      text: `${jobPlacement} Success Rate`,
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

export function formatDate(dateStr) {
  const date = new Date(dateStr);

  const formattedDate = date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

  return formattedDate;
}

export function calculateProgress(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const today = new Date();

  if (today < start)
    return {
      progressPercent: 0,
      totalWeeks: 0,
      currentWeek: 0,
      isFinalWeek: false,
    };
  if (today > end)
    return {
      progressPercent: 100,
      totalWeeks: 0,
      currentWeek: 0,
      isFinalWeek: false,
    };

  const totalDays = (end - start) / (1000 * 60 * 60 * 24);
  const elapsedDays = (today - start) / (1000 * 60 * 60 * 24);

  const totalWeeks = Math.ceil(totalDays / 7);
  const currentWeek = Math.ceil(elapsedDays / 7);

  const isFinalWeek = totalWeeks - currentWeek < 1;

  return {
    progressPercent: Math.round((elapsedDays / totalDays) * 100),
    totalWeeks,
    currentWeek,
    isFinalWeek,
  };
}

export function formatTimeAgo(createdAt) {
  const now = new Date();
  const seconds = Math.floor((now - new Date(createdAt)) / 1000);

  if (seconds < 60) return `${seconds} sec${seconds !== 1 ? "s" : ""} ago`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min${minutes !== 1 ? "s" : ""} ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`;

  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} day${days !== 1 ? "s" : ""} ago`;

  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months !== 1 ? "s" : ""} ago`;

  const date = new Date(createdAt);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}
