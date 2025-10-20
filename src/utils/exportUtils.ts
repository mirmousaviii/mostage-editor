// Export utilities for different presentation formats

interface ExportOptions {
  filename?: string;
  theme?: string;
  [key: string]: unknown;
}

/**
 * Export presentation as HTML file
 */
export const exportToHTML = async (
  markdown: string,
  config: Record<string, unknown>,
  options: ExportOptions = {}
): Promise<void> => {
  const { filename = "presentation" } = options;

  // Create HTML content with embedded CSS and JavaScript
  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${filename}</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #f8f9fa;
        }
        .presentation-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        .slide {
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            margin-bottom: 20px;
            padding: 40px;
            min-height: 400px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .slide-content {
            width: 100%;
            text-align: center;
        }
        .slide h1, .slide h2, .slide h3 {
            color: #2c3e50;
            margin-bottom: 20px;
        }
        .slide p {
            color: #555;
            line-height: 1.6;
            font-size: 18px;
        }
        .slide ul, .slide ol {
            text-align: left;
            max-width: 600px;
            margin: 0 auto;
        }
        .slide code {
            background: #f1f3f4;
            padding: 2px 6px;
            border-radius: 4px;
            font-family: 'Monaco', 'Menlo', monospace;
        }
        .slide pre {
            background: #f1f3f4;
            padding: 20px;
            border-radius: 8px;
            overflow-x: auto;
            text-align: left;
        }
        .slide blockquote {
            border-left: 4px solid #3498db;
            padding-left: 20px;
            margin: 20px 0;
            font-style: italic;
            color: #555;
        }
    </style>
</head>
<body>
    <div class="presentation-container">
        ${parseMarkdownToHTML(markdown)}
    </div>
</body>
</html>`;

  // Create and download file
  const blob = new Blob([htmlContent], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

/**
 * Export presentation as PDF (using browser print functionality)
 */
export const exportToPDF = async (
  markdown: string,
  config: Record<string, unknown>,
  options: ExportOptions = {}
): Promise<void> => {
  const { filename = "presentation" } = options;

  // Create a temporary window for PDF generation
  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    throw new Error("Unable to open print window");
  }

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${filename}</title>
    <style>
        @page {
            size: A4;
            margin: 1in;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
        }
        .slide {
            page-break-after: always;
            padding: 20px 0;
            min-height: 9in;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .slide:last-child {
            page-break-after: avoid;
        }
        .slide-content {
            width: 100%;
            text-align: center;
        }
        .slide h1 {
            font-size: 2.5em;
            margin-bottom: 0.5em;
            color: #2c3e50;
        }
        .slide h2 {
            font-size: 2em;
            margin-bottom: 0.5em;
            color: #34495e;
        }
        .slide h3 {
            font-size: 1.5em;
            margin-bottom: 0.5em;
            color: #34495e;
        }
        .slide p {
            font-size: 1.2em;
            margin-bottom: 1em;
        }
        .slide ul, .slide ol {
            text-align: left;
            max-width: 600px;
            margin: 0 auto;
        }
        .slide li {
            margin-bottom: 0.5em;
        }
        .slide code {
            background: #f1f3f4;
            padding: 2px 6px;
            border-radius: 4px;
            font-family: 'Monaco', 'Menlo', monospace;
        }
        .slide pre {
            background: #f1f3f4;
            padding: 20px;
            border-radius: 8px;
            overflow-x: auto;
            text-align: left;
        }
        .slide blockquote {
            border-left: 4px solid #3498db;
            padding-left: 20px;
            margin: 20px 0;
            font-style: italic;
        }
        @media print {
            body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }
        }
    </style>
</head>
<body>
    ${parseMarkdownToHTML(markdown)}
</body>
</html>`;

  printWindow.document.write(htmlContent);
  printWindow.document.close();

  // Wait for content to load, then trigger print
  printWindow.onload = () => {
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };
};

/**
 * Export presentation as Markdown file
 */
export const exportToMarkdown = async (
  markdown: string,
  options: ExportOptions = {}
): Promise<void> => {
  const { filename = "presentation" } = options;

  const blob = new Blob([markdown], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

/**
 * Export presentation as Mostage package (library + content + config)
 */
export const exportToMostage = async (
  markdown: string,
  config: Record<string, unknown>,
  options: ExportOptions = {}
): Promise<void> => {
  const { filename = "presentation" } = options;

  // Create a complete Mostage presentation package
  const mostagePackage = {
    version: "1.0.0",
    type: "mostage-presentation",
    content: markdown,
    config: config,
    metadata: {
      created: new Date().toISOString(),
      title: filename,
      description: "Exported from Mostage Editor",
    },
  };

  const blob = new Blob([JSON.stringify(mostagePackage, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}.mostage.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

/**
 * Export presentation as PowerPoint (PPTX)
 */
export const exportToPPTX = async (
  markdown: string,
  config: Record<string, unknown>,
  _options: ExportOptions = {}
): Promise<void> => {
  // This would require a PPTX generation library like 'pptxgenjs'
  // For now, we'll show a message that this feature requires additional setup
  throw new Error(
    "PowerPoint export requires pptxgenjs library. Please install it first."
  );
};

/**
 * Export presentation as JPG images
 */
export const exportToJPG = async (
  markdown: string,
  config: Record<string, unknown>,
  _options: ExportOptions = {}
): Promise<void> => {
  // This would require html2canvas library
  // For now, we'll show a message that this feature requires additional setup
  throw new Error(
    "JPG export requires html2canvas library. Please install it first."
  );
};

/**
 * Parse markdown content to HTML
 */
function parseMarkdownToHTML(markdown: string): string {
  // Simple markdown parser for basic formatting
  const html = markdown
    // Headers
    .replace(/^### (.*$)/gim, "<h3>$1</h3>")
    .replace(/^## (.*$)/gim, "<h2>$1</h2>")
    .replace(/^# (.*$)/gim, "<h1>$1</h1>")
    // Bold
    .replace(/\*\*(.*)\*\*/gim, "<strong>$1</strong>")
    // Italic
    .replace(/\*(.*)\*/gim, "<em>$1</em>")
    // Code blocks
    .replace(/```([\s\S]*?)```/gim, "<pre><code>$1</code></pre>")
    // Inline code
    .replace(/`([^`]*)`/gim, "<code>$1</code>")
    // Links
    .replace(/\[([^\]]*)\]\(([^)]*)\)/gim, '<a href="$2">$1</a>')
    // Lists
    .replace(/^\* (.*$)/gim, "<li>$1</li>")
    .replace(/^- (.*$)/gim, "<li>$1</li>")
    // Line breaks
    .replace(/\n/gim, "<br>");

  // Wrap each slide in a slide div
  const slides = html
    .split("---")
    .map((slide) => {
      if (slide.trim()) {
        return `<div class="slide"><div class="slide-content">${slide.trim()}</div></div>`;
      }
      return "";
    })
    .filter((slide) => slide);

  return slides.join("");
}
