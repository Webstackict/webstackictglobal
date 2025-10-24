import slugify from "slugify";

export const departments = [
  {
    name: "full-stack Web Dev",
    slug: slugify("Full-Stack Web Dev"),
    description:
      "Master React, Node.js, databases, and deployment with real-world projects.",
    duration: 6,
    fee: "300000",
    spotsLeft: "8",
    maxSize: "30",
    nextCohort: "Jan 1, 2026",
    graduationDate: "May 15, 2026",
    enrollmentDeadline: "Dec 26, 2026",
    status: "open",
    icon: "code",
    theme: "blue-bg",
    certification: 'Industry Recognized',
    jobPlacement: "98%"
  },
  {
    name: "data science & analytics",
    slug: slugify("data science & analytics"),
    description:
      "Learn Python, ML, AI, and data visualization with industry datasets.",
    duration: 6,
    fee: "400000",
    spotsLeft: "15",
    maxSize: "30",
    nextCohort: "Feb 20, 2026",
    graduationDate: "May 27, 2026",
    enrollmentDeadline: "Feb 15, 2026",
    status: "open",
    icon: "barChart",
    theme: "purple-bg",
    certification: 'Industry Recognized',
    jobPlacement: "97%"
  },
  {
    name: "cybersecurity",
    slug: slugify("cybersecurity"),
    description:
      "Ethical hacking, network security, and incident response training.",
    duration: 6,
    fee: "250000",
    spotsLeft: "12",
    maxSize: "30",
    nextCohort: "Jan 22, 2026",
    graduationDate: "June 12, 2026",
    enrollmentDeadline: "Jan 17, 2026",
    status: "open",
    icon: "security",
    theme: "red-bg",
    certification: 'Industry Recognized',
    jobPlacement: "90%"
  },
  {
    name: "mobile app development",
    slug: slugify("mobile app development"),
    description:
      "Build native iOS and Android apps with React Native and Flutter.",
    duration: 6,
    fee: "200000",
    spotsLeft: "25",
    maxSize: "30",
    nextCohort: "Jan 8, 2026",
    graduationDate: "April 15, 2026",
    enrollmentDeadline: "Jan 3, 2026",
    status: "open",
    icon: "mobile",
    theme: "green-bg",
    certification: 'Industry Recognized',
    jobPlacement: "85%"
  },
];

export const ongoingCohorts = [
  {
    name: "Full-Stack Web Dev Cohort 15",
    slug: slugify("Full-Stack Web Dev"),
    startDate: "2025-10-15",
    endDate: "2025-10-22",
    theme: "blue-bg",
    started: "October 15, 2024",
    numberOfStudents: "30/30",
    progress: "Week 11 of 12",
    footer: "Current Module: React.js & State Management",
  },
  {
    name: "Data Analysis Cohort 8",
    slug: slugify("data science & analytics"),
    startDate: "2025-08-20",
    endDate: "2026-01-20",
    theme: "purple-bg",
    started: "September 20, 2024",
    numberOfStudents: "30/30",
    progress: "Week 11 of 12",
    footer: "Current Module: Machine Learning Fundamentals",
  },
  {
    name: "Cybersecurity Cohort 3",
    slug: slugify("cybersecurity"),
    startDate: "2025-07-22",
    endDate: "2025-12-22",
    theme: "red-bg",
    started: "January 22, 2025",
    numberOfStudents: "30/30",
    progress: "Week 11 of 12",
    footer: "Current Module: Networking",
  },
  {
    name: "Mobile app Development Cohort 12",
    slug: slugify("mobile app development"),
    startDate: "2025-10-08",
    endDate: "2025-12-08",
    theme: "green-bg",
    started: "November 8, 2024",
    numberOfStudents: "30/30",
    progress: "Week 11 of 12",

    footer: "Current Module: Portfolio Presentation & Review",
  },
];
