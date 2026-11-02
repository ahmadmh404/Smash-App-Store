"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

// Define the types properly
export type LoaderVariant =
  | "spinner"
  | "dots"
  | "bars"
  | "pulse"
  | "bounce"
  | "wave"
  | "ring"
  | "gradient";
export type LoaderSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
export type LoaderSpeed = "slow" | "normal" | "fast";
export type TextPosition = "bottom" | "right" | "left" | "top";

export interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: LoaderVariant;
  size?: LoaderSize;
  speed?: LoaderSpeed;
  text?: string;
  textPosition?: TextPosition;
  color?: string;
  overlay?: boolean;
  fullScreen?: boolean;
}

export interface MessageComponentProps {
  message: {
    type: "error" | "success" | "warning" | "info";
    text: string;
    dismissible?: boolean;
    duration?: number;
  };
  onDismiss?: () => void;
  className?: string;
}

// Individual loader components
const SpinnerLoader = ({
  size,
  className,
}: {
  size?: LoaderSize;
  className?: string;
}) => (
  <svg
    className={cn("animate-spin", className)}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

const DotsLoader = ({
  size,
  className,
}: {
  size?: LoaderSize;
  className?: string;
}) => {
  const dotSizeMap: Record<LoaderSize, string> = {
    xs: "w-1 h-1",
    sm: "w-1.5 h-1.5",
    md: "w-2 h-2",
    lg: "w-3 h-3",
    xl: "w-4 h-4",
    "2xl": "w-5 h-5",
  };

  const dotSize = size ? dotSizeMap[size] : dotSizeMap.md;

  return (
    <div className={cn("flex space-x-1", className)}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={cn("bg-current rounded-full animate-bounce", dotSize)}
          style={{
            animationDelay: `${i * 0.1}s`,
            animationDuration: "0.6s",
          }}
        />
      ))}
    </div>
  );
};

const BarsLoader = ({
  size,
  className,
}: {
  size?: LoaderSize;
  className?: string;
}) => {
  const barHeightMap: Record<LoaderSize, string> = {
    xs: "h-2",
    sm: "h-3",
    md: "h-4",
    lg: "h-6",
    xl: "h-8",
    "2xl": "h-10",
  };

  const barHeight = size ? barHeightMap[size] : barHeightMap.md;

  return (
    <div className={cn("flex items-end space-x-1", className)}>
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className={cn("w-1 bg-current animate-pulse", barHeight)}
          style={{
            animationDelay: `${i * 0.1}s`,
            animationDuration: "1s",
          }}
        />
      ))}
    </div>
  );
};

const PulseLoader = ({
  className,
}: {
  size?: LoaderSize;
  className?: string;
}) => (
  <div className={cn("bg-current rounded-full animate-pulse", className)} />
);

const BounceLoader = ({
  size,
  className,
}: {
  size?: LoaderSize;
  className?: string;
}) => {
  const ballSizeMap: Record<LoaderSize, string> = {
    xs: "w-2 h-2",
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
    xl: "w-6 h-6",
    "2xl": "w-8 h-8",
  };

  const ballSize = size ? ballSizeMap[size] : ballSizeMap.md;

  return (
    <div className={cn("flex space-x-2", className)}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={cn("bg-current rounded-full animate-bounce", ballSize)}
          style={{
            animationDelay: `${i * 0.16}s`,
          }}
        />
      ))}
    </div>
  );
};

const WaveLoader = ({
  size,
  className,
}: {
  size?: LoaderSize;
  className?: string;
}) => {
  const barHeightMap: Record<LoaderSize, string> = {
    xs: "h-3",
    sm: "h-4",
    md: "h-6",
    lg: "h-8",
    xl: "h-10",
    "2xl": "h-12",
  };

  const barHeight = size ? barHeightMap[size] : barHeightMap.md;

  return (
    <div className={cn("flex items-center space-x-1", className)}>
      {[0, 1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className={cn("w-1 bg-current rounded-full animate-pulse", barHeight)}
          style={{
            animationDelay: `${i * 0.1}s`,
            animationDuration: "1.2s",
            transformOrigin: "center",
          }}
        />
      ))}
    </div>
  );
};

const RingLoader = ({
  className,
}: {
  size?: LoaderSize;
  className?: string;
}) => (
  <div
    className={cn(
      "animate-spin rounded-full border-2 border-current border-t-transparent",
      className
    )}
  />
);

const GradientLoader = ({
  className,
}: {
  size?: LoaderSize;
  className?: string;
}) => (
  <div className={cn("animate-spin rounded-full", className)}>
    <div
      className="w-full h-full rounded-full border-4 border-transparent"
      style={{
        background:
          "conic-gradient(from 0deg, transparent, currentColor, transparent)",
      }}
    >
      <div className="w-full h-full rounded-full bg-background m-1" />
    </div>
  </div>
);

