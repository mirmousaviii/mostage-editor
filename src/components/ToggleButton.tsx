"use client";

import { ToggleButtonProps } from "@/types";

export const ToggleButton: React.FC<ToggleButtonProps> = ({
  isActive,
  onClick,
  children,
  title,
}) => {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`
        flex items-center justify-center w-10 h-10 rounded-md transition-colors
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
        ${
          isActive
            ? "bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
            : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
        }
      `}
    >
      {children}
    </button>
  );
};
