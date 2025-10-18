"use client";

import { EditorProps, PresentationConfig } from "@/types";
import { ContentEditor } from "./ContentEditor";
import { ContentPreview } from "./ContentPreview";
import { PresentationToolbar } from "./PresentationToolbar";
import { ToggleButton } from "./ToggleButton";
import { ResizableSplitPane } from "./ResizableSplitPane";
import { ThemeToggle } from "./ThemeToggle";
import { AuthButton } from "./AuthButton";
import { useState } from "react";

export const Editor: React.FC<EditorProps> = ({
  markdown,
  onChange,
  showEditor,
  showPreview,
  onToggleEditor,
  onTogglePreview,
}) => {
  const [presentationConfig, setPresentationConfig] =
    useState<PresentationConfig>({
      theme: "light", // Default from library
      scale: 1.0, // Default from library
      loop: false, // Default from library
      keyboard: true, // Default from library
      touch: true, // Default from library
      urlHash: true, // Default from library
      transition: {
        type: "horizontal", // Default from library
        duration: 300, // Default from library
        easing: "ease-in-out", // Default from library
      },
      centerContent: {
        vertical: true, // Default from library
        horizontal: true, // Default from library
      },
      header: {
        enabled: false, // Default disabled
        content: "",
        position: "top-left", // Default from library
        showOnFirstSlide: true, // Default from library
      },
      footer: {
        enabled: false, // Default disabled
        content: "",
        position: "bottom-left", // Default from library
        showOnFirstSlide: true, // Default from library
      },
      plugins: {
        ProgressBar: {
          enabled: true, // Default from library
          position: "bottom", // Default from library
          height: "12px", // Default from library
          color: "#007acc", // Default from library
        },
        SlideNumber: {
          enabled: true, // Default from library
          position: "bottom-right", // Default from library
          format: "current/total", // Default from library
        },
        Controller: {
          enabled: true, // Default from library
          position: "bottom-center", // Default from library
        },
        Confetti: {
          enabled: true, // Default from library
          particleCount: 50, // Default from library
          size: { min: 5, max: 10 }, // Default from library
          duration: 3000, // Default from library
          delay: 0, // Default from library
          colors: [
            "#ff6b6b",
            "#4ecdc4",
            "#45b7d1",
            "#96ceb4",
            "#feca57",
            "#ff9ff3",
            "#54a0ff",
          ], // Default from library
        },
      },
    });
  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Mostage Editor
          </h1>
          <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
            Beta Version
          </span>
        </div>

        <div className="flex items-center gap-3">
          <ToggleButton
            isActive={showEditor}
            onClick={onToggleEditor}
            title={showEditor ? "Hide Editor" : "Show Editor"}
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

          <ToggleButton
            isActive={showPreview}
            onClick={onTogglePreview}
            title={showPreview ? "Hide Preview" : "Show Preview"}
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

          <div className="h-6 w-px bg-gray-300 dark:bg-gray-600" />
          <ThemeToggle />
          <AuthButton />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {showEditor && showPreview ? (
          // Resizable split view
          <ResizableSplitPane
            defaultSize={30}
            minSize={25}
            maxSize={75}
            direction="horizontal"
            className="h-full"
          >
            <div className="h-full border-r border-gray-200 dark:border-gray-700 flex flex-col">
              <PresentationToolbar
                config={presentationConfig}
                onConfigChange={setPresentationConfig}
              />
              <ContentEditor value={markdown} onChange={onChange} />
            </div>
            <div className="h-full">
              <ContentPreview markdown={markdown} config={presentationConfig} />
            </div>
          </ResizableSplitPane>
        ) : showEditor ? (
          // Editor only
          <div className="h-full flex flex-col">
            <PresentationToolbar
              config={presentationConfig}
              onConfigChange={setPresentationConfig}
            />
            <ContentEditor value={markdown} onChange={onChange} />
          </div>
        ) : showPreview ? (
          // Preview only
          <div className="h-full flex flex-col">
            <PresentationToolbar
              config={presentationConfig}
              onConfigChange={setPresentationConfig}
            />
            <ContentPreview markdown={markdown} config={presentationConfig} />
          </div>
        ) : (
          // Neither (shouldn't happen, but fallback)
          <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
            <div className="text-center">
              <svg
                className="w-12 h-12 mx-auto mb-4 opacity-50"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p>Select a view to get started</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
