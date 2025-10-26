"use client";

import React from "react";
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
  Strikethrough,
  Minus,
  Terminal,
  PartyPopper,
  Sparkles,
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
  onOpenAIModal,
  className = "",
}: MarkdownToolbarProps) {
  // Markdown formatting functions
  const formatBold = () => onInsert("**", "**", "bold text");
  const formatItalic = () => onInsert("*", "*", "italic text");
  const formatH1 = () => onInsert("\n# ", "", "H1 Heading");
  const formatH2 = () => onInsert("\n## ", "", "H2 Heading");
  const formatH3 = () => onInsert("\n### ", "", "H3 Heading");
  const formatH4 = () => onInsert("\n#### ", "", "H4 Heading");
  const formatQuote = () => onInsert("\n> ", "", "Quote");
  const formatCode = () => onInsert("`", "`", "code");
  const formatLink = () => onInsert("[", "](url)", "link text");
  const formatImage = () => onInsert("![", "](url)", "alt text");
  const formatTable = () => {
    const tableText = `\n| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |`;
    onInsert(tableText, "", "");
  };
  const formatList = () => onInsert("\n- ", "", "List item");
  const formatOrderedList = () => onInsert("\n1. ", "", "List item");

  // Additional formatting functions
  const formatStrikethrough = () => onInsert("~~", "~~", "strikethrough text");
  const formatCodeBlock = () => onInsert("\n```\n", "\n```", "code block");
  const formatConfetti = () => onInsert("\n<!-- confetti -->\n", "", "");
  const formatHorizontalRule = () => onInsert("\n---\n", "", "");

  return (
    <div className={`flex flex-col ${className}`}>
      {/* Possible to add another row for more buttons here */}

      {/* Markdown Formatting Toolbar */}
      <div className="flex items-center p-1 border-b border-input bg-gray-300 dark:bg-gray-900">
        {/* AI Generate Button */}
        <button
          onClick={onOpenAIModal}
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-purple-600 hover:text-purple-700 hover:bg-purple-50 dark:text-purple-400 dark:hover:text-purple-300 dark:hover:bg-purple-900/20 rounded transition-all duration-300 hover:scale-105 group"
          title="Generate presentation content with AI"
        >
          <Sparkles className="w-4 h-4 group-hover:animate-pulse group-hover:rotate-12 transition-all duration-300" />
          <span className="font-bold text-sm">AI</span>
        </button>

        <div className="w-px h-6 bg-input mx-1" />

        {/* Heading Buttons */}
        <button
          onClick={formatH1}
          className="flex items-center justify-center w-8 h-8 text-muted-foreground hover:text-foreground hover:bg-secondary rounded transition-colors font-bold text-sm"
          title="Heading 1"
        >
          H1
        </button>

        <button
          onClick={formatH2}
          className="flex items-center justify-center w-8 h-8 text-muted-foreground hover:text-foreground hover:bg-secondary rounded transition-colors font-bold text-sm"
          title="Heading 2"
        >
          H2
        </button>

        <button
          onClick={formatH3}
          className="hidden sm:flex items-center justify-center w-8 h-8 text-muted-foreground hover:text-foreground hover:bg-secondary rounded transition-colors font-bold text-sm"
          title="Heading 3"
        >
          H3
        </button>

        <button
          onClick={formatH4}
          className="hidden sm:flex items-center justify-center w-8 h-8 text-muted-foreground hover:text-foreground hover:bg-secondary rounded transition-colors font-bold text-sm"
          title="Heading 4"
        >
          H4
        </button>

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

        {/* <a
          href="https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-8 h-8 text-muted-foreground hover:text-foreground hover:bg-secondary rounded transition-colors"
          title="Markdown syntax help"
        >
          <HelpCircle className="w-4 h-4" />
        </a> */}
      </div>
    </div>
  );
}
