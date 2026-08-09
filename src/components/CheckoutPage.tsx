import React, { useState } from "react";
import { Product } from "../data";
import PayPalPortal from "./PayPalPortal";
import { useTheme } from "../context/ThemeContext";
import { 
  Trash2, 
  Truck, 
  MapPin, 
  ShieldCheck, 
  CreditCard, 
  Briefcase, 
  AlertTriangle,
  FlaskConical,
  Award,
  CheckCircle,
  Lock,
  LogIn,
  UserPlus,
  ShieldAlert,
  Mail,
  Key,
  Loader2,
  Sparkles,
  Search,
  ChevronDown
} from "lucide-react";

import { COUNTRIES_DATA } from "../utils/globalLocationData";

export interface CartItem {
  product: Product;
  quantity: number;
  packaging: string;
}

interface CheckoutPageProps {
  cart: CartItem[];
  onUpdateQty: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onPaymentSuccess: (orderDetails: {
    orderId: string;
    payerEmail: string;
    paymentId: string;
    paymentMethodId?: string;
    paymentReference?: string;
    paymentProofUrl?: string;
    currency?: string;
    exchangeRate?: number;
    shippingDetails: {
      institution: string;
      researcher: string;
      room: string;
      city: string;
      state: string;
      zip: string;
      licenseId: string;
      address?: string;
      country?: string;
      email?: string;
      phone?: string;
      [key: string]: any;
    };
  }) => void;
  onBackToStore: () => void;
  homepageConfig?: any;
  currentUser?: any;
}

const defaultFields = [
  { id: "researcher", label: "Full Name", placeholder: "e.g. John Doe", type: "text", required: true, section: "credentials", options: [] },
  { id: "institution", label: "University / Science Lab", placeholder: "e.g. Stanford University Science Lab", type: "text", required: true, section: "credentials", options: [] },
  { id: "billingEmail", label: "Billing Contact Email", placeholder: "e.g. investigator@institution.org", type: "text", required: true, section: "contact", options: [] },
  { id: "billingPhone", label: "Phone Number", placeholder: "e.g. +1 (555) 019-2834", type: "text", required: true, section: "contact", options: [] },
  { id: "address", label: "Street Delivery Address", placeholder: "e.g. 350 Chemistry Drive", type: "text", required: true, section: "address", options: [] },
  { id: "room", label: "Street Delivery Address Line 2", placeholder: "e.g. Room 402B", type: "text", required: false, section: "address", options: [] },
  { id: "country", label: "Country", placeholder: "e.g. Germany", type: "text", required: true, section: "address", options: [], defaultValue: "Germany" },
  { id: "city", label: "City", placeholder: "e.g. Boston", type: "text", required: true, section: "address", options: [] },
  { id: "state", label: "State / Province", placeholder: "e.g. MA", type: "text", required: true, section: "address", options: [] },
  { id: "zip", label: "ZIP / Postal Code", placeholder: "e.g. 02115", type: "text", required: true, section: "address", options: [] }
];

export const getFieldsList = (homepageConfig: any) => {
  if (homepageConfig?.checkout_fields_json) {
    try {
      return JSON.parse(homepageConfig.checkout_fields_json);
    } catch (e) {
      // fallback
    }
  }
  return defaultFields;
};

export const getLedgerConfig = (homepageConfig: any) => {
  if (homepageConfig?.checkout_ledger_json) {
    try {
      return JSON.parse(homepageConfig.checkout_ledger_json);
    } catch (e) {
      // fallback
    }
  }
  return {
    transitFee: 25.00,
    transitFeeLabel: "Chemical Courier Dispatch Rate",
    hazmatSurcharge: 15.00,
    hazmatSurchargeLabel: "HazMat Class 9 Surcharge",
    taxRate: 8.25,
    taxRateLabel: "Regulatory Science Admin Tax (8.25%)",
    grandTotalLabel: "Grand Total (USD)",
    legalDisclaimerText: "I attest that the researcher is licensed for material logistics and will obey EPA Disposal guidelines.",
    paypalButtonText: "Secure PayPal Checkout",
    appreciationBadgeTitle: "Certified Laboratory Merchant",
    appreciationBadgeText: "Academic chemical registries verify our licensure indexes dynamically quarterly. Shipping handles storage and OSHA audit trails."
  };
};

