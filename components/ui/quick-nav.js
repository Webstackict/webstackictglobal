"use client";
import { iconsConfig } from "@/lib/icons/iconsConfig";
import classes from "./quick-nav.module.css";
import { use, useEffect, useRef } from "react";
import { FilterContext } from "@/store/filter-context";

const FilterIcon = iconsConfig["filter"];
const SearchIcon = iconsConfig["search"];

export default function QuickNav({ navButtons }) {
  const buttons = ["All Events", ...navButtons];
  const { filterValue, setFilterValue } = use(FilterContext);

  const debounceRef = useRef();

  const scrollRef = useRef(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    function onWheel(e) {
      if (e.deltaY === 0) return;
      e.preventDefault();
      el.scrollTo({
        left: el.scrollLeft + e.deltaY,
        behavior: "smooth",
      });
    }

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  useEffect(() => {
    const slider = scrollRef.current;
    let isDown = false;
    let startX;
    let scrollLeft;

    slider.addEventListener("mousedown", (e) => {
      isDown = true;
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    });
    slider.addEventListener("mouseleave", () => {
      isDown = false;
    });
    slider.addEventListener("mouseup", () => {
      isDown = false;
    });
    slider.addEventListener("mousemove", (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX) * 2; // scroll speed
      slider.scrollLeft = scrollLeft - walk;
    });
  }, []);

  function handleCategoryButtonClick(catName) {
    if (catName === "All Events") {
      setFilterValue((prev) => ({
        ...prev,
        categoryName: "",
      }));
      return;
    }

    if (filterValue.categoryName !== catName) {
      setFilterValue((prev) => ({
        ...prev,
        categoryName: catName,
      }));
    }
  }

  function handleEventNameChange(event) {
    clearTimeout(debounceRef.current);
    const inputValue = event.target.value;

    debounceRef.current = setTimeout(() => {
      setFilterValue((prev) => ({
        ...prev,
        eventName: inputValue,
      }));
    }, 100);
  }

  return (
    <section id="quick-nav" className={classes.qickNav}>
      <div className={classes.container}>
        <div className={classes.wrapper}>
          {/* Left side buttons */}
          <div className={classes.buttonGrouprapper}>
            <div
              className={classes.buttonGroup}
              ref={scrollRef}
              draggable={false}
            >
              {buttons.map((catName, i) => {
                const isActive = filterValue.categoryName === catName;
                const isAllEvents =
                  filterValue.categoryName === "" && catName === "All Events";

                return (
                  <button
                    key={i}
                    className={`${classes.navButton} ${
                      isActive
                        ? classes.active
                        : isAllEvents
                        ? classes.active
                        : undefined
                    }`}
                    onClick={() => handleCategoryButtonClick(catName)}
                    draggable={false}
                  >
                    {catName}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right side search + filter */}
          <div className={classes.rightGroup}>
            <div className={classes.searchWrapper}>
              <input
                type="text"
                placeholder="Search events..."
                className={classes.searchInput}
                onChange={handleEventNameChange}
              />
              <SearchIcon className={classes.searchIcon} />
            </div>
            {/* <button className={classes.filterButton}>
              <FilterIcon />
            </button> */}
          </div>
        </div>
      </div>
    </section>
  );
}
