import React, { createContext, useContext, useState, useEffect } from "react";

export type ThemeMode = "emerald" | "retail" | "indiamart" | "cyber";

interface ThemeContextType {
  activeTheme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  isRetail: boolean;
  isEmerald: boolean;
  isIndiamart: boolean;
  isCyber: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  activeTheme: "emerald",
  setTheme: () => {},
  isRetail: false,
  isEmerald: true,
  isIndiamart: false,
  isCyber: false,
  toggleTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode; initialTheme?: ThemeMode }> = ({
  children,
  initialTheme = "emerald",
}) => {
  const [activeTheme, setActiveThemeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem("flaskia_active_theme");
    if (saved === "retail" || saved === "emerald" || saved === "indiamart" || saved === "cyber") {
      if (saved === "cyber") return "retail";
      return saved as ThemeMode;
    }
    return initialTheme;
  });

  // Fetch persisted active_theme from PostgreSQL backend on mount
  useEffect(() => {
    fetch("/api/homepage")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.active_theme) {
          const theme = data.active_theme === "cyber" ? "retail" : data.active_theme;
          if (theme === "retail" || theme === "emerald" || theme === "indiamart") {
            setActiveThemeState(theme as ThemeMode);
            localStorage.setItem("flaskia_active_theme", theme);
          }
        }
      })
      .catch((err) => console.warn("Could not load backend theme config:", err));
  }, []);

  const setTheme = (theme: ThemeMode) => {
    const targetTheme = theme === "cyber" ? "retail" : theme;
    setActiveThemeState(targetTheme);
    localStorage.setItem("flaskia_active_theme", targetTheme);
    // Sync with server homepage config
    fetch("/api/homepage", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active_theme: targetTheme }),
    }).catch((err) => console.warn("Could not save theme to backend:", err));
  };

  const toggleTheme = () => {
    if (activeTheme === "emerald") setTheme("retail");
    else if (activeTheme === "retail") setTheme("indiamart");
    else setTheme("emerald");
  };

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("theme-emerald", "theme-retail", "theme-indiamart", "theme-cyber");

    if (activeTheme === "indiamart") {
      root.classList.add("theme-indiamart");
      document.body.style.backgroundColor = "#f4f6f9";
      document.body.style.color = "#0f172a";
    } else if (activeTheme === "retail") {
      root.classList.add("theme-retail");
      document.body.style.backgroundColor = "#f1f3f6";
      document.body.style.color = "#0f172a";
    } else {
      root.classList.add("theme-emerald");
      document.body.style.backgroundColor = "#f8fafc";
      document.body.style.color = "#0f172a";
    }
  }, [activeTheme]);

  return (
    <ThemeContext.Provider
      value={{
        activeTheme,
        setTheme,
        isRetail: activeTheme === "retail",
        isEmerald: activeTheme === "emerald",
        isIndiamart: activeTheme === "indiamart",
        isCyber: activeTheme === "retail" || activeTheme === "cyber",
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

