import React, { useEffect, useState, useRef } from "react";
import { User, Package, Clock, Sparkles } from "lucide-react";

export interface InquiryItem {
  id: string;
  product_id?: string;
  product_name?: string;
  buyer_name?: string;
  quantity?: string;
  delivery_pincode?: string;
  created_at?: string;
  time_ago?: string;
  status?: string;
}

interface LiveInquiryTickerProps {
  inquiries?: InquiryItem[];
  onOpenInquiry?: () => void;
  onSelectProductById?: (productId: string) => void;
  theme?: "indiamart" | "retail" | "emerald";
}

function formatTimeAgo(dateStr?: string): string {
  if (!dateStr) return "Just now";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "Recently";
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  if (seconds < 10) return "Just now";
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function LiveInquiryTicker({
  inquiries = [],
  onOpenInquiry,
  onSelectProductById,
  theme = "indiamart",
}: LiveInquiryTickerProps) {
  const [items, setItems] = useState<InquiryItem[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Fetch real customer inquiries from backend database
  useEffect(() => {
    const fetchRealInquiries = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/inquiries");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            const mapped: InquiryItem[] = data.map((item: any) => ({
              id: item.id || `INQ-${Math.random()}`,
              product_id: item.product_id || item.productId || "",
              product_name: item.product_name || item.productName || "Chemical Product",
              buyer_name: item.buyer_name || item.buyerName || "Verified Buyer",
              quantity: item.quantity || "1",
              delivery_pincode: item.delivery_pincode || item.deliveryPincode || "",
              created_at: item.created_at,
              time_ago: formatTimeAgo(item.created_at),
              status: item.status || "PENDING",
            }));
            setItems(mapped);
          }
        }
      } catch (err) {
        console.error("Error fetching live inquiries:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (inquiries && inquiries.length > 0) {
      const mappedProps = inquiries.map((item) => ({
        ...item,
        time_ago: formatTimeAgo(item.created_at),
      }));
      setItems(mappedProps);
      setIsLoading(false);
    } else {
      fetchRealInquiries();
    }
  }, [inquiries]);

  // Ultra-smooth 60fps requestAnimationFrame ticker loop with seamless wrapping
  useEffect(() => {
    if (isPaused || items.length === 0) return;

    let animId: number;
    const speed = 0.8; // Pixels per frame (smooth & readable speed)

    const animate = () => {
      if (scrollContainerRef.current) {
        const el = scrollContainerRef.current;
        el.scrollLeft += speed;

        // When scrolled past half (the end of the first duplicated set), wrap back seamlessly
        const halfWidth = el.scrollWidth / 2;
        if (halfWidth > 0 && el.scrollLeft >= halfWidth) {
          el.scrollLeft -= halfWidth;
        }
      }
      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);

    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, [isPaused, items.length]);

  // Duplicate items array so scrolling is 100% infinite and seamless
  const displayItems = items.length > 0 ? [...items, ...items] : [];

  return (
    <div className="bg-[#1e2638] text-slate-100 border-t border-b border-slate-700/80 text-xs py-2 px-2 md:px-4 relative overflow-hidden select-none shadow-inner w-full">
      <div className="w-full flex items-center">
        {/* Slidable Marquee Container or Empty State */}
        {items.length > 0 ? (
          <div
            ref={scrollContainerRef}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
            className="w-full overflow-x-auto no-scrollbar flex items-center gap-3 whitespace-nowrap py-0.5"
          >
            {displayItems.map((item, index) => (
              <div
                key={`${item.id}-${index}`}
                onClick={() => {
                  if (onSelectProductById && item.product_id) {
                    onSelectProductById(item.product_id);
                  }
                }}
                className="inline-flex items-center gap-2.5 bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:border-emerald-500/60 px-3 py-1.5 rounded-xl text-[11px] cursor-pointer transition-all duration-200 group shadow-xs shrink-0"
              >
                {/* Buyer icon & name */}
                <div className="flex items-center gap-1.5 text-slate-200 font-semibold">
                  <User className="w-3.5 h-3.5 text-emerald-400 shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="text-white font-bold max-w-[140px] truncate">{item.buyer_name}</span>
                </div>

                <span className="text-slate-600 font-bold">•</span>

                {/* Product name & ID */}
                <div className="flex items-center gap-1 text-slate-300">
                  <Package className="w-3 h-3 text-amber-400 shrink-0" />
                  <span className="font-medium max-w-[180px] truncate text-amber-200 group-hover:text-amber-100">
                    {item.product_name}
                  </span>
                  {item.product_id && (
                    <span className="text-[9.5px] font-mono bg-slate-800 text-slate-400 px-1.5 py-0.2 rounded border border-slate-700">
                      ID: {item.product_id}
                    </span>
                  )}
                </div>

                {/* Quantity requested */}
                {item.quantity && (
                  <>
                    <span className="text-slate-600 font-bold">•</span>
                    <span className="text-emerald-300 font-mono text-[10px] bg-emerald-950/60 border border-emerald-800/50 px-1.5 py-0.2 rounded">
                      Qty: {item.quantity}
                    </span>
                  </>
                )}

                {/* Relative timestamp from Database */}
                <div className="flex items-center gap-1 text-[9.5px] text-slate-400 font-mono ml-1">
                  <Clock className="w-2.5 h-2.5 text-slate-500" />
                  <span>{item.time_ago}</span>
                </div>

                {/* Status Tag */}
                <span className="bg-emerald-500/20 text-emerald-300 text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded tracking-wide border border-emerald-500/40">
                  {item.status || "LIVE RFQ"}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-between gap-3 text-slate-300 text-xs px-2 py-0.5">
            <span className="flex items-center gap-2 text-slate-300 font-medium truncate">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 animate-pulse" />
              <span>{isLoading ? "Loading real database inquiries..." : "No customer inquiries logged yet. Be the first buyer to post a B2B inquiry!"}</span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
