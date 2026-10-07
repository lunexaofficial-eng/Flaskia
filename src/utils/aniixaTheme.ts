export type AniixaThemeKey =
  | "aniixa-gold"
  | "aniixa-crimson"
  | "aniixa-emerald"
  | "aniixa-indigo"
  | "aniixa-cyan"
  | "aniixa-monolith"
  | "aniixa-sunset";

export interface AniixaThemeDefinition {
  id: AniixaThemeKey;
  name: string;
  tagline: string;
  description: string;
  emoji: string;
  badge: string;
  primaryColor: string;
  primaryHover: string;
  secondaryColor: string;
  accentGlow: string;
  bgBase: string;
  bgCard: string;
  bgCardHover: string;
  bgSidebar: string;
  bgHeader: string;
  borderBase: string;
  borderActive: string;
  textAccent: string;
  badgeBg: string;
  badgeText: string;
  btnGradient: string;
  btnTextColor: string;
  iconColor: string;
  paletteSwatches: string[];
}

export const ANIIXA_THEMES: Record<AniixaThemeKey, AniixaThemeDefinition> = {
  "aniixa-gold": {
    id: "aniixa-gold",
    name: "Aniixa GS • Imperial Gold",
    tagline: "The Signature Flagship Aniixa GS Executive Theme with Gold & Amber Metallic Accents",
    description: "Refined dark obsidian base with shimmering royal gold highlights, glowing metallic borders, and amber telemetry badges.",
    emoji: "👑",
    badge: "Flagship GS",
    primaryColor: "#f59e0b",
    primaryHover: "#d97706",
    secondaryColor: "#fbbf24",
    accentGlow: "rgba(245, 158, 11, 0.25)",
    bgBase: "#080c14",
    bgCard: "#0e1626",
    bgCardHover: "#131f36",
    bgSidebar: "#070b13",
    bgHeader: "#0b1220",
    borderBase: "#1e2c44",
    borderActive: "#f59e0b",
    textAccent: "#fbbf24",
    badgeBg: "rgba(245, 158, 11, 0.15)",
    badgeText: "#fcd34d",
    btnGradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
    btnTextColor: "#0b101c",
    iconColor: "#f59e0b",
    paletteSwatches: ["#f59e0b", "#fbbf24", "#0e1626", "#080c14"],
  },
  "aniixa-crimson": {
    id: "aniixa-crimson",
    name: "Aniixa GS • Crimson Velocity",
    tagline: "High-octane scarlet and rose neon accents on ultra-deep obsidian slate",
    description: "Ultra-sharp cybernetic crimson with vivid scarlet action buttons, pulsing security tags, and high-visibility contrast.",
    emoji: "🔥",
    badge: "High Energy",
    primaryColor: "#f43f5e",
    primaryHover: "#e11d48",
    secondaryColor: "#fb7185",
    accentGlow: "rgba(244, 63, 94, 0.25)",
    bgBase: "#070a12",
    bgCard: "#0f1422",
    bgCardHover: "#161d30",
    bgSidebar: "#090d18",
    bgHeader: "#0d1320",
    borderBase: "#1f2639",
    borderActive: "#f43f5e",
    textAccent: "#fb7185",
    badgeBg: "rgba(244, 63, 94, 0.15)",
    badgeText: "#fda4af",
    btnGradient: "linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)",
    btnTextColor: "#ffffff",
    iconColor: "#f43f5e",
    paletteSwatches: ["#f43f5e", "#fb7185", "#0f1422", "#070a12"],
  },
  "aniixa-emerald": {
    id: "aniixa-emerald",
    name: "Aniixa GS • Bioluminescent Emerald",
    tagline: "Bioluminescent emerald and mint neon on dark cybernetic matrix slate",
    description: "Clean scientific bio-luminescence with vibrant emerald telemetry, crisp mint accents, and deep forest dark cards.",
    emoji: "🌿",
    badge: "Bio Science",
    primaryColor: "#10b981",
    primaryHover: "#059669",
    secondaryColor: "#34d399",
    accentGlow: "rgba(16, 185, 129, 0.25)",
    bgBase: "#050d0a",
    bgCard: "#0a1712",
    bgCardHover: "#0f221b",
    bgSidebar: "#06110d",
    bgHeader: "#081611",
    borderBase: "#132b21",
    borderActive: "#10b981",
    textAccent: "#34d399",
    badgeBg: "rgba(16, 185, 129, 0.15)",
    badgeText: "#6ee7b7",
    btnGradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    btnTextColor: "#041a12",
    iconColor: "#10b981",
    paletteSwatches: ["#10b981", "#34d399", "#0a1712", "#050d0a"],
  },
  "aniixa-indigo": {
    id: "aniixa-indigo",
    name: "Aniixa GS • Royal Cosmic Indigo",
    tagline: "Deep cosmic indigo and royal violet for executive laboratory operations",
    description: "Deep midnight cosmic atmosphere paired with electric indigo buttons and luxurious violet accent halos.",
    emoji: "🌌",
    badge: "Cosmic Pro",
    primaryColor: "#6366f1",
    primaryHover: "#4f46e5",
    secondaryColor: "#818cf8",
    accentGlow: "rgba(99, 102, 241, 0.25)",
    bgBase: "#080816",
    bgCard: "#101026",
    bgCardHover: "#171736",
    bgSidebar: "#09091a",
    bgHeader: "#0d0d22",
    borderBase: "#1e1e42",
    borderActive: "#6366f1",
    textAccent: "#a5b4fc",
    badgeBg: "rgba(99, 102, 241, 0.15)",
    badgeText: "#c7d2fe",
    btnGradient: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
    btnTextColor: "#ffffff",
    iconColor: "#818cf8",
    paletteSwatches: ["#6366f1", "#818cf8", "#101026", "#080816"],
  },
  "aniixa-cyan": {
    id: "aniixa-cyan",
    name: "Aniixa GS • Quantum Cyan",
    tagline: "Crisp aerospace cyan and cobalt blue on precision titanium steel",
    description: "Futuristic aerospace cockpit styling featuring intense cyan laser highlights, quantum telemetry, and high-clarity stats.",
    emoji: "⚡",
    badge: "Aerospace",
    primaryColor: "#06b6d4",
    primaryHover: "#0891b2",
    secondaryColor: "#22d3ee",
    accentGlow: "rgba(6, 182, 212, 0.25)",
    bgBase: "#050e14",
    bgCard: "#0a1824",
    bgCardHover: "#0e2233",
    bgSidebar: "#06121c",
    bgHeader: "#081621",
    borderBase: "#132b3e",
    borderActive: "#06b6d4",
    textAccent: "#22d3ee",
    badgeBg: "rgba(6, 182, 212, 0.15)",
    badgeText: "#67e8f9",
    btnGradient: "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
    btnTextColor: "#041924",
    iconColor: "#06b6d4",
    paletteSwatches: ["#06b6d4", "#22d3ee", "#0a1824", "#050e14"],
  },
  "aniixa-monolith": {
    id: "aniixa-monolith",
    name: "Aniixa GS • Stealth Monolith",
    tagline: "Monochromatic stealth dark theme with subtle hairline zinc borders",
    description: "Pure architectural minimalism with deep pitch-black carbon surfaces, crisp silver badges, and razor-clean monochrome lines.",
    emoji: "🏛️",
    badge: "Minimalist",
    primaryColor: "#e2e8f0",
    primaryHover: "#cbd5e1",
    secondaryColor: "#f8fafc",
    accentGlow: "rgba(255, 255, 255, 0.12)",
    bgBase: "#09090b",
    bgCard: "#121215",
    bgCardHover: "#18181c",
    bgSidebar: "#0b0b0d",
    bgHeader: "#0e0e11",
    borderBase: "#27272a",
    borderActive: "#e2e8f0",
    textAccent: "#f4f4f5",
    badgeBg: "rgba(255, 255, 255, 0.1)",
    badgeText: "#ffffff",
    btnGradient: "linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)",
    btnTextColor: "#09090b",
    iconColor: "#e2e8f0",
    paletteSwatches: ["#ffffff", "#cbd5e1", "#121215", "#09090b"],
  },
  "aniixa-sunset": {
    id: "aniixa-sunset",
    name: "Aniixa GS • Sunset Blaze",
    tagline: "Warm gradient dusk aesthetic blending fiery orange and deep magenta",
    description: "Dynamic dusk gradient aesthetic with fiery amber-orange accents, vibrant rose-magenta glow, and warm charcoal surfaces.",
    emoji: "🌅",
    badge: "Vibrant Dusk",
    primaryColor: "#f97316",
    primaryHover: "#ea580c",
    secondaryColor: "#ec4899",
    accentGlow: "rgba(249, 115, 22, 0.25)",
    bgBase: "#0f090d",
    bgCard: "#1a0f17",
    bgCardHover: "#23141f",
    bgSidebar: "#120a10",
    bgHeader: "#160c14",
    borderBase: "#331929",
    borderActive: "#f97316",
    textAccent: "#fb923c",
    badgeBg: "rgba(249, 115, 22, 0.15)",
    badgeText: "#fdba74",
    btnGradient: "linear-gradient(135deg, #f97316 0%, #ec4899 100%)",
    btnTextColor: "#ffffff",
    iconColor: "#f97316",
    paletteSwatches: ["#f97316", "#ec4899", "#1a0f17", "#0f090d"],
  },
};

