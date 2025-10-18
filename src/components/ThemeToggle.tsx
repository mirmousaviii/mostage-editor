"use client";

import { useTheme } from "@/contexts/ThemeContext";
import { Sun, Moon } from "lucide-react";
import { useState } from "react";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [isAnimating, setIsAnimating] = useState(false);

  const handleToggle = () => {
    setIsAnimating(true);
    const newTheme = resolvedTheme === "light" ? "dark" : "light";
    setTheme(newTheme);

    // Reset animation after transition
    setTimeout(() => {
      setIsAnimating(false);
    }, 300);
  };

  return (
    <button
      onClick={handleToggle}
      className={`
        relative flex items-center justify-center w-10 h-10 
        text-gray-700 dark:text-gray-300 
        bg-white dark:bg-gray-800 
        border border-gray-300 dark:border-gray-600 
        rounded-md 
        hover:bg-blue-50 dark:hover:bg-blue-900/20 
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
        transition-all duration-300 ease-in-out
        ${isAnimating ? "scale-95 rotate-180" : "scale-100 rotate-0"}
      `}
      title={`Switch to ${resolvedTheme === "light" ? "dark" : "light"} mode`}
    >
      <div className="relative w-5 h-5">
        {/* Sun Icon */}
        <Sun
          className={`
            absolute inset-0 w-5 h-5 transition-all duration-500 ease-in-out
            ${
              resolvedTheme === "light"
                ? "opacity-100 rotate-0 scale-100"
                : "opacity-0 rotate-180 scale-75"
            }
          `}
        />

        {/* Moon Icon */}
        <Moon
          className={`
            absolute inset-0 w-5 h-5 transition-all duration-500 ease-in-out
            ${
              resolvedTheme === "dark"
                ? "opacity-100 rotate-0 scale-100"
                : "opacity-0 rotate-180 scale-75"
            }
          `}
        />
      </div>

      {/* Ripple Effect */}
      {isAnimating && (
        <div className="absolute inset-0 rounded-md bg-blue-500/20 animate-ping" />
      )}
    </button>
  );
}
