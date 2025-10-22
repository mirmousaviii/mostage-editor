// Editor service for managing editor state and operations

export class EditorService {
  static saveToLocalStorage(markdown: string): void {
    try {
      localStorage.setItem("mostage-editor-content", markdown);
    } catch (error) {
      console.error("Failed to save to localStorage:", error);
    }
  }

  static loadFromLocalStorage(): string | null {
    try {
      return localStorage.getItem("mostage-editor-content");
    } catch (error) {
      console.error("Failed to load from localStorage:", error);
      return null;
    }
  }

  static clearLocalStorage(): void {
    try {
      localStorage.removeItem("mostage-editor-content");
    } catch (error) {
      console.error("Failed to clear localStorage:", error);
    }
  }
}
