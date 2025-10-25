"use client";

import { useState, useCallback } from "react";
import { EditorState } from "../types/editor.types";

const defaultMarkdown = ``;

export const useEditor = () => {
  const [state, setState] = useState<EditorState>({
    markdown: defaultMarkdown,
    showEditor: true,
    showPreview: true,
  });

  const updateMarkdown = useCallback((markdown: string) => {
    setState((prev) => ({ ...prev, markdown }));
  }, []);

  return {
    ...state,
    updateMarkdown,
  };
};
