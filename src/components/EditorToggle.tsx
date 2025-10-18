"use client";

import { ToggleButton } from "./ToggleButton";
import { Code } from "lucide-react";

interface EditorToggleProps {
  isActive: boolean;
  onClick: () => void;
}

export function EditorToggle({ isActive, onClick }: EditorToggleProps) {
  return (
    <ToggleButton
      isActive={isActive}
      onClick={onClick}
      title={isActive ? "Hide Editor" : "Show Editor"}
    >
      <Code className="w-5 h-5" />
    </ToggleButton>
  );
}
