"use client";

import { ContentEditorProps } from "../types/editor.types";
import { useState, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { AIModal } from "./AIModal";
import { MarkdownToolbar } from "./MarkdownToolbar";

export const ContentEditor: React.FC<ContentEditorProps> = ({
  value,
  onChange,
  placeholder = "Start typing your markdown here...",
  onOpenAuthModal,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showAIModal, setShowAIModal] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Helper function to insert text at cursor position
  const insertText = (
    before: string,
    after: string = "",
    placeholder: string = ""
  ) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const textToInsert = selectedText || placeholder;

    const newText =
      value.substring(0, start) +
      before +
      textToInsert +
      after +
      value.substring(end);
    onChange(newText);

    // Set cursor position after inserted text
    setTimeout(() => {
      const newCursorPos =
        start + before.length + textToInsert.length + after.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
      textarea.focus();
    }, 0);
  };

  // File handling functions
  const handleFileOpen = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".md,.markdown,.txt";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          onChange(content);
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleFileDownload = () => {
    const blob = new Blob([value], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "content.md";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleNewFile = () => {
    onChange("");
  };

  return (
    <div className="h-full flex flex-col border-b border-input bg-muted">
      {/* Content Editor Header */}
      <div
        className="flex items-center justify-between p-3 cursor-pointer hover:bg-secondary/50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
        title={isExpanded ? "Collapse editor" : "Expand editor"}
      >
        <h3 className="text-sm font-semibold text-card-foreground">
          Content Editor
        </h3>
        <ChevronDown
          className={`w-4 h-4 text-muted-foreground transition-transform ${
            isExpanded ? "rotate-180" : ""
          }`}
        />
      </div>

      {/* Collapsible Content */}
      {isExpanded && (
        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Markdown Toolbar */}
          <MarkdownToolbar
            onInsert={insertText}
            onNewFile={handleNewFile}
            onOpenFile={handleFileOpen}
            onDownloadFile={handleFileDownload}
            onOpenAIModal={() => setShowAIModal(true)}
          />

          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="
              flex-1 w-full p-4 border-0 resize-none outline-none
              bg-background text-foreground
              font-mono text-sm leading-relaxed
              placeholder-muted-foreground
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

      {/* AI Modal */}
      <AIModal
        isOpen={showAIModal}
        onClose={() => setShowAIModal(false)}
        onInsertContent={(content) => {
          // Insert content at cursor position
          const textarea = textareaRef.current;
          if (textarea) {
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const newValue =
              value.substring(0, start) + content + value.substring(end);
            onChange(newValue);

            // Set cursor position after inserted content
            setTimeout(() => {
              const newCursorPos = start + content.length;
              textarea.setSelectionRange(newCursorPos, newCursorPos);
              textarea.focus();
            }, 0);
          }
        }}
        onOpenAuthModal={onOpenAuthModal || (() => {})}
      />
    </div>
  );
};
