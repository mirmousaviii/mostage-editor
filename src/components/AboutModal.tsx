"use client";

import React from "react";
import { X, Github, ExternalLink } from "lucide-react";

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AboutModal({ isOpen, onClose }: AboutModalProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/95 z-[9998]" onClick={onClose} />

      {/* Modal */}
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div
          className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              About Mostage Editor
            </h2>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Mostage */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                Mostage
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Mostage is a presentation framework based on Markdown and HTML.
              </p>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Available as a NPM package, CLI and Web Editor.
              </p>
              <a
                href="https://github.com/mirmousaviii/mostage"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                github.com/mirmousaviii/mostage
              </a>
            </div>

            {/* Mostage Editor */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                Mostage Editor
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Web editor for Mostage framework.
              </p>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Create new presentations or seamlessly edit existing ones in
                real time. Effortlessly export your work to PDF, PNG, JPG, and
                other formats. Easily share your presentations with others.
              </p>
              <a
                href="https://github.com/mirmousaviii/mostage"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                github.com/mirmousaviii/mostage-editor
              </a>
            </div>

            {/* Markdown Help */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                Markdown Help
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-3">
                Need help with Markdown syntax? Check out the official GitHub
                Markdown guide for comprehensive documentation and examples.
              </p>
              <a
                href="https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                docs.github.com
              </a>
            </div>

            {/* Links */}
            <div className="flex flex-wrap gap-3 justify-end">
              <a
                href="https://github.com/mirmousaviii/mostage"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors text-sm cursor-pointer"
              >
                <Github className="w-4 h-4" />
                GitHub
              </a>
              <a
                href="https://mo.js.org"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors text-sm cursor-pointer"
              >
                <ExternalLink className="w-4 h-4" />
                Website
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
