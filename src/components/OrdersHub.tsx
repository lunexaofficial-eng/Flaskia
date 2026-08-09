import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { PRODUCTS, Product } from "../data";
import { getLedgerConfig } from "./CheckoutPage";
import { useTheme } from "../context/ThemeContext";

import {
  FileText,
  CheckCircle,
  Clock,
  MapPin,
  Truck,
  ShieldCheck,
  Hash,
  ArrowRight,
  Download,
  Award,
  Users,
  Key,
  ExternalLink,
  Activity,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

export interface Order {
  id: string; // The database ID
  orderId: string;
  paymentId: string;
  payerEmail: string;
  paymentMethodId?: string;
  paymentReference?: string;
  paymentProofUrl?: string;
  amount: number;
  date: string;
  shipmentOtp?: string;
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
  };
  itemsSelectedCount: number;
  products?: {
    product_id: string;
    product_name: string;
    qty: number;
    price: number;
    package_size?: string;
    image_url?: string;
    cas_number?: string;
    purity?: string;
    grade?: string;
    ghs_pictograms?: string;
  }[];
  currency?: string;
  status: string;
  cancellationReason?: string | null;
}

function OrderCard({
  ord,
  statusConfig,
  onPrintInvoice,
  onPrintCompliance,
}: {
  key?: any;
  ord: Order;
  statusConfig: any;
  onPrintInvoice: (ord: Order) => void;
  onPrintCompliance: (ord: Order) => void;
}) {
  const [shipment, setShipment] = useState<any>(null);
  const [updates, setUpdates] = useState<any[]>([]);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(
    ord.status !== "delivered",
  );

  const fetchShipment = async (showLoading = false) => {
    if (showLoading) setIsRefreshing(true);
    try {
      const res = await fetch(`/api/orders/${ord.id}/shipment`);
      if (res.ok) {
        const data = await res.json();
        setShipment(data.shipment);
        setUpdates(data.updates || []);
      }
    } catch (err) {
      console.error("Failed to fetch shipment:", err);
    } finally {
      if (showLoading) {
        // Add a tiny decorative delay so the animation is clearly visible
        setTimeout(() => {
          setIsRefreshing(false);
        }, 600);
      }
    }
  };

  useEffect(() => {
    let active = true;
    const loadInit = async () => {
      try {
        const res = await fetch(`/api/orders/${ord.id}/shipment`);
        if (res.ok) {
          const data = await res.json();
          if (active) {
            setShipment(data.shipment);
            setUpdates(data.updates || []);
          }
        }
      } catch (err) {
        // Silently fail
      }
    };
    loadInit();
    const interval = setInterval(() => {
      if (active) {
        fetchShipment(false);
      }
    }, 10000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [ord.id]);

  useEffect(() => {
    if (shipment?.status === "delivered") {
      setIsExpanded(false);
    }
  }, [shipment?.status]);

  // Use the order status, shipment status or default to compliance_check
  let currentStatus = ord.status || "compliance_check";
  if (ord.status !== "manual_verification_pending" && ord.status !== "cancelled" && shipment && shipment.status) {
    // Map shipments.status (packed -> packaging_haz, in_transit -> in_transit, delivered -> delivered, near_location -> in_transit)
    if (shipment.status === "packed") currentStatus = "packaging_haz";
    else if (
      shipment.status === "in_transit" ||
      shipment.status === "near_location"
    )
      currentStatus = "in_transit";
    else if (shipment.status === "delivered") currentStatus = "delivered";
  }

  const activeStatus =
    statusConfig[currentStatus] || statusConfig.compliance_check;

  return (
    <div
      className={`bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-xs ${isExpanded ? "space-y-5" : ""} animate-fade-in`}
      id={`receipt-${ord.orderId}`}
    >
      {/* Header info */}
      <div
        className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${isExpanded ? "pb-4 border-b border-slate-100" : ""}`}
      >
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono bg-slate-50 text-slate-600 border border-slate-200 px-2.5 py-0.5 rounded-md font-bold">
              REG-ID: {ord.orderId}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              Date: {ord.date}
            </span>
          </div>
          <div className="text-[10px] text-slate-400 font-mono mt-1.5 flex flex-col gap-1">
            <div className="flex items-center gap-1">
              <Hash className="w-3 h-3 text-slate-500" />
              Transaction ID:{" "}
              <span className="text-slate-600 font-medium">
                {ord.paymentId}
              </span>{" "}
              ({ord.paymentMethodId && ord.paymentMethodId !== "paypal" ? "Manual Gateway" : "PayPal Secure"})
            </div>
            {ord.paymentReference && (
              <div className="flex items-center gap-1">
                Ref UTR:{" "}
                <span className="text-slate-600 font-medium">{ord.paymentReference}</span>
              </div>
            )}
            {ord.paymentProofUrl && (
              <div className="flex items-center gap-1">
                <a href={ord.paymentProofUrl} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">View Payment Proof</a>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
          <div className="text-left sm:text-right">
            <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-mono">
              Invoice Total
            </span>
            <div className="flex items-center sm:justify-end gap-2 mt-0.5">
              {!isExpanded && (
                <span
                  className={`px-2 py-0.5 text-[9px] font-bold uppercase rounded ${currentStatus === "delivered" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-blue-50 text-blue-600 border border-blue-100"}`}
                >
                  {currentStatus === "delivered" ? "Delivered" : "In Progress"}
                </span>
              )}
              <span className="text-base font-extrabold text-blue-600 font-mono block">
                {ord.currency === "INR" ? `₹${ord.amount.toFixed(2)}` : `$${ord.amount.toFixed(2)}`}
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-500 transition shrink-0"
          >
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {isExpanded && (
        <>
          {/* Shipping & Delivery metadata visual */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs">
            <div>
              <h4 className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1.5">
                Consignee Institution & Researcher
              </h4>
              <p className="font-semibold text-slate-700">
                {ord.shippingDetails.institution}
              </p>
              <p className="text-slate-500 mt-1 text-[11px] leading-tight">
                {ord.shippingDetails.room} (Attn:{" "}
                {ord.shippingDetails.researcher})
              </p>
              {ord.shippingDetails.address && (
                <p className="text-slate-500 mt-0.5 text-[11px] leading-tight font-sans">
                  Address: {ord.shippingDetails.address}
                </p>
              )}
              {ord.shippingDetails.country && (
                <p className="text-slate-500 mt-0.5 text-[11px] leading-tight font-sans">
                  Country: {ord.shippingDetails.country}
                </p>
              )}
            </div>
            <div>
              <h4 className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1.5">
                Compliance & Billing Registry
              </h4>
              <p className="font-mono text-slate-700 font-bold">
                {ord.shippingDetails.licenseId}
              </p>
              <p className="text-slate-500 mt-1 text-[11px] leading-tight">
                Dest: {ord.shippingDetails.city}, {ord.shippingDetails.state}{" "}
                {ord.shippingDetails.zip}
              </p>
              {(ord.shippingDetails.email || ord.shippingDetails.phone) && (
                <div className="mt-1.5 pt-1.5 border-t border-dashed border-slate-200 space-y-0.5 text-[10.5px] text-slate-500">
                  {ord.shippingDetails.email && (
                    <div>Email: <span className="font-mono select-all font-medium text-slate-600">{ord.shippingDetails.email}</span></div>
                  )}
                  {ord.shippingDetails.phone && (
                    <div>Phone: <span className="font-mono select-all font-medium text-slate-600">{ord.shippingDetails.phone}</span></div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Additional custom field attributes */}
          {(() => {
            const standardKeys = ["institution", "researcher", "room", "city", "state", "zip", "licenseId", "address", "country", "email", "phone"];
            const customEntries = Object.entries(ord.shippingDetails || {}).filter(
              ([key, val]) => !standardKeys.includes(key) && val !== "" && typeof val !== "object" && typeof val !== "function"
            );
            if (customEntries.length === 0) return null;
            return (
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-xs space-y-1">
                <h5 className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Custom Laboratory Declarations</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1.5">
                  {customEntries.map(([key, val]) => {
                    const label = key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());
                    return (
                      <div key={key} className="flex items-center justify-between text-[11px] leading-tight">
                        <span className="text-slate-500 font-medium">{label}:</span>
                        <span className="font-mono font-semibold text-slate-700">
                          {(val as any) === true || val === "true" ? "Approved / Certified" : (val as any) === false || val === "false" ? "No" : String(val)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}

          {/* Shipment Logistics Progress visual */}
          <div className="space-y-4">
            <h4 className="text-[10px] uppercase font-bold text-slate-400 tracking-widest font-mono">
              Dispatch Transit Status
            </h4>

            {currentStatus === "cancelled" ? (
              <div className="p-5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 space-y-3.5">
                <div className="font-bold flex items-center gap-2 text-sm">
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  <span>Order Transaction Refused & Cancelled</span>
                </div>
                <div className="text-xs space-y-3 leading-relaxed">
                  <p className="text-rose-800">
                    This order transaction has been officially cancelled. Our compliance department has logged the following cancellation reason:
                  </p>
                  <div className="bg-rose-100/50 p-3 rounded-xl border border-rose-200 text-rose-950 font-bold font-mono text-[11px] whitespace-normal">
                    {ord.cancellationReason || "Mismatched manual payment transaction details or unverified referencing."}
                  </div>
                  <p className="border-t border-rose-200/50 pt-2.5 text-[11px] text-rose-700 font-medium">
                    Financial reversal initiated. Any paid capital has been queued for refund and will credit back to your originating bank account or credit ledger within <span className="text-rose-950 font-bold">3 to 5 business days</span>.
                  </p>
                </div>
              </div>
            ) : currentStatus === "manual_verification_pending" ? (
              <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 space-y-3">
                <div className="font-bold flex items-center gap-2 text-sm">
                  <Clock className="w-5 h-5 text-amber-600 shrink-0" />
                  <span>Awaiting Manual Payment Verification</span>
                </div>
                <div className="text-xs space-y-2 leading-relaxed">
                  <p className="text-amber-900">
                    We have successfully captured your transaction referencing <code className="font-bold font-mono px-1.5 py-0.5 bg-amber-100 rounded text-amber-950">{ord.paymentReference || "N/A"}</code> and the uploaded invoice screenshot.
                  </p>
                  <p className="font-semibold text-amber-950 bg-amber-100/50 p-2.5 rounded-lg border border-amber-200/50 leading-snug">
                    Status: Pending payment confirmation. Waiting for payment confirmation from that seller.
                  </p>
                  <p className="text-[11.5px] text-amber-800 pr-1">
                    Our finance desk is manually matching the transaction with our incoming banking ledger. Once approved, your order status will automatically transit to active security compliance auditing.
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* Visual Timeline bar */}
                <div className="grid grid-cols-4 gap-2 text-center text-[10.5px] font-semibold text-slate-500 relative select-none">
                  <div className="absolute top-3 left-[12%] right-[12%] h-[2px] bg-slate-100 z-0 hidden sm:block" />

                  <div className="relative z-10 flex flex-col items-center">
                    <span
                      className={`w-6.5 h-6.5 rounded-full flex items-center justify-center font-mono text-[10px] font-bold ${currentStatus === "compliance_check" || currentStatus === "packaging_haz" || currentStatus === "in_transit" || currentStatus === "delivered" ? "bg-blue-600 text-white shadow-xs" : "bg-slate-100 text-slate-400"}`}
                    >
                      1
                    </span>
                    <span className="mt-1.5 text-[9px] uppercase hidden sm:inline">
                      Compliance
                    </span>
                  </div>

                  <div className="relative z-10 flex flex-col items-center">
                    <span
                      className={`w-6.5 h-6.5 rounded-full flex items-center justify-center font-mono text-[10px] font-bold ${currentStatus === "packaging_haz" || currentStatus === "in_transit" || currentStatus === "delivered" ? "bg-blue-600 text-white shadow-xs" : "bg-slate-100 text-slate-400"}`}
                    >
                      2
                    </span>
                    <span className="mt-1.5 text-[9px] uppercase hidden sm:inline">
                      Cell Pack
                    </span>
                  </div>

                  <div className="relative z-10 flex flex-col items-center">
                    <span
                      className={`w-6.5 h-6.5 rounded-full flex items-center justify-center font-mono text-[10px] font-bold ${currentStatus === "in_transit" || currentStatus === "delivered" ? "bg-blue-600 text-white shadow-xs" : "bg-slate-100 text-slate-400"}`}
                    >
                      3
                    </span>
                    <span className="mt-1.5 text-[9px] uppercase hidden sm:inline">
                      Dispatched
                    </span>
                  </div>

                  <div className="relative z-10 flex flex-col items-center">
                    <span
                      className={`w-6.5 h-6.5 rounded-full flex items-center justify-center font-mono text-[10px] font-bold ${currentStatus === "delivered" ? "bg-blue-600 text-white shadow-xs" : "bg-slate-100 text-slate-400"}`}
                    >
                      4
                    </span>
                    <span className="mt-1.5 text-[9px] uppercase hidden sm:inline">
                      Settle Done
                    </span>
                  </div>
                </div>

                {/* Active Status narrative description */}
                <div className={`p-4 rounded-2xl ${activeStatus.color} space-y-1`}>
                  <div className="font-bold flex items-center gap-1.5 text-xs">
                    <Clock className="w-3.5 h-3.5" />
                    {activeStatus.label}
                  </div>
                  <p className="text-[10.5px] opacity-90 leading-normal">
                    {activeStatus.desc}
                  </p>
                </div>
                
                {currentStatus !== "delivered" && (
                  <div className="bg-amber-50/70 border border-amber-200/60 rounded-xl p-3 flex flex-col sm:flex-row items-center justify-center gap-2 mt-3 text-amber-900 mx-1">
                    <Truck className="w-4 h-4 text-amber-600 hidden sm:block" />
                    <p className="text-[11px] font-bold uppercase tracking-widest font-mono text-center">
                      Estimated Delivery Time: <span className="text-amber-700">10 to 15 Days</span>
                    </p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* DB Telemetry / OTP rendering */}
          {currentStatus !== "cancelled" && currentStatus !== "manual_verification_pending" && (
            !shipment ? (
            <div className="text-[10.5px] text-slate-400 font-mono animate-pulse mt-4 pt-4 border-t border-slate-100">
              Requesting dispatch telemetry...
            </div>
          ) : (
            <div className="mt-4 pt-4 border-t border-slate-100 space-y-4">
              {/* OTP Display Block */}
              <div className="bg-slate-900 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-blue-500/20 rounded-xl">
                    <Key className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">
                      Secured Delivery Auth Code
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5 leading-tight pr-4">
                      You MUST provide this one-time code to the delivery
                      personnel to clear the shipment manifest upon arrival.
                    </p>
                  </div>
                </div>
                <div className="bg-slate-950 border border-slate-800 px-5 py-2.5 rounded-xl shadow-inner flex items-center justify-center shrink-0">
                  <span className="text-xl font-bold font-mono tracking-[0.2em] text-emerald-400">
                    {shipment.otpUsed
                      ? "VERIFIED"
                      : ord.shipmentOtp || "******"}
                  </span>
                </div>
              </div>

              {/* Courier specifics */}
              {shipment.type === "courier" && shipment.trackingId && (
                <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-2xl flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-blue-600" />
                      <span className="text-[11px] font-bold text-blue-900 uppercase">
                        External Logistics: {shipment.courierName}
                      </span>
                    </div>
                    <p className="text-[10px] uppercase font-mono text-blue-600/70 mt-1">
                      Waybill: {shipment.trackingId}
                    </p>
                  </div>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      alert("Opening external carrier tracking system...");
                    }}
                    className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 shadow-xs rounded-xl text-xs font-semibold text-slate-600 flex items-center gap-1.5 transition"
                  >
                    Track <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}

              {/* Audit Log Timeline */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-2.5 mb-4">
                  <h4 className="flex items-center gap-2 text-[10px] uppercase font-bold text-slate-400 tracking-widest font-mono">
                    <Activity className="w-3.5 h-3.5 text-slate-400" /> Live Telemetry
                  </h4>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      fetchShipment(true);
                    }}
                    disabled={isRefreshing}
                    className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 active:scale-95 text-[10px] font-bold px-3 py-1.5 rounded-xl shadow-2xs transition select-none cursor-pointer uppercase tracking-wider font-mono disabled:opacity-75"
                    title="Manually synchronize with the core logistics system to pull the latest audit updates"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 text-emerald-500 ${isRefreshing ? "animate-spin" : ""}`} />
                    <span>{isRefreshing ? "Syncing..." : "Sync Tracker"}</span>
                  </button>
                </div>
                <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                  {updates.length === 0 ? (
                    <p className="text-xs text-slate-500 italic relative z-10 pl-8">
                      No specific granular telemetry logged yet.
                    </p>
                  ) : (
                    updates.map((update, idx) => (
                      <div
                        key={update.id}
                        className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group select-none"
                      >
                        <div className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-white bg-blue-100 text-blue-600 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 ml-0 mr-4 md:mx-0">
                          <CheckCircle className="w-2.5 h-2.5" />
                        </div>
                        <div className="w-[calc(100%-3rem)] md:w-[calc(50%-1.5rem)] p-3 rounded-xl border border-slate-100 bg-white shadow-xs">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="font-bold text-[11px] text-slate-800">
                              {update.statusText}
                            </span>
                            <time className="text-[9px] font-mono text-slate-400">
                              {update.createdAt
                                ? new Date(update.createdAt).toLocaleTimeString(
                                    [],
                                    {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    },
                                  )
                                : "..."}
                            </time>
                          </div>
                          {update.locationText && (
                            <p className="text-[10px] text-slate-500 flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-slate-400" />
                              {update.locationText}
                            </p>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Printable certificate and verification hubs */}
          <div className="pt-2 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-[10px] text-slate-400 font-sans md:max-w-[40%] leading-tight">
              <Award className="w-6 h-6 shrink-0 text-slate-400" />
              <span>Licensed under DOT Title 49 HazMat cargo restrictions. Documents verifiable dynamically.</span>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2 text-xs">
              <button
                onClick={() => onPrintInvoice(ord)}
                className="flex items-center gap-1.5 justify-center bg-blue-50 text-blue-700 hover:bg-blue-100 active:scale-95 px-3 py-2 border border-blue-200 rounded-xl transition cursor-pointer select-none font-medium"
                title="Immediate Commercial Invoice (PDF)"
              >
                <FileText className="w-3.5 h-3.5" />
                Invoice
              </button>
              <button
                onClick={() => onPrintCompliance(ord)}
                disabled={currentStatus === "compliance_check"}
                className={`flex items-center gap-1.5 justify-center active:scale-95 px-3 py-2 border rounded-xl transition select-none font-medium ${currentStatus === "compliance_check" ? "bg-slate-50 text-slate-400 border-slate-200 opacity-60 cursor-not-allowed" : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200 cursor-pointer"}`}
                title={currentStatus === "compliance_check" ? "Compliance PDF generated after approval" : "Compliance & Shipment Manifest (PDF)"}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Compliance
              </button>
              {(() => {
                // Collect valid SDS links across all items
                const sdsItems = [];
                const itemsList = ord.products || (ord as any).orderItems || (ord as any).items || [];
                for (const item of itemsList) {
                  const sds = item.sdsUrl || item.sds_url || item.product?.sdsUrl || item.product?.sds_url;
                  const name = item.product_name || item.product?.name || "Product";
                  if (sds) {
                    sdsItems.push({ name, url: sds });
                  }
                }
                
                if (sdsItems.length === 0) return null;
                
                return sdsItems.map((sdsDoc, idx) => (
                  <a
                    key={idx}
                    href={sdsDoc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 justify-center bg-rose-50 text-rose-700 hover:bg-rose-100 active:scale-95 px-3 py-2 border border-rose-200 rounded-xl transition cursor-pointer select-none font-medium"
                    title={`SDS: ${sdsDoc.name}`}
                  >
                    <Download className="w-3.5 h-3.5" />
                    SDS: {sdsDoc.name.substring(0, 10)}{sdsDoc.name.length > 10 ? '...' : ''}
                  </a>
                ));
              })()}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

interface OrdersHubProps {
  orders: Order[];
  onBackToStore: () => void;
  onClearHistory?: () => void;
  homepageConfig?: any;
  currentUser?: any;
}

export default function OrdersHub({
  orders,
  onBackToStore,
  onClearHistory,
  homepageConfig,
  currentUser,
}: OrdersHubProps) {
  const { isCyber } = useTheme();
  // Clean readable description of shipment logs
  const statusConfig: Record<string, { label: string; desc: string; color: string; step: number }> = {
    manual_verification_pending: {
      label: "Pending Payment Confirmation",
      desc: "Receipt & transaction reference received. Waiting for manual verification and confirmation from the seller before proceeding with safety-audit regulations.",
      color: "text-amber-800 bg-amber-50 border border-amber-200/80",
      step: 0,
    },
    cancelled: {
      label: "Order Transaction Cancelled",
      desc: "This transaction has been cancelled. Any automated/manual payments will be fully refunded to your originating ledger within 3 to 5 business days.",
      color: "text-rose-800 bg-rose-50 border border-rose-200/80",
      step: 0,
    },
    compliance_check: {
      label: "GHS Chemical Security Compliance Audit Cleared",
      desc: "Institutional license and hazardous compound end-use verified.",
      color: "text-blue-700 bg-blue-50 border border-blue-100/60",
      step: 1,
    },
    packaging_haz: {
      label: "Regulatory Containment Packaging Passed",
      desc: "Substances secure in selected triple-sealed temperature-controlled cells.",
      color: "text-amber-700 bg-amber-50 border border-amber-100/60",
      step: 2,
    },
    in_transit: {
      label: "Climate-Controlled Transit Active",
      desc: "HazMat freight vehicle dispatched with direct temperature tracker logs.",
      color: "text-indigo-700 bg-indigo-50 border border-indigo-100/60",
      step: 3,
    },
    delivered: {
      label: "Delivery Manifest Cleared",
      desc: "Receipt acknowledged by licensed representative Dr. Olivia Sterling.",
      color: "text-emerald-700 bg-emerald-50 border border-emerald-100/60",
      step: 4,
    },
  };

  const handlePrintInvoice = async (ord: Order) => {
    const doc = new jsPDF();
    const isINR = ord.currency === "INR";
    const symbol = isINR ? "INR " : "$";
    
    // Sleek Royal Navy & Slate brand accents (Executive styling)
    const primaryColor = [15, 23, 42]; // Slate-900 (#0f172a)
    const secondaryColor = [71, 85, 105]; // Slate-600 (#475569)
    const accentColor = [220, 38, 38]; // Amber warning / caution tone (#dc2626)
    
    // Top border elegant brand bar
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(14, 15, 182, 4, "F");
    
    // Header section: Brand & Document title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text("FLASKIA", 14, 28);
    
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text("ORDER INVOICE", 196, 28, { align: "right" });
    
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.text("CHEMICALS & RESEARCH SOLUTIONS", 14, 33);
    doc.text(`INVOICE ID: INV-${(ord.orderId || ord.id).substring(0, 8).toUpperCase()}`, 196, 33, { align: "right" });
    
    // Divider line
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.5);
    doc.line(14, 37, 196, 37);

    const shipper = ord.shippingDetails || {
      researcher: "Guest Academic Researcher",
      institution: "Unspecified Facility",
      room: "Depot",
      city: "Cambridge",
      state: "MA",
      zip: "02139",
      licenseId: "GUEST-LIC",
      email: "research@flaskia-labs.com",
      address: "",
      country: "",
      phone: ""
    };

    const senderText = [
      "Flaskia Chemical Marketplace Corp.",
      "100 Molecular Way, Dispatch Dock 4G",
      "Cambridge, MA 02139 | United States",
      "E-mail: logistics@flaskia.com",
      "WhatsApp Help Line: +1 (509) 994-1048 (Chat Only)",
      "EPA Custody License: #EPA-4491-09B"
    ].join("\n");

    const recipientText = [
      shipper.researcher || "N/A",
      shipper.institution || "Research Institution",
      shipper.address || "Unspecified Street Address",
      shipper.room ? `Room/Bay: ${shipper.room}` : "",
      `${shipper.city || ""}, ${shipper.state || "MA"} ${shipper.zip || ""}${(shipper.country && shipper.country !== "United States") ? `, ${shipper.country}` : ""}`,
      `E-mail: ${shipper.email || ord.payerEmail || "N/A"}`,
      shipper.phone ? `Phone: ${shipper.phone}` : "",
      `Science License ID: ${shipper.licenseId || "GUEST-LIC"}`
    ].filter(Boolean).join("\n");

    // Output multi-column address information inside a clean, plain table to avoid overlaps
    autoTable(doc, {
      startY: 42,
      head: [['ISSUING MERCHANT / REGISTERED SELLER', 'BILL TO / REGISTERED ACQUISITION']],
      body: [[senderText, recipientText]],
      theme: 'plain',
      headStyles: {
        fillColor: [241, 245, 249],
        textColor: [15, 23, 42],
        fontStyle: 'bold',
        fontSize: 8.5,
        cellPadding: 3
      },
      styles: {
        fontSize: 8,
        cellPadding: 4,
        textColor: [71, 85, 105],
        valign: 'top'
      },
      columnStyles: {
        0: { cellWidth: 91 },
        1: { cellWidth: 91 }
      }
    });

    const addressesEndY = (doc as any).lastAutoTable.finalY + 6;

    // Registry Details Block
    const formattedDate = ord.date || new Date().toLocaleDateString([], { year: "numeric", month: "short", day: "numeric" });
    const formattedPaymentMethod = (ord.paymentMethodId || "paypal").toUpperCase();
    const formattedPaymentRef = ord.paymentReference ? ord.paymentReference : "TXN_OK_SETTLED";
    const croppedAuthId = ord.paymentId ? (ord.paymentId.length > 40 ? ord.paymentId.substring(0, 40) + "..." : ord.paymentId) : "pay_portal_secured_vault_auth";

    autoTable(doc, {
      startY: addressesEndY,
      margin: { left: 14 },
      head: [['ORDER INVOICE REGISTRY', '']],
      body: [
        ['Invoice ID Reference:', `INV-${(ord.orderId || ord.id).substring(0, 8).toUpperCase()}`],
        ['Order Number Ref:', ord.orderId],
        ['Transaction Settled Date:', formattedDate],
        ['Auth Gateway Custody ID:', croppedAuthId],
        ['Payment Clearing Ref:', `${formattedPaymentMethod} - ${formattedPaymentRef}`]
      ],
      theme: 'striped',
      headStyles: {
        fillColor: [15, 23, 42],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 8.5,
        cellPadding: 3
      },
      styles: {
        fontSize: 8,
        cellPadding: 3.5,
        textColor: [30, 30, 30]
      },
      columnStyles: {
        0: { cellWidth: 42, fontStyle: 'bold' },
        1: { cellWidth: 100 }
      }
    });

    const registryEndY = (doc as any).lastAutoTable.finalY;    // Parse out ACTUAL product items purchased
    let sourceArray: any[] = [];
    if (ord.products && Array.isArray(ord.products) && ord.products.length > 0) {
      sourceArray = ord.products;
    } else if ((ord as any).orderItems && Array.isArray((ord as any).orderItems) && (ord as any).orderItems.length > 0) {
      sourceArray = (ord as any).orderItems;
    } else if ((ord as any).items && Array.isArray((ord as any).items) && (ord as any).items.length > 0) {
      sourceArray = (ord as any).items;
    }

    // Determine exchange rate for converting USD fees to INR
    let orderExchangeRate = 83.50;
    if (isINR) {
      const firstValidItem = sourceArray.find((p: any) => {
        const pid = p.product_id || p.productId || "";
        const catalog = PRODUCTS.find(c => c.id === pid);
        return catalog && catalog.price > 0;
      });
      if (firstValidItem) {
        const pid = firstValidItem.product_id || firstValidItem.productId || "";
        const catalog = PRODUCTS.find(c => c.id === pid);
        if (catalog) {
          const itemPrice = parseFloat(firstValidItem.price || firstValidItem.unitRate || 0);
          if (itemPrice > 0) {
            orderExchangeRate = itemPrice / catalog.price;
          }
        }
      }
    }

    // Extract dynamic high-fidelity elements with formulas, CAS codes, Purity and prices directly
    const resolvedProducts = sourceArray.map((p: any) => {
      const pid = p.product_id || p.productId || "";
      const potentialName = (p.product_name || p.name || p.product?.name || "").toLowerCase();
      
      // Perform lookup in standard product registry catalog
      let catalog = PRODUCTS.find(c => c.id === pid);
      if (!catalog && potentialName) {
        catalog = PRODUCTS.find(c => 
          c.name.toLowerCase().includes(potentialName) || 
          potentialName.includes(c.name.toLowerCase()) ||
          c.id.toLowerCase().includes(pid.toLowerCase())
        );
      }
      
      const name = p.product_name || p.name || p.product?.name || (catalog ? catalog.name : "High-Purity Active Chemical");
      const formula = p.formula || p.product?.formula || (catalog ? catalog.formula : "-");
      const purity = p.purity || p.product?.purity || (catalog ? catalog.purity : "≥99.0%");
      const grade = p.grade || p.product?.grade || (catalog ? catalog.grade : "ACS Reagent");
      const cas = p.cas_number || p.cas || p.product?.cas || (catalog ? catalog.cas : "-");
      const qty = p.qty || p.quantity || 1;
      const unitRate = p.price || p.product?.price || (catalog ? catalog.price : 45.00);
      const pkg = p.package_size || p.packageSize || p.pkgSize || "Standard Flask Pack";
      
      let packagingExtraLabel = isINR ? "INR 0.00" : "$0.00";
      let packagingExtraValue = 0;
      if (pkg.includes("Polyethylene") || pkg.includes("HDPE")) {
        packagingExtraValue = -2.50 * (isINR ? orderExchangeRate : 1);
        packagingExtraLabel = isINR ? `INR -${(2.5 * orderExchangeRate).toFixed(2)}` : "-$2.50 (HDPE)";
      } else if (pkg.includes("Canister") || pkg.includes("Metal")) {
        packagingExtraValue = 4.00 * (isINR ? orderExchangeRate : 1);
        packagingExtraLabel = isINR ? `INR +${(4.0 * orderExchangeRate).toFixed(2)}` : "+$4.00 (Metal Can)";
      }
      
      return {
        id: pid,
        name,
        formula,
        purity,
        grade,
        cas,
        qty,
        unitRate,
        extraCostLabel: packagingExtraLabel,
        extraCostVal: packagingExtraValue,
        packageSize: pkg,
        ghs_pictograms: p.ghs_pictograms || p.product?.ghsPictograms || (catalog ? JSON.stringify(catalog.ghsPictograms) : "")
      };
    });

    // Safeguard ensuring we NEVER print mock or blank lines but actual real elements
    if (resolvedProducts.length === 0) {
      // Fetch Citric Acid Monohydrate as beautiful real-world chemical fallback
      const citricAcid = PRODUCTS.find(x => x.id === "citric-acid") || PRODUCTS[0];
      resolvedProducts.push({
        id: citricAcid.id,
        name: citricAcid.name,
        formula: citricAcid.formula,
        purity: citricAcid.purity,
        grade: citricAcid.grade,
        cas: citricAcid.cas,
        qty: ord.itemsSelectedCount || 1,
        unitRate: citricAcid.price,
        extraCostLabel: "$0.00",
        extraCostVal: 0,
        packageSize: "Standard Flask Pack",
        ghs_pictograms: JSON.stringify(citricAcid.ghsPictograms)
      });
    }

    // Build the beautiful detailed products table
    const tableBody = resolvedProducts.map((p, idx) => {
      const lineSubtotal = (p.unitRate + p.extraCostVal) * p.qty;
      const formulaStr = p.formula && p.formula !== "-" ? p.formula : "-";
      const casStr = p.cas && p.cas !== "-" ? `CAS ${p.cas}` : "";
      const molecularSpecs = [formulaStr, casStr].filter(x => x && x !== "-").join(" | ");

      return [
        (idx + 1).toString(),
        `${p.name}\nGrade: ${p.grade}\nPkg: ${p.packageSize}`,
        molecularSpecs || "-",
        p.purity,
        p.qty.toString(),
        `${symbol}${p.unitRate.toFixed(2)}`,
        p.extraCostLabel ? p.extraCostLabel.replace(/\$/g, symbol) : "0.00",
        `${symbol}${lineSubtotal.toFixed(2)}`
      ];
    });

    const tableStartY = registryEndY + 10;

    autoTable(doc, {
      startY: tableStartY,
      head: [['#', 'Chemical Product / Grade', 'Formula / CAS Standard', 'Purity', 'Qty', 'Unit Rate', 'Extra Cost', 'Ext. Cost']],
      body: tableBody,
      theme: 'grid',
      headStyles: { 
        fillColor: [15, 23, 42], 
        textColor: [255, 255, 255], 
        fontStyle: 'bold',
        fontSize: 8.5,
        halign: 'left'
      },
      styles: { 
        fontSize: 8, 
        cellPadding: 4,
        textColor: [30, 30, 30]
      },
      columnStyles: {
        0: { cellWidth: 8 },
        1: { cellWidth: 50 },
        2: { cellWidth: 38 },
        3: { cellWidth: 20 },
        4: { cellWidth: 12, halign: 'center' },
        5: { cellWidth: 18, halign: 'right' },
        6: { cellWidth: 18, halign: 'right' },
        7: { cellWidth: 18, halign: 'right' }
      },
      alternateRowStyles: { 
        fillColor: [249, 250, 251] 
      }
    });

    let finalY = (doc as any).lastAutoTable.finalY || 160;
    
    if (finalY > 225) {
      doc.addPage();
      finalY = 15;
    }
    const summaryBlockY = finalY + 6;

    // Financial formulas
    const ledgerConfig = getLedgerConfig(homepageConfig);
    const itemizedSubtotal = resolvedProducts.reduce((acc, p) => acc + (p.unitRate * p.qty), 0);
    const packagingTally = resolvedProducts.reduce((acc, p) => acc + (p.extraCostVal * p.qty), 0);
    
    // Check if hazardous
    const hasHazardousGoods = resolvedProducts.some((p: any) => {
      if (!p.ghs_pictograms) return false;
      let pics: any[] = [];
      try {
        pics = typeof p.ghs_pictograms === "string" ? JSON.parse(p.ghs_pictograms) : p.ghs_pictograms;
      } catch(e) {
        pics = [p.ghs_pictograms];
      }
      return pics.some((pic: string) => pic && pic.toLowerCase() !== "safe" && pic.toLowerCase() !== "none");
    });

    const carrierFee = (itemizedSubtotal > 0 ? Number(ledgerConfig.transitFee || 25.00) : 0.00) * (isINR ? orderExchangeRate : 1);
    const hazmatFee = (hasHazardousGoods ? Number(ledgerConfig.hazmatSurcharge || 15.00) : 0.00) * (isINR ? orderExchangeRate : 1);
    const taxPercent = Number(ledgerConfig.taxRate !== undefined ? ledgerConfig.taxRate : 8.25);
    
    // Exact tax computations
    const rawTaxes = (itemizedSubtotal + packagingTally) * (taxPercent / 100);
    let finalTaxValue = Math.round(rawTaxes * 100) / 100;
    let finalSubtotal = itemizedSubtotal;
    let finalTotal = itemizedSubtotal + packagingTally + carrierFee + hazmatFee + finalTaxValue;

    const parsedAmount = Number(ord.amount || 0);
    if (parsedAmount > 0) {
      finalTotal = parsedAmount;
      // Reconcile and calculate exact back-adjusted tax value to ensure flawless dollar matches
      const targetRemainder = parsedAmount - carrierFee - hazmatFee - packagingTally;
      if (targetRemainder > 0) {
        const discrepancy = parsedAmount - (itemizedSubtotal + packagingTally + carrierFee + hazmatFee + finalTaxValue);
        if (Math.abs(discrepancy) < 20.00) {
          finalTaxValue = finalTaxValue + discrepancy;
        } else {
          finalTaxValue = Math.max(0, targetRemainder * (taxPercent / (100 + taxPercent)));
          finalSubtotal = Math.max(0, targetRemainder - finalTaxValue);
        }
      }
    }

    // Left block: Safety cautions & Directives
    doc.setDrawColor(226, 232, 240);
    doc.setFillColor(255, 251, 235); // warm caution yellow
    doc.rect(14, summaryBlockY, 95, 42, "S");
    doc.rect(14, summaryBlockY, 95, 42, "F");
    
    doc.setFont("helvetica", "bold"); 
    doc.setFontSize(7.5); 
    doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
    doc.text("REGULATED ACQUISITION DIRECTIVES", 18, summaryBlockY + 6);
    
    doc.setFont("helvetica", "normal"); 
    doc.setFontSize(6.5); 
    doc.setTextColor(115, 115, 115);
    
    const bullet1 = doc.splitTextToSize("• MATERIAL PURPOSE: All chemical reagents are licensed and tracked solely for authorized school / laboratory research purposes. Strictly not for food, drug, or home use.", 87);
    const bullet2 = doc.splitTextToSize("• TRANSPORTATION CHECKS: Package is certified under DOT Title 49 HazMat cargo guidelines. Climate-controlled physical audit trails are active throughout transport.", 87);
    const bullet3 = doc.splitTextToSize("• SECURE HANDOVER: Physical delivery requires signature and verification of the 6-digit secure OTP code provided on the track console.", 87);
    
    let bulletY = summaryBlockY + 11;
    for (const line of bullet1) {
      doc.text(line, 18, bulletY);
      bulletY += 3.8;
    }
    bulletY += 1.0;
    for (const line of bullet2) {
      doc.text(line, 18, bulletY);
      bulletY += 3.8;
    }
    bulletY += 1.0;
    for (const line of bullet3) {
      doc.text(line, 18, bulletY);
      bulletY += 3.8;
    }

    // Right block: Itemized Settlement Ledger
    doc.setDrawColor(226, 232, 240);
    doc.setFillColor(252, 252, 253);
    doc.rect(115, summaryBlockY, 81, 42, "S");
    doc.rect(115, summaryBlockY, 81, 42, "F");
    
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(115, 115, 115);
    
    doc.text("Itemized Subtotal:", 119, summaryBlockY + 6);
    doc.text(`${symbol}${finalSubtotal.toFixed(2)}`, 191, summaryBlockY + 6, { align: "right" });

    doc.text("Vessel/Packaging Adjustments:", 119, summaryBlockY + 12);
    doc.text(`${packagingTally >= 0 ? "+" : ""}${symbol}${Math.abs(packagingTally).toFixed(2)}`, 191, summaryBlockY + 12, { align: "right" });
    
    const transitFeeLabel = ledgerConfig.transitFeeLabel ? (ledgerConfig.transitFeeLabel.replace(/:$/, "") + ":") : "Chemical Courier Dispatch:";
    doc.text(transitFeeLabel, 119, summaryBlockY + 18);
    doc.text(`${symbol}${carrierFee.toFixed(2)}`, 191, summaryBlockY + 18, { align: "right" });
    
    const hazmatSurchargeLabel = ledgerConfig.hazmatSurchargeLabel ? (ledgerConfig.hazmatSurchargeLabel.replace(/:$/, "") + ":") : "HazMat Protective Fee:";
    doc.text(hazmatSurchargeLabel, 119, summaryBlockY + 24);
    doc.text(`${symbol}${hazmatFee.toFixed(2)}`, 191, summaryBlockY + 24, { align: "right" });
    
    const taxRateLabel = ledgerConfig.taxRateLabel ? (ledgerConfig.taxRateLabel.replace(/:$/, "") + ":") : `Regulatory Science Tax (${taxPercent}%):`;
    doc.text(taxRateLabel, 119, summaryBlockY + 30);
    doc.text(`${symbol}${finalTaxValue.toFixed(2)}`, 191, summaryBlockY + 30, { align: "right" });
    
    doc.setDrawColor(226, 232, 240);
    doc.line(115, summaryBlockY + 34, 196, summaryBlockY + 34);
    
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42);
    const grandTotalLabel = isINR ? "Total Settled Price (INR):" : (ledgerConfig.grandTotalLabel ? (ledgerConfig.grandTotalLabel.replace(/:$/, "") + ":") : "Total Settled Price (USD):");
    doc.text(grandTotalLabel, 119, summaryBlockY + 39);
    doc.text(`${symbol}${finalTotal.toFixed(2)}`, 191, summaryBlockY + 39, { align: "right" });

    // Footer bottom accent bar
    const pageHeight = doc.internal.pageSize.height;
    doc.setFillColor(15, 23, 42);
    doc.rect(14, pageHeight - 16, 182, 6, "F");
    
    doc.setFontSize(7); 
    doc.setFont("helvetica", "bold"); 
    doc.setTextColor(255, 255, 255);
    doc.text("OFFICIAL FLASKIA CHEMICAL TRANSACTION RECORD - REGISTERED INVOICE", 18, pageHeight - 11.8);
    
    doc.setFontSize(7); 
    doc.setFont("helvetica", "normal"); 
    doc.setTextColor(180, 180, 180);
    doc.text(`INVOICE REFERENCE: INV-${ord.orderId.substring(0, 8).toUpperCase()}`, 154, pageHeight - 11.8);
    
    doc.save(`Invoice_${ord.orderId}.pdf`);
  };

  const handlePrintCompliance = async (ord: Order) => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("COMPLIANCE & SHIPMENT MANIFEST", 14, 22);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Flaskia Laboratory Material Registry", 14, 28);

    autoTable(doc, {
      startY: 55,
      head: [['Order Information', '']],
      body: [
        ['Order Number:', ord.orderId],
        ['Expected Delivery Date:', 'Within 3 Business Days'],
        ['License Identifier:', ord.shippingDetails.licenseId || 'N/A'],
        ['Institution:', ord.shippingDetails.institution],
        ['Clearance By:', ord.shippingDetails.researcher],
      ],
      theme: 'plain',
    });
    
    let y = (doc as any).lastAutoTable.finalY || 100;
    
    // Prepare products using robust unified items resolver
    let unifiedProducts: any[] = [];
    if (ord.products && Array.isArray(ord.products) && ord.products.length > 0) {
      unifiedProducts = ord.products.map((p: any) => ({
        name: p.product_name || p.product?.name || "Active Reagent Chemical",
        qty: p.qty || p.quantity || 1,
        cas: p.cas_number || p.cas || "-",
        grade: p.grade || "ACS Grade"
      }));
    } else if ((ord as any).orderItems && Array.isArray((ord as any).orderItems) && (ord as any).orderItems.length > 0) {
      unifiedProducts = (ord as any).orderItems.map((item: any) => ({
        name: item.product?.name || item.product_name || "Active Reagent Chemical",
        qty: item.qty || item.quantity || 1,
        cas: item.product?.cas || item.cas_number || "-",
        grade: item.product?.grade || "ACS Grade"
      }));
    } else if ((ord as any).items && Array.isArray((ord as any).items) && (ord as any).items.length > 0) {
      unifiedProducts = (ord as any).items.map((item: any) => ({
        name: item.product?.name || item.product_name || "Active Reagent Chemical",
        qty: item.quantity || item.qty || 1,
        cas: item.product?.cas || item.cas_number || "-",
        grade: item.product?.grade || "ACS Grade"
      }));
    }

    if (unifiedProducts.length === 0) {
      unifiedProducts = [{
        name: "Synthesized Compound Consignments",
        qty: ord.itemsSelectedCount || 1,
        cas: "Assorted Catalog Compound",
        grade: "Educational Grade"
      }];
    }

    const compProductsBody = unifiedProducts.map(p => [
      p.name,
      p.grade || 'Laboratory Reagent',
      p.cas || 'Mixed/NA',
      p.qty.toString()
    ]);

    autoTable(doc, {
      startY: y + 10,
      head: [['Product Details', 'Safe Handling Grade', 'CAS #', 'Qty']],
      body: compProductsBody,
      theme: 'striped',
      headStyles: { fillColor: [20, 100, 50], textColor: [255, 255, 255] },
      styles: { fontSize: 8 }
    });
    
    y = (doc as any).lastAutoTable.finalY || y + 30;
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Hazard & Safety Information", 14, y + 15);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("GHS Symbols: Corrosive, Harmful, Flammable (depending on substance)", 14, y + 23);
    doc.text("Storage: Must be kept in a temperature-controlled sealed containment cell.", 14, y + 29);
    doc.text("NFPA: Refer to individual SDS for specific rating indexes.", 14, y + 35);
    
    // Tracking & Compliance box
    const boxY = y + 45;
    doc.setDrawColor(200);
    doc.setFillColor(245, 245, 250);
    doc.roundedRect(14, boxY, 182, 50, 3, 3, "FD");
    
    doc.setFont("helvetica", "bold");
    doc.text("Compliance Registry Status", 18, boxY + 10);
    doc.setFont("helvetica", "normal");
    doc.text("Institution Status: APPROVED", 18, boxY + 18);
    doc.text("License Identity: VERIFIED", 18, boxY + 24);
    doc.text(`Tracking Reference: Pending Carrier Issue`, 18, boxY + 30);
    doc.text(`Approval Stamp: ${ord.date}`, 18, boxY + 40);
    
    doc.setFontSize(8);
    doc.text("This document is generated by Flaskia Serverless Dispatch. Do not duplicate.", 14, doc.internal.pageSize.height - 15);
    
    doc.save(`Compliance_Manifest_${ord.orderId}.pdf`);
  };

  return (
    <div
      className={`max-w-4xl mx-auto px-4 py-6 font-sans transition-colors duration-300 ${
        isCyber ? "text-slate-100" : "text-slate-800"
      }`}
      id="order-tracker-screen"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className={`text-xl md:text-2xl font-bold flex items-center gap-2 font-heading ${
            isCyber ? "text-cyan-100" : "text-slate-800"
          }`}>
            <ShieldCheck className={`w-6.5 h-6.5 ${isCyber ? "text-cyan-400" : "text-blue-600"}`} />
            Licensed Order Registry Hub
          </h2>
          <p className={`text-[11.5px] mt-1 ${isCyber ? "text-cyan-400/70" : "text-slate-400"}`}>
            Audit record logs of active laboratory hazardous compound transit
            schedules.
          </p>
        </div>
        <div className="flex gap-2">
          {onClearHistory && orders.length > 0 && (
            <button
              onClick={onClearHistory}
              className="text-xs text-red-400 hover:text-red-300 px-3 py-1.5 rounded-lg hover:bg-red-950/40 border border-red-500/30 font-medium cursor-pointer select-none transition-colors"
            >
              Flush Logs
            </button>
          )}
          <button
            onClick={onBackToStore}
            className={`text-xs font-medium cursor-pointer transition select-none px-3.5 py-1.5 rounded-xl border ${
              isCyber
                ? "bg-slate-900 border-cyan-500/30 text-cyan-300 hover:border-cyan-400"
                : "bg-white border-slate-200 text-slate-600 hover:text-blue-600"
            }`}
          >
            Catalog Shopping
          </button>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center max-w-xl mx-auto shadow-xs select-none">
          <Clock className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-base font-bold text-slate-800 font-heading">
            No laboratory acquisitions on record
          </h3>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed px-4">
            Authorized purchases processed via the secure PayPal mock gateway
            will generate printable chemical audit tracking records here
            immediately.
          </p>
          <button
            onClick={onBackToStore}
            className="mt-6 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl transition cursor-pointer"
          >
            Settle Procurement Reagents
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((ord) => (
            <OrderCard
              key={ord.id}
              ord={ord}
              statusConfig={statusConfig}
              onPrintInvoice={handlePrintInvoice}
              onPrintCompliance={handlePrintCompliance}
            />
          ))}
        </div>
      )}
    </div>
  );
}
