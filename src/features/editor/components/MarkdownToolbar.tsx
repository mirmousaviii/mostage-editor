"use client";

import React from "react";
import {
  Bold,
  Italic,
  List,
  Link,
  Code,
  Heading1,
  Heading2,
} from "lucide-react";

interface MarkdownToolbarProps {
  onInsert: (text: string) => void;
  className?: string;
}

export function MarkdownToolbar({
  onInsert,
  className = "",
}: MarkdownToolbarProps) {
  const toolbarItems = [
    { icon: Bold, action: () => onInsert("**bold text**"), title: "Bold" },
    { icon: Italic, action: () => onInsert("*italic text*"), title: "Italic" },
    {
      icon: Heading1,
      action: () => onInsert("# Heading 1"),
      title: "Heading 1",
    },
    {
      icon: Heading2,
      action: () => onInsert("## Heading 2"),
      title: "Heading 2",
    },
    { icon: List, action: () => onInsert("- List item"), title: "List" },
    { icon: Link, action: () => onInsert("[Link text](url)"), title: "Link" },
    { icon: Code, action: () => onInsert("`code`"), title: "Code" },
  ];

  return (
    <div
      className={`flex items-center gap-1 p-2 border-b border-gray-200 dark:border-gray-700 ${className}`}
    >
      {toolbarItems.map((item, index) => (
        <button
          key={index}
          onClick={item.action}
          title={item.title}
          className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
        >
          <item.icon className="w-4 h-4" />
        </button>
      ))}
    </div>
  );
}
