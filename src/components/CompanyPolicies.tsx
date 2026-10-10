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
  appName = "Flaskia",
  appSubtitle = "Academic Supply Direct",
  footerCompanyName = "Flaskia Supplies International Co."
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
          title: "Über {appName}",
          subtitle: "{appSubtitle} — Versorgung von Universitäten, Forschungslaboren und Industrie.",
          content: `Gegründet mit der Vision, hochreine Laborchemikalien für Forschungseinrichtungen und Bildungsträger bereitzustellen, hat sich **{appName}** zu einem führenden Anbieter von Laborstandardchemikalien, präzisen Pufferlösungen, pH-Indikatoren und Borosilikat-Glaswaren entwickelt.\n\nUnsere Einrichtung setzt auf klimatisierte Lagerhaltung, automatisierte Gefahrgutkonformität und sorgfältige Chargenprüfungen. Dies garantiert, dass Ihr Chemielabor Materialien in genau der dokumentierten technischen, analytischen oder ACS-Reagenzienqualität erhält.\n\nDurch vollständige Sicherheitsdatenblätter (SDB) und strenge Qualitätskontrollen bleibt {appName} ein zuverlässiger Logistikpartner für wissenschaftliche Zentren, Schullabore und akademische Forschungseinrichtungen.`,
        };
      case "contact":
        return {
          title: "Kontakt",
          subtitle: "Unser Support-Team, die Logistikabteilung und unsere Sicherheitsbeauftragten stehen Ihnen zur Verfügung.",
          content: `Hauptsitz: {footerCompanyName}\nWissenschafts- und Logistikpark, Bay 9\n\nE-Mail: support@flaskia.com, compliance@flaskia.com\nWhatsApp-Hotline: +1 (509) 994-1048 (Nur Text-Chat, 24/7 erreichbar)\n\nBei verschütteten Chemikalien oder Transportunfällen beachten Sie bitte direkt die Anweisungen im Sicherheitsdatenblatt (SDB).`,
        };
      case "privacy":
        return {
          title: "Datenschutzerklärung",
          subtitle: "Datenschutzkonforme Verwaltung von Kundendaten und institutionellen Registrierungen.",
          content: `Da unsere Tätigkeit den Versand klassifizierter chemischer Substanzen umfasst, führen wir ein sicheres, verschlüsseltes Beschaffungsregister. Dieser Datensatz enthält verifizierte Forscherprofile, offizielle E-Mail-Adressen und Lieferinformationen gemäß den geltenden Sicherheitsvorschriften.\n\nGemäß den gesetzlichen Vorschriften für chemische Stoffe sind wir verpflichtet, Transaktionsprotokolle mit Chargennummern und Empfängerinstitutionen sicher aufzubewahren.\n\nWir verkaufen, vermieten oder lizenzieren niemals Bestellhistorien, Benutzerdaten oder Sicherheitsprotokolle an Marketingagenturen oder Dritte. Cookies werden ausschließlich zur Aufrechterhaltung Ihrer Sitzung verwendet.`,
        };
      case "terms":
        return {
          title: "Allgemeine Geschäftsbedingungen (AGB)",
          subtitle: "Rechtliche Bedingungen für den Bezug von Laborchemikalien und Reagenzien.",
          content: `Mit einer Anfrage oder Bestellung über **{appName}** bestätigen Sie ausdrücklich, dass Sie ein bevollmächtigter Vertreter einer Bildungseinrichtung, eines zertifizierten Chemieprogramms oder eines gewerblichen Labors sind.\n\nAlle chemischen Reagenzien sind vom Versand an private Wohnadressen, Hotels oder Postfächer ausgeschlossen. Die über diesen Katalog bezogenen Substanzen dürfen nicht an unbefugte Dritte weitergegeben oder zweckentfremdet werden.`,
        };
      case "compliance":
        return {
          title: "Qualitäts- & Compliance-Richtlinie",
          subtitle: "Wie gesetzliche Rahmenbedingungen in der Logistikkette von {appName} umgesetzt werden.",
          content: `Wir führen strenge Prüfungen durch, um sicherzustellen, dass Gefahrenpiktogramme, Signalwörter und Gefahrenhinweise den geltenden GHS-, CLP- und OSHA-Spezifikationen entsprechen.\n\nJede Reagenzienlieferung enthält eindeutige Chargencodes, die mit unseren Analyseberichten (CoA) verknüpft sind. Gemäß den gesetzlichen Bestimmungen bewahren wir vollständige Rückverfolgbarkeitsarchive für mindestens sieben (7) Jahre auf.`,
        };
      case "disclaimer":
        return {
          title: "Sicherheitshinweis",
          subtitle: "Verbindliche Vorsichtsmaßnahmen für Handhabung und Laborversuche.",
          content: `Alle im Katalog von **{appName}** aufgeführten Verbindungen, Reagenzien, Pufferlösungen und zertifizierten Indikatoren werden ausschließlich für analytische Zwecke, wissenschaftliche Forschung, Industrie und Ausbildungslabore hergestellt.\n\nDiese Chemikalien sind **ausdrücklich nicht bestimmt** für die Anwendung am Menschen oder Tier, für Arzneimittel, Kosmetika oder Lebensmittelzusätze.\n\nDas beziehende Labor übernimmt die volle Verantwortung für die fachgerechte Handhabung und Einhaltung der persönlichen Schutzausrüstung (Schutzbrille, Laborkittel, Schutzhandschuhe, Abzugshaube).`,
        };
      case "shipping":
        return {
          title: "Versand- & Gefahrgutrichtlinie",
          subtitle: "Wie spezialisierte Gefahrstoffe sicher verpackt und geliefert werden.",
          content: `Aufgrund von Brandgefahren, Toxizität und Ätzwirkungen beim Chemikalientransport halten sich unsere Logistiknetzwerke strikt an die geltenden Gefahrgutvorschriften (ADR / DOT / IATA).\n\nFür Artikel, die mit GHS-Gefahrenpiktogrammen gekennzeichnet sind, werden doppelwandige Sicherheitsbehälter, spezielles Vermiculit-Absorptionsmaterial und vorschriftsmäßig gekennzeichnete Gefahrgutpakete verwendet.\n\nEmpfindliche Indikatoren, spezielle Puffer und flüchtige Verbindungen werden in temperaturregulierten Thermoverpackungen versendet, um die chemische Konzentration stabil zu halten.`,
        };
      case "return":
        return {
          title: "Rückgaberichtlinie",
          subtitle: "Strenge Richtlinien für Rücksendungen gemäß den Chemikalienvorschriften.",
          content: `Sobald ein chemisches Sicherheitssiegel gebrochen ist, verbieten gesetzliche Vorschriften den Rückversand über reguläre Paketdienste. Die Rückgabe von Reagenzien ist ausschließlich auf ungeöffnete, werkseitig versiegelte Originalverpackungen beschränkt.\n\nKeine Sendung kann ohne vorherige Rücksendegenehmigung (RMA) an unser Lager zurückgesandt werden. Bitte kontaktieren Sie unseren Support (compliance@flaskia.com), um vorab die RMA-Dokumentation zu erhalten.\n\nDie Rückgabefrist beträgt dreißig (30) Tage ab Versanddatum.`,
        };
      case "refund":
        return {
          title: "Rückerstattungsrichtlinie",
          subtitle: "Unsere Bestimmungen bei Bestellfehlern, Transportschäden und Ersatzlieferungen.",
          content: `Sollte ein Borosilikat-Glasartikel zerbrochen ankommen oder eine Reagenzienflasche während des Transports beschädigt werden, erstellen Sie bitte sofort Fotos **vor dem Öffnen des Schutzbeutels**. Informieren Sie unser Team innerhalb von 48 Stunden für einen sofortigen kostenlosen Ersatz oder eine vollständige Rückerstattung.\n\nRückerstattungen erfolgen auf das ursprüngliche Zahlungsmittel innerhalb von fünf (5) Werktagen.`,
        };
      case "cookie":
      default:
        return {
          title: "Cookie-Richtlinie",
          subtitle: "Wie technisch notwendige Cookies die Sicherheit und Sitzungsdaten gewährleisten.",
          content: `Diese Cookie-Richtlinie erläutert, wie **{appName}** Standard-Browser-Cache-Daten zum Schutz des Portals einsetzt. Wir verwenden ausschließlich funktionale Status-Cookies und verzichten auf Werbe-Tracker.\n\nWir verwenden lokale Speicherschlüssel, um Ihre Sitzung, Währungseinstellungen und Anfragen sicher zu speichern.\n\nSie können Cookies jederzeit in Ihren Browsereinstellungen blockieren oder löschen.`,
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
    { id: "about", label: "Über uns", icon: Info, desc: "Unsere Geschichte in der Herstellung hochreiner Laborreagenzien." },
    { id: "contact", label: "Kontakt", icon: Mail, desc: "Erreichen Sie unsere Fachabteilung, den Support oder die Logistik." },
    { id: "privacy", label: "Datenschutzerklärung", icon: Database, desc: "Wie wir institutionelle Daten und sensible Register schützen." },
    { id: "terms", label: "AGB", icon: Scale, desc: "Rechtliche Bedingungen für den Erwerb von Laborreagenzien." },
    { id: "compliance", label: "Compliance-Richtlinie", icon: FileCheck, desc: "Einhaltung von GHS-, REACH- und OSHA-Sicherheitsstandards." },
    { id: "disclaimer", label: "Sicherheitshinweis", icon: AlertTriangle, desc: "Wichtige Verwendungsbeschränkungen für Laborchemikalien." },
    { id: "shipping", label: "Versand & Gefahrgut", icon: Truck, desc: "Gefahrgutversand, Temperaturkontrolle und Transportvorschriften." },
    { id: "return", label: "Rückgaberichtlinie", icon: RotateCcw, desc: "Rückgabeprotokolle für versiegelte chemische Artikel." },
    { id: "refund", label: "Rückerstattungsrichtlinie", icon: ShieldCheck, desc: "Erstattungen, Gutschriften und Ersatzlieferungen." },
    { id: "cookie", label: "Cookie-Richtlinie", icon: FileText, desc: "Verwendung technisch notwendiger Sitzungs-Cookies." }
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
          <span>Zurück zum Reagenzienkatalog</span>
        </button>
        <div className="hidden sm:block text-[10.5px] text-slate-400 font-mono">
          SICHERES COMPLIANCE- & RECHTSPORTAL
        </div>
      </div>

      {/* Main Grid Wrapper */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* SIDEBAR TABS NAVIGATOR: Collapsed into compact select drop-down on mobile, full-featured list on desktop */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-slate-50 p-4 border border-slate-200/80 rounded-2xl">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 px-1 font-mono">
              Rechtliches & Support
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
              Flaskia complies fully with the Federal Hazardous Substances Act guidelines. Delivery is strictly confined to verified institutional science chambers.
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
                              support@flaskia.com
                              <br />
                              compliance@flaskia.com
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
