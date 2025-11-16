"use client";
import { AnimatePresence, motion } from "framer-motion";
import QuickNav from "../ui/quick-nav";
import classes from "./gallery-grid.module.css";
import { formatDate } from "@/util/util";
import { use, useEffect, useState } from "react";
import { FilterContext } from "@/store/filter-context";
import SeeMoreButton from "../ui/see-more-button";

const spanValues = [
  { col: 1, height: "12rem" },
  { col: 1, height: "16rem" },
  { col: 2, height: "16rem" },
  { col: 2, height: "24rem" },
  { col: 3, height: "16rem" },
];
const visibleItemsAtATime = 10;

export default function GalleryGrid({ galleryData }) {
  const { filterValue } = use(FilterContext);
  const [filteredGallery, setFilteredGallery] = useState(galleryData);
  const [numberOfVisibleItems, setnumberOfVisibleItems] =
    useState(visibleItemsAtATime);

  const eventCategories = [
    ...new Set(galleryData.map((item) => item.category_name)),
  ];

  useEffect(() => {
    const filteredGallery = galleryData.filter((data) => {
      const matchCategory =
        !filterValue.categoryName ||
        data.category_name === filterValue.categoryName;
      const matchEvent =
        !filterValue.eventName ||
        data.title.toLowerCase().includes(filterValue.eventName.toLowerCase());

      return matchCategory && matchEvent;
    });

    setFilteredGallery(filteredGallery);
  }, [
    galleryData,
    filterValue,
    filterValue.categoryName,
    filterValue.eventName,
  ]);

  const isGalleryData = filteredGallery.length > 0;

  const visibleGallery = filteredGallery.slice(0, numberOfVisibleItems);

  return (
    <>
      <QuickNav navButtons={eventCategories} />
      <AnimatePresence mode="wait">
        {isGalleryData ? (
          <motion.div
            key={`${filterValue.categoryName}-${filterValue.eventName}`}
            className={classes.galleryGrid}
            layout
            transition={{ duration: 1 }}
          >
            {visibleGallery.map((item, index) => {
              if (index >= numberOfVisibleItems - 1) return;
              return (
                <motion.div
                  key={item.image_public_id}
                  className={`${classes.galleryItem} ${
                    classes[`col${index === 0 ? 2 : spanValues[item.span].col}`]
                  } ${classes[`row${index === 0 ? 2 : 1}`]}`}
                  style={{
                    height: index === 0 ? "100%" : spanValues[item.span].height,
                  }}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className={classes.card}>
                    <img
                      src={item.image_url}
                      alt="highlight-image"
                      className={classes.image}
                    />
                    <div className={classes.overlayContent}>
                      <h3 className={classes.title}>{item.title}</h3>
                      <p className={classes.date}>
                        {formatDate(item.event_date)}
                      </p>

                      <p className={classes.location}>{item.venue}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <p className="no-data" style={{ marginTop: "2rem" }}>
            No Events Found
          </p>
        )}
      </AnimatePresence>
      {filteredGallery.length > visibleItemsAtATime &&
      numberOfVisibleItems < filteredGallery.length ? (
        <SeeMoreButton
          onClick={() => {
            setnumberOfVisibleItems((prev) => prev + visibleItemsAtATime);
          }}
        >
          Load More Photos
        </SeeMoreButton>
      ) : null}
    </>
  );
}