export default function CheckoutPage({
  cart,
  onUpdateQty,
  onRemoveItem,
  onPaymentSuccess,
  onBackToStore,
  homepageConfig,
  currentUser
}: CheckoutPageProps) {
  const { isCyber } = useTheme();
  const [showPaypal, setShowPaypal] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<any>(null);
  const [paymentReference, setPaymentReference] = useState("");
  const [paymentProofUrl, setPaymentProofUrl] = useState("");
  const [isUploadingProof, setIsUploadingProof] = useState(false);
  const [billingSameAsShipping, setBillingSameAsShipping] = useState<boolean>(true);

  // Billing address OTP safety verification states
  const [checkoutBillingVerified, setCheckoutBillingVerified] = useState<boolean>(false);
  const [showCheckoutBillingOtpModal, setShowCheckoutBillingOtpModal] = useState<boolean>(false);
  const [checkoutBillingOtpCode, setCheckoutBillingOtpCode] = useState<string>("");
  const [enteredCheckoutBillingOtp, setEnteredCheckoutBillingOtp] = useState<string>("");
  const [checkoutBillingOtpError, setCheckoutBillingOtpError] = useState<string>("");
  const [sendingCheckoutBillingOtp, setSendingCheckoutBillingOtp] = useState<boolean>(false);
  const [showCheckoutCelebration, setShowCheckoutCelebration] = useState<boolean>(false);
  const [showTermsAlert, setShowTermsAlert] = useState<boolean>(false);
  const [exchangeRate, setExchangeRate] = React.useState<number>(83.50);

  React.useEffect(() => {
    fetch("https://open.er-api.com/v6/latest/USD")
      .then(res => res.json())
      .then(data => {
        if (data && data.rates && data.rates.INR) {
          const rate = data.rates.INR;
          setExchangeRate(rate);
          console.log("Real-time USD to INR exchange rate fetched: ", rate);
        }
      })
      .catch(err => {
        console.warn("Using fallback rate for USD-INR: 83.50", err);
      });
  }, []);

  React.useEffect(() => {
    fetch("/api/payment-methods")
      .then(res => res.json())
      .then(data => {
        const activeMethods = data.filter((m: any) => m.is_active);
        setPaymentMethods(activeMethods);
      })
      .catch(console.error);
  }, []);

  // Dynamic fields list
  const fields = getFieldsList(homepageConfig);
  const ledgerConfig = getLedgerConfig(homepageConfig);

  // Initial Form Data State Map
  const [formValues, setFormValues] = useState<Record<string, any>>(() => {
    const initial: Record<string, any> = {};
    fields.forEach((f: any) => {
      initial[f.id] = f.defaultValue !== undefined ? f.defaultValue : "";
    });
    // Initialize custom billing fields as well
    initial.billingAddress = "";
    initial.billingRoom = "";
    initial.billingCity = "";
    initial.billingState = "";
    initial.billingZip = "";
    initial.billingCountry = "";
    return initial;
  });

  // Global country & state selectors state variables
  const [shippingCountrySearch, setShippingCountrySearch] = useState("");
  const [shippingCountryDropdownOpen, setShippingCountryDropdownOpen] = useState(false);
  const [shippingStateSearch, setShippingStateSearch] = useState("");
  const [shippingStateDropdownOpen, setShippingStateDropdownOpen] = useState(false);

  const [billingCountrySearch, setBillingCountrySearch] = useState("");
  const [billingCountryDropdownOpen, setBillingCountryDropdownOpen] = useState(false);
  const [billingStateSearch, setBillingStateSearch] = useState("");
  const [billingStateDropdownOpen, setBillingStateDropdownOpen] = useState(false);

  const shippingCountryRef = React.useRef<HTMLDivElement>(null);
  const shippingStateRef = React.useRef<HTMLDivElement>(null);
  const billingCountryRef = React.useRef<HTMLDivElement>(null);
  const billingStateRef = React.useRef<HTMLDivElement>(null);

  // Sync typed searches from loaded formValues
  React.useEffect(() => {
    if (formValues.country && !shippingCountrySearch) {
      setShippingCountrySearch(formValues.country);
    }
    if (formValues.state && !shippingStateSearch) {
      setShippingStateSearch(formValues.state);
    }
    if (formValues.billingCountry && !billingCountrySearch) {
      setBillingCountrySearch(formValues.billingCountry);
    }
    if (formValues.billingState && !billingStateSearch) {
      setBillingStateSearch(formValues.billingState);
    }
  }, [formValues.country, formValues.state, formValues.billingCountry, formValues.billingState]);

  // Handle click outside to close dropdown windows
  React.useEffect(() => {
    function clickOutside(e: MouseEvent) {
      if (shippingCountryRef.current && !shippingCountryRef.current.contains(e.target as Node)) {
        setShippingCountryDropdownOpen(false);
      }
      if (shippingStateRef.current && !shippingStateRef.current.contains(e.target as Node)) {
        setShippingStateDropdownOpen(false);
      }
      if (billingCountryRef.current && !billingCountryRef.current.contains(e.target as Node)) {
        setBillingCountryDropdownOpen(false);
      }
      if (billingStateRef.current && !billingStateRef.current.contains(e.target as Node)) {
        setBillingStateDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", clickOutside);
    return () => document.removeEventListener("mousedown", clickOutside);
  }, []);

  // Filter lists in real-time
  const filteredShippingCountries = COUNTRIES_DATA.filter((c) =>
    c.name.toLowerCase().includes(shippingCountrySearch.toLowerCase())
  );
  const activeShippingCountry = COUNTRIES_DATA.find((c) =>
    c.name.toLowerCase() === (formValues.country || "").toLowerCase()
  );
  const activeShippingStates = activeShippingCountry ? activeShippingCountry.states : [];
  const filteredShippingStates = activeShippingStates.filter((s) =>
    s.toLowerCase().includes(shippingStateSearch.toLowerCase())
  );

  const filteredBillingCountries = COUNTRIES_DATA.filter((c) =>
    c.name.toLowerCase().includes(billingCountrySearch.toLowerCase())
  );
  const activeBillingCountry = COUNTRIES_DATA.find((c) =>
    c.name.toLowerCase() === (formValues.billingCountry || "").toLowerCase()
  );
  const activeBillingStates = activeBillingCountry ? activeBillingCountry.states : [];
  const filteredBillingStates = activeBillingStates.filter((s) =>
    s.toLowerCase().includes(billingStateSearch.toLowerCase())
  );

  // Automatically pre-populate default GHS checkout values from the authenticated user's profile
  React.useEffect(() => {
    if (currentUser) {
      setFormValues(prev => ({
        ...prev,
        researcher: currentUser.name || currentUser.displayName || prev.researcher || "",
        institution: currentUser.institution || prev.institution || "",
        licenseId: currentUser.licenseId || prev.licenseId || "",
        billingEmail: currentUser.email || prev.billingEmail || "",
        billingPhone: currentUser.phone || prev.billingPhone || "",
        address: currentUser.address || prev.address || "",
        room: currentUser.room || prev.room || "",
        country: currentUser.country || prev.country || "",
        city: currentUser.city || prev.city || "",
        state: currentUser.state || prev.state || "MA",
        zip: currentUser.zip || prev.zip || "",
        billingAddress: currentUser.billingAddress || prev.billingAddress || "",
        billingRoom: currentUser.billingRoom || prev.billingRoom || "",
        billingCity: currentUser.billingCity || prev.billingCity || "",
        billingState: currentUser.billingState || prev.billingState || "",
        billingZip: currentUser.billingZip || prev.billingZip || "",
        billingCountry: currentUser.billingCountry || prev.billingCountry || ""
      }));

      // Automatically uncheck "same as shipping" if they already set up a custom billing address
      if (currentUser.billingAddress && currentUser.billingAddress !== currentUser.address) {
        setBillingSameAsShipping(false);
      }
    }
  }, [currentUser]);

  const [agreesHazmatRule, setAgreesHazmatRule] = useState(false);

  // Cart financial formulations
  const subtotal = cart.reduce((acc, item) => {
    let delta = 0;
    if (item.packaging === "High-Density Polyethylene") {
      delta = -2.50;
    } else if (item.packaging === "Heavy-Duty Metal Canister") {
      delta = 4.00;
    }
    const elementPrice = Math.max(8.00, item.product.price + delta);
    return acc + (elementPrice * item.quantity);
  }, 0);

  // Chemical logistics standard: Hazardous materials require specialized transit shipping fees (HazMat cargo)
  const containsHazard = cart.some(item => 
    item.product.ghsPictograms && item.product.ghsPictograms.some(p => p !== "safe")
  );

  const transitFee = subtotal > 0 ? Number(ledgerConfig.transitFee || 25.00) : 0.00;
  const hazmatSurcharge = containsHazard ? Number(ledgerConfig.hazmatSurcharge || 15.00) : 0.00;
  const taxPercent = Number(ledgerConfig.taxRate !== undefined ? ledgerConfig.taxRate : 8.25);
  const taxes = subtotal * (taxPercent / 100);
  const grandTotal = subtotal + hazmatSurcharge + transitFee + taxes;

  const isINR = selectedPaymentMethod && (selectedPaymentMethod.type === 'manual' || selectedPaymentMethod.type === 'crypto');

  const formatAmount = (valUSD: number) => {
    if (isINR) {
      const converted = valUSD * exchangeRate;
      return `₹${converted.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return `$${valUSD.toFixed(2)}`;
  };

  const handleProofUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingProof(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload-public", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.url) {
        setPaymentProofUrl(data.url);
      } else {
        alert(data.error || "Failed to upload proof");
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setIsUploadingProof(false);
    }
  };

  const handleRequestCheckoutBillingOtp = () => {
    setSendingCheckoutBillingOtp(true);
    setShowCheckoutBillingOtpModal(true);
    setCheckoutBillingOtpError("");
    setEnteredCheckoutBillingOtp("");

    setTimeout(() => {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setCheckoutBillingOtpCode(code);
      setSendingCheckoutBillingOtp(false);
    }, 700);
  };

  const commitCheckoutBillingVerified = () => {
    setShowCheckoutBillingOtpModal(false);
    setCheckoutBillingVerified(true);
    setShowCheckoutCelebration(true);
  };

  const initiatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    if (!agreesHazmatRule) {
      setShowTermsAlert(true);
      return;
    }
    setShowTermsAlert(false);

    if (!billingSameAsShipping && !checkoutBillingVerified) {
      handleRequestCheckoutBillingOtp();
      return;
    }
    
    if (selectedPaymentMethod && (selectedPaymentMethod.type === 'manual' || selectedPaymentMethod.type === 'crypto')) {
      if (!paymentReference || !paymentProofUrl) {
        alert("Please provide the payment reference number/UTR and upload a screenshot of your payment.");
        return;
      }
      
      const orderId = "ORD-" + Math.floor(100000 + Math.random() * 900000);
      onPaymentSuccess({
        orderId,
        payerEmail: formValues.billingEmail || formValues.email || "manual@customer.org",
        paymentId: `MANUAL-${selectedPaymentMethod.id}-${Date.now()}`,
        paymentMethodId: selectedPaymentMethod.id,
        paymentReference,
        paymentProofUrl,
        currency: "INR",
        exchangeRate,
        shippingDetails: {
          institution: formValues.institution || "",
          researcher: formValues.researcher || "",
          room: formValues.room || "",
          city: formValues.city || "",
          state: formValues.state || "",
          zip: formValues.zip || "",
          licenseId: "N/A",
          address: formValues.address || "",
          country: formValues.country || "",
          email: formValues.billingEmail || formValues.email || "",
          phone: formValues.billingPhone || formValues.phone || "",
          // Billing address properties
          billingSameAsShipping,
          billingAddress: billingSameAsShipping ? (formValues.address || "") : (formValues.billingAddress || ""),
          billingRoom: billingSameAsShipping ? (formValues.room || "") : (formValues.billingRoom || ""),
          billingCity: billingSameAsShipping ? (formValues.city || "") : (formValues.billingCity || ""),
          billingState: billingSameAsShipping ? (formValues.state || "") : (formValues.billingState || ""),
          billingZip: billingSameAsShipping ? (formValues.zip || "") : (formValues.billingZip || ""),
          billingCountry: billingSameAsShipping ? (formValues.country || "") : (formValues.billingCountry || "")
        }
      });
      alert(`Order Placed: ${orderId}\nPayment Reference: ${paymentReference}\nYour order will be processed once payment is confirmed.`);
    } else {
      setShowPaypal(true);
    }
  };

  const handlePaymentSuccess = (paymentDetails: { orderId: string; payerEmail: string; paymentId: string; otp?: string; localOrderId?: string }) => {
    setShowPaypal(false);
    onPaymentSuccess({
      ...paymentDetails,
      shippingDetails: {
        institution: formValues.institution || "",
        researcher: formValues.researcher || "",
        room: formValues.room || "",
        city: formValues.city || "",
        state: formValues.state || "",
        zip: formValues.zip || "",
        licenseId: "N/A",
        address: formValues.address || "",
        country: formValues.country || "",
        email: formValues.billingEmail || formValues.email || "",
        phone: formValues.billingPhone || formValues.phone || "",
        ...formValues,
        // Billing address properties
        billingSameAsShipping,
        billingAddress: billingSameAsShipping ? (formValues.address || "") : (formValues.billingAddress || ""),
        billingRoom: billingSameAsShipping ? (formValues.room || "") : (formValues.billingRoom || ""),
        billingCity: billingSameAsShipping ? (formValues.city || "") : (formValues.billingCity || ""),
        billingState: billingSameAsShipping ? (formValues.state || "") : (formValues.billingState || ""),
        billingZip: billingSameAsShipping ? (formValues.zip || "") : (formValues.billingZip || ""),
        billingCountry: billingSameAsShipping ? (formValues.country || "") : (formValues.billingCountry || "")
      }
    });
  };

  return (
    <div className={`max-w-7xl mx-auto px-4 md:px-10 py-6 font-sans transition-colors duration-300 ${
      isCyber ? "text-slate-100" : "text-slate-800"
    }`} id="checkout-view-screen">
      
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-xl md:text-2xl font-bold flex items-center gap-2 font-heading ${
          isCyber ? "text-cyan-100" : "text-slate-800"
        }`}>
          <FlaskConical className={`w-6 h-6 ${isCyber ? "text-cyan-400" : "text-blue-600"}`} />
          Laboratory Settlement & Checkout Desk
        </h2>
        <button
          onClick={onBackToStore}
          className={`text-xs font-medium cursor-pointer select-none transition ${
            isCyber ? "text-cyan-400 hover:text-cyan-200" : "text-slate-500 hover:text-blue-600"
          }`}
        >
          ← Return to Reagents Catalog
        </button>
      </div>

      {cart.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center max-w-xl mx-auto shadow-xs select-none">
          <Truck className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-base font-bold text-slate-800 font-heading">Your lab shopping cart is empty</h3>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed px-6">
            Review the Flaskia catalog and add high-purity chemicals, buffers, or class A laboratory borosilicate glassware to proceed.
          </p>
          <button
            onClick={onBackToStore}
            className="mt-6 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl transition cursor-pointer shadow-xs"
          >
            Browse Chemicals Catalog
          </button>
        </div>
      ) : (
        <form onSubmit={initiatePayment} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in">
          
          {/* Left Column - Cart item lists, plus institution verification details (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Cart Items list */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-800 pb-3 border-b border-slate-100 flex items-center justify-between font-heading">
                <span>Selected Chemical Products ({cart.reduce((ac, it) => ac + it.quantity, 0)} items)</span>
                <span className="text-xs text-slate-400 font-mono font-normal">Registry verified</span>
              </h3>

              <div className="divide-y divide-slate-100 space-y-4">
                {cart.map((item) => {
                  let delta = 0;
                  if (item.packaging === "High-Density Polyethylene") {
                    delta = -2.50;
                  } else if (item.packaging === "Heavy-Duty Metal Canister") {
                    delta = 4.00;
                  }
                  const adjustedPrice = Math.max(8.00, item.product.price + delta);
                  const rowTotal = adjustedPrice * item.quantity;

                  return (
                    <div key={item.product.id} className="pt-4 first:pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      
                      <div className="flex gap-3.5 items-start">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-14 h-14 rounded-xl object-cover border border-slate-200 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <div className="text-[10px] text-slate-400 font-mono">CAS: {item.product.cas}</div>
                          <h4 className="text-xs font-semibold text-slate-700">{item.product.name}</h4>
                          <div className="flex gap-1.5 mt-1">
                            <span className="text-[9.5px] bg-slate-50 border border-slate-100 text-slate-500 px-2.5 py-0.5 rounded font-mono">
                              {item.packaging}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Quantity controls and row calculations */}
                      <div className="flex items-center justify-between sm:justify-end gap-6 select-none border-t sm:border-0 border-slate-100 pt-3 sm:pt-0">
                        <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 p-1 rounded-xl">
                          <button
                            type="button"
                            disabled={item.quantity <= 1}
                            onClick={() => onUpdateQty(item.product.id, item.quantity - 1)}
                            className="w-7 h-7 rounded-lg hover:bg-slate-200 active:scale-95 disabled:opacity-30 disabled:scale-100 flex items-center justify-center font-bold text-slate-500 text-xs cursor-pointer transition-colors"
                          >
                            -
                          </button>
                          <span className="w-7 text-center font-mono text-xs text-slate-900 font-bold">{item.quantity}</span>
                          <button
                            type="button"
                            disabled={item.quantity >= 10 || item.quantity >= item.product.stock}
                            onClick={() => onUpdateQty(item.product.id, item.quantity + 1)}
                            className="w-7 h-7 rounded-lg hover:bg-slate-200 active:scale-95 disabled:opacity-30 disabled:scale-100 flex items-center justify-center font-bold text-slate-500 text-xs cursor-pointer transition-colors"
                          >
                            +
                          </button>
                        </div>

                        <div className="text-right flex items-center gap-4">
                          <div className="font-mono text-xs font-bold text-slate-800">
                            {formatAmount(rowTotal)}
                            <div className="text-[9px] text-slate-400 font-normal">
                              {formatAmount(adjustedPrice)} ea
                            </div>
                          </div>
                          
                          <button
                            type="button"
                            onClick={() => onRemoveItem(item.product.id)}
                            className="text-slate-400 hover:text-red-500 p-1.5 hover:bg-slate-50 rounded-lg transition cursor-pointer"
                            title="Remove chemical item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                      </div>

                    </div>
                  );
                })}
              </div>

            </div>            {/* Educational/Corporate Shipping Audit Details (Dynamic Fields rendering) */}
            <div className="space-y-6">
              {(() => {
                const formSections = [
                  { id: "credentials", label: "1. Laboratory & Resourcing Credentials", icon: ShieldCheck },
                  { id: "contact", label: "2. Secure Billing Contact Information", icon: Briefcase },
                  { id: "address", label: "3. Lab Delivery & Destination Address", icon: MapPin }
                ];

                return formSections.map((sect) => {
                  const sectionFields = fields.filter((f: any) => f.section === sect.id);
                  if (sectionFields.length === 0) return null;
                  const Icon = sect.icon;
                  return (
                    <div key={sect.id} className="bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-xs space-y-4">
                      <h3 className="text-sm font-bold text-slate-800 pb-2 border-b border-slate-100 flex items-center gap-2 font-heading">
                        <Icon className="w-4.5 h-4.5 text-blue-600" />
                        {sect.label}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {sectionFields.map((field: any) => {
                          const isFullWidth = field.id === "address" || field.id === "room";
                          return (
                            <div key={field.id} className={isFullWidth ? "md:col-span-2" : ""}>
                              <label className="block text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-1">
                                {field.label} {field.required && <span className="text-rose-500">*</span>}
                              </label>
                              {field.type === "select" ? (
                                <select
                                  required={field.required}
                                  value={formValues[field.id] || ""}
                                  onChange={(e) => setFormValues({ ...formValues, [field.id]: e.target.value })}
                                  className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:bg-white rounded-xl px-3.5 py-2.5 text-xs text-slate-800 outline-none transition-colors"
                                >
                                  <option value="">-- Choose option --</option>
                                  {(field.options || []).map((opt: string) => (
                                    <option key={opt} value={opt}>{opt}</option>
                                  ))}
                                </select>
                              ) : field.type === "checkbox" ? (
                                <label className="flex items-center gap-2.5 py-1.5 cursor-pointer select-none">
                                  <input
                                    type="checkbox"
                                    required={field.required}
                                    checked={!!formValues[field.id]}
                                    onChange={(e) => setFormValues({ ...formValues, [field.id]: e.target.checked })}
                                    className="accent-blue-600 rounded cursor-pointer size-4 shrink-0 hover:scale-105 transition-transform"
                                  />
                                  <span className="text-xs text-slate-600 font-medium">{field.placeholder || "Agree to check option"}</span>
                                </label>
                              ) : field.id === "country" ? (
                                <div className="relative" ref={shippingCountryRef}>
                                  <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                                      <Search className="w-3.5 h-3.5" />
                                    </span>
                                    <input
                                      type="text"
                                      required={field.required}
                                      value={shippingCountrySearch}
                                      onChange={(e) => {
                                        setShippingCountrySearch(e.target.value);
                                        setFormValues(prev => ({ ...prev, country: e.target.value }));
                                        setShippingCountryDropdownOpen(true);
                                      }}
                                      onFocus={() => setShippingCountryDropdownOpen(true)}
                                      placeholder="Search/Type Country"
                                      className="w-full pl-9 pr-8 bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:bg-white rounded-xl px-3.5 py-2.5 text-xs text-slate-800 outline-none transition-colors"
                                    />
                                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                                  </div>
                                  {shippingCountryDropdownOpen && (
                                    <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl max-h-48 overflow-y-auto">
                                      {filteredShippingCountries.length > 0 ? (
                                        filteredShippingCountries.map((c) => (
                                          <button
                                            key={c.name}
                                            type="button"
                                            onClick={() => {
                                              setFormValues(prev => ({ ...prev, country: c.name, state: "" }));
                                              setShippingCountrySearch(c.name);
                                              setShippingCountryDropdownOpen(false);
                                              setShippingStateSearch("");
                                            }}
                                            className="w-full px-3.5 py-2 text-left text-xs hover:bg-slate-50 text-slate-700 flex items-center justify-between"
                                          >
                                            <span>{c.name}</span>
                                          </button>
                                        ))
                                      ) : (
                                        <div className="p-2.5 text-center text-[11px] text-slate-400">No matching country. Type custom...</div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              ) : field.id === "state" ? (
                                <div className="relative" ref={shippingStateRef}>
                                  <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                                      <Search className="w-3.5 h-3.5" />
                                    </span>
                                    <input
                                      type="text"
                                      required={field.required}
                                      value={shippingStateSearch}
                                      onChange={(e) => {
                                        setShippingStateSearch(e.target.value);
                                        setFormValues(prev => ({ ...prev, state: e.target.value }));
                                        setShippingStateDropdownOpen(true);
                                      }}
                                      onFocus={() => setShippingStateDropdownOpen(true)}
                                      placeholder={formValues.country ? "Search/Type State" : "Type State/Province"}
                                      className="w-full pl-9 pr-8 bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:bg-white rounded-xl px-3.5 py-2.5 text-xs text-slate-800 outline-none transition-colors"
                                    />
                                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                                  </div>
                                  {shippingStateDropdownOpen && (
                                    <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl max-h-48 overflow-y-auto">
                                      {filteredShippingStates.length > 0 ? (
                                        filteredShippingStates.map((st) => (
                                          <button
                                            key={st}
                                            type="button"
                                            onClick={() => {
                                              setFormValues(prev => ({ ...prev, state: st }));
                                              setShippingStateSearch(st);
                                              setShippingStateDropdownOpen(false);
                                            }}
                                            className="w-full px-3.5 py-2 text-left text-xs hover:bg-slate-50 text-slate-700"
                                          >
                                            {st}
                                          </button>
                                        ))
                                      ) : (
                                        <div className="p-2.5 text-center text-[11px] text-slate-400">
                                          {formValues.country ? "No matching state. Type custom..." : "Provide State/Region..."}
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <input
                                  type={(field.id || "").toLowerCase().includes("email") ? "email" : (field.id || "").toLowerCase().includes("phone") ? "tel" : "text"}
                                  required={field.required}
                                  value={formValues[field.id] || ""}
                                  onChange={(e) => setFormValues({ ...formValues, [field.id]: e.target.value })}
                                  placeholder={field.placeholder}
                                  className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:bg-white rounded-xl px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 outline-none transition-colors"
                                />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                });
              })()}

              {/* Checkbox selector for same address */}
              <div className="bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-xs">
                <label className="flex items-center gap-3.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={billingSameAsShipping}
                    onChange={(e) => setBillingSameAsShipping(e.target.checked)}
                    className="accent-blue-600 rounded cursor-pointer size-4 h-4 w-4 shrink-0 hover:scale-105 transition-transform"
                  />
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-slate-800 font-sans block">Billing Address matches Lab Delivery Address</span>
                    <span className="text-[10.5px] text-slate-400 font-medium block">Uncheck this to specify a separate address for institutional accounting and receipt invoicing.</span>
                  </div>
                </label>
              </div>

              {/* Separate Billing Address section */}
              {!billingSameAsShipping && (
                <div className="bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-xs space-y-4 animate-fadeIn">
                  <h3 className="text-sm font-bold text-slate-800 pb-2 border-b border-slate-100 flex items-center gap-2 font-heading">
                    <Briefcase className="w-4.5 h-4.5 text-blue-600" />
                    4. Institutional Billing Address
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-1">
                        Billing Street Address <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required={!billingSameAsShipping}
                        value={formValues.billingAddress || ""}
                        onChange={(e) => setFormValues({ ...formValues, billingAddress: e.target.value })}
                        placeholder="e.g. Accounts Payable, Dept of Chemistry"
                        className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:bg-white rounded-xl px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 outline-none transition-colors"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-1">
                        Laboratory Suite / Room / Department
                      </label>
                      <input
                        type="text"
                        value={formValues.billingRoom || ""}
                        onChange={(e) => setFormValues({ ...formValues, billingRoom: e.target.value })}
                        placeholder="e.g. Mailbox 505"
                        className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:bg-white rounded-xl px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 outline-none transition-colors"
                      />
                    </div>

                    <div className="relative animate-fadeIn" ref={billingCountryRef}>
                      <label className="block text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-1">
                        Country <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                          <Search className="w-3.5 h-3.5" />
                        </span>
                        <input
                          type="text"
                          required={!billingSameAsShipping}
                          value={billingCountrySearch}
                          onChange={(e) => {
                            setBillingCountrySearch(e.target.value);
                            setFormValues(prev => ({ ...prev, billingCountry: e.target.value }));
                            setBillingCountryDropdownOpen(true);
                          }}
                          onFocus={() => setBillingCountryDropdownOpen(true)}
                          placeholder="Search Country"
                          className="w-full pl-9 pr-8 bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:bg-white rounded-xl px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 outline-none transition-colors"
                        />
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                      </div>
                      {billingCountryDropdownOpen && (
                        <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl max-h-48 overflow-y-auto">
                          {filteredBillingCountries.length > 0 ? (
                            filteredBillingCountries.map((c) => (
                              <button
                                key={c.name}
                                type="button"
                                onClick={() => {
                                  setFormValues(prev => ({ ...prev, billingCountry: c.name, billingState: "" }));
                                  setBillingCountrySearch(c.name);
                                  setBillingCountryDropdownOpen(false);
                                  setBillingStateSearch("");
                                }}
                                className="w-full px-3.5 py-2 text-left text-xs hover:bg-slate-50 text-slate-700 flex items-center justify-between"
                              >
                                <span>{c.name}</span>
                              </button>
                            ))
                          ) : (
                            <div className="p-2.5 text-center text-[11px] text-slate-400">No matching country. Type custom...</div>
                          )}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-1">
                        City <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required={!billingSameAsShipping}
                        value={formValues.billingCity || ""}
                        onChange={(e) => setFormValues({ ...formValues, billingCity: e.target.value })}
                        placeholder="e.g. Cambridge"
                        className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:bg-white rounded-xl px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 outline-none transition-colors"
                      />
                    </div>

                    <div className="relative animate-fadeIn" ref={billingStateRef}>
                      <label className="block text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-1">
                        State / Province <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                          <Search className="w-3.5 h-3.5" />
                        </span>
                        <input
                          type="text"
                          required={!billingSameAsShipping}
                          value={billingStateSearch}
                          onChange={(e) => {
                            setBillingStateSearch(e.target.value);
                            setFormValues(prev => ({ ...prev, billingState: e.target.value }));
                            setBillingStateDropdownOpen(true);
                          }}
                          onFocus={() => setBillingStateDropdownOpen(true)}
                          placeholder={formValues.billingCountry ? "Search/Type State" : "Type State/Province"}
                          className="w-full pl-9 pr-8 bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:bg-white rounded-xl px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 outline-none transition-colors"
                        />
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                      </div>
                      {billingStateDropdownOpen && (
                        <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl max-h-48 overflow-y-auto">
                          {filteredBillingStates.length > 0 ? (
                            filteredBillingStates.map((st) => (
                              <button
                                key={st}
                                type="button"
                                onClick={() => {
                                  setFormValues(prev => ({ ...prev, billingState: st }));
                                  setBillingStateSearch(st);
                                  setBillingStateDropdownOpen(false);
                                }}
                                className="w-full px-3.5 py-2 text-left text-xs hover:bg-slate-50 text-slate-700"
                              >
                                {st}
                              </button>
                            ))
                          ) : (
                            <div className="p-2.5 text-center text-[11px] text-slate-400">
                              {formValues.billingCountry ? "No matching state. Type custom..." : "Provide State/Region..."}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-1">
                        ZIP / Postal Code <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required={!billingSameAsShipping}
                        value={formValues.billingZip || ""}
                        onChange={(e) => setFormValues({ ...formValues, billingZip: e.target.value })}
                        placeholder="e.g. 02138"
                        className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:bg-white rounded-xl px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 outline-none transition-colors"
                      />
                    </div>

                    {/* Integrated OTP Verification Status Tracker inside Section 4 */}
                    <div className="md:col-span-2 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-1.5">
                        {checkoutBillingVerified ? (
                          <div className="flex items-center gap-1.5 text-emerald-600 font-bold font-mono bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-xl">
                            <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>Certified Coordinates</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-rose-600 font-bold font-mono bg-rose-50 border border-rose-100 px-3 py-1 rounded-xl">
                            <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                            <span>Verification Required</span>
                          </div>
                        )}
                        <span className="text-slate-400 text-[10.5px]">Mandatory for separate billing routing</span>
                      </div>

                      {!checkoutBillingVerified && (
                        <button
                          type="button"
                          onClick={handleRequestCheckoutBillingOtp}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl cursor-pointer active:scale-95 transition"
                        >
                          Send OTP Verification
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Right Column - Financial receipts, PayPal triggers (5 Cols) */}
          <div className="lg:col-span-5 space-y-6 select-none">
            
            {/* Price Calculations */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-800 pb-2 border-b border-slate-100 font-heading">Settlement Ledger Invoice</h3>
              
              <div className="space-y-2.5 text-xs text-slate-500 font-medium font-sans">
                <div className="flex justify-between">
                  <span>Reagent Subtotal:</span>
                  <span className="font-mono text-slate-800">{formatAmount(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>{ledgerConfig.transitFeeLabel || "Chemical Courier Dispatch Rate"}:</span>
                  <span className="font-mono text-slate-800">{formatAmount(transitFee)}</span>
                </div>
                {containsHazard && (
                  <div className="flex justify-between text-amber-600 font-semibold">
                    <span className="flex items-center gap-1">
                      {ledgerConfig.hazmatSurchargeLabel || "HazMat Class 9 Surcharge"}
                      <AlertTriangle className="w-3.5 h-3.5" />
                    </span>
                    <span className="font-mono">{formatAmount(hazmatSurcharge)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>{ledgerConfig.taxRateLabel || `Regulatory Science Admin Tax (${taxPercent}%):`}:</span>
                  <span className="font-mono text-slate-800">{formatAmount(taxes)}</span>
                </div>
                
                <div className="border-t border-slate-100 pt-3.5 flex justify-between text-sm text-slate-800 font-bold font-heading">
                  <span>{isINR ? "Grand Total (INR):" : (ledgerConfig.grandTotalLabel || "Grand Total (USD):")}</span>
                  <span className="font-mono text-blue-600 text-lg">{formatAmount(grandTotal)}</span>
                </div>
              </div>

              {/* Transit note */}
              {containsHazard && (
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-[10px] leading-relaxed text-slate-500 font-sans">
                  ⚠️ <strong>Hazcard Transit Class alert:</strong> Your cart includes hazardous chemicals. Shipping dispatch coordinates under climate-insulated protocols to restrict exposure risk in transit.
                </div>
              )}

              {/* Legal Verification Consent */}
              <div className={`p-4 border rounded-2xl transition-all duration-300 ${
                showTermsAlert 
                  ? "bg-rose-50 border-rose-300 ring-4 ring-rose-500/10 animate-pulse text-rose-900" 
                  : "bg-slate-50 border-slate-100 text-slate-500"
              }`}>
                <label className="flex gap-2.5 items-start cursor-pointer active:scale-99 transition-all">
                  <input
                    type="checkbox"
                    checked={agreesHazmatRule}
                    onChange={(e) => {
                      setAgreesHazmatRule(e.target.checked);
                      if (e.target.checked) setShowTermsAlert(false);
                    }}
                    className="mt-0.5 accent-blue-600 rounded cursor-pointer size-4 shrink-0"
                  />
                  <span className="text-[10px] leading-snug">
                    {ledgerConfig.legalDisclaimerText || `I attest that the researcher is licensed for material logistics and will obey EPA Disposal guidelines.`}
                  </span>
                </label>
                {showTermsAlert && (
                  <div className="mt-2 text-[9.5px] text-rose-600 font-bold flex items-center gap-1 leading-snug animate-fade-in select-none">
                    <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                    <span>Please accept our terms & conditions and material logistics disclaimer to checkout.</span>
                  </div>
                )}
              </div>

              {paymentMethods.length > 0 && (
                <div className="space-y-2 mt-4 mb-2">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest font-mono mb-2">Select Payment Method</h4>
                  <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition ${!selectedPaymentMethod ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      checked={!selectedPaymentMethod} 
                      onChange={() => setSelectedPaymentMethod(null)}
                      className="accent-blue-600 size-4" 
                    />
                    <span className="text-xs font-semibold text-slate-800">PayPal Express Checkout</span>
                  </label>
                  {paymentMethods.map(method => (
                    <div key={method.id} className="flex flex-col gap-2">
                       <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition ${selectedPaymentMethod?.id === method.id ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                        <input 
                          type="radio" 
                          name="paymentMethod" 
                          checked={selectedPaymentMethod?.id === method.id} 
                          onChange={() => setSelectedPaymentMethod(method)}
                          className="accent-blue-600 size-4" 
                        />
                        <span className="text-xs font-semibold text-slate-800">{method.name}</span>
                      </label>
                      
                      {selectedPaymentMethod?.id === method.id && (method.type === 'manual' || method.type === 'crypto') && method.details && (
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 ml-4 text-xs font-mono text-slate-600 space-y-4">
                          {method.details.show_bank_details !== false && (
                            <>
                              <p className="font-sans font-bold text-slate-800 text-sm mb-3">Bank Transfer Instructions:</p>
                              {method.details.instructions && (
                                <div className="bg-white p-3 rounded-lg border border-slate-200 whitespace-pre-wrap mb-3">{method.details.instructions}</div>
                              )}
                              
                              <div className="grid grid-cols-2 gap-2 mt-3 text-[10px]">
                                {method.details.upi_id && <div><span className="text-slate-400">UPI ID:</span><br/><strong className="text-blue-600">{method.details.upi_id}</strong></div>}
                                {method.details.account_holder && <div><span className="text-slate-400">Account Name:</span><br/><strong>{method.details.account_holder}</strong></div>}
                                {method.details.bank_name && <div><span className="text-slate-400">Bank Name:</span><br/><strong>{method.details.bank_name}</strong></div>}
                                {method.details.account_number && <div><span className="text-slate-400">Account No:</span><br/><strong>{method.details.account_number}</strong></div>}
                                {method.details.ifsc_code && <div><span className="text-slate-400">IFSC Code:</span><br/><strong>{method.details.ifsc_code}</strong></div>}
                                {method.details.branch && <div><span className="text-slate-400">Branch:</span><br/><strong>{method.details.branch}</strong></div>}
                              </div>
                            </>
                          )}

                          {method.details.show_qr_code !== false && (
                            <div className="mt-4 pt-4 border-t border-slate-200">
                              <p className="font-sans font-bold text-slate-800 text-sm mb-3">QR Code Payment:</p>
                              {method.details.qr_instructions && (
                                <div className="bg-white p-3 rounded-lg border border-slate-200 whitespace-pre-wrap mb-4 font-sans text-xs">{method.details.qr_instructions}</div>
                              )}
                              {method.details.qr_codes && method.details.qr_codes.split('\n').map((qr: string, i: number) => qr.trim() ? (
                                <div key={i} className="mt-4 flex flex-col items-center justify-center p-4 bg-white border border-slate-200 rounded-xl max-w-[250px] mx-auto">
                                  <span className="text-xs font-bold text-slate-500 mb-2 uppercase">Scan to Pay</span>
                                  <img src={qr.trim()} alt="Payment QR Code" className="w-full h-auto rounded border border-slate-100" />
                                </div>
                              ) : null)}
                            </div>
                          )}

                          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl space-y-4">
                            <h4 className="font-sans font-bold text-slate-800 text-sm">Submit Payment Details</h4>
                            <p className="text-xs text-slate-600 font-sans">After transferring the exact amount, please submit your transaction details below.</p>
                            
                            <div>
                              <label className="block text-xs font-bold text-slate-700 mb-1 font-sans">Transaction Reference / UTR Number <span className="text-rose-500">*</span></label>
                              <input
                                type="text"
                                placeholder="e.g. UTR1234567890"
                                value={paymentReference}
                                onChange={(e) => setPaymentReference(e.target.value)}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono bg-white outline-none focus:border-blue-500 transition"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-xs font-bold text-slate-700 mb-1 font-sans">Payment Screenshot <span className="text-rose-500">*</span></label>
                              <div className="flex items-center gap-2">
                                <label className="cursor-pointer bg-white px-3 py-2 border border-slate-300 rounded-lg text-xs font-sans font-semibold text-slate-600 hover:bg-slate-50 transition w-full text-center">
                                  {isUploadingProof ? "Uploading..." : paymentProofUrl ? "Change Screenshot" : "Select Image"}
                                  <input type="file" accept="image/*" onChange={handleProofUpload} className="hidden" disabled={isUploadingProof} />
                                </label>
                              </div>
                              {paymentProofUrl && (
                                <div className="mt-2 text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                                  <CheckCircle className="w-3 h-3" /> Screenshot attached successfully
                                </div>
                              )}
                            </div>
                          </div>

                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Secure Paypal Payment gateways button */}
              <button
                type="submit"
                disabled={cart.length === 0}
                className={`w-full text-white py-3.5 px-4 rounded-xl font-bold flex items-center justify-center gap-2.5 transition active:scale-95 disabled:bg-slate-100 disabled:text-slate-400 disabled:scale-100 disabled:shadow-none shadow-xs cursor-pointer text-xs uppercase tracking-wider mt-2.5 ${(!selectedPaymentMethod) ? "bg-[#0070ba] hover:bg-[#0764a3]" : "bg-blue-600 hover:bg-blue-700"}`}
              >
                {!selectedPaymentMethod ? (
                  <>
                    <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                      <path d="M7.076 1.933A2.3 2.3 0 0 0 4.8 4.2h3.2c.245 0 .445.181.445.4v12.2a.4.4 0 0 1-.4.4h-2.1c.4 1 1 1.7 1.8 1.7h5.1c1.8 0 3.3-1.4 3.3-3.2v-1.1c.3 0 .6-.1.9-.3 2.1-1 3-3.6 2-5.7-1-2.1-3.6-3-5.7-2-1 .5-1.7 1.3-2 2.3v-4.1c0-1.2-1-2.2-2.3-2.2H7.076z" />
                    </svg>
                    {ledgerConfig.paypalButtonText || "Secure PayPal Checkout"}
                  </>
                ) : (
                  <>Place Order via {selectedPaymentMethod.name}</>
                )}
              </button>

              <div className="flex items-center justify-center gap-1 pt-1 text-[9.5px] text-slate-400 font-mono">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                VERIFIED MERCANTILE TRANSACTION HANDSHAKE
              </div>
            </div>

            {/* Educational credentials */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs flex items-center gap-3">
              <Award className="w-8 h-8 text-blue-500 shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-slate-800 font-heading">
                  {ledgerConfig.appreciationBadgeTitle || "Certified Laboratory Merchant"}
                </h4>
                <p className="text-[10px] text-slate-500 leading-relaxed mt-0.5">
                  {ledgerConfig.appreciationBadgeText || "Academic chemical registries verify our licensure indexes dynamically quarterly. Shipping handles storage and OSHA audit trails."}
                </p>
              </div>
            </div>

          </div>

        </form>
      )}

      {/* SECURE CHECKOUT BILLING OTP VERIFICATION MODAL */}
      {showCheckoutBillingOtpModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl animate-fade-in relative overflow-hidden text-left">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-blue-600" />
            
            <div className="flex items-start gap-4 mb-5">
              <div className="p-3 bg-blue-50 border border-blue-100 rounded-2xl text-blue-600">
                <Key className="w-6 h-6 animate-pulse" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-800 font-heading">Security Address Verification</h3>
                <p className="text-slate-500 text-xs leading-relaxed">
                  To keep your account secure, please verify this billing address change. An OTP code has been dispatched to <strong className="text-slate-800">{formValues.billingEmail || currentUser?.email || "customer@example.com"}</strong>.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 font-mono uppercase block">Enter Secure Verification Passcode</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={enteredCheckoutBillingOtp}
                    maxLength={6}
                    onChange={(e) => {
                      setEnteredCheckoutBillingOtp(e.target.value);
                      setCheckoutBillingOtpError("");
                    }}
                    className="flex-1 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl px-4 py-2.5 text-center text-sm font-mono tracking-widest outline-none transition"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (enteredCheckoutBillingOtp === checkoutBillingOtpCode && checkoutBillingOtpCode !== "") {
                        setCheckoutBillingOtpError("");
                        commitCheckoutBillingVerified();
                      } else {
                        setCheckoutBillingOtpError("Invalid code. Please verify the code displayed in your secure mail desk below.");
                      }
                    }}
                    className="px-6 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl cursor-pointer transition shadow-xs"
                  >
                    Verify OTP
                  </button>
                </div>
                {checkoutBillingOtpError && (
                  <p className="text-rose-600 text-[11px] font-mono mt-1">{checkoutBillingOtpError}</p>
                )}
              </div>

              {/* SIMULATED GMAIL / INBOX RETRIEVER */}
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-2 mt-4 font-mono text-[10.5px]">
                <div className="flex justify-between text-[10px] text-slate-500 border-b border-slate-800 pb-1.5 mb-1 bg-slate-900">
                  <span className="flex items-center gap-1">📨 SECURE GMAIL INBOX DESK (Internal)</span>
                  <span className="text-emerald-500 animate-pulse font-bold">● ONLINE DEVICE</span>
                </div>
                <div className="text-slate-300">To: <span className="text-white">{formValues.billingEmail || currentUser?.email || "academic@omyra.org"}</span></div>
                <div className="text-slate-300">Subject: <span className="text-blue-400 font-bold">REXSECURE: Verify Billing coordinates</span></div>
                <div className="bg-slate-850 p-2.5 rounded-lg mt-1 text-center border border-slate-800 text-slate-100">
                  {sendingCheckoutBillingOtp ? (
                    <div className="flex items-center justify-center gap-1.5 text-slate-400">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-500" />
                      <span>Dispatching secure keys...</span>
                    </div>
                  ) : (
                    <p className="text-xs">
                      Your update passcode is: <strong className="text-yellow-400 text-sm tracking-wider font-bold bg-slate-900 px-2 py-1 rounded select-all ml-1.5">{checkoutBillingOtpCode}</strong>
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCheckoutBillingOtpModal(false)}
                  className="px-4 py-2 hover:bg-slate-100 border border-slate-200 text-slate-500 text-xs font-semibold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CONGRATULATIONS SUCCESS POPUP FOR CHECKOUT BILLING */}
      {showCheckoutCelebration && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-100 rounded-3xl p-8 max-w-md w-full shadow-2xl animate-fade-in relative text-center space-y-5 select-none md:p-10">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-500 to-teal-500" />
            
            {/* Celebration Sparkles and Shield Header decoration */}
            <div className="relative mx-auto w-20 h-20 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shadow-md">
              <ShieldCheck className="w-10 h-10 animate-bounce" />
              <div className="absolute -top-1 -right-1 p-1 bg-yellow-400 rounded-full text-slate-950 border border-white">
                <Sparkles className="w-4 h-4 fill-current animate-spin" style={{ animationDuration: "3s" }} />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-800 tracking-tight font-heading">Billing Address Verified!</h3>
              <p className="text-xs text-slate-400 font-mono tracking-widest uppercase">Secure Update Complete</p>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-xs text-slate-600 space-y-1.5 leading-relaxed text-left">
              <p className="font-bold text-emerald-800">🎉 Congratulations!</p>
              <p>Your custom billing coordinates have been verified successfully. Your billing details are locked in and ready for secure payment and checkout.</p>
            </div>

            <button
              type="button"
              onClick={() => setShowCheckoutCelebration(false)}
              className="w-full bg-slate-900 hover:bg-slate-850 text-white font-semibold text-xs py-3 rounded-xl cursor-pointer shadow-sm active:scale-98 transition duration-150 uppercase tracking-wider"
            >
              Continue to Settlement
            </button>
          </div>
        </div>
      )}

      {/* Actual Secure Paypal Sandbox iframe overlay popup! */}
      {showPaypal && (
        <PayPalPortal
          amount={grandTotal}
          cartItems={cart}
          shippingDetails={{
            email: formValues.billingEmail || formValues.email || "",
            researcher: formValues.researcher || "",
            institution: formValues.institution || "",
            licenseId: "N/A",
            city: formValues.city || "",
            room: formValues.room || "",
            customerId: currentUser?.id || currentUser?.uid || ""
          }}
          onClose={() => setShowPaypal(false)}
          onSuccess={handlePaymentSuccess}
        />
      )}

    </div>
  );
}
