import React, { useState } from "react";
import { X, Send, CheckCircle2, Building2, Phone, Mail, MapPin, Package, ShieldCheck, Sparkles, AlertCircle } from "lucide-react";
import { Product } from "../data";

interface IndiamartInquiryModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  defaultQty?: number;
}

export default function IndiamartInquiryModal({
  product,
  isOpen,
  onClose,
  defaultQty = 1,
}: IndiamartInquiryModalProps) {
  if (!isOpen || !product) return null;

  const [quantity, setQuantity] = useState(`${defaultQty} ${product.unit || 'Pack'}`);
  const [buyerName, setBuyerName] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [deliveryPincode, setDeliveryPincode] = useState("");
  const [notes, setNotes] = useState(`Kindly send the best bulk quotation and Certificate of Analysis for ${product.name} (CAS ${product.cas || 'N/A'}).`);
  
  const [loading, setLoading] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!buyerName.trim() || !buyerEmail.trim() || !buyerPhone.trim()) {
      setError("Please fill in your Name, Email ID, and Mobile Phone number.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          productName: product.name,
          productImage: product.image,
          price: `$${product.price} / ${product.unit}`,
          quantity,
          buyerName,
          buyerEmail,
          buyerPhone,
          companyName,
          deliveryPincode,
          notes,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to send inquiry");
      }

      setSubmittedId(data.inquiryId || `INQ-${Date.now()}`);
    } catch (err: any) {
      setError(err.message || "Network error submitting inquiry");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSubmittedId(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl transition-all my-8">
        
        {/* Top Header Banner - IndiaMART Style B2B Branding */}
        <div className="bg-gradient-to-r from-[#2e7d32] via-[#00a699] to-[#1b5e20] text-white p-5 flex items-center justify-between relative overflow-hidden">
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-white font-extrabold text-lg">
              ₹
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] bg-emerald-400 text-slate-950 font-black px-2 py-0.5 rounded uppercase tracking-wider">
                  IndiaMART B2B Verified RFQ
                </span>
                <span className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded font-mono">
                  Verified Supplier Direct
                </span>
              </div>
              <h3 className="text-lg font-extrabold tracking-tight mt-0.5 font-sans">
                Request Best Price & Quotation
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submittedId ? (
          /* Confirmation State */
          <div className="p-8 text-center space-y-6 animate-scale-up">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            
            <div className="space-y-2">
              <span className="text-xs bg-emerald-50 text-emerald-700 font-mono font-bold px-3 py-1 rounded-full border border-emerald-200">
                INQUIRY REF #: {submittedId}
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 font-sans">
                Requirement Sent to OEM Direct
              </h2>
              <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                Thank you <strong className="text-slate-900">{buyerName}</strong>. Your B2B quotation request for <strong className="text-emerald-700">{product.name}</strong> ({quantity}) has been registered with verified suppliers.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left space-y-2 text-xs text-slate-700">
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500 font-mono">Product Name:</span>
                <span className="font-bold">{product.name}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500 font-mono">CAS Number:</span>
                <span className="font-bold">{product.cas || "N/A"}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500 font-mono">Contact Phone:</span>
                <span className="font-bold">{buyerPhone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-mono">Guaranteed Response:</span>
                <span className="font-bold text-emerald-700">Within 2 Business Hours</span>
              </div>
            </div>

            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={handleReset}
                className="bg-[#2e7d32] hover:bg-[#1b5e20] text-white font-extrabold text-xs px-6 py-3 rounded-xl transition shadow-md cursor-pointer uppercase tracking-wider"
              >
                Close & Continue Browsing
              </button>
            </div>
          </div>
        ) : (
          /* Form State */
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            
            {/* Selected Product Card Banner */}
            <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-xl p-3.5 flex items-center gap-4">
              <img
                src={product.image}
                alt={product.name}
                className="w-16 h-16 object-cover rounded-lg border border-slate-200 shrink-0 bg-white shadow-xs"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=200";
                }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded font-mono">
                    ID: {product.id}
                  </span>
                  <span className="text-[10px] font-bold text-slate-600 bg-white border border-slate-200 px-2 py-0.5 rounded">
                    CAS: {product.cas || "N/A"}
                  </span>
                </div>
                <h4 className="text-sm font-extrabold text-slate-900 truncate mt-0.5 font-sans">
                  {product.name}
                </h4>
                <div className="flex items-center gap-3 text-xs text-slate-600 mt-0.5 font-mono">
                  <span>Purity: <strong className="text-slate-900">{product.purity || "ACS Grade"}</strong></span>
                  <span>Est. Price: <strong className="text-emerald-700">${product.price}/{product.unit}</strong></span>
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
              {/* Requirement Quantity */}
              <div className="space-y-1">
                <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider font-mono flex items-center gap-1">
                  <Package className="w-3.5 h-3.5 text-emerald-600" />
                  Quantity Needed <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="e.g. 50 kg, 100 bottles"
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none bg-white font-semibold text-slate-900"
                />
              </div>

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
                  Buyer Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  placeholder="Your Full Name"
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none bg-white font-medium text-slate-900"
                />
              </div>

              {/* Mobile Phone */}
              <div className="space-y-1">
                <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider font-mono flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={buyerPhone}
                  onChange={(e) => setBuyerPhone(e.target.value)}
                  placeholder="+1 (555) 019-2834"
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none bg-white font-medium text-slate-900"
                />
              </div>

              {/* Business Email */}
              <div className="space-y-1">
                <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider font-mono flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-emerald-600" />
                  Business Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={buyerEmail}
                  onChange={(e) => setBuyerEmail(e.target.value)}
                  placeholder="procurement@company.com"
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none bg-white font-medium text-slate-900"
                />
              </div>

              {/* Company / Institution */}
              <div className="space-y-1">
                <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider font-mono flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                  Company / Institution Name
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Lab Solutions Inc."
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none bg-white text-slate-900"
                />
              </div>
            </div>

            {/* Requirement Notes */}
            <div className="space-y-1">
              <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider font-mono">
                Specific Specifications / Delivery Notes
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Mention any custom purity, CoA requirement, or target price..."
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none bg-white text-slate-900"
              />
            </div>

            {/* Bottom Actions */}
            <div className="pt-2 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-mono">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>IndiaMART 100% Buyer Contact Privacy Protected</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto bg-gradient-to-r from-[#2e7d32] to-[#00a699] hover:from-[#1b5e20] hover:to-[#00897b] text-white font-extrabold text-xs px-8 py-3 rounded-xl transition cursor-pointer flex items-center justify-center gap-2 shadow-md uppercase tracking-wider active:scale-98"
              >
                {loading ? (
                  <span>Submitting RFQ...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Inquiry Now</span>
                  </>
                )}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
