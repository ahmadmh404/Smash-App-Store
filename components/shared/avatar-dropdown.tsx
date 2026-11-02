"use client";

import { IUser } from "@/next-auth";
import { DropdownBuilder } from "../_builders/dropdown-menu-builder";
import { AvatarDropdownOptions } from "@/dropdowns";

interface AvatarDropdownProps {
  user: IUser;
  onNavigate: (path: string) => void;
}

export const AvatarDropdown = ({ user, onNavigate }: AvatarDropdownProps) => {
  return <DropdownBuilder {...AvatarDropdownOptions(user)} />;
};
