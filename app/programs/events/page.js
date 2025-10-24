import PageBanner from "@/components/hero/page-banner";
import Tagline from "@/components/ui/tagline";
import React from "react";

export default function Events() {
  return (
    <PageBanner
      title={
        <>
          Our <span>Events</span>
        </>
      }
      subtitle="COMING SOON"
      tagline={
        <>
          <Tagline text="Explore Events" icon="event" />
        </>
      }
      primaryBtnText="---"
      secondaryBtnText="---"
      primaryBtnRoute="/"
      secondaryBtnRoute="/"
    />
  );
}
