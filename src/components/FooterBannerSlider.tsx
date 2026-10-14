import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Layers,
  Smartphone,
} from "lucide-react";
import {
  FooterBannerItem,
  resolveFooterBanners,
} from "../utils/homepageDefaults";

interface FooterBannerSliderProps {
  footerBannersJson?: string;
  onNavigate?: (view: string, category?: string) => void;
}

export const FooterBannerSlider: React.FC<FooterBannerSliderProps> = ({
  footerBannersJson,
  onNavigate,
}) => {
  const { banners, isUsingMock } = resolveFooterBanners(footerBannersJson);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [isPaused, setIsPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-detected aspect ratios keyed by banner ID
  const [dimensionMap, setDimensionMap] = useState<Record<string, { width: number; height: number; ratio: number }>>(() => {
    const initial: Record<string, { width: number; height: number; ratio: number }> = {};
    banners.forEach((b) => {
      if (b.width && b.height && b.width > 0 && b.height > 0) {
        initial[b.id] = {
          width: b.width,
          height: b.height,
          ratio: b.width / b.height,
        };
      }
    });
    return initial;
  });

  // Pre-load and monitor dimensions for all banners
  useEffect(() => {
    banners.forEach((b) => {
      if (!b.imageUrl) return;
      if (dimensionMap[b.id]?.width && dimensionMap[b.id]?.height) return;
      const img = new window.Image();
      img.onload = () => {
        if (img.naturalWidth && img.naturalHeight) {
          const w = img.naturalWidth;
          const h = img.naturalHeight;
          setDimensionMap((prev) => {
            if (prev[b.id]?.width === w && prev[b.id]?.height === h) return prev;
            return {
              ...prev,
              [b.id]: { width: w, height: h, ratio: w / h },
            };
          });
        }
      };
      img.src = b.imageUrl;
    });
  }, [banners, dimensionMap]);

  // Keep index within bounds if banners list changes
  useEffect(() => {
    if (currentIndex >= banners.length) {
      setCurrentIndex(0);
    }
  }, [banners.length, currentIndex]);

  const handleNext = useCallback(() => {
    if (banners.length <= 1) return;
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  }, [banners.length]);

  const handlePrev = useCallback(() => {
    if (banners.length <= 1) return;
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  }, [banners.length]);

  const handleSelect = (idx: number) => {
    if (idx === currentIndex) return;
    setDirection(idx > currentIndex ? 1 : -1);
    setCurrentIndex(idx);
  };

  // Autoplay timer
  useEffect(() => {
    if (banners.length <= 1 || isPaused || isHovered) return;

    const timer = setInterval(() => {
      handleNext();
    }, 5500);

    return () => clearInterval(timer);
  }, [banners.length, isPaused, isHovered, handleNext]);

  // Handle banner click action
  const handleBannerAction = (banner: FooterBannerItem, e?: React.MouseEvent) => {
    if (!banner.linkUrl) return;

    const link = banner.linkUrl.trim();
    if (link.startsWith("http://") || link.startsWith("https://")) {
      window.open(link, "_blank", "noopener,noreferrer");
      return;
    }

    if (link === "#catalog" || link === "/catalog" || link === "store") {
      if (onNavigate) {
        onNavigate("store");
      } else {
        const catalogEl = document.getElementById("chemical-catalog");
        if (catalogEl) {
          catalogEl.scrollIntoView({ behavior: "smooth" });
        }
      }
      return;
    }

    if (link.startsWith("#")) {
      const targetEl = document.querySelector(link);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }

    if (onNavigate) {
      onNavigate("store");
    }
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      handlePrev();
    } else if (e.key === "ArrowRight") {
      handleNext();
    }
  };

  if (banners.length === 0) {
    return null;
  }

  const currentBanner = banners[currentIndex] || banners[0];
  const prevIndex = (currentIndex - 1 + banners.length) % banners.length;
  const nextIndex = (currentIndex + 1) % banners.length;

  return (
    <section
      aria-label="Marketplace 2:3 Portrait Featured Banners"
      className="print:hidden w-full bg-white border-t border-slate-200/90 text-slate-900 relative select-none overflow-hidden focus:outline-none"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Banner Section Header / Meta Info */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse shrink-0" />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xs sm:text-sm font-bold tracking-wider uppercase text-slate-900">
                  Featured Highlights & Procurement Updates
                </h2>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                  2:3 Portrait
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-normal">
                Verified laboratory supply chains · Certified reagents & logistics
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {/* Status Badge */}
            {isUsingMock ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200 shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Featured Showcase
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 shadow-2xs">
                <Layers className="w-3.5 h-3.5 text-blue-600" />
                Verified Custom Banners
              </span>
            )}

            {/* Slide Index Counter */}
            {banners.length > 1 && (
              <span className="text-xs font-mono font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                {String(currentIndex + 1).padStart(2, "0")} / {String(banners.length).padStart(2, "0")}
              </span>
            )}

            {/* Play/Pause Button */}
            {banners.length > 1 && (
              <button
                type="button"
                onClick={() => setIsPaused((prev) => !prev)}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 transition-colors border border-slate-200 shadow-2xs"
                title={isPaused ? "Resume auto-rotation" : "Pause auto-rotation"}
                aria-label={isPaused ? "Play" : "Pause"}
              >
                {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
              </button>
            )}
          </div>
        </div>

        {/* Professional Company 2:3 Portrait Slidable Stage */}
        <div className="relative w-full flex items-center justify-center py-2 sm:py-4 overflow-hidden">
          {/* Main Stage Area - Centered 2:3 Portrait Carousel with Side Previews */}
          <div className="relative w-full flex items-center justify-center min-h-[480px] sm:min-h-[560px] md:min-h-[600px] lg:min-h-[640px]">
            {/* If more than 1 banner, render Side Previews for Apple / Nike Style Cover Stage */}
            {banners.length > 1 && (
              <>
                {/* Previous Banner Peek (Left Side) */}
                <div
                  onClick={handlePrev}
                  className="hidden md:block absolute left-4 lg:left-12 xl:left-24 z-10 cursor-pointer transform -translate-y-1/2 top-1/2 transition-all duration-300 hover:scale-[0.94] opacity-50 hover:opacity-85"
                  style={{
                    width: "clamp(220px, 22vw, 300px)",
                    aspectRatio: "2 / 3",
                  }}
                  title={`Previous: ${banners[prevIndex].title || "Slide"}`}
                >
                  <div className="w-full h-full rounded-2xl sm:rounded-3xl overflow-hidden bg-white shadow-lg border border-slate-200/90 p-1 flex items-center justify-center">
                    <img
                      src={banners[prevIndex].imageUrl}
                      alt={banners[prevIndex].altText || "Previous Banner"}
                      className="w-full h-full object-contain rounded-xl sm:rounded-2xl bg-white"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="absolute inset-0 bg-white/30 backdrop-blur-[1px] rounded-2xl sm:rounded-3xl transition-opacity hover:opacity-0" />
                </div>

                {/* Next Banner Peek (Right Side) */}
                <div
                  onClick={handleNext}
                  className="hidden md:block absolute right-4 lg:right-12 xl:right-24 z-10 cursor-pointer transform -translate-y-1/2 top-1/2 transition-all duration-300 hover:scale-[0.94] opacity-50 hover:opacity-85"
                  style={{
                    width: "clamp(220px, 22vw, 300px)",
                    aspectRatio: "2 / 3",
                  }}
                  title={`Next: ${banners[nextIndex].title || "Slide"}`}
                >
                  <div className="w-full h-full rounded-2xl sm:rounded-3xl overflow-hidden bg-white shadow-lg border border-slate-200/90 p-1 flex items-center justify-center">
                    <img
                      src={banners[nextIndex].imageUrl}
                      alt={banners[nextIndex].altText || "Next Banner"}
                      className="w-full h-full object-contain rounded-xl sm:rounded-2xl bg-white"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="absolute inset-0 bg-white/30 backdrop-blur-[1px] rounded-2xl sm:rounded-3xl transition-opacity hover:opacity-0" />
                </div>
              </>
            )}

            {/* Active Center 2:3 Portrait Card */}
            <div
              className="relative z-20 flex items-center justify-center"
              style={{
                width: "min(92vw, 400px)",
                aspectRatio: "2 / 3",
                maxHeight: "min(82vh, 620px)",
              }}
            >
              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                  key={currentBanner.id}
                  custom={direction}
                  variants={{
                    enter: (dir: number) => ({
                      x: dir > 0 ? 120 : -120,
                      opacity: 0,
                      scale: 0.92,
                    }),
                    center: {
                      x: 0,
                      opacity: 1,
                      scale: 1,
                      transition: {
                        x: { type: "spring", stiffness: 320, damping: 30 },
                        opacity: { duration: 0.25 },
                        scale: { duration: 0.25 },
                      },
                    },
                    exit: (dir: number) => ({
                      x: dir > 0 ? -120 : 120,
                      opacity: 0,
                      scale: 0.92,
                      transition: {
                        x: { type: "spring", stiffness: 320, damping: 30 },
                        opacity: { duration: 0.2 },
                        scale: { duration: 0.2 },
                      },
                    }),
                  }}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  onDragEnd={(_, info) => {
                    const threshold = 50;
                    if (info.offset.x < -threshold) {
                      handleNext();
                    } else if (info.offset.x > threshold) {
                      handlePrev();
                    }
                  }}
                  className="w-full h-full rounded-2xl sm:rounded-3xl overflow-hidden bg-white shadow-xl sm:shadow-2xl border border-slate-200/90 flex flex-col justify-between cursor-pointer group relative transition-shadow hover:shadow-3xl"
                  onClick={(e) => handleBannerAction(currentBanner, e)}
                >
                  {/* Aspect Ratio 2:3 Portrait Graphic - object-contain ensures 100% complete banner is shown with NO cropping */}
                  <div className="relative w-full h-full flex items-center justify-center p-2 sm:p-2.5 bg-white">
                    <img
                      src={currentBanner.imageUrl}
                      alt={currentBanner.altText || currentBanner.title || "Marketplace Banner"}
                      className="w-full h-full object-contain object-center rounded-xl sm:rounded-2xl transition-transform duration-500 ease-out group-hover:scale-[1.015]"
                      referrerPolicy="no-referrer"
                    />

                    {/* Top Floating Badge if configured */}
                    {currentBanner.badge && (
                      <div className="absolute top-4 left-4 z-20">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-white/95 text-blue-700 border border-blue-200/80 shadow-md backdrop-blur-md">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                          {currentBanner.badge}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Frosted Glass Footer Overlay if title/subtitle/button exists */}
                  {((currentBanner.title && currentBanner.title.trim().length > 0) ||
                    (currentBanner.subtitle && currentBanner.subtitle.trim().length > 0) ||
                    (currentBanner.buttonText && currentBanner.buttonText.trim().length > 0)) && (
                    <div className="absolute bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-slate-200/90 p-4 sm:p-5 rounded-b-2xl sm:rounded-b-3xl text-left pointer-events-none transition-transform group-hover:translate-y-0">
                      <div className="pointer-events-auto space-y-2">
                        {currentBanner.title && (
                          <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug line-clamp-2">
                            {currentBanner.title}
                          </h3>
                        )}

                        {currentBanner.subtitle && (
                          <p className="text-[11px] sm:text-xs text-slate-600 line-clamp-2 leading-relaxed">
                            {currentBanner.subtitle}
                          </p>
                        )}

                        {currentBanner.buttonText && (
                          <div className="pt-1">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleBannerAction(currentBanner, e);
                              }}
                              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors shadow-sm shadow-blue-500/20 group/btn"
                            >
                              <span>{currentBanner.buttonText}</span>
                              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Left & Right Floating Navigation Controls */}
            {banners.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrev();
                  }}
                  className="absolute left-2 sm:left-4 md:left-8 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/95 hover:bg-white text-slate-800 hover:text-blue-600 backdrop-blur-md flex items-center justify-center transition-all border border-slate-200/90 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 z-30"
                  aria-label="Previous Slide"
                  title="Previous Slide (←)"
                >
                  <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNext();
                  }}
                  className="absolute right-2 sm:right-4 md:right-8 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/95 hover:bg-white text-slate-800 hover:text-blue-600 backdrop-blur-md flex items-center justify-center transition-all border border-slate-200/90 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 z-30"
                  aria-label="Next Slide"
                  title="Next Slide (→)"
                >
                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </>
            )}
          </div>

          {/* Dots Indicator & Quick Carousel Nav */}
          {banners.length > 1 && (
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex items-center gap-2 z-30 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-slate-200/90 shadow-sm">
              {banners.map((b, idx) => {
                const isActive = idx === currentIndex;
                return (
                  <button
                    key={b.id || idx}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelect(idx);
                    }}
                    className={`transition-all duration-300 rounded-full cursor-pointer ${
                      isActive
                        ? "w-7 sm:w-8 h-2 bg-blue-600"
                        : "w-2 h-2 bg-slate-300 hover:bg-slate-400"
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                    title={b.title || `Slide ${idx + 1}`}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
