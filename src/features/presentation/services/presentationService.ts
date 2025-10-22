// Presentation service for managing presentation configuration and operations

export class PresentationService {
  static saveConfigToLocalStorage(config: Record<string, unknown>): void {
    try {
      localStorage.setItem(
        "mostage-presentation-config",
        JSON.stringify(config)
      );
    } catch (error) {
      console.error(
        "Failed to save presentation config to localStorage:",
        error
      );
    }
  }

  static loadConfigFromLocalStorage(): Record<string, unknown> | null {
    try {
      const config = localStorage.getItem("mostage-presentation-config");
      return config ? JSON.parse(config) : null;
    } catch (error) {
      console.error(
        "Failed to load presentation config from localStorage:",
        error
      );
      return null;
    }
  }

  static clearConfigFromLocalStorage(): void {
    try {
      localStorage.removeItem("mostage-presentation-config");
    } catch (error) {
      console.error(
        "Failed to clear presentation config from localStorage:",
        error
      );
    }
  }

  static validateConfig(config: Record<string, unknown>): boolean {
    // Basic validation for presentation config
    return (
      config &&
      typeof config.theme === "string" &&
      typeof config.scale === "number" &&
      typeof config.loop === "boolean"
    );
  }
}
