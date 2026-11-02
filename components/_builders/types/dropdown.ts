import type { ReactNode } from "react";

export interface DropdownItemBase {
  id: string;
  label: string | ReactNode;
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
}

export interface DropdownSeparator {
  type: "separator";
  id: string;
  className?: string;
}

export interface DropdownLabel {
  type: "label";
  id: string;
  label: string | ReactNode;
  className?: string;
}

export interface DropdownItem extends DropdownItemBase {
  type?: "item";
  icon?: ReactNode;
  shortcut?: string;
  href?: string;
}

export interface DropdownCheckboxItem extends DropdownItemBase {
  type: "checkbox";
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export interface DropdownRadioItem extends DropdownItemBase {
  type: "radio";
  value: string;
  checked?: boolean;
}

export interface DropdownSubMenu extends Omit<DropdownItemBase, "onClick"> {
  type: "submenu";
  icon?: ReactNode;
  items: DropdownMenuItemType[];
  contentClassName?: string;
}

export type DropdownMenuItemType =
  | DropdownItem
  | DropdownCheckboxItem
  | DropdownRadioItem
  | DropdownSubMenu
  | DropdownSeparator
  | DropdownLabel;

export interface DropdownBuilderProps {
  trigger: ReactNode;
  items: DropdownMenuItemType[];
  className?: string;
  contentClassName?: string;
  triggerClassName?: string;
  align?: "start" | "center" | "end";
  side?: "top" | "right" | "bottom" | "left";
  sideOffset?: number;
  disabled?: boolean;
  modal?: boolean;
  children?: React.ReactNode;
  onOpenChange?: (open: boolean) => void;
  radioGroupValue?: string;
  onRadioGroupValueChange?: (value: string) => void;
}

export type RenderDropdonwItem = {
  item: DropdownMenuItemType;
  radioGroupValue?: string;
  onRadioGroupValueChange?: (value: string) => void;
};
