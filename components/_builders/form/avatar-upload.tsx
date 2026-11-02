"use client";

import * as React from "react";
import { User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import { cn } from "@/lib/utils";

interface AvatarUploadProps {
  value?: File | null;
  onChange: (file: File | null) => void;
  name: string;
  id: string;
  disabled?: boolean;
  className?: string;
  fallbackText?: string;
  maxSize?: number; // in bytes
  accept?: string;
  previewUrl?: string; // For displaying existing avatar
}

export function AvatarUpload({
  value,
  onChange,
  name,
  id,
  disabled = false,
  className,
  fallbackText,
  maxSize = 5 * 1024 * 1024, // 5MB default
  accept = "image/*",
  previewUrl,
}: AvatarUploadProps) {
  const [preview, setPreview] = React.useState<string | null>(
    previewUrl || null
  );
  const [error, setError] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Generate initials for fallback
  const getInitials = () => {
    return fallbackText ? fallbackText.charAt(0).toUpperCase() : "U";
  };

  // Update preview when value changes
  React.useEffect(() => {
    if (!value) {
      setPreview(previewUrl || null);
      return;
    }

    const objectUrl = URL.createObjectURL(value);
    setPreview(objectUrl);

    // Clean up the URL when component unmounts
    return () => URL.revokeObjectURL(objectUrl);
  }, [value, previewUrl]);

  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError(null);

    if (!file) {
      return;
    }

    // Validate file size
    if (maxSize && file.size > maxSize) {
      setError(
        `File size exceeds ${Math.round(maxSize / 1024 / 1024)}MB limit`
      );
      return;
    }

    // Validate file type
    if (accept && !accept.includes("*")) {
      const fileType = file.type;
      const acceptedTypes = accept.split(",").map((type) => type.trim());
      if (!acceptedTypes.some((type) => fileType.match(type))) {
        setError(`File type not supported. Please upload ${accept}`);
        return;
      }
    }

    onChange(file);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
    setPreview(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div
      className={cn("flex flex-col items-center space-y-3 group", className)}
    >
      <div
        className={cn(
          "relative cursor-pointer",
          disabled && "opacity-60 cursor-not-allowed"
        )}
        onClick={handleClick}
      >
        <Avatar className="h-24 w-24 border-2 border-muted">
          <AvatarImage src={preview || undefined} alt="Avatar preview" />
          <AvatarFallback className="bg-primary/10 text-primary text-xl">
            {preview ? (
              <span className="animate-pulse">...</span>
            ) : (
              getInitials()
            )}
          </AvatarFallback>
        </Avatar>

        <div className="absolute inset-0 flex items-center justify-center bg-background/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
          <User className="h-8 w-8" />
        </div>

        {preview && (
          <Button
            type="button"
            size="icon"
            variant="destructive"
            className="absolute opacity-0 -top-2 -right-2 h-6 w-6 rounded-full group-hover:opacity-100"
            onClick={handleRemove}
            disabled={disabled}
          >
            <span className="sr-only">Remove</span>
            <svg
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z"
                fill="currentColor"
                fillRule="evenodd"
                clipRule="evenodd"
              ></path>
            </svg>
          </Button>
        )}
      </div>

      <Label
        htmlFor={id}
        className={cn(
          "text-sm text-center cursor-pointer",
          disabled && "cursor-not-allowed opacity-60"
        )}
      >
        {preview ? "Change avatar" : "Upload avatar"}
      </Label>

      <input
        ref={fileInputRef}
        type="file"
        id={id}
        name={name}
        accept={accept}
        disabled={disabled}
        onChange={handleChange}
        className="hidden"
      />

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
