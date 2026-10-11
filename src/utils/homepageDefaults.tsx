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

export const UI_TRANSLATIONS: Record<
  string,
  {
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
  }
> = {
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
  },
};

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
