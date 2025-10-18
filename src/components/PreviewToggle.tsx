"use client";

import { ToggleButton } from "./ToggleButton";
import { Eye } from "lucide-react";

interface PreviewToggleProps {
  isActive: boolean;
  onClick: () => void;
}

export function PreviewToggle({ isActive, onClick }: PreviewToggleProps) {
  return (
    <ToggleButton
      isActive={isActive}
      onClick={onClick}
      title={isActive ? "Hide Preview" : "Show Preview"}
    >
      <Eye className="w-4 h-4" />
      <span className="hidden sm:inline">Preview</span>
    </ToggleButton>
  );
}
