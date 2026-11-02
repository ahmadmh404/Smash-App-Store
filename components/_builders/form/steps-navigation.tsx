"use client";

import type React from "react";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { StepNavigationProps } from "../types/form";

// Simplify the StepProgress component
export function StepProgress({
  currentStep,
  totalSteps,
  steps,
  onGoToStep,
  allowStepNavigation = false,
  getCompletedSteps,
  isStepAccessible,
}: {
  currentStep: number;
  totalSteps: number;
  steps: any[];
  onGoToStep?: (step: number) => void;
  allowStepNavigation?: boolean;
  getCompletedSteps?: () => number[];
  isStepAccessible?: (step: number) => boolean;
}) {
  const progress = ((currentStep + 1) / totalSteps) * 100;
  const completedSteps = getCompletedSteps?.() || [];

  return (
    <div className="space-y-4">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>
            Step {currentStep + 1} of {totalSteps}
          </span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Step Indicators */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = completedSteps.includes(index);
          const isAccessible = isStepAccessible?.(index) ?? true;
          const canClick = allowStepNavigation && isAccessible && onGoToStep;

          return (
            <div key={step.id} className="flex items-center">
              <button
                type="button"
                onClick={canClick ? () => onGoToStep(index) : undefined}
                disabled={!canClick}
                className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors",
                  isActive &&
                    "border-primary bg-primary text-primary-foreground",
                  isCompleted &&
                    !isActive &&
                    "border-green-500 bg-green-500 text-white",
                  !isActive &&
                    !isCompleted &&
                    isAccessible &&
                    "border-muted-foreground text-muted-foreground hover:border-primary",
                  !isAccessible &&
                    "border-muted bg-muted text-muted-foreground cursor-not-allowed",
                  canClick && "cursor-pointer hover:scale-105"
                )}
              >
                {isCompleted ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <span className="text-sm font-medium">{index + 1}</span>
                )}
              </button>

              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "w-12 h-0.5 mx-2",
                    isCompleted ? "bg-green-500" : "bg-muted"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Step Labels */}
      <div className="flex justify-between text-xs text-muted-foreground">
        {steps.map((step, index) => (
          <div key={step.id} className="text-center max-w-20">
            <div
              className={cn(
                "truncate",
                index === currentStep && "text-foreground font-medium"
              )}
            >
              {step.title || `Step ${index + 1}`}
            </div>
            {step.optional && (
              <Badge variant="outline" className="text-xs mt-1">
                Optional
              </Badge>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function StepNavigation({
  currentStep,
  totalSteps,
  canGoNext,
  canGoPrevious,
  isFirstStep,
  isLastStep,
  onNext,
  onPrevious,
  loading = false,
  nextText = "Next",
  previousText = "Previous",
  submitText = "Submit",
  nextButtonProps = {},
  previousButtonProps = {},
  submitButtonProps = {},
  showStepNavigation = false,
}: StepNavigationProps & {
  nextText?: string;
  previousText?: string;
  submitText?: string;
  nextButtonProps?: Record<string, any>;
  previousButtonProps?: Record<string, any>;
  submitButtonProps?: Record<string, any>;
  showStepNavigation?: boolean;
}) {
  const handleNext = async (e: React.MouseEvent) => {
    e.preventDefault();
    await onNext();
  };

  const handlePrevious = async (e: React.MouseEvent) => {
    e.preventDefault();
    await onPrevious();
  };

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4",
        showStepNavigation ? "pt-6" : ""
      )}
    >
      {!isFirstStep && (
        <Button
          type="button"
          variant="outline"
          onClick={handlePrevious}
          disabled={!canGoPrevious || loading}
          {...previousButtonProps}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          {previousText}
        </Button>
      )}

      {!isLastStep ? (
        <Button
          type="button"
          onClick={handleNext}
          disabled={!canGoNext || loading}
          {...nextButtonProps}
        >
          {nextText}
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      ) : (
        <Button type="submit" disabled={loading} {...submitButtonProps}>
          {loading && (
            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          )}
          {submitText}
        </Button>
      )}
    </div>
  );
}
