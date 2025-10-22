export interface ExportOptions {
  filename?: string;
  theme?: string;
  [key: string]: unknown;
}

export interface ExportResult {
  success: boolean;
  error?: string;
  data?: Record<string, unknown>;
}

export interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (format: string) => void;
  onOpenAuthModal: () => void;
}

export type ExportFormat = "html" | "pdf" | "mostage" | "pptx" | "jpg";
