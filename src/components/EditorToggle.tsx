"use client";

import { ToggleButton } from "./ToggleButton";

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
          d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
        />
      </svg>
    </ToggleButton>
  );
}