export const DEFAULT_ANIIXA_THEME_KEY: AniixaThemeKey = "aniixa-gold";

export function getSavedAniixaTheme(): AniixaThemeDefinition {
  if (typeof window === "undefined") {
    return ANIIXA_THEMES[DEFAULT_ANIIXA_THEME_KEY];
  }
  const savedKey = localStorage.getItem("aniixa_admin_theme") as AniixaThemeKey;
  if (savedKey && ANIIXA_THEMES[savedKey]) {
    return ANIIXA_THEMES[savedKey];
  }
  return ANIIXA_THEMES[DEFAULT_ANIIXA_THEME_KEY];
}

export function applyAniixaThemeStyles(theme: AniixaThemeDefinition) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.style.setProperty("--aniixa-primary", theme.primaryColor);
  root.style.setProperty("--aniixa-primary-hover", theme.primaryHover);
  root.style.setProperty("--aniixa-secondary", theme.secondaryColor);
  root.style.setProperty("--aniixa-accent-glow", theme.accentGlow);
  root.style.setProperty("--aniixa-bg-base", theme.bgBase);
  root.style.setProperty("--aniixa-bg-card", theme.bgCard);
  root.style.setProperty("--aniixa-bg-card-hover", theme.bgCardHover);
  root.style.setProperty("--aniixa-bg-sidebar", theme.bgSidebar);
  root.style.setProperty("--aniixa-bg-header", theme.bgHeader);
  root.style.setProperty("--aniixa-border-base", theme.borderBase);
  root.style.setProperty("--aniixa-border-active", theme.borderActive);
  root.style.setProperty("--aniixa-text-accent", theme.textAccent);
  root.style.setProperty("--aniixa-badge-bg", theme.badgeBg);
  root.style.setProperty("--aniixa-badge-text", theme.badgeText);
  root.style.setProperty("--aniixa-btn-gradient", theme.btnGradient);
  root.style.setProperty("--aniixa-btn-text", theme.btnTextColor);
  root.style.setProperty("--aniixa-icon-color", theme.iconColor);
}
