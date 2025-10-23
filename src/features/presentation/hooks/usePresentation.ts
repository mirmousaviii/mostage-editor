"use client";

import { useState, useCallback } from "react";
import { PresentationConfig } from "../types/presentation.types";

const DEFAULT_PRESENTATION_CONFIG: PresentationConfig = {
  theme: "dark",
  scale: 1.0,
  loop: false,
  keyboard: true,
  touch: true,
  urlHash: true,
  transition: {
    type: "horizontal",
    duration: 300,
    easing: "ease-in-out",
  },
  centerContent: {
    vertical: true,
    horizontal: true,
  },
  header: {
    enabled: true,
    content: "# Mostage",
    position: "top-left",
    showOnFirstSlide: false,
  },
  footer: {
    enabled: true,
    content: "#### Presentation framework",
    position: "bottom-left",
    showOnFirstSlide: false,
  },
  plugins: {
    ProgressBar: {
      enabled: true,
      position: "bottom",
      height: "12px",
      color: "#007acc",
    },
    SlideNumber: {
      enabled: true,
      position: "bottom-right",
      format: "current/total",
    },
    Controller: {
      enabled: true,
      position: "bottom-center",
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
  background: [
    {
      imagePath: "https://mo.js.org/demo/images/background.svg",
      size: "cover",
      position: "center",
      repeat: "no-repeat",
      bgColor: "#000000",
      allSlidesExcept: [4, 5],
    },
    {
      imagePath: "https://mo.js.org/demo/images/background-end.svg",
      size: "cover",
      position: "center",
      repeat: "no-repeat",
      bgColor: "#000000",
      allSlides: [5],
    },
  ],
};

export const usePresentation = () => {
  const [config, setConfig] = useState<PresentationConfig>(
    DEFAULT_PRESENTATION_CONFIG
  );

  const updateConfig = useCallback((newConfig: Partial<PresentationConfig>) => {
    setConfig((prev) => ({ ...prev, ...newConfig }));
  }, []);

  const resetConfig = useCallback(() => {
    setConfig(DEFAULT_PRESENTATION_CONFIG);
  }, []);

  return {
    config,
    updateConfig,
    resetConfig,
  };
};
