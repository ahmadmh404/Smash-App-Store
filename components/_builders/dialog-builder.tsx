"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Button } from "@/components/ui/button";

import type {
  DialogBuilderProps,
  DialogAction,
  AlertDialogBuilderProps,
  FormDialogBuilderProps,
} from "@/components/_builders/types/dialog";

import { X, AlertTriangle, CheckCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const sizeClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "3xl": "max-w-3xl",
  "4xl": "max-w-4xl",
  "5xl": "max-w-5xl",
  "6xl": "max-w-6xl",
  "7xl": "max-w-7xl",
  full: "max-w-full h-full",
};

const positionClasses = {
  center: "",
  top: "items-start pt-[10vh]",
  bottom: "items-end pb-[10vh]",
};

const variantIcons = {
  destructive: <AlertTriangle className="h-6 w-6 text-destructive" />,
  success: <CheckCircle className="h-6 w-6 text-green-600" />,
  warning: <AlertTriangle className="h-6 w-6 text-yellow-600" />,
  default: null,
};

function ActionButton({
  action,
  onActionClick,
}: {
  action: DialogAction;
  onActionClick: (action: DialogAction) => void;
}) {
  const [loading, setLoading] = React.useState(false);

  const handleClick = async () => {
    if (action.onClick) {
      setLoading(true);
      try {
        await action.onClick();
      } finally {
        setLoading(false);
      }
    }
    onActionClick(action);
  };

  return (
    <Button
      variant={action.variant || "default"}
      size={action.size || "default"}
      className={action.className}
      disabled={action.disabled || loading}
      onClick={handleClick}
    >
      {(loading || action.loading) && (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      )}
      {action.label}
    </Button>
  );
}

export function DialogBuilder({
  trigger,
  open,
  onOpenChange,
  modal = true,
  title,
  description,
  content,
  header,
  body,
  footer,
  actions = [],
  primaryAction,
  secondaryAction,
  className,
  contentClassName,
  headerClassName,
  titleClassName,
  descriptionClassName,
  bodyClassName,
  footerClassName,
  overlayClassName,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  size = "md",
  position = "center",
  variant = "default",
}: DialogBuilderProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const isControlled = open !== undefined;
  const dialogOpen = isControlled ? open : internalOpen;
  const setDialogOpen = isControlled ? onOpenChange : setInternalOpen;

  const handleActionClick = (action: DialogAction) => {
    if (action.autoClose !== false) {
      setDialogOpen?.(false);
    }
  };

  const allActions = React.useMemo(() => {
    const actionsList = [...actions];
    if (secondaryAction) actionsList.unshift(secondaryAction);
    if (primaryAction) actionsList.push(primaryAction);
    return actionsList;
  }, [actions, primaryAction, secondaryAction]);

  const dialogContent = (
    <DialogContent
      className={cn(
        sizeClasses[size],
        contentClassName,
        position !== "center" && positionClasses[position]
      )}
      onPointerDownOutside={
        closeOnOverlayClick ? undefined : (e) => e.preventDefault()
      }
      onEscapeKeyDown={closeOnEscape ? undefined : (e) => e.preventDefault()}
    >
      {showCloseButton && (
        <button
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
          onClick={() => setDialogOpen?.(false)}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
      )}

      {(header || title || description) && (
        <DialogHeader className={headerClassName}>
          {header || (
            <>
              {title && (
                <DialogTitle
                  className={cn("flex items-center gap-2", titleClassName)}
                >
                  {variant !== "default" && variantIcons[variant]}
                  {title}
                </DialogTitle>
              )}
              {description && (
                <DialogDescription className={descriptionClassName}>
                  {description}
                </DialogDescription>
              )}
            </>
          )}
        </DialogHeader>
      )}

      {(body || content) && (
        <div className={cn("py-4", bodyClassName)}>{body || content}</div>
      )}

      {(footer || allActions.length > 0) && (
        <DialogFooter className={footerClassName}>
          {footer || (
            <>
              {allActions.map((action) => (
                <ActionButton
                  key={action.id}
                  action={action}
                  onActionClick={handleActionClick}
                />
              ))}
            </>
          )}
        </DialogFooter>
      )}
    </DialogContent>
  );

  if (trigger) {
    return (
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen} modal={modal}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        {dialogContent}
      </Dialog>
    );
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen} modal={modal}>
      {dialogContent}
    </Dialog>
  );
}

export function AlertDialogBuilder({
  trigger,
  open,
  onOpenChange,
  title,
  description,
  content,
  variant = "destructive",
  cancelText = "Cancel",
  confirmText = "Continue",
  onCancel,
  onConfirm,
  className,
  contentClassName,
  ...props
}: AlertDialogBuilderProps) {
  const [loading, setLoading] = React.useState(false);

  const handleConfirm = async () => {
    if (onConfirm) {
      setLoading(true);
      try {
        await onConfirm();
      } finally {
        setLoading(false);
      }
    }
  };

  const alertContent = (
    <AlertDialogContent className={contentClassName}>
      <AlertDialogHeader>
        <AlertDialogTitle className="flex items-center gap-2">
          {variantIcons[variant as keyof typeof variantIcons]}
          {title}
        </AlertDialogTitle>
        {description && (
          <AlertDialogDescription>{description}</AlertDialogDescription>
        )}
      </AlertDialogHeader>

      {content && <div className="py-4">{content}</div>}

      <AlertDialogFooter>
        <AlertDialogCancel onClick={onCancel}>{cancelText}</AlertDialogCancel>
        <AlertDialogAction
          onClick={handleConfirm}
          disabled={loading}
          className={
            variant === "destructive"
              ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
              : ""
          }
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {confirmText}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );

  if (trigger) {
    return (
      <AlertDialog open={open} onOpenChange={onOpenChange}>
        <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
        {alertContent}
      </AlertDialog>
    );
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      {alertContent}
    </AlertDialog>
  );
}

export function FormDialogBuilder({
  trigger,
  open,
  onOpenChange,
  onSubmit,
  submitText = "Submit",
  cancelText = "Cancel",
  formId = "dialog-form",
  loading = false,
  content,
  ...props
}: FormDialogBuilderProps) {
  const [internalLoading, setInternalLoading] = React.useState(false);
  const isLoading = loading || internalLoading;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (onSubmit) {
      setInternalLoading(true);
      try {
        const formData = new FormData(e.currentTarget);
        await onSubmit(formData);
        onOpenChange?.(false);
      } finally {
        setInternalLoading(false);
      }
    }
  };

  const formContent = (
    <form id={formId} onSubmit={handleSubmit}>
      {content}
    </form>
  );

  const formActions = [
    {
      id: "cancel",
      label: cancelText,
      variant: "outline" as const,
      onClick: () => onOpenChange?.(false),
      autoClose: false,
    },
    {
      id: "submit",
      label: submitText,
      variant: "default" as const,
      loading: isLoading,
      onClick: () => {
        const form = document.getElementById(formId) as HTMLFormElement;
        form?.requestSubmit();
      },
      autoClose: false,
    },
  ];

  return (
    <DialogBuilder
      trigger={trigger}
      open={open}
      onOpenChange={onOpenChange}
      content={formContent}
      actions={formActions}
      {...props}
    />
  );
}
