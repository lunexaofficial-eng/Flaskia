import React, { useState } from "react";
import { 
  X, 
  Info, 
  Mail, 
  Phone, 
  MapPin, 
  ShieldAlert, 
  FileCheck, 
  Scale, 
  Truck, 
  RotateCcw, 
  BookOpen, 
  AlertTriangle, 
  Database, 
  Send,
  Building,
  CheckCircle,
  Clock,
  ShieldCheck,
  FileText,
  MessageCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export type PolicyTab = 
  | "about"
  | "contact"
  | "privacy"
  | "terms"
  | "refund"
  | "shipping"
  | "return"
  | "compliance"
  | "disclaimer"
  | "cookie";

interface CompanyPoliciesProps {
  initialTab?: PolicyTab;
  onBack: () => void;
  appName?: string;
  appSubtitle?: string;
  footerCompanyName?: string;
}

export default function CompanyPolicies({
  initialTab = "about",
  onBack,
  appName = "Rexvora",
  appSubtitle = "Academic Supply Direct",
  footerCompanyName = "Rexvora Supplies International Co."
}: CompanyPoliciesProps) {
  const [activeTab, setActiveTab] = useState<PolicyTab>(initialTab);
  const [policies, setPolicies] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    fetch("/api/policies")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setPolicies(data);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching live policies:", err);
        setIsLoading(false);
      });
  }, []);

  const getPolicyData = (id: PolicyTab) => {
    const dbPolicy = policies.find((p) => p.id === id);
    if (dbPolicy) {
      return {
        title: dbPolicy.title,
        subtitle: dbPolicy.subtitle,
        content: dbPolicy.content,
      };
    }

    // Static default fallbacks if database not accessible
    switch (id) {
      case "about":
        return {
          title: "About {appName}",
          subtitle: "{appSubtitle} — Serving academia and verified synthesis complexes.",
          content: `Founded under the vision of democratizing clinical-grade lab chemicals for schools and research cooperatives, **{appName}** has evolved from a boutique reagents formulator into a leading domestic provider of laboratory standard chemicals, precise buffer configurations, pH indicators, and resilient borosilicate glass instruments.\n\nOur facility implements climate-locked warehousing logic, advanced DOT compliance automation for hazmat transit class routing, and meticulous batch record checks. This guarantees that your chemistry laboratory receives materials of the exact technical, laboratory, or ACS reagent grade documented.\n\nEquipping the next generation of chemists is a duty of absolute security. By providing full MSDS data and strict license checks, {appName} remains a trusted logistical companion for thousands of public science centers, high school chemistry labs, and academic research ecosystems.`,
        };
      case "contact":
        return {
          title: "Contact Us",
          subtitle: "Our support staff, physical logistics desk, and regulatory officers are at your service.",
          content: `Headquarters: {footerCompanyName}\nScience logistics park, Bay 9, Seattle, WA 98101\n\nEmail: support@rexvora.com, compliance@rexvora.com\nWhatsApp Helpline: +1 (509) 994-1048 (Text Only, Chat 24/7)\n\nFor chemical spills or transport accidents in transit, refer directly to DOT Emergency Response Guidebook (ERG) instructions.`,
        };
      case "privacy":
        return {
          title: "Privacy Policy",
          subtitle: "Approved regulatory database management and institution registration protocols.",
          content: `Because our operations involve shipping chemical substances classification materials, we maintain a secure, encrypted procurement register. This dataset contains verified researcher profiles, official academic email addresses, delivery licenses, and active billing addresses. This records system aligns directly with security compliance regulations and is fully isolated from retail tracking data.\n\nUnder certain regional toxic substances bylaws, we are legally required to document transaction logs containing names, lot numbers, and institutions for DEA List chemicals and certain hazardous indicators. This transaction data is maintained securely in our private servers and is accessible only to compliance auditors.\n\nWe never have, and never will, sell, lease, or license institutional order histories, user info, email chains, or scientific safety logs to marketing agencies, advertising networks, or third-party web tracking enterprises. Cookies are dedicated exclusively to preserving your custom session identifiers and chemical checkout cart state.`,
        };
      case "terms":
        return {
          title: "Terms & Conditions",
          subtitle: "Legal conditions under which active laboratory chemical items are distributed.",
          content: `By checking out on the **{appName} Sandbox Checkout Portal**, you explicitly certify that you are an adult representative representing a school of science, a certified chemistry educational program, or a corporate laboratory entity. You must provide a valid chemistry end-use agreement verification and accept that materials will strictly reside inside accredited facility stores.\n\nAll chemical reagents are barred from dispatch to private, residential, hotel, or PO Box locations. Orders attempting to leverage home addresses will be systematically cancelled. We reserve the absolute right to suspend any customer profile mimicking an accredited institution to bypass security gates.\n\nSubstances procured through this catalog cannot be transferred to unverified third parties, exported, or diverted for home experimentation, manufacturing of pyrotechnics, or synthetic drugs. Violation of this agreement triggers swift reports containing lot numbers to appropriate federal chemistry agencies.`,
        };
      case "compliance":
        return {
          title: "Compliance Policy",
          subtitle: "How regulatory frameworks are implemented in {appName}'s logistics chain.",
          content: `We execute rigorous checks to ensure safety pictograms, signal words (Danger/Warning), and hazard phrases match OSHA Standard 29 CFR 1910.1200 HazCom specifications. Our inventory systems run immediate CAS-number filters to detect restricted precursors or regulated reagents. For any substance presenting GHS Health rating \u2265 3 (e.g. skin corrosion, toxicity indicators, severe carcinogenicity risk), system safety logic blocks checkout until the user declares a binding laboratory end-use compliance agreement.\n\nEach reagent dispatch contains isolated batch lot codes linked to our formulation reports. Under regulatory bylaws, we maintain full custody archives for at least seven (7) years to permit immediate lot recalls, temperature disruption flags, and compliance review requests.`,
        };
      case "disclaimer":
        return {
          title: "Safety Disclaimer",
          subtitle: "Binding precautions regarding handling and experiment execution.",
          content: `All compounds, reagents, buffering solutions, and certified indicators listed under the catalog of **{appName}** are manufactured exclusively to serve academic demonstrations, analytical titrations, scientific modeling synthesis, and secondary science laboratories.\n\nThese chemicals are **strictly not intended** and must never be utilized for: human or veterinary medical therapeutics, in vivo testing, cosmetics, or food supplements.\n\nBy completing transactions in this portal, the purchasing entity accepts sovereign custody liability. **{appName}** completely isolates itself from any accidental chemical burns, fires, localized toxic emissions, inappropriate waste disposal fines, or educational demonstration mishaps. Science lab instructors must enforce appropriate PPE standards (protective lab-goggles, chemical aprons, impervious nitrile gloves, working fume-hood extraction layouts).`,
        };
      case "shipping":
        return {
          title: "Shipping & Transit Policy",
          subtitle: "How specialized hazardous substances are packed and delivered.",
          content: `Due to physical fire risk, acute poison indicators, and acidity variables in chemical transportation, our logistics networks strictly comply with DOT Hazardous Materials Regulations (Code of Federal Regulations, Title 49).\n\nFor items explicitly marked with GHS hazard warning pictograms (such as concentrated sulfuric acid, flammable liquids, or reactive copper salts), a **flat $15.00 Hazmat Surcharge** is consolidated on checkout. This offsets double-wall safety canisters, specialized vermiculite spill insulation, mandatory DOT-labeled shipping parcels, and certified hazardous transit licensing.\n\nDelicate indicators, specialized buffers, and highly volatile compounds are shipped inside temperature-regulated dry gel thermal compartments. These insulated units guard chemistry agents during hot summer heat waves or severe winter drop points to keep active concentration stable.\n\nStandard institutional delivery takes 3 to 5 business days. Rapid transport is available only after manual clearance by our compliance desk.`,
        };
      case "return":
        return {
          title: "Return Policy",
          subtitle: "Strict guidelines regarding return parcels under chemical regulations.",
          content: `Once a chemical security seal is ruptured, regulatory rules strictly prohibit return shipment via standard public couriers. Reagents return is confined strictly to un-opened, factory-locked packages.\n\nNo delivery parcel can be returned to our warehouse without a pre-authorized Return Merchandise Authorization (RMA) ticket. Please contact our support desk (compliance@rexvora.com) to obtain the RMA documentation prior to making shipping arrangements.\n\nReturn windows close exactly thirty (30) days from original order dispatch. The outer regulatory seals, heat-locked bands, GHS decals, safety rings, and inner secure caps must look completely un-ruptured and clean to pass return audits.`,
        };
      case "refund":
        return {
          title: "Refund Policy",
          subtitle: "Our financial rules regarding order errors, damages, and replacements.",
          content: `If a borosilicate glassware item arrives fractured, or if a chemistry reagent bottle suffers leakage in transit, take immediate high-resolution photographs **prior to opening the protective seal bag**. Notify our compliance team within 48 hours for an instant full replacement or sandbox cart credit.\n\nRefunds are processed back to the original funding account. For university departments leveraging procurement cards, please allow up to five (5) business days for credits to appear on institutional statements.\n\nOnce GHS hazmat parcels are loaded into authorized courier transit chambers, active carrier fees and safety surcharges are fully earned and non-refundable.`,
        };
      case "cookie":
      default:
        return {
          title: "Cookie Policy",
          subtitle: "How technical state cookies preserve security registers during session modeling.",
          content: `This cookie policy outlines how **{appName}** employs standard browser cache data to secure transaction portals. We strictly design with functional state cookies and stay fully disjointed from tracking conglomerates.\n\nWe utilize "chemlabs_session" to preserve active logs and security locks, "chemlabs_cart" to maintain the list of reagents, and "compliance_acknowledgement" to save compliance agreements.\n\nYou can block or purge cookies using your browser settings. Please note that blocking essential cookies will disrupt the chemical cart matching system and prevent access to the Sandbox Checkout.`,
        };
    }
  };

  const replaceVars = (text: string) => {
    if (!text) return "";
    return text
      .replaceAll("{appName}", appName)
      .replaceAll("{appSubtitle}", appSubtitle)
      .replaceAll("{footerCompanyName}", footerCompanyName);
  };

  const formatText = (text: string) => {
    if (!text) return null;
    const formatted = replaceVars(text);
    const paragraphs = formatted.split("\n\n");
    return paragraphs.map((para, i) => {
      const parts = para.split(/\*\*([^*]+)\*\*/g);
      return (
        <p key={i} className="mb-4 text-xs leading-relaxed text-slate-600">
          {parts.map((part, j) => {
            if (j % 2 === 1) {
              return (
                <strong key={j} className="font-extrabold text-slate-900">
                  {part}
                </strong>
              );
            }
            const lineParts = part.split("\n");
            return lineParts.map((line, k) => (
              <React.Fragment key={k}>
                {line}
                {k < lineParts.length - 1 && <br />}
              </React.Fragment>
            ));
          })}
        </p>
      );
    });
  };

  // Contact Form State
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    institution: "",
    subject: "compliance",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const TABS_CONFIG: { id: PolicyTab; label: string; icon: React.FC<any>; desc: string }[] = [
    { id: "about", label: "About Us", icon: Info, desc: "Our lineage in academic reagent manufacturing & purity supply chains." },
    { id: "contact", label: "Contact Us", icon: Mail, desc: "Reach our regulatory desk, support specialists, or campus logistics." },
    { id: "privacy", label: "Privacy Policy", icon: Database, desc: "How we safeguard institutional data and sensitive registers." },
    { id: "terms", label: "Terms & Conditions", icon: Scale, desc: "Legal requirements of purchasing active classroom agents." },
    { id: "compliance", label: "Compliance Policy", icon: FileCheck, desc: "Upholding EPA, DEA, and OSHA safety standards." },
    { id: "disclaimer", label: "Safety Disclaimer", icon: AlertTriangle, desc: "Imperative restrictions of academic demonstration reagents." },
    { id: "shipping", label: "Shipping & Transit", icon: Truck, desc: "Hazmat surcharges, temperature buffers, and DOT regulations." },
    { id: "return", label: "Return Policy", icon: RotateCcw, desc: "Chain-of-custody protocols for hazardous chemical items." },
    { id: "refund", label: "Refund Policy", icon: ShieldCheck, desc: "Reimbursements, credit limits, and replacement parameters." },
    { id: "cookie", label: "Cookie Policy", icon: FileText, desc: "Usage of technical authentication cookies and cart state trackers." }
  ];

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) return;
    setIsSubmitting(true);
    
    // Simulate real database-backed support ticket ingestion
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setContactForm({
        name: "",
        email: "",
        institution: "",
        subject: "compliance",
        message: ""
      });
    }, 1200);
  };

  const currentPolicy = getPolicyData(activeTab);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-10 py-8 select-none font-sans text-slate-800" id="policies-root">
      
      {/* Upper Navigation Back strip */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={onBack}
          id="policy-back-btn"
          className="flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 bg-white border border-slate-200 hover:border-slate-300 py-2.5 px-4 rounded-xl cursor-pointer transition shadow-2xs active:scale-98"
        >
          <X className="w-4 h-4 text-slate-400" />
          <span>Back to Reagent Catalog</span>
        </button>
        <div className="hidden sm:block text-[10.5px] text-slate-400 font-mono">
          SECURE ENCRYPTED COMPLIANCE HUB // PORTAL
        </div>
      </div>

      {/* Main Grid Wrapper */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* SIDEBAR TABS NAVIGATOR: Collapsed into compact select drop-down on mobile, full-featured list on desktop */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-slate-50 p-4 border border-slate-200/80 rounded-2xl">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 px-1 font-mono">
              Legal & Support Deck
            </h2>
            
            {/* Mobile Dropdown Custom Selector */}
            <div className="block lg:hidden relative">
              <select
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value as PolicyTab)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-3 text-xs font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-blue-500 shadow-3xs"
              >
                {TABS_CONFIG.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label} — {t.desc.substring(0, 45)}...
                  </option>
                ))}
              </select>
            </div>

            {/* Desktop Navigation List */}
            <div className="hidden lg:flex flex-col gap-1">
              {TABS_CONFIG.map((tab) => {
                const TabIcon = tab.icon;
                const isSelected = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setSubmitSuccess(false);
                    }}
                    id={`policy-tab-${tab.id}`}
                    className={`text-left flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all duration-150 ${
                      isSelected 
                        ? "bg-blue-600 text-white shadow-sm ring-1 ring-blue-500/10" 
                        : "hover:bg-slate-100 text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <TabIcon className={`w-4 h-4 mt-0.5 shrink-0 ${isSelected ? "text-white" : "text-slate-400"}`} />
                    <div>
                      <p className="text-xs font-bold tracking-tight">{tab.label}</p>
                      <p className={`text-[10px] sm:leading-tight mt-0.5 max-w-[200px] leading-snug line-clamp-2 ${
                        isSelected ? "text-blue-100 font-medium" : "text-slate-400"
                      }`}>
                        {tab.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick GHS Custody Warning card */}
          <div className="bg-slate-50 border border-slate-200/80 p-4.5 rounded-2xl select-none text-[10.5px] leading-normal text-slate-500 space-y-3">
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <ShieldAlert className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Custody Verification</span>
            </div>
            <p>
              Rexvora complies fully with the Federal Hazardous Substances Act guidelines. Delivery is strictly confined to verified institutional science chambers.
            </p>
          </div>
        </div>

        {/* POLICIES CARDS AREA */}
        <div className="lg:col-span-3 bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-xs relative overflow-hidden min-h-[500px]">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="space-y-6"
            >
                         {/* === VIEW 1: ABOUT US === */}
              {activeTab === "about" && (
                <div className="space-y-6" id="policy-content-about">
                  <div className="border-b border-slate-150 pb-5">
                    <span className="text-[10px] text-blue-600 font-bold uppercase tracking-widest font-mono">Company Linage & Legacy</span>
                    <h1 className="text-2.5xl font-extrabold text-slate-900 tracking-tight mt-1">
                      {replaceVars(currentPolicy.title)}
                    </h1>
                    <p className="text-xs text-slate-500 mt-1">
                      {replaceVars(currentPolicy.subtitle)}
                    </p>
                  </div>

                  <div className="prose prose-slate max-w-none text-xs leading-relaxed text-slate-600 space-y-4">
                    {formatText(currentPolicy.content)}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-150">
                        <h3 className="font-bold text-slate-800 text-xs flex items-center gap-1.5 mb-2">
                          <CheckCircle className="w-4 h-4 text-blue-600" />
                          GHS Document Purity
                        </h3>
                        <p className="text-[11px] text-slate-500 leading-normal">
                          All reagents are backed by meticulously formatted, OSHA compliance-checked Safety Data Sheets and NFPA hazard indexing standard databases.
                        </p>
                      </div>
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-150">
                        <h3 className="font-bold text-slate-800 text-xs flex items-center gap-1.5 mb-2">
                          <Clock className="w-4 h-4 text-blue-600" />
                          Institutional Security
                        </h3>
                        <p className="text-[11px] text-slate-500 leading-normal">
                          We preserve absolute chain-of-custody protocols, shipping reagents securely and rejecting all consumer/residential purchase orders.
                        </p>
                      </div>
                    </div>

                    <blockquote className="border-l-4 border-blue-500 bg-blue-50/40 p-3.5 rounded-r-xl text-slate-600 text-[11px] leading-normal italic">
                      "Equipping the next generation of chemists is a duty of absolute security. By providing full MSDS data and strict license checks, {appName} remains a trusted logistical companion for thousands of public science centers, high school chemistry labs, and academic research ecosystems."
                    </blockquote>
                  </div>
                </div>
              )}

              {/* === VIEW 2: CONTACT US === */}
              {activeTab === "contact" && (
                <div className="space-y-6" id="policy-content-contact">
                  <div className="border-b border-slate-150 pb-5">
                    <span className="text-[10px] text-blue-600 font-bold uppercase tracking-widest font-mono">Direct Communication Channels</span>
                    <h1 className="text-2.5xl font-extrabold text-slate-900 tracking-tight mt-1">
                      {replaceVars(currentPolicy.title)}
                    </h1>
                    <p className="text-xs text-slate-500 mt-1">
                      {replaceVars(currentPolicy.subtitle)}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {/* Contact details */}
                    <div className="md:col-span-1 space-y-4">
                      <div className="bg-slate-50 p-4 border border-slate-150 rounded-xl space-y-4.5 select-none">
                        <div className="flex gap-3 items-start">
                          <Building className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-[10.5px] font-bold text-slate-700 uppercase">Headquarters</p>
                            <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
                              {footerCompanyName}
                              <br />
                              Science logistics park, Bay 9
                              <br />
                              Seattle, WA 98101
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-3 items-start">
                          <Mail className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-[10.5px] font-bold text-slate-700 uppercase">Desk Email</p>
                            <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
                              support@rexvora.com
                              <br />
                              compliance@rexvora.com
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-3 items-start p-3 bg-emerald-50/70 border border-emerald-200/60 rounded-xl">
                          <MessageCircle className="w-4.5 h-4.5 text-emerald-600 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-[10.5px] font-bold text-emerald-800 uppercase tracking-wide font-mono">WhatsApp Helpline</p>
                            <p className="text-[11px] text-slate-800 font-bold mt-0.5 select-all">
                              +1 (509) 994-1048
                            </p>
                            <p className="text-[9.5px] text-emerald-750 font-medium leading-tight mt-1">
                              Text Only (No Calling) — Chat 24/7
                            </p>
                            <a 
                              href="https://wa.me/15099941048" 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="inline-flex items-center gap-1 mt-2 text-[10px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 px-2.5 py-1 rounded-lg shadow-xs transition select-none cursor-pointer"
                            >
                              Chat on WhatsApp
                            </a>
                          </div>
                        </div>
                      </div>

                      {/* Compliance alert banner */}
                      <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200/50 text-[10px] text-amber-800 leading-normal">
                        <strong>🚨 Urgency Note:</strong> For chemical spills or transport accidents in transit, refer directly to DOT Emergency Response Guidebook (ERG) instructions.
                      </div>
                    </div>

                    {/* Interactive Contact Form */}
                    <div className="md:col-span-2 space-y-4">
                      <div className="text-xs text-slate-650 leading-relaxed">
                        {formatText(currentPolicy.content)}
                      </div>

                      <div className="bg-white p-5 border border-slate-200/80 rounded-xl shadow-2xs">
                        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-3">Send Secure Message to Logistics Desk</h3>

                        {submitSuccess ? (
                          <div className="bg-emerald-50 text-emerald-800 rounded-xl p-5 text-center space-y-3 border border-emerald-200 animate-fade-in select-none">
                            <span className="text-3xl">✉️</span>
                            <h4 className="text-xs font-black uppercase">Message Successfully Transmitted</h4>
                            <p className="text-[11px] leading-relaxed">
                              Thank you for contacting {appName}. Your regulatory ticket (<strong>Ticket ID: RX-{Math.floor(Math.random() * 900000 + 100000)}</strong>) has been queued. Our GHS specialist will reply within 3 hours.
                            </p>
                            <button
                              type="button"
                              onClick={() => setSubmitSuccess(false)}
                              className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg py-1.5 px-3.5 font-bold cursor-pointer transition active:scale-95 mt-1"
                            >
                              Send Another Message
                            </button>
                          </div>
                        ) : (
                          <form onSubmit={handleContactSubmit} className="space-y-3.5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <label className="block text-[10.5px] font-bold text-slate-600 mb-1">Your Name *</label>
                                <input
                                  type="text"
                                  required
                                  value={contactForm.name}
                                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                                  placeholder="Dr. Jordan Carter"
                                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-blue-500"
                                />
                              </div>
                              <div>
                                <label className="block text-[10.5px] font-bold text-slate-600 mb-1">Authorized Email *</label>
                                <input
                                  type="email"
                                  required
                                  value={contactForm.email}
                                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                                  placeholder="jarter@columbia.edu"
                                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-blue-500"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <label className="block text-[10.5px] font-bold text-slate-600 mb-1">Faculty / Institution</label>
                                <input
                                  type="text"
                                  value={contactForm.institution}
                                  onChange={(e) => setContactForm({ ...contactForm, institution: e.target.value })}
                                  placeholder="Columbia University ChemDept"
                                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-blue-500"
                                />
                              </div>
                              <div>
                                <label className="block text-[10.5px] font-bold text-slate-600 mb-1">Inquiry Department *</label>
                                <select
                                  value={contactForm.subject}
                                  onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-blue-500"
                                >
                                  <option value="compliance">Custody & License verification</option>
                                  <option value="sds">Safety Data Sheets / Chemical purity</option>
                                  <option value="billing">Procurement Orders & billing</option>
                                  <option value="custom">Specialized packaging volume</option>
                                </select>
                              </div>
                            </div>

                            <div>
                              <label className="block text-[10.5px] font-bold text-slate-600 mb-1">Active Message (Max 1000 words) *</label>
                              <textarea
                                required
                                rows={4}
                                value={contactForm.message}
                                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                                placeholder="State the chemical CAS number, lot verification requested, or active license question..."
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 font-sans"
                              />
                            </div>

                            <button
                              type="submit"
                              disabled={isSubmitting}
                              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white font-bold text-xs py-2.5 px-4 rounded-xl cursor-pointer transition active:scale-95 shadow-sm hover:shadow-md flex items-center justify-center gap-1.5"
                            >
                              {isSubmitting ? (
                                <>
                                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                  <span>Routing to Compliance desk...</span>
                                </>
                              ) : (
                                <>
                                  <Send className="w-3.5 h-3.5" />
                                  <span>Submit Ticket Inquiry</span>
                                </>
                              )}
                            </button>
                          </form>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* === VIEW 3: PRIVACY POLICY === */}
              {activeTab === "privacy" && (
                <div className="space-y-6" id="policy-content-privacy">
                  <div className="border-b border-slate-150 pb-5">
                    <span className="text-[10px] text-blue-600 font-bold uppercase tracking-widest font-mono">Information Protection Standard</span>
                    <h1 className="text-2.5xl font-extrabold text-slate-900 tracking-tight mt-1">{replaceVars(currentPolicy.title)}</h1>
                    <p className="text-xs text-slate-500 mt-1">{replaceVars(currentPolicy.subtitle)}</p>
                  </div>

                  <div className="prose prose-slate max-w-none text-xs leading-relaxed text-slate-600 space-y-4">
                    {formatText(currentPolicy.content)}
                  </div>
                </div>
              )}

              {/* === VIEW 4: TERMS & CONDITIONS === */}
              {activeTab === "terms" && (
                <div className="space-y-6" id="policy-content-terms">
                  <div className="border-b border-slate-150 pb-5">
                    <span className="text-[10px] text-blue-600 font-bold uppercase tracking-widest font-mono">Academic Procurement Mandates</span>
                    <h1 className="text-2.5xl font-extrabold text-slate-900 tracking-tight mt-1">{replaceVars(currentPolicy.title)}</h1>
                    <p className="text-xs text-slate-500 mt-1">{replaceVars(currentPolicy.subtitle)}</p>
                  </div>

                  <div className="prose prose-slate max-w-none text-xs leading-relaxed text-slate-600 space-y-4 animate-fade-in">
                    {formatText(currentPolicy.content)}
                  </div>
                </div>
              )}

              {/* === VIEW 5: COMPLIANCE POLICY === */}
              {activeTab === "compliance" && (
                <div className="space-y-6" id="policy-content-compliance">
                  <div className="border-b border-slate-150 pb-5">
                    <span className="text-[10px] text-blue-600 font-bold uppercase tracking-widest font-mono">EPA / OSHA HazCom / DEA standards</span>
                    <h1 className="text-2.5xl font-extrabold text-slate-900 tracking-tight mt-1">{replaceVars(currentPolicy.title)}</h1>
                    <p className="text-xs text-slate-500 mt-1">{replaceVars(currentPolicy.subtitle)}</p>
                  </div>

                  <div className="prose prose-slate max-w-none text-xs leading-relaxed text-slate-600 space-y-4">
                    <div className="flex gap-4 p-4.5 rounded-xl bg-slate-50 border border-slate-150 items-start select-none mb-4">
                      <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-slate-800 text-xs">Standardized GHS Alignment</h4>
                        <p className="text-[11px] text-slate-500 mt-1">
                          We execute rigorous checks to ensure safety pictograms, signal words (Danger/Warning), and hazard phrases match OSHA Standard 29 CFR 1910.1200 HazCom specifications.
                        </p>
                      </div>
                    </div>

                    {formatText(currentPolicy.content)}
                  </div>
                </div>
              )}

              {/* === VIEW 6: SAFETY DISCLAIMER === */}
              {activeTab === "disclaimer" && (
                <div className="space-y-6" id="policy-content-disclaimer">
                  <div className="border-b border-slate-150 pb-5">
                    <span className="text-[10px] text-red-600 font-bold uppercase tracking-widest font-mono">Mandatory Lab Cautionary Notice</span>
                    <h1 className="text-2.5xl font-extrabold text-slate-900 tracking-tight mt-1">{replaceVars(currentPolicy.title)}</h1>
                    <p className="text-xs text-slate-500 mt-1">{replaceVars(currentPolicy.subtitle)}</p>
                  </div>

                  <div className="bg-red-50/60 border border-red-200 p-5 rounded-2xl text-red-900 space-y-3.5 select-none animate-pulse mb-4">
                    <div className="font-extrabold text-xs uppercase flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
                      Strict Academic Laboratory & Educational Demonstration Limits only
                    </div>
                    <p className="text-[11px] leading-relaxed">
                      All compounds, reagents, buffering solutions, and certified indicators listed under the catalog of <strong>{appName}</strong> are manufactured exclusively to serve academic demonstrations, analytical titrations, scientific modeling synthesis, and secondary science laboratories.
                    </p>
                  </div>

                  <div className="prose prose-slate max-w-none text-xs leading-relaxed text-slate-600 space-y-3">
                    {formatText(currentPolicy.content)}
                  </div>
                </div>
              )}

              {/* === VIEW 7: SHIPPING POLICY === */}
              {activeTab === "shipping" && (
                <div className="space-y-6" id="policy-content-shipping">
                  <div className="border-b border-slate-150 pb-5">
                    <span className="text-[10px] text-blue-600 font-bold uppercase tracking-widest font-mono">DOT regulated chemical logistics</span>
                    <h1 className="text-2.5xl font-extrabold text-slate-900 tracking-tight mt-1">{replaceVars(currentPolicy.title)}</h1>
                    <p className="text-xs text-slate-500 mt-1">{replaceVars(currentPolicy.subtitle)}</p>
                  </div>

                  <div className="prose prose-slate max-w-none text-xs leading-relaxed text-slate-600 space-y-4">
                    {formatText(currentPolicy.content)}
                  </div>
                </div>
              )}

              {/* === VIEW 8: RETURN POLICY === */}
              {activeTab === "return" && (
                <div className="space-y-6" id="policy-content-return">
                  <div className="border-b border-slate-150 pb-5">
                    <span className="text-[10px] text-blue-600 font-bold uppercase tracking-widest font-mono">Custody Control Returns</span>
                    <h1 className="text-2.5xl font-extrabold text-slate-900 tracking-tight mt-1">{replaceVars(currentPolicy.title)}</h1>
                    <p className="text-xs text-slate-500 mt-1">{replaceVars(currentPolicy.subtitle)}</p>
                  </div>

                  <div className="prose prose-slate max-w-none text-xs leading-relaxed text-slate-600 space-y-4">
                    <p className="bg-amber-50 p-4 border border-amber-200 text-amber-900 rounded-xl leading-normal select-none font-medium mb-4">
                      ⚠️ <strong>Regulations Alert:</strong> Once a chemical security seal is ruptured, regulatory rules strictly prohibit return shipment via standard public couriers. Reagents return is confined strictly to un-opened, factory-locked packages.
                    </p>

                    {formatText(currentPolicy.content)}
                  </div>
                </div>
              )}

              {/* === VIEW 9: REFUND POLICY === */}
              {activeTab === "refund" && (
                <div className="space-y-6" id="policy-content-refund">
                  <div className="border-b border-slate-150 pb-5">
                    <span className="text-[10px] text-blue-600 font-bold uppercase tracking-widest font-mono">Academic Procurement Guarantees</span>
                    <h1 className="text-2.5xl font-extrabold text-slate-900 tracking-tight mt-1">{replaceVars(currentPolicy.title)}</h1>
                    <p className="text-xs text-slate-500 mt-1">{replaceVars(currentPolicy.subtitle)}</p>
                  </div>

                  <div className="prose prose-slate max-w-none text-xs leading-relaxed text-slate-600 space-y-4 shadow-3xs p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                    {formatText(currentPolicy.content)}
                  </div>
                </div>
              )}

              {/* === VIEW 10: COOKIE POLICY === */}
              {activeTab === "cookie" && (
                <div className="space-y-6" id="policy-content-cookie">
                  <div className="border-b border-slate-150 pb-5">
                    <span className="text-[10px] text-blue-600 font-bold uppercase tracking-widest font-mono">Strictly Necessary Web Cookies</span>
                    <h1 className="text-2.5xl font-extrabold text-slate-900 tracking-tight mt-1">{replaceVars(currentPolicy.title)}</h1>
                    <p className="text-xs text-slate-500 mt-1">{replaceVars(currentPolicy.subtitle)}</p>
                  </div>

                  <div className="prose prose-slate max-w-none text-xs leading-relaxed text-slate-600 space-y-4">
                    <p className="mb-4">
                      This cookie policy outlines how <strong>{appName}</strong> employs standard browser cache data to secure transaction portals. We strictly design with functional state cookies and stay fully disjointed from tracking conglomerates.
                    </p>

                    <table className="w-full border border-slate-200 rounded-xl text-left text-[11px] overflow-hidden my-4 border-collapse font-sans select-none mb-4">
                      <thead className="bg-slate-50 text-slate-700 font-bold">
                        <tr className="border-b border-slate-200">
                          <th className="p-2.5">Cookie Key</th>
                          <th className="p-2.5">Specific Purpose</th>
                          <th className="p-2.5">Expiration</th>
                        </tr>
                      </thead>
                      <tbody className="text-slate-500 divide-y divide-slate-100">
                        <tr>
                          <td className="p-2.5 font-mono text-blue-600 font-semibold">chemlabs_session</td>
                          <td className="p-2.5">Preserves active log registers and user credential token locks.</td>
                          <td className="p-2.5 font-mono">1 Hour</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 font-mono text-blue-600 font-semibold">chemlabs_cart</td>
                          <td className="p-2.5">Maintains list of reagents, buffering solutions, or glassware added to chem-cart.</td>
                          <td className="p-2.5 font-mono">30 Days</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 font-mono text-blue-600 font-semibold">compliance_acknowledgement</td>
                          <td className="p-2.5 font-mono text-emerald-600">Preserves chemistry end-of-use compliance verification active flags.</td>
                          <td className="p-2.5 font-mono">Session</td>
                        </tr>
                      </tbody>
                    </table>

                    {formatText(currentPolicy.content)}
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>

        </div>

      </div>

    </div>
  );
}
