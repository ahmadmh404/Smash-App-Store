"use client";

import type * as React from "react";
import { ChevronRight } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type {
  DropdownBuilderProps,
  DropdownCheckboxItem,
  DropdownRadioItem,
  DropdownSubMenu,
  DropdownItem,
  RenderDropdonwItem,
} from "@/components/_builders/types/dropdown";

import { cn } from "@/lib/utils";

function renderDropdownItem({
  item,
  onRadioGroupValueChange,
  radioGroupValue,
}: RenderDropdonwItem): React.ReactNode {
  switch (item.type) {
    case "separator":
      return <DropdownMenuSeparator className={item.className} />;

    case "label":
      return (
        <DropdownMenuLabel className={item.className}>
          {item.label}
        </DropdownMenuLabel>
      );

    case "checkbox":
      const checkboxItem = item as DropdownCheckboxItem;
      return (
        <DropdownMenuCheckboxItem
          checked={checkboxItem.checked}
          onCheckedChange={checkboxItem.onCheckedChange}
          disabled={item.disabled}
          className={item.className}
        >
          {item.label}
        </DropdownMenuCheckboxItem>
      );

    case "radio":
      const radioItem = item as DropdownRadioItem;
      return (
        <DropdownMenuRadioItem
          value={radioItem.value}
          disabled={item.disabled}
          className={item.className}
        >
          {item.label}
        </DropdownMenuRadioItem>
      );

    case "submenu":
      const subMenuItem = item as DropdownSubMenu;
      return (
        <DropdownMenuSub>
          <DropdownMenuSubTrigger
            disabled={item.disabled}
            className={item.className}
          >
            {subMenuItem.icon}
            {item.label}
            <ChevronRight className="ml-auto h-4 w-4" />
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent className={subMenuItem.contentClassName}>
              {subMenuItem.items.map((subItem, key) =>
                renderDropdownItem({
                  item: subItem,
                  radioGroupValue,
                  onRadioGroupValueChange,
                })
              )}
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
      );

    default:
      const defaultItem = item as DropdownItem;
      const ItemComponent = defaultItem?.href ? "a" : "div";

      return (
        <DropdownMenuItem
          disabled={item.disabled}
          className={item.className}
          onClick={defaultItem.onClick}
          asChild={!!defaultItem.href}
        >
          <ItemComponent
            {...(defaultItem.href ? { href: defaultItem.href } : {})}
          >
            {defaultItem.icon}
            {item.label}
            {defaultItem.shortcut && (
              <span className="ml-auto text-xs tracking-widest opacity-60">
                {defaultItem.shortcut}
              </span>
            )}
          </ItemComponent>
        </DropdownMenuItem>
      );
  }
}

export function DropdownBuilder({
  trigger,
  items,
  className,
  contentClassName,
  triggerClassName,
  align = "start",
  side = "bottom",
  sideOffset = 4,
  disabled = false,
  modal = false,
  onOpenChange,
  radioGroupValue,
  onRadioGroupValueChange,
  children,
}: DropdownBuilderProps) {
  const hasRadioItems = items.some((item) => item.type === "radio");

  const renderItems = () => {
    if (hasRadioItems && radioGroupValue !== undefined) {
      return (
        <DropdownMenuRadioGroup
          value={radioGroupValue}
          onValueChange={onRadioGroupValueChange}
        >
          {items.map((item) =>
            renderDropdownItem({
              item,
              radioGroupValue,
              onRadioGroupValueChange,
            })
          )}
        </DropdownMenuRadioGroup>
      );
    }

    return items.map((item, index) =>
      renderDropdownItem({
        item,
        radioGroupValue,
        onRadioGroupValueChange,
      })
    );
  };

  return (
    <DropdownMenu modal={modal} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger
        disabled={disabled}
        className={cn(triggerClassName)}
        asChild
      >
        {trigger}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className={cn(contentClassName)}
        align={align}
        side={side}
        sideOffset={sideOffset}
      >
        {children && children}
        {renderItems()}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
