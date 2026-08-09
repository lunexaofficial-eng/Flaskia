import React from "react";
import { 
  X, 
  ShoppingCart, 
  ArrowRight, 
  Lock, 
  Plus, 
  Minus, 
  Beaker, 
  ShieldCheck, 
  Info,
  Layers,
  Sparkles
} from "lucide-react";
import { Product } from "../data";

interface CheckoutPromptModalProps {
  product: Product;
  qty: number;
  packaging: string;
  cart: { product: Product; quantity: number; packaging: string }[];
  onUpdateQty: (quantity: number) => void;
  onUpdatePackaging: (packaging: string) => void;
  onClose: () => void;
  onProceed: () => void;
}

export default function CheckoutPromptModal({
  product,
  qty,
  packaging,
  cart,
  onUpdateQty,
  onUpdatePackaging,
  onClose,
  onProceed
}: CheckoutPromptModalProps) {
  
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

  const currentPkgObj = PACKAGING_OPTIONS.find((p) => p.name === packaging) || PACKAGING_OPTIONS[0];
  const unitPrice = Math.max(8.0, product.price + currentPkgObj.priceDelta);
  const subtotal = unitPrice * qty;
  const taxRate = 0.0825;
  const estimatedTax = Math.round(subtotal * taxRate * 100) / 100;
  const deliverySurcharge = (product.ghsPictograms && product.ghsPictograms.length > 0) || (product.nfpa && product.nfpa.health >= 2) ? 15.00 : 0.00;
  const estimatedShipping = 15.00 + deliverySurcharge;
  const totalAmount = subtotal + estimatedTax + estimatedShipping;

  const handleDecrease = () => {
    if (qty > 1) {
      onUpdateQty(qty - 1);
    }
  };

  const handleIncrease = () => {
    if (qty < Math.min(10, product.stock)) {
      onUpdateQty(qty + 1);
    }
  };

  // Close modal when clicking on the backdrop
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center bg-slate-900/50 backdrop-blur-md z-50 p-2 sm:p-4 animate-fade-in font-sans"
      onClick={handleBackdropClick}
    >
      <div 
        className="w-full max-w-2xl max-h-[92vh] sm:max-h-[88vh] bg-white border border-slate-200/80 rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden flex flex-col relative animate-scale-up"
        id="add-to-cart-checkout-popup"
      >
        {/* Modal Close triggers */}
        <button 
          onClick={onClose}
          className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 cursor-pointer p-1 rounded-full hover:bg-slate-100 transition z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Dynamic header notification bar */}
        <div className="bg-emerald-50 border-b border-emerald-100 px-4 py-2.5 sm:px-6 sm:py-3.5 flex items-center gap-3 select-none shrink-0">
          <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center text-white shrink-0 shadow-sm">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-semibold text-emerald-900 font-heading flex items-center gap-1.5">
              Added to Cart! <Sparkles className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
            </h3>
            <p className="text-[10px] text-emerald-700 leading-snug">
              Securely allocated to your institutional checkout basket.
            </p>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
          
          {/* Main layout split - product info + options */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
            
            {/* Left Col: product card & details (5 Cols) */}
            <div className="md:col-span-5 bg-slate-50 rounded-xl border border-slate-100 p-3 space-y-3">
              <div className="aspect-square w-full rounded-lg bg-white border border-slate-150 overflow-hidden flex items-center justify-center p-2.5 max-h-[140px] md:max-h-none">
                <img 
                  src={product.image || "https://img.icons8.com/color/96/chemistry.png"} 
                  alt={product.name} 
                  className="max-h-full max-w-full object-contain filter drop-shadow-sm select-none"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-800 line-clamp-2 font-heading">{product.name}</h4>
                <div className="flex flex-wrap gap-1 mt-1 font-mono text-[9px]">
                  {product.formula && (
                    <span className="bg-slate-200/60 text-slate-600 px-1 py-0.5 rounded font-medium">
                      Formula: {product.formula}
                    </span>
                  )}
                  {product.cas && (
                    <span className="bg-blue-50 text-blue-600 px-1 py-0.5 rounded font-semibold border border-blue-100/30">
                      CAS: {product.cas}
                    </span>
                  )}
                </div>
              </div>

              {/* Chemical Compliance Warning */}
              {product.nfpa && product.nfpa.health >= 2 && (
                <div className="p-2 bg-amber-50 rounded-lg border border-amber-200/30 text-[9.5px] text-amber-800 flex gap-1.5 leading-snug select-none">
                  <Info className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                  <span>Licensed Hazmat. Requires certified institutional authorization cards inside transit.</span>
                </div>
              )}
            </div>

            {/* Right Col: quantity + packaging controls (7 Cols) */}
            <div className="md:col-span-7 space-y-4">
              
              {/* Product Quantity Control */}
              <div className="space-y-1.5">
                <label className="block text-[10px] uppercase tracking-wider text-slate-400 font-bold font-mono">
                  Order Quantity
                </label>
                <div className="flex items-center gap-2.5">
                  <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white">
                    <button 
                      onClick={handleDecrease}
                      disabled={qty <= 1}
                      className="p-1.5 px-2.5 text-slate-500 hover:bg-slate-50 hover:text-slate-800 disabled:opacity-40 disabled:hover:bg-transparent transition cursor-pointer"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-slate-800 font-mono select-none">
                      {qty}
                    </span>
                    <button 
                      onClick={handleIncrease}
                      disabled={qty >= Math.min(10, product.stock)}
                      className="p-1.5 px-2.5 text-slate-500 hover:bg-slate-50 hover:text-slate-800 disabled:opacity-40 disabled:hover:bg-transparent transition cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Stock: <strong className="text-slate-600 font-bold">{product.stock} units</strong>
                  </span>
                </div>
              </div>

              {/* Safety Containment Selector */}
              <div className="space-y-1.5">
                <label className="block text-[10px] uppercase tracking-wider text-slate-400 font-bold font-mono">
                  Safety Containment Type
                </label>
                <div className="space-y-1.5">
                  {PACKAGING_OPTIONS.map((opt) => (
                    <div 
                      key={opt.name}
                      onClick={() => onUpdatePackaging(opt.name)}
                      className={`p-2.5 rounded-lg border cursor-pointer flex items-start justify-between gap-2.5 text-left hover:border-slate-300 transition-all ${
                        packaging === opt.name 
                          ? "border-blue-600 bg-blue-50/20" 
                          : "border-slate-200 bg-white"
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <input 
                          type="radio" 
                          checked={packaging === opt.name}
                          readOnly
                          className="mt-0.5 accent-blue-600 cursor-pointer"
                        />
                        <div>
                          <div className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                            {opt.name}
                          </div>
                          <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">
                            {opt.desc}
                          </p>
                        </div>
                      </div>
                      <span className="text-[9px] font-bold font-mono whitespace-nowrap px-1.5 py-0.5 bg-slate-100 rounded text-slate-600">
                        {opt.priceDelta === 0 ? "Base" : opt.priceDelta > 0 ? `+$${opt.priceDelta.toFixed(2)}` : `-$${Math.abs(opt.priceDelta).toFixed(2)}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>

          {/* Secure Purchase pricing summary */}
          <div className="border-t border-slate-100 pt-3 space-y-2">
            <h4 className="text-[9px] font-bold uppercase tracking-wider text-slate-400 font-mono select-none">
              Financial Subelement Breakdown
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 bg-slate-50 rounded-xl p-3 border border-slate-150">
              <div className="space-y-0.5">
                <span className="text-[9px] text-slate-450">Unit Price</span>
                <div className="text-xs font-bold font-mono text-slate-800">${unitPrice.toFixed(2)}</div>
              </div>
              <div className="space-y-0.5">
                <span className="text-[9px] text-slate-450">Subtotal</span>
                <div className="text-xs font-bold font-mono text-slate-800">${subtotal.toFixed(2)}</div>
              </div>
              <div className="space-y-0.5">
                <span className="text-[9px] text-slate-450">Tax (8.25%)</span>
                <div className="text-xs font-bold font-mono text-slate-800">${estimatedTax.toFixed(2)}</div>
              </div>
              <div className="space-y-0.5">
                <span className="text-[9px] text-slate-450">Est. Delivery</span>
                <div className="text-xs font-bold font-mono text-slate-800">${estimatedShipping.toFixed(2)}</div>
              </div>
            </div>
            <div className="flex items-center justify-between px-1.5 select-none text-right">
              <span className="text-xs text-slate-500">Projected Item Cost</span>
              <div className="text-base font-black text-slate-900 font-mono">
                ${totalAmount.toFixed(2)}
              </div>
            </div>
          </div>

        </div>

        {/* Buttons Action Bar */}
        <div className="bg-slate-50/80 border-t border-slate-200/80 px-4 py-3 sm:px-6 sm:py-4 flex flex-col sm:flex-row gap-2 shrink-0">
          <button 
            type="button"
            onClick={onClose}
            className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-slate-600 font-medium font-sans hover:bg-slate-100 transition cursor-pointer text-[11px] uppercase tracking-wider text-center"
          >
            Continue Shopping
          </button>
          
          <button 
            type="button"
            onClick={onProceed}
            className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg flex items-center justify-center gap-1.5 shadow-sm transition active:scale-98 cursor-pointer text-[11px] uppercase tracking-wider"
          >
            <Lock className="w-3.5 h-3.5 text-blue-200 shrink-0" />
            Proceed to Secure Checkout
            <ArrowRight className="w-3.5 h-3.5 shrink-0" />
          </button>
        </div>

      </div>
    </div>
  );
}
