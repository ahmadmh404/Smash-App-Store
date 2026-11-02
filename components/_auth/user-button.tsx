"use client";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaUser } from "react-icons/fa";
import { useCurrentuser } from "@/hooks/use-current-user";
import { LogouttButton } from "@/components/auth/logout-button";
import { ExitIcon } from "@radix-ui/react-icons";

export const UserButton = () => {
  const user = useCurrentuser();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src={user?.image ?? undefined}></AvatarImage>
          <AvatarFallback className="bg-blue-500">
            <FaUser className="text-white" />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem className="w-32">
          <LogouttButton>
            <ExitIcon className="inline-block size-4 mr-2" />
            Log out
          </LogouttButton>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
