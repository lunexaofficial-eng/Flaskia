import React, { useState, useEffect } from "react";
import { X, Send, CheckCircle2, Phone, Mail, MapPin, Package, ShieldCheck, MessageCircle, AlertCircle, ExternalLink, Atom, Scale, Info, Plus, Minus, Calculator } from "lucide-react";
import { Product } from "../data";
import { useCurrency } from "../context/CurrencyContext";

interface IndiamartInquiryModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  defaultQty?: number;
  whatsappNumber?: string;
  appName?: string;
  onSuccess?: () => void;
}

export default function IndiamartInquiryModal({
  product,
  isOpen,
  onClose,
  defaultQty = 1,
  whatsappNumber = "15099941048",
  appName = "Flaskia",
  onSuccess,
}: IndiamartInquiryModalProps) {
  const { formatPrice, currencySymbol, currency } = useCurrency();
  const [quantityCount, setQuantityCount] = useState<number>(defaultQty || 1);
  const [buyerName, setBuyerName] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");
  const [deliveryPincode, setDeliveryPincode] = useState("");
  const [notes, setNotes] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [wasWhatsappSent, setWasWhatsappSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync state whenever product or defaultQty or isOpen changes
  useEffect(() => {
    if (product && isOpen) {
      setQuantityCount(defaultQty > 0 ? defaultQty : 1);
      setNotes(`Kindly send the best bulk quotation and Certificate of Analysis for ${product.name} (CAS: ${product.cas || 'N/A'}, Weight/MW: ${product.molecularWeight || 'N/A'}).`);
      setSubmittedId(null);
      setWasWhatsappSent(false);
      setError(null);
    }
  }, [product?.id, isOpen, defaultQty]);

  if (!isOpen || !product) return null;

  const unitPriceFormatted = formatPrice(product.price);
  const totalPriceFormatted = formatPrice(product.price * Math.max(1, quantityCount));
  const quantityString = `${quantityCount} ${product.unit || 'Pack'}${quantityCount > 1 ? 's' : ''}`;

  const buildWhatsappUrl = (overrideNotes?: string) => {
    const cleanPhone = whatsappNumber.replace(/[^0-9]/g, "");
    const textMsg = `*NEW PRODUCT ENQUIRY* 🧪
------------------------------------
📦 *Product Name:* ${product.name}
🆔 *Product ID:* ${product.id}
🧪 *CAS Registry:* ${product.cas || "N/A"}
⚗️ *Formula:* ${product.formula || "N/A"}
⚖️ *Molecular Weight:* ${product.molecularWeight || "N/A"}
🔬 *Purity & Grade:* ${product.purity || "ACS Grade"} | ${product.grade || "Technical"} Grade
🏷️ *Price per Unit:* ${unitPriceFormatted} / ${product.unit || "unit"}
📊 *Quantity Requested:* ${quantityString}
💰 *Total Calculated Price:* ${totalPriceFormatted} (${currency})
📝 *Description:* ${product.description || "N/A"}
🖼️ *Product Image:* ${product.image}
------------------------------------
*BUYER DETAILS:*
📍 *Delivery Location/Zip:* ${deliveryPincode || "Not Specified"}
👤 *Buyer Name:* ${buyerName || "Prospect Buyer"}
📞 *Phone:* ${buyerPhone || "Not Provided"}
✉️ *Email:* ${buyerEmail || "Not Provided"}
💬 *Notes/Requirement:* ${overrideNotes || notes || "Requesting formal quotation and COA."}

_Sent via ${appName} Marketplace Inquiry Portal_`;

    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(textMsg)}`;
  };

  const handleSaveToDb = async () => {
    const res = await fetch("/api/inquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId: product.id,
        productName: product.name,
        productImage: product.image,
        price: `${unitPriceFormatted} / ${product.unit}`,
        quantity: quantityString,
        totalPrice: totalPriceFormatted,
        currency,
        buyerName: buyerName || "WhatsApp Customer",
        buyerEmail: buyerEmail || "whatsapp@customer.com",
        buyerPhone,
        deliveryPincode,
        notes,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Failed to log inquiry");
    }
    if (onSuccess) {
      onSuccess();
    }
    return data.inquiryId || `INQ-${Date.now()}`;
  };

  const handleWhatsappSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);

    setLoading(true);
    try {
      const inqId = await handleSaveToDb();
      setSubmittedId(inqId);
      setWasWhatsappSent(true);

      // Open WhatsApp Direct Link
      const waUrl = buildWhatsappUrl();
      window.open(waUrl, "_blank", "noopener,noreferrer");
    } catch (err: any) {
      setError(err.message || "Could not log inquiry, but opening WhatsApp...");
      // Fallback open WhatsApp anyway so customer request is never lost
      window.open(buildWhatsappUrl(), "_blank", "noopener,noreferrer");
    } finally {
      setLoading(false);
    }
  };

  const handleWebRfqSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!buyerName.trim() || !buyerEmail.trim() || !buyerPhone.trim()) {
      setError("Please fill in your Name, Email ID, and Mobile Phone number.");
      return;
    }

    setLoading(true);
    try {
      const inqId = await handleSaveToDb();
      setSubmittedId(inqId);
      setWasWhatsappSent(false);
    } catch (err: any) {
      setError(err.message || "Network error submitting inquiry");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSubmittedId(null);
    setWasWhatsappSent(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-hidden animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full max-h-[92vh] sm:max-h-[88vh] overflow-hidden shadow-2xl transition-all flex flex-col my-auto">
        
        {/* Top Header Banner - IndiaMART Style B2B Branding (Fixed/Shrink-0) */}
        <div className="shrink-0 bg-gradient-to-r from-[#2e7d32] via-[#00a699] to-[#1b5e20] text-white p-4 sm:p-5 flex items-center justify-between relative overflow-hidden">
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-white font-extrabold text-base sm:text-lg shrink-0">
              💬
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] bg-emerald-400 text-slate-950 font-black px-2 py-0.5 rounded uppercase tracking-wider">
                  WhatsApp Direct Inquiry
                </span>
                <span className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded font-mono hidden sm:inline-block">
                  Verified Supplier
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-extrabold tracking-tight mt-0.5 font-sans">
                Product Inquiry & Quotation
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center transition cursor-pointer shrink-0 ml-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submittedId ? (
          /* Confirmation State (Scrollable) */
          <div className="flex-1 overflow-y-auto p-6 sm:p-8 text-center space-y-6 animate-scale-up">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto shadow-inner ${
              wasWhatsappSent ? "bg-emerald-100 text-emerald-600" : "bg-blue-100 text-blue-600"
            }`}>
              <CheckCircle2 className="w-10 h-10" />
            </div>
            
            <div className="space-y-2">
              <span className="text-xs bg-emerald-50 text-emerald-700 font-mono font-bold px-3 py-1 rounded-full border border-emerald-200">
                INQUIRY REF #: {submittedId}
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-sans">
                {wasWhatsappSent ? "Redirected to Admin WhatsApp!" : "Requirement Logged with Admin"}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                {wasWhatsappSent ? (
                  <>Your product details and inquiry for <strong className="text-emerald-700">{product.name}</strong> have been pre-filled for WhatsApp. If WhatsApp did not open automatically, click the button below.</>
                ) : (
                  <>Thank you <strong className="text-slate-900">{buyerName}</strong>. Your quotation request for <strong className="text-emerald-700">{product.name}</strong> ({quantityString}) has been saved in our system.</>
                )}
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left space-y-2 text-xs text-slate-700 font-mono">
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Product Name:</span>
                <span className="font-bold text-slate-900 truncate max-w-[200px] sm:max-w-none">{product.name}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Product ID:</span>
                <span className="font-bold text-slate-900">{product.id}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Unit Price:</span>
                <span className="font-bold text-slate-900">{unitPriceFormatted} / {product.unit}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Requested Quantity:</span>
                <span className="font-bold text-slate-900">{quantityString}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2 bg-emerald-50 p-1.5 rounded-lg border-emerald-200">
                <span className="text-emerald-800 font-bold">Total Estimated Price ({currency}):</span>
                <span className="font-extrabold text-emerald-700 text-sm">{totalPriceFormatted}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">CAS Registry:</span>
                <span className="font-bold">{product.cas || "N/A"}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Molecular Weight:</span>
                <span className="font-bold">{product.molecularWeight || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">WhatsApp Help Line:</span>
                <span className="font-bold text-emerald-700">+{whatsappNumber}</span>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap justify-center gap-3">
              {wasWhatsappSent && (
                <a
                  href={buildWhatsappUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-6 py-3 rounded-xl transition shadow-md cursor-pointer flex items-center gap-2 uppercase tracking-wider"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Re-open WhatsApp Chat</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
              <button
                onClick={handleReset}
                className="bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs px-6 py-3 rounded-xl transition cursor-pointer uppercase tracking-wider"
              >
                Close & Continue Browsing
              </button>
            </div>
          </div>
        ) : (
          /* Form State (Scrollable Body) */
          <form onSubmit={handleWebRfqSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-5">
            
            {/* Selected Product Card Banner with Complete Details & WhatsApp Quick Button */}
            <div className="bg-emerald-50/80 border border-emerald-200/90 rounded-xl p-4 space-y-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3.5 min-w-0 w-full sm:w-auto">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl border border-slate-200 shrink-0 bg-white shadow-xs"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=200";
                    }}
                  />
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded font-mono">
                        ID: {product.id}
                      </span>
                      <span className="text-[10px] font-bold text-slate-700 bg-white border border-slate-200 px-2 py-0.5 rounded font-mono">
                        CAS: {product.cas || "N/A"}
                      </span>
                      {product.formula && (
                        <span className="text-[10px] font-bold text-blue-800 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded font-mono">
                          {product.formula}
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm sm:text-base font-extrabold text-slate-900 leading-tight font-sans">
                      {product.name}
                    </h4>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-700 font-mono">
                      <span>Purity: <strong className="text-slate-900">{product.purity || "ACS Grade"}</strong></span>
                      <span>Grade: <strong className="text-slate-900">{product.grade || "Technical"}</strong></span>
                      <span>Weight/MW: <strong className="text-slate-900">{product.molecularWeight || "N/A"}</strong></span>
                      <span>Unit Price: <strong className="text-emerald-700">{unitPriceFormatted} / {product.unit || "unit"}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Instant 1-Click WhatsApp Quick Action */}
                <button
                  type="button"
                  onClick={() => handleWhatsappSubmit()}
                  className="w-full sm:w-auto shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black px-4 py-2.5 rounded-xl shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider active:scale-95 border border-emerald-400/30"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>1-Click WhatsApp Inquiry</span>
                </button>
              </div>

              {/* Short Description */}
              {product.description && (
                <div className="bg-white/80 border border-emerald-100 p-2.5 rounded-lg text-xs text-slate-600 leading-relaxed font-sans flex items-start gap-1.5">
                  <Info className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <p className="line-clamp-2">{product.description}</p>
                </div>
              )}
            </div>

            {/* Interactive Quantity & Price Calculation System */}
            <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-slate-50 border-2 border-emerald-500/30 rounded-2xl p-4 sm:p-5 space-y-3 shadow-sm">
              <div className="flex items-center justify-between border-b border-emerald-200/60 pb-2">
                <label className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <Calculator className="w-4 h-4 text-emerald-600" />
                  <span>Quantity Selection & Live Price Calculation</span>
                </label>
                <span className="text-[10px] bg-emerald-600 text-white font-extrabold px-2 py-0.5 rounded font-mono uppercase">
                  {currency} Live Conversion
                </span>
              </div>

              {/* Stepper + Quick Presets */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                {/* Plus / Minus Counter */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setQuantityCount(Math.max(1, quantityCount - 1))}
                    className="w-9 h-9 rounded-xl bg-white border-2 border-emerald-300 hover:border-emerald-600 hover:bg-emerald-50 text-emerald-800 flex items-center justify-center transition cursor-pointer font-bold shadow-xs active:scale-95"
                    title="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>

                  <input
                    type="number"
                    min="1"
                    max="1000"
                    value={quantityCount}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      setQuantityCount(isNaN(val) || val < 1 ? 1 : val);
                    }}
                    className="w-20 text-center font-extrabold text-sm py-1.5 rounded-xl border-2 border-emerald-400 bg-white text-slate-900 outline-none focus:ring-2 focus:ring-emerald-500 font-mono shadow-inner"
                  />

                  <button
                    type="button"
                    onClick={() => setQuantityCount(quantityCount + 1)}
                    className="w-9 h-9 rounded-xl bg-white border-2 border-emerald-300 hover:border-emerald-600 hover:bg-emerald-50 text-emerald-800 flex items-center justify-center transition cursor-pointer font-bold shadow-xs active:scale-95"
                    title="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>

                  <span className="text-xs font-bold text-slate-700 font-mono">
                    {product.unit || "Pack"}{quantityCount > 1 ? "s" : ""}
                  </span>
                </div>

                {/* Quick Selection Pills */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase font-mono mr-1">Quick Select:</span>
                  {[1, 2, 3, 5, 10, 25, 50].map((qty) => (
                    <button
                      key={qty}
                      type="button"
                      onClick={() => setQuantityCount(qty)}
                      className={`text-xs font-bold px-2.5 py-1 rounded-lg transition cursor-pointer font-mono ${
                        quantityCount === qty
                          ? "bg-emerald-600 text-white shadow-xs"
                          : "bg-white hover:bg-emerald-100 text-slate-700 border border-slate-200"
                      }`}
                    >
                      {qty}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Calculation Summary Display */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-emerald-200/60 font-mono">
                <div className="bg-white/90 p-2.5 rounded-xl border border-emerald-100 text-left">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Unit Price</div>
                  <div className="text-xs font-black text-slate-900 mt-0.5">{unitPriceFormatted}</div>
                </div>

                <div className="bg-white/90 p-2.5 rounded-xl border border-emerald-100 text-left">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Total Units</div>
                  <div className="text-xs font-black text-emerald-800 mt-0.5">{quantityString}</div>
                </div>

                <div className="bg-emerald-600 text-white p-2.5 rounded-xl border border-emerald-700 text-left shadow-xs">
                  <div className="text-[10px] uppercase font-bold text-emerald-100">Total Calculated Price</div>
                  <div className="text-sm font-black text-white mt-0.5">{totalPriceFormatted}</div>
                </div>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Form Fields Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Delivery Pincode */}
              <div className="space-y-1">
                <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider font-mono flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  Delivery Location / Zip
                </label>
                <input
                  type="text"
                  value={deliveryPincode}
                  onChange={(e) => setDeliveryPincode(e.target.value)}
                  placeholder="Pincode or City (e.g. 10001, New York)"
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none bg-white text-slate-900"
                />
              </div>

              {/* Buyer Full Name */}
              <div className="space-y-1">
                <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider font-mono">
                  Your Name / Institution
                </label>
                <input
                  type="text"
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  placeholder="Your Name / Organization"
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none bg-white font-medium text-slate-900"
                />
              </div>

              {/* Mobile Phone */}
              <div className="space-y-1">
                <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider font-mono flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  Mobile / WhatsApp Number
                </label>
                <input
                  type="tel"
                  value={buyerPhone}
                  onChange={(e) => setBuyerPhone(e.target.value)}
                  placeholder="+1 (555) 019-2834"
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none bg-white font-medium text-slate-900"
                />
              </div>

              {/* Business Email */}
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider font-mono flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-emerald-600" />
                  Email Address
                </label>
                <input
                  type="email"
                  value={buyerEmail}
                  onChange={(e) => setBuyerEmail(e.target.value)}
                  placeholder="procurement@company.com"
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none bg-white font-medium text-slate-900"
                />
              </div>
            </div>

            {/* Requirement Notes */}
            <div className="space-y-1">
              <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider font-mono">
                Specific Customization / Question / Delivery Notes
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ask anything about bulk pricing, CoA certificate, lead time, or custom purity..."
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none bg-white text-slate-900"
              />
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-mono">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Redirects direct to Admin WhatsApp</span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 sm:flex-initial bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs px-4 py-3 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 border border-slate-300"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Log Web RFQ</span>
                </button>

                <button
                  type="button"
                  disabled={loading}
                  onClick={() => handleWhatsappSubmit()}
                  className="flex-1 sm:flex-initial bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs px-6 py-3 rounded-xl transition cursor-pointer flex items-center justify-center gap-2 shadow-md uppercase tracking-wider active:scale-98"
                >
                  {loading ? (
                    <span>Connecting...</span>
                  ) : (
                    <>
                      <MessageCircle className="w-4 h-4 fill-white" />
                      <span>Send on WhatsApp</span>
                    </>
                  )}
                </button>
              </div>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
