import React from "react";
import { Product } from "../data";
import GhsPictogram from "./GhsPictogram";
import { AlertTriangle, Tag, ZoomIn, ShoppingCart, Star, ShieldCheck, Zap } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

interface ProductCardProps {
  key?: string | number;
  product: Product;
  onSelect: (product: Product) => void;
  onAddToCart: (product: Product, event: React.MouseEvent) => void;
}

export default function ProductCard({ product, onSelect, onAddToCart }: ProductCardProps) {
  const { isRetail, isIndiamart } = useTheme();

  if (isIndiamart) {
    // IndiaMART B2B Procurement Product Card
    return (
      <div 
        onClick={() => onSelect(product)}
        className="bg-white rounded-2xl border border-slate-200 hover:border-[#2e7d32] hover:shadow-xl transition-all duration-300 group flex flex-col justify-between overflow-hidden cursor-pointer relative"
        id={`card-indiamart-${product.id}`}
      >
        {/* Top Supplier Verification Ribbon */}
        <div className="bg-[#1b5e20] text-white px-3 py-1 flex items-center justify-between text-[10px] font-mono">
          <span className="flex items-center gap-1 font-bold text-emerald-200">
            <ShieldCheck className="w-3 h-3 text-emerald-400" /> Verified OEM Supplier
          </span>
          <span className="bg-emerald-800 text-white font-extrabold px-1.5 py-0.2 rounded">
            GST Verified
          </span>
        </div>

        {/* Product Image & Badges Container */}
        <div className="h-44 relative overflow-hidden bg-slate-50 p-3 flex items-center justify-center border-b border-slate-100">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
            referrerPolicy="no-referrer"
            onError={(e) => {
              e.currentTarget.src = "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=200";
            }}
          />

          <span className="absolute top-2 left-2 bg-[#00a699] text-white font-black text-[9.5px] px-2 py-0.5 rounded shadow-xs uppercase tracking-wider">
            {product.grade} Grade
          </span>

          <span className="absolute bottom-2 right-2 bg-slate-900 text-white font-mono text-[9.5px] px-2 py-0.5 rounded shadow-xs">
            CAS: {product.cas || "N/A"}
          </span>
        </div>

        {/* Product Details Content */}
        <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono mb-1">
              <span className="text-emerald-700 font-bold">Purity: {product.purity || "ACS"}</span>
              <span className="bg-emerald-50 text-emerald-800 font-extrabold px-2 py-0.5 rounded border border-emerald-200 text-[10px]">
                MOQ: 1 {product.unit}
              </span>
            </div>

            <h3 className="text-xs font-extrabold text-slate-900 group-hover:text-[#2e7d32] line-clamp-2 leading-snug font-sans">
              {product.name}
            </h3>

            {/* Price & Bulk Discount Tag */}
            <div className="mt-2.5 bg-slate-50 p-2 rounded-xl border border-slate-200">
              <div className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">Estimated Bulk Price</div>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-base font-black text-[#2e7d32] font-mono">
                  ${product.price.toFixed(2)}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  / {product.unit}
                </span>
              </div>
              <p className="text-[10px] text-emerald-700 font-semibold mt-0.5">
                ⚡ Tiered Discounts for 10+ {product.unit}s
              </p>
            </div>
          </div>

          {/* Action Buttons: Get Best Price */}
          <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelect(product);
              }}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold rounded-xl transition cursor-pointer"
            >
              Specs
            </button>
            <button
              onClick={(e) => onAddToCart(product, e)}
              className="flex-1 bg-gradient-to-r from-[#2e7d32] to-[#00a699] hover:from-[#1b5e20] hover:to-[#00897b] text-white text-xs font-black py-2 rounded-xl transition cursor-pointer shadow-md flex items-center justify-center gap-1.5 uppercase tracking-wider active:scale-95"
            >
              <Zap className="w-3.5 h-3.5 fill-white text-white" />
              <span>Get Best Price</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isRetail) {
    // Amazon & Flipkart Retail Powerhouse Product Card
    const originalPrice = Math.round(product.price * 1.35);
    const discountPercent = 25;

    return (
      <div 
        onClick={() => onSelect(product)}
        className="bg-white rounded-lg border border-slate-200 hover:border-blue-400 hover:shadow-xl transition-all duration-300 group flex flex-col justify-between overflow-hidden cursor-pointer relative"
        id={`card-retail-${product.id}`}
      >
        {/* Flipkart / Amazon Image Container */}
        <div className="h-48 relative overflow-hidden bg-slate-50 p-3 flex items-center justify-center border-b border-slate-100">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
            referrerPolicy="no-referrer"
          />

          {/* Discount Tag (Flipkart Yellow / Red Pill) */}
          <span className="absolute top-2.5 left-2.5 bg-emerald-600 text-white font-extrabold text-[10px] px-2 py-0.5 rounded shadow-xs uppercase tracking-wider">
            {discountPercent}% OFF
          </span>

          {/* Flipkart Assured / Prime Badge */}
          <span className="absolute top-2.5 right-2.5 bg-blue-600 text-white font-black text-[9px] px-2 py-0.5 rounded flex items-center gap-1 shadow-xs">
            <ShieldCheck className="w-3 h-3 text-amber-300" />
            <span>✓ Assured</span>
          </span>

          {/* Low Stock Urgency */}
          {product.stock <= 50 && (
            <span className="absolute bottom-2 left-2 bg-rose-600 text-white text-[9.5px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
              <Zap className="w-2.5 h-2.5 fill-white" /> Only {product.stock} left
            </span>
          )}
        </div>

        {/* Product Details Content */}
        <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2">
          <div>
            {/* Category / Grade Label */}
            <div className="flex items-center justify-between text-[10.5px] font-mono text-slate-500 mb-0.5">
              <span>{product.grade} Grade</span>
              <span className="text-slate-400">CAS: {product.cas}</span>
            </div>

            {/* Title */}
            <h3 className="text-xs font-bold text-slate-900 group-hover:text-[#2874f0] line-clamp-2 leading-snug font-sans">
              {product.name}
            </h3>

            {/* Star Rating & Review Count (Flipkart Green Rating Badge) */}
            <div className="flex items-center gap-2 mt-1.5">
              <span className="bg-[#388e3c] text-white text-[10.5px] font-extrabold px-1.5 py-0.5 rounded flex items-center gap-0.5 shadow-2xs font-mono">
                4.8 <Star className="w-2.5 h-2.5 fill-white text-white" />
              </span>
              <span className="text-[11px] text-slate-500 font-medium">(1,248)</span>
            </div>

            {/* Price Section: Deal Price + Original MRP Strikethrough */}
            <div className="mt-2.5 flex items-baseline gap-2">
              <span className="text-base font-extrabold text-slate-900 font-sans">
                ${product.price.toFixed(2)}
              </span>
              <span className="text-xs text-slate-400 line-through">
                ${originalPrice.toFixed(2)}
              </span>
              <span className="text-[11px] font-bold text-emerald-600">
                Save ${(originalPrice - product.price).toFixed(2)}
              </span>
            </div>

            {/* Free Delivery Tag */}
            <p className="text-[10.5px] font-semibold text-slate-700 mt-1 flex items-center gap-1">
              <span className="text-emerald-700 font-bold">Free Delivery</span> by Tomorrow
            </p>
          </div>

          {/* Action Buttons (Amazon / Flipkart Yellow & Orange Buttons) */}
          <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelect(product);
              }}
              className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold py-1.5 rounded transition cursor-pointer text-center"
            >
              Details
            </button>
            <button
              onClick={(e) => onAddToCart(product, e)}
              className="flex-1 bg-[#ff9f00] hover:bg-[#e08c00] text-slate-950 text-[11px] font-extrabold py-1.5 rounded transition cursor-pointer shadow-xs flex items-center justify-center gap-1"
            >
              <ShoppingCart className="w-3 h-3 text-slate-950" />
              <span>Add to Cart</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Emerald Standard Theme Product Card
  return (
    <div 
      onClick={() => onSelect(product)}
      className="rounded-2xl overflow-hidden cursor-pointer flex flex-col transition-all duration-300 group bg-white border border-slate-200 hover:border-slate-300 hover:shadow-xs text-slate-900"
      id={`card-${product.id}`}
    >
      
      {/* Product Image and Grade Tag overlay */}
      <div className="h-44 relative overflow-hidden select-none bg-slate-100">
        <img
          src={product.image}
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
            Low Stock ({product.stock})
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

        {/* Buy & Inspect Footers */}
        <div className="mt-4 pt-3.5 border-t flex items-center justify-between border-slate-100">
          <div>
            <div className="text-[9px] uppercase tracking-widest font-mono text-slate-400">Reagent price</div>
            <span className="text-base font-bold font-mono text-slate-900">
              ${product.price.toFixed(2)}
              <span className="text-[10px] ml-0.5 font-normal text-slate-400">/{product.unit}</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5 select-none font-sans">
            {/* Quick Inspect Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelect(product);
              }}
              className="p-2 rounded-xl border cursor-pointer transition bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-800 border-slate-200"
              title="Inspect SDS Safety Data Sheets"
            >
              <ZoomIn className="w-4 h-4" />
            </button>

            {/* Quick Add To Cart Button */}
            <button
              onClick={(e) => onAddToCart(product, e)}
              className="px-3.5 py-2 rounded-xl font-semibold text-xs transition duration-150 active:scale-95 shadow-xs cursor-pointer flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white"
              title="Add Reagent to Cart"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


