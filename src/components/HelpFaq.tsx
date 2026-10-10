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
      question: "Was sind GHS-Piktogramme und warum sind sie wichtig?",
      answer: "GHS-Piktogramme (Global Harmonisiertes System) sind standardisierte Grafiksymbole zur Kennzeichnung spezifischer Gefahreninformationen auf Chemikalienetiketten und Sicherheitsdatenblättern (SDB). Sie klassifizieren physikalische, Umwelt- und Gesundheitsgefahren (z. B. Entzündbarkeit, Toxizität, Ätzwirkung), um Laborpersonal zu warnen und eine sichere Lagerung und Handhabung zu unterstützen.",
      keywords: ["ghs", "piktogramm", "gefahr", "etikett", "symbol", "klassifizierung"]
    },
    {
      id: "safety-2",
      category: "safety",
      question: "Wie verhalte ich mich bei einem verschütteten Chemikalienunfall oder Notfall?",
      answer: "Befolgen Sie stets das spezifische Chemikalienhygieneprotokoll Ihrer Einrichtung: (1) Isolieren Sie sofort den Bereich und informieren Sie andere. (2) Konsultieren Sie das Sicherheitsdatenblatt des Produkts (Abschnitt 6: Maßnahmen bei unbeabsichtigter Freisetzung). (3) Tragen Sie geeignete persönliche Schutzausrüstung (Schutzbrille, chemikalienbeständige Handschuhe, Laborkittel). (4) Binden Sie die Flüssigkeit vorsichtig mit geeignetem Bindemittel und entsorgen Sie diese gemäß den örtlichen Umweltvorschriften.",
      keywords: ["verschüttet", "notfall", "handhabung", "reinigung", "sicherheit", "unfall"]
    },
    {
      id: "safety-3",
      category: "safety",
      question: "Was ist ein SDB (Sicherheitsdatenblatt) und wo finde ich es?",
      answer: "Ein Sicherheitsdatenblatt (SDB / SDS) ist ein umfassendes Dokument über Sicherheit, physikalische Eigenschaften, Toxizität, Umweltauswirkungen, Gefahrguttransport und Entsorgungsempfehlungen. Sie finden das vollständige SDB für jedes Flaskia-Reagenz direkt auf der Produktdetailseite im Bereich Sicherheitsdatenblatt.",
      keywords: ["sdb", "sds", "sicherheitsdatenblatt", "pdf", "abschnitt", "dokument"]
    },
    {
      id: "safety-4",
      category: "safety",
      question: "Was bedeuten die Werte des NFPA 704 Gefahrendiamanten?",
      answer: "Der NFPA 704 Standard verwendet einen farbcodierten Diamanten zur Risikodarstellung: Blau steht für Gesundheitsgefahr, Rot für Entzündbarkeit, Gelb für Instabilität/Reaktivität und Weiß für besondere Gefahren. Die Werte reichen von 0 (minimales Risiko) bis 4 (extreme Gefahr).",
      keywords: ["nfpa", "diamant", "farbe", "rot", "blau", "gelb", "gesundheit", "entzündbarkeit"]
    },
    {
      id: "shipping-1",
      category: "shipping",
      question: "Warum fällt bei bestimmten Produkten ein Gefahrgutzuschlag an?",
      answer: "Nationale und internationale Transportvorschriften stufen bestimmte hochreine Laborreagenzien als Gefahrgut ein. Diese Produkte erfordern temperaturregulierte Spezialverpackungen, doppelwandige Sicherheitsbehälter und zertifizierte Gefahrgutspeditionen.",
      keywords: ["gefahrgut", "hazmat", "versand", "zuschlag", "lieferung", "gebühr", "transport"]
    },
    {
      id: "shipping-2",
      category: "shipping",
      question: "Können Chemikalien an private Wohnadressen geliefert werden?",
      answer: "Nein. Zur Einhaltung gesetzlicher Vorschriften liefert Flaskia Laborreagenzien und Chemikalien ausschließlich an geprüfte Bildungseinrichtungen, Universitäten, gewerbliche Labore und registrierte Forschungseinrichtungen. Lieferungen an Privatadressen sind ausgeschlossen.",
      keywords: ["privat", "wohnadresse", "adresse", "versand", "lieferung"]
    },
    {
      id: "shipping-3",
      category: "shipping",
      question: "Welche Temperaturkontrollen werden beim Versand eingesetzt?",
      answer: "Flaskia verwendet klimaregulierte Spezialverpackungen mit thermischer Isolierung und Kühlakkus für flüchtige Verbindungen oder empfindliche Indikatoren, um die chemische Stabilität während des gesamten Transports zu gewährleisten.",
      keywords: ["temperatur", "versand", "klima", "kühlung", "hitze", "stabilität"]
    },
    {
      id: "compliance-1",
      category: "compliance",
      question: "Benötige ich eine institutionelle Verifizierung für die Bestellung?",
      answer: "Ja. Kunden, die aktive chemische Reagenzien anfragen, müssen einer autorisierten Bildungseinrichtung, einem Forschungslabor oder einem gewerblichen Unternehmen angehören.",
      keywords: ["lizenz", "verifizierung", "institution", "universität", "bestellung"]
    },
    {
      id: "compliance-2",
      category: "compliance",
      question: "Was ist der Unterschied zwischen den Chemikalienqualitäten (z. B. ACS vs. Technisch)?",
      answer: "ACS-Reagenzienqualität bedeutet, dass die Chemikalie strengen Reinheitsspezifikationen der American Chemical Society entspricht (meist ≥95–99% Reinheit) und sich für präzise quantitative Analysen eignet. Technische oder Lehrzweck-Qualitäten sind für allgemeine Laborversuche und Demonstrationen konzipiert.",
      keywords: ["qualität", "reinheit", "acs", "reagenz", "technisch", "unterschied"]
    },
    {
      id: "compliance-3",
      category: "compliance",
      question: "Wie stellt Flaskia die gesetzliche Konformität sicher?",
      answer: "Unsere Prozesse entsprechen strengen Umwelt-, Transport- und Arbeitsschutzrichtlinien (GHS, REACH, CLP, OSHA). Alle Lieferungen enthalten vollständige Sicherheitsdatenblätter (SDB) und GHS-Gefahrenkennzeichnungen sowie eine lückenlose Chargenrückverfolgbarkeit.",
      keywords: ["vorschrift", "compliance", "rechtlich", "sicherheit", "ghs", "rückverfolgbarkeit"]
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
  const quickSearchTags = ["SDB-Blätter", "Gefahrgut", "Lizenz", "ACS-Qualität", "Notfall"];

  const handleSelectQuickTag = (tag: string) => {
    let searchVal = tag;
    if (tag === "SDB-Blätter") searchVal = "sdb";
    else if (tag === "Gefahrgut") searchVal = "gefahrgut";
    else if (tag === "Lizenz") searchVal = "lizenz";
    else if (tag === "ACS-Qualität") searchVal = "acs";
    else if (tag === "Notfall") searchVal = "notfall";
    
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
                <span>Hilfe- & Sicherheitszentrum</span>
                <span className="hidden sm:inline-flex items-center gap-1 bg-blue-100/60 text-blue-700 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider font-mono">
                  <Sparkles className="w-2.5 h-2.5" /> Live-FAQ
                </span>
              </h2>
              <p className="text-[10px] md:text-[11px] text-slate-400 font-medium uppercase font-mono tracking-wider truncate">
                Gesetzliche Standards & Laborsicherheitshandbücher
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 cursor-pointer shrink-0 hover:scale-102 active:scale-98"
            id="close-help-faq-btn"
            title="Hilfe & FAQ schließen"
          >
            <span className="text-sm">❌</span>
            <span>Schließen</span>
          </button>
        </div>

        {/* Search & Tabs Panel */}
        <div className="p-4 md:p-6 pb-2 space-y-3 shrink-0">
          <div className="relative">
            <input 
              type="text"
              placeholder="Suche nach Sicherheitsbegriffen, SDB, Gefahrgut, Lagerung usw..."
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
                Löschen
              </button>
            )}
          </div>

          {/* Quick-select Safety query tags */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[10px] select-none">
            <span className="text-slate-400 font-bold uppercase font-mono shrink-0 mr-1">Schnellwahl:</span>
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
              { id: "all", label: "Alle Fragen", icon: HelpCircle, count: categoryCounts.all },
              { id: "safety", label: "Sicherheitsregeln", icon: FlaskConical, count: categoryCounts.safety },
              { id: "shipping", label: "Gefahrgut / Versand", icon: Truck, count: categoryCounts.shipping },
              { id: "compliance", label: "GHS-Standard", icon: ShieldCheck, count: categoryCounts.compliance }
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
              <h4 className="text-xs font-bold text-slate-700">Keine passenden Einträge gefunden</h4>
              <p className="text-[11px] text-slate-400 mt-1 leading-normal max-w-xs mx-auto">
                Keine Artikel für "{searchQuery}" gefunden. Versuchen Sie Begriffe wie "SDB", "Reinheit" oder klicken Sie auf "Löschen".
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
                          KAT: {item.category}
                        </span>
                        <span>•</span>
                        <span>GHS-SDB Zertifiziertes Chemikaliensicherheitsblatt</span>
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
              <strong>Institutionelle Beschaffungsrichtlinien:</strong> Für kommerzielle Großbestellungen, hochreine Synthesen oder behördliche Anfragen geben Sie bitte Ihre Organisationsdaten an.
            </div>
          </div>

          <form onSubmit={handleQuerySubmit} className="space-y-2">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <label className="text-[10px] md:text-[11px] text-slate-600 font-bold truncate" htmlFor="support-query-input">
                Haben Sie weitere Fragen zu Sicherheit oder Versand? Kontaktieren Sie unsere Sicherheitsabteilung:
              </label>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <input 
                id="support-query-input"
                type="text"
                placeholder="Frage zu Lagerung, Konformität oder SDB-Updates..."
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                className="flex-1 bg-white border border-slate-200 hover:border-slate-300 focus:border-blue-500 rounded-xl px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 transition outline-none"
              />
              <div className="flex gap-2 shrink-0">
                <button 
                  type="submit"
                  className="flex-1 sm:flex-none px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-97"
                >
                  <span>Anfrage senden</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button 
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-extrabold transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-97"
                  title="Handbuch schließen"
                  id="footer-faq-close-btn"
                >
                  <span>Schließen ❌</span>
                </button>
              </div>
            </div>

            {submitSuccess && (
              <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 mt-1 animate-fade-in">
                <ShieldCheck className="w-3 h-3 text-emerald-500 shrink-0" />
                <span>Anfrage erfolgreich erfasst. Unser Sicherheitsexperte wird sich in Kürze melden!</span>
              </p>
            )}
          </form>
        </div>

      </div>
    </div>
  );
}
