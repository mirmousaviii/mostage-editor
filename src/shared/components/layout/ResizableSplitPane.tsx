"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Constants
const COLLAPSE_THRESHOLD = 5; // Percentage threshold for collapse state
const DRAG_CLASSES = ["dragging", "no-select"];

interface ResizableSplitPaneProps {
  children: [React.ReactNode, React.ReactNode];
  defaultSize?: number; // Percentage (0-100)
  minSize?: number; // Minimum percentage
  maxSize?: number; // Maximum percentage
  direction?: "horizontal" | "vertical";
  className?: string;
  controlledSize?: number; // If provided, component becomes controlled
  onSizeChange?: (size: number) => void; // Emits when size changes via drag
  collapseControl?: {
    isCollapsed: boolean;
    onToggle: () => void;
    pane?: "first" | "second";
  };
}

export const ResizableSplitPane: React.FC<ResizableSplitPaneProps> = ({
  children,
  defaultSize = 50,
  minSize = 20,
  maxSize = 80,
  direction = "horizontal",
  className = "",
  controlledSize,
  onSizeChange,
  collapseControl,
}) => {
  // State
  const [size, setSize] = useState(defaultSize);
  const [isDragging, setIsDragging] = useState(false);

  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const startPosRef = useRef<number>(0);
  const startSizeRef = useRef<number>(0);

  // Computed values
  const isHorizontal = direction === "horizontal";
  const isCollapsed = size <= COLLAPSE_THRESHOLD;

  // Utility functions
  const getCurrentPosition = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if ("touches" in e) {
        return isHorizontal ? e.touches[0].clientX : e.touches[0].clientY;
      }
      return isHorizontal ? e.clientX : e.clientY;
    },
    [isHorizontal]
  );

  const getContainerSize = useCallback(() => {
    if (!containerRef.current) return 0;
    return isHorizontal
      ? containerRef.current.offsetWidth
      : containerRef.current.offsetHeight;
  }, [isHorizontal]);

  const calculateNewSize = useCallback(
    (delta: number) => {
      const containerSize = getContainerSize();
      if (!containerSize) return size;

      const deltaPercentage = (delta / containerSize) * 100;
      const rawSize = startSizeRef.current + deltaPercentage;

      // Allow collapsing to 0, but enforce minSize for normal state
      return rawSize <= COLLAPSE_THRESHOLD
        ? 0
        : Math.max(minSize, Math.min(maxSize, rawSize));
    },
    [size, minSize, maxSize, getContainerSize]
  );

  // Event handlers
  const startDrag = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      setIsDragging(true);
      document.body.classList.add(...DRAG_CLASSES);

      const currentPos = getCurrentPosition(
        e as unknown as MouseEvent | TouchEvent
      );
      startPosRef.current = currentPos;
      startSizeRef.current = size;
    },
    [size, getCurrentPosition]
  );

  const handleDrag = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!isDragging || !containerRef.current) return;

      const currentPos = getCurrentPosition(e);
      const delta = currentPos - startPosRef.current;
      const newSize = calculateNewSize(delta);

      setSize(newSize);
      onSizeChange?.(newSize);
    },
    [isDragging, getCurrentPosition, calculateNewSize, onSizeChange]
  );

  const endDrag = useCallback(() => {
    setIsDragging(false);
    document.body.classList.remove(...DRAG_CLASSES);
  }, []);

  // Event listeners management
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => handleDrag(e);
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      handleDrag(e);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", endDrag);
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("touchend", endDrag);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", endDrag);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", endDrag);
    };
  }, [isDragging, handleDrag, endDrag]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      document.body.classList.remove(...DRAG_CLASSES);
    };
  }, []);

  // Sync with controlled size
  useEffect(() => {
    if (typeof controlledSize === "number") {
      const clamped =
        controlledSize === 0
          ? 0
          : Math.max(minSize, Math.min(maxSize, controlledSize));
      setSize(clamped);
    }
  }, [controlledSize, minSize, maxSize]);

  // Render helpers
  const renderDotsIndicator = () => (
    <div
      className={`
      flex gap-0.5
      ${isHorizontal ? "flex-col" : "flex-row"}
    `}
    >
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className={`
            rounded-full bg-white dark:bg-gray-200
            ${isHorizontal ? "w-1 h-1" : "h-1 w-1"}
          `}
        />
      ))}
    </div>
  );

  const renderCollapseButton = () => {
    if (!collapseControl || !isHorizontal) return null;

    return (
      <button
        onClick={(e) => {
          e.stopPropagation();
          collapseControl.onToggle();
        }}
        className={`
          pointer-events-auto absolute z-30
          top-[calc(50%+50px)] -translate-y-1/2
          left-1/2 -translate-x-1/2
          inline-flex items-center justify-center w-3 h-8 rounded
          bg-gray-400 dark:bg-gray-500 text-white
          group-hover:bg-blue-500 dark:group-hover:bg-blue-400
          transition-colors shadow-sm cursor-pointer
        `}
        title={isCollapsed ? "Expand" : "Collapse"}
        aria-label={isCollapsed ? "Expand panel" : "Collapse panel"}
      >
        {isCollapsed ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <ChevronLeft className="w-4 h-4" />
        )}
      </button>
    );
  };

  return (
    <div
      ref={containerRef}
      className={`flex ${
        isHorizontal ? "flex-row" : "flex-col"
      } h-full w-full ${className}`}
    >
      {/* First Pane */}
      <div
        className={`${isHorizontal ? "h-full" : "w-full"} overflow-hidden`}
        style={{
          [isHorizontal ? "width" : "height"]: `${size}%`,
        }}
      >
        {children[0]}
      </div>

      {/* Resizer */}
      <div
        className={`
          relative z-20 flex items-center justify-center
          ${isHorizontal ? "w-2 h-full sm:w-1" : "h-2 w-full sm:h-1"}
          ${isDragging ? "bg-blue-500" : "bg-gray-300 dark:bg-gray-600"}
          hover:bg-blue-400 dark:hover:bg-blue-500
          cursor-${isHorizontal ? "col-resize" : "row-resize"}
          transition-colors duration-200 group
        `}
        onMouseDown={startDrag}
        onTouchStart={startDrag}
        style={{ touchAction: "none" }}
      >
        {/* Drag Handle */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex flex-col items-center justify-center pointer-events-none">
            <div
              className={`
                ${isHorizontal ? "w-3 h-8" : "h-3 w-8"}
                -m-1 rounded flex items-center justify-center
                bg-gray-400 dark:bg-gray-500
                group-hover:bg-blue-500 dark:group-hover:bg-blue-400
                transition-colors duration-200
                ${isDragging ? "bg-blue-600 dark:bg-blue-500" : ""}
              `}
            >
              {renderDotsIndicator()}
            </div>
          </div>
          {renderCollapseButton()}
        </div>
      </div>

      {/* Second Pane */}
      <div
        className={`${isHorizontal ? "h-full" : "w-full"} overflow-hidden`}
        style={{
          [isHorizontal ? "width" : "height"]: `${100 - size}%`,
        }}
      >
        {children[1]}
      </div>
    </div>
  );
};
