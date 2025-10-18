"use client";

import { Info } from "lucide-react";

interface AboutButtonProps {
  onClick: () => void;
}

export function AboutButton({ onClick }: AboutButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-sm hover:bg-blue-50 dark:hover:bg-blue-900/20 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
      title="About Mostage Editor"
    >
      <Info className="w-4 h-4" />
      <span className="hidden sm:inline">About</span>
    </button>
  );
}
