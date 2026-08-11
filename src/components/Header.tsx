import React from "react";
import { useTheme } from "../context/ThemeContext";
import CurrencySelector from "./CurrencySelector";
import LiveInquiryTicker from "./LiveInquiryTicker";
import { 
  ShoppingBag, 
  Search, 
  FileText, 
  Award, 
  Activity, 
  FlaskConical, 
  ShieldCheck, 
  Menu,
  HelpCircle,
  Globe,
  Cpu,
  Sparkles,
  Beaker,
  Heart,
  MapPin,
  ChevronDown,
  Zap,
  ShoppingCart,
  User,
  PackageCheck
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
    case "Award": return Award;
    case "Activity": return Activity;
    case "ShieldCheck": return ShieldCheck;
    case "Globe": return Globe;
    case "Cpu": return Cpu;
    case "Sparkles": return Sparkles;
    case "Beaker": return Beaker;
    case "Heart": return Heart;
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
  appBrandBadge = "PRO",
  appSubtitle = "Academic Supply Direct",
  appLogoIcon = "FlaskConical",
  currentUser,
  onLogout,
  onOpenInquiry,
  onSelectProductById,
  inquiries = [],
}: HeaderProps) {
  const { isRetail, isIndiamart } = useTheme();
  const TargetIcon = getLogoIcon(appLogoIcon);

  if (isIndiamart) {
    // IndiaMART B2B Procurement Theme Header
    return (
      <header className="sticky top-0 z-50 font-sans select-none shadow-md" id="app-header-indiamart">
        {/* Primary B2B Navigation Bar (IndiaMART Teal & White Accent) */}
        <div className="bg-white border-b border-slate-200 text-slate-800 px-4 md:px-8 py-3">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
            
            {/* Logo */}
            <div 
              onClick={() => onNavigate("store")}
              className="flex items-center gap-3 cursor-pointer group shrink-0"
            >
              <div className="w-10 h-10 rounded-xl bg-[#2e7d32] text-white flex items-center justify-center font-extrabold text-xl shadow-md group-hover:scale-105 transition-transform">
                <TargetIcon className="w-5.5 h-5.5 text-white stroke-[2.25] group-hover:rotate-12 transition-transform duration-300" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-extrabold tracking-tight text-slate-900 font-sans">{appName}</span>
                  <span className="bg-[#00a699] text-white text-[9.5px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                    {appBrandBadge || "CHEMICALS"}
                  </span>
                </div>
                <p className="text-[10px] text-emerald-800 font-bold font-mono">{appSubtitle || "Chemicals & Research Solutions"}</p>
              </div>
            </div>

            {/* IndiaMART Big Search Bar */}
            <div className="flex-1 max-w-2xl mx-0 md:mx-4">
              <div className="flex rounded-xl overflow-hidden bg-slate-50 border-2 border-[#2e7d32] shadow-xs focus-within:ring-2 focus-within:ring-[#00a699]">
                <button className="hidden sm:flex items-center gap-1 bg-slate-100 text-slate-700 text-xs px-3 font-bold border-r border-slate-200">
                  <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                  <span>All Suppliers</span>
                </button>
                <input
                  type="text"
                  placeholder="Enter chemical name, CAS #, molecular formula, or product ID..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full px-3 py-2 text-xs text-slate-900 outline-none bg-white placeholder-slate-400 font-medium"
                />
                <button className="bg-[#2e7d32] hover:bg-[#1b5e20] text-white px-6 font-bold text-xs cursor-pointer transition flex items-center gap-1.5 uppercase tracking-wider">
                  <Search className="w-4 h-4" />
                  <span className="hidden sm:inline">Search Quotes</span>
                </button>
              </div>
            </div>

            {/* Post Requirement & RFQ Actions */}
            <div className="flex items-center justify-between md:justify-end gap-2.5 text-xs">
              
              <CurrencySelector align="left" />

              <button
                onClick={() => onNavigate("store")}
                className="flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-[#2e7d32] font-extrabold px-3 py-2 rounded-xl text-xs transition cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#00a699]" />
                <span className="hidden sm:inline">Browse Catalog</span>
              </button>

              <button
                onClick={() => onNavigate("inquiries")}
                className="flex items-center gap-1.5 bg-[#2e7d32] hover:bg-[#1b5e20] text-white font-extrabold px-4 py-2 rounded-xl text-xs transition cursor-pointer shadow-md active:scale-95"
              >
                <FileText className="w-4 h-4" />
                <span>My Inquiries</span>
              </button>

            </div>

          </div>
        </div>

        {/* Live Slidable Customer Inquiry History Stream Ticker */}
        <LiveInquiryTicker 
          inquiries={inquiries}
          onOpenInquiry={onOpenInquiry}
          onSelectProductById={onSelectProductById}
          theme="indiamart"
        />
      </header>
    );
  }

  if (isRetail) {
    // Amazon & Flipkart Retail Powerhouse Theme Header
    return (
      <header className="sticky top-0 z-50 font-sans select-none shadow-md" id="app-header-retail">
        {/* Primary Retail Header Bar (Amazon #131921 / Flipkart Blue Navbar) */}
        <div className="bg-[#131921] text-white px-4 md:px-8 py-2.5">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
            
            {/* Logo + Delivery Pincode Selector */}
            <div className="flex items-center gap-4 justify-between md:justify-start">
              <div 
                onClick={() => onNavigate("store")}
                className="flex items-center gap-2 cursor-pointer group shrink-0"
              >
                <div className="w-9 h-9 rounded-md bg-[#febd69] flex items-center justify-center text-slate-900 font-bold shadow-sm group-hover:scale-105 transition-transform">
                  <TargetIcon className="w-5 h-5 text-slate-900" />
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="text-lg font-black tracking-tight text-white font-heading">{appName}</span>
                    <span className="bg-[#ff9f00] text-slate-950 text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider">
                      PLUS
                    </span>
                  </div>
                  <p className="text-[9.5px] text-amber-400 font-medium font-mono">Retail Marketplace</p>
                </div>
              </div>

              {/* Delivery Address Indicator */}
              <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-300 border-l border-slate-700 pl-4 py-0.5 cursor-pointer hover:text-white">
                <MapPin className="w-4 h-4 text-[#febd69]" />
                <div>
                  <div className="text-[10px] text-slate-400 font-mono">Deliver to</div>
                  <div className="font-bold text-slate-100 flex items-center gap-0.5 text-[11px]">
                    New York 10001 <ChevronDown className="w-3 h-3 text-slate-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Amazon / Flipkart Big Search Bar */}
            <div className="flex-1 max-w-2xl mx-0 md:mx-4">
              <div className="flex rounded-md overflow-hidden bg-white shadow-sm border border-slate-300 focus-within:ring-2 focus-within:ring-[#febd69]">
                <button className="hidden sm:flex items-center gap-1 bg-slate-100 text-slate-700 text-xs px-3 font-medium border-r border-slate-200 hover:bg-slate-200">
                  <span>All</span>
                  <ChevronDown className="w-3 h-3 text-slate-500" />
                </button>
                <input
                  type="text"
                  placeholder="Search Amazon & Flipkart Direct for products, reagents, equipment..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full px-3 py-2 text-xs text-slate-900 outline-none placeholder-slate-400 font-sans"
                />
                <button className="bg-[#febd69] hover:bg-[#f3a847] text-slate-900 px-5 font-bold cursor-pointer transition flex items-center justify-center">
                  <Search className="w-4.5 h-4.5 text-slate-900" />
                </button>
              </div>
            </div>

            {/* Account & Cart Actions */}
            <div className="flex items-center justify-between md:justify-end gap-3 text-xs">
              
              {/* Account Dropdown */}
              {currentUser ? (
                <div 
                  onClick={() => onNavigate("profile")}
                  className="flex items-center gap-2 cursor-pointer hover:text-amber-300 px-2 py-1 rounded transition"
                >
                  <User className="w-4 h-4 text-[#febd69]" />
                  <div className="text-left">
                    <div className="text-[10px] text-slate-300">Hello, {currentUser.displayName || currentUser.email?.split("@")[0]}</div>
                    <div className="font-bold text-white text-[11px] flex items-center gap-1">
                      Account & Orders <ChevronDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => onNavigate("orders")}
                  className="flex items-center gap-1.5 bg-[#ff9f00] hover:bg-[#e08c00] text-slate-950 font-bold px-3 py-1.5 rounded text-xs transition cursor-pointer shadow-xs"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>
              )}

              {/* Orders Link */}
              <button
                onClick={() => onNavigate("orders")}
                className="hidden sm:flex flex-col text-left hover:text-amber-300 px-2 py-1 rounded transition cursor-pointer"
              >
                <span className="text-[10px] text-slate-400">Returns</span>
                <span className="font-bold text-white text-[11px]">& Orders</span>
              </button>

              {/* Cart Button */}
              <button
                onClick={() => onNavigate("checkout")}
                className="flex items-center gap-2 bg-[#ffe11b] hover:bg-[#ecd013] text-slate-950 font-extrabold px-4 py-2 rounded transition cursor-pointer shadow-sm active:scale-95"
              >
                <div className="relative">
                  <ShoppingCart className="w-5 h-5 text-slate-950" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-rose-600 text-white font-mono text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-white">
                      {cartCount}
                    </span>
                  )}
                </div>
                <span className="hidden sm:inline font-sans text-xs">Cart</span>
              </button>

            </div>
          </div>
        </div>

        {/* Live Slidable Customer Inquiry History Stream Ticker */}
        <LiveInquiryTicker 
          inquiries={inquiries}
          onOpenInquiry={onOpenInquiry}
          onSelectProductById={onSelectProductById}
          theme="retail"
        />
      </header>
    );
  }

  // Emerald Standard Theme Header
  return (
    <header 
      className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 text-slate-900 shadow-xs px-4 md:px-10 py-3.5 select-none font-sans"
      id="app-header"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Brand Logo & Academic Label */}
        <div 
          onClick={() => onNavigate("store")}
          className="flex items-center gap-2.5 cursor-pointer group active:scale-98 transition duration-150"
        >
          <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white bg-blue-600 shadow-xs">
            <TargetIcon className="w-5.5 h-5.5 text-white stroke-2 group-hover:rotate-12 transition-transform duration-300" />
          </div>
          <div>
            <h1 className="text-[17px] font-bold tracking-tight flex items-center gap-1.5 leading-none font-heading text-slate-900">
              {appName}
              {appBrandBadge && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded border bg-slate-100 text-slate-600 border-slate-200">
                  {appBrandBadge}
                </span>
              )}
            </h1>
            <p className="text-[10px] mt-1 uppercase tracking-wider font-semibold font-mono text-slate-400">{appSubtitle}</p>
          </div>
        </div>

        {/* Global Catalog Filter Input */}
        <div className="relative flex-1 max-w-md mx-0 md:mx-6">
          <input
            type="text"
            placeholder="Search catalog by reagent name, GHS class, or CAS #..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-xl pl-9 pr-4 py-2 text-xs transition-all font-sans outline-none shadow-xs bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:bg-white hover:border-slate-300"
          />
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          {searchQuery && (
            <button 
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-2.5 text-[10px] cursor-pointer text-slate-400 hover:text-slate-600"
            >
              Clear
            </button>
          )}
        </div>

        {/* Action Controls & Navigation tabs */}
        <div className="flex items-center gap-3.5 justify-between md:justify-end">
          <CurrencySelector align="right" />

          <nav className="flex items-center gap-2">
            <button
              onClick={() => onNavigate("store")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition ${
                currentView === "store" ? "bg-slate-100 text-slate-900" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Catalog
            </button>

            {currentUser && (
              <>
                <button
                  onClick={() => onNavigate("orders")}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition ${
                    currentView === "orders" ? "bg-slate-100 text-slate-900" : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Order Tracker
                </button>
                <button
                  onClick={() => onNavigate("profile")}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition ${
                    currentView === "profile" ? "bg-slate-100 text-slate-900" : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Profile
                </button>
              </>
            )}
            
            <button
              onClick={onOpenHelp}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition flex items-center gap-1 border bg-slate-50 border-slate-200/60 text-slate-500 hover:text-slate-800 hover:bg-slate-100"
              id="header-help-btn"
            >
              <HelpCircle className="w-3.5 h-3.5 text-blue-500" />
              <span>Help</span>
            </button>
          </nav>

          <span className="h-4 w-px hidden md:block bg-slate-200" />

          {/* User auth state buttons */}
          {currentUser ? (
            <div className="hidden lg:flex items-center gap-2" id="header-user-panel">
              <span 
                onClick={() => onNavigate("profile")}
                className={`text-[10.5px] font-mono cursor-pointer transition px-2.5 py-1 rounded-lg border ${
                  currentView === "profile" 
                    ? "bg-slate-100 border-slate-300 text-slate-800" 
                    : "bg-slate-100 border-slate-200 text-slate-500 hover:bg-slate-50"
                }`}
                title={`Logged in as ${currentUser.email}. Click to view profile.`}
              >
                🔬 {currentUser.displayName || currentUser.email?.split("@")[0] || "Scholar"}
              </span>
              {onLogout && (
                <button
                  onClick={onLogout}
                  className="px-3 py-1.5 text-[11px] font-semibold rounded-lg cursor-pointer transition text-rose-600 hover:bg-slate-100"
                >
                  Sign Out
                </button>
              )}
            </div>
          ) : (
            <button
              onClick={() => onNavigate("orders")}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition border bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200"
            >
              Sign In
            </button>
          )}

          {/* Cart triggers */}
          <button
            onClick={() => onNavigate("checkout")}
            className="flex items-center gap-2 font-semibold px-4 py-2 rounded-xl transition duration-150 active:scale-95 shadow-sm text-xs cursor-pointer bg-blue-600 hover:bg-blue-700 text-white"
            title="Proceed to Cart & Checkout"
          >
            <ShoppingBag className="w-4 h-4 mr-0.5 text-white" />
            <span>Checkout</span>
            {cartCount > 0 && (
              <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 bg-white text-blue-600">
                {cartCount}
              </span>
            )}
          </button>
        </div>

      </div>

      {/* Live Slidable Customer Inquiry History Stream Ticker */}
      <LiveInquiryTicker 
        inquiries={inquiries}
        onOpenInquiry={onOpenInquiry}
        onSelectProductById={onSelectProductById}
        theme="emerald"
      />
    </header>
  );
}


