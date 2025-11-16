import React from "react";
import CardGrid from "../cards/card-grid";
import { GetDepartments } from "@/lib/db/get-departments";

export default async function DepartmentWrapper({ className, label }) {
  const { data: departments, error } = await GetDepartments();

  if (error) return <p className="data-fetching-error">Something went wrong</p>;


  return <CardGrid className={className} items={departments} label={label} />;
}
