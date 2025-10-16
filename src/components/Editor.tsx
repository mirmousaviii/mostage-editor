"use client";

import { EditorProps } from "@/types";
import { MarkdownEditor } from "./MarkdownEditor";
import { MarkdownPreview } from "./MarkdownPreview";
import { ToggleButton } from "./ToggleButton";
import { ResizableSplitPane } from "./ResizableSplitPane";

export const Editor: React.FC<EditorProps> = ({
  markdown,
  onChange,
  showEditor,
  showPreview,
  onToggleEditor,
  onTogglePreview,
}) => {
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

        <div className="flex items-center gap-2">
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
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {showEditor && showPreview ? (
          // Resizable split view
          <ResizableSplitPane
            defaultSize={50}
            minSize={25}
            maxSize={75}
            direction="horizontal"
            className="h-full"
          >
            <div className="h-full border-r border-gray-200 dark:border-gray-700">
              <MarkdownEditor value={markdown} onChange={onChange} />
            </div>
            <div className="h-full">
              <MarkdownPreview markdown={markdown} />
            </div>
          </ResizableSplitPane>
        ) : showEditor ? (
          // Editor only
          <div className="h-full">
            <MarkdownEditor value={markdown} onChange={onChange} />
          </div>
        ) : showPreview ? (
          // Preview only
          <div className="h-full">
            <MarkdownPreview markdown={markdown} />
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
