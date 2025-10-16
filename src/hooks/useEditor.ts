"use client";

import { useState, useCallback } from "react";
import { EditorState } from "@/types";

const defaultMarkdown = `# Welcome to Mostage

## A simple presentation framework based on Markdown

---

## What is Mostage?

Mostage is a modern presentation framework that allows you to create slides using Markdown and HTML.


---

## Key Features

- **Markdown Support** - Write in Markdown
- **HTML Support** - Use HTML when needed
- **Web-based** - Runs in any modern browser

---

## Getting Started
- Edit this content.md file
- Modify config.json as needed
- Add your own assets
- Run your presentation

---

### Happy presenting with Mostage!`;

export const useEditor = () => {
  const [state, setState] = useState<EditorState>({
    markdown: defaultMarkdown,
    showEditor: true,
    showPreview: true,
  });

  const updateMarkdown = useCallback((markdown: string) => {
    setState((prev) => ({ ...prev, markdown }));
  }, []);

  const toggleEditor = useCallback(() => {
    setState((prev) => ({ ...prev, showEditor: !prev.showEditor }));
  }, []);

  const togglePreview = useCallback(() => {
    setState((prev) => ({ ...prev, showPreview: !prev.showPreview }));
  }, []);

  return {
    ...state,
    updateMarkdown,
    toggleEditor,
    togglePreview,
  };
};
