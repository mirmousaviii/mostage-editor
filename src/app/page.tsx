"use client";

import { MainLayout } from "@/components";
import { useEditor } from "@/hooks/useEditor";

export default function Home() {
  const {
    markdown,
    showEditor,
    showPreview,
    updateMarkdown,
    toggleEditor,
    togglePreview,
  } = useEditor();

  return (
    <div className="h-screen w-full bg-gray-50 dark:bg-gray-900">
      <MainLayout
        markdown={markdown}
        onChange={updateMarkdown}
        showEditor={showEditor}
        showPreview={showPreview}
        onToggleEditor={toggleEditor}
        onTogglePreview={togglePreview}
      />
    </div>
  );
}
