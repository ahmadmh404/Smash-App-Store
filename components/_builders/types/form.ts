import type React from "react";
import type { ReactNode } from "react";
import type { z } from "zod";
import type {
  UseFormProps,
  FieldValues,
  Path,
  Control,
  FieldError,
  UseFormReturn,
  DefaultValues,
} from "react-hook-form";
import type { LoginSchema, registerSchema } from "@/schemas";

export type FieldType =
  | "text"
  | "email"
  | "password"
  | "number"
  | "tel"
  | "url"
  | "search"
  | "textarea"
  | "select"
  | "multiselect"
  | "checkbox"
  | "radio"
  | "switch"
  | "date"
  | "datetime-local"
  | "time"
  | "file"
  | "avatar"
  | "range"
  | "color"
  | "hidden"
  | "custom";

export type FieldWidth = "full" | "half" | "third" | "quarter" | "auto";

// NEW: Message types
export type MessageType = "error" | "success" | "warning" | "info";

export interface FormMessage {
  type: MessageType;
  text: string;
  dismissible?: boolean;
  duration?: number;
}

export interface MessageComponentProps {
  message: FormMessage;
  onDismiss?: () => void;
  className?: string;
}

export interface SelectOption {
  value: string;
  label: string | ReactNode;
  disabled?: boolean;
  description?: string;
}

export interface BaseField<TFieldValues extends FieldValues = FieldValues> {
  id: string;
  name: Path<TFieldValues>;
  type: FieldType;
  label?: string | ReactNode;
  description?: string | ReactNode;
  placeholder?: string;
  disabled?: boolean;
  readonly?: boolean;
  required?: boolean;

  // Layout properties
  width?: FieldWidth;
  className?: string;
  inputClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
  descriptionClassName?: string;

  onChange?: (value: any, formData: TFieldValues) => void;
  onBlur?: (value: any) => void;
  onFocus?: (value: any) => void;
  conditional?: {
    field: Path<TFieldValues>;
    value: any;
    operator?:
      | "equals"
      | "not-equals"
      | "includes"
      | "not-includes"
      | "greater"
      | "less";
  };
}

export interface TextField<TFieldValues extends FieldValues = FieldValues>
  extends BaseField<TFieldValues> {
  type: "text" | "email" | "password" | "tel" | "url" | "search";
  autoComplete?: string;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  spellCheck?: boolean;
}

export interface NumberField<TFieldValues extends FieldValues = FieldValues>
  extends BaseField<TFieldValues> {
  type: "number" | "range";
  min?: number;
  max?: number;
  step?: number;
  showSteppers?: boolean;
}

export interface TextareaField<TFieldValues extends FieldValues = FieldValues>
  extends BaseField<TFieldValues> {
  type: "textarea";
  rows?: number;
  cols?: number;
  resize?: "none" | "both" | "horizontal" | "vertical";
  autoResize?: boolean;
  maxLength?: number;
}

export interface SelectField<TFieldValues extends FieldValues = FieldValues>
  extends BaseField<TFieldValues> {
  type: "select" | "multiselect";
  options: SelectOption[];
  searchable?: boolean;
  clearable?: boolean;
  multiple?: boolean;
  maxSelections?: number;
}

export interface CheckboxField<TFieldValues extends FieldValues = FieldValues>
  extends BaseField<TFieldValues> {
  type: "checkbox";
  options?: SelectOption[];
  layout?: "vertical" | "horizontal" | "grid";
  columns?: number;
}

export interface RadioField<TFieldValues extends FieldValues = FieldValues>
  extends BaseField<TFieldValues> {
  type: "radio";
  options: SelectOption[];
  layout?: "vertical" | "horizontal" | "grid";
  columns?: number;
}

export interface SwitchField<TFieldValues extends FieldValues = FieldValues>
  extends BaseField<TFieldValues> {
  type: "switch";
  size?: "sm" | "md" | "lg";
}

export interface DateField<TFieldValues extends FieldValues = FieldValues>
  extends BaseField<TFieldValues> {
  type: "date" | "datetime-local" | "time";
  min?: string;
  max?: string;
  showCalendar?: boolean;
}

export interface FileField<TFieldValues extends FieldValues = FieldValues>
  extends BaseField<TFieldValues> {
  type: "file";
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  maxFiles?: number;
  preview?: boolean;
  uploadUrl?: string;
}

export interface AvatarField<TFieldValues extends FieldValues = FieldValues>
  extends BaseField<TFieldValues> {
  type: "avatar";
  fallbackText?: string;
  maxSize?: number;
  accept?: string;
  previewUrl?: string;
}

export interface ColorField<TFieldValues extends FieldValues = FieldValues>
  extends BaseField<TFieldValues> {
  type: "color";
  format?: "hex" | "rgb" | "hsl";
  presets?: string[];
}

export interface CustomField<TFieldValues extends FieldValues = FieldValues>
  extends BaseField<TFieldValues> {
  type: "custom";
  component: ReactNode;
  props?: Record<string, any>;
}

