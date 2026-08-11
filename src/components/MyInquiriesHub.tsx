import React, { useState, useEffect } from "react";
import { getProxiedImageUrl } from "../utils/imageUtils";
import {
  MessageSquare,
  Package,
  Send,
  Clock,
  CheckCircle,
  User,
  Building2,
  Phone,
  MapPin,
  Sparkles,
  ArrowLeft,
  Search,
  Filter,
  RefreshCw,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Mail,
  Lock,
} from "lucide-react";
import CustomerAuth from "./CustomerAuth";

export interface InquiryMessage {
  id: string;
  inquiry_id: string;
  sender_role: "ADMIN" | "CUSTOMER";
  sender_name: string;
  sender_email: string;
  message: string;
  created_at: string;
}

export interface InquiryItem {
  id: string;
  product_id: string;
  product_name: string;
  product_image?: string;
  price?: string;
  quantity: string;
  buyer_name: string;
  buyer_email: string;
  buyer_phone?: string;
  company_name?: string;
  delivery_pincode?: string;
  notes?: string;
  status: string;
  created_at: string;
  updated_at?: string;
  messages?: InquiryMessage[];
}

interface MyInquiriesHubProps {
  currentUser: any;
  onBackToStore: () => void;
  onSelectProductById?: (productId: string) => void;
  onUpdateUser?: (user: any) => void;
}

