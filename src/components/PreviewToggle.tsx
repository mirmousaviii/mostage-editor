"use client";

import { ToggleButton } from "./ToggleButton";

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
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
        />
      </svg>
    </ToggleButton>
  );
}
