"use client";

import {
  PresentationToolbarProps,
  PresentationConfig,
} from "../types/presentation.types";
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
    "general" | "plugins" | "header-footer" | "background"
  >("general");
  const [showImportModal, setShowImportModal] = useState(false);
  const [importError, setImportError] = useState("");
  const [showResetModal, setShowResetModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [inputValues, setInputValues] = useState<{ [key: string]: string }>({});

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
    background: [
      {
        imagePath: "https://mo.js.org/demo/images/background-first.svg",
        size: "contain",
        position: "top-left",
        repeat: "no-repeat",
        bgColor: "#000000",
        allSlides: [1],
      },
      {
        imagePath: "https://mo.js.org/demo/images/background.svg",
        size: "cover",
        position: "center",
        repeat: "no-repeat",
        bgColor: "#000000",
        allSlidesExcept: [1, 24],
      },
      {
        imagePath: "https://mo.js.org/demo/images/background-end.svg",
        size: "cover",
        position: "right",
        repeat: "no-repeat",
        bgColor: "#000000",
        allSlides: [24],
      },
    ],
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
          <div className="flex flex-wrap border-b border-gray-200 dark:border-gray-600 overflow-x-auto">
            <button
              onClick={() => setActiveTab("general")}
              className={`px-2 py-2 text-xs font-medium border-b-2 transition-colors whitespace-nowrap flex-shrink-0 ${
                activeTab === "general"
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              General
            </button>
            <button
              onClick={() => setActiveTab("header-footer")}
              className={`px-2 py-2 text-xs font-medium border-b-2 transition-colors whitespace-nowrap flex-shrink-0 ${
                activeTab === "header-footer"
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              Header & Footer
            </button>
            <button
              onClick={() => setActiveTab("background")}
              className={`px-2 py-2 text-xs font-medium border-b-2 transition-colors whitespace-nowrap flex-shrink-0 ${
                activeTab === "background"
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              Background
            </button>
            <button
              onClick={() => setActiveTab("plugins")}
              className={`px-2 py-2 text-xs font-medium border-b-2 transition-colors whitespace-nowrap flex-shrink-0 ${
                activeTab === "plugins"
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              Plugins
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-2 rounded-b-md border border-gray-200 dark:border-gray-600 border-t-0">
            {activeTab === "general" && (
              <div
                className="grid grid-cols-1 gap-3"
                style={{
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                }}
              >
                {/* Basic Settings */}
                <div className="border border-gray-200 dark:border-gray-600 rounded-md p-2 bg-card-secondary shadow-sm">
                  <div className="flex flex-col gap-3 mb-3">
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                      Basic Settings
                    </span>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <label className="text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">
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
                          className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-md appearance-none cursor-pointer slider"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <label className="text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">
                          Theme:
                        </label>
                        <select
                          value={config.theme}
                          onChange={(e) =>
                            handleThemeChange(
                              e.target.value as typeof config.theme
                            )
                          }
                          className="text-xs border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent w-24"
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
                <div className="border border-gray-200 dark:border-gray-600 rounded-md p-2 bg-card-secondary shadow-sm">
                  <div className="flex flex-col gap-3 mb-3">
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                      Navigation
                    </span>
                    <div className="flex flex-col gap-2">
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
                          className={`w-4 h-4 rounded border-2 mr-2 flex items-center justify-center transition-colors ${
                            config.loop
                              ? "bg-blue-500 border-blue-500"
                              : "border-gray-300 dark:border-gray-500"
                          }`}
                        >
                          {config.loop && (
                            <Check className="w-2 h-2 text-white" />
                          )}
                        </div>
                        <span className="text-xs text-gray-700 dark:text-gray-300">
                          Loop
                        </span>
                      </label>

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
                          className={`w-4 h-4 rounded border-2 mr-2 flex items-center justify-center transition-colors ${
                            config.urlHash
                              ? "bg-blue-500 border-blue-500"
                              : "border-gray-300 dark:border-gray-500"
                          }`}
                        >
                          {config.urlHash && (
                            <Check className="w-2 h-2 text-white" />
                          )}
                        </div>
                        <span className="text-xs text-gray-700 dark:text-gray-300">
                          URL Hash
                        </span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Transition Settings */}
                <div className="border border-gray-200 dark:border-gray-600 rounded-md p-2 bg-card-secondary shadow-sm">
                  <div className="flex flex-col gap-3 mb-3">
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                      Transition
                    </span>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <label className="text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">
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
                          className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-md appearance-none cursor-pointer slider"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <label className="text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">
                          Type:
                        </label>
                        <select
                          value={config.transition.type}
                          onChange={(e) =>
                            handleTransitionChange("type", e.target.value)
                          }
                          className="text-xs border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent w-24"
                        >
                          <option value="horizontal">Horizontal</option>
                          <option value="vertical">Vertical</option>
                          <option value="fade">Fade</option>
                          <option value="slide">Slide</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Center Content Settings */}
                <div className="border border-gray-200 dark:border-gray-600 rounded-md p-2 bg-card-secondary shadow-sm">
                  <div className="flex flex-col gap-3 mb-3">
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                      Center Content
                    </span>
                    <div className="flex flex-col gap-2">
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
                          className={`w-4 h-4 rounded border-2 mr-2 flex items-center justify-center transition-colors ${
                            config.centerContent.vertical
                              ? "bg-blue-500 border-blue-500"
                              : "border-gray-300 dark:border-gray-500"
                          }`}
                        >
                          {config.centerContent.vertical && (
                            <Check className="w-2 h-2 text-white" />
                          )}
                        </div>
                        <span className="text-xs text-gray-700 dark:text-gray-300">
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
                          className={`w-4 h-4 rounded border-2 mr-2 flex items-center justify-center transition-colors ${
                            config.centerContent.horizontal
                              ? "bg-blue-500 border-blue-500"
                              : "border-gray-300 dark:border-gray-500"
                          }`}
                        >
                          {config.centerContent.horizontal && (
                            <Check className="w-2 h-2 text-white" />
                          )}
                        </div>
                        <span className="text-xs text-gray-700 dark:text-gray-300">
                          Horizontal
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "plugins" && (
              <div
                className="grid grid-cols-1 gap-3"
                style={{
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                }}
              >
                {/* Progress Bar */}
                <div className="border border-gray-200 dark:border-gray-600 rounded-md p-2 bg-card-secondary shadow-sm">
                  <div className="flex flex-col gap-3 mb-3">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config.plugins.ProgressBar.enabled}
                        onChange={() => handlePluginToggle("ProgressBar")}
                        className="sr-only"
                      />
                      <div
                        className={`w-4 h-4 rounded border-2 mr-2 flex items-center justify-center transition-colors ${
                          config.plugins.ProgressBar.enabled
                            ? "bg-blue-500 border-blue-500"
                            : "border-gray-300 dark:border-gray-500"
                        }`}
                      >
                        {config.plugins.ProgressBar.enabled && (
                          <Check className="w-2 h-2 text-white" />
                        )}
                      </div>
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        Progress Bar
                      </span>
                    </label>
                    <div className="flex flex-col gap-2">
                      {config.plugins.ProgressBar.enabled && (
                        <div className="flex items-center gap-2">
                          <label className="text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">
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
                            className="text-xs border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent w-24"
                          >
                            <option value="top">Top</option>
                            <option value="bottom">Bottom</option>
                          </select>
                        </div>
                      )}

                      {config.plugins.ProgressBar.enabled && (
                        <div className="flex items-center gap-2">
                          <label className="text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">
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
                            className="w-24 text-xs border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="12px"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Slide Number */}
                <div className="border border-gray-200 dark:border-gray-600 rounded-md p-2 bg-card-secondary shadow-sm">
                  <div className="flex flex-col gap-3 mb-3">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config.plugins.SlideNumber.enabled}
                        onChange={() => handlePluginToggle("SlideNumber")}
                        className="sr-only"
                      />
                      <div
                        className={`w-4 h-4 rounded border-2 mr-2 flex items-center justify-center transition-colors ${
                          config.plugins.SlideNumber.enabled
                            ? "bg-blue-500 border-blue-500"
                            : "border-gray-300 dark:border-gray-500"
                        }`}
                      >
                        {config.plugins.SlideNumber.enabled && (
                          <Check className="w-2 h-2 text-white" />
                        )}
                      </div>
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        Slide Number
                      </span>
                    </label>
                    <div className="flex flex-col gap-2">
                      {config.plugins.SlideNumber.enabled && (
                        <div className="flex items-center gap-2">
                          <label className="text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">
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
                            className="text-xs border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent w-24"
                          >
                            <option value="bottom-left">Bottom Left</option>
                            <option value="bottom-right">Bottom Right</option>
                            <option value="bottom-center">Bottom Center</option>
                          </select>
                        </div>
                      )}

                      {config.plugins.SlideNumber.enabled && (
                        <div className="flex items-center gap-2">
                          <label className="text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">
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
                            className="w-24 text-xs border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="current/total"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Controller */}
                <div className="border border-gray-200 dark:border-gray-600 rounded-md p-2 bg-card-secondary shadow-sm">
                  <div className="flex flex-col gap-3 mb-3">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config.plugins.Controller.enabled}
                        onChange={() => handlePluginToggle("Controller")}
                        className="sr-only"
                      />
                      <div
                        className={`w-4 h-4 rounded border-2 mr-2 flex items-center justify-center transition-colors ${
                          config.plugins.Controller.enabled
                            ? "bg-blue-500 border-blue-500"
                            : "border-gray-300 dark:border-gray-500"
                        }`}
                      >
                        {config.plugins.Controller.enabled && (
                          <Check className="w-2 h-2 text-white" />
                        )}
                      </div>
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        Controller
                      </span>
                    </label>
                    <div className="flex flex-col gap-2">
                      {config.plugins.Controller.enabled && (
                        <div className="flex items-center gap-2">
                          <label className="text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">
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
                            className="text-xs border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent w-24"
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
                <div className="border border-gray-200 dark:border-gray-600 rounded-md p-2 bg-card-secondary shadow-sm">
                  <div className="flex flex-col gap-3 mb-3">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config.plugins.Confetti.enabled}
                        onChange={() => handlePluginToggle("Confetti")}
                        className="sr-only"
                      />
                      <div
                        className={`w-4 h-4 rounded border-2 mr-2 flex items-center justify-center transition-colors ${
                          config.plugins.Confetti.enabled
                            ? "bg-blue-500 border-blue-500"
                            : "border-gray-300 dark:border-gray-500"
                        }`}
                      >
                        {config.plugins.Confetti.enabled && (
                          <Check className="w-2 h-2 text-white" />
                        )}
                      </div>
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        Confetti
                      </span>
                    </label>
                    <div className="flex flex-col gap-2">
                      {config.plugins.Confetti.enabled && (
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            <label className="text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">
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
                              className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-md appearance-none cursor-pointer slider"
                            />
                          </div>

                          <div className="flex items-center gap-2">
                            <label className="text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">
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
                              className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-md appearance-none cursor-pointer slider"
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
              <div
                className="grid grid-cols-1 gap-3"
                style={{
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                }}
              >
                {/* Header Settings */}
                <div className="border border-gray-200 dark:border-gray-600 rounded-md p-2 bg-card-secondary shadow-sm">
                  <div className="flex flex-col gap-3 mb-3">
                    <label className="flex items-center cursor-pointer">
                      {/* <input
                        type="checkbox"
                        checked={config.header.enabled}
                        onChange={() =>
                          handleHeaderChange("enabled", !config.header.enabled)
                        }
                        className="sr-only"
                      />
                      <div
                        className={`w-4 h-4 rounded border-2 mr-2 flex items-center justify-center transition-colors ${
                          config.header.enabled
                            ? "bg-blue-500 border-blue-500"
                            : "border-gray-300 dark:border-gray-500"
                        }`}
                      >
                        {config.header.enabled && (
                          <Check className="w-2 h-2 text-white" />
                        )}
                      </div> */}
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        Header
                      </span>
                    </label>
                    <div className="flex flex-col gap-2">
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
                          className={`w-4 h-4 rounded border-2 mr-2 flex items-center justify-center transition-colors ${
                            config.header.showOnFirstSlide
                              ? "bg-blue-500 border-blue-500"
                              : "border-gray-300 dark:border-gray-500"
                          }`}
                        >
                          {config.header.showOnFirstSlide && (
                            <Check className="w-2 h-2 text-white" />
                          )}
                        </div>
                        <span className="text-xs text-gray-700 dark:text-gray-300">
                          Show on First Slide
                        </span>
                      </label>

                      <div className="flex items-center gap-2">
                        <label className="text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">
                          Position:
                        </label>
                        <select
                          value={config.header.position}
                          onChange={(e) =>
                            handleHeaderChange("position", e.target.value)
                          }
                          className="text-xs border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent w-24"
                        >
                          <option value="top-left">Top Left</option>
                          <option value="top-center">Top Center</option>
                          <option value="top-right">Top Right</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-gray-600 dark:text-gray-400 mb-2 block">
                      Content
                    </label>
                    <textarea
                      value={config.header.content}
                      onChange={(e) =>
                        handleHeaderChange("content", e.target.value)
                      }
                      className="w-full text-xs border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter header content (Markdown, HTML, or Text)"
                      rows={3}
                    />
                  </div>
                </div>

                {/* Footer Settings */}
                <div className="border border-gray-200 dark:border-gray-600 rounded-md p-2 bg-card-secondary shadow-sm">
                  <div className="flex flex-col gap-3 mb-3">
                    <label className="flex items-center cursor-pointer">
                      {/* <input
                        type="checkbox"
                        checked={config.footer.enabled}
                        onChange={() =>
                          handleFooterChange("enabled", !config.footer.enabled)
                        }
                        className="sr-only"
                      />
                      <div
                        className={`w-4 h-4 rounded border-2 mr-2 flex items-center justify-center transition-colors ${
                          config.footer.enabled
                            ? "bg-blue-500 border-blue-500"
                            : "border-gray-300 dark:border-gray-500"
                        }`}
                      >
                        {config.footer.enabled && (
                          <Check className="w-2 h-2 text-white" />
                        )}
                      </div> */}
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        Footer
                      </span>
                    </label>
                    <div className="flex flex-col gap-2">
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
                          className={`w-4 h-4 rounded border-2 mr-2 flex items-center justify-center transition-colors ${
                            config.footer.showOnFirstSlide
                              ? "bg-blue-500 border-blue-500"
                              : "border-gray-300 dark:border-gray-500"
                          }`}
                        >
                          {config.footer.showOnFirstSlide && (
                            <Check className="w-2 h-2 text-white" />
                          )}
                        </div>
                        <span className="text-xs text-gray-700 dark:text-gray-300">
                          Show on First Slide
                        </span>
                      </label>

                      <div className="flex items-center gap-2">
                        <label className="text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">
                          Position:
                        </label>
                        <select
                          value={config.footer.position}
                          onChange={(e) =>
                            handleFooterChange("position", e.target.value)
                          }
                          className="text-xs border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent w-24"
                        >
                          <option value="bottom-left">Bottom Left</option>
                          <option value="bottom-center">Bottom Center</option>
                          <option value="bottom-right">Bottom Right</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-gray-600 dark:text-gray-400 mb-2 block">
                      Content
                    </label>
                    <textarea
                      value={config.footer.content}
                      onChange={(e) =>
                        handleFooterChange("content", e.target.value)
                      }
                      className="w-full text-xs border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter footer content (Markdown, HTML, or Text)"
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "background" && (
              <div
                className="grid grid-cols-1 gap-3"
                style={{
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                }}
              >
                {/* Background Images */}
                {config.background && config.background.length > 0 ? (
                  config.background.map((bg, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 dark:border-gray-600 rounded-md p-2 bg-card-secondary shadow-sm"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                          Background {index + 1}
                        </span>
                        <button
                          onClick={() => {
                            const newBackgrounds =
                              config.background?.filter(
                                (_, i) => i !== index
                              ) || [];
                            onConfigChange({
                              ...config,
                              background: newBackgrounds,
                            });
                          }}
                          className="text-red-500 hover:text-red-700 text-xs"
                        >
                          Remove
                        </button>
                      </div>

                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <label className="text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">
                            Image URL:
                          </label>
                          <input
                            type="text"
                            value={bg.imagePath}
                            onChange={(e) => {
                              const newBackgrounds = [
                                ...(config.background || []),
                              ];
                              newBackgrounds[index] = {
                                ...newBackgrounds[index],
                                imagePath: e.target.value,
                              };
                              onConfigChange({
                                ...config,
                                background: newBackgrounds,
                              });
                            }}
                            className="w-full flex-1 text-xs border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="https://example.com/image.jpg"
                          />
                        </div>

                        <div className="flex items-center gap-2">
                          <label className="text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">
                            Size:
                          </label>
                          <select
                            value={bg.size}
                            onChange={(e) => {
                              const newBackgrounds = [
                                ...(config.background || []),
                              ];
                              newBackgrounds[index] = {
                                ...newBackgrounds[index],
                                size: e.target.value,
                              };
                              onConfigChange({
                                ...config,
                                background: newBackgrounds,
                              });
                            }}
                            className="text-xs border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent w-24"
                          >
                            <option value="cover">Cover</option>
                            <option value="contain">Contain</option>
                            <option value="auto">Auto</option>
                            <option value="100%">100%</option>
                          </select>
                        </div>

                        <div className="flex items-center gap-2">
                          <label className="text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">
                            Position:
                          </label>
                          <select
                            value={bg.position}
                            onChange={(e) => {
                              const newBackgrounds = [
                                ...(config.background || []),
                              ];
                              newBackgrounds[index] = {
                                ...newBackgrounds[index],
                                position: e.target.value as typeof bg.position,
                              };
                              onConfigChange({
                                ...config,
                                background: newBackgrounds,
                              });
                            }}
                            className="text-xs border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent w-24"
                          >
                            <option value="top-left">Top Left</option>
                            <option value="top-center">Top Center</option>
                            <option value="top-right">Top Right</option>
                            <option value="center">Center</option>
                            <option value="bottom-left">Bottom Left</option>
                            <option value="bottom-center">Bottom Center</option>
                            <option value="bottom-right">Bottom Right</option>
                            <option value="left">Left</option>
                            <option value="right">Right</option>
                          </select>
                        </div>

                        <div className="flex items-center gap-2">
                          <label className="text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">
                            Repeat:
                          </label>
                          <select
                            value={bg.repeat}
                            onChange={(e) => {
                              const newBackgrounds = [
                                ...(config.background || []),
                              ];
                              newBackgrounds[index] = {
                                ...newBackgrounds[index],
                                repeat: e.target.value as typeof bg.repeat,
                              };
                              onConfigChange({
                                ...config,
                                background: newBackgrounds,
                              });
                            }}
                            className="text-xs border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent w-24"
                          >
                            <option value="no-repeat">No Repeat</option>
                            <option value="repeat">Repeat</option>
                            <option value="repeat-x">Repeat X</option>
                            <option value="repeat-y">Repeat Y</option>
                          </select>
                        </div>

                        <div className="flex items-center gap-2">
                          <label className="text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">
                            Background Color:
                          </label>
                          <input
                            type="color"
                            value={bg.bgColor}
                            onChange={(e) => {
                              const newBackgrounds = [
                                ...(config.background || []),
                              ];
                              newBackgrounds[index] = {
                                ...newBackgrounds[index],
                                bgColor: e.target.value,
                              };
                              onConfigChange({
                                ...config,
                                background: newBackgrounds,
                              });
                            }}
                            className="w-8 h-6 border border-gray-300 dark:border-gray-600 rounded cursor-pointer"
                          />
                        </div>

                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            <label className="text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">
                              Apply to slides:
                            </label>
                            <input
                              type="text"
                              value={
                                inputValues[`allSlides-${index}`] !== undefined
                                  ? inputValues[`allSlides-${index}`]
                                  : bg.allSlides
                                  ? bg.allSlides.join(", ")
                                  : ""
                              }
                              onChange={(e) => {
                                setInputValues((prev) => ({
                                  ...prev,
                                  [`allSlides-${index}`]: e.target.value,
                                }));
                              }}
                              onBlur={(e) => {
                                const inputValue = e.target.value.trim();
                                if (inputValue === "") {
                                  const newBackgrounds = [
                                    ...(config.background || []),
                                  ];
                                  newBackgrounds[index] = {
                                    ...newBackgrounds[index],
                                    allSlides: undefined,
                                  };
                                  onConfigChange({
                                    ...config,
                                    background: newBackgrounds,
                                  });
                                  setInputValues((prev) => ({
                                    ...prev,
                                    [`allSlides-${index}`]: "",
                                  }));
                                  return;
                                }

                                const slides = inputValue
                                  .split(/[,\s]+/)
                                  .map((s) => parseInt(s.trim()))
                                  .filter((n) => !isNaN(n) && n > 0);

                                const newBackgrounds = [
                                  ...(config.background || []),
                                ];
                                newBackgrounds[index] = {
                                  ...newBackgrounds[index],
                                  allSlides:
                                    slides.length > 0 ? slides : undefined,
                                };
                                onConfigChange({
                                  ...config,
                                  background: newBackgrounds,
                                });
                              }}
                              className="w-full flex-1 text-xs border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="1, 2, 3 (slide numbers)"
                            />
                          </div>

                          <div className="flex items-center gap-2">
                            <label className="text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">
                              Apply to all except:
                            </label>
                            <input
                              type="text"
                              value={
                                inputValues[`allSlidesExcept-${index}`] !==
                                undefined
                                  ? inputValues[`allSlidesExcept-${index}`]
                                  : bg.allSlidesExcept
                                  ? bg.allSlidesExcept.join(", ")
                                  : ""
                              }
                              onChange={(e) => {
                                setInputValues((prev) => ({
                                  ...prev,
                                  [`allSlidesExcept-${index}`]: e.target.value,
                                }));
                              }}
                              onBlur={(e) => {
                                const inputValue = e.target.value.trim();
                                if (inputValue === "") {
                                  const newBackgrounds = [
                                    ...(config.background || []),
                                  ];
                                  newBackgrounds[index] = {
                                    ...newBackgrounds[index],
                                    allSlidesExcept: undefined,
                                  };
                                  onConfigChange({
                                    ...config,
                                    background: newBackgrounds,
                                  });
                                  setInputValues((prev) => ({
                                    ...prev,
                                    [`allSlidesExcept-${index}`]: "",
                                  }));
                                  return;
                                }

                                const slides = inputValue
                                  .split(/[,\s]+/)
                                  .map((s) => parseInt(s.trim()))
                                  .filter((n) => !isNaN(n) && n > 0);

                                const newBackgrounds = [
                                  ...(config.background || []),
                                ];
                                newBackgrounds[index] = {
                                  ...newBackgrounds[index],
                                  allSlidesExcept:
                                    slides.length > 0 ? slides : undefined,
                                };
                                onConfigChange({
                                  ...config,
                                  background: newBackgrounds,
                                });
                              }}
                              className="w-full flex-1 text-xs border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="1, 2, 3 (exclude these)"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full border border-gray-200 dark:border-gray-600 rounded-md p-4 bg-card-secondary shadow-sm">
                    <div className="text-xs text-gray-500 dark:text-gray-400 text-center py-4">
                      No background images configured
                    </div>
                  </div>
                )}

                {/* Add Background Button */}
                <div className="col-span-full">
                  <button
                    onClick={() => {
                      const newBackground = {
                        imagePath: "",
                        size: "cover" as const,
                        position: "center" as const,
                        repeat: "no-repeat" as const,
                        bgColor: "#000000",
                        allSlides: undefined,
                      };
                      onConfigChange({
                        ...config,
                        background: [
                          ...(config.background || []),
                          newBackground,
                        ],
                      });
                    }}
                    className="flex items-center justify-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-xs font-medium w-full"
                  >
                    <span>+</span>
                    Add Background
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Configuration Actions */}
          <div className="mt-3">
            <div
              className="grid grid-cols-1 gap-2"
              style={{
                gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
              }}
            >
              <button
                onClick={() => setShowResetModal(true)}
                className="flex items-center justify-center gap-2 px-3 py-2 bg-muted text-red-500 border border-input rounded-md hover:bg-muted/80 transition-colors text-xs font-medium"
              >
                <RotateCcw className="w-3 h-3" />
                Reset to Default
              </button>
              <button
                onClick={() => setShowImportModal(true)}
                className="flex items-center justify-center gap-2 px-3 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors text-xs font-medium"
              >
                <Upload className="w-3 h-3" />
                Import Configuration
              </button>

              <button
                onClick={handleExportConfig}
                className="flex items-center justify-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-xs font-medium"
              >
                <Download className="w-3 h-3" />
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
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => {
            setShowImportModal(false);
            setImportError("");
          }}
        >
          <div
            className="bg-card border border-input rounded-lg shadow-lg max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base sm:text-lg font-semibold text-card-foreground">
                  Import Configuration
                </h3>
                <button
                  onClick={() => {
                    setShowImportModal(false);
                    setImportError("");
                  }}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Select a configuration file (.json) to import your
                  presentation settings.
                </p>

                {importError && (
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                    <p className="text-xs sm:text-sm text-red-600 dark:text-red-400">
                      {importError}
                    </p>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={handleOpenFileInput}
                    className="flex-1 bg-primary text-primary-foreground px-3 sm:px-4 py-2 rounded-md hover:bg-primary/90 transition-colors text-xs sm:text-sm"
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
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowResetModal(false)}
        >
          <div
            className="bg-card border border-input rounded-lg shadow-lg max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base sm:text-lg font-semibold text-card-foreground">
                  Reset Configuration
                </h3>
                <button
                  onClick={() => setShowResetModal(false)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Are you sure you want to reset all presentation settings to
                  their default values? This action cannot be undone.
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={handleResetConfig}
                    className="flex-1 bg-red-600 text-white px-3 sm:px-4 py-2 rounded-md hover:bg-red-700 transition-colors text-xs sm:text-sm"
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
