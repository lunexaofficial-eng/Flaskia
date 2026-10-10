import React, { useState, useEffect } from "react";
import { X, Send, CheckCircle2, Phone, Mail, MapPin, Package, ShieldCheck, MessageCircle, AlertCircle, ExternalLink, Atom, Scale, Info, Plus, Minus, Calculator } from "lucide-react";
import { Product } from "../data";
import { useCurrency } from "../context/CurrencyContext";
import { getProxiedImageUrl } from "../utils/imageUtils";

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
    <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-hidden animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full max-h-[92vh] sm:max-h-[88vh] overflow-hidden shadow-xl transition-all flex flex-col my-auto">
        
        {/* Clean Header */}
        <div className="shrink-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight font-heading">
              Product Inquiry & Bulk Quotation
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Submit your institutional or wholesale inquiry for direct pricing
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center transition cursor-pointer shrink-0 ml-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submittedId ? (
          /* Confirmation State (Scrollable) */
          <div className="flex-1 overflow-y-auto p-6 sm:p-8 text-center space-y-6 animate-scale-up">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto ${
              wasWhatsappSent ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-700"
            }`}>
              <CheckCircle2 className="w-8 h-8" />
            </div>
            
            <div className="space-y-1.5">
              <p className="text-xs text-slate-400 font-mono">
                Reference #{submittedId}
              </p>
              <h2 className="text-xl font-bold text-slate-900 font-heading">
                {wasWhatsappSent ? "Redirected to WhatsApp" : "Inquiry Logged"}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
                {wasWhatsappSent ? (
                  <>Your inquiry for <strong className="text-slate-800">{product.name}</strong> has been prepared for WhatsApp.</>
                ) : (
                  <>Thank you{buyerName ? ` ${buyerName}` : ""}. Your quotation request for <strong className="text-slate-800">{product.name}</strong> ({quantityString}) has been saved.</>
                )}
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 text-left space-y-2 text-xs text-slate-700 font-mono">
              <div className="flex justify-between border-b border-slate-200/70 pb-2">
                <span className="text-slate-500">Product:</span>
                <span className="font-semibold text-slate-900 truncate max-w-[200px] sm:max-w-none">{product.name}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/70 pb-2">
                <span className="text-slate-500">Unit Price:</span>
                <span className="font-semibold text-slate-900">{unitPriceFormatted} / {product.unit}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/70 pb-2">
                <span className="text-slate-500">Quantity:</span>
                <span className="font-semibold text-slate-900">{quantityString}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/70 pb-2">
                <span className="text-slate-700 font-semibold">Estimated Total ({currency}):</span>
                <span className="font-bold text-[#0052cc] text-sm">{totalPriceFormatted}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">CAS Registry:</span>
                <span className="font-semibold">{product.cas || "N/A"}</span>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap justify-center gap-3">
              {wasWhatsappSent && (
                <a
                  href={buildWhatsappUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#0052cc] hover:bg-[#0747a6] text-white font-semibold text-xs px-5 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Open WhatsApp Chat</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
              <button
                onClick={handleReset}
                className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-5 py-2.5 rounded-xl transition cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* Form State (Scrollable Body) */
          <form onSubmit={handleWebRfqSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
            
            {/* Selected Product Strip */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5 min-w-0 w-full sm:w-auto">
                <img
                  src={getProxiedImageUrl(product.image)}
                  alt={product.name}
                  className="w-14 h-14 object-cover rounded-lg border border-slate-200 shrink-0 bg-white"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-slate-900 leading-tight font-heading truncate">
                    {product.name}
                  </h4>
                  <p className="text-xs text-slate-500 font-mono mt-1">
                    {product.cas ? `CAS ${product.cas} • ` : ""}{product.purity || "ACS Grade"} • {unitPriceFormatted} / {product.unit || "unit"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleWhatsappSubmit()}
                className="w-full sm:w-auto shrink-0 bg-[#0052cc] hover:bg-[#0747a6] text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.99]"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Direct WhatsApp</span>
              </button>
            </div>

            {/* Interactive Quantity & Price Calculation System */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                  <Calculator className="w-4 h-4 text-[#0052cc]" />
                  <span>Quantity & Estimated Total</span>
                </label>
                <span className="text-xs text-slate-500 font-mono">
                  Currency: {currency}
                </span>
              </div>

              {/* Stepper + Quick Presets */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setQuantityCount(Math.max(1, quantityCount - 1))}
                    className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 flex items-center justify-center transition cursor-pointer"
                    title="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
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
                    className="w-16 text-center font-semibold text-sm py-1 rounded-lg border border-slate-200 bg-white text-slate-900 outline-none focus:border-[#0052cc] font-mono"
                  />

                  <button
                    type="button"
                    onClick={() => setQuantityCount(quantityCount + 1)}
                    className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 flex items-center justify-center transition cursor-pointer"
                    title="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>

                  <span className="text-xs text-slate-500 font-mono">
                    {product.unit || "Pack"}{quantityCount > 1 ? "s" : ""}
                  </span>
                </div>

                {/* Quick Selection Pills */}
                <div className="flex flex-wrap items-center gap-1.5">
                  {[1, 5, 10, 25, 50].map((qty) => (
                    <button
                      key={qty}
                      type="button"
                      onClick={() => setQuantityCount(qty)}
                      className={`text-xs font-medium px-2.5 py-1 rounded-lg transition cursor-pointer font-mono ${
                        quantityCount === qty
                          ? "bg-[#0052cc] text-white"
                          : "bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200"
                      }`}
                    >
                      {qty}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Calculation Summary Display */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 font-mono text-xs">
                <span className="text-slate-500">
                  {quantityString} × {unitPriceFormatted}
                </span>
                <span className="text-sm font-bold text-[#0052cc]">
                  Total: {totalPriceFormatted}
                </span>
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
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">
                  Your Name / Organization
                </label>
                <input
                  type="text"
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  placeholder="Name or Institution"
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:border-[#0052cc] outline-none bg-white text-slate-900"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">
                  Mobile / WhatsApp Number
                </label>
                <input
                  type="tel"
                  value={buyerPhone}
                  onChange={(e) => setBuyerPhone(e.target.value)}
                  placeholder="+1 (555) 019-2834"
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:border-[#0052cc] outline-none bg-white text-slate-900"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">
                  Email Address
                </label>
                <input
                  type="email"
                  value={buyerEmail}
                  onChange={(e) => setBuyerEmail(e.target.value)}
                  placeholder="procurement@company.com"
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:border-[#0052cc] outline-none bg-white text-slate-900"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">
                  Delivery Location / Postal Code
                </label>
                <input
                  type="text"
                  value={deliveryPincode}
                  onChange={(e) => setDeliveryPincode(e.target.value)}
                  placeholder="City or Postal Code"
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:border-[#0052cc] outline-none bg-white text-slate-900"
                />
              </div>
            </div>

            {/* Requirement Notes */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700">
                Additional Notes (Optional)
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Specify grade, packaging, or delivery requirements..."
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:border-[#0052cc] outline-none bg-white text-slate-900"
              />
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
              <button
                type="submit"
                disabled={loading}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs px-4 py-2.5 rounded-xl transition cursor-pointer border border-slate-200"
              >
                Submit Web RFQ
              </button>

              <button
                type="button"
                disabled={loading}
                onClick={() => handleWhatsappSubmit()}
                className="bg-[#0052cc] hover:bg-[#0747a6] text-white font-semibold text-xs px-5 py-2.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{loading ? "Connecting..." : "Send via WhatsApp"}</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