export interface HiddenField<TFieldValues extends FieldValues = FieldValues>
  extends BaseField<TFieldValues> {
  type: "hidden";
}

export type FormField<TFieldValues extends FieldValues = FieldValues> =
  | TextField<TFieldValues>
  | NumberField<TFieldValues>
  | TextareaField<TFieldValues>
  | SelectField<TFieldValues>
  | CheckboxField<TFieldValues>
  | RadioField<TFieldValues>
  | SwitchField<TFieldValues>
  | DateField<TFieldValues>
  | FileField<TFieldValues>
  | AvatarField<TFieldValues>
  | ColorField<TFieldValues>
  | CustomField<TFieldValues>
  | HiddenField<TFieldValues>;

// Field Row for explicit row grouping
export interface FieldRow<TFieldValues extends FieldValues = FieldValues> {
  id: string;
  fields: FormField<TFieldValues>[];
  className?: string;
  gap?: "sm" | "md" | "lg";
  align?: "start" | "center" | "end" | "stretch";
}

export interface FieldGroup<TFieldValues extends FieldValues = FieldValues> {
  id: string;
  title?: string | ReactNode;
  description?: string | ReactNode;
  fields?: FormField<TFieldValues>[];
  rows?: FieldRow<TFieldValues>[];
  layout?: "vertical" | "horizontal" | "grid";
  columns?: number;
  className?: string;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  conditional?: {
    field: Path<TFieldValues>;
    value: any;
    operator?: "equals" | "not-equals" | "includes" | "not-includes";
  };
}

export interface FormSection<TFieldValues extends FieldValues = FieldValues> {
  id: string;
  title?: string | ReactNode;
  description?: string | ReactNode;
  groups: FieldGroup<TFieldValues>[];
  className?: string;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}

// Enhanced FormStep with Zod integration
export interface FormStep<
  TFieldValues extends FieldValues = FieldValues,
  TStepSchema extends z.ZodType<any, any, any> = z.ZodType<
    Partial<TFieldValues>
  >
> {
  id: string;
  title?: string | ReactNode;
  description?: string | ReactNode;

  // Content
  fields?: FormField<TFieldValues>[];
  rows?: FieldRow<TFieldValues>[];
  groups?: FieldGroup<TFieldValues>[];
  sections?: FormSection<TFieldValues>[];

  // Step behavior
  optional?: boolean;
  skippable?: boolean;

  // Conditional rendering
  conditional?: {
    field: Path<TFieldValues>;
    value: any;
    operator?:
      | "equals"
      | "not-equals"
      | "includes"
      | "not-includes"
      | "greater"
      | "less";
  };

  // Validation
  schema?: TStepSchema;
  validateOnEnter?: boolean;
  validateOnLeave?: boolean;

  // Lifecycle callbacks
  onEnter?: (data: TFieldValues) => void | Promise<void>;
  onLeave?: (data: TFieldValues) => void | Promise<void>;
  onNext?: (data: TFieldValues) => boolean | Promise<boolean>;
  onPrevious?: (data: TFieldValues) => boolean | Promise<boolean>;
  onValidate?: (data: Partial<TFieldValues>) => Promise<Record<string, string>>;

  // Styling
  className?: string;
}

// Social login configuration
export interface SocialLoginConfig {
  providers?: SocialProvider[];
  position?: "top" | "bottom" | "both";
  layout?: "horizontal" | "vertical" | "grid";
  columns?: number;
  showDivider?: boolean;
  dividerText?: string;
  className?: string;
  buttonClassName?: string;
  size?: "default" | "sm" | "lg" | "icon";
  onProviderClick?: (providerId: string) => void | Promise<void>;
  loading?: Record<string, boolean>;
}

export interface FormBuilderProps<
  TFieldValues extends FieldValues = FieldValues,
  TSchema extends z.ZodType<any, any, any> = z.ZodType<TFieldValues>
