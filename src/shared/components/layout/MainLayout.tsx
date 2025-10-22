"use client";

import { EditorProps } from "@/features/editor/types/editor.types";
import { PresentationConfig } from "@/features/presentation/types/presentation.types";
import { ContentEditor } from "@/features/editor/components/ContentEditor";
import { ContentPreview } from "@/features/presentation/components/ContentPreview";
import { PresentationSettings } from "@/features/presentation/components/PresentationSettings";
import { ResizableSplitPane } from "./ResizableSplitPane";
import { ThemeToggle } from "@/shared/common/ThemeToggle";
import { AuthModal } from "@/features/auth/components/AuthModal";
import { AboutModal } from "@/features/app-info/components/AboutModal";
import { ExportModal } from "@/features/export/components/ExportModal";
import { ImportModal } from "@/features/import/components/ImportModal";
import React, { useState, useCallback } from "react";
import Image from "next/image";
import logo from "@/assets/images/logo.svg";
import { FileText, Download, Upload, User, Info } from "lucide-react";
import {
  exportToHTML,
  exportToPDF,
  exportToMostage,
  exportToPPTX,
  exportToJPG,
} from "@/features/export/services/exportUtils";
import {
  handleFileImportWithConfig,
  handleMultipleFilesImport,
  validateFile,
} from "@/features/import/services/importUtils";

// Constants
const COLLAPSE_THRESHOLD = 5; // Percentage threshold for collapse state
const DEFAULT_LEFT_PANE_SIZE = 30; // Default left pane size percentage
const MIN_PANE_SIZE = 15; // Minimum pane size percentage
const MAX_PANE_SIZE = 75; // Maximum pane size percentage

// Default presentation configuration
const DEFAULT_PRESENTATION_CONFIG: PresentationConfig = {
  theme: "light",
  scale: 1.0,
  loop: false,
  keyboard: true,
  touch: true,
  urlHash: true,
  transition: {
    type: "horizontal",
    duration: 300,
    easing: "ease-in-out",
  },
  centerContent: {
    vertical: true,
    horizontal: true,
  },
  header: {
    enabled: false,
    content: "",
    position: "top-left",
    showOnFirstSlide: true,
  },
  footer: {
    enabled: false,
    content: "",
    position: "bottom-left",
    showOnFirstSlide: true,
  },
  plugins: {
    ProgressBar: {
      enabled: true,
      position: "bottom",
      height: "12px",
      color: "#007acc",
    },
    SlideNumber: {
      enabled: true,
      position: "bottom-right",
      format: "current/total",
    },
    Controller: {
      enabled: true,
      position: "bottom-center",
    },
    Confetti: {
      enabled: true,
      particleCount: 50,
      size: { min: 5, max: 10 },
      duration: 3000,
      delay: 0,
      colors: [
        "#ff6b6b",
        "#4ecdc4",
        "#45b7d1",
        "#96ceb4",
        "#feca57",
        "#ff9ff3",
        "#54a0ff",
      ],
    },
  },
};

