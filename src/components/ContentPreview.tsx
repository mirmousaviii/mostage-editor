"use client";

import { ContentPreviewProps, PresentationConfig } from "@/types";
import { useEffect, useRef, useState, useCallback } from "react";
import Mostage from "mostage";

export const ContentPreview: React.FC<ContentPreviewProps> = ({
  markdown,
  config,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mostageRef = useRef<Mostage | null>(null);
  const [slideCount, setSlideCount] = useState<number>(0);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const updateMostage = useCallback(
    (content: string, presentationConfig: PresentationConfig) => {
      if (containerRef.current) {
        // Clean up previous instance
        if (mostageRef.current) {
          mostageRef.current.destroy();
        }

        // Create new Mostage instance
        mostageRef.current = new Mostage({
          element: containerRef.current,
          content: content,
          theme: presentationConfig.theme,
          scale: presentationConfig.scale,
          loop: presentationConfig.loop,
          keyboard: presentationConfig.keyboard,
          touch: presentationConfig.touch,
          urlHash: presentationConfig.urlHash,
          transition: presentationConfig.transition,
          centerContent: presentationConfig.centerContent,
          header: presentationConfig.header,
          footer: presentationConfig.footer,
          plugins: presentationConfig.plugins,
        });

        mostageRef.current.start().then(() => {
          // Get slide count after presentation is initialized
          if (mostageRef.current) {
            setSlideCount(mostageRef.current.getTotalSlides());
          }
        });
      }
    },
    []
  );

  useEffect(() => {
    // Clear previous timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Set new timeout for debounced update
    debounceTimeoutRef.current = setTimeout(() => {
      updateMostage(markdown, config);
    }, 500); // 500ms debounce

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [markdown, config, updateMostage]);

  // Handle theme changes without recreating Mostage instance
  useEffect(() => {
    if (mostageRef.current && containerRef.current) {
      // Just update the theme without recreating the instance
      const root = document.documentElement;
      const currentTheme = root.classList.contains("dark") ? "dark" : "light";

      // Apply theme to Mostage container
      if (containerRef.current) {
        containerRef.current.style.colorScheme = currentTheme;
      }
    }
  }, [config.theme]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mostageRef.current) {
        mostageRef.current.destroy();
      }
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  const handleFullscreen = () => {
    if (containerRef.current) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const element = containerRef.current as any;
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
      } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
      }
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Live Preview
        </h3>
        <div className="flex items-center gap-3">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {slideCount > 0 ? `${slideCount} slides` : "Loading..."}
          </div>
          <button
            onClick={handleFullscreen}
            className="flex items-center justify-center w-8 h-8 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
            title="Enter fullscreen mode"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
              />
            </svg>
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        <div ref={containerRef} className="h-full w-full" />
      </div>
    </div>
  );
};
