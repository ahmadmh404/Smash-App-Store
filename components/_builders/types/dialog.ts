import type { ReactNode } from "react";

export interface DialogAction {
  id: string;
  label: string | ReactNode;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void | Promise<void>;
  autoClose?: boolean;
}

export interface DialogBuilderProps {
  trigger?: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  modal?: boolean;

  // Content
  title?: string | ReactNode;
  description?: string | ReactNode;
  content?: ReactNode;

  // Layout
  header?: ReactNode;
  body?: ReactNode;
  footer?: ReactNode;

  // Actions
  actions?: DialogAction[];
  primaryAction?: DialogAction;
  secondaryAction?: DialogAction;

  // Styling
  className?: string;
  contentClassName?: string;
  headerClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
  overlayClassName?: string;

  // Behavior
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;

  // Size and positioning
  size?:
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "2xl"
    | "3xl"
    | "4xl"
    | "5xl"
    | "6xl"
    | "7xl"
    | "full";
  position?: "center" | "top" | "bottom";

  // Variants
  variant?: "default" | "destructive" | "success" | "warning";
}

export interface AlertDialogBuilderProps
  extends Omit<DialogBuilderProps, "variant"> {
  variant?: "destructive" | "warning" | "info";
  cancelText?: string;
  confirmText?: string;
  onCancel?: () => void;
  onConfirm?: () => void | Promise<void>;
}

export interface FormDialogBuilderProps extends DialogBuilderProps {
  onSubmit?: (data: FormData) => void | Promise<void>;
  submitText?: string;
  cancelText?: string;
  formId?: string;
  loading?: boolean;
}
