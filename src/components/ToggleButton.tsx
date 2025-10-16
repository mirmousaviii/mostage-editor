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
        flex items-center justify-center p-2 rounded-lg transition-all duration-200
        ${
          isActive
            ? "bg-blue-500 text-white shadow-md hover:bg-blue-600"
            : "bg-gray-200 text-gray-600 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
        }
      `}
    >
      {children}
    </button>
  );
};
