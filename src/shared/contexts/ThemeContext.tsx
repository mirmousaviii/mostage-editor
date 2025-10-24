"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { analytics } from "@/shared/utils/analytics";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    // TODO: Use this after implementing the user preference
    // Get saved theme from localStorage
    // const savedTheme = localStorage.getItem("theme") as Theme;
    // if (savedTheme && ["light", "dark"].includes(savedTheme)) {
    //   setTheme(savedTheme);
    // } else {
    //   // Check system preference
    //   const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
    //     .matches
    //     ? "dark"
    //     : "light";
    //   setTheme(systemTheme);
    // }
  }, []);

  useEffect(() => {
    // Apply theme to document
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);

    // Save theme to localStorage
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleSetTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    // Track theme change in analytics
    analytics.trackThemeChange(newTheme);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme: handleSetTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
