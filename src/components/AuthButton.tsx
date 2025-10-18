"use client";

import { useState } from "react";
import { AuthModal } from "./AuthModal";
import { User } from "lucide-react";

export function AuthButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
        title="Sign In / Sign Up"
      >
        <User className="w-4 h-4" />
        <span className="hidden sm:inline">Sign In</span>
      </button>

      <AuthModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
