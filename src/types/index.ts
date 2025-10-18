export interface EditorState {
  markdown: string;
  showEditor: boolean;
  showPreview: boolean;
}

export interface EditorProps {
  markdown: string;
  onChange: (markdown: string) => void;
  showEditor: boolean;
  showPreview: boolean;
  onToggleEditor: () => void;
  onTogglePreview: () => void;
}

export interface ContentEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export interface ContentPreviewProps {
  markdown: string;
  config: PresentationConfig;
}

export interface ToggleButtonProps {
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
  title: string;
}

export interface PresentationConfig {
  theme: "light" | "dark" | "dracula" | "ocean" | "rainbow";
  scale: number;
  loop: boolean;
  keyboard: boolean;
  touch: boolean;
  urlHash: boolean;
  transition: {
    type: "horizontal" | "vertical" | "fade" | "slide";
    duration: number;
    easing: string;
  };
  centerContent: {
    vertical: boolean;
    horizontal: boolean;
  };
  header: {
    enabled: boolean;
    content?: string;
    contentPath?: string;
    position?: "top-left" | "top-center" | "top-right";
    showOnFirstSlide?: boolean;
  };
  footer: {
    enabled: boolean;
    content?: string;
    contentPath?: string;
    position?: "bottom-left" | "bottom-center" | "bottom-right";
    showOnFirstSlide?: boolean;
  };
  plugins: {
    ProgressBar: {
      enabled: boolean;
      position: "top" | "bottom";
      height?: string;
      color?: string;
      backgroundColor?: string;
    };
    SlideNumber: {
      enabled: boolean;
      position: "bottom-right" | "bottom-left" | "bottom-center";
      format?: string;
      color?: string;
      fontSize?: string;
    };
    Controller: {
      enabled: boolean;
      position: "bottom-right" | "bottom-left" | "bottom-center";
      showLabels?: boolean;
      theme?: "light" | "dark";
    };
    Confetti: {
      enabled: boolean;
      particleCount?: number;
      size?: { min: number; max: number };
      duration?: number;
      delay?: number;
      colors?: string[];
    };
  };
}

export interface PresentationToolbarProps {
  config: PresentationConfig;
  onConfigChange: (config: PresentationConfig) => void;
}
