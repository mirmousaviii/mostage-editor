"use client";

import { useState, useCallback } from "react";
import { EditorState } from "../types/editor.types";

const defaultMarkdown = `# Welcome to Mostage

## Presentation Framework

---

## What is Mostage?

#### Presentation framework
###### based on
#### Markdown and HTML


---

## Key Features

- **Markdown Support** - Write in Markdown
- **HTML Support** - Use HTML when needed
- **Web-based** - Runs in any modern browser

---


## Getting Started
- #### Edit this \`content\` file
- #### Modify \`config\` as needed
- #### Run your presentation
- #### Export your presentation

---

<!-- confetti -->

### Happy presenting with Mostage!

#### Get started now [mo.js.org](https://mo.js.org)
`;

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
