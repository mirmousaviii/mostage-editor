"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Bold as BoldIcon,
  Italic as ItalicIcon,
  Underline as UnderlineIcon,
  List as ListIcon,
  Link as LinkIcon,
  Code as CodeIcon,
  ListOrdered as ListOrderedIcon,
  Image as ImageIcon,
  Table as TableIcon,
  Strikethrough as StrikethroughIcon,
  Minus as MinusIcon,
  Terminal as TerminalIcon,
  PartyPopper as PartyPopperIcon,
  Sparkles as SparklesIcon,
  QrCode as QrCodeIcon,
  BarChart3 as BarChart3Icon,
  HelpCircle as HelpCircleIcon,
  MessageSquare as MessageSquareIcon,
  ChevronDown as ChevronDownIcon,
  Type as TypeIcon,
  Undo2 as UndoIcon,
  Redo2 as RedoIcon,
} from "lucide-react";
import { LoginRequiredModal } from "./LoginRequiredModal";
import { ToolbarButton, ToolbarDivider, PopupForm } from "./toolbar";

interface MarkdownToolbarProps {
  onInsert: (before: string, after?: string, placeholder?: string) => void;
  onToggleFormatting?: (marker: string, closingMarker?: string) => void;
  onToggleList?: (listType: "unordered" | "ordered") => void;
  onApplyHeading?: (level: number) => void;
  onApplyQuote?: () => void;
  onApplyParagraph?: () => void;
  onApplyCodeBlock?: () => void;
  onOpenNewFileConfirmation: () => void;
  onOpenFile: () => void;
  onOpenSaveModal: () => void;
  onOpenAIModal: () => void;
  onOpenAuthModal: () => void;
  getSelectedText?: () => string;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  className?: string;
}

// Constants
const DROPDOWN_MENU_CLASSES =
  "absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 border border-input rounded-md shadow-lg z-[100] min-w-[180px] max-w-[calc(100vw-1rem)]";
const POPUP_CLASSES =
  "fixed sm:absolute sm:top-full sm:left-0 sm:mt-1 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 sm:translate-x-0 sm:translate-y-0 bg-white dark:bg-gray-800 border border-input rounded-md shadow-xl z-[9997] p-4 min-w-[280px] max-w-[calc(100vw-2rem)] w-[calc(100vw-2rem)] sm:w-auto sm:shadow-lg";
const POPUP_BACKDROP_CLASSES = "fixed inset-0 bg-black/50 z-[9996] sm:hidden";

// Table generation constants
const MAX_TABLE_COLUMNS = 10;
const MAX_TABLE_ROWS = 20;
const DEFAULT_TABLE_COLUMNS = 3;
const DEFAULT_TABLE_ROWS = 2;
const TABLE_CELL_WIDTH = 12;

