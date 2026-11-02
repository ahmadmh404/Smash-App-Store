"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";

import type { FormField as FormFieldType } from "../types/form";

interface FormFieldProps {
  field: FormFieldType;
  value: any;
  onChange: (value: any) => void;
  error?: string;
  className?: string;
}

export function FormField({
  field,
  value,
  onChange,
  error,
  className = "",
}: FormFieldProps) {
  const baseClassName = `space-y-3 ${className}`;

  const renderField = () => {
    switch (field.type) {
      case "select":
        return (
          <Select value={value} onValueChange={onChange}>
            <SelectTrigger>
              <SelectValue
                placeholder={field.placeholder || `Select ${field.label}`}
              />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case "textarea":
        return (
          <Textarea
            id={field.id}
            placeholder={field.placeholder}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className={
              error
                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                : ""
            }
          />
        );

      case "checkbox":
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={field.id}
              checked={value || false}
              onCheckedChange={onChange}
            />
            <Label htmlFor={field.id} className="text-sm font-normal">
              {field.label}
            </Label>
          </div>
        );

      case "radio":
        return (
          <RadioGroup value={value} onValueChange={onChange}>
            {field.options?.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem
                  value={option.value}
                  id={`${field.id}-${option.value}`}
                />
                <Label
                  htmlFor={`${field.id}-${option.value}`}
                  className="text-sm font-normal"
                >
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );

      case "switch":
        return (
          <div className="flex items-center space-x-2">
            <Switch
              id={field.id}
              checked={value || false}
              onCheckedChange={onChange}
            />
            <Label htmlFor={field.id} className="text-sm font-normal">
              {field.label}
            </Label>
          </div>
        );

      default:
        return (
          <Input
            id={field.id}
            type={field.type}
            placeholder={field.placeholder}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className={
              error
                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                : ""
            }
          />
        );
    }
  };

  if (field.type === "checkbox" || field.type === "switch") {
    return (
      <div
        className={`py-3 px-4 rounded-lg border border-gray-100 bg-gray-50/50 hover:bg-gray-100/50 transition-colors ${baseClassName}`}
      >
        {renderField()}
        {error && (
          <p className="mt-2 text-sm text-red-600 font-medium">{error}</p>
        )}
      </div>
    );
  }

  return (
    <div className={baseClassName}>
      <Label htmlFor={field.id} className="text-sm font-medium text-gray-700">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      {renderField()}
      {error && (
        <p className="mt-2 text-sm text-red-600 font-medium">{error}</p>
      )}
    </div>
  );
}
