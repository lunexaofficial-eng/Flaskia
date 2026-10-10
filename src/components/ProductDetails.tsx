import React, { useState } from "react";
import { Product } from "../data";
import NfpaDiamond from "./NfpaDiamond";
import GhsPictogram from "./GhsPictogram";
import AisSafetyExpert from "./AisSafetyExpert";
import { useTheme } from "../context/ThemeContext";
import { useCurrency } from "../context/CurrencyContext";
import { getProxiedImageUrl } from "../utils/imageUtils";
import {
  FileText,
  ShoppingCart,
  ShieldCheck,
  ArrowLeft,
  Truck,
  Layers,
  Award,
  Download,
  AlertTriangle,
  Printer,
  Zap,
  Lock,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  Play,
} from "lucide-react";

interface ProductDetailsProps {
  product: Product;
  onBack: () => void;
  onAddToCart: (
    product: Product,
    quantity: number,
    packaging: string,
    agreesTerms: boolean,
  ) => void;
  onOpenInquiry?: (product: Product, quantity?: number) => void;
  appName?: string;
  appSubtitle?: string;
  whatsappNumber?: string;
}

export default function ProductDetails({
  product,
  onBack,
  onAddToCart,
  onOpenInquiry,
  appName = "Flaskia",
  appSubtitle = "Academic Supply Direct",
  whatsappNumber = "15099941048",
}: ProductDetailsProps) {
  const { isCyber, isRetail, isIndiamart } = useTheme();
  const { formatPrice } = useCurrency();
  const [activeTab, setActiveTab] = useState<number>(0);
  const [qty, setQty] = useState(1);
  const [selectedPkg, setSelectedPkg] = useState("Glass Lab Bottle");
  const [declaredCompliance, setDeclaredCompliance] = useState(false);
  const [activeMedia, setActiveMedia] = useState<string>(product.image);
  const [showAgreementError, setShowAgreementError] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Build unified deduplicated media list (main image + gallery images + optional video)
  const mediaItems = React.useMemo(() => {
    const items: { url: string; type: "image" | "video" }[] = [];
    const seen = new Set<string>();

    const addUrl = (url?: string, forceVideo = false) => {
      if (!url || !url.trim()) return;
      const trimmed = url.trim();
      if (seen.has(trimmed)) return;
      seen.add(trimmed);
      const isVid =
        forceVideo ||
        trimmed.endsWith(".mp4") ||
        trimmed.endsWith(".webm") ||
        trimmed.endsWith(".ogg");
      items.push({ url: trimmed, type: isVid ? "video" : "image" });
    };

    addUrl(product.image);
    if (Array.isArray(product.galleryUrls)) {
      product.galleryUrls.forEach((u) => addUrl(u));
    }
    if (product.videoUrl) {
      addUrl(product.videoUrl, true);
    }
    return items;
  }, [product.image, product.galleryUrls, product.videoUrl]);

  const activeMediaIndex = Math.max(
    0,
    mediaItems.findIndex((m) => m.url === activeMedia),
  );
  const currentMediaItem = mediaItems[activeMediaIndex] || {
    url: product.image,
    type: "image" as const,
  };

  const handlePrevMedia = () => {
    if (mediaItems.length <= 1) return;
    const prevIdx =
      (activeMediaIndex - 1 + mediaItems.length) % mediaItems.length;
    setActiveMedia(mediaItems[prevIdx].url);
  };

  const handleNextMedia = () => {
    if (mediaItems.length <= 1) return;
    const nextIdx = (activeMediaIndex + 1) % mediaItems.length;
    setActiveMedia(mediaItems[nextIdx].url);
  };

  // When product changes, reset media and scroll to top of window instantly
  React.useEffect(() => {
    setActiveMedia(product.image);
    setIsLightboxOpen(false);
    window.scrollTo(0, 0);
  }, [product.id, product.image]);

  // Volumetric Packaging Options
  const PACKAGING_OPTIONS = [
    {
      name: "Glass Lab Bottle",
      priceDelta: 0,
      desc: "Triple-sealed amber glass bottle for oxidation protection.",
    },
    {
      name: "High-Density Polyethylene",
      priceDelta: -2.5,
      desc: "Corrosion-proof lightweight HDPE container.",
    },
    {
      name: "Heavy-Duty Metal Canister",
      priceDelta: 4.0,
      desc: "Impact-resistant canister with pressure sealing.",
    },
  ];

  const currentPkgObj =
    PACKAGING_OPTIONS.find((p) => p.name === selectedPkg) ||
    PACKAGING_OPTIONS[0];
  const unitPrice = Math.max(8.0, product.price + currentPkgObj.priceDelta);
  const totalPrice = unitPrice * qty;

  const handlePrintMSDS = () => {
    // Elegant clean print layout simulation
    const brandName = appName.toUpperCase();
    const printContent = `
========================================
MATERIAL SAFETY DATA SHEET (MSDS / SDS)
${brandName} STANDARD - REGISTERED PROTOCOL
========================================
Product Name: ${product.name}
CAS Number: ${product.cas}
Formula: ${product.formula}
Molecular Weight: ${product.molecularWeight}
Grade: ${product.grade}
----------------------------------------
GHS CLASSIFICATION:
${product.sds.hazardStatements.join("\n")}
----------------------------------------
PRECAUTIONARY PROTOCOLS:
${product.sds.precautionaryStatements.join("\n")}
----------------------------------------
EXPOSURE CONTROLS & LABORATORY PROTECTION:
- Wear Nitrile Goggles (ANSI Z87.1 approved)
- White Laboratory Coat
- Impervious Nitrile chemical resistance gloves
- Store below 30°C in dry warehouse logic.
----------------------------------------
${appName} Safety Registry Verification Office
Regulatory compliance timestamp: ${new Date().toISOString()}
========================================
    `;

    const blob = new Blob([printContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `SDS-${product.id}-${product.cas}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };
  return (
    <>
      <div
        className="max-w-7xl mx-auto px-4 md:px-10 py-6 font-sans transition-colors duration-300 print:hidden text-slate-800"
        id="product-detailing-screen"
      >
        {/* Back to Catalogue */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 font-medium mb-6 group cursor-pointer transition text-xs select-none text-slate-500 hover:text-[#0052cc]"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1.5 transition-transform" />
          Return to Chemical Registry Catalogue
        </button>

        {/* Main product structure */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in">
          {/* Left Column (Images, Technical Spec Diamond grid, NFPA diamond) - 5 Cols */}
          <div className="lg:col-span-5 space-y-5">
            {/* Clean Corporate Product Gallery */}
            <div className="space-y-3">
              {/* Main Product Image Frame */}
              <div className="relative group bg-white border border-slate-200/90 rounded-2xl flex items-center justify-center h-80 sm:h-96 p-6 shadow-2xs select-none overflow-hidden">
                {currentMediaItem.type === "video" ? (
                  <video
                    src={currentMediaItem.url}
                    controls
                    autoPlay
                    muted
                    className="max-w-full max-h-full w-auto h-auto object-contain rounded-xl"
                  />
                ) : (
                  <img
                    src={getProxiedImageUrl(currentMediaItem.url)}
                    alt={product.name}
                    onClick={() => setIsLightboxOpen(true)}
                    className="max-w-full max-h-full w-auto h-auto object-contain transition-transform duration-300 group-hover:scale-[1.03] cursor-zoom-in"
                    referrerPolicy="no-referrer"
                  />
                )}

                {/* Fullscreen / Zoom Trigger Button (for images) */}
                {currentMediaItem.type === "image" && (
                  <button
                    type="button"
                    onClick={() => setIsLightboxOpen(true)}
                    title="View Full Image"
                    className="absolute top-3.5 right-3.5 p-2 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-[#0052cc] hover:border-blue-200 shadow-2xs transition-all cursor-pointer opacity-0 group-hover:opacity-100 focus:opacity-100"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                )}

                {/* Left / Right Navigation Arrows when multiple gallery items exist */}
                {mediaItems.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={handlePrevMedia}
                      aria-label="Previous image"
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-[#0052cc] hover:border-blue-200 shadow-xs flex items-center justify-center transition-all cursor-pointer opacity-0 group-hover:opacity-100 focus:opacity-100"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={handleNextMedia}
                      aria-label="Next image"
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-[#0052cc] hover:border-blue-200 shadow-xs flex items-center justify-center transition-all cursor-pointer opacity-0 group-hover:opacity-100 focus:opacity-100"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>

                    {/* Counter Badge */}
                    <div className="absolute bottom-3 right-3.5 px-2.5 py-0.5 rounded-md text-[11px] font-mono font-medium bg-white/95 border border-slate-200 text-slate-500 shadow-2xs">
                      {activeMediaIndex + 1} / {mediaItems.length}
                    </div>
                  </>
                )}
              </div>

              {/* Clean White Corporate Thumbnail Strip */}
              {mediaItems.length > 1 && (
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2.5">
                  {mediaItems.map((item, idx) => {
                    const isSelected = item.url === currentMediaItem.url;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveMedia(item.url)}
                        className={`group/thumb relative aspect-square rounded-xl bg-white p-2 flex items-center justify-center transition-all cursor-pointer overflow-hidden ${
                          isSelected
                            ? "border-2 border-[#0052cc] shadow-xs"
                            : "border border-slate-200 hover:border-blue-300 shadow-2xs"
                        }`}
                      >
                        {item.type === "video" ? (
                          <div className="w-full h-full rounded-lg bg-blue-50/70 border border-blue-100 flex flex-col items-center justify-center gap-1 text-[#0052cc]">
                            <Play className="w-4 h-4 fill-current" />
                            <span className="text-[9px] font-semibold uppercase tracking-wider">
                              Video
                            </span>
                          </div>
                        ) : (
                          <img
                            src={getProxiedImageUrl(item.url)}
                            alt={`${product.name} thumbnail ${idx + 1}`}
                            className="max-w-full max-h-full w-auto h-auto object-contain transition-transform duration-200 group-hover/thumb:scale-105"
                            referrerPolicy="no-referrer"
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Quick Technical Specs Table */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4.5 space-y-3 shadow-xs">
              <h3 className="text-xs uppercase tracking-wider font-bold text-slate-400 font-heading">
                Technical Specifications
              </h3>

              <div className="grid grid-cols-2 gap-3.5 text-xs">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 block">
                    Empirical Formula
                  </span>
                  <span className="font-semibold text-slate-700 font-mono block mt-1">
                    {product.formula}
                  </span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 block">
                    Molecular Weight
                  </span>
                  <span className="font-semibold text-slate-700 font-mono block mt-1">
                    {product.molecularWeight}
                  </span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 block">
                    CAS Number Registry
                  </span>
                  <span className="font-semibold text-slate-700 font-mono block mt-1">
                    {product.cas}
                  </span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 block">
                    Physical Appearance
                  </span>
                  <span className="font-semibold text-slate-700 block mt-1">
                    {product.physicalState}
                  </span>
                </div>
                {product.meltingPoint && (
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 block">
                      Melting Threshold
                    </span>
                    <span className="font-semibold text-slate-700 font-mono block mt-1">
                      {product.meltingPoint}
                    </span>
                  </div>
                )}
                {product.boilingPoint && (
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 block">
                      Boiling Threshold
                    </span>
                    <span className="font-semibold text-slate-700 font-mono block mt-1">
                      {product.boilingPoint}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* NFPA & GHS Diamonds Grid Side-by-Side */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <NfpaDiamond
                health={product.nfpa.health}
                flammability={product.nfpa.flammability}
                instability={product.nfpa.instability}
                special={product.nfpa.special}
                size={110}
              />

              <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col justify-between shadow-xs">
                <div>
                  <h4 className="text-[11px] uppercase tracking-wider text-slate-400 font-medium font-heading">
                    GHS Class Pictograms
                  </h4>
                  <div className="flex gap-4.5 mt-3">
                    {product.ghsPictograms.map((pt, idx) => (
                      <GhsPictogram key={idx} type={pt} size="md" />
                    ))}
                  </div>
                </div>
                <p className="text-[10.5px] text-slate-400 mt-4 leading-relaxed font-sans border-t border-slate-100 pt-2.5">
                  Inspect pictograms for handling guidelines. Click components
                  on the left or use GHS safety codes to manage laboratory
                  protocols.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column (Single Description, Pricing selections, SDS tabs, Compliance) - 7 Cols */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2.5">
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 font-mono">
                <span>{typeof product.category === "object" && product.category !== null ? (product.category as any).name : product.category}</span>
                <span className="text-slate-300">•</span>
                <span>{product.grade} Grade</span>
                <span className="text-slate-300">•</span>
                <span>Purity: {product.purity}</span>
                {product.cas && (
                  <>
                    <span className="text-slate-300">•</span>
                    <span>CAS {product.cas}</span>
                  </>
                )}
              </div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 font-heading">
                {product.name}
              </h2>
              <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-sans pt-1">
                {product.description}
              </p>
            </div>

            {/* Pricing, Packaging and Action selector block */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 md:p-6 space-y-5 shadow-2xs relative">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest font-mono block">
                    {isIndiamart ? "Unit Reference Price" : isRetail ? "Deal Price" : "Volumetric unit price"}
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-3xl font-bold text-slate-900 font-mono">
                      {formatPrice(unitPrice)}
                    </span>
                    <span className="text-xs text-slate-400 font-normal">
                      / {product.unit}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Estimated Dispatch & Transit: <span className="font-medium text-slate-700">10–15 Business Days</span>
                  </p>
                </div>

                {/* Counter qty */}
                <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 p-1 rounded-xl select-none self-start md:self-auto">
                  <button
                    type="button"
                    disabled={qty <= 1}
                    onClick={() => setQty((prev) => prev - 1)}
                    className="w-9 h-9 rounded-lg hover:bg-slate-200 active:scale-95 disabled:opacity-30 disabled:scale-100 flex items-center justify-center font-medium text-slate-700 cursor-pointer transition-colors"
                  >
                    -
                  </button>
                  <span className="w-10 text-center font-mono text-sm text-slate-900 font-semibold">
                    {qty}
                  </span>
                  <button
                    type="button"
                    disabled={qty >= 10 || qty >= product.stock}
                    onClick={() => setQty((prev) => prev + 1)}
                    className="w-9 h-9 rounded-lg hover:bg-slate-200 active:scale-95 disabled:opacity-30 disabled:scale-100 flex items-center justify-center font-medium text-slate-700 cursor-pointer transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Packaging and safety containment options */}
              <div className="space-y-2.5">
                <label className="block text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                  Safety Containment Type
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {PACKAGING_OPTIONS.map((opt) => (
                    <div
                      key={opt.name}
                      onClick={() => setSelectedPkg(opt.name)}
                      className={`p-3 rounded-xl border cursor-pointer flex flex-col justify-between transition text-left select-none ${
                        selectedPkg === opt.name
                          ? "border-[#0052cc] bg-blue-50/50 text-slate-900"
                          : "border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      <div>
                        <span className="text-xs font-semibold block">
                          {opt.name}
                        </span>
                        <span className="text-[10px] text-slate-400 block leading-tight mt-1">
                          {opt.desc}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono font-semibold mt-2.5 block text-slate-600">
                        {opt.priceDelta === 0
                          ? "Standard"
                          : opt.priceDelta > 0
                            ? `+${formatPrice(opt.priceDelta)}`
                            : `-${formatPrice(Math.abs(opt.priceDelta))}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action triggers */}
              <div className="flex gap-3 pt-1 select-none flex-wrap">
                {product.sdsUrl && (
                  <a
                    href={product.sdsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 justify-center bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs py-3 px-4 rounded-xl cursor-pointer transition active:scale-[0.99] text-center font-semibold"
                    title="Download Official SDS PDF"
                  >
                    <Download className="w-4 h-4 text-slate-500 shrink-0" />
                    <span>Download SDS</span>
                  </a>
                )}

                {/* Enquire on WhatsApp Button */}
                <button
                  type="button"
                  onClick={() => {
                    if (onOpenInquiry) {
                      onOpenInquiry(product, qty);
                    } else {
                      const cleanPhone = (whatsappNumber || "15099941048").replace(/[^0-9]/g, "");
                      const textMsg = `*NEW B2B PRODUCT ENQUIRY*\n------------------------------------\n*Product Name:* ${product.name}\n*Product ID:* ${product.id}\n*CAS Registry:* ${product.cas || "N/A"}\n*Purity & Grade:* ${product.purity || "ACS Grade"} | ${product.grade || "Technical"} Grade\n*Price:* $${product.price} / ${product.unit || "unit"}\n------------------------------------\n*Inquiry Quantity:* ${qty}\nHello, I would like to request a quotation for this product.`;
                      window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(textMsg)}`, "_blank");
                    }
                  }}
                  className="flex-1 flex min-w-[200px] items-center gap-2 justify-center font-semibold text-xs py-3 px-6 rounded-xl cursor-pointer transition active:scale-[0.99] text-center bg-[#0052cc] hover:bg-[#0747a6] text-white"
                >
                  <MessageCircle className="w-4 h-4 shrink-0" />
                  <span>Enquire on WhatsApp</span>
                </button>
              </div>
            </div>

            {/* GHS SAFETY DATA SECTIONS */}
            <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-2xs">
              <div className="bg-slate-50/70 px-5 py-3.5 border-b border-slate-200/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#0052cc]" />
                  <h3 className="text-xs font-semibold text-slate-800 leading-none font-heading uppercase tracking-wider">
                    Material Safety Data Sheet (SDS)
                  </h3>
                </div>
              </div>

              {/* TAB SELECTORS */}
              <div className="flex overflow-x-auto border-b border-slate-200 bg-white scrollbar-none">
                {product.sds.sections.map((sec, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveTab(idx)}
                    className={`px-4 py-2.5 text-xs font-medium whitespace-nowrap shrink-0 border-b-2 transition cursor-pointer select-none ${
                      activeTab === idx
                        ? "border-[#0052cc] text-[#0052cc] font-semibold bg-blue-50/20"
                        : "border-transparent text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    {sec.title.split(":")[0]}
                  </button>
                ))}

                {/* Extra default MSDS standard segments */}
                <button
                  onClick={() => setActiveTab(999)}
                  className={`px-4 py-2.5 text-xs font-medium whitespace-nowrap shrink-0 border-b-2 transition cursor-pointer select-none ${
                    activeTab === 999
                      ? "border-[#0052cc] text-[#0052cc] font-semibold bg-blue-50/20"
                      : "border-transparent text-slate-500 hover:text-slate-800"
                  }`}
                >
                  GHS Codes
                </button>
              </div>

              {/* ACTIVE TAB CONTENT DISPLAY SECTION */}
              <div className="p-5 min-h-[150px] max-h-[280px] overflow-y-auto leading-relaxed text-xs">
                {activeTab === 999 ? (
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-[11px] font-bold text-slate-700 tracking-wider uppercase mb-1 font-heading">
                        Hazard Statements
                      </h4>
                      <ul className="space-y-1 my-2">
                        {product.sds.hazardStatements.map((h, i) => (
                          <li
                            key={i}
                            className="text-red-600 font-mono text-[11px] leading-relaxed flex items-start gap-1.5"
                          >
                            <span className="shrink-0">•</span>
                            {h}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-[11px] font-bold text-slate-700 tracking-wider uppercase mb-1 font-heading">
                        Precautionary Statements
                      </h4>
                      <ul className="space-y-1 my-2">
                        {product.sds.precautionaryStatements.map((p, i) => (
                          <li
                            key={i}
                            className="text-amber-700 font-mono text-[11px] leading-relaxed flex items-start gap-1.5"
                          >
                            <span className="shrink-0">•</span>
                            {p}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 animate-fade-in">
                    <h4 className="font-semibold text-slate-800 mb-2 border-b border-slate-100 pb-1.5 text-xs font-heading">
                      {product.sds.sections[activeTab]?.title}
                    </h4>
                    <ul className="space-y-1.5">
                      {product.sds.sections[activeTab]?.content.map(
                        (point, i) => (
                          <li
                            key={i}
                            className="text-slate-600 list-disc list-inside leading-relaxed text-xs"
                          >
                            {point}
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Fullscreen Image Lightbox Modal */}
        {isLightboxOpen && currentMediaItem.type === "image" && (
          <div
            className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-xs flex flex-col items-center justify-center p-4 sm:p-8 select-none animate-fade-in"
            onClick={() => setIsLightboxOpen(false)}
          >
            {/* Top Bar */}
            <div
              className="w-full max-w-5xl flex items-center justify-between text-white mb-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div>
                <h4 className="text-sm font-semibold tracking-tight">
                  {product.name}
                </h4>
                {mediaItems.length > 1 && (
                  <p className="text-xs text-slate-400 font-mono">
                    Image {activeMediaIndex + 1} of {mediaItems.length}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setIsLightboxOpen(false)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
                aria-label="Close full image view"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main Lightbox Image Stage */}
            <div
              className="relative w-full max-w-4xl flex-1 max-h-[72vh] bg-white rounded-2xl p-6 sm:p-10 flex items-center justify-center shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={getProxiedImageUrl(currentMediaItem.url)}
                alt={product.name}
                className="max-w-full max-h-full w-auto h-auto object-contain"
                referrerPolicy="no-referrer"
              />

              {mediaItems.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrevMedia}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/95 border border-slate-200 text-slate-700 hover:text-[#0052cc] shadow-md flex items-center justify-center transition cursor-pointer"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextMedia}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/95 border border-slate-200 text-slate-700 hover:text-[#0052cc] shadow-md flex items-center justify-center transition cursor-pointer"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Lightbox Thumbnail Strip */}
            {mediaItems.length > 1 && (
              <div
                className="flex items-center gap-2.5 mt-4 overflow-x-auto max-w-full py-1 px-2"
                onClick={(e) => e.stopPropagation()}
              >
                {mediaItems.map((item, idx) => {
                  const isSelected = item.url === currentMediaItem.url;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveMedia(item.url)}
                      className={`w-16 h-16 shrink-0 rounded-xl bg-white p-1.5 border-2 flex items-center justify-center transition cursor-pointer overflow-hidden ${
                        isSelected
                          ? "border-[#0052cc] scale-105 shadow-md"
                          : "border-transparent opacity-65 hover:opacity-100"
                      }`}
                    >
                      {item.type === "video" ? (
                        <div className="w-full h-full rounded-lg bg-slate-900 flex items-center justify-center text-white">
                          <Play className="w-4 h-4 fill-current text-blue-400" />
                        </div>
                      ) : (
                        <img
                          src={getProxiedImageUrl(item.url)}
                          alt={`${product.name} view ${idx + 1}`}
                          className="max-w-full max-h-full w-auto h-auto object-contain"
                          referrerPolicy="no-referrer"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* PRINTER FRIENDLY SDS PDF VIEW */}
      <div className="hidden print:block font-sans text-black p-10 max-w-4xl mx-auto space-y-10 bg-white relative print:relative print:mt-12 print:mb-12">
        {/* Dynamic Watermark covering background of print */}
        <div className="hidden print:fixed print:inset-0 print:flex print:items-center print:justify-center pointer-events-none select-none z-0 overflow-hidden">
          <div className="text-slate-400 font-extrabold text-7xl uppercase tracking-[0.25em] opacity-[0.05] -rotate-35 text-center transform scale-150 leading-tight">
            {appName}
            <br />
            <span className="text-2xl tracking-[0.15em] font-medium leading-normal block mt-3 text-slate-500">
              {appSubtitle}
            </span>
          </div>
        </div>

        {/* Dynamic Header Block with margin/padding to prevent overlap/cutoff in mobile and desktop print templates */}
        <div className="relative z-10 border-b-4 border-black pb-6 space-y-4">
          {/* Marketplace/Brand Identity Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-dashed border-gray-300 pb-3 gap-2">
            <div className="flex items-center gap-2.5">
              <span className="px-2.5 py-1 bg-black text-white text-[11px] font-black uppercase tracking-wider rounded-xs leading-none">
                {appName} OFFICIAL
              </span>
              <span className="text-xs font-bold text-slate-800 uppercase tracking-widest">
                {appName} {appSubtitle ? `— ${appSubtitle}` : ""}
              </span>
            </div>
            <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">
              GHS Certified Custody Chain
            </span>
          </div>

          <div className="flex justify-between items-end pt-1">
            <div>
              <h1 className="text-3xl font-black uppercase tracking-widest leading-none">
                SAFETY DATA SHEET
              </h1>
              <p className="text-xs font-semibold mt-1.5 uppercase tracking-wider text-slate-600">
                Conforms to OSHA HazCom & GHS Standards
              </p>
            </div>
            <div className="text-right text-xs font-mono border border-black p-2.5 bg-slate-50">
              <p className="leading-snug">
                <strong className="text-zinc-650">Document ID:</strong> SDS-{product.cas || product.id}
              </p>
              <p className="leading-snug mt-0.5">
                <strong className="text-zinc-650">Date Printed:</strong> {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Section 1: Identification */}
        <div className="space-y-3 relative z-10">
          <h2 className="text-lg font-bold uppercase border-b border-gray-300 pb-1">
            1. Product Identification
          </h2>
          <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm font-mono bg-slate-50 p-4 border border-slate-200">
            <div className="flex justify-between border-b border-slate-200 pb-1">
              <span className="font-bold">Product Name:</span>
              <span className="text-right">{product.name}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-1">
              <span className="font-bold">CAS Number:</span>
              <span className="text-right">{product.cas}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-1">
              <span className="font-bold">Formula:</span>
              <span className="text-right">{product.formula}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-1">
              <span className="font-bold">Molecular Weight:</span>
              <span className="text-right">{product.molecularWeight}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-1">
              <span className="font-bold">Grade / Purity:</span>
              <span className="text-right">
                {product.grade} / {product.purity}
              </span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-1">
              <span className="font-bold">Physical State:</span>
              <span className="text-right">{product.physicalState}</span>
            </div>
          </div>
        </div>

        {/* Section 2: Hazard Identification */}
        <div className="space-y-4 relative z-10">
          <h2 className="text-lg font-bold uppercase border-b border-gray-300 pb-1">
            2. Hazard Identification
          </h2>

          <div className="flex gap-4">
            {product.ghsPictograms.map((pt, idx) => (
              <div
                key={idx}
                className="border border-black p-2 rounded scale-90 origin-top-left"
              >
                <GhsPictogram type={pt} size="sm" />
              </div>
            ))}
          </div>

          <div className="space-y-4 text-sm font-sans mt-4">
            <div className="bg-red-50 border border-red-200 p-4">
              <h3 className="font-bold uppercase text-red-800 mb-2 font-heading">
                Target Hazard Statements
              </h3>
              <ul className="list-disc pl-5 space-y-1 text-red-900 font-mono text-xs">
                {product.sds.hazardStatements.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
            </div>
            <div className="bg-amber-50 border border-amber-200 p-4">
              <h3 className="font-bold uppercase text-amber-800 mb-2 font-heading">
                Precautionary Protocols
              </h3>
              <ul className="list-disc pl-5 space-y-1 text-amber-900 font-mono text-xs">
                {product.sds.precautionaryStatements.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* NFPA diamond Section */}
        <div className="space-y-4 break-inside-avoid relative z-10">
          <h2 className="text-lg font-bold uppercase border-b border-gray-300 pb-1">
            3. Fire & Reactivity Data (NFPA)
          </h2>
          <div className="p-4 border border-slate-200 bg-slate-50 flex items-center gap-12">
            <div className="scale-110 origin-left">
              <NfpaDiamond
                health={product.nfpa.health}
                flammability={product.nfpa.flammability}
                instability={product.nfpa.instability}
                special={product.nfpa.special}
                size={80}
              />
            </div>
            <div className="space-y-2 text-sm font-mono">
              <p>
                <strong className="text-blue-800">Health (Blue):</strong>{" "}
                {product.nfpa.health}
              </p>
              <p>
                <strong className="text-red-800">Flammability (Red):</strong>{" "}
                {product.nfpa.flammability}
              </p>
              <p>
                <strong className="text-yellow-800">
                  Instability (Yellow):
                </strong>{" "}
                {product.nfpa.instability}
              </p>
              {product.nfpa.special && (
                <p>
                  <strong>Special (White):</strong> {product.nfpa.special}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Dynamic Sections */}
        <div className="space-y-6 relative z-10">
          {product.sds.sections.map((sec, idx) => (
            <div key={idx} className="space-y-2 break-inside-avoid">
              <h2 className="text-lg font-bold uppercase border-b border-gray-300 pb-1">
                {idx + 4}. {sec.title.split(":")[0]}
              </h2>
              <ul className="list-disc pl-5 space-y-1.5 text-xs font-sans leading-relaxed text-slate-800">
                {sec.content.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Footer / Signature stamp */}
        <div className="mt-12 pt-4 border-t border-black text-center text-xs font-mono text-slate-500 pb-12 relative z-10">
          <p>End of Safety Data Sheet</p>
          <p>
            Generated by {appName} Compliance Systems — Not for commercial
            reproduction.
          </p>
        </div>
      </div>
    </>
  );
}
