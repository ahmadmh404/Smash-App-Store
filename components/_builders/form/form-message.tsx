"use client";

import * as React from "react";
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import type {
  MessageComponentProps,
  MessageType,
} from "@/components/_builders/types/form";

// Default message component
export function DefaultFormMessage({
  message,
  onDismiss,
  className,
}: MessageComponentProps) {
  const [isVisible, setIsVisible] = React.useState(true);

  // Auto-dismiss functionality
  React.useEffect(() => {
    if (message.duration && message.duration > 0) {
      const timer = setTimeout(() => {
        handleDismiss();
      }, message.duration);

      return () => clearTimeout(timer);
    }
  }, [message.duration]);

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  if (!isVisible) return null;

  const getMessageIcon = (type: MessageType) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-4 w-4" />;
      case "error":
        return <AlertCircle className="h-4 w-4" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4" />;
      case "info":
        return <Info className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const getMessageVariant = (type: MessageType) => {
    switch (type) {
      case "error":
        return "destructive";
      case "success":
      case "warning":
      case "info":
      default:
        return "default";
    }
  };

  const getMessageClasses = (type: MessageType) => {
    switch (type) {
      case "success":
        return "border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200";
      case "error":
        return "border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200";
      case "warning":
        return "border-yellow-200 bg-yellow-50 text-yellow-800 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-200";
      case "info":
        return "border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-200";
      default:
        return "";
    }
  };

  return (
    <Alert
      variant={getMessageVariant(message.type)}
      className={cn(
        "relative",
        getMessageClasses(message.type),
        message.dismissible && "pr-12",
        className
      )}
    >
      <div className="flex items-start gap-2">
        {getMessageIcon(message.type)}
        <AlertDescription className="flex-1">{message.text}</AlertDescription>
        {message.dismissible && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-2 top-2 h-6 w-6 p-0 hover:bg-transparent"
            onClick={handleDismiss}
          >
            <X className="h-3 w-3" />
            <span className="sr-only">Dismiss</span>
          </Button>
        )}
      </div>
    </Alert>
  );
}

// Alternative compact message component
export function CompactFormMessage({
  message,
  onDismiss,
  className,
}: MessageComponentProps) {
  const [isVisible, setIsVisible] = React.useState(true);

  React.useEffect(() => {
    if (message.duration && message.duration > 0) {
      const timer = setTimeout(() => {
        handleDismiss();
      }, message.duration);

      return () => clearTimeout(timer);
    }
  }, [message.duration]);

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  if (!isVisible) return null;

  const getMessageClasses = (type: MessageType) => {
    switch (type) {
      case "success":
        return "bg-green-100 border-green-400 text-green-700";
      case "error":
        return "bg-red-100 border-red-400 text-red-700";
      case "warning":
        return "bg-yellow-100 border-yellow-400 text-yellow-700";
      case "info":
        return "bg-blue-100 border-blue-400 text-blue-700";
      default:
        return "bg-gray-100 border-gray-400 text-gray-700";
    }
  };

  const getMessageIcon = (type: MessageType) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-4 w-4" />;
      case "error":
        return <AlertCircle className="h-4 w-4" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4" />;
      case "info":
        return <Info className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  return (
    <div
      className={cn(
        "flex items-center gap-2 p-3 border-l-4 rounded-r-md",
        getMessageClasses(message.type),
        className
      )}
    >
      {getMessageIcon(message.type)}
      <span className="flex-1 text-sm font-medium">{message.text}</span>
      {message.dismissible && (
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 hover:bg-transparent"
          onClick={handleDismiss}
        >
          <X className="h-3 w-3" />
          <span className="sr-only">Dismiss</span>
        </Button>
      )}
    </div>
  );
}

// Toast-style message component
export function ToastFormMessage({
  message,
  onDismiss,
  className,
}: MessageComponentProps) {
  const [isVisible, setIsVisible] = React.useState(true);

  React.useEffect(() => {
    if (message.duration && message.duration > 0) {
      const timer = setTimeout(() => {
        handleDismiss();
      }, message.duration);

      return () => clearTimeout(timer);
    }
  }, [message.duration]);

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  if (!isVisible) return null;

  const getMessageClasses = (type: MessageType) => {
    switch (type) {
      case "success":
        return "bg-green-600 text-white";
      case "error":
        return "bg-red-600 text-white";
      case "warning":
        return "bg-yellow-600 text-white";
      case "info":
        return "bg-blue-600 text-white";
      default:
        return "bg-gray-600 text-white";
    }
  };

  const getMessageIcon = (type: MessageType) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-4 w-4" />;
      case "error":
        return <AlertCircle className="h-4 w-4" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4" />;
      case "info":
        return <Info className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  return (
    <div
      className={cn(
        "flex items-center gap-3 p-4 rounded-lg shadow-lg",
        getMessageClasses(message.type),
        className
      )}
    >
      {getMessageIcon(message.type)}
      <span className="flex-1 text-sm font-medium">{message.text}</span>
      {message.dismissible && (
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 text-white hover:bg-white/20"
          onClick={handleDismiss}
        >
          <X className="h-3 w-3" />
          <span className="sr-only">Dismiss</span>
        </Button>
      )}
    </div>
  );
}
