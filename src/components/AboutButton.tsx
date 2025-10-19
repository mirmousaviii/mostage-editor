"use client";

import { Info } from "lucide-react";

interface AboutButtonProps {
  onClick: () => void;
}

export function AboutButton({ onClick }: AboutButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-card-foreground bg-card border border-input rounded-sm hover:bg-secondary cursor-pointer focus:outline-none transition-colors"
      title="About Mostage Editor"
    >
      <Info className="w-4 h-4" />
      <span className="hidden sm:inline">About</span>
    </button>
  );
}
