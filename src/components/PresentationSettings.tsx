"use client";

import { PresentationToolbarProps, PresentationConfig } from "@/types";
import { useState, useRef } from "react";
import {
  ChevronDown,
  Check,
  Download,
  Upload,
  RotateCcw,
  X,
} from "lucide-react";

export const PresentationSettings: React.FC<PresentationToolbarProps> = ({
  config,
  onConfigChange,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "general" | "plugins" | "header-footer"
  >("general");
  const [showImportModal, setShowImportModal] = useState(false);
  const [importError, setImportError] = useState("");
  const [showResetModal, setShowResetModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // Default configuration
  const getDefaultConfig = (): PresentationConfig => ({
    theme: "light",
    scale: 1,
    loop: false,
    keyboard: true,
    touch: true,
    urlHash: true,
    transition: {
      type: "horizontal",
      duration: 300,
      easing: "ease",
    },
    centerContent: {
      vertical: false,
      horizontal: false,
    },
    header: {
      enabled: false,
      content: "",
      position: "top-left",
      showOnFirstSlide: true,
    },
    footer: {
      enabled: false,
      content: "",
      position: "bottom-right",
      showOnFirstSlide: true,
    },
    plugins: {
      ProgressBar: {
        enabled: false,
        position: "top",
        height: "4px",
        color: "#3b82f6",
        backgroundColor: "#f1f5f9",
      },
      SlideNumber: {
        enabled: false,
        position: "bottom-right",
        format: "current/total",
        color: "#64748b",
        fontSize: "14px",
      },
      Controller: {
        enabled: false,
        position: "bottom-right",
        showLabels: true,
        theme: "light",
      },
      Confetti: {
        enabled: false,
        particleCount: 50,
        size: { min: 5, max: 15 },
        duration: 3000,
        delay: 0,
        colors: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"],
      },
    },
  });

  // Export configuration
  const handleExportConfig = () => {
    try {
      const configData = JSON.stringify(config, null, 2);
      const blob = new Blob([configData], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "mostage-config.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting config:", error);
    }
  };

  // Import configuration
  const handleImportConfig = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const importedConfig = JSON.parse(content);

        // Validate the imported config structure
        if (importedConfig && typeof importedConfig === "object") {
          onConfigChange(importedConfig);
          setImportError("");
          setShowImportModal(false);
        } else {
          setImportError("Invalid configuration file format.");
        }
      } catch {
        setImportError(
          "Failed to parse configuration file. Please check the file format."
        );
      }
    };
    reader.readAsText(file);
  };

  // Reset to default
  const handleResetConfig = () => {
    onConfigChange(getDefaultConfig());
    setShowResetModal(false);
  };

  // Open file input
  const handleOpenFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="border-b border-input bg-muted">
      {/* Toolbar Header */}
      <div
        className="flex items-center justify-between p-3 cursor-pointer hover:bg-secondary/50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
        title={isExpanded ? "Collapse settings" : "Expand settings"}
      >
        <h3 className="text-sm font-semibold text-card-foreground">
          Presentation Settings
        </h3>
        <ChevronDown
          className={`w-4 h-4 text-muted-foreground transition-transform ${
            isExpanded ? "rotate-180" : ""
          }`}
        />
      </div>

      {/* Expanded Settings */}
      {isExpanded && (
        <div className="px-3 pb-3">
          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200 dark:border-gray-600">
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
          <div className="p-5 rounded-b-md border border-gray-200 dark:border-gray-600 border-t-0">
            {activeTab === "general" && (
              <div className="space-y-5">
                {/* Basic Settings */}
                <div className="border border-gray-200 dark:border-gray-600 rounded-md p-4 bg-white dark:bg-slate-800 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Basic Settings
                    </span>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <label className="text-sm text-gray-600 dark:text-gray-400">
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
                          className="w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-md appearance-none cursor-pointer slider"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <label className="text-sm text-gray-600 dark:text-gray-400">
                          Theme:
                        </label>
                        <select
                          value={config.theme}
                          onChange={(e) =>
                            handleThemeChange(
                              e.target.value as typeof config.theme
                            )
                          }
                          className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="light">Light</option>
                          <option value="dark">Dark</option>
                          <option value="dracula">Dracula</option>
                          <option value="ocean">Ocean</option>
                          <option value="rainbow">Rainbow</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Navigation Settings */}
                <div className="border border-gray-200 dark:border-gray-600 rounded-md p-4 bg-white dark:bg-slate-800 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Navigation
                    </span>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={config.loop}
                          onChange={(e) =>
                            handleBooleanChange("loop", e.target.checked)
                          }
                          className="sr-only"
                        />
                        <div
                          className={`w-5 h-5 rounded border-2 mr-2 flex items-center justify-center transition-colors ${
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

                      {/* <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={config.keyboard}
                          onChange={(e) =>
                            handleBooleanChange("keyboard", e.target.checked)
                          }
                          className="sr-only"
                        />
                        <div
                          className={`w-5 h-5 rounded border-2 mr-2 flex items-center justify-center transition-colors ${
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
                      </label> */}

                      {/* <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={config.touch}
                          onChange={(e) =>
                            handleBooleanChange("touch", e.target.checked)
                          }
                          className="sr-only"
                        />
                        <div
                          className={`w-5 h-5 rounded border-2 mr-2 flex items-center justify-center transition-colors ${
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
                      </label> */}

                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={config.urlHash}
                          onChange={(e) =>
                            handleBooleanChange("urlHash", e.target.checked)
                          }
                          className="sr-only"
                        />
                        <div
                          className={`w-5 h-5 rounded border-2 mr-2 flex items-center justify-center transition-colors ${
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
                </div>

                {/* Transition Settings */}
                <div className="border border-gray-200 dark:border-gray-600 rounded-md p-4 bg-white dark:bg-slate-800 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Transition
                    </span>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <label className="text-sm text-gray-600 dark:text-gray-400">
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
                          className="w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-md appearance-none cursor-pointer slider"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <label className="text-sm text-gray-600 dark:text-gray-400">
                          Type:
                        </label>
                        <select
                          value={config.transition.type}
                          onChange={(e) =>
                            handleTransitionChange("type", e.target.value)
                          }
                          className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="horizontal">Horizontal</option>
                          <option value="vertical">Vertical</option>
                          <option value="fade">Fade</option>
                          <option value="slide">Slide</option>
                        </select>
                      </div>

                      {/* <div className="flex items-center gap-2">
                        <label className="text-sm text-gray-600 dark:text-gray-400">
                          Easing:
                        </label>
                        <select
                          value={config.transition.easing}
                          onChange={(e) =>
                            handleTransitionChange("easing", e.target.value)
                          }
                          className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="ease">Ease</option>
                          <option value="ease-in">Ease In</option>
                          <option value="ease-out">Ease Out</option>
                          <option value="ease-in-out">Ease In Out</option>
                          <option value="linear">Linear</option>
                        </select>
                      </div> */}
                    </div>
                  </div>
                </div>

                {/* Center Content Settings */}
                <div className="border border-gray-200 dark:border-gray-600 rounded-md p-4 bg-white dark:bg-slate-800 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Center Content
                    </span>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center cursor-pointer">
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
                          className={`w-5 h-5 rounded border-2 mr-2 flex items-center justify-center transition-colors ${
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

                      <label className="flex items-center cursor-pointer">
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
                          className={`w-5 h-5 rounded border-2 mr-2 flex items-center justify-center transition-colors ${
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
              </div>
            )}

            {activeTab === "plugins" && (
              <div className="space-y-5">
                {/* Progress Bar */}
                <div className="border border-gray-200 dark:border-gray-600 rounded-md p-4 bg-white dark:bg-slate-800 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config.plugins.ProgressBar.enabled}
                        onChange={() => handlePluginToggle("ProgressBar")}
                        className="sr-only"
                      />
                      <div
                        className={`w-5 h-5 rounded border-2 mr-2 flex items-center justify-center transition-colors ${
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
                    <div className="flex items-center gap-4">
                      {config.plugins.ProgressBar.enabled && (
                        <div className="flex items-center gap-2">
                          <label className="text-sm text-gray-600 dark:text-gray-400">
                            Position:
                          </label>
                          <select
                            value={config.plugins.ProgressBar.position}
                            onChange={(e) =>
                              handlePluginConfigChange(
                                "ProgressBar",
                                "position",
                                e.target.value
                              )
                            }
                            className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="top">Top</option>
                            <option value="bottom">Bottom</option>
                          </select>
                        </div>
                      )}
                    </div>
                  </div>

                  {config.plugins.ProgressBar.enabled && (
                    <div className="flex items-center gap-4 justify-end">
                      <div className="flex items-center gap-2">
                        <label className="text-sm text-gray-600 dark:text-gray-400">
                          Height:
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
                          className="w-20 text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="12px"
                        />
                      </div>

                      {/* <div className="flex items-center gap-2">
                        <label className="text-sm text-gray-600 dark:text-gray-400">
                          Color:
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
                          className="w-12 h-8 border border-gray-300 dark:border-gray-600 rounded cursor-pointer"
                        />
                      </div> */}
                    </div>
                  )}
                </div>

                {/* Slide Number */}
                <div className="border border-gray-200 dark:border-gray-600 rounded-md p-4 bg-white dark:bg-slate-800 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config.plugins.SlideNumber.enabled}
                        onChange={() => handlePluginToggle("SlideNumber")}
                        className="sr-only"
                      />
                      <div
                        className={`w-5 h-5 rounded border-2 mr-2 flex items-center justify-center transition-colors ${
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
                    <div className="flex items-center gap-4">
                      {config.plugins.SlideNumber.enabled && (
                        <div className="flex items-center gap-2">
                          <label className="text-sm text-gray-600 dark:text-gray-400">
                            Position:
                          </label>
                          <select
                            value={config.plugins.SlideNumber.position}
                            onChange={(e) =>
                              handlePluginConfigChange(
                                "SlideNumber",
                                "position",
                                e.target.value
                              )
                            }
                            className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="bottom-left">Bottom Left</option>
                            <option value="bottom-right">Bottom Right</option>
                            <option value="bottom-center">Bottom Center</option>
                          </select>
                        </div>
                      )}
                    </div>
                  </div>

                  {config.plugins.SlideNumber.enabled && (
                    <div className="flex items-center gap-4 justify-end">
                      <div className="flex items-center gap-2">
                        <label className="text-sm text-gray-600 dark:text-gray-400">
                          Format:
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
                          className="w-40 text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="current/total"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Controller */}
                <div className="border border-gray-200 dark:border-gray-600 rounded-md p-4 bg-white dark:bg-slate-800 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config.plugins.Controller.enabled}
                        onChange={() => handlePluginToggle("Controller")}
                        className="sr-only"
                      />
                      <div
                        className={`w-5 h-5 rounded border-2 mr-2 flex items-center justify-center transition-colors ${
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
                    <div className="flex items-center gap-4">
                      {config.plugins.Controller.enabled && (
                        <div className="flex items-center gap-2">
                          <label className="text-sm text-gray-600 dark:text-gray-400">
                            Position:
                          </label>
                          <select
                            value={config.plugins.Controller.position}
                            onChange={(e) =>
                              handlePluginConfigChange(
                                "Controller",
                                "position",
                                e.target.value
                              )
                            }
                            className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="bottom-left">Bottom Left</option>
                            <option value="bottom-right">Bottom Right</option>
                            <option value="bottom-center">Bottom Center</option>
                          </select>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Confetti */}
                <div className="border border-gray-200 dark:border-gray-600 rounded-md p-4 bg-white dark:bg-slate-800 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config.plugins.Confetti.enabled}
                        onChange={() => handlePluginToggle("Confetti")}
                        className="sr-only"
                      />
                      <div
                        className={`w-5 h-5 rounded border-2 mr-2 flex items-center justify-center transition-colors ${
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
                    <div className="flex items-center gap-4">
                      {config.plugins.Confetti.enabled && (
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <label className="text-sm text-gray-600 dark:text-gray-400">
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
                              className="w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-md appearance-none cursor-pointer slider"
                            />
                          </div>

                          <div className="flex items-center gap-2">
                            <label className="text-sm text-gray-600 dark:text-gray-400">
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
                              className="w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-md appearance-none cursor-pointer slider"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "header-footer" && (
              <div className="space-y-5">
                {/* Header Settings */}
                <div className="border border-gray-200 dark:border-gray-600 rounded-md p-4 bg-white dark:bg-slate-800 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
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
                        className={`w-5 h-5 rounded border-2 mr-2 flex items-center justify-center transition-colors ${
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
                    <div className="flex items-center gap-4">
                      <label className="flex items-center cursor-pointer">
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
                          className={`w-5 h-5 rounded border-2 mr-2 flex items-center justify-center transition-colors ${
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

                      <div className="flex items-center gap-2">
                        <label className="text-sm text-gray-600 dark:text-gray-400">
                          Position:
                        </label>
                        <select
                          value={config.header.position}
                          onChange={(e) =>
                            handleHeaderChange("position", e.target.value)
                          }
                          className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="top-left">Top Left</option>
                          <option value="top-center">Top Center</option>
                          <option value="top-right">Top Right</option>
                        </select>
                      </div>
                    </div>
                  </div>

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
                </div>

                {/* Footer Settings */}
                <div className="border border-gray-200 dark:border-gray-600 rounded-md p-4 bg-white dark:bg-slate-800 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
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
                        className={`w-5 h-5 rounded border-2 mr-2 flex items-center justify-center transition-colors ${
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
                    <div className="flex items-center gap-4">
                      <label className="flex items-center cursor-pointer">
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
                          className={`w-5 h-5 rounded border-2 mr-2 flex items-center justify-center transition-colors ${
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

                      <div className="flex items-center gap-2">
                        <label className="text-sm text-gray-600 dark:text-gray-400">
                          Position:
                        </label>
                        <select
                          value={config.footer.position}
                          onChange={(e) =>
                            handleFooterChange("position", e.target.value)
                          }
                          className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="bottom-left">Bottom Left</option>
                          <option value="bottom-center">Bottom Center</option>
                          <option value="bottom-right">Bottom Right</option>
                        </select>
                      </div>
                    </div>
                  </div>

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
                </div>
              </div>
            )}
          </div>

          {/* Configuration Actions */}
          <div className="mt-6">
            <div className="flex flex-col sm:flex-row gap-3 justify-end">
              <button
                onClick={() => setShowResetModal(true)}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-muted text-muted-foreground border border-input rounded-md hover:bg-muted/80 transition-colors text-sm font-medium"
              >
                <RotateCcw className="w-4 h-4" />
                Reset to Default
              </button>
              <button
                onClick={() => setShowImportModal(true)}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors text-sm font-medium"
              >
                <Upload className="w-4 h-4" />
                Import Configuration
              </button>

              <button
                onClick={handleExportConfig}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm font-medium"
              >
                <Download className="w-4 h-4" />
                Export Configuration
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleImportConfig}
        className="hidden"
      />

      {/* Import Modal */}
      {showImportModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => {
            setShowImportModal(false);
            setImportError("");
          }}
        >
          <div
            className="bg-card border border-input rounded-lg shadow-lg max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-card-foreground">
                  Import Configuration
                </h3>
                <button
                  onClick={() => {
                    setShowImportModal(false);
                    setImportError("");
                  }}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Select a configuration file (.json) to import your
                  presentation settings.
                </p>

                {importError && (
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                    <p className="text-sm text-red-600 dark:text-red-400">
                      {importError}
                    </p>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={handleOpenFileInput}
                    className="flex-1 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
                  >
                    Choose File
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reset Modal */}
      {showResetModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowResetModal(false)}
        >
          <div
            className="bg-card border border-input rounded-lg shadow-lg max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-card-foreground">
                  Reset Configuration
                </h3>
                <button
                  onClick={() => setShowResetModal(false)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Are you sure you want to reset all presentation settings to
                  their default values? This action cannot be undone.
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={handleResetConfig}
                    className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                  >
                    Reset to Default
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
