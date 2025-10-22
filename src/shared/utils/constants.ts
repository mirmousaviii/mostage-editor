// Application constants

export const APP_NAME = "Mostage Editor";
export const APP_VERSION = "1.0.0";
export const APP_DESCRIPTION = "A presentation editor powered by Mostage";

export const DEFAULT_MARKDOWN = `# Welcome to Mostage

### Presentation based on Markdown

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

### Happy presenting with Mostage!`;

export const SUPPORTED_FILE_TYPES = [
  "text/markdown",
  "text/plain",
  "application/json",
  "text/html",
];

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const EXPORT_FORMATS = [
  { value: "html", label: "HTML" },
  { value: "pdf", label: "PDF" },
  { value: "mostage", label: "Mostage" },
  { value: "pptx", label: "PowerPoint" },
  { value: "jpg", label: "Images (JPG)" },
] as const;