export default function MyInquiriesHub({
  currentUser,
  onBackToStore,
  onSelectProductById,
  onUpdateUser,
}: MyInquiriesHubProps) {
  const [inquiries, setInquiries] = useState<InquiryItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [expandedThreadId, setExpandedThreadId] = useState<string | null>(null);
  const [replyInput, setReplyInput] = useState<{ [inquiryId: string]: string }>({});
  const [sendingReplyId, setSendingReplyId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [manualEmail, setManualEmail] = useState<string>("");

  const activeEmail = currentUser?.email || manualEmail;

  const fetchMyInquiries = async (showRefreshSpinner = false) => {
    if (!activeEmail) {
      setIsLoading(false);
      return;
    }

    if (showRefreshSpinner) setIsRefreshing(true);
    else setIsLoading(true);

    try {
      const res = await fetch(`/api/my-inquiries?email=${encodeURIComponent(activeEmail)}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setInquiries(data);
          // Auto expand first inquiry if available
          if (data.length > 0 && !expandedThreadId) {
            setExpandedThreadId(data[0].id);
          }
        }
      }
    } catch (err) {
      console.error("Failed to fetch customer inquiries:", err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMyInquiries();
  }, [activeEmail]);

  const handleSendReply = async (inquiryId: string) => {
    const text = replyInput[inquiryId]?.trim();
    if (!text) return;

    setSendingReplyId(inquiryId);
    try {
      const res = await fetch(`/api/inquiries/${inquiryId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderRole: "CUSTOMER",
          senderName: currentUser?.fullName || currentUser?.buyer_name || "Customer",
          senderEmail: activeEmail,
          message: text,
        }),
      });

      if (res.ok) {
        const result = await res.json();
        // Clear reply box
        setReplyInput((prev) => ({ ...prev, [inquiryId]: "" }));
        // Refresh inquiry list to reflect new message and status
        await fetchMyInquiries(true);
      }
    } catch (err) {
      console.error("Failed to send reply message:", err);
    } finally {
      setSendingReplyId(null);
    }
  };

  const filteredInquiries = inquiries.filter((inq) => {
    if (statusFilter !== "ALL" && inq.status !== statusFilter) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      inq.id.toLowerCase().includes(q) ||
      inq.product_name.toLowerCase().includes(q) ||
      (inq.company_name || "").toLowerCase().includes(q) ||
      (inq.notes || "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 select-none font-sans space-y-6">
      
      {/* Top Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToStore}
            className="p-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-700 transition cursor-pointer"
            title="Return to store catalog"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2 font-heading">
              <MessageSquare className="w-6 h-6 text-emerald-600" />
              My B2B Inquiry Center
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Track active price quotes, RFQs, and communicate directly with Flaskia B2B Supplier Admin
            </p>
          </div>
        </div>

        {activeEmail && (
          <div className="flex items-center gap-2.5">
            <div className="bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-slate-600 font-medium">Logged in as:</span>
              <span className="font-bold font-mono text-emerald-800">{activeEmail}</span>
            </div>
            <button
              onClick={() => fetchMyInquiries(true)}
              disabled={isRefreshing}
              className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition cursor-pointer flex items-center gap-1 text-xs font-bold"
            >
              <RefreshCw className={`w-4 h-4 text-emerald-600 ${isRefreshing ? "animate-spin" : ""}`} />
              <span className="hidden md:inline">Refresh</span>
            </button>
          </div>
        )}
      </div>

      {/* Auth Guard if no email set */}
      {!activeEmail ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-8 max-w-xl mx-auto text-center space-y-6 shadow-sm">
          <div className="w-14 h-14 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-center mx-auto text-emerald-600">
            <Lock className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 font-heading">Authenticate Your Email</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto leading-relaxed">
              Enter your registered email address to access your private B2B quote inquiries, vendor messages, and wholesale price quotes.
            </p>
          </div>

          <div className="flex gap-2 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter registered email (e.g., buyer@company.com)"
              value={manualEmail}
              onChange={(e) => setManualEmail(e.target.value)}
              className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-emerald-600 focus:bg-white text-slate-900"
            />
            <button
              onClick={() => fetchMyInquiries()}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition cursor-pointer shadow-sm"
            >
              View Inquiries
            </button>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <p className="text-[11px] text-slate-400 mb-4">Or sign in with OTP via Customer Authentication:</p>
            <CustomerAuth
              onAuthSuccess={(user) => {
                if (onUpdateUser) onUpdateUser(user);
                setManualEmail(user.email);
              }}
            />
          </div>
        </div>
      ) : isLoading ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-16 text-center space-y-3 shadow-xs">
          <div className="w-10 h-10 border-3 border-slate-200 border-t-emerald-600 rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-mono">Fetching your private customer inquiries from Neon Database...</p>
        </div>
      ) : inquiries.length === 0 ? (
        /* Empty State */
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-5 shadow-xs">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto text-slate-400">
            <MessageSquare className="w-8 h-8 text-emerald-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800 font-heading">No B2B Inquiries Found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto leading-relaxed">
              You haven't submitted any product RFQs or price quote requests yet for <span className="font-semibold text-slate-700">{activeEmail}</span>.
            </p>
          </div>
          <button
            onClick={onBackToStore}
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-xl text-xs transition cursor-pointer shadow-md active:scale-95"
          >
            <Sparkles className="w-4 h-4" />
            <span>Browse Chemical Catalog & Request RFQ</span>
          </button>
        </div>
      ) : (
        /* Main Inquiries Ledger View */
        <div className="space-y-6">
          
          {/* Controls Bar: Filters & Search */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            {/* Filter Pills */}
            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto no-scrollbar">
              {["ALL", "PENDING", "APPROVED", "REPLIED", "RESOLVED", "CLOSED"].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                    statusFilter === st
                      ? "bg-slate-900 text-white shadow-xs"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                  }`}
                >
                  {st === "ALL" ? `All (${inquiries.length})` : st}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3.5 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by ID, product, notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-emerald-600 focus:bg-white text-slate-900"
              />
            </div>
          </div>

          {/* Inquiries Thread Cards */}
          <div className="space-y-4">
            {filteredInquiries.map((inq) => {
              const isExpanded = expandedThreadId === inq.id;
              const messages = inq.messages || [];

              return (
                <div
                  key={inq.id}
                  className={`bg-white rounded-2xl border transition duration-200 overflow-hidden shadow-xs ${
                    isExpanded ? "border-emerald-500/80 ring-2 ring-emerald-500/10" : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  {/* Card Header Header Bar */}
                  <div
                    onClick={() => setExpandedThreadId(isExpanded ? null : inq.id)}
                    className="p-5 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/80 transition"
                  >
                    <div className="flex items-start gap-4">
                      {inq.product_image ? (
                        <img
                          src={getProxiedImageUrl(inq.product_image)}
                          alt={inq.product_name}
                          className="w-12 h-12 object-contain rounded-xl bg-slate-50 p-1 border border-slate-200 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0 font-bold text-base">
                          🧪
                        </div>
                      )}

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs font-black text-slate-900">#{inq.id}</span>
                          <span className="text-[10px] font-mono text-slate-400">•</span>
                          <span className="text-xs text-slate-500">
                            {new Date(inq.created_at).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}
                          </span>
                        </div>

                        <h4 className="text-sm font-bold text-slate-900 hover:text-emerald-700 transition">
                          {inq.product_name}
                        </h4>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                          <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono text-[11px] font-extrabold px-2 py-0.5 rounded-lg">
                            Qty: {inq.quantity}
                          </span>
                          {inq.company_name && (
                            <span className="flex items-center gap-1 font-medium text-slate-600">
                              <Building2 className="w-3.5 h-3.5 text-slate-400" />
                              {inq.company_name}
                            </span>
                          )}
                          {inq.delivery_pincode && (
                            <span className="flex items-center gap-1 font-mono text-[11px] text-slate-500">
                              <MapPin className="w-3.5 h-3.5 text-slate-400" />
                              Pincode: {inq.delivery_pincode}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Status Badge & Toggle Button */}
                    <div className="flex items-center gap-3 self-end md:self-center">
                      <span
                        className={`text-[11px] font-extrabold uppercase px-3 py-1 rounded-xl border font-mono tracking-wide ${
                          inq.status === "APPROVED"
                            ? "bg-emerald-600 text-white border-emerald-700 shadow-sm"
                            : inq.status === "RESOLVED"
                            ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                            : inq.status === "REPLIED"
                            ? "bg-blue-100 text-blue-800 border-blue-300"
                            : inq.status === "CLOSED" || inq.status === "REJECTED"
                            ? "bg-slate-100 text-slate-600 border-slate-300"
                            : "bg-amber-100 text-amber-800 border-amber-300 animate-pulse"
                        }`}
                      >
                        {inq.status === "APPROVED"
                          ? "✅ Quote Approved"
                          : inq.status === "REPLIED"
                          ? "💬 Admin Replied"
                          : inq.status}
                      </span>

                      <button className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg">
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Threaded Message Chat & Reply Drawer */}
                  {isExpanded && (
                    <div className="border-t border-slate-200 bg-slate-50/50 p-5 space-y-5">
                      
                      {/* Initial RFQ Details */}
                      <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
                        <div className="font-bold text-slate-700 uppercase tracking-wider font-mono text-[10px]">
                          Initial B2B Quotation Requirement
                        </div>
                        <p className="text-slate-800 leading-relaxed italic">"{inq.notes || "Standard quotation request"}"</p>
                      </div>

                      {/* Threaded Messages List */}
                      <div className="space-y-3.5">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                          Conversation History ({messages.length} messages)
                        </div>

                        {messages.length === 0 ? (
                          <div className="text-center py-4 text-xs text-slate-400 italic">
                            No messages in this thread yet.
                          </div>
                        ) : (
                          messages.map((msg) => {
                            const isAdmin = msg.sender_role === "ADMIN";

                            return (
                              <div
                                key={msg.id}
                                className={`flex flex-col max-w-2xl ${
                                  isAdmin ? "mr-auto items-start" : "ml-auto items-end"
                                }`}
                              >
                                <div className="flex items-center gap-1.5 text-[10.5px] text-slate-500 mb-1 px-1">
                                  {isAdmin ? (
                                    <>
                                      <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                                      <span className="font-bold text-blue-900">Flaskia Admin Support</span>
                                    </>
                                  ) : (
                                    <>
                                      <User className="w-3.5 h-3.5 text-emerald-600" />
                                      <span className="font-bold text-slate-700">{msg.sender_name || "You"}</span>
                                    </>
                                  )}
                                  <span>•</span>
                                  <span className="font-mono text-[9.5px]">
                                    {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                  </span>
                                </div>

                                <div
                                  className={`p-3.5 rounded-2xl text-xs leading-relaxed shadow-2xs whitespace-pre-wrap ${
                                    isAdmin
                                      ? "bg-blue-600 text-white rounded-tl-none border border-blue-700"
                                      : "bg-emerald-600 text-white rounded-tr-none border border-emerald-700"
                                  }`}
                                >
                                  {msg.message}
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>

                      {/* Customer Reply Input Box */}
                      <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3 shadow-xs">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                          <Send className="w-4 h-4 text-emerald-600" />
                          <span>Send Reply to Supplier Admin</span>
                        </div>

                        <textarea
                          rows={3}
                          placeholder="Type your message, query, or follow-up regarding this quote..."
                          value={replyInput[inq.id] || ""}
                          onChange={(e) =>
                            setReplyInput((prev) => ({ ...prev, [inq.id]: e.target.value }))
                          }
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:border-emerald-600 focus:bg-white text-slate-900 placeholder:text-slate-400 resize-none"
                        />

                        <div className="flex items-center justify-between pt-1">
                          <span className="text-[10px] text-slate-400 font-mono">
                            Replies are sent directly to Flaskia B2B Admin ledger
                          </span>
                          <button
                            onClick={() => handleSendReply(inq.id)}
                            disabled={sendingReplyId === inq.id || !replyInput[inq.id]?.trim()}
                            className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold px-5 py-2 rounded-xl text-xs transition cursor-pointer flex items-center gap-2 shadow-xs"
                          >
                            {sendingReplyId === inq.id ? (
                              <>
                                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                <span>Sending...</span>
                              </>
                            ) : (
                              <>
                                <Send className="w-3.5 h-3.5" />
                                <span>Post Reply</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      )}

    </div>
  );
}
