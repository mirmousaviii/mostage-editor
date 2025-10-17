"use client";

import { MarkdownPreviewProps } from "@/types";
import { useEffect, useRef, useState, useCallback } from "react";
import Mostage from "mostage";

export const MarkdownPreview: React.FC<MarkdownPreviewProps> = ({
  markdown,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mostageRef = useRef<Mostage | null>(null);
  const [slideCount, setSlideCount] = useState<number>(0);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const updateMostage = useCallback((content: string) => {
    if (containerRef.current) {
      // Clean up previous instance
      if (mostageRef.current) {
        mostageRef.current.destroy();
      }

      // Create new Mostage instance
      mostageRef.current = new Mostage({
        element: containerRef.current,
        content: content,
        theme: "dark",
        scale: 0.8,
        plugins: {
          ProgressBar: { enabled: true, position: "bottom" },
          SlideNumber: { enabled: true, position: "bottom-right" },
          Controller: { enabled: true, position: "bottom-center" },
          Confetti: { enabled: true },
        },
      });

      mostageRef.current.start().then(() => {
        // Get slide count after presentation is initialized
        if (mostageRef.current) {
          setSlideCount(mostageRef.current.getTotalSlides());
        }
      });
    }
  }, []);

  useEffect(() => {
    // Clear previous timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Set new timeout for debounced update
    debounceTimeoutRef.current = setTimeout(() => {
      updateMostage(markdown);
    }, 500); // 500ms debounce

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [markdown, updateMostage]);

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

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Live Preview
        </h3>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {slideCount > 0 ? `${slideCount} slides` : "Loading..."}
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        <div ref={containerRef} className="h-full w-full" />
      </div>
    </div>
  );
};
