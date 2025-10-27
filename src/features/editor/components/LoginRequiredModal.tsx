"use client";

import React from "react";
import {
  Lock,
  QrCode,
  BarChart3,
  HelpCircle,
  MessageSquare,
  LogIn,
} from "lucide-react";
import { Modal } from "@/shared/components/ui/Modal";

interface LoginRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAuthModal: () => void;
}

const features = [
  {
    name: "QR Code",
    description: "Generate QR codes for presentations",
    icon: QrCode,
    color: "blue",
  },
  {
    name: "Live Polling",
    description: "Create interactive polls for audience",
    icon: BarChart3,
    color: "green",
  },
  {
    name: "Live Quiz",
    description: "Add quizzes to test audience knowledge",
    icon: HelpCircle,
    color: "purple",
  },
  {
    name: "Q&A Session",
    description: "Enable audience questions and answers",
    icon: MessageSquare,
    color: "orange",
  },
];

export function LoginRequiredModal({
  isOpen,
  onClose,
  onOpenAuthModal,
}: LoginRequiredModalProps) {
  const handleLoginClick = () => {
    onClose();
    onOpenAuthModal();
  };

  const headerContent = (
    <div className="flex items-center gap-2 sm:gap-3">
      <div className="p-1.5 sm:p-2 bg-orange-100 dark:bg-orange-900/30 rounded-md">
        <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 dark:text-orange-400" />
      </div>
      <div>
        <h2 className="text-lg sm:text-xl font-semibold text-foreground">
          Login Required
        </h2>
      </div>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      headerContent={headerContent}
      maxWidth="md"
    >
      <div className="space-y-6">
        {/* Main Message */}
        <div className="space-y-2">
          <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
            You need to log in to use these interactive features.
          </p>
        </div>

        {/* Features List */}
        <div className="space-y-2 sm:space-y-3">
          <h3 className="text-sm sm:text-base font-medium text-gray-900 dark:text-gray-100">
            Features that require login:
          </h3>
          <div className="grid gap-3">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;

              // Define color classes for each feature
              const getColorClasses = (color: string) => {
                switch (color) {
                  case "blue":
                    return {
                      bg: "bg-blue-100 dark:bg-blue-900/30",
                      text: "text-blue-600 dark:text-blue-400",
                    };
                  case "green":
                    return {
                      bg: "bg-green-100 dark:bg-green-900/30",
                      text: "text-green-600 dark:text-green-400",
                    };
                  case "purple":
                    return {
                      bg: "bg-purple-100 dark:bg-purple-900/30",
                      text: "text-purple-600 dark:text-purple-400",
                    };
                  case "orange":
                    return {
                      bg: "bg-orange-100 dark:bg-orange-900/30",
                      text: "text-orange-600 dark:text-orange-400",
                    };
                  default:
                    return {
                      bg: "bg-blue-100 dark:bg-blue-900/30",
                      text: "text-blue-600 dark:text-blue-400",
                    };
                }
              };

              const colorClasses = getColorClasses(feature.color);

              return (
                <div
                  key={index}
                  className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-gray-50 dark:bg-gray-700/50 rounded-sm border border-gray-200 dark:border-gray-600"
                >
                  <div
                    className={`p-1.5 sm:p-2 ${colorClasses.bg} rounded-md flex-shrink-0`}
                  >
                    <IconComponent
                      className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${colorClasses.text}`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm sm:text-base font-medium text-gray-900 dark:text-gray-100">
                      {feature.name}
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 sm:gap-3 pt-3 sm:pt-4">
          <button
            onClick={onClose}
            className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleLoginClick}
            className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors font-medium flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <LogIn className="w-4 h-4" />
            Login Now
          </button>
        </div>
      </div>
    </Modal>
  );
}
