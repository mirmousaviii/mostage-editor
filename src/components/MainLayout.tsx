"use client";

import { EditorProps, PresentationConfig } from "@/types";
import { ContentEditor } from "./ContentEditor";
import { ContentPreview } from "./ContentPreview";
import { PresentationSettings } from "./PresentationSettings";
import { ResizableSplitPane } from "./ResizableSplitPane";
import { ThemeToggle } from "./ThemeToggle";
import { AuthButton } from "./AuthButton";
import { AuthModal } from "./AuthModal";
import { AboutModal } from "./AboutModal";
import { AboutButton } from "./AboutButton";
import { useState, useCallback } from "react";
import Image from "next/image";
import logo from "@/assets/images/logo.svg";
import { FileText } from "lucide-react";

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
          <AboutButton onClick={handleOpenAboutModal} />
          <ThemeToggle />
          <AuthButton />
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
    </div>
  );
};