export const MainLayout: React.FC<EditorProps> = ({
  markdown,
  onChange,
  showEditor,
  showPreview,
}) => {
  // Modal states
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

  // Split pane states
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [leftPaneSize, setLeftPaneSize] = useState<number>(
    DEFAULT_LEFT_PANE_SIZE
  );

  // Presentation configuration
  const [presentationConfig, setPresentationConfig] =
    useState<PresentationConfig>(DEFAULT_PRESENTATION_CONFIG);

  // Event handlers
  const handleSplitPaneSizeChange = useCallback((newSize: number) => {
    setLeftPaneSize(newSize);
    if (newSize > 0) {
      setIsSidebarCollapsed(false);
    }
  }, []);

  const handleCollapseToggle = useCallback(() => {
    if (leftPaneSize <= COLLAPSE_THRESHOLD) {
      // If panel is small, expand it to default size
      setLeftPaneSize(DEFAULT_LEFT_PANE_SIZE);
      setIsSidebarCollapsed(false);
    } else {
      // If panel is large, collapse it
      setLeftPaneSize(0);
      setIsSidebarCollapsed(true);
    }
  }, [leftPaneSize]);

  const handleOpenAuthModal = useCallback(() => {
    setShowAuthModal(true);
  }, []);

  const handleOpenAboutModal = useCallback(() => {
    setShowAboutModal(true);
  }, []);

  const handleOpenExportModal = useCallback(() => {
    setShowExportModal(true);
  }, []);

  const handleOpenImportModal = useCallback(() => {
    setShowImportModal(true);
  }, []);

  const handleExport = useCallback(
    async (format: string) => {
      try {
        const options = {
          filename: "presentation",
          theme: presentationConfig.theme,
        };

        switch (format) {
          case "mostage":
            await exportToMostage(
              markdown,
              presentationConfig as unknown as Record<string, unknown>,
              options
            );
            break;
          case "html":
            await exportToHTML(
              markdown,
              presentationConfig as unknown as Record<string, unknown>,
              options
            );
            break;
          case "pdf":
            await exportToPDF(
              markdown,
              presentationConfig as unknown as Record<string, unknown>,
              options
            );
            break;
          case "pptx":
            await exportToPPTX(
              markdown,
              presentationConfig as unknown as Record<string, unknown>
            );
            break;
          case "jpg":
            await exportToJPG(
              markdown,
              presentationConfig as unknown as Record<string, unknown>
            );
            break;
          default:
            console.error("Unknown export format:", format);
        }

        setShowExportModal(false);
      } catch (error) {
        console.error("Export failed:", error);
      }
    },
    [markdown, presentationConfig]
  );

  const handleImport = useCallback(
    async (file: File) => {
      try {
        const validation = validateFile(file);
        if (!validation.valid) {
          throw new Error(validation.error);
        }

        const result = await handleFileImportWithConfig(file);

        // Update content if available
        if (result.content) {
          onChange(result.content);
        }

        // Update config if available
        if (result.config) {
          setPresentationConfig(result.config as unknown as PresentationConfig);
        }

        setShowImportModal(false);
      } catch (error) {
        console.error("Import failed:", error);
      }
    },
    [onChange]
  );

  const handleImportMultiple = useCallback(
    async (files: File[]) => {
      try {
        // Validate all files
        for (const file of files) {
          const validation = validateFile(file);
          if (!validation.valid) {
            throw new Error(validation.error);
          }
        }

        const result = await handleMultipleFilesImport(files);

        // Update content if available
        if (result.content) {
          onChange(result.content);
        }

        // Update config if available
        if (result.config) {
          setPresentationConfig(result.config as unknown as PresentationConfig);
        }

        setShowImportModal(false);
      } catch (error) {
        console.error("Import failed:", error);
      }
    },
    [onChange]
  );

  // Render helpers
  const renderToolbar = () => (
    <div className="flex items-center justify-between p-3 border-b border-input bg-muted">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-3">
          <Image
            src={logo}
            alt="Mostage Logo"
            width={32}
            height={32}
            className="w-8 h-8"
          />
          <h1 className="text-xl font-bold text-foreground">Mostage Editor</h1>
        </div>
        <span className="text-xs text-muted-foreground bg-secondary text-secondary-foreground px-2 py-1 rounded-md font-medium">
          Beta Version
        </span>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <button
            onClick={handleOpenImportModal}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-foreground bg-background hover:bg-secondary border border-input rounded-md transition-colors"
            title="Import presentation"
          >
            <Upload className="w-4 h-4" />
            <span className="hidden sm:inline">Import</span>
          </button>
          <button
            onClick={handleOpenExportModal}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-foreground bg-background hover:bg-secondary border border-input rounded-md transition-colors"
            title="Export presentation"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </button>

          <div className="w-px h-6 bg-input mx-1" />

          <button
            onClick={handleOpenAboutModal}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-card-foreground bg-card border border-input rounded-sm hover:bg-secondary cursor-pointer focus:outline-none transition-colors"
            title="About Mostage Editor"
          >
            <Info className="w-4 h-4" />
            <span className="hidden sm:inline">About</span>
          </button>
          <ThemeToggle />
          <button
            onClick={handleOpenAuthModal}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-card-foreground bg-card border border-input rounded-sm hover:bg-secondary cursor-pointer focus:outline-none transition-colors"
            title="Sign In / Sign Up"
          >
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">Sign In</span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderSplitPaneContent = () => (
    <ResizableSplitPane
      controlledSize={isSidebarCollapsed ? 0 : leftPaneSize}
      onSizeChange={handleSplitPaneSizeChange}
      minSize={MIN_PANE_SIZE}
      maxSize={MAX_PANE_SIZE}
      direction="horizontal"
      className="h-full"
      collapseControl={{
        isCollapsed: leftPaneSize <= COLLAPSE_THRESHOLD,
        onToggle: handleCollapseToggle,
        pane: "first",
      }}
    >
      {/* Left Pane: Presentation Settings + Content Editor */}
      <div className="relative h-full border-r border-gray-200 dark:border-gray-700 flex flex-col">
        <PresentationSettings
          config={presentationConfig}
          onConfigChange={setPresentationConfig}
        />
        <ContentEditor
          value={markdown}
          onChange={onChange}
          onOpenAuthModal={handleOpenAuthModal}
        />
      </div>

      {/* Right Pane: Live Preview */}
      <div className="h-full">
        <ContentPreview markdown={markdown} config={presentationConfig} />
      </div>
    </ResizableSplitPane>
  );

  const renderEditorOnly = () => (
    <div className="h-full flex flex-col">
      <PresentationSettings
        config={presentationConfig}
        onConfigChange={setPresentationConfig}
      />
      <ContentEditor
        value={markdown}
        onChange={onChange}
        onOpenAuthModal={handleOpenAuthModal}
      />
    </div>
  );

  const renderPreviewOnly = () => (
    <div className="h-full flex">
      <div className="flex-1">
        <ContentPreview markdown={markdown} config={presentationConfig} />
      </div>
    </div>
  );

  const renderEmptyState = () => (
    <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
      <div className="text-center">
        <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>Select a view to get started</p>
      </div>
    </div>
  );

  const renderMainContent = () => {
    if (showEditor && showPreview) {
      return renderSplitPaneContent();
    }

    if (showEditor) {
      return renderEditorOnly();
    }

    if (showPreview) {
      return renderPreviewOnly();
    }

    return renderEmptyState();
  };

  return (
    <div className="h-full flex flex-col">
      {renderToolbar()}

      <div className="flex-1 overflow-hidden">{renderMainContent()}</div>

      {/* Modals */}
      <AboutModal
        isOpen={showAboutModal}
        onClose={() => setShowAboutModal(false)}
      />

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />

      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onExport={handleExport}
        onOpenAuthModal={handleOpenAuthModal}
      />

      <ImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImport={handleImport}
        onImportMultiple={handleImportMultiple}
      />
    </div>
  );
};
