"use client";

/**
 * MainLayout Component
 *
 * The main layout component that provides the core structure for the Mostage Editor application.
 * It manages the responsive split-pane layout, modal states, and presentation configuration.
 *
 * Features:
 * - Responsive layout that adapts to mobile and desktop screens
 * - Resizable split-pane with configurable minimum and maximum sizes
 * - Collapsible sidebar with smart collapse detection
 * - Modal management for authentication, export, import, and app info
 * - Mobile warning system for optimal user experience
 * - Theme support with light/dark mode toggle
 *
 * Layout Behavior:
 * - Desktop: Horizontal split (Settings+Editor | Live Preview)
 * - Mobile: Vertical split (Live Preview | Settings+Editor)
 *
 * Constants:
 * - COLLAPSE_THRESHOLD: 5% - Threshold for detecting collapsed state
 * - DEFAULT_LEFT_PANE_SIZE: 30% - Initial pane size on page load
 * - MIN_PANE_SIZE: 15% - Minimum allowed pane size (prevents unusable small panes)
 * - MAX_PANE_SIZE: 75% - Maximum allowed pane size (ensures both panes remain visible)
 *
 * @component
 * @returns {JSX.Element} The main layout component
 */

import { EditorProps } from "@/features/editor/types/editor.types";
import { PresentationConfig } from "@/features/presentation/types/presentation.types";
import { ContentEditor } from "@/features/editor/components/ContentEditor";
import { ContentPreview } from "@/features/presentation/components/ContentPreview";
import { PresentationSettings } from "@/features/presentation/components/PresentationSettings";
import {
  usePresentation,
  DEFAULT_PRESENTATION_CONFIG,
} from "@/features/presentation/hooks/usePresentation";
import { ResizableSplitPane } from "@/shared/components/layout/ResizableSplitPane";
import { ThemeToggle } from "@/shared/common/ThemeToggle";
import { AuthModal } from "@/features/auth/components/AuthModal";
import { AboutModal } from "@/features/app-info/components/AboutModal";
import { ExportModal } from "@/features/export/components/ExportModal";
import { ImportModal } from "@/features/import/components/ImportModal";
import { NewSampleModal } from "@/features/editor/components/NewSampleModal";
import { MobileWarning } from "@/shared/components/ui";
import React, { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/images/logo.svg";
import { FileText, Download, Upload, User, Info, Plus } from "lucide-react";
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

const COLLAPSE_THRESHOLD = 5; // Percentage threshold for collapse state
const DEFAULT_LEFT_PANE_SIZE = 30; // Default left pane size percentage (desktop)
const DEFAULT_MOBILE_PANE_SIZE = 40; // Default pane size for mobile (vertical layout)
const MIN_PANE_SIZE = 15; // Minimum pane size percentage
const MAX_PANE_SIZE = 75; // Maximum pane size percentage

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
  const [showNewSampleModal, setShowNewSampleModal] = useState(false);

  // Split pane states
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [leftPaneSize, setLeftPaneSize] = useState<number>(
    DEFAULT_LEFT_PANE_SIZE // Will be updated based on screen size in useEffect
  );

  // Responsive state
  const [isMobile, setIsMobile] = useState(false);

  // Presentation configuration
  const { config: presentationConfig, updateConfig: setPresentationConfig } =
    usePresentation();

  // Handle responsive layout
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);

      // Set appropriate default pane size based on screen size
      if (mobile) {
        setLeftPaneSize(DEFAULT_MOBILE_PANE_SIZE);
      } else {
        setLeftPaneSize(DEFAULT_LEFT_PANE_SIZE);
      }
    };

    // Set initial value
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Event handlers
  const handleSplitPaneSizeChange = useCallback((newSize: number) => {
    setLeftPaneSize(newSize);
    if (newSize > 0) {
      setIsSidebarCollapsed(false);
    }
  }, []);

  const handleCollapseToggle = useCallback(() => {
    if (leftPaneSize <= COLLAPSE_THRESHOLD) {
      // If panel is small, expand it to appropriate default size
      const defaultSize = isMobile
        ? DEFAULT_MOBILE_PANE_SIZE
        : DEFAULT_LEFT_PANE_SIZE;
      setLeftPaneSize(defaultSize);
      setIsSidebarCollapsed(false);
    } else {
      // If panel is large, collapse it
      setLeftPaneSize(0);
      setIsSidebarCollapsed(true);
    }
  }, [leftPaneSize, isMobile]);

  const handleOpenAuthModal = useCallback(() => {
    setShowAuthModal(true);
  }, []);

  const handleOpenExportModal = useCallback(() => {
    setShowExportModal(true);
  }, []);

  const handleOpenAboutModal = useCallback(() => {
    setShowAboutModal(true);
  }, []);

  const handleOpenImportModal = useCallback(() => {
    setShowImportModal(true);
  }, []);

  const handleOpenNewSampleModal = useCallback(() => {
    setShowNewSampleModal(true);
  }, []);

  const handleLoadSample = useCallback(async () => {
    // TODO: Use the sample loader service and API
    const [content, config] = await Promise.all([
      fetch("/samples/basic/content.md").then((r) => r.text()),
      fetch("/samples/basic/config.json").then((r) => r.json()),
    ]);
    onChange(content);
    setPresentationConfig(config);
  }, [onChange, setPresentationConfig]);

  const handleNewPresentation = useCallback(() => {
    onChange("");
    setPresentationConfig(DEFAULT_PRESENTATION_CONFIG);
  }, [onChange, setPresentationConfig]);

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
    [onChange, setPresentationConfig]
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
    [onChange, setPresentationConfig]
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
            priority
          />
          <Link
            href="/"
            className="text-sm sm:text-lg md:text-2xl font-bold text-foreground hover:text-primary transition-colors cursor-pointer"
          >
            Mostage Editor
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <button
            onClick={handleOpenNewSampleModal}
            className="inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 border border-primary rounded-md transition-colors"
            title="New presentation"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New</span>
          </button>

          <div className="w-px h-6 bg-input mx-1" />

          <button
            onClick={handleOpenImportModal}
            className="inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 text-sm font-medium text-foreground bg-background hover:bg-secondary border border-input rounded-md transition-colors"
            title="Import presentation"
          >
            <Upload className="w-4 h-4" />
            <span className="hidden sm:inline">Import</span>
          </button>
          <button
            onClick={handleOpenExportModal}
            className="inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 text-sm font-medium text-foreground bg-background hover:bg-secondary border border-input rounded-md transition-colors"
            title="Export presentation"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </button>

          <div className="w-px h-6 bg-input mx-1" />

          <button
            onClick={handleOpenAboutModal}
            className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 text-sm font-medium text-card-foreground bg-card border border-input rounded-sm hover:bg-secondary cursor-pointer focus:outline-none transition-colors"
            title="About Mostage Editor"
          >
            <Info className="w-4 h-4" />
            <span className="hidden sm:inline">About</span>
          </button>
          <ThemeToggle />
          <button
            onClick={handleOpenAuthModal}
            className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 text-sm font-medium text-card-foreground bg-card border border-input rounded-sm hover:bg-secondary cursor-pointer focus:outline-none transition-colors"
            title="Sign In / Sign Up"
          >
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">Sign In</span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderSplitPaneContent = () => {
    if (isMobile) {
      // Mobile Layout: Preview on top, Settings+Editor on bottom
      return (
        <ResizableSplitPane
          controlledSize={isSidebarCollapsed ? 0 : leftPaneSize}
          onSizeChange={handleSplitPaneSizeChange}
          minSize={MIN_PANE_SIZE}
          maxSize={MAX_PANE_SIZE}
          direction="vertical"
          className="h-full"
          collapseControl={{
            isCollapsed: leftPaneSize <= COLLAPSE_THRESHOLD,
            onToggle: handleCollapseToggle,
            pane: "first",
          }}
        >
          {/* Top Pane: Live Preview (Mobile) */}
          <div className="h-full border-b border-gray-200 dark:border-gray-700">
            <ContentPreview markdown={markdown} config={presentationConfig} />
          </div>

          {/* Bottom Pane: Presentation Settings + Content Editor (Mobile) */}
          <div className="relative h-full overflow-y-auto">
            <div className="flex flex-col h-full min-h-0">
              <PresentationSettings
                config={presentationConfig}
                onConfigChange={setPresentationConfig}
              />
              <ContentEditor
                value={markdown}
                onChange={onChange}
                onOpenAuthModal={handleOpenAuthModal}
                onOpenExportModal={handleOpenExportModal}
              />
            </div>
          </div>
        </ResizableSplitPane>
      );
    }

    // Desktop Layout: Settings+Editor on left, Preview on right
    return (
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
          <div className="min-h-[400px] h-full flex-1 flex-shrink-0">
            <ContentEditor
              value={markdown}
              onChange={onChange}
              onOpenAuthModal={handleOpenAuthModal}
              onOpenExportModal={handleOpenExportModal}
            />
          </div>
        </div>

        {/* Right Pane: Live Preview */}
        <div className="h-full">
          <ContentPreview markdown={markdown} config={presentationConfig} />
        </div>
      </ResizableSplitPane>
    );
  };

  const renderEditorOnly = () => (
    <div className="h-full flex flex-col">
      <PresentationSettings
        config={presentationConfig}
        onConfigChange={setPresentationConfig}
      />
      <div className="min-h-[400px] h-full flex-1 flex-shrink-0">
        <ContentEditor
          value={markdown}
          onChange={onChange}
          onOpenAuthModal={handleOpenAuthModal}
          onOpenExportModal={handleOpenExportModal}
        />
      </div>
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

      <NewSampleModal
        isOpen={showNewSampleModal}
        onClose={() => setShowNewSampleModal(false)}
        onNew={handleNewPresentation}
        onSample={handleLoadSample}
        hasExistingContent={markdown.trim().length > 0}
      />

      {/* Mobile Warning */}
      <MobileWarning />
    </div>
  );
};
