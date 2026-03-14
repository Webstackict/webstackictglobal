import { supabase } from "@/lib/db/supabaseClient";
import React from "react";
import GalleryGrid from "../gallery/gallery-grid";
import { galleryItems as fallbackGallery } from "@/lib/contents/galleryData";

export default async function GalleryWrapper() {
  let galleryData = [];

  try {
    const { data, error } = await supabase
      .from("gallery_data_flat")
      .select("*");

    if (error || !data || data.length === 0) {
      console.warn("GalleryWrapper: Falling back to static data.", error);
      // Map static data to match DB structure if necessary
      galleryData = fallbackGallery.map(item => ({
        ...item,
        image_url: item.image,
        category_name: item.title, // Standardizing category name for filtering
      }));
    } else {
      galleryData = data;
    }
  } catch (err) {
    console.error("GalleryWrapper: Critical failure, using fallback.", err);
    galleryData = fallbackGallery.map(item => ({
      ...item,
      image_url: item.image,
      category_name: item.title,
    }));
  }

  const galleryWithLayout = galleryData.map((item, index) => ({
    ...item,
    span: item.span !== undefined ? item.span : (index % 2 === 0 ? Math.floor(Math.random() * 5) : 0),
  }));

  return <GalleryGrid galleryData={galleryWithLayout} />;
}
