"use client";

import { MainLayout } from "@/shared/components/layout";
import { Loading } from "@/shared/components/ui";
import { useEditor } from "@/features/editor/hooks/useEditor";
import { useState, useEffect } from "react";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const {
    markdown,
    showEditor,
    showPreview,
    updateMarkdown,
    editingSlide,
    updateEditingSlide,
  } = useEditor();

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="h-screen w-full bg-gray-50 dark:bg-gray-900">
      <MainLayout
        markdown={markdown}
        onChange={updateMarkdown}
        showEditor={showEditor}
        showPreview={showPreview}
        editingSlide={editingSlide}
        updateEditingSlide={updateEditingSlide}
      />
    </div>
  );
}
