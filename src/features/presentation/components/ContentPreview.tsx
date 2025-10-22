"use client";

import {
  ContentPreviewProps,
  PresentationConfig,
} from "../types/presentation.types";
import { useEffect, useRef, useState, useCallback } from "react";
import { Mostage } from "mostage";
import { Maximize } from "lucide-react";

export const ContentPreview: React.FC<ContentPreviewProps> = ({
  markdown,
  config,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mostageRef = useRef<Mostage | null>(null);
  const [slideCount, setSlideCount] = useState<number>(0);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastConfigRef = useRef<PresentationConfig | null>(null);

  const updateMostage = useCallback(
    (content: string, presentationConfig: PresentationConfig) => {
      if (containerRef.current) {
        // Use default content if empty
        const displayContent =
          content.trim() ||
          `
## No content

<br/>

#### Add content manually or generate with AI`;

        // If Mostage instance exists, update content
        if (mostageRef.current) {
          mostageRef.current.updateContent(displayContent).then(() => {
            if (mostageRef.current) {
              setSlideCount(mostageRef.current.getTotalSlides());
            }
          });
        } else {
          // Create new Mostage instance only if it doesn't exist
          mostageRef.current = new Mostage({
            element: containerRef.current,
            content: displayContent,
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
      }
    },
    []
  );

  const recreateMostage = useCallback(
    (content: string, presentationConfig: PresentationConfig) => {
      if (containerRef.current) {
        // Clean up existing instance
        if (mostageRef.current) {
          mostageRef.current.destroy();
          mostageRef.current = null;
        }

        // Use default content if empty
        const displayContent =
          content.trim() ||
          `
## No content

<br/>

#### Add content manually or generate with AI`;

        // Create new Mostage instance with updated config
        mostageRef.current = new Mostage({
          element: containerRef.current,
          content: displayContent,
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
          if (mostageRef.current) {
            setSlideCount(mostageRef.current.getTotalSlides());
          }
        });
      }
    },
    []
  );

  // Handle content and config changes with smart logic
  useEffect(() => {
    // Clear previous timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Check if config has changed
    const configChanged =
      JSON.stringify(lastConfigRef.current) !== JSON.stringify(config);
    lastConfigRef.current = config;

    // Set new timeout for debounced update
    debounceTimeoutRef.current = setTimeout(() => {
      if (mostageRef.current) {
        if (configChanged) {
          // If config changed, recreate instance
          recreateMostage(markdown, config);
        } else {
          // If only content changed, update content only
          updateMostage(markdown, config);
        }
      } else {
        // If no instance, create new one
        recreateMostage(markdown, config);
      }
    }, 500); // 500ms debounce

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [markdown, config, updateMostage, recreateMostage]);

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
            className="flex items-center justify-center w-8 h-8 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 cursor-pointer"
            title="Enter fullscreen mode"
          >
            <Maximize className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        <div ref={containerRef} className="h-full w-full" />
      </div>
    </div>
  );
};
