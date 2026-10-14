import React from "react";
import {
  ShieldCheck,
  FlaskConical,
  Truck,
  Headphones,
  Award,
  Activity,
  Globe,
  Cpu,
  Sparkles,
  Beaker,
  Heart,
  Lock,
  CheckCircle2,
  Zap,
  Building2,
  Package,
} from "lucide-react";

import portraitLabReagents from "../assets/images/portrait_lab_reagents_1791997681228.jpg";
import portraitBulkLogistics from "../assets/images/portrait_bulk_logistics_1791997712073.jpg";
import portraitBiochemResearch from "../assets/images/portrait_biochem_research_1791997731872.jpg";

export interface HeroFeatureItem {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  enabled: boolean;
}

export interface AcceptedCryptoItem {
  id: string;
  name: string;
  symbol: string;
  logoUrl: string;
  enabled: boolean;
}

export interface FooterBannerItem {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  altText?: string;
  linkUrl?: string;
  buttonText?: string;
  badge?: string;
  width?: number;
  height?: number;
  aspectRatio?: string;
  enabled: boolean;
  isMock?: boolean;
  createdAt?: number;
}

export interface SupportedLanguage {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  dir: "ltr" | "rtl";
}

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = [
  { code: "en", name: "English (Global)", nativeName: "English", flag: "🇺🇸", dir: "ltr" },
  { code: "hi", name: "Hindi (India)", nativeName: "हिन्दी", flag: "🇮🇳", dir: "ltr" },
  { code: "es", name: "Spanish", nativeName: "Español", flag: "🇪🇸", dir: "ltr" },
  { code: "de", name: "German", nativeName: "Deutsch", flag: "🇩🇪", dir: "ltr" },
  { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷", dir: "ltr" },
  { code: "ar", name: "Arabic", nativeName: "العربية", flag: "🇦🇪", dir: "rtl" },
  { code: "zh", name: "Chinese (Simplified)", nativeName: "中文", flag: "🇨🇳", dir: "ltr" },
  { code: "ja", name: "Japanese", nativeName: "日本語", flag: "🇯🇵", dir: "ltr" },
];

export interface MarketplaceTranslations {
  catalog: string;
  orders: string;
  inquiries: string;
  safetyFaq: string;
  signIn: string;
  signOut: string;
  account: string;
  cart: string;
  searchPlaceholder: string;
  showingReagents: string;
  authenticatedReagents: string;
  allCategories: string;
  resetFilters: string;
  noReagentsFound: string;
  adjustFiltersDesc: string;
  // Hero & Crypto Bar
  heroTag: string;
  heroTitle: string;
  heroTitleHighlight: string;
  heroDescription: string;
  heroPrimaryBtnText: string;
  heroSecondaryBtnText: string;
  feat1Title: string;
  feat1Subtitle: string;
  feat2Title: string;
  feat2Subtitle: string;
  feat3Title: string;
  feat3Subtitle: string;
  feat4Title: string;
  feat4Subtitle: string;
  cryptoBarSmallLabel: string;
  cryptoBarTitle: string;
  // Product Card & Details
  enquireOnWhatsapp: string;
  assured: string;
  off: string;
  onlyLeft: string;
  lowStock: string;
  save: string;
  freeDelivery: string;
  byTomorrow: string;
  reagentPrice: string;
  gradeLabel: string;
  purityLabel: string;
  returnToCatalog: string;
  technicalSpecs: string;
  empiricalFormula: string;
  molecularWeight: string;
  casRegistry: string;
  physicalAppearance: string;
  meltingThreshold: string;
  boilingThreshold: string;
  ghsPictogramsTitle: string;
  unitReferencePrice: string;
  dealPrice: string;
  volumetricUnitPrice: string;
  estimatedDispatch: string;
  businessDays: string;
  safetyContainmentType: string;
  downloadSds: string;
  msdsHeading: string;
  customerReviewsTitle: string;
  writeReviewTitle: string;
  yourNamePlaceholder: string;
  yourReviewPlaceholder: string;
  submitReviewBtn: string;
  submittingReviewBtn: string;
  verifiedCustomerBadge: string;
  basedOnReviews: string;
  // Compliance & Footer
  complianceTitle: string;
  complianceText: string;
  complianceBtnText: string;
  footerTagline: string;
  whatsappDesk: string;
  companyCol: string;
  productCatalogLink: string;
  aboutCompanyLink: string;
  qualityComplianceLink: string;
  contactUsLink: string;
  logisticsSupportCol: string;
  shippingHazmatLink: string;
  returnsClaimsLink: string;
  refundPolicyLink: string;
  safetyFaqManualLink: string;
  legalRegulatoryCol: string;
  termsConditionsLink: string;
  privacyPolicyLink: string;
  safetyDisclaimerLink: string;
  cookiePolicyLink: string;
}

export const UI_TRANSLATIONS: Record<string, MarketplaceTranslations> = {
  en: {
    catalog: "Catalog",
    orders: "Orders",
    inquiries: "Inquiries",
    safetyFaq: "Safety & FAQ",
    signIn: "Sign In",
    signOut: "Sign Out",
    account: "Account",
    cart: "Cart",
    searchPlaceholder: "Search by chemical name, CAS number, or formula...",
    showingReagents: "Showing",
    authenticatedReagents: "authenticated reagents",
    allCategories: "All",
    resetFilters: "Reset Catalog filters",
    noReagentsFound: "No corresponding reagents located",
    adjustFiltersDesc: "Adjust your catalog filters or correct the nomenclature query.",
    heroTag: "Global Chemical Marketplace",
    heroTitle: "High-Quality Chemicals for",
    heroTitleHighlight: "Research, Industry & Innovation",
    heroDescription: "Discover a wide range of laboratory chemicals, industrial chemicals and specialty compounds from trusted suppliers — all in one place.",
    heroPrimaryBtnText: "Explore Products",
    heroSecondaryBtnText: "Browse Categories",
    feat1Title: "Trusted Suppliers",
    feat1Subtitle: "Verified & reliable partners",
    feat2Title: "Wide Product Range",
    feat2Subtitle: "From lab to industrial grade",
    feat3Title: "Secure Shipping",
    feat3Subtitle: "Safe & global delivery",
    feat4Title: "Dedicated Support",
    feat4Subtitle: "Here for your needs",
    cryptoBarSmallLabel: "We Accept",
    cryptoBarTitle: "Cryptocurrency Payments",
    enquireOnWhatsapp: "Enquire on WhatsApp",
    assured: "Assured",
    off: "OFF",
    onlyLeft: "Only",
    lowStock: "Low Stock",
    save: "Save",
    freeDelivery: "Free Delivery",
    byTomorrow: "by Tomorrow",
    reagentPrice: "Reagent price",
    gradeLabel: "Grade",
    purityLabel: "Purity",
    returnToCatalog: "Return to Chemical Registry Catalogue",
    technicalSpecs: "Technical Specifications",
    empiricalFormula: "Empirical Formula",
    molecularWeight: "Molecular Weight",
    casRegistry: "CAS Number Registry",
    physicalAppearance: "Physical Appearance",
    meltingThreshold: "Melting Threshold",
    boilingThreshold: "Boiling Threshold",
    ghsPictogramsTitle: "GHS Class Pictograms",
    unitReferencePrice: "Unit Reference Price",
    dealPrice: "Deal Price",
    volumetricUnitPrice: "Volumetric unit price",
    estimatedDispatch: "Estimated Dispatch & Transit:",
    businessDays: "10–15 Business Days",
    safetyContainmentType: "Safety Containment Type",
    downloadSds: "Download SDS",
    msdsHeading: "Material Safety Data Sheet (SDS)",
    customerReviewsTitle: "Customer Ratings & Verified Reviews",
    writeReviewTitle: "Rate & Review This Product",
    yourNamePlaceholder: "Your Name or Institution...",
    yourReviewPlaceholder: "Share your experience with purity, packaging, or delivery...",
    submitReviewBtn: "Submit Real Rating",
    submittingReviewBtn: "Submitting...",
    verifiedCustomerBadge: "Verified Buyer",
    basedOnReviews: "reviews",
    complianceTitle: "GHS Custody compliance assurance:",
    complianceText: "Aniixa monitors safety profiles continuously. Safe handling documentation complies with international chemistry standards. Settle transactions securely with our verified checkout portal.",
    complianceBtnText: "Open Safety & FAQ Manual",
    footerTagline: "Global supplier of analytical reagents, ACS & HPLC grade solvents, buffering solutions, and certified laboratory materials conforming to GHS and OSHA regulatory standards.",
    whatsappDesk: "WhatsApp Desk",
    companyCol: "Company",
    productCatalogLink: "Product Catalog",
    aboutCompanyLink: "About Company",
    qualityComplianceLink: "Quality & Compliance",
    contactUsLink: "Contact Us",
    logisticsSupportCol: "Logistics & Support",
    shippingHazmatLink: "Shipping & Hazmat Transit",
    returnsClaimsLink: "Returns & Claims",
    refundPolicyLink: "Refund Policy",
    safetyFaqManualLink: "Safety & FAQ Manual",
    legalRegulatoryCol: "Legal & Regulatory",
    termsConditionsLink: "Terms & Conditions",
    privacyPolicyLink: "Privacy Policy",
    safetyDisclaimerLink: "Safety Disclaimer",
    cookiePolicyLink: "Cookie Policy",
  },
  de: {
    catalog: "Katalog",
    orders: "Bestellungen",
    inquiries: "Anfragen",
    safetyFaq: "Sicherheit & FAQ",
    signIn: "Anmelden",
    signOut: "Abmelden",
    account: "Konto",
    cart: "Warenkorb",
    searchPlaceholder: "Suche nach Chemikalienname, CAS-Nummer oder Formel...",
    showingReagents: "Zeige",
    authenticatedReagents: "zertifizierte Reagenzien",
    allCategories: "Alle",
    resetFilters: "Filter zurücksetzen",
    noReagentsFound: "Keine entsprechenden Reagenzien gefunden",
    adjustFiltersDesc: "Passen Sie Ihre Katalogfilter an oder korrigieren Sie Ihre Suchanfrage.",
    heroTag: "Globaler Chemikalien-Marktplatz",
    heroTitle: "Hochwertige Chemikalien für",
    heroTitleHighlight: "Forschung, Industrie & Innovation",
    heroDescription: "Entdecken Sie eine breite Palette an Laborchemikalien, Industriechemikalien und Spezialverbindungen von geprüften Lieferanten — alles an einem Ort.",
    heroPrimaryBtnText: "Produkte entdecken",
    heroSecondaryBtnText: "Kategorien durchsuchen",
    feat1Title: "Geprüfte Lieferanten",
    feat1Subtitle: "Verifizierte & zuverlässige Partner",
    feat2Title: "Breites Sortiment",
    feat2Subtitle: "Von Labor- bis Industriequalität",
    feat3Title: "Sicherer Versand",
    feat3Subtitle: "Sichere & weltweite Lieferung",
    feat4Title: "Engagierter Support",
    feat4Subtitle: "Jederzeit für Sie da",
    cryptoBarSmallLabel: "Wir akzeptieren",
    cryptoBarTitle: "Kryptowährungs-Zahlungen",
    enquireOnWhatsapp: "Anfrage über WhatsApp",
    assured: "Geprüft",
    off: "RABATT",
    onlyLeft: "Nur noch",
    lowStock: "Geringer Bestand",
    save: "Sparen",
    freeDelivery: "Kostenlose Lieferung",
    byTomorrow: "bis morgen",
    reagentPrice: "Reagenzienpreis",
    gradeLabel: "Qualität",
    purityLabel: "Reinheit",
    returnToCatalog: "Zurück zum Chemikalien-Katalog",
    technicalSpecs: "Technische Spezifikationen",
    empiricalFormula: "Summenformel",
    molecularWeight: "Molekulargewicht",
    casRegistry: "CAS-Registrierungsnummer",
    physicalAppearance: "Aggregatzustand",
    meltingThreshold: "Schmelzpunkt",
    boilingThreshold: "Siedepunkt",
    ghsPictogramsTitle: "GHS-Gefahrenpiktogramme",
    unitReferencePrice: "Einheits-Referenzpreis",
    dealPrice: "Angebotspreis",
    volumetricUnitPrice: "Volumetrischer Stückpreis",
    estimatedDispatch: "Geschätzter Versand & Transit:",
    businessDays: "10–15 Werktage",
    safetyContainmentType: "Sicherheitsbehälter-Typ",
    downloadSds: "SDB herunterladen",
    msdsHeading: "Sicherheitsdatenblatt (SDB / SDS)",
    customerReviewsTitle: "Kundenbewertungen & Verifizierte Erfahrungsberichte",
    writeReviewTitle: "Dieses Produkt bewerten",
    yourNamePlaceholder: "Ihr Name oder Institut...",
    yourReviewPlaceholder: "Teilen Sie Ihre Erfahrung zu Reinheit, Verpackung oder Lieferung...",
    submitReviewBtn: "Echte Bewertung absenden",
    submittingReviewBtn: "Wird gesendet...",
    verifiedCustomerBadge: "Verifizierter Käufer",
    basedOnReviews: "Bewertungen",
    complianceTitle: "GHS-Konformitätssicherung:",
    complianceText: "Aniixa überwacht Sicherheitsprofile kontinuierlich. Die Sicherheitsdokumentation entspricht internationalen Chemiestandards.",
    complianceBtnText: "Sicherheits- & FAQ-Handbuch",
    footerTagline: "Weltweiter Lieferant von Analysenreagenzien, ACS- & HPLC-Lösungsmitteln, Pufferlösungen und zertifizierten Labormaterialien nach GHS- und OSHA-Standards.",
    whatsappDesk: "WhatsApp-Service",
    companyCol: "Unternehmen",
    productCatalogLink: "Produktkatalog",
    aboutCompanyLink: "Über uns",
    qualityComplianceLink: "Qualität & Compliance",
    contactUsLink: "Kontakt",
    logisticsSupportCol: "Logistik & Support",
    shippingHazmatLink: "Gefahrgutversand",
    returnsClaimsLink: "Rücksendungen & Reklamationen",
    refundPolicyLink: "Rückerstattungsrichtlinie",
    safetyFaqManualLink: "Sicherheits- & FAQ-Handbuch",
    legalRegulatoryCol: "Rechtliches & Regulierung",
    termsConditionsLink: "Allgemeine Geschäftsbedingungen",
    privacyPolicyLink: "Datenschutzerklärung",
    safetyDisclaimerLink: "Sicherheitshinweis",
    cookiePolicyLink: "Cookie-Richtlinie",
  },
  hi: {
    catalog: "कैटलॉग",
    orders: "ऑर्डर",
    inquiries: "पूछताछ",
    safetyFaq: "सुरक्षा और FAQ",
    signIn: "साइन इन",
    signOut: "साइन आउट",
    account: "खाता",
    cart: "कार्ट",
    searchPlaceholder: "रासायनिक नाम, CAS नंबर या सूत्र द्वारा खोजें...",
    showingReagents: "दिखा रहा है",
    authenticatedReagents: "प्रमाणित अभिकर्मक",
    allCategories: "सभी",
    resetFilters: "फ़िल्टर रीसेट करें",
    noReagentsFound: "कोई संबंधित अभिकर्मक नहीं मिला",
    adjustFiltersDesc: "अपने कैटलॉग फ़िल्टर समायोजित करें या खोज शब्द सुधारें।",
    heroTag: "ग्लोबल केमिकल मार्केटप्लेस",
    heroTitle: "उच्च-गुणवत्ता वाले रसायन",
    heroTitleHighlight: "अनुसंधान, उद्योग और नवाचार के लिए",
    heroDescription: "विश्वसनीय आपूर्तिकर्ताओं से प्रयोगशाला रसायनों, औद्योगिक रसायनों और विशेष यौगिकों की विस्तृत श्रृंखला एक ही स्थान पर प्राप्त करें।",
    heroPrimaryBtnText: "उत्पाद देखें",
    heroSecondaryBtnText: "श्रेणियाँ ब्राउज़ करें",
    feat1Title: "विश्वसनीय आपूर्तिकर्ता",
    feat1Subtitle: "सत्यापित और भरोसेमंद भागीदार",
    feat2Title: "विस्तृत उत्पाद श्रृंखला",
    feat2Subtitle: "लैब से औद्योगिक ग्रेड तक",
    feat3Title: "सुरक्षित शिपिंग",
    feat3Subtitle: "सुरक्षित और वैश्विक डिलीवरी",
    feat4Title: "समर्पित सहायता",
    feat4Subtitle: "आपकी हर ज़रूरत के लिए उपलब्ध",
    cryptoBarSmallLabel: "हम स्वीकार करते हैं",
    cryptoBarTitle: "क्रिप्टोकरेंसी भुगतान",
    enquireOnWhatsapp: "WhatsApp पर पूछताछ करें",
    assured: "प्रमाणित",
    off: "छूट",
    onlyLeft: "केवल",
    lowStock: "कम स्टॉक",
    save: "बचत",
    freeDelivery: "मुफ़्त डिलीवरी",
    byTomorrow: "कल तक",
    reagentPrice: "अभिकर्मक मूल्य",
    gradeLabel: "ग्रेड",
    purityLabel: "शुद्धता",
    returnToCatalog: "रासायनिक कैटलॉग पर वापस जाएं",
    technicalSpecs: "तकनीकी विशिष्टताएँ",
    empiricalFormula: "रासायनिक सूत्र",
    molecularWeight: "आणविक भार",
    casRegistry: "CAS नंबर रजिस्ट्री",
    physicalAppearance: "भौतिक अवस्था",
    meltingThreshold: "गलनांक",
    boilingThreshold: "क्वथनांक",
    ghsPictogramsTitle: "GHS सुरक्षा चिह्न",
    unitReferencePrice: "इकाई संदर्भ मूल्य",
    dealPrice: "डील मूल्य",
    volumetricUnitPrice: "इकाई मूल्य",
    estimatedDispatch: "अनुमानित डिस्पैच और डिलीवरी:",
    businessDays: "10–15 कार्य दिवस",
    safetyContainmentType: "सुरक्षा कंटेनर प्रकार",
    downloadSds: "SDS डाउनलोड करें",
    msdsHeading: "सामग्री सुरक्षा डेटा शीट (SDS)",
    customerReviewsTitle: "ग्राहक रेटिंग और सत्यापित समीक्षाएं",
    writeReviewTitle: "इस उत्पाद को रेट और रिव्यू करें",
    yourNamePlaceholder: "आपका नाम या संस्थान...",
    yourReviewPlaceholder: "शुद्धता, पैकेजिंग या डिलीवरी के बारे में अपना अनुभव लिखें...",
    submitReviewBtn: "रेटिंग सबमिट करें",
    submittingReviewBtn: "सबमिट हो रहा है...",
    verifiedCustomerBadge: "सत्यापित खरीदार",
    basedOnReviews: "समीक्षाएं",
    complianceTitle: "GHS सुरक्षा अनुपालन आश्वासन:",
    complianceText: "Aniixa लगातार सुरक्षा मानकों की निगरानी करता है। सुरक्षित हैंडलिंग दस्तावेज़ अंतरराष्ट्रीय रसायन मानकों का पालन करते हैं।",
    complianceBtnText: "सुरक्षा और FAQ मैनुअल खोलें",
    footerTagline: "GHS और OSHA नियामक मानकों के अनुरूप विश्लेषणात्मक अभिकर्मकों, ACS और HPLC ग्रेड सॉल्वैंट्स और प्रमाणित प्रयोगशाला सामग्री के वैश्विक आपूर्तिकर्ता।",
    whatsappDesk: "WhatsApp सहायता केंद्र",
    companyCol: "कंपनी",
    productCatalogLink: "उत्पाद कैटलॉग",
    aboutCompanyLink: "कंपनी के बारे में",
    qualityComplianceLink: "गुणवत्ता और अनुपालन",
    contactUsLink: "संपर्क करें",
    logisticsSupportCol: "लॉजिस्टिक्स और सहायता",
    shippingHazmatLink: "शिपिंग और ट्रांज़िट नीति",
    returnsClaimsLink: "रिटर्न और दावे",
    refundPolicyLink: "रिफंड नीति",
    safetyFaqManualLink: "सुरक्षा और FAQ मैनुअल",
    legalRegulatoryCol: "कानूनी और नियामक",
    termsConditionsLink: "नियम और शर्तें",
    privacyPolicyLink: "गोपनीयता नीति",
    safetyDisclaimerLink: "सुरक्षा अस्वीकरण",
    cookiePolicyLink: "कुकी नीति",
  },
  es: {
    catalog: "Catálogo",
    orders: "Pedidos",
    inquiries: "Consultas",
    safetyFaq: "Seguridad y FAQ",
    signIn: "Iniciar Sesión",
    signOut: "Cerrar Sesión",
    account: "Cuenta",
    cart: "Carrito",
    searchPlaceholder: "Buscar por nombre químico, número CAS o fórmula...",
    showingReagents: "Mostrando",
    authenticatedReagents: "reactivos certificados",
    allCategories: "Todos",
    resetFilters: "Restablecer filtros",
    noReagentsFound: "No se encontraron reactivos correspondientes",
    adjustFiltersDesc: "Ajuste los filtros del catálogo o corrija su consulta de búsqueda.",
    heroTag: "Mercado Químico Global",
    heroTitle: "Productos Químicos de Alta Calidad para",
    heroTitleHighlight: "Investigación, Industria e Innovación",
    heroDescription: "Descubra una amplia gama de reactivos de laboratorio, productos químicos industriales y compuestos especializados de proveedores verificados en un solo lugar.",
    heroPrimaryBtnText: "Explorar Productos",
    heroSecondaryBtnText: "Ver Categorías",
    feat1Title: "Proveedores Confiables",
    feat1Subtitle: "Socios verificados y seguros",
    feat2Title: "Amplia Gama",
    feat2Subtitle: "De grado de laboratorio a industrial",
    feat3Title: "Envío Seguro",
    feat3Subtitle: "Entrega segura y global",
    feat4Title: "Soporte Dedicado",
    feat4Subtitle: "Siempre a su disposición",
    cryptoBarSmallLabel: "Aceptamos",
    cryptoBarTitle: "Pagos con Criptomonedas",
    enquireOnWhatsapp: "Consultar por WhatsApp",
    assured: "Verificado",
    off: "DTO",
    onlyLeft: "Solo quedan",
    lowStock: "Stock Bajo",
    save: "Ahorre",
    freeDelivery: "Envío Gratis",
    byTomorrow: "para mañana",
    reagentPrice: "Precio del reactivo",
    gradeLabel: "Grado",
    purityLabel: "Pureza",
    returnToCatalog: "Volver al Catálogo de Reactivos",
    technicalSpecs: "Especificaciones Técnicas",
    empiricalFormula: "Fórmula Empírica",
    molecularWeight: "Peso Molecular",
    casRegistry: "Número de Registro CAS",
    physicalAppearance: "Apariencia Física",
    meltingThreshold: "Punto de Fusión",
    boilingThreshold: "Punto de Ebullición",
    ghsPictogramsTitle: "Pictogramas de Peligro GHS",
    unitReferencePrice: "Precio Unitario de Referencia",
    dealPrice: "Precio de Oferta",
    volumetricUnitPrice: "Precio unitario volumétrico",
    estimatedDispatch: "Despacho y Tránsito Estimado:",
    businessDays: "10–15 Días Hábiles",
    safetyContainmentType: "Tipo de Envase de Seguridad",
    downloadSds: "Descargar HDS",
    msdsHeading: "Hoja de Datos de Seguridad (SDS)",
    customerReviewsTitle: "Calificaciones y Reseñas Verificadas",
    writeReviewTitle: "Calificar y Opinar sobre este Producto",
    yourNamePlaceholder: "Su nombre o institución...",
    yourReviewPlaceholder: "Comparta su experiencia con la pureza, el envase o la entrega...",
    submitReviewBtn: "Enviar Calificación Real",
    submittingReviewBtn: "Enviando...",
    verifiedCustomerBadge: "Comprador Verificado",
    basedOnReviews: "reseñas",
    complianceTitle: "Garantía de cumplimiento GHS:",
    complianceText: "Aniixa supervisa continuamente los perfiles de seguridad. La documentación cumple con las normas químicas internacionales.",
    complianceBtnText: "Abrir Manual de Seguridad y FAQ",
    footerTagline: "Proveedor global de reactivos analíticos, solventes grado ACS y HPLC, soluciones tampón y materiales de laboratorio certificados según normas GHS y OSHA.",
    whatsappDesk: "Mesa de Ayuda WhatsApp",
    companyCol: "Empresa",
    productCatalogLink: "Catálogo de Productos",
    aboutCompanyLink: "Sobre Nosotros",
    qualityComplianceLink: "Calidad y Cumplimiento",
    contactUsLink: "Contacto",
    logisticsSupportCol: "Logística y Soporte",
    shippingHazmatLink: "Envío de Materiales Peligrosos",
    returnsClaimsLink: "Devoluciones y Reclamos",
    refundPolicyLink: "Política de Reembolso",
    safetyFaqManualLink: "Manual de Seguridad y FAQ",
    legalRegulatoryCol: "Legal y Regulatorio",
    termsConditionsLink: "Términos y Condiciones",
    privacyPolicyLink: "Política de Privacidad",
    safetyDisclaimerLink: "Aviso de Seguridad",
    cookiePolicyLink: "Política de Cookies",
  },
  fr: {
    catalog: "Catalogue",
    orders: "Commandes",
    inquiries: "Demandes",
    safetyFaq: "Sécurité & FAQ",
    signIn: "Connexion",
    signOut: "Déconnexion",
    account: "Compte",
    cart: "Panier",
    searchPlaceholder: "Rechercher par nom chimique, numéro CAS ou formule...",
    showingReagents: "Affichage de",
    authenticatedReagents: "réactifs certifiés",
    allCategories: "Tous",
    resetFilters: "Réinitialiser les filtres",
    noReagentsFound: "Aucun réactif correspondant trouvé",
    adjustFiltersDesc: "Ajustez vos filtres de catalogue ou corrigez votre recherche.",
    heroTag: "Marché Chimique Mondial",
    heroTitle: "Produits Chimiques de Haute Qualité pour",
    heroTitleHighlight: "la Recherche, l'Industrie et l'Innovation",
    heroDescription: "Découvrez une large gamme de produits chimiques de laboratoire, industriels et composés spécialisés auprès de fournisseurs vérifiés — au même endroit.",
    heroPrimaryBtnText: "Explorer les Produits",
    heroSecondaryBtnText: "Parcourir les Catégories",
    feat1Title: "Fournisseurs de Confiance",
    feat1Subtitle: "Partenaires vérifiés et fiables",
    feat2Title: "Large Gamme",
    feat2Subtitle: "Du laboratoire à la qualité industrielle",
    feat3Title: "Expédition Sécurisée",
    feat3Subtitle: "Livraison sûre et mondiale",
    feat4Title: "Support Dédié",
    feat4Subtitle: "À votre écoute 24/7",
    cryptoBarSmallLabel: "Nous Acceptons",
    cryptoBarTitle: "les Paiements en Cryptomonnaies",
    enquireOnWhatsapp: "Demander sur WhatsApp",
    assured: "Vérifié",
    off: "REMISE",
    onlyLeft: "Plus que",
    lowStock: "Stock Faible",
    save: "Économisez",
    freeDelivery: "Livraison Gratuite",
    byTomorrow: "dès demain",
    reagentPrice: "Prix du réactif",
    gradeLabel: "Qualité",
    purityLabel: "Pureté",
    returnToCatalog: "Retour au Catalogue Chimique",
    technicalSpecs: "Spécifications Techniques",
    empiricalFormula: "Formule Chimique",
    molecularWeight: "Masse Moléculaire",
    casRegistry: "Numéro CAS",
    physicalAppearance: "État Physique",
    meltingThreshold: "Point de Fusion",
    boilingThreshold: "Point d'Ébullition",
    ghsPictogramsTitle: "Pictogrammes de Danger SGH",
    unitReferencePrice: "Prix Unitaire de Référence",
    dealPrice: "Prix Promotionnel",
    volumetricUnitPrice: "Prix unitaire volumétrique",
    estimatedDispatch: "Expédition et Transit Estimés :",
    businessDays: "10–15 Jours Ouvrables",
    safetyContainmentType: "Type de Contenant de Sécurité",
    downloadSds: "Télécharger FDS",
    msdsHeading: "Fiche de Données de Sécurité (FDS / SDS)",
    customerReviewsTitle: "Avis Clients & Évaluations Vérifiées",
    writeReviewTitle: "Noter et Évaluer ce Produit",
    yourNamePlaceholder: "Votre nom ou institution...",
    yourReviewPlaceholder: "Partagez votre expérience concernant la pureté, l'emballage ou la livraison...",
    submitReviewBtn: "Publier l'Évaluation",
    submittingReviewBtn: "Envoi en cours...",
    verifiedCustomerBadge: "Acheteur Vérifié",
    basedOnReviews: "avis",
    complianceTitle: "Assurance de conformité SGH :",
    complianceText: "Aniixa surveille en permanence les profils de sécurité conformément aux normes internationales.",
    complianceBtnText: "Ouvrir le Manuel Sécurité & FAQ",
    footerTagline: "Fournisseur mondial de réactifs analytiques, solvants ACS & HPLC, solutions tampons et matériels de laboratoire certifiés conformes aux normes SGH et OSHA.",
    whatsappDesk: "Assistance WhatsApp",
    companyCol: "Entreprise",
    productCatalogLink: "Catalogue Produits",
    aboutCompanyLink: "À Propos",
    qualityComplianceLink: "Qualité & Conformité",
    contactUsLink: "Contactez-nous",
    logisticsSupportCol: "Logistique & Support",
    shippingHazmatLink: "Expédition Matières Dangereuses",
    returnsClaimsLink: "Retours & Réclamations",
    refundPolicyLink: "Politique de Remboursement",
    safetyFaqManualLink: "Manuel Sécurité & FAQ",
    legalRegulatoryCol: "Mentions Légales",
    termsConditionsLink: "Conditions Générales",
    privacyPolicyLink: "Politique de Confidentialité",
    safetyDisclaimerLink: "Avertissement de Sécurité",
    cookiePolicyLink: "Politique des Cookies",
  },
  ar: {
    catalog: "الكتالوج",
    orders: "الطلبات",
    inquiries: "الاستفسارات",
    safetyFaq: "السلامة والأسئلة",
    signIn: "تسجيل الدخول",
    signOut: "تسجيل الخروج",
    account: "الحساب",
    cart: "السلة",
    searchPlaceholder: "ابحث عن طريق الاسم الكيميائي أو رقم CAS أو الصيغة...",
    showingReagents: "عرض",
    authenticatedReagents: "كواشف معتمدة",
    allCategories: "الكل",
    resetFilters: "إعادة تعيين الفلاتر",
    noReagentsFound: "لم يتم العثور على كواشف مطابقة",
    adjustFiltersDesc: "قم بتعديل فلاتر الكتالوج أو تصحيح عبارة البحث.",
    heroTag: "السوق الكيميائي العالمي",
    heroTitle: "مواد كيميائية عالية الجودة من أجل",
    heroTitleHighlight: "البحث العلمي والصناعة والابتكار",
    heroDescription: "اكتشف مجموعة واسعة من المواد الكيميائية المخبرية والصناعية والمركبات المتخصصة من موردين موثوقين — في مكان واحد.",
    heroPrimaryBtnText: "استكشف المنتجات",
    heroSecondaryBtnText: "تصفح الفئات",
    feat1Title: "موردون موثوقون",
    feat1Subtitle: "شركاء معتمدون وموثوقون",
    feat2Title: "تشكيلة واسعة",
    feat2Subtitle: "من الدرجة المخبرية إلى الصناعية",
    feat3Title: "شحن آمن",
    feat3Subtitle: "توصيل آمن وعالمي",
    feat4Title: "دعم مخصص",
    feat4Subtitle: "متواجدون لخدمتكم",
    cryptoBarSmallLabel: "نحن نقبل",
    cryptoBarTitle: "مدفوعات العملات الرقمية",
    enquireOnWhatsapp: "استفسر عبر واتساب",
    assured: "معتمد",
    off: "خصم",
    onlyLeft: "متبقي فقط",
    lowStock: "مخزون منخفض",
    save: "وفر",
    freeDelivery: "توصيل مجاني",
    byTomorrow: "غداً",
    reagentPrice: "سعر الكاشف",
    gradeLabel: "الدرجة",
    purityLabel: "النقاء",
    returnToCatalog: "العودة إلى كتالوج المواد الكيميائية",
    technicalSpecs: "المواصفات الفنية",
    empiricalFormula: "الصيغة الكيميائية",
    molecularWeight: "الوزن الجزيئي",
    casRegistry: "رقم تسجيل CAS",
    physicalAppearance: "الحالة الفيزيائية",
    meltingThreshold: "درجة الانصهار",
    boilingThreshold: "درجة الغليان",
    ghsPictogramsTitle: "رموز المخاطر GHS",
    unitReferencePrice: "سعر الوحدة المرجعي",
    dealPrice: "سعر العرض",
    volumetricUnitPrice: "سعر الوحدة الحجمي",
    estimatedDispatch: "الشحن والتوصيل المتوقع:",
    businessDays: "10–15 يوم عمل",
    safetyContainmentType: "نوع عبوة الأمان",
    downloadSds: "تحميل صحيفة السلامة SDS",
    msdsHeading: "صحيفة بيانات السلامة (SDS)",
    customerReviewsTitle: "تقييمات العملاء والمراجعات الموثقة",
    writeReviewTitle: "قيّم واكتب مراجعة لهذا المنتج",
    yourNamePlaceholder: "اسمك أو اسم المؤسسة...",
    yourReviewPlaceholder: "شارك تجربتك حول النقاء أو التغليف أو التوصيل...",
    submitReviewBtn: "إرسال التقييم الحقيقي",
    submittingReviewBtn: "جاري الإرسال...",
    verifiedCustomerBadge: "مشتري موثق",
    basedOnReviews: "مراجعات",
    complianceTitle: "ضمان الامتثال لمعايير GHS:",
    complianceText: "تراقب Aniixa ملفات السلامة باستمرار وتتوافق جميع الوثائق مع المعايير الكيميائية الدولية.",
    complianceBtnText: "فتح دليل السلامة والأسئلة الشائعة",
    footerTagline: "مورد عالمي للكواشف التحليلية والمذيبات المخبرية المعتمدة وفق معايير GHS و OSHA.",
    whatsappDesk: "مكتب واتساب",
    companyCol: "الشركة",
    productCatalogLink: "كتالوج المنتجات",
    aboutCompanyLink: "عن الشركة",
    qualityComplianceLink: "الجودة والامتثال",
    contactUsLink: "اتصل بنا",
    logisticsSupportCol: "الشحن والدعم",
    shippingHazmatLink: "شحن المواد الخطرة",
    returnsClaimsLink: "المرتجعات والمطالبات",
    refundPolicyLink: "سياسة الاسترداد",
    safetyFaqManualLink: "دليل السلامة والأسئلة",
    legalRegulatoryCol: "الشؤون القانونية",
    termsConditionsLink: "الشروط والأحكام",
    privacyPolicyLink: "سياسة الخصوصية",
    safetyDisclaimerLink: "إخلاء مسؤولية السلامة",
    cookiePolicyLink: "سياسة ملفات الارتباط",
  },
  zh: {
    catalog: "产品目录",
    orders: "订单中心",
    inquiries: "询价记录",
    safetyFaq: "安全与常见问题",
    signIn: "登录",
    signOut: "退出",
    account: "账户",
    cart: "购物车",
    searchPlaceholder: "按化学品名称、CAS号或分子式搜索...",
    showingReagents: "显示",
    authenticatedReagents: "种认证试剂",
    allCategories: "全部",
    resetFilters: "重置筛选",
    noReagentsFound: "未找到匹配的化学试剂",
    adjustFiltersDesc: "请调整目录筛选条件或检查搜索关键词。",
    heroTag: "全球化学品交易平台",
    heroTitle: "高品质化学试剂赋能",
    heroTitleHighlight: "科研、工业与创新",
    heroDescription: "一站式探索来自认证供应商的实验室试剂、工业化学品与特种化合物。",
    heroPrimaryBtnText: "浏览产品",
    heroSecondaryBtnText: "查看分类",
    feat1Title: "认证供应商",
    feat1Subtitle: "经过验证的可靠合作伙伴",
    feat2Title: "品类齐全",
    feat2Subtitle: "涵盖实验级至工业级",
    feat3Title: "安全运输",
    feat3Subtitle: "合规安全的全球配送",
    feat4Title: "专属客服",
    feat4Subtitle: "全天候专业技术支持",
    cryptoBarSmallLabel: "我们支持",
    cryptoBarTitle: "加密货币支付",
    enquireOnWhatsapp: "通过 WhatsApp 询价",
    assured: "品质保障",
    off: "立减",
    onlyLeft: "仅剩",
    lowStock: "库存紧张",
    save: "节省",
    freeDelivery: "免费配送",
    byTomorrow: "次日达",
    reagentPrice: "试剂价格",
    gradeLabel: "级别",
    purityLabel: "纯度",
    returnToCatalog: "返回化学试剂目录",
    technicalSpecs: "技术参数规格",
    empiricalFormula: "化学分子式",
    molecularWeight: "分子量",
    casRegistry: "CAS 登记号",
    physicalAppearance: "物理性状",
    meltingThreshold: "熔点",
    boilingThreshold: "沸点",
    ghsPictogramsTitle: "GHS 危险象形图",
    unitReferencePrice: "单位参考价",
    dealPrice: "特惠价",
    volumetricUnitPrice: "标准单价",
    estimatedDispatch: "预计发货与运输周期：",
    businessDays: "10–15 个工作日",
    safetyContainmentType: "安全包装容器类型",
    downloadSds: "下载 SDS",
    msdsHeading: "化学品安全技术说明书 (SDS)",
    customerReviewsTitle: "客户真实评分与评价",
    writeReviewTitle: "评价此产品",
    yourNamePlaceholder: "您的姓名或机构名称...",
    yourReviewPlaceholder: "分享您对产品纯度、包装或物流配送的真实体验...",
    submitReviewBtn: "提交真实评价",
    submittingReviewBtn: "提交中...",
    verifiedCustomerBadge: "认证买家",
    basedOnReviews: "条评价",
    complianceTitle: "GHS 合规安全保障：",
    complianceText: "Aniixa 持续监控安全合规档案，所有安全操作文档均符合国际化学品标准。",
    complianceBtnText: "打开安全与常见问答手册",
    footerTagline: "符合 GHS 和 OSHA 标准的分析试剂、ACS 与 HPLC 级溶剂、缓冲溶液及认证实验室材料全球供应商。",
    whatsappDesk: "WhatsApp 客服专线",
    companyCol: "关于公司",
    productCatalogLink: "产品目录",
    aboutCompanyLink: "关于我们",
    qualityComplianceLink: "质量与合规",
    contactUsLink: "联系我们",
    logisticsSupportCol: "物流与支持",
    shippingHazmatLink: "危化品运输说明",
    returnsClaimsLink: "退换货政策",
    refundPolicyLink: "退款政策",
    safetyFaqManualLink: "安全与FAQ手册",
    legalRegulatoryCol: "法律与监管",
    termsConditionsLink: "服务条款",
    privacyPolicyLink: "隐私政策",
    safetyDisclaimerLink: "安全免责声明",
    cookiePolicyLink: "Cookie 政策",
  },
  ja: {
    catalog: "カタログ",
    orders: "注文履歴",
    inquiries: "お問い合わせ",
    safetyFaq: "安全性とFAQ",
    signIn: "ログイン",
    signOut: "ログアウト",
    account: "アカウント",
    cart: "カート",
    searchPlaceholder: "化学名、CAS番号、または化学式で検索...",
    showingReagents: "表示中:",
    authenticatedReagents: "件の認定試薬",
    allCategories: "すべて",
    resetFilters: "フィルターをリセット",
    noReagentsFound: "該当する試薬が見つかりません",
    adjustFiltersDesc: "カタログフィルターを調整するか、検索キーワードを修正してください。",
    heroTag: "グローバル化学品マーケットプレイス",
    heroTitle: "高品質な化学試薬を",
    heroTitleHighlight: "研究・産業・イノベーションへ",
    heroDescription: "信頼できるサプライヤーから、研究用試薬、工業用薬品、特殊化合物をワンストップで調達できます。",
    heroPrimaryBtnText: "製品を探す",
    heroSecondaryBtnText: "カテゴリー一覧",
    feat1Title: "認定サプライヤー",
    feat1Subtitle: "審査済みの信頼できるパートナー",
    feat2Title: "豊富な製品ライン",
    feat2Subtitle: "研究用から工業用グレードまで",
    feat3Title: "安全な輸送",
    feat3Subtitle: "安全・確実なグローバル配送",
    feat4Title: "専任サポート",
    feat4Subtitle: "専門チームが迅速に対応",
    cryptoBarSmallLabel: "対応決済",
    cryptoBarTitle: "暗号資産（仮想通貨）決済に対応",
    enquireOnWhatsapp: "WhatsAppで問い合わせる",
    assured: "品質保証",
    off: "OFF",
    onlyLeft: "残りわずか",
    lowStock: "在庫僅少",
    save: "割引",
    freeDelivery: "送料無料",
    byTomorrow: "明日お届け",
    reagentPrice: "試薬価格",
    gradeLabel: "グレード",
    purityLabel: "純度",
    returnToCatalog: "試薬カタログに戻る",
    technicalSpecs: "技術仕様",
    empiricalFormula: "化学式",
    molecularWeight: "分子量",
    casRegistry: "CAS登録番号",
    physicalAppearance: "外観・性状",
    meltingThreshold: "融点",
    boilingThreshold: "沸点",
    ghsPictogramsTitle: "GHS危険有害性ピクトグラム",
    unitReferencePrice: "参考単価",
    dealPrice: "特別価格",
    volumetricUnitPrice: "標準単価",
    estimatedDispatch: "発送・配送目安:",
    businessDays: "10〜15営業日",
    safetyContainmentType: "安全容器タイプ",
    downloadSds: "SDSをダウンロード",
    msdsHeading: "安全データシート (SDS)",
    customerReviewsTitle: "カスタマー評価・購入者レビュー",
    writeReviewTitle: "この製品を評価・レビューする",
    yourNamePlaceholder: "お名前または研究機関名...",
    yourReviewPlaceholder: "純度、梱包、配送に関するご感想をご記入ください...",
    submitReviewBtn: "レビューを投稿する",
    submittingReviewBtn: "送信中...",
    verifiedCustomerBadge: "認証済み購入者",
    basedOnReviews: "件のレビュー",
    complianceTitle: "GHS法令遵守保証:",
    complianceText: "Aniixaは安全プロファイルを常時監視し、国際的な化学安全基準に準拠したSDS文書を提供します。",
    complianceBtnText: "安全・FAQマニュアルを開く",
    footerTagline: "GHSおよびOSHA基準に準拠した分析用試薬、ACS・HPLCグレード溶媒、緩衝液、認定実験機材のグローバルサプライヤー。",
    whatsappDesk: "WhatsAppサポート窓口",
    companyCol: "企業情報",
    productCatalogLink: "製品カタログ",
    aboutCompanyLink: "会社概要",
    qualityComplianceLink: "品質とコンプライアンス",
    contactUsLink: "お問い合わせ",
    logisticsSupportCol: "配送・サポート",
    shippingHazmatLink: "危険物輸送について",
    returnsClaimsLink: "返品・クレーム",
    refundPolicyLink: "返金ポリシー",
    safetyFaqManualLink: "安全・FAQマニュアル",
    legalRegulatoryCol: "法務・規約",
    termsConditionsLink: "利用規約",
    privacyPolicyLink: "プライバシーポリシー",
    safetyDisclaimerLink: "免責事項",
    cookiePolicyLink: "Cookieポリシー",
  },
};

/**
 * Computes a deterministic baseline rating between 4.4 and 5.0 and a realistic review count
 * for any product until a customer submits a real rating/review.
 * Once a product has real customer reviews (`realReviewCount > 0`), it returns the exact real average rating and real count!
 */
export function sanitizeWhatsappPhone(rawPhone?: string): string {
  const cleaned = (rawPhone || "").replace(/[^0-9]/g, "");
  return cleaned || "15099941048";
}

export function formatWhatsappDisplay(rawPhone?: string): string {
  const raw = (rawPhone || "").trim();
  const digits = sanitizeWhatsappPhone(raw);
  if (digits.length === 11 && digits.startsWith("1")) {
    return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }
  if (digits.length === 12 && digits.startsWith("91")) {
    return `+91 ${digits.slice(2, 7)} ${digits.slice(7)}`;
  }
  if (raw.startsWith("+")) {
    return raw;
  }
  return `+${digits}`;
}

export function getProductRatingStats(product: {
  id: string;
  name?: string;
  cas?: string;
  realRatingAvg?: number | null;
  realReviewCount?: number | null;
}): {
  rating: number;
  ratingFormatted: string;
  reviewCount: number;
  isRealCustomerRating: boolean;
} {
  const realCount = Number(product.realReviewCount || 0);
  const realAvg = Number(product.realRatingAvg || 0);
  if (realCount > 0 && realAvg > 0) {
    const clampedReal = Math.min(5.0, Math.max(1.0, Math.round(realAvg * 10) / 10));
    return {
      rating: clampedReal,
      ratingFormatted: clampedReal.toFixed(1),
      reviewCount: realCount,
      isRealCustomerRating: true,
    };
  }

  // Deterministic hash from product.id + cas so each product gets a distinct rating in [4.4, 5.0]
  const seedStr = `${product.id || ""}-${product.cas || ""}-${product.name || ""}`;
  let hash = 2166136261;
  for (let i = 0; i < seedStr.length; i++) {
    hash ^= seedStr.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  const unsigned = hash >>> 0;

  // 7 possible steps: 4.4, 4.5, 4.6, 4.7, 4.8, 4.9, 5.0
  const ratingSteps = [4.4, 4.5, 4.6, 4.7, 4.8, 4.9, 5.0];
  const stepIdx = unsigned % ratingSteps.length;
  const rating = ratingSteps[stepIdx];

  // Deterministic review count between 18 and 340
  const reviewCount = 18 + ((unsigned >> 4) % 323);

  return {
    rating,
    ratingFormatted: rating.toFixed(1),
    reviewCount,
    isRealCustomerRating: false,
  };
}

export const DEFAULT_HERO_FEATURES: HeroFeatureItem[] = [
  {
    id: "feat-1",
    icon: "ShieldCheck",
    title: "Trusted Suppliers",
    subtitle: "Verified & reliable partners",
    enabled: true,
  },
  {
    id: "feat-2",
    icon: "FlaskConical",
    title: "Wide Product Range",
    subtitle: "From lab to industrial grade",
    enabled: true,
  },
  {
    id: "feat-3",
    icon: "Truck",
    title: "Secure Shipping",
    subtitle: "Safe & global delivery",
    enabled: true,
  },
  {
    id: "feat-4",
    icon: "Headphones",
    title: "Dedicated Support",
    subtitle: "Here for your needs",
    enabled: true,
  },
];

// Official Native Blockchain Vector Data URIs for instant zero-latency rendering + support for any external blockchain logo URL
export const NATIVE_CRYPTO_LOGOS: Record<string, string> = {
  BTC: `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="16" fill="#F7931A"/><path fill="#FFF" d="M23.189 14.02c.314-2.096-1.283-3.223-3.465-3.975l.708-2.84-1.728-.43-.69 2.765c-.454-.114-.919-.22-1.385-.326l.695-2.783L15.596 6l-.708 2.839c-.376-.086-.746-.17-1.104-.26l.002-.009-2.384-.595-.46 1.846s1.283.294 1.256.312c.7.175.826.638.805 1.006l-.806 3.235c.048.012.11.03.18.057l-.183-.045-1.13 4.532c-.086.212-.303.531-.793.41l-1.257-.313-.858 1.978 2.25.561c.418.105.828.215 1.231.318l-.715 2.872 1.727.43.708-2.842c.472.127.93.245 1.378.357l-.706 2.828 1.728.43.715-2.866c2.948.558 5.164.333 6.097-2.333.752-2.146-.037-3.385-1.588-4.192 1.13-.26 1.98-.999 2.207-2.523zm-3.955 5.538c-.537 2.157-4.17.991-5.348.698l.954-3.825c1.178.294 4.956.879 4.394 3.127zm.535-5.568c-.49 1.964-3.521.966-4.504.721l.863-3.461c.983.245 4.152.701 3.641 2.74z"/></svg>`
  )}`,
  ETH: `data:image/svg+xml+xml;utf8,${encodeURIComponent(
    `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="16" fill="#627EEA"/><g fill="#FFF"><path fill-opacity=".602" d="M16.498 4v8.87l7.497 3.35z"/><path d="M16.498 4L9 16.22l7.498-3.35z"/><path fill-opacity=".602" d="M16.498 21.968v6.027L24 17.616z"/><path d="M16.498 27.995v-6.028L9 17.616z"/><path fill-opacity=".2" d="M16.498 20.573l7.497-4.353-7.497-3.348z"/><path fill-opacity=".602" d="M9 16.22l7.498 4.353v-7.701z"/></g></svg>`
  )}`.replace("image/svg+xml+xml", "image/svg+xml"),
  BNB: `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="16" fill="#F3BA2F"/><path fill="#FFF" d="M12.116 14.404L16 10.52l3.886 3.886 2.26-2.26L16 6l-6.144 6.144 2.26 2.26zM6 16l2.26-2.26L10.52 16l-2.26 2.26L6 16zm6.116 1.596L16 21.48l3.886-3.886 2.26 2.259L16 26l-6.144-6.144-.003-.003 2.263-2.257zM21.48 16l2.26-2.26L26 16l-2.26 2.26L21.48 16zm-3.188-.002h.002L16 13.706 14.305 15.4l-.195.195-.401.402-.004.003.004.003 2.29 2.291 2.294-2.293.001-.001-.002-.002z"/></svg>`
  )}`,
  USDT: `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="16" fill="#26A17B"/><path fill="#FFF" d="M17.922 17.383v-.002c-.11.008-.677.042-1.942.042-1.01 0-1.721-.03-1.971-.042v.003c-3.888-.171-6.79-.848-6.79-1.658 0-.809 2.902-1.486 6.79-1.66v2.644c.254.018.982.061 1.988.061 1.207 0 1.812-.05 1.925-.06v-2.643c3.88.173 6.775.85 6.775 1.658 0 .81-2.895 1.485-6.775 1.657m0-3.59v-2.366h5.414V7.819H8.595v3.608h5.414v2.365c-4.4.202-7.709 1.074-7.709 2.118 0 1.044 3.309 1.915 7.709 2.118v7.582h3.913v-7.584c4.393-.202 7.694-1.073 7.694-2.116 0-1.043-3.301-1.914-7.694-2.117"/></svg>`
  )}`,
  USDC: `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="16" fill="#2775CA"/><path fill="#FFF" d="M20.022 18.124c0-2.124-1.28-2.852-3.84-3.156-1.828-.243-2.193-.728-2.193-1.578 0-.85.61-1.396 1.828-1.396 1.097 0 1.707.364 2.011 1.275.061.182.244.303.427.303h.975c.244 0 .427-.182.427-.425v-.06c-.244-1.336-1.158-2.368-2.682-2.671v-1.578c0-.243-.183-.425-.487-.425h-.915c-.243 0-.426.182-.487.425v1.517c-1.829.243-2.987 1.457-2.987 3.035 0 2.003 1.219 2.792 3.779 3.095 1.707.304 2.255.668 2.255 1.639 0 .971-.853 1.638-2.011 1.638-1.585 0-2.133-.667-2.316-1.578-.061-.243-.244-.364-.427-.364h-1.036c-.244 0-.427.182-.427.425v.06c.244 1.579 1.219 2.61 3.048 2.914v1.578c0 .243.183.425.487.425h.915c.243 0 .426-.182.487-.425v-1.578c1.829-.304 3.109-1.518 3.109-3.277z"/></svg>`
  )}`,
  SOL: `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="16" fill="#14F195"/><path fill="#0b192c" d="M9.9 20.4c.16-.16.38-.25.62-.25h13.1c.4 0 .6.48.31.77l-2.16 2.16c-.16.16-.38.25-.62.25H8.05c-.4 0-.6-.48-.31-.77l2.16-2.16zm0-11.48c.16-.16.38-.25.62-.25h13.1c.4 0 .6.48.31.77l-2.16 2.16c-.16.16-.38.25-.62.25H8.05c-.4 0-.6-.48-.31-.77l2.16-2.16zm11.96 5.66c-.16-.16-.38-.25-.62-.25H8.14c-.4 0-.6.48-.31.77l2.16 2.16c.16.16.38.25.62.25h13.1c.4 0 .6-.48.31-.77l-2.16-2.16z"/></svg>`
  )}`,
};

export const DEFAULT_ACCEPTED_CRYPTOS: AcceptedCryptoItem[] = [
  {
    id: "crypto-btc",
    name: "Bitcoin",
    symbol: "BTC",
    logoUrl: NATIVE_CRYPTO_LOGOS.BTC,
    enabled: true,
  },
  {
    id: "crypto-eth",
    name: "Ethereum",
    symbol: "ETH",
    logoUrl: NATIVE_CRYPTO_LOGOS.ETH,
    enabled: true,
  },
  {
    id: "crypto-bnb",
    name: "BNB Smart Chain",
    symbol: "BNB",
    logoUrl: NATIVE_CRYPTO_LOGOS.BNB,
    enabled: true,
  },
];

export const BLOCKCHAIN_LOGO_PRESETS: { name: string; symbol: string; logoUrl: string }[] = [
  { name: "Bitcoin", symbol: "BTC", logoUrl: NATIVE_CRYPTO_LOGOS.BTC },
  { name: "Ethereum", symbol: "ETH", logoUrl: NATIVE_CRYPTO_LOGOS.ETH },
  { name: "BNB Smart Chain", symbol: "BNB", logoUrl: NATIVE_CRYPTO_LOGOS.BNB },
  { name: "Tether USD", symbol: "USDT", logoUrl: NATIVE_CRYPTO_LOGOS.USDT },
  { name: "USD Coin", symbol: "USDC", logoUrl: NATIVE_CRYPTO_LOGOS.USDC },
  { name: "Solana", symbol: "SOL", logoUrl: NATIVE_CRYPTO_LOGOS.SOL },
];

export function parseHeroFeatures(rawJson?: string): HeroFeatureItem[] {
  if (!rawJson || !rawJson.trim()) return DEFAULT_HERO_FEATURES;
  try {
    const parsed = JSON.parse(rawJson);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch (e) {
    console.warn("Failed to parse heroFeaturesJson:", e);
  }
  return DEFAULT_HERO_FEATURES;
}

export function parseAcceptedCryptos(rawJson?: string): AcceptedCryptoItem[] {
  if (!rawJson || !rawJson.trim()) return DEFAULT_ACCEPTED_CRYPTOS;
  try {
    const parsed = JSON.parse(rawJson);
    if (Array.isArray(parsed)) {
      return parsed;
    }
  } catch (e) {
    console.warn("Failed to parse acceptedCryptosJson:", e);
  }
  return DEFAULT_ACCEPTED_CRYPTOS;
}

export function resolveCryptoLogoUrl(input: string, symbol?: string): string {
  const trimmed = (input || "").trim();
  if (!trimmed) {
    const sym = (symbol || "").trim().toUpperCase();
    if (sym && NATIVE_CRYPTO_LOGOS[sym]) return NATIVE_CRYPTO_LOGOS[sym];
    return NATIVE_CRYPTO_LOGOS.BTC;
  }
  // If user pasted raw <svg>...</svg> markup from a blockchain explorer
  if (trimmed.startsWith("<svg") && trimmed.endsWith("</svg>")) {
    return `data:image/svg+xml;utf8,${encodeURIComponent(trimmed)}`;
  }
  // If user typed a known symbol shorthand
  const upper = trimmed.toUpperCase();
  if (NATIVE_CRYPTO_LOGOS[upper]) {
    return NATIVE_CRYPTO_LOGOS[upper];
  }
  return trimmed;
}

export function renderHeroFeatureIcon(iconName: string, className: string = "w-5 h-5 sm:w-6 sm:h-6 stroke-[1.8]") {
  switch (iconName) {
    case "ShieldCheck":
      return <ShieldCheck className={className} />;
    case "FlaskConical":
      return <FlaskConical className={className} />;
    case "Truck":
      return <Truck className={className} />;
    case "Headphones":
      return <Headphones className={className} />;
    case "Award":
      return <Award className={className} />;
    case "Activity":
      return <Activity className={className} />;
    case "Globe":
      return <Globe className={className} />;
    case "Cpu":
      return <Cpu className={className} />;
    case "Sparkles":
      return <Sparkles className={className} />;
    case "Beaker":
      return <Beaker className={className} />;
    case "Heart":
      return <Heart className={className} />;
    case "Lock":
      return <Lock className={className} />;
    case "CheckCircle2":
      return <CheckCircle2 className={className} />;
    case "Zap":
      return <Zap className={className} />;
    case "Building2":
      return <Building2 className={className} />;
    case "Package":
      return <Package className={className} />;
    default:
      return <ShieldCheck className={className} />;
  }
}

export const DEFAULT_FOOTER_MOCK_BANNERS: FooterBannerItem[] = [
  {
    id: "mock-banner-1",
    title: "High-Purity Laboratory Reagents & Analytical Standards",
    subtitle: "Certified ACS, HPLC & Spectroscopy grades with full SDS and GHS documentation for academic and industrial research.",
    imageUrl: portraitLabReagents || "/src/assets/images/portrait_lab_reagents_1791997681228.jpg",
    altText: "High-Purity Laboratory Reagents & Glassware",
    linkUrl: "#catalog",
    buttonText: "Browse Lab Reagents",
    badge: "Certified ACS Grade",
    width: 800,
    height: 1200,
    aspectRatio: "2/3",
    enabled: true,
    isMock: true,
  },
  {
    id: "mock-banner-2",
    title: "Bulk Industrial Chemical Logistics & Certified Supply",
    subtitle: "Direct-from-manufacturer bulk chemical storage, ISO-certified drum packaging, and global compliant hazmat transport.",
    imageUrl: portraitBulkLogistics || "/src/assets/images/portrait_bulk_logistics_1791997712073.jpg",
    altText: "Bulk Industrial Chemical Logistics & Warehouse",
    linkUrl: "#catalog",
    buttonText: "Request Bulk Quote",
    badge: "Bulk Procurement",
    width: 800,
    height: 1200,
    aspectRatio: "2/3",
    enabled: true,
    isMock: true,
  },
  {
    id: "mock-banner-3",
    title: "State-of-the-Art Chromatography & Spectroscopy Solutions",
    subtitle: "Ultra-pure mobile phases, certified reference materials, and custom synthesis solutions tailored for institutional laboratories.",
    imageUrl: portraitBiochemResearch || "/src/assets/images/portrait_biochem_research_1791997731872.jpg",
    altText: "Advanced Analytical Solutions & Chromatography",
    linkUrl: "#catalog",
    buttonText: "Explore Analytical Line",
    badge: "ISO 17025 Compliant",
    width: 800,
    height: 1200,
    aspectRatio: "2/3",
    enabled: true,
    isMock: true,
  },
];

export function resolveFooterBanners(rawJson?: string): {
  banners: FooterBannerItem[];
  isUsingMock: boolean;
  customCount: number;
} {
  let parsed: FooterBannerItem[] = [];
  if (rawJson && typeof rawJson === "string" && rawJson.trim().length > 0) {
    try {
      const data = JSON.parse(rawJson);
      if (Array.isArray(data)) {
        parsed = data.filter((b) => b && b.imageUrl && b.imageUrl.trim().length > 0);
      }
    } catch (e) {
      console.warn("Could not parse footer banners JSON:", e);
      parsed = [];
    }
  }

  // Filter out any mock banners if present in custom list
  const customBanners = parsed.filter((b) => !b.isMock);

  if (customBanners.length > 0) {
    // If admin has added custom banners, automatically disable mock banners!
    const activeCustom = customBanners.filter((b) => b.enabled !== false);
    return {
      banners: activeCustom.length > 0 ? activeCustom : customBanners,
      isUsingMock: false,
      customCount: customBanners.length,
    };
  }

  // When no custom banners exist, return mock banners
  return {
    banners: DEFAULT_FOOTER_MOCK_BANNERS.filter((b) => b.enabled !== false),
    isUsingMock: true,
    customCount: 0,
  };
}

export interface BannerAspectRatioInfo {
  ratioDecimal: number;
  ratioString: string;
  cssAspectRatio: string;
  category: "portrait" | "tall" | "square" | "landscape" | "widescreen" | "panoramic";
  label: string;
}

export function parseBannerAspectRatio(aspectRatio?: string | number): number | null {
  if (typeof aspectRatio === "number" && !isNaN(aspectRatio) && aspectRatio > 0) {
    return aspectRatio;
  }
  if (!aspectRatio || typeof aspectRatio !== "string") return null;
  const str = aspectRatio.trim();
  if (str.includes("/")) {
    const [w, h] = str.split("/").map(Number);
    if (w > 0 && h > 0) return w / h;
  }
  if (str.includes(":")) {
    const [w, h] = str.split(":").map(Number);
    if (w > 0 && h > 0) return w / h;
  }
  const parsedNum = parseFloat(str);
  if (!isNaN(parsedNum) && parsedNum > 0) return parsedNum;
  return null;
}

export function formatBannerAspectRatio(
  width?: number,
  height?: number,
  existingRatio?: string
): BannerAspectRatioInfo {
  let decimal: number = 2 / 3;
  const w = width || 0;
  const h = height || 0;

  if (w > 0 && h > 0) {
    decimal = w / h;
  } else if (existingRatio) {
    const parsed = parseBannerAspectRatio(existingRatio);
    if (parsed) {
      decimal = parsed;
    }
  }

  let ratioString = w > 0 && h > 0 ? `${w}:${h}` : "2:3";
  let cssAspectRatio = w > 0 && h > 0 ? `${w} / ${h}` : "2 / 3";
  let category: "portrait" | "tall" | "square" | "landscape" | "widescreen" | "panoramic" = "portrait";
  let label = "Custom Ratio";

  if (Math.abs(decimal - 2 / 3) < 0.05) {
    ratioString = "2:3";
    cssAspectRatio = "2 / 3";
    category = "portrait";
    label = "2:3 Portrait";
  } else if (Math.abs(decimal - 9 / 16) < 0.05) {
    ratioString = "9:16";
    cssAspectRatio = "9 / 16";
    category = "portrait";
    label = "9:16 Mobile Portrait";
  } else if (Math.abs(decimal - 3 / 4) < 0.05 || Math.abs(decimal - 4 / 5) < 0.05) {
    ratioString = decimal < 0.78 ? "3:4" : "4:5";
    cssAspectRatio = ratioString.replace(":", " / ");
    category = "tall";
    label = `${ratioString} Tall`;
  } else if (Math.abs(decimal - 1) < 0.08) {
    ratioString = "1:1";
    cssAspectRatio = "1 / 1";
    category = "square";
    label = "1:1 Square";
  } else if (Math.abs(decimal - 4 / 3) < 0.06) {
    ratioString = "4:3";
    cssAspectRatio = "4 / 3";
    category = "landscape";
    label = "4:3 Landscape";
  } else if (Math.abs(decimal - 3 / 2) < 0.06) {
    ratioString = "3:2";
    cssAspectRatio = "3 / 2";
    category = "landscape";
    label = "3:2 Landscape";
  } else if (Math.abs(decimal - 16 / 9) < 0.06) {
    ratioString = "16:9";
    cssAspectRatio = "16 / 9";
    category = "widescreen";
    label = "16:9 Widescreen";
  } else if (Math.abs(decimal - 21 / 9) < 0.1 || decimal > 2.05) {
    ratioString = "21:9";
    cssAspectRatio = "21 / 9";
    category = "panoramic";
    label = "21:9 Panoramic";
  } else {
    if (decimal < 0.75) {
      category = "portrait";
      label = `Portrait (${decimal.toFixed(2)}:1)`;
    } else if (decimal < 0.95) {
      category = "tall";
      label = `Tall (${decimal.toFixed(2)}:1)`;
    } else if (decimal <= 1.05) {
      category = "square";
      label = "Square (1:1)";
    } else if (decimal <= 1.5) {
      category = "landscape";
      label = `Landscape (${decimal.toFixed(2)}:1)`;
    } else if (decimal <= 2.0) {
      category = "widescreen";
      label = `Widescreen (${decimal.toFixed(2)}:1)`;
    } else {
      category = "panoramic";
      label = `Ultra-wide (${decimal.toFixed(2)}:1)`;
    }
  }

  return {
    ratioDecimal: decimal,
    ratioString,
    cssAspectRatio,
    category,
    label,
  };
}
