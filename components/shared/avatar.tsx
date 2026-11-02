"use client";

import type React from "react";

import { useState, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Camera, Upload, User, X } from "lucide-react";

interface UserAvatarProps {
  src?: string | null;
  alt?: string;
  fallback?: string;
  name?: string;
  size?: "sm" | "md" | "lg" | "xl" | number;
  className?: string;
  showUpload?: boolean;
  showBadge?: boolean;
  badgeContent?: string;
  badgeVariant?: "default" | "secondary" | "destructive" | "outline";
  onUpload?: (file: File) => void;
  onRemove?: () => void;
  editable?: boolean;
}

const sizeClasses = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-12 w-12",
  xl: "h-16 w-16",
};

const badgePositions = {
  sm: "bottom-0 right-0 h-2.5 w-2.5",
  md: "bottom-0 right-0 h-3 w-3",
  lg: "bottom-0.5 right-0.5 h-3.5 w-3.5",
  xl: "bottom-1 right-1 h-4 w-4",
};

export function UserAvatar({
  src,
  alt,
  fallback,
  name,
  size = "md",
  className,
  showUpload = false,
  showBadge = false,
  badgeContent,
  badgeVariant = "default",
  onUpload,
  onRemove,
  editable = false,
}: UserAvatarProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Generate fallback initials from name
  const getInitials = (name?: string) => {
    if (fallback) return fallback;
    if (!name) return <User className="h-1/2 w-1/2" />;

    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Handle file upload
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file || !onUpload) return;

    setIsUploading(true);
    try {
      await onUpload(file);
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  // Get size classes
  const getSizeClass: () => React.CSSProperties = () => {
    if (typeof size === "number") {
      return { width: size, height: size };
    }
    return sizeClasses[size] as React.CSSProperties;
  };

  const getBadgeSize: () => React.CSSProperties = () => {
    if (typeof size === "number") {
      const badgeSize = Math.max(12, size * 0.25);
      return {
        width: badgeSize,
        height: badgeSize,
        bottom: size * 0.05,
        right: size * 0.05,
      };
    }
    return badgePositions[size] as React.CSSProperties;
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Avatar
        className={cn(
          getSizeClass(),
          "transition-all duration-200",
          editable && "cursor-pointer hover:opacity-80",
          className
        )}
        style={typeof size === "number" ? getSizeClass() : undefined}
        onClick={editable ? () => fileInputRef.current?.click() : undefined}
      >
        <AvatarImage
          src={src || undefined}
          alt={alt || name || "User avatar"}
        />
        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-medium">
          {getInitials(name)}
        </AvatarFallback>
      </Avatar>

      {/* Badge */}
      {showBadge && (
        <Badge
          variant={badgeVariant}
          className={cn(
            "absolute border-2 border-background",
            typeof size === "number" ? "absolute" : getBadgeSize()
          )}
          style={typeof size === "number" ? getBadgeSize() : undefined}
        >
          {badgeContent}
        </Badge>
      )}

      {/* Upload overlay */}
      {editable && isHovered && (
        <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
          <Camera className="h-1/3 w-1/3 text-white" />
        </div>
      )}

      {/* Upload controls */}
      {showUpload && (
        <div className="mt-2 flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            <Upload className="h-4 w-4 mr-1" />
            {isUploading ? "Uploading..." : "Upload"}
          </Button>

          {src && onRemove && (
            <Button size="sm" variant="outline" onClick={onRemove}>
              <X className="h-4 w-4 mr-1" />
              Remove
            </Button>
          )}
        </div>
      )}

      {/* Hidden file input */}
      <Input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />
    </div>
  );
}
