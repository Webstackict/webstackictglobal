import classes from "./services-card-grid.module.css";
import ServiceCard from "./service-card";

import { services } from "@/lib/contents/services";

export default function ServicesCardGrid({ limit = null }) {
  const displayedServices = limit ? services.slice(0, limit) : services;

  return (
    <div className={classes.programsGrid}>
      {displayedServices.map((service) => (
        <ServiceCard
          key={service.title}
          title={service.title}
          description={service.description}
          incentives={service.incentives}
          icon={service.icon}
          theme={service.theme}
        />
      ))}
    </div>
  );
}