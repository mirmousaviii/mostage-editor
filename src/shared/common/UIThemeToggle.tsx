"use client";

import { useUITheme } from "@/shared/contexts/UIThemeContext";
import { Sun, Moon } from "lucide-react";

export function UIThemeToggle() {
  const { resolvedUITheme, toggleUITheme } = useUITheme();

  const handleToggle = () => {
    toggleUITheme();
  };

  return (
    <button
      onClick={handleToggle}
      className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 text-sm font-medium text-card-foreground bg-card border border-input rounded-sm hover:bg-secondary cursor-pointer focus:outline-none transition-colors"
      title={`Switch to ${resolvedUITheme === "light" ? "dark" : "light"} mode`}
    >
      {resolvedUITheme === "light" ? (
        <Moon className="w-4 h-4" />
      ) : (
        <Sun className="w-4 h-4" />
      )}

      <span className="hidden sm:inline">
        {resolvedUITheme === "light" ? "Dark" : "Light"}
      </span>
    </button>
  );
}
