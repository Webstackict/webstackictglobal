import { supabase } from "@/lib/db/supabaseClient";
import React from "react";
import GalleryGrid from "../gallery/gallery-grid";

export default async function GalleryWrapper() {
  const { data: galleryData, error } = await supabase
    .from("gallery_data_flat")
    .select("*");
    // console.log('gdata',galleryData);
    

  const galleryWithLayout = galleryData.map((item, index) => ({
    ...item,
    span: index % 2 === 0 ? Math.floor(Math.random() * 5) : 0,
  }));

  if (error) return <p className="data-fetching-error">Something went wrong</p>;
  return <GalleryGrid galleryData={galleryWithLayout} />;
}