export function MarkdownToolbar({
  onInsert,
  onToggleFormatting,
  onToggleList,
  onApplyHeading,
  onApplyQuote,
  onApplyParagraph,
  onApplyCodeBlock,
  onOpenAIModal,
  onOpenAuthModal,
  getSelectedText,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
  className = "",
}: MarkdownToolbarProps) {
  // ==================== State Management ====================
  const [showLoginRequiredModal, setShowLoginRequiredModal] = useState(false);
  const [showTitleDropdown, setShowTitleDropdown] = useState(false);

  // Link popup state
  const [showLinkPopup, setShowLinkPopup] = useState(false);
  const [linkText, setLinkText] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const linkSelectedTextRef = useRef<string>("");

  // Image popup state
  const [showImagePopup, setShowImagePopup] = useState(false);
  const [imageAlt, setImageAlt] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const imageSelectedTextRef = useRef<string>("");

  // Table popup state
  const [showTablePopup, setShowTablePopup] = useState(false);
  const [tableColumns, setTableColumns] = useState(
    String(DEFAULT_TABLE_COLUMNS)
  );
  const [tableRows, setTableRows] = useState(String(DEFAULT_TABLE_ROWS));

  // ==================== Refs ====================
  const titleDropdownRef = useRef<HTMLDivElement>(null);
  const linkPopupRef = useRef<HTMLDivElement>(null);
  const imagePopupRef = useRef<HTMLDivElement>(null);
  const tablePopupRef = useRef<HTMLDivElement>(null);

  // ==================== Popup/Dropdown Management ====================
  const closeLinkPopup = () => {
    setShowLinkPopup(false);
    setLinkText("");
    setLinkUrl("");
    linkSelectedTextRef.current = "";
  };

  const closeImagePopup = () => {
    setShowImagePopup(false);
    setImageAlt("");
    setImageUrl("");
    imageSelectedTextRef.current = "";
  };

  const closeTablePopup = () => {
    setShowTablePopup(false);
    setTableColumns(String(DEFAULT_TABLE_COLUMNS));
    setTableRows(String(DEFAULT_TABLE_ROWS));
  };

  const closeTitleDropdown = () => {
    setShowTitleDropdown(false);
  };

  /**
   * Closes dropdowns/popups when clicking outside
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const refsWithClosers: Array<{
        ref: React.RefObject<HTMLDivElement | null>;
        closer: () => void;
      }> = [
        { ref: titleDropdownRef, closer: closeTitleDropdown },
        { ref: linkPopupRef, closer: closeLinkPopup },
        { ref: imagePopupRef, closer: closeImagePopup },
        { ref: tablePopupRef, closer: closeTablePopup },
      ];

      refsWithClosers.forEach(({ ref, closer }) => {
        if (ref.current && !ref.current.contains(target)) {
          closer();
        }
      });
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // ==================== Formatting Functions ====================
  /**
   * Creates a formatting function that supports toggle
   */
  const createToggleFormatter =
    (marker: string, closingMarker?: string, fallbackPlaceholder?: string) =>
    () => {
      if (onToggleFormatting) {
        onToggleFormatting(marker, closingMarker);
      } else {
        onInsert(
          marker,
          closingMarker || marker,
          fallbackPlaceholder || "text"
        );
      }
    };

  // Text formatting functions with toggle support
  const formatBold = createToggleFormatter("**", undefined, "bold text");
  const formatItalic = createToggleFormatter("_", undefined, "italic text");
  const formatUnderline = createToggleFormatter(
    "<u>",
    "</u>",
    "underlined text"
  );
  const formatStrikethrough = createToggleFormatter(
    "~~",
    undefined,
    "strikethrough text"
  );

  // Block formatting functions
  const createHeadingFormatter = (level: number) => () => {
    if (onApplyHeading) {
      onApplyHeading(level);
    } else {
      onInsert(`\n${"#".repeat(level)} `, "", `Title Level ${level}`);
    }
    closeTitleDropdown();
  };

  const formatParagraph = () => {
    if (onApplyParagraph) {
      onApplyParagraph();
    } else {
      onInsert("\n\n", "", "Paragraph text");
    }
    closeTitleDropdown();
  };

  const formatH1 = createHeadingFormatter(1);
  const formatH2 = createHeadingFormatter(2);
  const formatH3 = createHeadingFormatter(3);
  const formatH4 = createHeadingFormatter(4);
  const formatH5 = createHeadingFormatter(5);
  const formatH6 = createHeadingFormatter(6);

  const formatQuote = () => {
    if (onApplyQuote) {
      onApplyQuote();
    } else {
      onInsert("\n> ", "", "Quote");
    }
    closeTitleDropdown();
  };

  // Code formatting functions
  const formatCode = createToggleFormatter("`", undefined, "code");
  const formatCodeBlock = () => {
    if (onApplyCodeBlock) {
      onApplyCodeBlock();
    } else {
      onInsert("\n```\n", "\n```", "code block");
    }
  };

  // Link/Image functions
  const formatLink = () => {
    const selectedText = getSelectedText?.() || "";
    linkSelectedTextRef.current = selectedText;
    setShowLinkPopup(true);
    setLinkText(selectedText);
    setLinkUrl("");
  };

  const handleLinkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (linkText.trim() && linkUrl.trim()) {
      // Use selected text if available, otherwise use linkText
      // Pass the text to use as placeholder so insertText uses it if selection is lost
      const textToUse = linkSelectedTextRef.current.trim()
        ? linkSelectedTextRef.current
        : linkText.trim();
      onInsert(`[`, `](${linkUrl})`, textToUse);
      closeLinkPopup();
    }
  };

  const formatImage = () => {
    const selectedText = getSelectedText?.() || "";
    imageSelectedTextRef.current = selectedText;
    setShowImagePopup(true);
    setImageAlt(selectedText);
    setImageUrl("");
  };

  const handleImageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (imageUrl.trim()) {
      // Use selected text if available, otherwise use altText or default
      // Pass the alt text as placeholder so insertText uses it if selection is lost
      const altText =
        imageSelectedTextRef.current.trim() || imageAlt.trim() || "image";
      onInsert(`![`, `](${imageUrl})`, altText);
      closeImagePopup();
    }
  };

  // List formatting functions
  const formatList = () => {
    if (onToggleList) {
      onToggleList("unordered");
    } else {
      onInsert("\n- ", "", "List item");
    }
  };

  const formatOrderedList = () => {
    if (onToggleList) {
      onToggleList("ordered");
    } else {
      onInsert("\n1. ", "", "List item");
    }
  };

  // Table formatting functions
  /**
   * Generates a Markdown table with specified dimensions
   */
  const generateMarkdownTable = (columns: number, rows: number): string => {
    const padCell = (text: string) => text.padEnd(TABLE_CELL_WIDTH, " ");

    // Create header row
    const headers = Array.from({ length: columns }, (_, i) =>
      padCell(`Header ${i + 1}`)
    );
    const headerRow = `| ${headers.join(" | ")} |`;

    // Create separator row
    const separators = Array.from({ length: columns }, () =>
      "-".repeat(TABLE_CELL_WIDTH)
    );
    const separatorRow = `| ${separators.join(" | ")} |`;

    // Create data rows
    const createRow = (rowNum: number) => {
      const cells = Array.from({ length: columns }, (_, i) =>
        padCell(`Cell ${rowNum * columns + i + 1}`)
      );
      return `| ${cells.join(" | ")} |`;
    };

    const dataRows = Array.from({ length: rows }, (_, i) => createRow(i));

    return `\n${headerRow}\n${separatorRow}\n${dataRows.join("\n")}`;
  };

  const formatTable = () => {
    setShowTablePopup(true);
    setTableColumns(String(DEFAULT_TABLE_COLUMNS));
    setTableRows(String(DEFAULT_TABLE_ROWS));
  };

  const handleTableSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const columns = parseInt(tableColumns, 10);
    const rows = parseInt(tableRows, 10);

    if (
      columns > 0 &&
      columns <= MAX_TABLE_COLUMNS &&
      rows > 0 &&
      rows <= MAX_TABLE_ROWS
    ) {
      const tableText = generateMarkdownTable(columns, rows);
      onInsert(tableText, "", "");
      closeTablePopup();
    }
  };

  // ==================== Special Content Functions ====================
  const insertConfetti = () => onInsert("\n<!-- confetti -->\n", "", "");
  const insertNewSlide = () => onInsert("\n---\n", "", "");

  // ==================== Auth-Required Features ====================
  const requireAuth = () => setShowLoginRequiredModal(true);

  return (
    <div className={`flex flex-col ${className}`}>
      <div className="flex items-center p-1 border-b border-input bg-gray-300 dark:bg-gray-900">
        {/* AI Generate Button */}
        <button
          onClick={onOpenAIModal}
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-purple-600 hover:text-purple-700 hover:bg-purple-50 dark:text-purple-400 dark:hover:text-purple-300 dark:hover:bg-purple-900/20 rounded transition-all duration-300 hover:scale-105 group"
          title="Generate presentation content with AI"
        >
          <SparklesIcon className="w-4 h-4 group-hover:animate-pulse group-hover:rotate-12 transition-all duration-300" />
          <span className="font-bold text-sm">AI</span>
        </button>

        <ToolbarDivider />

        <ToolbarButton
          onClick={insertConfetti}
          title="Confetti"
          icon={<PartyPopperIcon className="w-4 h-4" />}
        />
        <ToolbarButton
          onClick={insertNewSlide}
          title="New Slide"
          icon={<MinusIcon className="w-4 h-4" />}
        />

        <ToolbarDivider />

        <ToolbarButton
          onClick={requireAuth}
          title="QR Code"
          icon={<QrCodeIcon className="w-4 h-4" />}
        />
        <ToolbarButton
          onClick={requireAuth}
          title="Live Polling"
          icon={<BarChart3Icon className="w-4 h-4" />}
        />
        <ToolbarButton
          onClick={requireAuth}
          title="Live Quiz"
          icon={<HelpCircleIcon className="w-4 h-4" />}
        />
        <ToolbarButton
          onClick={requireAuth}
          title="Q&A"
          icon={<MessageSquareIcon className="w-4 h-4" />}
        />
      </div>

      {/* Markdown Formatting Toolbar */}
      <div className="flex items-center p-1 border-b border-input bg-gray-300 dark:bg-gray-900">
        {/* Undo/Redo */}
        <ToolbarButton
          onClick={() => onUndo?.()}
          title="Undo"
          icon={
            <UndoIcon
              className={`w-4 h-4 ${
                !canUndo ? "opacity-50 cursor-not-allowed" : ""
              }`}
            />
          }
          className={`flex items-center justify-center w-8 h-8 text-muted-foreground hover:text-foreground hover:bg-secondary rounded transition-colors ${
            !canUndo ? "cursor-not-allowed" : ""
          }`}
        />
        <ToolbarButton
          onClick={() => onRedo?.()}
          title="Redo"
          icon={
            <RedoIcon
              className={`w-4 h-4 ${
                !canRedo ? "opacity-50 cursor-not-allowed" : ""
              }`}
            />
          }
          className={`flex items-center justify-center w-8 h-8 text-muted-foreground hover:text-foreground hover:bg-secondary rounded transition-colors ${
            !canRedo ? "cursor-not-allowed" : ""
          }`}
        />
        <ToolbarDivider />
        {/* Title Dropdown */}
        <div className="relative" ref={titleDropdownRef}>
          <button
            onClick={() => setShowTitleDropdown(!showTitleDropdown)}
            className="flex items-center gap-1 px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary rounded transition-colors"
            title="Title"
          >
            <TypeIcon className="w-4 h-4" />
            <ChevronDownIcon className="w-3 h-3" />
          </button>
          {showTitleDropdown && (
            <div className={DROPDOWN_MENU_CLASSES}>
              <button
                onClick={formatParagraph}
                className="w-full text-left px-3 py-2 text-sm hover:bg-secondary transition-colors"
              >
                Paragraph
              </button>
              <div className="border-t border-input my-1" />
              {[1, 2, 3, 4, 5, 6].map((level) => {
                const formatters = [
                  formatH1,
                  formatH2,
                  formatH3,
                  formatH4,
                  formatH5,
                  formatH6,
                ];
                return (
                  <button
                    key={level}
                    onClick={formatters[level - 1]}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-secondary transition-colors font-bold"
                  >
                    Title Level {level}
                  </button>
                );
              })}
              <div className="border-t border-input my-1" />
              <button
                onClick={formatQuote}
                className="w-full text-left px-3 py-2 text-sm hover:bg-secondary transition-colors"
              >
                Quote
              </button>
            </div>
          )}
        </div>

        <ToolbarDivider />

        <ToolbarButton
          onClick={formatBold}
          title="Bold"
          icon={<BoldIcon className="w-4 h-4" />}
        />
        <ToolbarButton
          onClick={formatItalic}
          title="Italic"
          icon={<ItalicIcon className="w-4 h-4" />}
        />
        <ToolbarButton
          onClick={formatUnderline}
          title="Underline"
          icon={<UnderlineIcon className="w-4 h-4" />}
        />
        <ToolbarButton
          onClick={formatStrikethrough}
          title="Strikethrough"
          icon={<StrikethroughIcon className="w-4 h-4" />}
        />

        <ToolbarDivider />

        <ToolbarButton
          onClick={formatCode}
          title="Inline Code"
          icon={<CodeIcon className="w-4 h-4" />}
        />
        <ToolbarButton
          onClick={formatCodeBlock}
          title="Code Block"
          icon={<TerminalIcon className="w-4 h-4" />}
        />

        <ToolbarDivider />

        <div className="relative">
          <ToolbarButton
            onClick={formatLink}
            title="Link"
            icon={<LinkIcon className="w-4 h-4" />}
          />
          {showLinkPopup && (
            <>
              <div
                className={POPUP_BACKDROP_CLASSES}
                onClick={closeLinkPopup}
                aria-hidden="true"
              />
              <div className={POPUP_CLASSES} ref={linkPopupRef}>
                <PopupForm
                  onSubmit={handleLinkSubmit}
                  onCancel={closeLinkPopup}
                  fields={[
                    {
                      label: "Link Text",
                      value: linkText,
                      onChange: (e) => setLinkText(e.target.value),
                      placeholder: "Link text",
                      autoFocus: true,
                    },
                    {
                      label: "URL",
                      value: linkUrl,
                      onChange: (e) => setLinkUrl(e.target.value),
                      placeholder: "https://example.com",
                    },
                  ]}
                  isSubmitDisabled={!linkText.trim() || !linkUrl.trim()}
                />
              </div>
            </>
          )}
        </div>

        <div className="relative">
          <ToolbarButton
            onClick={formatImage}
            title="Image"
            icon={<ImageIcon className="w-4 h-4" />}
          />
          {showImagePopup && (
            <>
              <div
                className={POPUP_BACKDROP_CLASSES}
                onClick={closeImagePopup}
                aria-hidden="true"
              />
              <div className={POPUP_CLASSES} ref={imagePopupRef}>
                <PopupForm
                  onSubmit={handleImageSubmit}
                  onCancel={closeImagePopup}
                  fields={[
                    {
                      label: "Alt Text",
                      value: imageAlt,
                      onChange: (e) => setImageAlt(e.target.value),
                      placeholder: "Image description",
                      autoFocus: true,
                    },
                    {
                      label: "Image URL",
                      value: imageUrl,
                      onChange: (e) => setImageUrl(e.target.value),
                      placeholder: "https://example.com/image.jpg",
                    },
                  ]}
                  isSubmitDisabled={!imageUrl.trim()}
                />
              </div>
            </>
          )}
        </div>

        <div className="relative">
          <ToolbarButton
            onClick={formatTable}
            title="Table"
            icon={<TableIcon className="w-4 h-4" />}
          />
          {showTablePopup && (
            <>
              <div
                className={POPUP_BACKDROP_CLASSES}
                onClick={closeTablePopup}
                aria-hidden="true"
              />
              <div className={POPUP_CLASSES} ref={tablePopupRef}>
                <PopupForm
                  onSubmit={handleTableSubmit}
                  onCancel={closeTablePopup}
                  fields={[
                    {
                      label: "Number of Columns",
                      value: tableColumns,
                      onChange: (e) => setTableColumns(e.target.value),
                      placeholder: "3",
                      autoFocus: true,
                      type: "number",
                      min: 1,
                      max: MAX_TABLE_COLUMNS,
                    },
                    {
                      label: "Number of Rows",
                      value: tableRows,
                      onChange: (e) => setTableRows(e.target.value),
                      placeholder: "2",
                      type: "number",
                      min: 1,
                      max: MAX_TABLE_ROWS,
                    },
                  ]}
                  isSubmitDisabled={
                    !tableColumns.trim() ||
                    parseInt(tableColumns, 10) <= 0 ||
                    parseInt(tableColumns, 10) > MAX_TABLE_COLUMNS ||
                    !tableRows.trim() ||
                    parseInt(tableRows, 10) <= 0 ||
                    parseInt(tableRows, 10) > MAX_TABLE_ROWS
                  }
                />
              </div>
            </>
          )}
        </div>

        <ToolbarDivider />

        <ToolbarButton
          onClick={formatList}
          title="Unordered List"
          icon={<ListIcon className="w-4 h-4" />}
        />
        <ToolbarButton
          onClick={formatOrderedList}
          title="Ordered List"
          icon={<ListOrderedIcon className="w-4 h-4" />}
        />
      </div>

      {/* Login Required Modal */}
      <LoginRequiredModal
        isOpen={showLoginRequiredModal}
        onClose={() => setShowLoginRequiredModal(false)}
        onOpenAuthModal={onOpenAuthModal}
      />
    </div>
  );
}
