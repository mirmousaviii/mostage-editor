"use client";

import { useState, useEffect } from "react";

export const MobileWarning = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        ) || window.innerWidth <= 768;
      setIsMobile(mobile);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (!isMobile || isDismissed) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 text-white flex flex-col items-center justify-center z-[4000] p-6">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold mb-4">Mostage Editor</h1>

        <p className="text-3xl p-10 font-semibold mb-6 text-red-600">
          Mobile not supported yet
        </p>

        <p className="text-gray-300 mb-6 leading-relaxed text-3xl ">
          This application is currently optimized for desktop use only. Please
          access it from a computer for the best experience.
        </p>

        <button
          onClick={() => setIsDismissed(true)}
          className="m-6 p-10 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-4xl"
        >
          Continue Anyway
        </button>
      </div>
    </div>
  );
};
