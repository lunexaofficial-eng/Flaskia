import React from "react";
import { useTheme } from "../context/ThemeContext";
import CurrencySelector from "./CurrencySelector";
import {
  ShoppingBag,
  Search,
  Award,
  Activity,
  FlaskConical,
  ShieldCheck,
  Globe,
  Cpu,
  Sparkles,
  Beaker,
  Heart,
  X,
} from "lucide-react";

interface HeaderProps {
  currentView: string;
  cartCount: number;
  onNavigate: (view: any) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenHelp: () => void;
  appName?: string;
  appBrandBadge?: string;
  appSubtitle?: string;
  appLogoIcon?: string;
  currentUser?: any;
  onLogout?: () => void;
  onOpenInquiry?: (product?: any) => void;
  onSelectProductById?: (productId: string) => void;
  inquiries?: any[];
}

const getLogoIcon = (iconName: string) => {
  switch (iconName) {
    case "Award":
      return Award;
    case "Activity":
      return Activity;
    case "ShieldCheck":
      return ShieldCheck;
    case "Globe":
      return Globe;
    case "Cpu":
      return Cpu;
    case "Sparkles":
      return Sparkles;
    case "Beaker":
      return Beaker;
    case "Heart":
      return Heart;
    case "FlaskConical":
    default:
      return FlaskConical;
  }
};

export default function Header({
  currentView,
  cartCount,
  onNavigate,
  searchQuery,
  onSearchChange,
  onOpenHelp,
  appName = "Flaskia",
  appLogoIcon = "FlaskConical",
  currentUser,
  onLogout,
  onOpenInquiry,
}: HeaderProps) {
  const { isIndiamart } = useTheme();
  const TargetIcon = getLogoIcon(appLogoIcon);

  return (
    <header
      className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/90 text-slate-900 font-sans select-none"
      id="app-header"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-10 h-16 flex items-center justify-between gap-4">
        {/* 1. Brand Logo & Wordmark */}
        <div
          onClick={() => onNavigate("store")}
          className="flex items-center gap-2.5 cursor-pointer group shrink-0"
        >
          <div className="w-9 h-9 rounded-lg bg-[#0052cc] text-white flex items-center justify-center group-hover:bg-[#0747a6] transition-colors">
            <TargetIcon className="w-5 h-5 text-white stroke-[2]" />
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900 font-heading">
            {appName}
          </span>
        </div>

        {/* 2. Search Bar */}
        <div className="hidden sm:flex flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by chemical name, CAS number, or formula..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-xs text-slate-900 bg-slate-50 border border-slate-200 rounded-lg outline-none placeholder-slate-400 focus:bg-white focus:border-[#0052cc] focus:ring-2 focus:ring-[#0052cc]/10 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* 3. Navigation & Actions */}
        <div className="flex items-center gap-5 shrink-0">
          <nav className="hidden lg:flex items-center gap-6 text-xs font-medium text-slate-600">
            <button
              onClick={() => onNavigate("store")}
              className={`cursor-pointer transition-colors py-1 ${
                currentView === "store"
                  ? "text-[#0052cc] font-semibold"
                  : "hover:text-slate-900"
              }`}
            >
              Catalog
            </button>

            {isIndiamart ? (
              <button
                onClick={() => onNavigate("inquiries")}
                className={`cursor-pointer transition-colors py-1 ${
                  currentView === "inquiries"
                    ? "text-[#0052cc] font-semibold"
                    : "hover:text-slate-900"
                }`}
              >
                Inquiries
              </button>
            ) : (
              <button
                onClick={() => onNavigate("orders")}
                className={`cursor-pointer transition-colors py-1 ${
                  currentView === "orders"
                    ? "text-[#0052cc] font-semibold"
                    : "hover:text-slate-900"
                }`}
              >
                Orders
              </button>
            )}

            <button
              onClick={onOpenHelp}
              className="cursor-pointer hover:text-slate-900 transition-colors py-1"
            >
              Safety & FAQ
            </button>
          </nav>

          <div className="h-4 w-px bg-slate-200 hidden lg:block" />

          <div className="flex items-center gap-2.5">
            <CurrencySelector align="right" />

            {!isIndiamart && (
              currentUser ? (
                <div className="hidden md:flex items-center gap-2">
                  <button
                    onClick={() => onNavigate("profile")}
                    className={`text-xs font-medium px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      currentView === "profile"
                        ? "bg-slate-100 text-slate-900 font-semibold"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    {currentUser.displayName || currentUser.email?.split("@")[0] || "Account"}
                  </button>
                  {onLogout && (
                    <button
                      onClick={onLogout}
                      className="text-xs font-medium text-slate-500 hover:text-rose-600 px-2 py-1.5 cursor-pointer transition-colors"
                    >
                      Sign Out
                    </button>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => onNavigate("orders")}
                  className="hidden md:inline-flex px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100 cursor-pointer transition-colors"
                >
                  Sign In
                </button>
              )
            )}

            {isIndiamart ? (
              <button
                onClick={() => {
                  if (onOpenInquiry) onOpenInquiry();
                }}
                className="px-4 py-2 bg-[#0052cc] hover:bg-[#0747a6] text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer whitespace-nowrap"
              >
                Request Quote
              </button>
            ) : (
              <button
                onClick={() => onNavigate("checkout")}
                className="flex items-center gap-2 px-4 py-2 bg-[#0052cc] hover:bg-[#0747a6] text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer whitespace-nowrap"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Cart</span>
                {cartCount > 0 && (
                  <span className="font-mono text-[11px] font-bold bg-white/20 px-1.5 py-0.2 rounded">
                    {cartCount}
                  </span>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="sm:hidden px-4 pb-3">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search reagents, CAS #, or formula..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-8 py-2 text-xs text-slate-900 bg-slate-50 border border-slate-200 rounded-lg outline-none placeholder-slate-400 focus:bg-white focus:border-[#0052cc]"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}


