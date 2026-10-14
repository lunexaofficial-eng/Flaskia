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
  const { banners, isUsingMock, customCount } = resolveFooterBanners(footerBannersJson);

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

  // Keep index within bounds if banners list changes
  useEffect(() => {
    if (currentIndex >= banners.length) {
      setCurrentIndex(0);
    }
  }, [banners.length, currentIndex]);

  // Handle image load to automatically detect natural dimensions
  const handleImageLoad = (bannerId: string, event: React.SyntheticEvent<HTMLImageElement>) => {
    const img = event.currentTarget;
    if (img.naturalWidth && img.naturalHeight) {
      const w = img.naturalWidth;
      const h = img.naturalHeight;
      const ratio = w / h;
      setDimensionMap((prev) => {
        if (prev[bannerId]?.width === w && prev[bannerId]?.height === h) {
          return prev;
        }
        return {
          ...prev,
          [bannerId]: { width: w, height: h, ratio },
        };
      });
    }
  };

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
    }, 6000);

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

  if (banners.length === 0) {
    return null;
  }

  const currentBanner = banners[currentIndex] || banners[0];
  const detected = dimensionMap[currentBanner?.id];
  // Calculate dynamic aspect ratio string: e.g. "16 / 9" or dynamically detected
  const dynamicAspectRatio = detected?.ratio
    ? `${detected.width} / ${detected.height}`
    : currentBanner.aspectRatio?.replace(":", " / ") || "16 / 9";

  return (
    <section
      aria-label="Marketplace Featured Banners"
      className="print:hidden w-full bg-slate-900 border-t border-slate-800 text-white relative select-none overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Banner Section Header / Meta Info */}
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <h2 className="text-xs sm:text-sm font-semibold tracking-wide uppercase text-slate-300">
              Featured Highlights & Procurement Updates
            </h2>
            <span className="hidden sm:inline-block text-xs text-slate-500 font-normal">
              · Verified Laboratory Logistics
            </span>
          </div>

          <div className="flex items-center gap-2">
            {isUsingMock ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-800/80 text-slate-400 border border-slate-700/60">
                <Sparkles className="w-3 h-3 text-amber-400" />
                Featured Showcase
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium bg-blue-950/60 text-blue-300 border border-blue-800/50">
                <Layers className="w-3 h-3 text-blue-400" />
                Special Announcement
              </span>
            )}

            {banners.length > 1 && (
              <button
                type="button"
                onClick={() => setIsPaused((prev) => !prev)}
                className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors border border-slate-700/50"
                title={isPaused ? "Resume auto-rotation" : "Pause auto-rotation"}
                aria-label={isPaused ? "Play" : "Pause"}
              >
                {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
              </button>
            )}
          </div>
        </div>

        {/* Dynamic Automatically Resizing Modular Slider Container */}
        <div
          className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-950 shadow-2xl border border-slate-800/80 transition-[aspect-ratio,height] duration-500 ease-out"
          style={{
            aspectRatio: dynamicAspectRatio,
            maxHeight: "min(68vh, 560px)",
            minHeight: "220px",
          }}
        >
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentBanner.id}
              custom={direction}
              variants={{
                enter: (dir: number) => ({
                  x: dir > 0 ? "100%" : "-100%",
                  opacity: 0.2,
                }),
                center: {
                  x: 0,
                  opacity: 1,
                  transition: {
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.3 },
                  },
                },
                exit: (dir: number) => ({
                  x: dir > 0 ? "-100%" : "100%",
                  opacity: 0.2,
                  transition: {
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 },
                  },
                }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute inset-0 w-full h-full cursor-pointer group"
              onClick={(e) => handleBannerAction(currentBanner, e)}
            >
              {/* Responsive Auto-Sized Background Image */}
              <img
                src={currentBanner.imageUrl}
                alt={currentBanner.altText || currentBanner.title || "Marketplace Banner"}
                onLoad={(e) => handleImageLoad(currentBanner.id, e)}
                className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.015]"
                referrerPolicy="no-referrer"
              />

              {/* Scrim Overlay when title or description is present */}
              {(currentBanner.title || currentBanner.subtitle || currentBanner.buttonText) && (
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/60 to-transparent sm:bg-gradient-to-r sm:from-slate-950/90 sm:via-slate-950/50 sm:to-transparent flex flex-col justify-end sm:justify-center p-6 sm:p-10 md:p-14 text-left">
                  <div className="max-w-2xl space-y-3 sm:space-y-4">
                    {/* Unboxed Metadata Tag (Zero-pill discipline) */}
                    {currentBanner.badge && (
                      <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-blue-400">
                        <span>{currentBanner.badge}</span>
                        <span aria-hidden="true" className="text-slate-500">·</span>
                        <span className="text-slate-400 font-normal">Aniixa Verified</span>
                      </div>
                    )}

                    {/* Headline */}
                    {currentBanner.title && (
                      <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-snug drop-shadow-md text-balance">
                        {currentBanner.title}
                      </h3>
                    )}

                    {/* Subtitle */}
                    {currentBanner.subtitle && (
                      <p className="text-xs sm:text-sm md:text-base text-slate-200 line-clamp-2 sm:line-clamp-3 leading-relaxed max-w-xl drop-shadow-sm">
                        {currentBanner.subtitle}
                      </p>
                    )}

                    {/* CTA Button & Detected Auto-Size Dimensions Indicator */}
                    <div className="pt-2 flex flex-wrap items-center gap-3">
                      {currentBanner.buttonText && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleBannerAction(currentBanner, e);
                          }}
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-slate-900 text-xs sm:text-sm font-semibold hover:bg-blue-50 transition-colors shadow-lg shadow-black/20 group/btn"
                        >
                          <span>{currentBanner.buttonText}</span>
                          <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5" />
                        </button>
                      )}

                      {detected && (
                        <span className="text-[11px] font-mono text-slate-400/90 hidden md:inline-flex items-center gap-1.5 bg-slate-900/60 px-2.5 py-1 rounded-md border border-slate-700/40">
                          Auto-Detected: {detected.width} × {detected.height}px
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows (Rendered if > 1 banner) */}
          {banners.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-slate-900/70 hover:bg-slate-900 backdrop-blur-md text-white flex items-center justify-center transition-all border border-slate-700/60 hover:scale-105 active:scale-95 shadow-lg z-10 opacity-80 group-hover:opacity-100"
                aria-label="Previous Slide"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-slate-900/70 hover:bg-slate-900 backdrop-blur-md text-white flex items-center justify-center transition-all border border-slate-700/60 hover:scale-105 active:scale-95 shadow-lg z-10 opacity-80 group-hover:opacity-100"
                aria-label="Next Slide"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </>
          )}

          {/* Dot Indicators */}
          {banners.length > 1 && (
            <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 sm:gap-2 z-10 px-3 py-1.5 rounded-full bg-slate-950/60 backdrop-blur-md border border-slate-800/80">
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
                    className={`transition-all duration-300 rounded-full ${
                      isActive
                        ? "w-6 sm:w-7 h-2 bg-blue-500"
                        : "w-2 h-2 bg-slate-600 hover:bg-slate-400"
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