> {
  // Form metadata
  title?: string | ReactNode;
  description?: string | ReactNode;

  // Form structure
  fields?: FormField<TFieldValues>[];
  rows?: FieldRow<TFieldValues>[];
  groups?: FieldGroup<TFieldValues>[];
  sections?: FormSection<TFieldValues>[];
  steps?: FormStep<TFieldValues, any>[];

  // Schema and validation
  schema: TSchema;
  resolver?: any;

  // Step configuration
  currentStep?: number;
  onStepChange?: (step: number, data: TFieldValues) => void;
  showStepNavigation?: boolean;
  showStepProgress?: boolean;
  stepNavigationPosition?: "top" | "bottom" | "both";
  allowStepNavigation?: boolean;
  validateStepOnNext?: boolean;
  validateAllStepsOnSubmit?: boolean;

  // Social login integration
  socialLogin?: SocialLoginConfig;

  // NEW: Message configuration
  message?: FormMessage;
  messageComponent?: React.ComponentType<MessageComponentProps>;
  messagePosition?: "top" | "bottom";
  onMessageDismiss?: () => void;

  // React Hook Form integration
  form?: UseFormReturn<TFieldValues>;
  formProps?: UseFormProps<TFieldValues>;

  // Form handlers
  onSubmit?: (data: TFieldValues, formData: FormData) => void | Promise<void>;
  onError?: (errors: any) => void;
  onChange?: (data: TFieldValues) => void;

  // Layout
  layout?: "vertical" | "horizontal" | "grid";
  columns?: number;
  spacing?: "sm" | "md" | "lg";

  // Styling
  className?: string;
  formClassName?: string;
  fieldClassName?: string;
  groupClassName?: string;
  sectionClassName?: string;
  stepClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;

  // Behavior
  mode?: "onChange" | "onBlur" | "onSubmit" | "onTouched" | "all";
  reValidateMode?: "onChange" | "onBlur" | "onSubmit";
  disabled?: boolean;
  loading?: boolean;

  // Actions
  showSubmit?: boolean;
  showReset?: boolean;
  submitText?: string;
  resetText?: string;
  nextText?: string;
  previousText?: string;
  submitButtonProps?: Record<string, any>;
  resetButtonProps?: Record<string, any>;
  nextButtonProps?: Record<string, any>;
  previousButtonProps?: Record<string, any>;
  customActions?: ReactNode;

  // Default values
  defaultValues?: DefaultValues<TFieldValues>;

  // show back button
  backButtonConfig?: BackButtonConfig;
}

// Utility types for better TypeScript inference
export type InferFormData<T extends z.ZodType<any, any, any>> = z.infer<T>;

export interface FormFieldProps<
  TFieldValues extends FieldValues = FieldValues
> {
  field: FormField<TFieldValues>;
  control: Control<TFieldValues>;
  error?: FieldError;
  formData: TFieldValues;
}

export interface StepNavigationProps {
  currentStep: number;
  totalSteps: number;
  canGoNext: boolean;
  canGoPrevious: boolean;
  isFirstStep: boolean;
  isLastStep: boolean;
  onNext: () => Promise<boolean>;
  onPrevious: () => Promise<boolean>;
  loading?: boolean;
}

export interface UseFormStepsOptions<
  TFieldValues extends FieldValues = FieldValues,
  TSchema extends z.ZodType<any, any, any> = z.ZodType<TFieldValues>
> {
  steps: FormStep<TFieldValues, any>[];
  form: UseFormReturn<TFieldValues>;
  schema: TSchema;
  validateStepOnNext?: boolean;
  onStepChange?: (step: number, data: TFieldValues) => void;
}

export interface UseFormStepsReturn<
  TFieldValues extends FieldValues = FieldValues
> {
  currentStep: number;
  totalSteps: number;
  isFirstStep: boolean;
  isLastStep: boolean;
  canGoNext: boolean;
  canGoPrevious: boolean;
  currentStepData: FormStep<TFieldValues, any> | undefined;
  goToStep: (step: number) => Promise<boolean>;
  nextStep: () => Promise<boolean>;
  previousStep: () => Promise<boolean>;
  validateCurrentStep: () => Promise<StepValidationResult>;
  getStepProgress: () => number;
  getCompletedSteps: () => number[];
  isStepValid: (stepIndex: number) => boolean;
  isStepAccessible: (stepIndex: number) => boolean;
}

export interface StepValidationResult {
  isValid: boolean;
  errors: Record<string, any>;
}

// Schema utilities for multi-step forms
export type StepSchemaMap<TSteps extends readonly FormStep<any, any>[]> = {
  [K in keyof TSteps]: TSteps[K] extends FormStep<any, infer TStepSchema>
    ? TStepSchema
    : never;
};

export type CombinedStepSchema<TSteps extends readonly FormStep<any, any>[]> =
  TSteps extends readonly [infer First, ...infer Rest]
    ? First extends FormStep<any, infer FirstSchema>
      ? Rest extends readonly FormStep<any, any>[]
        ? FirstSchema extends z.ZodType<any, any, any>
          ? CombinedStepSchema<Rest> extends z.ZodType<any, any, any>
            ? z.ZodIntersection<FirstSchema, CombinedStepSchema<Rest>>
            : FirstSchema
          : CombinedStepSchema<Rest>
        : FirstSchema
      : never
    : z.ZodObject<{}>;

export interface SocialProvider {
  id: string;
  name: string;
  icon?: React.ReactNode;
  variant?: "default" | "outline" | "secondary" | "ghost";
  className?: string;
  onClick?: () => void | Promise<void>;
}

export interface SocialLoginButtonsProps {
  providers: SocialProvider[];
  className?: string;
  buttonClassName?: string;
  dividerClassName?: string;
  showDivider?: boolean;
  dividerText?: string;
  layout?: "horizontal" | "vertical" | "grid";
  columns?: number;
  size?: "default" | "sm" | "lg" | "icon";
  loading?: Record<string, boolean>;
  onProviderClick?: (providerId: string) => void | Promise<void>;
}

export type BackButtonConfig = {
  backButtonLabel: string;
  backButtonHref: string;
};

// login schema type
export type LoginSchemaValues = z.infer<typeof LoginSchema>;
export type registerSchemaType = z.infer<typeof registerSchema>;
