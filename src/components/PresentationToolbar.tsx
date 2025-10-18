"use client";

import { PresentationToolbarProps, PresentationConfig } from "@/types";
import { useState } from "react";
import { ChevronDown, Check } from "lucide-react";

export const PresentationToolbar: React.FC<PresentationToolbarProps> = ({
  config,
  onConfigChange,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "general" | "plugins" | "header-footer"
  >("general");

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

  const handleHeaderChange = (
    key: keyof typeof config.header,
    value: string | boolean
  ) => {
    onConfigChange({
      ...config,
      header: {
        ...config.header,
        [key]: value,
      },
    });
  };

  const handleFooterChange = (
    key: keyof typeof config.footer,
    value: string | boolean
  ) => {
    onConfigChange({
      ...config,
      footer: {
        ...config.footer,
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
      <div
        className="flex items-center justify-between p-3 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
        title={isExpanded ? "Collapse settings" : "Expand settings"}
      >
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Presentation Settings
        </h3>
        <ChevronDown
          className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform ${
            isExpanded ? "rotate-180" : ""
          }`}
        />
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
              onClick={() => setActiveTab("header-footer")}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "header-footer"
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              Header & Footer
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
          <div className="px-5 pb-5">
            {activeTab === "general" && (
              <div className="space-y-5">
                {/* Basic Settings */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  {/* Theme Selection */}
                  <div className="border border-gray-200 dark:border-gray-600 rounded-md p-4 bg-white dark:bg-slate-800 shadow-sm">
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
                  <div className="border border-gray-200 dark:border-gray-600 rounded-md p-4 bg-white dark:bg-slate-800 shadow-sm">
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
                      className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-md appearance-none cursor-pointer slider"
                    />
                  </div>
                </div>

                {/* Navigation Settings */}
                <div className="border border-gray-200 dark:border-gray-600 rounded-md p-4 bg-white dark:bg-slate-800 shadow-sm">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Navigation
                  </label>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <label className="flex items-center p-3 bg-slate-50 dark:bg-slate-700 rounded-md border border-gray-200 dark:border-gray-600 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
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
                          <Check className="w-3 h-3 text-white" />
                        )}
                      </div>
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Loop
                      </span>
                    </label>

                    <label className="flex items-center p-3 bg-slate-50 dark:bg-slate-700 rounded-md border border-gray-200 dark:border-gray-600 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
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
                          <Check className="w-3 h-3 text-white" />
                        )}
                      </div>
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Keyboard
                      </span>
                    </label>

                    <label className="flex items-center p-3 bg-slate-50 dark:bg-slate-700 rounded-md border border-gray-200 dark:border-gray-600 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
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
                          <Check className="w-3 h-3 text-white" />
                        )}
                      </div>
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Touch
                      </span>
                    </label>

                    <label className="flex items-center p-3 bg-slate-50 dark:bg-slate-700 rounded-md border border-gray-200 dark:border-gray-600 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
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
                          <Check className="w-3 h-3 text-white" />
                        )}
                      </div>
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        URL Hash
                      </span>
                    </label>
                  </div>
                </div>

                {/* Transition Settings */}
                <div className="border border-gray-200 dark:border-gray-600 rounded-md p-4 bg-white dark:bg-slate-800 shadow-sm">
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
                        className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-md appearance-none cursor-pointer slider"
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
                <div className="border border-gray-200 dark:border-gray-600 rounded-md p-4 bg-white dark:bg-slate-800 shadow-sm">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Center Content
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <label className="flex items-center p-3 bg-slate-50 dark:bg-slate-700 rounded-md border border-gray-200 dark:border-gray-600 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
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
                          <Check className="w-3 h-3 text-white" />
                        )}
                      </div>
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Vertical
                      </span>
                    </label>

                    <label className="flex items-center p-3 bg-slate-50 dark:bg-slate-700 rounded-md border border-gray-200 dark:border-gray-600 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
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
                          <Check className="w-3 h-3 text-white" />
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
                <div className="border border-gray-200 dark:border-gray-600 rounded-md p-4 bg-white dark:bg-slate-800 shadow-sm">
                  <div className="flex items-center justify-between">
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
                          <Check className="w-3 h-3 text-white" />
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
                <div className="border border-gray-200 dark:border-gray-600 rounded-md p-4 bg-white dark:bg-slate-800 shadow-sm">
                  <div className="flex items-center justify-between">
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
                          <Check className="w-3 h-3 text-white" />
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
                <div className="border border-gray-200 dark:border-gray-600 rounded-md p-4 bg-white dark:bg-slate-800 shadow-sm">
                  <div className="flex items-center justify-between">
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
                          <Check className="w-3 h-3 text-white" />
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
                <div className="border border-gray-200 dark:border-gray-600 rounded-md p-4 bg-white dark:bg-slate-800 shadow-sm">
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
                          <Check className="w-3 h-3 text-white" />
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
                          className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-md appearance-none cursor-pointer slider"
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
                          className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-md appearance-none cursor-pointer slider"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "header-footer" && (
              <div className="space-y-5">
                {/* Header Settings */}
                <div className="border border-gray-200 dark:border-gray-600 rounded-md p-4 bg-white dark:bg-slate-800 shadow-sm">
                  <div className="flex items-center">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config.header.enabled}
                        onChange={() =>
                          handleHeaderChange("enabled", !config.header.enabled)
                        }
                        className="sr-only"
                      />
                      <div
                        className={`w-5 h-5 rounded border-2 mr-3 flex items-center justify-center transition-colors ${
                          config.header.enabled
                            ? "bg-blue-500 border-blue-500"
                            : "border-gray-300 dark:border-gray-500"
                        }`}
                      >
                        {config.header.enabled && (
                          <Check className="w-3 h-3 text-white" />
                        )}
                      </div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Header
                      </span>
                    </label>
                  </div>
                  {config.header.enabled && (
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block">
                          Content
                        </label>
                        <textarea
                          value={config.header.content}
                          onChange={(e) =>
                            handleHeaderChange("content", e.target.value)
                          }
                          className="w-full text-sm border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter header content (Markdown, HTML, or Text)"
                          rows={3}
                        />
                      </div>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <label className="flex items-center p-3 bg-slate-50 dark:bg-slate-700 rounded-md border border-gray-200 dark:border-gray-600 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                          <input
                            type="checkbox"
                            checked={config.header.showOnFirstSlide}
                            onChange={(e) =>
                              handleHeaderChange(
                                "showOnFirstSlide",
                                e.target.checked
                              )
                            }
                            className="sr-only"
                          />
                          <div
                            className={`w-5 h-5 rounded border-2 mr-3 flex items-center justify-center transition-colors ${
                              config.header.showOnFirstSlide
                                ? "bg-blue-500 border-blue-500"
                                : "border-gray-300 dark:border-gray-500"
                            }`}
                          >
                            {config.header.showOnFirstSlide && (
                              <Check className="w-3 h-3 text-white" />
                            )}
                          </div>
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            Show on First Slide
                          </span>
                        </label>
                        <div>
                          <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block">
                            Position
                          </label>
                          <select
                            value={config.header.position}
                            onChange={(e) =>
                              handleHeaderChange("position", e.target.value)
                            }
                            className="w-full text-sm border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="top-left">Top Left</option>
                            <option value="top-center">Top Center</option>
                            <option value="top-right">Top Right</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Settings */}
                <div className="border border-gray-200 dark:border-gray-600 rounded-md p-4 bg-white dark:bg-slate-800 shadow-sm">
                  <div className="flex items-center">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config.footer.enabled}
                        onChange={() =>
                          handleFooterChange("enabled", !config.footer.enabled)
                        }
                        className="sr-only"
                      />
                      <div
                        className={`w-5 h-5 rounded border-2 mr-3 flex items-center justify-center transition-colors ${
                          config.footer.enabled
                            ? "bg-blue-500 border-blue-500"
                            : "border-gray-300 dark:border-gray-500"
                        }`}
                      >
                        {config.footer.enabled && (
                          <Check className="w-3 h-3 text-white" />
                        )}
                      </div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Footer
                      </span>
                    </label>
                  </div>
                  {config.footer.enabled && (
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block">
                          Content
                        </label>
                        <textarea
                          value={config.footer.content}
                          onChange={(e) =>
                            handleFooterChange("content", e.target.value)
                          }
                          className="w-full text-sm border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter footer content (Markdown, HTML, or Text)"
                          rows={3}
                        />
                      </div>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <label className="flex items-center p-3 bg-slate-50 dark:bg-slate-700 rounded-md border border-gray-200 dark:border-gray-600 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                          <input
                            type="checkbox"
                            checked={config.footer.showOnFirstSlide}
                            onChange={(e) =>
                              handleFooterChange(
                                "showOnFirstSlide",
                                e.target.checked
                              )
                            }
                            className="sr-only"
                          />
                          <div
                            className={`w-5 h-5 rounded border-2 mr-3 flex items-center justify-center transition-colors ${
                              config.footer.showOnFirstSlide
                                ? "bg-blue-500 border-blue-500"
                                : "border-gray-300 dark:border-gray-500"
                            }`}
                          >
                            {config.footer.showOnFirstSlide && (
                              <Check className="w-3 h-3 text-white" />
                            )}
                          </div>
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            Show on First Slide
                          </span>
                        </label>
                        <div>
                          <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block">
                            Position
                          </label>
                          <select
                            value={config.footer.position}
                            onChange={(e) =>
                              handleFooterChange("position", e.target.value)
                            }
                            className="w-full text-sm border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="bottom-left">Bottom Left</option>
                            <option value="bottom-center">Bottom Center</option>
                            <option value="bottom-right">Bottom Right</option>
                          </select>
                        </div>
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
