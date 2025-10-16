"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";

interface ResizableSplitPaneProps {
  children: [React.ReactNode, React.ReactNode];
  defaultSize?: number; // Percentage (0-100)
  minSize?: number; // Minimum percentage
  maxSize?: number; // Maximum percentage
  direction?: "horizontal" | "vertical";
  className?: string;
}

export const ResizableSplitPane: React.FC<ResizableSplitPaneProps> = ({
  children,
  defaultSize = 50,
  minSize = 20,
  maxSize = 80,
  direction = "horizontal",
  className = "",
}) => {
  const [size, setSize] = useState(defaultSize);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const startPosRef = useRef<number>(0);
  const startSizeRef = useRef<number>(0);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setIsDragging(true);
      document.body.classList.add("dragging", "no-select");
      startPosRef.current = direction === "horizontal" ? e.clientX : e.clientY;
      startSizeRef.current = size;
    },
    [size, direction]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;

      const currentPos = direction === "horizontal" ? e.clientX : e.clientY;
      const delta = currentPos - startPosRef.current;
      const containerSize =
        direction === "horizontal"
          ? containerRef.current.offsetWidth
          : containerRef.current.offsetHeight;

      const deltaPercentage = (delta / containerSize) * 100;
      const newSize = Math.max(
        minSize,
        Math.min(maxSize, startSizeRef.current + deltaPercentage)
      );

      setSize(newSize);
    },
    [isDragging, minSize, maxSize, direction]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    document.body.classList.remove("dragging", "no-select");
  }, []);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault();
      setIsDragging(true);
      document.body.classList.add("dragging", "no-select");
      const touch = e.touches[0];
      startPosRef.current =
        direction === "horizontal" ? touch.clientX : touch.clientY;
      startSizeRef.current = size;
    },
    [size, direction]
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDragging || !containerRef.current) return;

      e.preventDefault();
      const touch = e.touches[0];
      const currentPos =
        direction === "horizontal" ? touch.clientX : touch.clientY;
      const delta = currentPos - startPosRef.current;
      const containerSize =
        direction === "horizontal"
          ? containerRef.current.offsetWidth
          : containerRef.current.offsetHeight;

      const deltaPercentage = (delta / containerSize) * 100;
      const newSize = Math.max(
        minSize,
        Math.min(maxSize, startSizeRef.current + deltaPercentage)
      );

      setSize(newSize);
    },
    [isDragging, minSize, maxSize, direction]
  );

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
    document.body.classList.remove("dragging", "no-select");
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("touchmove", handleTouchMove, {
        passive: false,
      });
      document.addEventListener("touchend", handleTouchEnd);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        document.removeEventListener("touchmove", handleTouchMove);
        document.removeEventListener("touchend", handleTouchEnd);
      };
    }
  }, [
    isDragging,
    handleMouseMove,
    handleMouseUp,
    handleTouchMove,
    handleTouchEnd,
  ]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      document.body.classList.remove("dragging", "no-select");
    };
  }, []);

  const isHorizontal = direction === "horizontal";
  const firstPaneSize = size;
  const secondPaneSize = 100 - size;

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
          [isHorizontal ? "width" : "height"]: `${firstPaneSize}%`,
        }}
      >
        {children[0]}
      </div>

      {/* Resizer */}
      <div
        className={`
          relative flex items-center justify-center
          ${isHorizontal ? "w-1 h-full" : "h-1 w-full"}
          ${isDragging ? "bg-blue-500" : "bg-gray-300 dark:bg-gray-600"}
          hover:bg-blue-400 dark:hover:bg-blue-500
          cursor-${isHorizontal ? "col-resize" : "row-resize"}
          transition-colors duration-200
          group
        `}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        {/* Drag Handle */}
        <div
          className={`
            absolute inset-0 flex items-center justify-center
            ${isHorizontal ? "w-3 h-8" : "h-3 w-8"}
            -m-1 rounded
            bg-gray-400 dark:bg-gray-500
            group-hover:bg-blue-500 dark:group-hover:bg-blue-400
            transition-colors duration-200
            ${isDragging ? "bg-blue-600 dark:bg-blue-500" : ""}
          `}
        >
          {/* Dots indicator */}
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
        </div>
      </div>

      {/* Second Pane */}
      <div
        className={`${isHorizontal ? "h-full" : "w-full"} overflow-hidden`}
        style={{
          [isHorizontal ? "width" : "height"]: `${secondPaneSize}%`,
        }}
      >
        {children[1]}
      </div>
    </div>
  );
};
