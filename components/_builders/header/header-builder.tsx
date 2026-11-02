"use client";

import React from "react";
import { Search, Menu, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { IUser } from "@/next-auth";
import { NavItem } from "./types";

export interface HeaderBuilderProps {
  brand?: {
    text?: string;
    logo?: string;
    href?: string;
  };

  navItems?: NavItem[];

  search?: {
    placeholder?: string;
    onSearch?: (query: string) => void;
    disabled?: boolean;
  };

  user?: IUser;
  userMenuItems?: Array<{
    label: string;
    onClick: () => void;
    separator?: boolean;
  }>;
  onLogout?: () => void;

  actions?: Array<{
    label: string;
    onClick: () => void;
    variant?:
      | "default"
      | "destructive"
      | "outline"
      | "secondary"
      | "ghost"
      | "link";
    icon?: React.ReactNode;
  }>;

  mobileMenuItems?: NavItem[];

  className?: string;
  sticky?: boolean;
  transparent?: boolean;

  onNavigate?: (href: string) => void;
}

export function HeaderBuilder({
  brand,
  navItems = [],
  search,
  user,
  userMenuItems = [],
  onLogout,
  actions = [],
  mobileMenuItems,
  className = "",
  sticky = true,
  transparent = false,
  onNavigate,
}: HeaderBuilderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search?.onSearch) {
      search.onSearch(searchQuery);
    }
  };

  const handleNavClick = (href: string) => {
    if (onNavigate) {
      onNavigate(href);
    }
    setMobileMenuOpen(false);
  };

  const headerClasses = `
    ${sticky ? "sticky top-0 z-50" : ""}
    ${
      transparent
        ? "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
        : "bg-background"
    }
    border-b
    ${className}
  `.trim();

  return (
    <header className={headerClasses}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-4">
          {/* Brand/Logo */}
          {brand && (
            <div className="flex items-center gap-2">
              {brand.logo && (
                <img
                  src={brand.logo || "/placeholder.svg"}
                  alt="Logo"
                  className="h-8 w-8 object-contain"
                />
              )}
              {brand.text && (
                <h1
                  className="text-2xl font-bold text-primary cursor-pointer"
                  onClick={() => brand.href && handleNavClick(brand.href)}
                >
                  {brand.text}
                </h1>
              )}
            </div>
          )}

          {/* Desktop Navigation */}
          {navItems.length > 0 && (
            <nav className="hidden md:flex items-center gap-6">
              {navItems.map((item, index) => (
                <div key={index} className="relative">
                  <button
                    onClick={() => handleNavClick(item.href)}
                    className={`
                      text-sm font-medium transition-colors hover:text-primary
                      ${
                        item.isActive ? "text-primary" : "text-muted-foreground"
                      }
                    `}
                  >
                    {item.label}
                    {item.badge && (
                      <Badge variant="secondary" className="ml-2 text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </button>
                </div>
              ))}
            </nav>
          )}

          {/* Search */}
          {search && (
            <div className="flex-1 max-w-md">
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder={search.placeholder || "Search..."}
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    disabled={search.disabled}
                  />
                </div>
              </form>
            </div>
          )}

          {/* Actions */}
          {actions.length > 0 && (
            <div className="hidden md:flex items-center gap-2">
              {actions.map((action, index) => (
                <Button
                  key={index}
                  variant={action.variant || "default"}
                  onClick={action.onClick}
                  size="sm"
                >
                  {action.icon && <span className="mr-2">{action.icon}</span>}
                  {action.label}
                </Button>
              ))}
            </div>
          )}

          {/* User Menu */}
          {user && (
            <div className="ml-auto">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={user.avatar || "/placeholder.svg"}
                        alt={user.name}
                      />
                      <AvatarFallback>
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex flex-col space-y-1 p-2">
                    <p className="text-sm font-medium leading-none">
                      {user.name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                  <DropdownMenuSeparator />
                  {userMenuItems.map((item, index) => (
                    <React.Fragment key={index}>
                      {item.separator && <DropdownMenuSeparator />}
                      <DropdownMenuItem onClick={item.onClick}>
                        {item.label}
                      </DropdownMenuItem>
                    </React.Fragment>
                  ))}
                  {onLogout && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={onLogout}>
                        Log out
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}

          {/* Mobile Menu Button */}
          {(navItems.length > 0 || mobileMenuItems) && (
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden ml-auto"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          )}
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (navItems.length > 0 || mobileMenuItems) && (
          <div className="md:hidden mt-4 pb-4 border-t pt-4">
            <nav className="flex flex-col space-y-2">
              {(mobileMenuItems || navItems).map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleNavClick(item.href)}
                  className={`
                    text-left px-2 py-2 text-sm font-medium transition-colors hover:text-primary rounded-md hover:bg-accent
                    ${
                      item.isActive
                        ? "text-primary bg-accent"
                        : "text-muted-foreground"
                    }
                  `}
                >
                  <div className="flex items-center justify-between">
                    {item.label}
                    {item.badge && (
                      <Badge variant="secondary" className="text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </div>
                </button>
              ))}
            </nav>

            {/* Mobile Actions */}
            {actions.length > 0 && (
              <div className="mt-4 pt-4 border-t space-y-2">
                {actions.map((action, index) => (
                  <Button
                    key={index}
                    variant={action.variant || "default"}
                    onClick={action.onClick}
                    className="w-full justify-start"
                    size="sm"
                  >
                    {action.icon && <span className="mr-2">{action.icon}</span>}
                    {action.label}
                  </Button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
