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
}

export interface ContentEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onOpenAuthModal?: () => void;
  onOpenExportModal?: () => void;
}
