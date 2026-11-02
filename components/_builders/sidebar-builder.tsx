"use client";

import React, { type ReactNode } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarProvider,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import { cn } from "@/lib/utils";

import { ChevronDown } from "lucide-react";

// Updated types for sidebar configuration
export type SectionType = "basic" | "collapsible";

export interface TabConfig {
  id: string;
  label: string;
  contentConfig: {
    content: ReactNode;
    className?: string;
  };
}

export interface TabsConfig {
  tabs: TabConfig[];
  tabsListConifg?: {
    className?: string;
  };
}

export interface SectionConfig {
  id: string;
  type: SectionType;
  title?: string;
  content?: ReactNode;
  collapsible?: {
    defaultOpen?: boolean;
  };
}

export interface SidebarConfig {
  header?: ReactNode;
  body: {
    tabsConfig?: TabsConfig;
    content?: ReactNode;
  };
  footer?: ReactNode;
  side?: "left" | "right";
  variant?: "sidebar" | "floating" | "inset";
  collapsible?: "offcanvas" | "icon" | "none";
  className?: string;
  defaultOpen?: boolean;
  defaultTab?: string;
}

interface SidebarBuilderProps {
  config: SidebarConfig;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function SidebarBuilder({
  config,
  open,
  onOpenChange,
}: SidebarBuilderProps) {
  const {
    header,
    body: { tabsConfig, content },
    footer,
    side = "left",
    variant = "sidebar",
    collapsible = "none",
    className,
    defaultOpen = true,
    defaultTab,
  } = config;

  // Use the first tab as default if not specified
  const defaultTabValue = defaultTab || tabsConfig?.tabs?.[0]?.id;

  return (
    <div className={className ?? ""}>
      <SidebarProvider
        defaultOpen={defaultOpen}
        open={open}
        onOpenChange={onOpenChange}
      >
        <div className="w-full h-fit bg-card rounded-2xl shadow-sm p-5 space-y-3">
          <Sidebar side={side} variant={variant} collapsible={collapsible}>
            {header && <SidebarHeader>{header}</SidebarHeader>}

            <SidebarContent>
              {tabsConfig?.tabs && (
                <Tabs defaultValue={defaultTabValue} className="w-full">
                  <TabsList
                    className={cn(
                      "w-full flex gap-x-2",
                      tabsConfig.tabsListConifg?.className ?? ""
                    )}
                  >
                    {tabsConfig?.tabs.map((tab) => (
                      <TabsTrigger
                        key={tab.id}
                        value={tab.id}
                        className="flex-1"
                      >
                        {tab.label}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {tabsConfig?.tabs.map((tab) => (
                    <TabsContent
                      key={tab.id}
                      value={tab.id}
                      className={cn(
                        "w-full",
                        tab.contentConfig.className ?? ""
                      )}
                    >
                      {tab.contentConfig.content}
                    </TabsContent>
                  ))}
                </Tabs>
              )}

              {content && <div className="w-full">{content}</div>}
            </SidebarContent>

            {footer && <SidebarFooter>{footer}</SidebarFooter>}
          </Sidebar>
        </div>
      </SidebarProvider>
    </div>
  );
}
