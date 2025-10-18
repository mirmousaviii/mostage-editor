"use client";

import { ContentEditorProps } from "@/types";
import { useState } from "react";

export const ContentEditor: React.FC<ContentEditorProps> = ({
  value,
  onChange,
  placeholder = "Start typing your markdown here...",
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="h-full flex flex-col border-b border-gray-200 dark:border-gray-700 bg-slate-50 dark:bg-slate-900">
      {/* Content Editor Header */}
      <div
        className="flex items-center justify-between p-3 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
        title={isExpanded ? "Collapse editor" : "Expand editor"}
      >
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Content Editor
        </h3>
        <svg
          className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform ${
            isExpanded ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          ></path>
        </svg>
      </div>

      {/* Collapsible Content */}
      {isExpanded && (
        <div className="flex-1 overflow-hidden">
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="
              h-full w-full p-4 border-0 resize-none outline-none
              bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100
              font-mono text-sm leading-relaxed
              placeholder-gray-400 dark:placeholder-gray-500
            "
            style={{
              fontFamily:
                'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
            }}
          />
        </div>
      )}

      {/* Hidden Fun Section - Only shows when collapsed */}
      {!isExpanded && (
        <div className="bg-white dark:bg-slate-800 p-4 border-t border-gray-200 dark:border-gray-600 shadow-sm h-full max-h-full flex flex-col justify-center">
          <div className="text-center space-y-3">
            <div className="text-4xl">🎭</div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Secret Developer Mode
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              &ldquo;The best code is no code at all&rdquo; - Some wise
              developer
            </p>
            <div className="text-xs text-gray-400 dark:text-gray-500 space-y-1">
              <p>
                Hi, I&apos;m{" "}
                <a
                  href="https://mirmousavi.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  Mostafa
                </a>
                , if you need the secret developer key, just ask me.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