export const Loader = React.forwardRef<HTMLDivElement, LoaderProps>(
  (
    {
      className,
      variant = "spinner",
      size = "md",
      speed = "normal",
      text,
      textPosition = "bottom",
      color,
      overlay = false,
      fullScreen = false,
      ...props
    },
    ref
  ) => {
    const sizeClassMap: Record<LoaderSize, string> = {
      xs: "w-3 h-3",
      sm: "w-4 h-4",
      md: "w-6 h-6",
      lg: "w-8 h-8",
      xl: "w-12 h-12",
      "2xl": "w-16 h-16",
    };

    const speedClassMap: Record<LoaderSpeed, React.CSSProperties> = {
      slow: { animationDuration: "1000ms" },
      normal: { animationDuration: "700ms" },
      fast: { animationDuration: "500ms" },
    };

    const sizeClass = sizeClassMap[size];
    const speedStyle = speedClassMap[speed];

    const renderLoader = () => {
      const loaderProps = {
        size,
        className: cn(sizeClass, className),
        style: speedStyle,
      };

      switch (variant) {
        case "dots":
          return <DotsLoader {...loaderProps} />;
        case "bars":
          return <BarsLoader {...loaderProps} />;
        case "pulse":
          return <PulseLoader {...loaderProps} />;
        case "bounce":
          return <BounceLoader {...loaderProps} />;
        case "wave":
          return <WaveLoader {...loaderProps} />;
        case "ring":
          return <RingLoader {...loaderProps} />;
        case "gradient":
          return <GradientLoader {...loaderProps} />;
        case "spinner":
        default:
          return <SpinnerLoader {...loaderProps} />;
      }
    };

    const getTextPositionClasses = () => {
      switch (textPosition) {
        case "right":
          return "flex-row space-x-2";
        case "left":
          return "flex-row-reverse space-x-reverse space-x-2";
        case "top":
          return "flex-col-reverse space-y-reverse space-y-2";
        case "bottom":
        default:
          return "flex-col space-y-2";
      }
    };

    const loaderContent = (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center",
          getTextPositionClasses(),
          className
        )}
        style={color ? { color } : undefined}
        {...props}
      >
        {renderLoader()}
        {text && (
          <span className="text-sm font-medium text-current" aria-live="polite">
            {text}
          </span>
        )}
      </div>
    );

    if (fullScreen) {
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          {loaderContent}
        </div>
      );
    }

    if (overlay) {
      return (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/50 backdrop-blur-sm">
          {loaderContent}
        </div>
      );
    }

    return loaderContent;
  }
);

Loader.displayName = "Loader";

// Preset loader components for common use cases
export const ButtonLoader = ({
  size = "sm",
  ...props
}: Omit<LoaderProps, "variant">) => (
  <Loader variant="spinner" size={size} {...props} />
);

export const PageLoader = ({ text = "Loading...", ...props }: LoaderProps) => (
  <Loader variant="spinner" size="lg" text={text} fullScreen {...props} />
);

export const InlineLoader = ({ size = "sm", ...props }: LoaderProps) => (
  <Loader variant="dots" size={size} {...props} />
);

export const CardLoader = ({ text, ...props }: LoaderProps) => (
  <div className="flex items-center justify-center p-8">
    <Loader variant="spinner" size="md" text={text} {...props} />
  </div>
);

// Hook for managing loading states
export function useLoader(initialState = false) {
  const [isLoading, setIsLoading] = React.useState(initialState);

  const startLoading = React.useCallback(() => setIsLoading(true), []);
  const stopLoading = React.useCallback(() => setIsLoading(false), []);
  const toggleLoading = React.useCallback(
    () => setIsLoading((prev) => !prev),
    []
  );

  return {
    isLoading,
    startLoading,
    stopLoading,
    toggleLoading,
    setIsLoading,
  };
}

// Loading wrapper component
export interface LoadingWrapperProps {
  isLoading: boolean;
  loader?: React.ReactNode;
  children: React.ReactNode;
  overlay?: boolean;
  className?: string;
}

export const LoadingWrapper = ({
  isLoading,
  loader,
  children,
  overlay = false,
  className,
}: LoadingWrapperProps) => {
  return (
    <div className={cn("relative", className)}>
      {children}
      {isLoading && (
        <>
          {overlay ? (
            <Loader overlay />
          ) : (
            loader || <Loader variant="spinner" size="md" />
          )}
        </>
      )}
    </div>
  );
};
