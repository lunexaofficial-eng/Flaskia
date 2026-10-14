import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
} from "lucide-react";
import {
  FooterBannerItem,
  resolveFooterBanners,
  parseBannerAspectRatio,
} from "../utils/homepageDefaults";

interface FooterBannerSliderProps {
  footerBannersJson?: string;
  onNavigate?: (view: string, category?: string) => void;
}

export const FooterBannerSlider: React.FC<FooterBannerSliderProps> = ({
  footerBannersJson,
  onNavigate,
}) => {
  const { banners } = resolveFooterBanners(footerBannersJson);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [isPaused, setIsPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [naturalRatios, setNaturalRatios] = useState<Record<string, number>>({});

  // Keep index within bounds if banners list changes
  useEffect(() => {
    if (currentIndex >= banners.length) {
      setCurrentIndex(0);
    }
  }, [banners.length, currentIndex]);

  // Preload all banner images and automatically detect their natural dimensions & aspect ratios
  useEffect(() => {
    banners.forEach((banner) => {
      if (!banner.imageUrl) return;
      const img = new Image();
      img.onload = () => {
        if (img.naturalWidth > 0 && img.naturalHeight > 0) {
          const ratio = img.naturalWidth / img.naturalHeight;
          setNaturalRatios((prev) => {
            if (prev[banner.imageUrl] && Math.abs(prev[banner.imageUrl] - ratio) < 0.001) {
              return prev;
            }
            return {
              ...prev,
              [banner.imageUrl]: ratio,
            };
          });
        }
      };
      img.src = banner.imageUrl;
    });
  }, [banners]);

  // Helper to resolve aspect ratio for any banner item
  const getBannerRatio = useCallback(
    (banner?: FooterBannerItem): number => {
      if (!banner) return 2 / 3;
      if (banner.imageUrl && naturalRatios[banner.imageUrl]) {
        return naturalRatios[banner.imageUrl];
      }
      if (banner.width && banner.height && banner.width > 0 && banner.height > 0) {
        return banner.width / banner.height;
      }
      if (banner.aspectRatio) {
        const parsed = parseBannerAspectRatio(banner.aspectRatio);
        if (parsed) return parsed;
      }
      return 2 / 3; // sensible portrait default
    },
    [naturalRatios]
  );

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

  const currentRatio = getBannerRatio(currentBanner);
  const prevRatio = getBannerRatio(banners[prevIndex]);
  const nextRatio = getBannerRatio(banners[nextIndex]);

  // Determine responsive container dimensions based on the banner's actual aspect ratio
  const { maxWidth, maxHeight, isWideFormat } = useMemo(() => {
    const r = currentRatio;
    if (r < 0.85) {
      // Portrait (e.g. 2:3 = 0.67, 9:16 = 0.56)
      return {
        maxWidth: "min(92vw, 420px)",
        maxHeight: "min(82vh, 620px)",
        isWideFormat: false,
      };
    } else if (r < 1.15) {
      // Square or near-square (e.g. 1:1, 4:5)
      return {
        maxWidth: "min(92vw, 540px)",
        maxHeight: "min(75vh, 540px)",
        isWideFormat: false,
      };
    } else if (r < 1.6) {
      // Standard Landscape (e.g. 4:3 = 1.33, 3:2 = 1.5)
      return {
        maxWidth: "min(94vw, 840px)",
        maxHeight: "min(68vh, 520px)",
        isWideFormat: true,
      };
    } else {
      // Widescreen / Panoramic (e.g. 16:9 = 1.78, 21:9 = 2.33)
      return {
        maxWidth: "min(96vw, 1080px)",
        maxHeight: "min(60vh, 500px)",
        isWideFormat: true,
      };
    }
  }, [currentRatio]);

  return (
    <section
      aria-label="Featured highlights & procurement updates"
      className="print:hidden w-full bg-white border-t border-slate-200/90 text-slate-900 relative select-none overflow-hidden focus:outline-none"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Banner Section Header: Clean title only */}
        <div className="flex items-center justify-between mb-5 sm:mb-6">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse shrink-0" />
            <h2 className="text-xs sm:text-sm md:text-base font-bold tracking-wider uppercase text-slate-900">
              Featured highlights & procurement updates
            </h2>
          </div>

          {banners.length > 1 && (
            <button
              type="button"
              onClick={() => setIsPaused((prev) => !prev)}
              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 transition-colors border border-slate-200 shadow-2xs cursor-pointer"
              title={isPaused ? "Resume auto-rotation" : "Pause auto-rotation"}
              aria-label={isPaused ? "Play" : "Pause"}
            >
              {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>

        {/* Automatic Aspect Ratio Slidable Stage */}
        <div className="relative w-full flex items-center justify-center py-2 sm:py-4 overflow-hidden min-h-[380px] sm:min-h-[460px]">
          <div className="relative w-full flex items-center justify-center">
            {/* Side Previews (shown gracefully on large screens when banner is portrait or square) */}
            {banners.length > 1 && !isWideFormat && (
              <>
                {/* Previous Banner Peek (Left Side) */}
                <div
                  onClick={handlePrev}
                  className="hidden lg:block absolute left-4 xl:left-16 z-10 cursor-pointer transform -translate-y-1/2 top-1/2 transition-all duration-500 hover:scale-[0.96] opacity-45 hover:opacity-85"
                  style={{
                    width: "clamp(180px, 18vw, 260px)",
                    aspectRatio: `${prevRatio}`,
                    maxHeight: "min(65vh, 480px)",
                  }}
                  title="Previous banner"
                >
                  <div className="w-full h-full rounded-2xl sm:rounded-3xl overflow-hidden bg-white shadow-md border border-slate-200/90 p-1 flex items-center justify-center">
                    <img
                      src={banners[prevIndex].imageUrl}
                      alt={banners[prevIndex].altText || "Previous banner"}
                      className="w-full h-full object-contain rounded-xl sm:rounded-2xl bg-white"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="absolute inset-0 bg-white/25 backdrop-blur-[0.5px] rounded-2xl sm:rounded-3xl transition-opacity hover:opacity-0" />
                </div>

                {/* Next Banner Peek (Right Side) */}
                <div
                  onClick={handleNext}
                  className="hidden lg:block absolute right-4 xl:right-16 z-10 cursor-pointer transform -translate-y-1/2 top-1/2 transition-all duration-500 hover:scale-[0.96] opacity-45 hover:opacity-85"
                  style={{
                    width: "clamp(180px, 18vw, 260px)",
                    aspectRatio: `${nextRatio}`,
                    maxHeight: "min(65vh, 480px)",
                  }}
                  title="Next banner"
                >
                  <div className="w-full h-full rounded-2xl sm:rounded-3xl overflow-hidden bg-white shadow-md border border-slate-200/90 p-1 flex items-center justify-center">
                    <img
                      src={banners[nextIndex].imageUrl}
                      alt={banners[nextIndex].altText || "Next banner"}
                      className="w-full h-full object-contain rounded-xl sm:rounded-2xl bg-white"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="absolute inset-0 bg-white/25 backdrop-blur-[0.5px] rounded-2xl sm:rounded-3xl transition-opacity hover:opacity-0" />
                </div>
              </>
            )}

            {/* Active Banner Stage - Automatic Aspect Ratio Container */}
            <div
              className="relative z-20 flex items-center justify-center"
              style={{
                width: "100%",
                maxWidth,
                maxHeight,
                aspectRatio: `${currentRatio}`,
                transition:
                  "max-width 0.45s cubic-bezier(0.2, 0.9, 0.3, 1), max-height 0.45s cubic-bezier(0.2, 0.9, 0.3, 1), aspect-ratio 0.45s cubic-bezier(0.2, 0.9, 0.3, 1)",
              }}
            >
              <AnimatePresence initial={false} custom={direction} mode="popLayout">
                <motion.div
                  key={currentBanner.id || currentIndex}
                  custom={direction}
                  variants={{
                    enter: (dir: number) => ({
                      x: dir > 0 ? "100%" : "-100%",
                      opacity: 0,
                      scale: 0.95,
                    }),
                    center: {
                      x: 0,
                      opacity: 1,
                      scale: 1,
                      transition: {
                        x: { type: "spring", stiffness: 280, damping: 28, mass: 0.8 },
                        opacity: { duration: 0.32, ease: [0.22, 1, 0.36, 1] },
                        scale: { duration: 0.32, ease: [0.22, 1, 0.36, 1] },
                      },
                    },
                    exit: (dir: number) => ({
                      x: dir > 0 ? "-100%" : "100%",
                      opacity: 0,
                      scale: 0.95,
                      transition: {
                        x: { type: "spring", stiffness: 280, damping: 28, mass: 0.8 },
                        opacity: { duration: 0.28, ease: [0.22, 1, 0.36, 1] },
                        scale: { duration: 0.28, ease: [0.22, 1, 0.36, 1] },
                      },
                    }),
                  }}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.16}
                  onDragEnd={(_, info) => {
                    const threshold = 40;
                    const velocity = info.velocity.x;
                    if (info.offset.x < -threshold || velocity < -280) {
                      handleNext();
                    } else if (info.offset.x > threshold || velocity > 280) {
                      handlePrev();
                    }
                  }}
                  className="w-full h-full rounded-2xl sm:rounded-3xl overflow-hidden bg-white shadow-xl sm:shadow-2xl border border-slate-200/90 flex items-center justify-center cursor-pointer group relative transition-shadow hover:shadow-3xl"
                  onClick={(e) => handleBannerAction(currentBanner, e)}
                >
                  {/* Banner Graphic - Preserves exact image ratio without cropping */}
                  <div className="relative w-full h-full flex items-center justify-center p-2 sm:p-2.5 bg-white">
                    <img
                      src={currentBanner.imageUrl}
                      alt={currentBanner.altText || currentBanner.title || "Featured banner"}
                      onLoad={(e) => {
                        const img = e.currentTarget;
                        if (img.naturalWidth > 0 && img.naturalHeight > 0) {
                          const ratio = img.naturalWidth / img.naturalHeight;
                          setNaturalRatios((prev) => {
                            if (prev[currentBanner.imageUrl] && Math.abs(prev[currentBanner.imageUrl] - ratio) < 0.001) {
                              return prev;
                            }
                            return {
                              ...prev,
                              [currentBanner.imageUrl]: ratio,
                            };
                          });
                        }
                      }}
                      className="w-full h-full object-contain object-center rounded-xl sm:rounded-2xl transition-transform duration-500 ease-out group-hover:scale-[1.01]"
                      referrerPolicy="no-referrer"
                    />
                  </div>
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
                  className="absolute left-2 sm:left-4 md:left-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/95 hover:bg-white text-slate-800 hover:text-blue-600 backdrop-blur-md flex items-center justify-center transition-all border border-slate-200/90 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 z-30 cursor-pointer"
                  aria-label="Previous slide"
                  title="Previous slide (←)"
                >
                  <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNext();
                  }}
                  className="absolute right-2 sm:right-4 md:right-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/95 hover:bg-white text-slate-800 hover:text-blue-600 backdrop-blur-md flex items-center justify-center transition-all border border-slate-200/90 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 z-30 cursor-pointer"
                  aria-label="Next slide"
                  title="Next slide (→)"
                >
                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </>
            )}
          </div>

          {/* Dots Indicator */}
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
                    title={`Slide ${idx + 1}`}
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
