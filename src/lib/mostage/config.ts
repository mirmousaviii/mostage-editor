// Mostage configuration and setup

export const MOSTAGE_CONFIG = {
  version: "1.5.12",
  defaultTheme: "light",
  defaultScale: 1.0,
  defaultTransition: {
    type: "horizontal" as const,
    duration: 300,
    easing: "ease-in-out",
  },
  plugins: {
    ProgressBar: {
      enabled: true,
      position: "bottom" as const,
      height: "12px",
      color: "#007acc",
    },
    SlideNumber: {
      enabled: true,
      position: "bottom-right" as const,
      format: "current/total",
    },
    Controller: {
      enabled: true,
      position: "bottom-center" as const,
    },
    Confetti: {
      enabled: true,
      particleCount: 50,
      size: { min: 5, max: 10 },
      duration: 3000,
      delay: 0,
      colors: [
        "#ff6b6b",
        "#4ecdc4",
        "#45b7d1",
        "#96ceb4",
        "#feca57",
        "#ff9ff3",
        "#54a0ff",
      ],
    },
  },
};

export const MOSTAGE_THEMES = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "dracula", label: "Dracula" },
  { value: "ocean", label: "Ocean" },
  { value: "rainbow", label: "Rainbow" },
] as const;
