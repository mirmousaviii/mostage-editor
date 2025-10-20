"use client";

import { useState } from "react";
import { X, Sparkles } from "lucide-react";

interface AIModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAuthModal: () => void;
}

export const AIModal: React.FC<AIModalProps> = ({
  isOpen,
  onClose,
  onOpenAuthModal,
}) => {
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiError, setAiError] = useState("");

  const handleAIGenerate = () => {
    setAiError(
      "Authentication required to use AI features. Please sign in to continue."
    );
  };

  const handleSignInClick = () => {
    onClose();
    setAiError("");
    setAiPrompt("");
    onOpenAuthModal();
  };

  const handleClose = () => {
    onClose();
    setAiError("");
    setAiPrompt("");
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={handleClose}
    >
      <div
        className="bg-card border border-input rounded-lg shadow-lg max-w-md w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-card-foreground">
              Generate Content with AI
            </h3>
            <button
              onClick={handleClose}
              className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-2">
                Describe your presentation topic:
              </label>
              <textarea
                value={aiPrompt}
                onChange={(e) => {
                  setAiPrompt(e.target.value);
                  setAiError("");
                }}
                placeholder="Presentation about the latest changes in this repository: https://github.com/mirmousaviii/mostage"
                className="w-full p-3 border border-input rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                rows={3}
              />
            </div>

            {aiError && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                <p className="text-sm text-red-600 dark:text-red-400">
                  Authentication required to use AI features. Please{" "}
                  <button
                    onClick={handleSignInClick}
                    className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 underline cursor-pointer"
                  >
                    sign in
                  </button>
                  .
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleAIGenerate}
                disabled={!aiPrompt.trim()}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-md hover:from-purple-700 hover:to-pink-700 disabled:from-purple-400 disabled:to-pink-400 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer shadow-lg hover:shadow-xl"
              >
                <div className="flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Generate Content
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
