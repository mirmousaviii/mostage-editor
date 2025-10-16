# Mostage Editor

A presentation editor based on Mostage

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main page
├── components/            # React components
│   ├── Editor.tsx         # Main editor component
│   ├── MarkdownEditor.tsx # Markdown text editor
│   ├── MarkdownPreview.tsx # Mostage presentation preview
│   ├── ToggleButton.tsx   # Toggle button component
│   └── index.ts           # Component exports
├── hooks/                 # Custom React hooks
│   └── useEditor.ts       # Editor state management
├── types/                 # TypeScript type definitions
│   └── index.ts           # Type definitions
└── utils/                 # Utility functions
```

## Usage

1. **Split View**: By default, both editor and preview are visible side by side
2. **Editor Only**: Click the editor toggle button to hide the preview
3. **Preview Only**: Click the preview toggle button to hide the editor
4. **Live Updates**: Changes in the editor are immediately reflected in the preview

## Technologies Used

- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Mostage**: Markdown-based presentation framework
- **React Hooks**: State management and side effects

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
