"use client";

import { ContentEditorProps } from "@/types";
import { useState, useRef, useEffect } from "react";
import {
  ChevronDown,
  Bold,
  Italic,
  Quote,
  Code,
  Link,
  List,
  ListOrdered,
  CheckSquare,
  Image,
  Table,
  Type,
  Strikethrough,
  Minus,
  Terminal,
  PartyPopper,
  HelpCircle,
} from "lucide-react";

export const ContentEditor: React.FC<ContentEditorProps> = ({
  value,
  onChange,
  placeholder = "Start typing your markdown here...",
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isHeadingDropdownOpen, setIsHeadingDropdownOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  // Markdown formatting functions
  const formatBold = () => insertText("**", "**", "bold text");
  const formatItalic = () => insertText("*", "*", "italic text");
  const formatH1 = () => insertText("# ", "", "H1 Heading");
  const formatH2 = () => insertText("## ", "", "H2 Heading");
  const formatH3 = () => insertText("### ", "", "H3 Heading");
  const formatH4 = () => insertText("#### ", "", "H4 Heading");
  const formatH5 = () => insertText("##### ", "", "H5 Heading");
  const formatH6 = () => insertText("###### ", "", "H6 Heading");
  const formatQuote = () => insertText("> ", "", "Quote");
  const formatCode = () => insertText("`", "`", "code");
  const formatLink = () => insertText("[", "](url)", "link text");
  const formatImage = () => insertText("![", "](url)", "alt text");
  const formatTable = () => {
    const tableText = `| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |`;
    insertText(tableText, "", "");
  };
  const formatList = () => insertText("- ", "", "List item");
  const formatOrderedList = () => insertText("1. ", "", "List item");
  const formatTaskList = () => insertText("- [ ] ", "", "Task item");

  // Additional formatting functions
  const formatStrikethrough = () =>
    insertText("~~", "~~", "strikethrough text");
  const formatCodeBlock = () => insertText("```\n", "\n```", "code block");
  const formatConfetti = () => insertText("\n<!-- confetti -->\n", "", "");
  const formatHorizontalRule = () => insertText("\n---\n", "", "");

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

            <button
              onClick={formatTaskList}
              className="flex items-center justify-center w-8 h-8 text-muted-foreground hover:text-foreground hover:bg-secondary rounded transition-colors"
              title="Task List"
            >
              <CheckSquare className="w-4 h-4" />
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

            <div className="w-px h-6 bg-input mx-1" />

            <a
              href="https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-8 h-8 text-muted-foreground hover:text-foreground hover:bg-secondary rounded transition-colors"
              title="GitHub Markdown Help (opens in new tab)"
            >
              <HelpCircle className="w-4 h-4" />
            </a>
          </div>

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
    </div>
  );
};
