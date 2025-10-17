"use client";

import { PresentationToolbarProps, PresentationConfig } from "@/types";
import { useState } from "react";

export const PresentationToolbar: React.FC<PresentationToolbarProps> = ({
  config,
  onConfigChange,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<"general" | "plugins">("general");

  const handleThemeChange = (theme: typeof config.theme) => {
    onConfigChange({
      ...config,
      theme,
    });
  };

  const handleScaleChange = (scale: number) => {
    onConfigChange({
      ...config,
      scale,
    });
  };

  const handleBooleanChange = (
    key: keyof PresentationConfig,
    value: boolean
  ) => {
    onConfigChange({
      ...config,
      [key]: value,
    });
  };

  const handleTransitionChange = (
    key: keyof typeof config.transition,
    value: string | number
  ) => {
    onConfigChange({
      ...config,
      transition: {
        ...config.transition,
        [key]: value,
      },
    });
  };

  const handleCenterContentChange = (
    key: keyof typeof config.centerContent,
    value: boolean
  ) => {
    onConfigChange({
      ...config,
      centerContent: {
        ...config.centerContent,
        [key]: value,
      },
    });
  };

  const handlePluginToggle = (pluginName: keyof typeof config.plugins) => {
    onConfigChange({
      ...config,
      plugins: {
        ...config.plugins,
        [pluginName]: {
          ...config.plugins[pluginName],
          enabled: !config.plugins[pluginName].enabled,
        },
      },
    });
  };

  const handlePluginConfigChange = (
    pluginName: keyof typeof config.plugins,
    key: string,
    value: string | number | boolean
  ) => {
    onConfigChange({
      ...config,
      plugins: {
        ...config.plugins,
        [pluginName]: {
          ...config.plugins[pluginName],
          [key]: value,
        },
      },
    });
  };

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 bg-slate-50 dark:bg-slate-900">
      {/* Toolbar Header */}
      <div className="flex items-center justify-between p-3">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Presentation Settings
        </h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          title={isExpanded ? "Collapse settings" : "Expand settings"}
        >
          <svg
            className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform ${
              isExpanded ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>

      {/* Expanded Settings */}
      {isExpanded && (
        <div className="px-3 pb-3">
          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200 dark:border-gray-600 mb-4">
            <button
              onClick={() => setActiveTab("general")}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "general"
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              General
            </button>
            <button
              onClick={() => setActiveTab("plugins")}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "plugins"
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              Plugins
            </button>
          </div>

          {/* Tab Content */}
          <div className="max-h-96 overflow-y-auto px-5 pb-5">
            {activeTab === "general" && (
              <div className="space-y-5">
                {/* Basic Settings */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  {/* Theme Selection */}
                  <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-white dark:bg-slate-800 shadow-sm">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Theme
                    </label>
                    <select
                      value={config.theme}
                      onChange={(e) =>
                        handleThemeChange(e.target.value as typeof config.theme)
                      }
                      className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="dracula">Dracula</option>
                      <option value="ocean">Ocean</option>
                      <option value="rainbow">Rainbow</option>
                    </select>
                  </div>

                  {/* Scale Slider */}
                  <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-white dark:bg-slate-800 shadow-sm">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Scale: {config.scale}x
                    </label>
                    <input
                      type="range"
                      min="0.5"
                      max="1.5"
                      step="0.1"
                      value={config.scale}
                      onChange={(e) =>
                        handleScaleChange(parseFloat(e.target.value))
                      }
                      className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                    />
                  </div>
                </div>

                {/* Navigation Settings */}
                <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-white dark:bg-slate-800 shadow-sm">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Navigation
                  </label>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <label className="flex items-center p-3 bg-slate-50 dark:bg-slate-700 rounded-lg border border-gray-200 dark:border-gray-600 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors">
                      <input
                        type="checkbox"
                        checked={config.loop}
                        onChange={(e) =>
                          handleBooleanChange("loop", e.target.checked)
                        }
                        className="sr-only"
                      />
                      <div
                        className={`w-5 h-5 rounded border-2 mr-3 flex items-center justify-center transition-colors ${
                          config.loop
                            ? "bg-blue-500 border-blue-500"
                            : "border-gray-300 dark:border-gray-500"
                        }`}
                      >
                        {config.loop && (
                          <svg
                            className="w-3 h-3 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Loop
                      </span>
                    </label>

                    <label className="flex items-center p-3 bg-slate-50 dark:bg-slate-700 rounded-lg border border-gray-200 dark:border-gray-600 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors">
                      <input
                        type="checkbox"
                        checked={config.keyboard}
                        onChange={(e) =>
                          handleBooleanChange("keyboard", e.target.checked)
                        }
                        className="sr-only"
                      />
                      <div
                        className={`w-5 h-5 rounded border-2 mr-3 flex items-center justify-center transition-colors ${
                          config.keyboard
                            ? "bg-blue-500 border-blue-500"
                            : "border-gray-300 dark:border-gray-500"
                        }`}
                      >
                        {config.keyboard && (
                          <svg
                            className="w-3 h-3 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Keyboard
                      </span>
                    </label>

                    <label className="flex items-center p-3 bg-slate-50 dark:bg-slate-700 rounded-lg border border-gray-200 dark:border-gray-600 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors">
                      <input
                        type="checkbox"
                        checked={config.touch}
                        onChange={(e) =>
                          handleBooleanChange("touch", e.target.checked)
                        }
                        className="sr-only"
                      />
                      <div
                        className={`w-5 h-5 rounded border-2 mr-3 flex items-center justify-center transition-colors ${
                          config.touch
                            ? "bg-blue-500 border-blue-500"
                            : "border-gray-300 dark:border-gray-500"
                        }`}
                      >
                        {config.touch && (
                          <svg
                            className="w-3 h-3 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Touch
                      </span>
                    </label>

                    <label className="flex items-center p-3 bg-slate-50 dark:bg-slate-700 rounded-lg border border-gray-200 dark:border-gray-600 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors">
                      <input
                        type="checkbox"
                        checked={config.urlHash}
                        onChange={(e) =>
                          handleBooleanChange("urlHash", e.target.checked)
                        }
                        className="sr-only"
                      />
                      <div
                        className={`w-5 h-5 rounded border-2 mr-3 flex items-center justify-center transition-colors ${
                          config.urlHash
                            ? "bg-blue-500 border-blue-500"
                            : "border-gray-300 dark:border-gray-500"
                        }`}
                      >
                        {config.urlHash && (
                          <svg
                            className="w-3 h-3 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        URL Hash
                      </span>
                    </label>
                  </div>
                </div>

                {/* Transition Settings */}
                <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-white dark:bg-slate-800 shadow-sm">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Transition
                  </label>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                    <div>
                      <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">
                        Type
                      </label>
                      <select
                        value={config.transition.type}
                        onChange={(e) =>
                          handleTransitionChange("type", e.target.value)
                        }
                        className="w-full text-sm border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300"
                      >
                        <option value="horizontal">Horizontal</option>
                        <option value="vertical">Vertical</option>
                        <option value="fade">Fade</option>
                        <option value="slide">Slide</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">
                        Duration: {config.transition.duration}ms
                      </label>
                      <input
                        type="range"
                        min="100"
                        max="1000"
                        step="50"
                        value={config.transition.duration}
                        onChange={(e) =>
                          handleTransitionChange(
                            "duration",
                            parseInt(e.target.value)
                          )
                        }
                        className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">
                        Easing
                      </label>
                      <select
                        value={config.transition.easing}
                        onChange={(e) =>
                          handleTransitionChange("easing", e.target.value)
                        }
                        className="w-full text-sm border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300"
                      >
                        <option value="ease">Ease</option>
                        <option value="ease-in">Ease In</option>
                        <option value="ease-out">Ease Out</option>
                        <option value="ease-in-out">Ease In Out</option>
                        <option value="linear">Linear</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Center Content Settings */}
                <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-white dark:bg-slate-800 shadow-sm">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Center Content
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <label className="flex items-center p-3 bg-slate-50 dark:bg-slate-700 rounded-lg border border-gray-200 dark:border-gray-600 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors">
                      <input
                        type="checkbox"
                        checked={config.centerContent.vertical}
                        onChange={(e) =>
                          handleCenterContentChange(
                            "vertical",
                            e.target.checked
                          )
                        }
                        className="sr-only"
                      />
                      <div
                        className={`w-5 h-5 rounded border-2 mr-3 flex items-center justify-center transition-colors ${
                          config.centerContent.vertical
                            ? "bg-blue-500 border-blue-500"
                            : "border-gray-300 dark:border-gray-500"
                        }`}
                      >
                        {config.centerContent.vertical && (
                          <svg
                            className="w-3 h-3 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Vertical
                      </span>
                    </label>

                    <label className="flex items-center p-3 bg-slate-50 dark:bg-slate-700 rounded-lg border border-gray-200 dark:border-gray-600 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors">
                      <input
                        type="checkbox"
                        checked={config.centerContent.horizontal}
                        onChange={(e) =>
                          handleCenterContentChange(
                            "horizontal",
                            e.target.checked
                          )
                        }
                        className="sr-only"
                      />
                      <div
                        className={`w-5 h-5 rounded border-2 mr-3 flex items-center justify-center transition-colors ${
                          config.centerContent.horizontal
                            ? "bg-blue-500 border-blue-500"
                            : "border-gray-300 dark:border-gray-500"
                        }`}
                      >
                        {config.centerContent.horizontal && (
                          <svg
                            className="w-3 h-3 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Horizontal
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "plugins" && (
              <div className="space-y-5">
                {/* Progress Bar */}
                <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-white dark:bg-slate-800 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config.plugins.ProgressBar.enabled}
                        onChange={() => handlePluginToggle("ProgressBar")}
                        className="sr-only"
                      />
                      <div
                        className={`w-5 h-5 rounded border-2 mr-3 flex items-center justify-center transition-colors ${
                          config.plugins.ProgressBar.enabled
                            ? "bg-blue-500 border-blue-500"
                            : "border-gray-300 dark:border-gray-500"
                        }`}
                      >
                        {config.plugins.ProgressBar.enabled && (
                          <svg
                            className="w-3 h-3 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Progress Bar
                      </span>
                    </label>
                    {config.plugins.ProgressBar.enabled && (
                      <select
                        value={config.plugins.ProgressBar.position}
                        onChange={(e) =>
                          handlePluginConfigChange(
                            "ProgressBar",
                            "position",
                            e.target.value
                          )
                        }
                        className="text-sm border border-gray-300 dark:border-gray-600 rounded px-3 py-1 bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300"
                      >
                        <option value="top">Top</option>
                        <option value="bottom">Bottom</option>
                      </select>
                    )}
                  </div>
                  {config.plugins.ProgressBar.enabled && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">
                          Height
                        </label>
                        <input
                          type="text"
                          value={config.plugins.ProgressBar.height}
                          onChange={(e) =>
                            handlePluginConfigChange(
                              "ProgressBar",
                              "height",
                              e.target.value
                            )
                          }
                          className="w-full text-sm border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300"
                          placeholder="12px"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">
                          Color
                        </label>
                        <input
                          type="color"
                          value={config.plugins.ProgressBar.color}
                          onChange={(e) =>
                            handlePluginConfigChange(
                              "ProgressBar",
                              "color",
                              e.target.value
                            )
                          }
                          className="w-full h-10 border border-gray-300 dark:border-gray-600 rounded"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Slide Number */}
                <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-white dark:bg-slate-800 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config.plugins.SlideNumber.enabled}
                        onChange={() => handlePluginToggle("SlideNumber")}
                        className="sr-only"
                      />
                      <div
                        className={`w-5 h-5 rounded border-2 mr-3 flex items-center justify-center transition-colors ${
                          config.plugins.SlideNumber.enabled
                            ? "bg-blue-500 border-blue-500"
                            : "border-gray-300 dark:border-gray-500"
                        }`}
                      >
                        {config.plugins.SlideNumber.enabled && (
                          <svg
                            className="w-3 h-3 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Slide Number
                      </span>
                    </label>
                    {config.plugins.SlideNumber.enabled && (
                      <select
                        value={config.plugins.SlideNumber.position}
                        onChange={(e) =>
                          handlePluginConfigChange(
                            "SlideNumber",
                            "position",
                            e.target.value
                          )
                        }
                        className="text-sm border border-gray-300 dark:border-gray-600 rounded px-3 py-1 bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300"
                      >
                        <option value="bottom-left">Bottom Left</option>
                        <option value="bottom-right">Bottom Right</option>
                        <option value="bottom-center">Bottom Center</option>
                      </select>
                    )}
                  </div>
                  {config.plugins.SlideNumber.enabled && (
                    <div>
                      <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">
                        Format
                      </label>
                      <input
                        type="text"
                        value={config.plugins.SlideNumber.format}
                        onChange={(e) =>
                          handlePluginConfigChange(
                            "SlideNumber",
                            "format",
                            e.target.value
                          )
                        }
                        className="w-full text-sm border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300"
                        placeholder="current/total"
                      />
                    </div>
                  )}
                </div>

                {/* Controller */}
                <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-white dark:bg-slate-800 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config.plugins.Controller.enabled}
                        onChange={() => handlePluginToggle("Controller")}
                        className="sr-only"
                      />
                      <div
                        className={`w-5 h-5 rounded border-2 mr-3 flex items-center justify-center transition-colors ${
                          config.plugins.Controller.enabled
                            ? "bg-blue-500 border-blue-500"
                            : "border-gray-300 dark:border-gray-500"
                        }`}
                      >
                        {config.plugins.Controller.enabled && (
                          <svg
                            className="w-3 h-3 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Controller
                      </span>
                    </label>
                    {config.plugins.Controller.enabled && (
                      <select
                        value={config.plugins.Controller.position}
                        onChange={(e) =>
                          handlePluginConfigChange(
                            "Controller",
                            "position",
                            e.target.value
                          )
                        }
                        className="text-sm border border-gray-300 dark:border-gray-600 rounded px-3 py-1 bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300"
                      >
                        <option value="bottom-left">Bottom Left</option>
                        <option value="bottom-right">Bottom Right</option>
                        <option value="bottom-center">Bottom Center</option>
                      </select>
                    )}
                  </div>
                </div>

                {/* Confetti */}
                <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-white dark:bg-slate-800 shadow-sm">
                  <div className="flex items-center mb-3">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config.plugins.Confetti.enabled}
                        onChange={() => handlePluginToggle("Confetti")}
                        className="sr-only"
                      />
                      <div
                        className={`w-5 h-5 rounded border-2 mr-3 flex items-center justify-center transition-colors ${
                          config.plugins.Confetti.enabled
                            ? "bg-blue-500 border-blue-500"
                            : "border-gray-300 dark:border-gray-500"
                        }`}
                      >
                        {config.plugins.Confetti.enabled && (
                          <svg
                            className="w-3 h-3 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Confetti
                      </span>
                    </label>
                  </div>
                  {config.plugins.Confetti.enabled && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">
                          Particles: {config.plugins.Confetti.particleCount}
                        </label>
                        <input
                          type="range"
                          min="10"
                          max="100"
                          step="10"
                          value={config.plugins.Confetti.particleCount}
                          onChange={(e) =>
                            handlePluginConfigChange(
                              "Confetti",
                              "particleCount",
                              parseInt(e.target.value)
                            )
                          }
                          className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">
                          Duration: {config.plugins.Confetti.duration}ms
                        </label>
                        <input
                          type="range"
                          min="1000"
                          max="5000"
                          step="500"
                          value={config.plugins.Confetti.duration}
                          onChange={(e) =>
                            handlePluginConfigChange(
                              "Confetti",
                              "duration",
                              parseInt(e.target.value)
                            )
                          }
                          className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
