import React, { useState } from "react";
import { Product } from "../data";
import NfpaDiamond from "./NfpaDiamond";
import GhsPictogram from "./GhsPictogram";
import AisSafetyExpert from "./AisSafetyExpert";
import { useTheme } from "../context/ThemeContext";
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
  appName?: string;
  appSubtitle?: string;
}

export default function ProductDetails({
  product,
  onBack,
  onAddToCart,
  appName = "Rexvora",
  appSubtitle = "Academic Supply Direct",
}: ProductDetailsProps) {
  const { isCyber, isRetail, isIndiamart } = useTheme();
  const [activeTab, setActiveTab] = useState<number>(0);
  const [qty, setQty] = useState(1);
  const [selectedPkg, setSelectedPkg] = useState("Glass Lab Bottle");
  const [declaredCompliance, setDeclaredCompliance] = useState(false);
  const [activeMedia, setActiveMedia] = useState<string>(product.image);
  const [showAgreementError, setShowAgreementError] = useState(false);


  // When product changes, reset media and scroll to top of window instantly
  React.useEffect(() => {
    setActiveMedia(product.image);
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
        className={`max-w-7xl mx-auto px-4 md:px-10 py-6 font-sans transition-colors duration-300 print:hidden ${
          isCyber ? "text-slate-100" : "text-slate-800"
        }`}
        id="product-detailing-screen"
      >
        {/* Back to Catalogue */}
        <button
          onClick={onBack}
          className={`flex items-center gap-2 font-medium mb-6 group cursor-pointer transition text-xs select-none ${
            isCyber ? "text-cyan-400 hover:text-cyan-200" : "text-slate-500 hover:text-blue-600"
          }`}
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1.5 transition-transform" />
          Return to Chemical Registry Catalogue
        </button>

        {/* Main product structure */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in">
          {/* Left Column (Images, Technical Spec Diamond grid, NFPA diamond) - 5 Cols */}
          <div className="lg:col-span-5 space-y-6">
            <div className={`border rounded-2xl overflow-hidden relative shadow-xs ${
              isCyber ? "bg-slate-900/90 border-cyan-500/30 shadow-[0_0_25px_rgba(6,182,212,0.15)]" : "bg-white border-slate-200"
            }`}>
              {activeMedia.endsWith(".mp4") ||
              activeMedia.endsWith(".webm") ||
              activeMedia.endsWith(".ogg") ||
              product.videoUrl === activeMedia ? (
                <video
                  src={activeMedia}
                  controls
                  autoPlay
                  muted
                  className="w-full h-80 object-cover opacity-90"
                />
              ) : (
                <img
                  src={activeMedia}
                  alt={product.name}
                  className="w-full h-80 object-cover opacity-90"
                  referrerPolicy="no-referrer"
                />
              )}
              <div className={`absolute inset-0 pointer-events-none bg-gradient-to-t ${
                isCyber ? "from-[#0a0f1d] via-transparent to-transparent opacity-80" : "from-white/20 via-white/5 to-transparent"
              }`} />
              <span className={`absolute bottom-4 left-4 text-xs px-3 py-1.5 rounded-full font-mono font-semibold border ${
                isCyber ? "bg-slate-950/90 text-cyan-300 border-cyan-500/40" : "bg-slate-900 border-slate-800 text-white"
              }`}>
                Grade: {product.grade}
              </span>
            </div>

            {/* Sub-gallery for product images and videos */}
            {((product.galleryUrls && product.galleryUrls.length > 0) ||
              product.videoUrl) && (
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                <button
                  onClick={() => setActiveMedia(product.image)}
                  className={`shrink-0 w-16 h-16 rounded-xl border-2 overflow-hidden ${activeMedia === product.image ? "border-blue-500" : "border-transparent opacity-70 hover:opacity-100"}`}
                >
                  <img
                    src={product.image}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </button>
                {product.galleryUrls?.map((url, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveMedia(url)}
                    className={`shrink-0 w-16 h-16 rounded-xl border-2 overflow-hidden ${activeMedia === url ? "border-blue-500" : "border-transparent opacity-70 hover:opacity-100"}`}
                  >
                    <img
                      src={url}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </button>
                ))}
                {product.videoUrl && (
                  <button
                    onClick={() => setActiveMedia(product.videoUrl!)}
                    className={`shrink-0 w-16 h-16 rounded-xl border-2 overflow-hidden bg-slate-900 flex items-center justify-center ${activeMedia === product.videoUrl ? "border-blue-500" : "border-transparent opacity-70 hover:opacity-100"}`}
                  >
                    <span className="text-[9px] text-white font-bold uppercase tracking-widest text-center px-1">
                      Video
                      <br />
                      Demo
                    </span>
                  </button>
                )}
              </div>
            )}

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
            <div className="space-y-2">
              {isIndiamart && (
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="bg-[#1b5e20] text-white text-xs font-bold px-2.5 py-0.5 rounded flex items-center gap-1 font-sans">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Verified OEM Supplier
                  </span>
                  <span className="bg-[#00a699] text-white text-[10px] font-black px-2 py-0.5 rounded uppercase">
                    GST & ISO 9001 Certified
                  </span>
                  <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-extrabold px-2 py-0.5 rounded font-mono">
                    MOQ: 1 {product.unit} | Response Rate: 98%
                  </span>
                </div>
              )}
              {isRetail && (
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="bg-[#388e3c] text-white text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1 font-mono">
                    4.8 ★
                  </span>
                  <span className="text-xs text-[#2874f0] font-bold">1,248 ratings & 312 reviews</span>
                  <span className="bg-[#2874f0] text-white text-[10px] font-black px-2 py-0.5 rounded uppercase">
                    ✓ Flipkart Assured
                  </span>
                  <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold px-2 py-0.5 rounded">
                    #1 Best Seller in Lab Reagents
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <span className="text-[11px] bg-white border border-slate-200 text-slate-600 font-mono px-3 py-1 rounded-md">
                  Purity Checked: {product.purity}
                </span>
                <span className="text-[11px] bg-blue-50 border border-blue-100/60 text-blue-600 font-mono px-3 py-1 rounded-md font-semibold">
                  Category: {typeof product.category === "object" && product.category !== null ? (product.category as any).name : product.category}
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-800 font-heading">
                {product.name}
              </h2>
              <p className="text-xs text-slate-500 leading-relaxed font-sans mt-2">
                {product.description}
              </p>
            </div>

            {/* Pricing, Packaging and Laboratory Declaration selector block */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 md:p-6 space-y-5 shadow-xs relative">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest font-mono block">
                    {isIndiamart ? "Estimated Bulk RFQ Price" : isRetail ? "Deal Price" : "Volumetric unit price"}
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-3xl font-extrabold text-slate-900 font-mono">
                      ${unitPrice.toFixed(2)}
                    </span>
                    {isRetail && (
                      <>
                        <span className="text-sm text-slate-400 line-through">
                          ${(unitPrice * 1.35).toFixed(2)}
                        </span>
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          26% OFF
                        </span>
                      </>
                    )}
                    <span className="text-xs text-slate-400 font-normal">
                      /{product.unit}
                    </span>
                  </div>
                  {isIndiamart && (
                    <p className="text-[11px] text-emerald-800 font-bold mt-1 bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                      ₹ Get Custom Bulk Volume Discount Quotes Direct From Verified Manufacturer
                    </p>
                  )}
                  {isRetail && (
                    <p className="text-[11px] text-emerald-700 font-semibold mt-1">
                      FREE Delivery by <strong className="font-extrabold">Tomorrow 2:00 PM</strong> | In Stock
                    </p>
                  )}
                </div>

                {/* Counter qty */}
                <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 p-1.5 rounded-2xl select-none">
                  <button
                    type="button"
                    disabled={qty <= 1}
                    onClick={() => setQty((prev) => prev - 1)}
                    className="w-10 h-10 rounded-xl hover:bg-slate-200 active:scale-95 disabled:opacity-30 disabled:scale-100 flex items-center justify-center font-medium text-slate-700 cursor-pointer transition-colors"
                  >
                    -
                  </button>
                  <span className="w-10 text-center font-mono text-sm text-slate-900 font-bold">
                    {qty}
                  </span>
                  <button
                    type="button"
                    disabled={qty >= 10 || qty >= product.stock}
                    onClick={() => setQty((prev) => prev + 1)}
                    className="w-10 h-10 rounded-xl hover:bg-slate-200 active:scale-95 disabled:opacity-30 disabled:scale-100 flex items-center justify-center font-medium text-slate-700 cursor-pointer transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Packaging and safety containment options */}
              <div className="space-y-2.5">
                <label className="block text-[11px] uppercase tracking-wider text-slate-400 font-bold">
                  Safety Containment Type
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {PACKAGING_OPTIONS.map((opt) => (
                    <div
                      key={opt.name}
                      onClick={() => setSelectedPkg(opt.name)}
                      className={`p-3 rounded-xl border cursor-pointer flex flex-col justify-between transition text-left select-none ${
                        selectedPkg === opt.name
                          ? "border-blue-500 bg-blue-50/50 text-slate-900 shadow-2xs"
                          : "border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      <div>
                        <span className="text-xs font-bold block">
                          {opt.name}
                        </span>
                        <span className="text-[10px] text-slate-400 block leading-tight mt-1">
                          {opt.desc}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono font-bold mt-2.5 block text-slate-600">
                        {opt.priceDelta === 0
                          ? "Standard Package"
                          : opt.priceDelta > 0
                            ? `+$${opt.priceDelta.toFixed(2)}`
                            : `-$${Math.abs(opt.priceDelta).toFixed(2)}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Regulatory Safety Checklist Checkmark */}
              <div 
                id="compliance-verification-box"
                className={`p-4 rounded-2xl space-y-3.5 select-none transition-all duration-300 ${
                  showAgreementError 
                    ? "bg-red-50 border-2 border-red-500 shadow-md ring-4 ring-red-500/10 animate-bounce" 
                    : "bg-slate-50 border border-slate-100"
                }`}
              >
                <div className={`text-xs font-bold flex items-center gap-1.5 leading-none ${showAgreementError ? "text-red-700 font-extrabold" : "text-slate-700"}`}>
                  <AlertTriangle className={`w-4 h-4 shrink-0 shadow-3xs ${showAgreementError ? "text-red-600 animate-pulse" : "text-amber-500"}`} />
                  Laboratory End-Of-Use Compliance Verification
                </div>
                
                {showAgreementError && (
                  <div className="bg-red-600 text-white rounded-lg px-3 py-2 text-[10.5px] font-bold flex items-center gap-1.5 animate-fade-in shadow-sm">
                    <span className="text-sm">⚠️</span>
                    <span>Action Required: You must accept the chemistry end-use agreement before adding this chemical to cart!</span>
                  </div>
                )}

                <p className={`text-[10.5px] leading-normal ${showAgreementError ? "text-red-800" : "text-slate-500"}`}>
                  By ticking the agreement verification below, you confirm that
                  this substance will reside strictly in institutional chemistry
                  inventory registers and will not be diverted for private or
                  non-educational domestic formulation.
                </p>
                <label className="flex gap-2.5 items-start cursor-pointer active:scale-[0.99] transition-transform">
                  <input
                    type="checkbox"
                    checked={declaredCompliance}
                    onChange={(e) => {
                      setDeclaredCompliance(e.target.checked);
                      if (e.target.checked) {
                        setShowAgreementError(false);
                      }
                    }}
                    className={`mt-0.5 rounded cursor-pointer size-4.5 accent-blue-600 ring-2 transition-all ${
                      showAgreementError ? "ring-red-500 outline-hidden bg-red-100 border-red-500" : "accent-blue-600"
                    }`}
                  />
                  <span className={`text-[10.5px] leading-snug font-medium ${showAgreementError ? "text-red-900 font-semibold" : "text-slate-600"}`}>
                    I certify scientific end-use intent and secure compliance
                    guidelines storage protocols.
                  </span>
                </label>
              </div>

              {/* Shopping cart trigger */}
              <div className="flex gap-2 pt-1 select-none flex-wrap">
                <div className="flex flex-1 gap-2 min-w-[200px]">
                  {product.sdsUrl ? (
                    <a
                      href={product.sdsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 justify-center bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 text-xs py-3.5 px-3 rounded-xl cursor-pointer transition active:scale-95 text-center flex-1 font-medium"
                      title="Download Official SDS PDF"
                    >
                      <Download className="w-4 h-4 text-slate-500 shrink-0" />
                      <span className="truncate">Download SDS</span>
                    </a>
                  ) : (
                    <div
                      className="flex items-center gap-2 justify-center bg-slate-50 border border-slate-200 text-slate-400 text-xs py-3.5 px-3 rounded-xl text-center flex-1 font-medium cursor-not-allowed"
                      title="SDS document not available for this product"
                    >
                      <Download className="w-4 h-4 text-slate-300 shrink-0" />
                      <span className="truncate">SDS Unavailable</span>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (!declaredCompliance) {
                      setShowAgreementError(true);
                      const el = document.getElementById("compliance-verification-box");
                      if (el) {
                        el.scrollIntoView({ behavior: "smooth", block: "center" });
                      }
                      return;
                    }
                    onAddToCart(product, qty, selectedPkg, declaredCompliance);
                  }}
                  className={`flex-[1.5] flex min-w-[220px] w-full items-center gap-2 justify-center font-bold text-xs py-3.5 px-4.5 rounded-xl cursor-pointer transition active:scale-95 text-center shadow-md hover:shadow-lg ${
                    isIndiamart
                      ? "bg-gradient-to-r from-[#2e7d32] to-[#00a699] hover:from-[#1b5e20] hover:to-[#00897b] text-white font-black uppercase tracking-wider shadow-emerald-200"
                      : isRetail
                      ? "bg-[#ff9f00] hover:bg-[#e08c00] text-slate-950 font-extrabold shadow-amber-200"
                      : "bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                  }`}
                >
                  {isIndiamart ? (
                    <>
                      <Zap className="w-4.5 h-4.5 shrink-0 fill-white text-white" />
                      <span>REQUEST BEST PRICE & QUOTATION</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4.5 h-4.5 shrink-0" />
                      <span>{isRetail ? `ADD TO CART ($${totalPrice.toFixed(2)})` : `Add to Chem-Cart ($${totalPrice.toFixed(2)})`}</span>
                    </>
                  )}
                </button>
              </div>

              {showAgreementError && (
                <p className="text-[10px] text-red-650 font-bold text-center select-none h-2 leading-none absolute bottom-1 right-6 animate-pulse">
                  * Action Required: Accept Safety Verification above!
                </p>
              )}
            </div>
            
            <div className="bg-amber-50/50 border border-amber-200/50 rounded-xl p-3 flex items-center justify-center gap-2 mt-4 text-amber-900 shadow-xs">
              <Truck className="w-4.5 h-4.5 text-amber-600" />
              <p className="text-xs font-bold uppercase tracking-wider font-mono">
                Estimated Delivery Time: <span className="text-amber-700">10 to 15 Days</span>
              </p>
            </div>

            {/* GHS SAFETY DATA SECTIONS */}
            <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
              <div className="bg-slate-50 px-5.5 py-4.5 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <h3 className="text-sm font-semibold text-slate-800 leading-none font-heading">
                    Material Safety Data Sheets (SDS)
                  </h3>
                </div>
                <span className="text-[10px] bg-white text-slate-500 border border-slate-200 font-mono px-2 py-0.5 rounded font-medium">
                  GHS compliant format
                </span>
              </div>

              {/* TAB SELECTORS */}
              <div className="flex overflow-x-auto border-b border-slate-200 bg-white scrollbar-none">
                {product.sds.sections.map((sec, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveTab(idx)}
                    className={`px-4.5 py-3 text-xs font-semibold whitespace-nowrap shrink-0 border-b-2 transition cursor-pointer select-none ${
                      activeTab === idx
                        ? "border-blue-600 text-blue-600 font-semibold bg-blue-50/10"
                        : "border-transparent text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    {sec.title.split(":")[0]}
                  </button>
                ))}

                {/* Extra default MSDS standard segments */}
                <button
                  onClick={() => setActiveTab(999)}
                  className={`px-4.5 py-3 text-xs font-semibold whitespace-nowrap shrink-0 border-b-2 transition cursor-pointer select-none ${
                    activeTab === 999
                      ? "border-blue-600 text-blue-600 font-semibold bg-blue-50/10"
                      : "border-transparent text-slate-500 hover:text-slate-800"
                  }`}
                >
                  GHS Codes
                </button>
              </div>

              {/* ACTIVE TAB CONTENT DISPLAY SECTION */}
              <div className="p-5 min-h-[160px] max-h-[300px] overflow-y-auto leading-relaxed text-xs">
                {activeTab === 999 ? (
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-[11px] font-bold text-slate-700 tracking-wider uppercase mb-1 font-heading">
                        Standard Hazard Statements
                      </h4>
                      <ul className="space-y-1 my-2">
                        {product.sds.hazardStatements.map((h, i) => (
                          <li
                            key={i}
                            className="text-red-500 font-mono text-[11px] leading-relaxed flex items-start gap-1"
                          >
                            <span className="shrink-0">•</span>
                            {h}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-[11px] font-bold text-slate-700 tracking-wider uppercase mb-1 font-heading">
                        Standard Precautionary Statement Regulations
                      </h4>
                      <ul className="space-y-1 my-2">
                        {product.sds.precautionaryStatements.map((p, i) => (
                          <li
                            key={i}
                            className="text-amber-600 font-mono text-[11px] leading-relaxed flex items-start gap-1"
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
                    <h4 className="font-bold text-slate-800 mb-2 border-b border-slate-100 pb-1.5 text-xs font-heading">
                      {product.sds.sections[activeTab]?.title}
                    </h4>
                    <ul className="space-y-2">
                      {product.sds.sections[activeTab]?.content.map(
                        (point, i) => (
                          <li
                            key={i}
                            className="text-slate-600 list-disc list-inside leading-relaxed text-[11.5px]"
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

            {/* AI CHEMICAL CHAT EXPERT ASSISTANT CARD */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 px-1">
                <Award className="w-4 h-4 text-amber-500" />
                <h4 className="text-xs uppercase tracking-wider font-bold text-slate-500 font-heading">
                  Interactive Safety Simulation Assistant
                </h4>
              </div>
              <AisSafetyExpert product={product} />
            </div>
          </div>
        </div>
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
