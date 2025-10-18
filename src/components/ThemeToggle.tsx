"use client";

import { useTheme } from "@/contexts/ThemeContext";
import { useState } from "react";
import { Sun, Moon, Monitor, ChevronDown, Check } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme);
    setIsOpen(false);

    // Force immediate DOM update
    const root = document.documentElement;
    root.classList.remove("light", "dark");

    let actualTheme: "light" | "dark";
    if (newTheme === "system") {
      actualTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    } else {
      actualTheme = newTheme;
    }

    root.classList.add(actualTheme);
    root.style.colorScheme = actualTheme;

    // Gentle re-render without breaking Mostage instances
    // Only trigger reflow on non-Mostage elements
    const allElements = document.querySelectorAll("*");
    allElements.forEach((el) => {
      const element = el as HTMLElement;
      // Skip Mostage containers and their children
      if (
        !element.closest(".mostage-container") &&
        !element.classList.contains("mostage-slide") &&
        !element.classList.contains("mostage-overview") &&
        !element.classList.contains("mostage-help")
      ) {
        element.style.display = "none";
        void element.offsetHeight; // Trigger reflow
        element.style.display = "";
      }
    });
  };

  const themes = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ] as const;

  const currentTheme = themes.find((t) => t.value === theme) || themes[2];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <currentTheme.icon />
        <span className="hidden sm:inline">{currentTheme.label}</span>
        <ChevronDown
          className={`w-4 h-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg z-20">
            <div className="py-1">
              {themes.map((themeOption) => {
                const Icon = themeOption.icon;
                return (
                  <button
                    key={themeOption.value}
                    onClick={() => handleThemeChange(themeOption.value)}
                    className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors ${
                      theme === themeOption.value
                        ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                        : "text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                    }`}
                  >
                    <Icon />
                    <span>{themeOption.label}</span>
                    {theme === themeOption.value && (
                      <Check className="w-4 h-4 ml-auto text-blue-600 dark:text-blue-400" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
