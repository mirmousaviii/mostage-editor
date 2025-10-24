"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Bold,
  Italic,
  List,
  Link,
  Code,
  Quote,
  ListOrdered,
  Image,
  Table,
  Type,
  Strikethrough,
  Minus,
  Terminal,
  PartyPopper,
  FolderOpen,
  Save,
  Sparkles,
  FileText,
  HelpCircle,
  ChevronDown,
} from "lucide-react";

interface MarkdownToolbarProps {
  onInsert: (before: string, after?: string, placeholder?: string) => void;
  onOpenNewFileConfirmation: () => void;
  onOpenFile: () => void;
  onOpenSaveModal: () => void;
  onOpenAIModal: () => void;
  className?: string;
}

export function MarkdownToolbar({
  onInsert,
  onOpenNewFileConfirmation,
  onOpenFile,
  onOpenSaveModal,
  onOpenAIModal,
  className = "",
}: MarkdownToolbarProps) {
  const [isHeadingDropdownOpen, setIsHeadingDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Markdown formatting functions
  const formatBold = () => onInsert("**", "**", "bold text");
  const formatItalic = () => onInsert("*", "*", "italic text");
  const formatH1 = () => onInsert("# ", "", "H1 Heading");
  const formatH2 = () => onInsert("## ", "", "H2 Heading");
  const formatH3 = () => onInsert("### ", "", "H3 Heading");
  const formatH4 = () => onInsert("#### ", "", "H4 Heading");
  const formatH5 = () => onInsert("##### ", "", "H5 Heading");
  const formatH6 = () => onInsert("###### ", "", "H6 Heading");
  const formatQuote = () => onInsert("> ", "", "Quote");
  const formatCode = () => onInsert("`", "`", "code");
  const formatLink = () => onInsert("[", "](url)", "link text");
  const formatImage = () => onInsert("![", "](url)", "alt text");
  const formatTable = () => {
    const tableText = `| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |`;
    onInsert(tableText, "", "");
  };
  const formatList = () => onInsert("- ", "", "List item");
  const formatOrderedList = () => onInsert("1. ", "", "List item");

  // Additional formatting functions
  const formatStrikethrough = () => onInsert("~~", "~~", "strikethrough text");
  const formatCodeBlock = () => onInsert("```\n", "\n```", "code block");
  const formatConfetti = () => onInsert("\n<!-- confetti -->\n", "", "");
  const formatHorizontalRule = () => onInsert("\n---\n", "", "");

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsHeadingDropdownOpen(false);
      }
    };

    if (isHeadingDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isHeadingDropdownOpen]);

  return (
    <div className={`flex flex-col ${className}`}>
      {/* File Operations Toolbar */}
      <div className="flex items-center p-1 border-b border-input bg-gray-300 dark:bg-gray-900">
        {/* New File Button */}
        <button
          onClick={onOpenNewFileConfirmation}
          className="flex items-center justify-center w-8 h-8 text-muted-foreground hover:text-foreground hover:bg-secondary rounded transition-colors"
          title="New File"
        >
          <FileText className="w-4 h-4" />
        </button>

        {/* Open File Button */}
        <button
          onClick={onOpenFile}
          className="flex items-center justify-center w-8 h-8 text-muted-foreground hover:text-foreground hover:bg-secondary rounded transition-colors"
          title="Open Markdown File"
        >
          <FolderOpen className="w-4 h-4" />
        </button>

        {/* Save File Button */}
        <button
          onClick={onOpenSaveModal}
          className="flex items-center justify-center w-8 h-8 text-muted-foreground hover:text-foreground hover:bg-secondary rounded transition-colors"
          title="Save Markdown File"
        >
          <Save className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-input mx-1" />

        {/* Markdown Help Button */}
        <a
          href="https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-8 h-8 text-muted-foreground hover:text-foreground hover:bg-secondary rounded transition-colors"
          title="Markdown syntax help"
        >
          <HelpCircle className="w-4 h-4" />
        </a>

        <div className="w-px h-6 bg-input mx-1" />

        {/* AI Generate Button */}
        <button
          onClick={onOpenAIModal}
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-purple-600 hover:text-purple-700 hover:bg-purple-50 dark:text-purple-400 dark:hover:text-purple-300 dark:hover:bg-purple-900/20 rounded transition-all duration-300 hover:scale-105 group"
          title="Generate presentation content with AI"
        >
          <Sparkles className="w-4 h-4 group-hover:animate-pulse group-hover:rotate-12 transition-all duration-300" />
          <span>AI</span>
        </button>
      </div>

      {/* Markdown Formatting Toolbar */}
      <div className="flex items-center p-1 border-b border-input bg-gray-300 dark:bg-gray-900">
        {/* Heading Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsHeadingDropdownOpen(!isHeadingDropdownOpen)}
            className="flex items-center gap-1 px-2 py-1 text-muted-foreground hover:text-foreground hover:bg-secondary rounded transition-colors"
            title="Headings"
          >
            <Type className="w-4 h-4" />
            <ChevronDown className="w-3 h-3" />
          </button>

          {isHeadingDropdownOpen && (
            <div className="absolute top-full left-0 mt-1 bg-card border border-input rounded-sm shadow-lg z-10 min-w-[120px]">
              <button
                onClick={() => {
                  formatH1();
                  setIsHeadingDropdownOpen(false);
                }}
                className="w-full px-3 py-2 text-left text-sm text-card-foreground hover:bg-secondary transition-colors"
              >
                Heading 1
              </button>
              <button
                onClick={() => {
                  formatH2();
                  setIsHeadingDropdownOpen(false);
                }}
                className="w-full px-3 py-2 text-left text-sm text-card-foreground hover:bg-secondary transition-colors"
              >
                Heading 2
              </button>
              <button
                onClick={() => {
                  formatH3();
                  setIsHeadingDropdownOpen(false);
                }}
                className="w-full px-3 py-2 text-left text-sm text-card-foreground hover:bg-secondary transition-colors"
              >
                Heading 3
              </button>
              <button
                onClick={() => {
                  formatH4();
                  setIsHeadingDropdownOpen(false);
                }}
                className="w-full px-3 py-2 text-left text-sm text-card-foreground hover:bg-secondary transition-colors"
              >
                Heading 4
              </button>
              <button
                onClick={() => {
                  formatH5();
                  setIsHeadingDropdownOpen(false);
                }}
                className="w-full px-3 py-2 text-left text-sm text-card-foreground hover:bg-secondary transition-colors"
              >
                Heading 5
              </button>
              <button
                onClick={() => {
                  formatH6();
                  setIsHeadingDropdownOpen(false);
                }}
                className="w-full px-3 py-2 text-left text-sm text-card-foreground hover:bg-secondary transition-colors"
              >
                Heading 6
              </button>
            </div>
          )}
        </div>

        <div className="w-px h-6 bg-input mx-1" />

        <button
          onClick={formatBold}
          className="flex items-center justify-center w-8 h-8 text-muted-foreground hover:text-foreground hover:bg-secondary rounded transition-colors"
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </button>

        <button
          onClick={formatItalic}
          className="flex items-center justify-center w-8 h-8 text-muted-foreground hover:text-foreground hover:bg-secondary rounded transition-colors"
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </button>

        <button
          onClick={formatStrikethrough}
          className="flex items-center justify-center w-8 h-8 text-muted-foreground hover:text-foreground hover:bg-secondary rounded transition-colors"
          title="Strikethrough"
        >
          <Strikethrough className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-input mx-1" />

        <button
          onClick={formatQuote}
          className="flex items-center justify-center w-8 h-8 text-muted-foreground hover:text-foreground hover:bg-secondary rounded transition-colors"
          title="Quote"
        >
          <Quote className="w-4 h-4" />
        </button>

        <button
          onClick={formatCode}
          className="flex items-center justify-center w-8 h-8 text-muted-foreground hover:text-foreground hover:bg-secondary rounded transition-colors"
          title="Inline Code"
        >
          <Code className="w-4 h-4" />
        </button>

        <button
          onClick={formatCodeBlock}
          className="flex items-center justify-center w-8 h-8 text-muted-foreground hover:text-foreground hover:bg-secondary rounded transition-colors"
          title="Code Block"
        >
          <Terminal className="w-4 h-4" />
        </button>

        <button
          onClick={formatLink}
          className="flex items-center justify-center w-8 h-8 text-muted-foreground hover:text-foreground hover:bg-secondary rounded transition-colors"
          title="Link"
        >
          <Link className="w-4 h-4" />
        </button>

        <button
          onClick={formatImage}
          className="flex items-center justify-center w-8 h-8 text-muted-foreground hover:text-foreground hover:bg-secondary rounded transition-colors"
          title="Image"
        >
          {/* eslint-disable-next-line jsx-a11y/alt-text */}
          <Image className="w-4 h-4" />
        </button>

        <button
          onClick={formatTable}
          className="flex items-center justify-center w-8 h-8 text-muted-foreground hover:text-foreground hover:bg-secondary rounded transition-colors"
          title="Table"
        >
          <Table className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-input mx-1" />

        <button
          onClick={formatList}
          className="flex items-center justify-center w-8 h-8 text-muted-foreground hover:text-foreground hover:bg-secondary rounded transition-colors"
          title="Unordered List"
        >
          <List className="w-4 h-4" />
        </button>

        <button
          onClick={formatOrderedList}
          className="flex items-center justify-center w-8 h-8 text-muted-foreground hover:text-foreground hover:bg-secondary rounded transition-colors"
          title="Ordered List"
        >
          <ListOrdered className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-input mx-1" />

        <button
          onClick={formatConfetti}
          className="flex items-center justify-center w-8 h-8 text-muted-foreground hover:text-foreground hover:bg-secondary rounded transition-colors"
          title="Confetti"
        >
          <PartyPopper className="w-4 h-4" />
        </button>

        <button
          onClick={formatHorizontalRule}
          className="flex items-center justify-center w-8 h-8 text-muted-foreground hover:text-foreground hover:bg-secondary rounded transition-colors"
          title="New Slide"
        >
          <Minus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
