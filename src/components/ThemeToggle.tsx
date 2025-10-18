"use client";

import { useTheme } from "@/contexts/ThemeContext";
import { useState } from "react";

const SunIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
    />
  </svg>
);

const MoonIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
    />
  </svg>
);

const MonitorIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
);

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
    { value: "light", label: "Light", icon: SunIcon },
    { value: "dark", label: "Dark", icon: MoonIcon },
    { value: "system", label: "System", icon: MonitorIcon },
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
        <svg
          className={`w-4 h-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
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
                      <svg
                        className="w-4 h-4 ml-auto text-blue-600 dark:text-blue-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
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
