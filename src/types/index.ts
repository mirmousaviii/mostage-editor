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

export interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export interface MarkdownPreviewProps {
  markdown: string;
}

export interface ToggleButtonProps {
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
  title: string;
}
