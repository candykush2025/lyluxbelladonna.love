"use client";

import React, { useEffect, useState } from "react";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";

interface ToastProps {
  message: string;
  type: "success" | "error" | "info" | "warning";
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({
  message,
  type,
  onClose,
  duration = 4000,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    // Trigger entrance animation
    setIsVisible(true);

    // Progress bar animation
    if (duration > 0) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev <= 0) {
            clearInterval(interval);
            return 0;
          }
          return prev - 100 / (duration / 100);
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [duration]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Wait for exit animation
  };

  const getToastStyles = () => {
    const baseStyles =
      "flex items-center p-4 mb-4 text-sm rounded-lg shadow-lg transition-all duration-300 ease-in-out transform";

    switch (type) {
      case "success":
        return `${baseStyles} bg-gray-800 text-green-300 border border-green-700`;
      case "error":
        return `${baseStyles} bg-gray-800 text-red-300 border border-red-700`;
      case "warning":
        return `${baseStyles} bg-gray-800 text-yellow-300 border border-yellow-700`;
      case "info":
      default:
        return `${baseStyles} bg-gray-800 text-blue-300 border border-blue-700`;
    }
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5 mr-3 flex-shrink-0" />;
      case "error":
        return <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 mr-3 flex-shrink-0" />;
      case "info":
      default:
        return <Info className="w-5 h-5 mr-3 flex-shrink-0" />;
    }
  };

  return (
    <div
      className={`${getToastStyles()} ${
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      }`}
      role="alert"
    >
      {getIcon()}
      <div className="flex-1 font-medium">{message}</div>
      <button
        onClick={handleClose}
        className="ml-4 text-gray-400 hover:text-gray-600 transition-colors duration-200"
        aria-label="Close"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Progress bar */}
      {duration > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 rounded-b-lg overflow-hidden">
          <div
            className={`h-full transition-all duration-100 ease-linear ${
              type === "success"
                ? "bg-green-500"
                : type === "error"
                ? "bg-red-500"
                : type === "warning"
                ? "bg-yellow-500"
                : "bg-blue-500"
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
};

export default Toast;

