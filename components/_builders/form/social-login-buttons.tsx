"use client";

import type * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Github,
  Twitter,
  Mail,
  Facebook,
  Linkedin,
  Apple,
  Chrome,
} from "lucide-react";

import {
  SocialLoginButtonsProps,
  SocialProvider,
} from "@/components/_builders/types/form";

const defaultProviders: SocialProvider[] = [
  {
    id: "google",
    name: "Google",
    icon: <Chrome className="mr-2 h-4 w-4" />,
  },
  {
    id: "github",
    name: "GitHub",
    icon: <Github className="mr-2 h-4 w-4" />,
  },
  {
    id: "twitter",
    name: "Twitter",
    icon: <Twitter className="mr-2 h-4 w-4" />,
  },
];

const providerIcons: Record<string, React.ReactNode> = {
  google: <Chrome className="mr-2 h-4 w-4" />,
  github: <Github className="mr-2 h-4 w-4" />,
  twitter: <Twitter className="mr-2 h-4 w-4" />,
  facebook: <Facebook className="mr-2 h-4 w-4" />,
  linkedin: <Linkedin className="mr-2 h-4 w-4" />,
  apple: <Apple className="mr-2 h-4 w-4" />,
  email: <Mail className="mr-2 h-4 w-4" />,
  microsoft: <div className="mr-2 h-4 w-4 bg-blue-500 rounded-sm" />,
  discord: <div className="mr-2 h-4 w-4 bg-indigo-500 rounded-sm" />,
};

export function SocialLoginButtons({
  providers = defaultProviders,
  className,
  buttonClassName,
  dividerClassName,
  showDivider = true,
  dividerText = "OR",
  layout = "vertical",
  columns = 2,
  size = "default",
  loading = {},
  onProviderClick,
}: SocialLoginButtonsProps) {
  const handleProviderClick = async (provider: SocialProvider) => {
    try {
      if (provider.onClick) {
        await provider.onClick();
      }
      if (onProviderClick) {
        await onProviderClick(provider.id);
      }
    } catch (error) {
      console.error(`Error with ${provider.name} login:`, error);
    }
  };

  const getLayoutClasses = () => {
    switch (layout) {
      case "horizontal":
        return "flex flex-wrap gap-2 space-y-0";
      case "grid":
        return `grid gap-2 grid-cols-${columns}`;
      case "vertical":
      default:
        return "space-y-2";
    }
  };

  return (
    <div className={cn("w-full space-y-4", className)}>
      <div className={cn(getLayoutClasses())}>
        {providers.map((provider) => {
          const icon =
            provider.icon || providerIcons[provider.id.toLowerCase()] || null;
          const isLoading = loading[provider.id] || false;

          return (
            <Button
              key={provider.id}
              variant={provider.variant || "outline"}
              size={size}
              className={cn(
                layout === "horizontal" ? "flex-1 min-w-0" : "w-full",
                buttonClassName,
                provider.className
              )}
              onClick={() => handleProviderClick(provider)}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                icon
              )}
              {size !== "icon" && (
                <span className="truncate">
                  {layout === "grid" && columns > 2
                    ? provider.name
                    : `Continue with ${provider.name}`}
                </span>
              )}
            </Button>
          );
        })}
      </div>

      {showDivider && (
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span
              className={cn(
                "bg-background px-2 text-muted-foreground",
                dividerClassName
              )}
            >
              {dividerText}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
