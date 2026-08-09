import React, { useState, useMemo, useEffect } from "react";
import { 
  X, 
  Search, 
  HelpCircle, 
  ShieldCheck, 
  Truck, 
  FlaskConical, 
  ChevronDown, 
  MessageSquare, 
  AlertOctagon, 
  ArrowRight,
  Info,
  Sparkles
} from "lucide-react";

interface HelpFaqProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FaqItem {
  id: string;
  category: "safety" | "shipping" | "compliance";
  question: string;
  answer: string;
  keywords: string[];
}

export default function HelpFaq({ isOpen, onClose }: HelpFaqProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "safety" | "shipping" | "compliance">("all");
  const [expandedFaq, setExpandedFaq] = useState<string | null>("safety-1");
  const [userQuery, setUserQuery] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [faqItems, setFaqItems] = useState<FaqItem[]>([]);

  // Fetch FAQ list from REST API on open
  useEffect(() => {
    if (isOpen) {
      fetch("/api/faqs")
        .then((res) => {
          if (!res.ok) throw new Error("Server error");
          return res.json();
        })
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            setFaqItems(data);
          }
        })
        .catch((err) => {
          console.error("Failed to load FAQs, using client-side safety backup lists:", err);
        });
    }
  }, [isOpen]);

  // Client-side backup list when loading or in standalone preview Mode
  const backupFaqItems: FaqItem[] = useMemo(() => [
    {
      id: "safety-1",
      category: "safety",
      question: "What are GHS Pictograms and why are they important?",
      answer: "GHS (Globally Harmonized System) pictograms are standardized graphic symbols used to communicate specific hazard information on chemical labels and Safety Data Sheets (SDS). They classify physical, environmental, and health hazards (e.g., Flammability, Toxicity, Corrosion) to alert laboratory personnel and support safe storage and handling precautions prior to synthesis.",
      keywords: ["ghs", "pictogram", "hazard", "label", "symbol", "classification"]
    },
    {
      id: "safety-2",
      category: "safety",
      question: "How should I handle a potential chemical spill or emergency?",
      answer: "Always follow your institution's specific chemical hygiene protocol: (1) Immediately isolate the area and notify others. (2) Consult the product's Safety Data Sheet (Section 6: Accidental Release Measures) to identify the neutralizer or absorbents required. (3) Equip appropriate PPE (goggles, chemical-resistant gloves, apron). (4) Carefully clean up using solid binder material or spill kits, package the waste in a designated heavy-duty container, and consult local environmental safety guidelines for disposal.",
      keywords: ["spill", "emergency", "handling", "clean", "safety", "accident"]
    },
    {
      id: "safety-3",
      category: "safety",
      question: "What is an SDS (Safety Data Sheet) and how can I find it?",
      answer: "An SDS is a comprehensive document detailing safety, physical properties, toxicity, ecological impacts, chemical transport classification, and disposal recommendations. You can access the complete SDS for any Rexvora reagent by clicking on the product card to open 'Detailed Specs' and expanding the interactive SDS section, which outlines OSHA-compliant Sections 1 through 16.",
      keywords: ["sds", "safety data sheet", "pdf", "section", "document", "spec"]
    },
    {
      id: "safety-4",
      category: "safety",
      question: "What do the NFPA 704 Diamond values represent?",
      answer: "The National Fire Protection Association (NFPA) 704 standard uses a color-coded quadrant diamond to convey risk: Blue indicates Health hazard, Red indicates Flammability, Yellow indicates Instability, and White lists Special Hazards (such as oxidizers, acidic compounds, or air/water reactive chemicals). Values range from 0 (minimal risk, like pure water) to 4 (extreme reactive danger, like unstable concentrated organic peroxides).",
      keywords: ["nfpa", "diamond", "color", "red", "blue", "yellow", "health", "flammability"]
    },
    {
      id: "shipping-1",
      category: "shipping",
      question: "Why is there a Hazmat surcharge on certain products?",
      answer: "State and international department of transportation (DOT) regulations categorize certain high-purity chemical reagents as hazardous materials (Hazmat Class 3, 8, or 9). These products require climate-temperature buffers, double-walled specialized containment packaging, and secure handling during dispatch. To offset the high insurance risk and mandatory certified logistics carriers, a $15.00 Hazmat surcharge is automatically applied to orders containing active hazard reagents.",
      keywords: ["hazmat", "shipping", "surcharge", "delivery", "fee", "cost", "transport"]
    },
    {
      id: "shipping-2",
      category: "shipping",
      question: "Can chemicals be shipped directly to residential/home addresses?",
      answer: "No. To maintain custody control, prevent accidental poisoning, and abide by environmental regulations, Rexvora strictly ships academic reagents and laboratory equipment to verified educational institutions, commercial facilities, and dedicated research entities with active license credentials. Residential deliveries of chemical reagents are completely prohibited.",
      keywords: ["residential", "home", "address", "shipping", "place", "deliver"]
    },
    {
      id: "shipping-3",
      category: "shipping",
      question: "What temperature controls are used during transit?",
      answer: "Rexvora utilizes proprietary climate-regulated packaging consisting of thermal insulated foil inserts and cold gel packs for high-volatility compounds or sensitive indicators. This shields reagents from excessive summer heat spikes or extreme winter drops, preserving chemical stability and preventing container pressurized degasification from synthesis warehouse to classroom labs.",
      keywords: ["temperature", "transit", "climate", "cold", "heat", "stability"]
    },
    {
      id: "compliance-1",
      category: "compliance",
      question: "Do I need institutional verification or a license to purchase?",
      answer: "Yes. Rexvora requires all customers seeking active chemical reagents to register with a valid institutional identifier, academic email, researchers' credentials, and a chemical custody license matching DEA, OSHA, or local toxic control regulations. You can input these credentials during checkout. Our automated compliance checker verifies licenses against active registries before dispatch.",
      keywords: ["license", "verification", "institution", "academic", "purchase", "checkout"]
    },
    {
      id: "compliance-2",
      category: "compliance",
      question: "What is the difference between chemical grades (e.g., ACS vs. Tech)?",
      answer: "ACS Reagent grade indicates the chemical conforms to strict purity specifications set by the American Chemical Society (usually ≥95-99% absolute concentration with micro-impurity thresholds), making it high-fidelity for quantitative analysis. Technical or Educational grade chemicals are lower-cost solutions designed for school demonstrations where extremely minute trace metallic impurities will not disrupt experiment synthesis outcomes.",
      keywords: ["grade", "purity", "acs", "reagent", "technical", "difference", "demonstration"]
    },
    {
      id: "compliance-3",
      category: "compliance",
      question: "How does Rexvora uphold legal custody regulations?",
      answer: "Our operations comply directly with EPA toxic control standards, DOT transport manuals, and OSHA safety guidelines. All orders undergo rigorous institutional checks, and all packaging includes physical safety documentation (SDS and GHS warning prints) directly in the parcel. We also record strict digital logs of lot numbers, purities, and transport chains for complete traceability.",
      keywords: ["regulation", "compliance", "legal", "safety", "epa", "osha", "traceability"]
    }
  ], []);

  // Use dynamic items, fallback to static defaults if not yet fetched or empty
  const activeFaqItems = faqItems.length > 0 ? faqItems : backupFaqItems;

  // Compute item counts for category badges dynamically
  const categoryCounts = useMemo(() => {
    const counts = { all: activeFaqItems.length, safety: 0, shipping: 0, compliance: 0 };
    activeFaqItems.forEach((item) => {
      counts[item.category] = (counts[item.category] || 0) + 1;
    });
    return counts;
  }, [activeFaqItems]);

  // Filter based on search query and category tab
  const filteredFaqs = useMemo(() => {
    return activeFaqItems.filter((item) => {
      const matchesCategory = activeTab === "all" || item.category === activeTab;
      const query = (searchQuery || "").trim().toLowerCase();
      if (!query) return matchesCategory;
      
      const qText = (item.question || "").toLowerCase();
      const aText = (item.answer || "").toLowerCase();
      const kwList = item.keywords || [];
      
      return matchesCategory && (
        qText.includes(query) ||
        aText.includes(query) ||
        kwList.some((kw) => (kw || "").toLowerCase().includes(query))
      );
    });
  }, [activeFaqItems, activeTab, searchQuery]);

  const toggleExpand = (id: string) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  const handleQuerySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuery.trim()) return;
    
    setSubmitSuccess(true);
    setUserQuery("");
    setTimeout(() => setSubmitSuccess(false), 5000);
  };

  // Quick action search trigger terms
  const quickSearchTags = ["SDS Sheets", "Hazmat Fee", "License", "ACS Grade", "Spill Acc"];

  const handleSelectQuickTag = (tag: string) => {
    let searchVal = tag;
    if (tag === "SDS Sheets") searchVal = "sds";
    else if (tag === "Hazmat Fee") searchVal = "hazmat";
    else if (tag === "License") searchVal = "license";
    else if (tag === "ACS Grade") searchVal = "acs";
    else if (tag === "Spill Acc") searchVal = "spill";
    
    setSearchQuery(searchVal);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end md:items-center justify-end bg-slate-950/70 backdrop-blur-xs select-none p-0 md:p-4 transition-all duration-300"
      id="help-faq-overlay-wrapper"
    >
      {/* Background click to close */}
      <div className="absolute inset-0 cursor-pointer" onClick={onClose} />

      {/* Slide-out FAQ Card panel - Full-height on mobile, refined side-drawer on desktop */}
      <div 
        className="relative w-full md:max-w-2xl h-[95vh] md:h-[90vh] lg:h-[85vh] bg-white border-t md:border border-slate-200 rounded-t-3xl md:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-slide-in justify-between select-text"
        id="help-faq-panel"
      >
        {/* Header Section */}
        <div className="border-b border-slate-100 p-4 md:p-6 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
              <HelpCircle className="w-5 h-5 md:w-5.5 md:h-5.5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm md:text-base font-extrabold text-slate-800 tracking-tight leading-tight flex items-center gap-1.5">
                <span>Help & Safety Center</span>
                <span className="hidden sm:inline-flex items-center gap-1 bg-blue-100/60 text-blue-700 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider font-mono">
                  <Sparkles className="w-2.5 h-2.5" /> Live FAQ
                </span>
              </h2>
              <p className="text-[10px] md:text-[11px] text-slate-400 font-medium uppercase font-mono tracking-wider truncate">
                Regulatory Standards & Laboratory safety manuals
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 cursor-pointer shrink-0 hover:scale-102 active:scale-98"
            id="close-help-faq-btn"
            title="Close Help & FAQ"
          >
            <span className="text-sm">❌</span>
            <span>Close</span>
          </button>
        </div>

        {/* Search & Tabs Panel */}
        <div className="p-4 md:p-6 pb-2 space-y-3 shrink-0">
          <div className="relative">
            <input 
              type="text"
              placeholder="Search safety keywords, SDS, Hazmat limits, storage, etc..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:bg-white rounded-xl pl-9 pr-8 py-2 md:py-2.5 text-xs text-slate-800 placeholder-slate-400 transition outline-none"
              id="faq-search-input"
            />
            <Search className="absolute left-3 top-2.5 md:top-3 w-4 h-4 text-slate-400" />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-2.5 md:top-3 text-[10px] text-slate-400 hover:text-slate-600 cursor-pointer font-semibold"
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick-select Safety query tags */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[10px] select-none">
            <span className="text-slate-400 font-bold uppercase font-mono shrink-0 mr-1">Quick:</span>
            {quickSearchTags.map((tag) => (
              <button
                key={tag}
                onClick={() => handleSelectQuickTag(tag)}
                className="px-2 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 border border-slate-200 hover:border-blue-200 rounded-md text-[10px] text-slate-600 font-medium cursor-pointer transition shrink-0"
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Fully Responsive Tab Strip */}
          <div className="flex gap-1 overflow-x-auto pb-1.5 scrollbar-none border-b border-slate-150">
            {[
              { id: "all", label: "All QA", icon: HelpCircle, count: categoryCounts.all },
              { id: "safety", label: "Safety Laws", icon: FlaskConical, count: categoryCounts.safety },
              { id: "shipping", label: "Hazmat / Shipping", icon: Truck, count: categoryCounts.shipping },
              { id: "compliance", label: "GHS Standard", icon: ShieldCheck, count: categoryCounts.compliance }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1.5 shrink-0 transition cursor-pointer ${
                    activeTab === tab.id
                      ? "bg-blue-600 text-white shadow-xs"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{tab.label}</span>
                  <span className={`inline-block font-mono text-[9px] px-1.5 py-0.2 rounded-full font-bold ${
                    activeTab === tab.id ? "bg-blue-700 text-blue-100" : "bg-slate-200 text-slate-600"
                  }`}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Scrollable Accordion Wrapper */}
        <div className="flex-1 overflow-y-auto px-4 md:px-6 py-2 space-y-3">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-10 bg-slate-50 border border-slate-200 border-dashed rounded-2xl max-w-md mx-auto my-6 p-4">
              <AlertOctagon className="w-9 h-9 text-slate-400 mx-auto mb-3" />
              <h4 className="text-xs font-bold text-slate-700">No matching manuals located</h4>
              <p className="text-[11px] text-slate-400 mt-1 leading-normal max-w-xs mx-auto">
                No articles matching "{searchQuery}" under the selected tab. Try testing clear tags like "SDS", "purity", or click "Clear" to restart.
              </p>
            </div>
          ) : (
            filteredFaqs.map((item) => {
              const isExpanded = expandedFaq === item.id;
              return (
                <div 
                  key={item.id}
                  className={`border rounded-xl md:rounded-2xl transition-all duration-150 ${
                    isExpanded 
                      ? "bg-blue-50/20 border-blue-200/80 shadow-xs" 
                      : "bg-white border-slate-200 hover:border-slate-300"
                  }`}
                  id={`faq-item-${item.id}`}
                >
                  <button
                    onClick={() => toggleExpand(item.id)}
                    className="w-full text-left px-4 md:px-5 py-3 md:py-4 flex items-center justify-between gap-3 cursor-pointer"
                  >
                    <span className="text-xs font-bold text-slate-800 tracking-tight leading-snug">
                      {item.question}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isExpanded ? "rotate-180 text-blue-500" : ""
                    }`} />
                  </button>
                  
                  {isExpanded && (
                    <div className="px-4 md:px-5 pb-4 md:pb-5 pt-0.5 text-xs text-slate-600 leading-relaxed border-t border-slate-100/80 animate-fade-in select-text">
                      <p className="whitespace-pre-line leading-relaxed text-slate-600 font-sans">{item.answer}</p>
                      <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-3 border-t border-slate-200/40 text-[9px] text-slate-400 font-mono uppercase">
                        <span className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-500 font-bold">
                          CAT: {item.category}
                        </span>
                        <span>•</span>
                        <span>DHS-SDS Certified Chemical Safety Sheet</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer query form - fully responsive & flex wrap secure */}
        <div className="border-t border-slate-100 p-4 md:p-6 bg-slate-50 space-y-4 shrink-0">
          <div className="hidden sm:flex items-start gap-3 bg-blue-50/50 border border-blue-100/50 p-3 rounded-2xl">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div className="text-[10px] md:text-[11px] text-slate-500 leading-normal">
              <strong>Institutional procurement limits:</strong> For custom commercial requests, bulk high-purity syntheses, or government order tax exemptions, please specify your credentials.
            </div>
          </div>

          <form onSubmit={handleQuerySubmit} className="space-y-2">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <label className="text-[10px] md:text-[11px] text-slate-600 font-bold truncate" htmlFor="support-query-input">
                Still have safety or transit questions? Log with our safety desk:
              </label>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <input 
                id="support-query-input"
                type="text"
                placeholder="Ask about storage, compliance, or SDS updates..."
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                className="flex-1 bg-white border border-slate-200 hover:border-slate-300 focus:border-blue-500 rounded-xl px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 transition outline-none"
              />
              <div className="flex gap-2 shrink-0">
                <button 
                  type="submit"
                  className="flex-1 sm:flex-none px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-97"
                >
                  <span>Send Query</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button 
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-extrabold transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-97"
                  title="Close Manual"
                  id="footer-faq-close-btn"
                >
                  <span>Close ❌</span>
                </button>
              </div>
            </div>

            {submitSuccess && (
              <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 mt-1 animate-fade-in">
                <ShieldCheck className="w-3 h-3 text-emerald-500 shrink-0" />
                <span>Query indexed safely. Operational safety expert will respond to your registered laboratory email!</span>
              </p>
            )}
          </form>
        </div>

      </div>
    </div>
  );
}
