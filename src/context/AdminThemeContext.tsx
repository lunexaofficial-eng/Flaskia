import React, { createContext, useContext, useState, useEffect } from "react";
import {
  ANIIXA_THEMES,
  AniixaThemeDefinition,
  AniixaThemeKey,
  DEFAULT_ANIIXA_THEME_KEY,
  applyAniixaThemeStyles,
  getSavedAniixaTheme,
} from "../utils/aniixaTheme";

interface AdminThemeContextType {
  adminThemeKey: AniixaThemeKey;
  adminTheme: AniixaThemeDefinition;
  setAdminThemeKey: (key: AniixaThemeKey) => void;
  availableThemes: AniixaThemeDefinition[];
  glowIntensity: "subtle" | "vibrant" | "none";
  setGlowIntensity: (g: "subtle" | "vibrant" | "none") => void;
}

const AdminThemeContext = createContext<AdminThemeContextType>({
  adminThemeKey: DEFAULT_ANIIXA_THEME_KEY,
  adminTheme: ANIIXA_THEMES[DEFAULT_ANIIXA_THEME_KEY],
  setAdminThemeKey: () => {},
  availableThemes: Object.values(ANIIXA_THEMES),
  glowIntensity: "vibrant",
  setGlowIntensity: () => {},
});

export const AdminThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [adminThemeKey, setAdminThemeKeyState] = useState<AniixaThemeKey>(() => {
    const saved = getSavedAniixaTheme();
    return saved.id;
  });

  const [glowIntensity, setGlowIntensityState] = useState<"subtle" | "vibrant" | "none">(() => {
    if (typeof window !== "undefined") {
      const g = localStorage.getItem("aniixa_glow_intensity");
      if (g === "subtle" || g === "vibrant" || g === "none") return g;
    }
    return "vibrant";
  });

  const adminTheme = ANIIXA_THEMES[adminThemeKey] || ANIIXA_THEMES[DEFAULT_ANIIXA_THEME_KEY];

  const setAdminThemeKey = (key: AniixaThemeKey) => {
    if (!ANIIXA_THEMES[key]) return;
    setAdminThemeKeyState(key);
    if (typeof window !== "undefined") {
      localStorage.setItem("aniixa_admin_theme", key);
    }
    applyAniixaThemeStyles(ANIIXA_THEMES[key]);

    // Also notify the server about admin theme preference if desired
    fetch("/api/homepage", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ admin_theme: key }),
    }).catch(() => {});
  };

  const setGlowIntensity = (g: "subtle" | "vibrant" | "none") => {
    setGlowIntensityState(g);
    if (typeof window !== "undefined") {
      localStorage.setItem("aniixa_glow_intensity", g);
    }
  };

  useEffect(() => {
    applyAniixaThemeStyles(adminTheme);
  }, [adminTheme]);

  return (
    <AdminThemeContext.Provider
      value={{
        adminThemeKey,
        adminTheme,
        setAdminThemeKey,
        availableThemes: Object.values(ANIIXA_THEMES),
        glowIntensity,
        setGlowIntensity,
      }}
    >
      {children}
    </AdminThemeContext.Provider>
  );
};

export const useAdminTheme = () => useContext(AdminThemeContext);
