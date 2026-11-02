"use client";

import * as React from "react";
import type { FieldValues, UseFormReturn } from "react-hook-form";
import type { FormStep } from "@/components/_builders/types/form";

interface UseFormStepsProps<TFieldValues extends FieldValues = FieldValues> {
  steps: FormStep<TFieldValues>[];
  form: UseFormReturn<TFieldValues>;
  onStepChange?: (step: number, data: TFieldValues) => void;
}

export function useFormSteps<TFieldValues extends FieldValues = FieldValues>({
  steps,
  form,
  onStepChange,
}: UseFormStepsProps<TFieldValues>) {
  const [currentStepIndex, setCurrentStepIndex] = React.useState(0);
  const [completedSteps, setCompletedSteps] = React.useState<Set<number>>(
    new Set()
  );

  const { watch, getValues, trigger, formState } = form;
  const formValues = watch();

  // Filter visible steps based on conditions
  const visibleSteps = React.useMemo(() => {
    return steps.filter((step) => {
      if (!step.conditional) return true;

      const conditionValue = formValues[step.conditional.field];
      const operator = step.conditional.operator || "equals";

      switch (operator) {
        case "equals":
          return conditionValue === step.conditional.value;
        case "not-equals":
          return conditionValue !== step.conditional.value;
        case "includes":
          return (
            Array.isArray(conditionValue) &&
            conditionValue.includes(step.conditional.value)
          );
        case "not-includes":
          return (
            Array.isArray(conditionValue) &&
            !conditionValue.includes(step.conditional.value)
          );
        default:
          return true;
      }
    });
  }, [steps, formValues]);

  const totalSteps = visibleSteps.length;
  const currentStep = Math.min(currentStepIndex, totalSteps - 1);
  const currentStepData = visibleSteps[currentStep];

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  // Get all field names for a step
  const getStepFieldNames = React.useCallback(
    (step: FormStep<TFieldValues>): string[] => {
      const fields: string[] = [];

      if (step.fields) {
        fields.push(...step.fields.map((field) => field.name as string));
      }

      if (step.groups) {
        step.groups.forEach((group) => {
          fields.push(...group.fields.map((field) => field.name as string));
        });
      }

      if (step.sections) {
        step.sections.forEach((section) => {
          section.groups.forEach((group) => {
            fields.push(...group.fields.map((field) => field.name as string));
          });
        });
      }

      return fields;
    },
    []
  );

  const validateStep = React.useCallback(
    async (stepIndex: number): Promise<boolean> => {
      const step = visibleSteps[stepIndex];
      if (!step) return true;

      const stepFields = getStepFieldNames(step);

      try {
        // Use React Hook Form's trigger to validate specific fields
        const isValid = await trigger(stepFields as any[]);

        // Also check if there are any errors for these fields
        const hasErrors = stepFields.some(
          (fieldName) => formState.errors[fieldName as keyof TFieldValues]
        );

        // Testing Purposes
        const stepErrors = stepFields.map(
          (fieldName) => formState.errors[fieldName as keyof TFieldValues]
        );

        return isValid && !hasErrors;
      } catch (error) {
        console.error(`Error validating step ${stepIndex}:`, error);
        return false;
      }
    },
    [visibleSteps, getStepFieldNames, trigger, formState.errors]
  );

  // Go to specific step
  const goToStep = React.useCallback(
    async (stepIndex: number): Promise<boolean> => {
      if (stepIndex < 0 || stepIndex >= totalSteps) {
        return false;
      }

      // If moving forward, validate current step
      if (stepIndex > currentStep) {
        const isCurrentStepValid = await validateStep(currentStep);

        if (!isCurrentStepValid) {
          return false;
        }

        // Mark current step as completed
        setCompletedSteps((prev) => new Set([...prev, currentStep]));
      }

      // Update current step
      setCurrentStepIndex(stepIndex);

      // Call onChange callback
      onStepChange?.(stepIndex, getValues());

      return true;
    },
    [totalSteps, currentStep, validateStep, getValues, onStepChange]
  );

  // Go to next step
  const nextStep = React.useCallback(async (): Promise<boolean> => {
    if (isLastStep) {
      return false;
    }
    return await goToStep(currentStep + 1);
  }, [isLastStep, goToStep, currentStep]);

  // Go to previous step
  const previousStep = React.useCallback(async (): Promise<boolean> => {
    if (isFirstStep) {
      return false;
    }
    return await goToStep(currentStep - 1);
  }, [isFirstStep, goToStep, currentStep]);

  return {
    currentStep,
    totalSteps,
    isFirstStep,
    isLastStep,
    canGoNext: !isLastStep,
    canGoPrevious: !isFirstStep,
    currentStepData,
    goToStep,
    nextStep,
    previousStep,
    validateCurrentStep: () => validateStep(currentStep),
    getStepProgress: () => ((currentStep + 1) / totalSteps) * 100,
    getCompletedSteps: () => Array.from(completedSteps),
    isStepValid: (stepIndex: number) => completedSteps.has(stepIndex),
    isStepAccessible: (stepIndex: number) => stepIndex <= currentStep + 1,
  };
}
