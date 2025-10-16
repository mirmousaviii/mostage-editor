"use client";

import { MarkdownEditorProps } from "@/types";

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  value,
  onChange,
  placeholder = "Start typing your markdown here...",
}) => {
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Markdown Editor
        </h3>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {value.split(/\r\n|\r|\n/).length} lines
        </div>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="
          flex-1 w-full p-4 border-0 resize-none outline-none
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
  );
};
