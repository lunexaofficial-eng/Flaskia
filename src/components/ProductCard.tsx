import React from "react";
import { Product } from "../data";
import GhsPictogram from "./GhsPictogram";
import { AlertTriangle, Star, ShieldCheck, Zap, MessageCircle } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useCurrency } from "../context/CurrencyContext";
import { getProxiedImageUrl } from "../utils/imageUtils";

interface ProductCardProps {
  key?: string | number;
  product: Product;
  onSelect: (product: Product) => void;
  onAddToCart?: (product: Product, event: React.MouseEvent) => void;
  onOpenInquiry?: (product: Product) => void;
}

export default function ProductCard({ product, onSelect, onOpenInquiry }: ProductCardProps) {
  const { isRetail, isIndiamart } = useTheme();
  const { formatPrice } = useCurrency();

  const handleEnquireClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onOpenInquiry) {
      onOpenInquiry(product);
    } else {
      onSelect(product);
    }
  };

  if (isIndiamart) {
    // Clean, Refined B2B Procurement Product Card (Analytical Cobalt Blue)
    return (
      <div 
        onClick={() => onSelect(product)}
        className="bg-white rounded-2xl border border-slate-200/90 hover:border-blue-300 hover:shadow-md transition-all duration-200 group flex flex-col justify-between overflow-hidden cursor-pointer"
        id={`card-indiamart-${product.id}`}
      >
        {/* Clean Unobstructed Product Image Container */}
        <div className="h-52 relative overflow-hidden bg-slate-50/70 p-6 flex items-center justify-center border-b border-slate-100">
          <img
            src={getProxiedImageUrl(product.image)}
            alt={product.name}
            className="w-full h-full object-contain group-hover:scale-103 transition-transform duration-200"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Product Details Content */}
        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
          <div className="space-y-1.5">
            {/* Clean Unboxed Metadata with Middot Separators */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 font-mono">
              <span>{product.grade}</span>
              <span aria-hidden="true">·</span>
              <span>CAS {product.cas || "N/A"}</span>
              {product.purity && (
                <>
                  <span aria-hidden="true">·</span>
                  <span>{product.purity}</span>
                </>
              )}
            </div>

            <h3 className="text-base font-semibold text-slate-900 group-hover:text-[#0052cc] transition-colors line-clamp-1 font-heading">
              {product.name}
            </h3>

            <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Price & Action Row */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
            <div>
              <span className="text-lg font-bold text-slate-900 font-mono tabular-nums">
                {formatPrice(product.price)}
              </span>
              <span className="text-xs text-slate-500 font-normal">
                {" "}/ {product.unit}
              </span>
            </div>

            <button
              onClick={handleEnquireClick}
              className="px-4 py-2 bg-[#0052cc] hover:bg-[#0747a6] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap shadow-2xs flex items-center gap-1.5 shrink-0"
              title="Auf WhatsApp anfragen"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Auf WhatsApp anfragen</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isRetail) {
    // Retail Product Card
    const originalPrice = Math.round(product.price * 1.35);
    const discountPercent = 25;

    return (
      <div 
        onClick={() => onSelect(product)}
        className="bg-white rounded-lg border border-slate-200 hover:border-blue-400 hover:shadow-xl transition-all duration-300 group flex flex-col justify-between overflow-hidden cursor-pointer relative"
        id={`card-retail-${product.id}`}
      >
        {/* Image Container */}
        <div className="h-48 relative overflow-hidden bg-slate-50 p-3 flex items-center justify-center border-b border-slate-100">
          <img
            src={getProxiedImageUrl(product.image)}
            alt={product.name}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
            referrerPolicy="no-referrer"
          />

          {/* Discount Tag */}
          <span className="absolute top-2.5 left-2.5 bg-emerald-600 text-white font-extrabold text-[10px] px-2 py-0.5 rounded shadow-xs uppercase tracking-wider">
            {discountPercent}% RABATT
          </span>

          {/* Assured Badge */}
          <span className="absolute top-2.5 right-2.5 bg-blue-600 text-white font-black text-[9px] px-2 py-0.5 rounded flex items-center gap-1 shadow-xs">
            <ShieldCheck className="w-3 h-3 text-amber-300" />
            <span>✓ Geprüft</span>
          </span>

          {/* Low Stock Urgency */}
          {product.stock <= 50 && (
            <span className="absolute bottom-2 left-2 bg-rose-600 text-white text-[9.5px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
              <Zap className="w-2.5 h-2.5 fill-white" /> Nur noch {product.stock} verfügbar
            </span>
          )}
        </div>

        {/* Product Details Content */}
        <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2">
          <div>
            {/* Category / Grade Label */}
            <div className="flex items-center justify-between text-[10.5px] font-mono text-slate-500 mb-0.5">
              <span>{product.grade} Qualität</span>
              <span className="text-slate-400">CAS: {product.cas}</span>
            </div>

            {/* Title */}
            <h3 className="text-xs font-bold text-slate-900 group-hover:text-[#2874f0] line-clamp-2 leading-snug font-sans">
              {product.name}
            </h3>

            {/* Star Rating & Review Count */}
            <div className="flex items-center gap-2 mt-1.5">
              <span className="bg-[#388e3c] text-white text-[10.5px] font-extrabold px-1.5 py-0.5 rounded flex items-center gap-0.5 shadow-2xs font-mono">
                4.8 <Star className="w-2.5 h-2.5 fill-white text-white" />
              </span>
              <span className="text-[11px] text-slate-500 font-medium">(1.248)</span>
            </div>

            {/* Price Section: Deal Price + Original MRP Strikethrough */}
            <div className="mt-2.5 flex items-baseline gap-2">
              <span className="text-base font-extrabold text-slate-900 font-sans">
                {formatPrice(product.price)}
              </span>
              <span className="text-xs text-slate-400 line-through">
                {formatPrice(originalPrice)}
              </span>
              <span className="text-[11px] font-bold text-emerald-600">
                Spare {formatPrice(originalPrice - product.price)}
              </span>
            </div>

            {/* Free Delivery Tag */}
            <p className="text-[10.5px] font-semibold text-slate-700 mt-1 flex items-center gap-1">
              <span className="text-emerald-700 font-bold">Kostenloser Versand</span> bis morgen
            </p>
          </div>

          {/* Action Button: Only Enquire on WhatsApp */}
          <div className="pt-2 border-t border-slate-100 flex items-center">
            <button
              onClick={handleEnquireClick}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-extrabold py-2 rounded-lg transition cursor-pointer shadow-xs flex items-center justify-center gap-1.5 uppercase tracking-wider"
              title="Auf WhatsApp anfragen"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-white text-white" />
              <span>Auf WhatsApp anfragen</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Standard Theme Product Card
  return (
    <div 
      onClick={() => onSelect(product)}
      className="rounded-2xl overflow-hidden cursor-pointer flex flex-col transition-all duration-300 group bg-white border border-slate-200 hover:border-slate-300 hover:shadow-xs text-slate-900"
      id={`card-${product.id}`}
    >
      {/* Product Image and Grade Tag overlay */}
      <div className="h-44 relative overflow-hidden select-none bg-slate-100">
        <img
          src={getProxiedImageUrl(product.image)}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500 opacity-90 group-hover:opacity-100"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/5 to-transparent" />
        
        {/* Grade Badge */}
        <span className="absolute top-3 left-3 text-[9.5px] uppercase font-mono px-2.5 py-0.5 rounded-full font-bold shadow-xs border bg-white/95 border-slate-200 text-slate-600">
          {product.grade}
        </span>

        {/* Purity Indicator */}
        <span className="absolute top-3 right-3 text-[10px] font-mono px-2.5 py-0.5 rounded-full tracking-wide shadow-xs font-bold border bg-blue-50 border-blue-100 text-blue-600">
          {product.purity}
        </span>

        {/* Low Stock Badge */}
        {product.stock <= 50 && (
          <span className="absolute bottom-3 left-3 bg-orange-500 border border-orange-600 text-white text-[9px] uppercase font-mono px-2 py-0.5 rounded-md font-bold shadow-xs flex items-center gap-1 leading-none select-none">
            <AlertTriangle className="w-2.5 h-2.5 animate-pulse" />
            Geringer Bestand ({product.stock})
          </span>
        )}
      </div>

      {/* Reagent Data Specs */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Chemical CAS & Formula code */}
          <div className="flex items-center justify-between text-[10px] font-mono mb-1 text-slate-400">
            <span>CAS: {product.cas}</span>
            <span className="text-slate-500 font-bold">{product.formula}</span>
          </div>

          <h3 className="text-sm font-semibold tracking-tight leading-snug transition-colors text-slate-800 group-hover:text-blue-600">
            {product.name}
          </h3>

          <p className="text-[11px] mt-1.5 leading-relaxed line-clamp-2 text-slate-500">
            {product.description}
          </p>

          {/* Miniature List of Hazard Warnings */}
          <div className="flex gap-2.5 mt-3.5 items-center px-2.5 py-1.5 rounded-xl border bg-slate-50 border-slate-100">
            <span className="text-[9px] uppercase tracking-wider font-mono text-slate-400">GHS:</span>
            <div className="flex gap-1">
              {product.ghsPictograms.map((pt, idx) => (
                <GhsPictogram key={idx} type={pt} size="sm" />
              ))}
            </div>
          </div>
        </div>

        {/* Price & Enquire on WhatsApp Footer */}
        <div className="mt-4 pt-3.5 border-t flex flex-col sm:flex-row gap-2.5 items-start sm:items-center justify-between border-slate-100">
          <div>
            <div className="text-[9px] uppercase tracking-widest font-mono text-slate-400">Reagenzienpreis</div>
            <span className="text-base font-bold font-mono text-slate-900">
              {formatPrice(product.price)}
              <span className="text-[10px] ml-0.5 font-normal text-slate-400">/{product.unit}</span>
            </span>
          </div>

          <button
            onClick={handleEnquireClick}
            className="w-full sm:w-auto px-3.5 py-2 rounded-xl font-bold text-xs transition duration-150 active:scale-95 shadow-xs cursor-pointer flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
            title="Auf WhatsApp anfragen"
          >
            <MessageCircle className="w-3.5 h-3.5 fill-white text-white" />
            <span>Auf WhatsApp anfragen</span>
          </button>
        </div>
      </div>
    </div>
  );
}


