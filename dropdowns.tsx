"use client";

import { Award, Crown, LogOut, LucideUser, Settings } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./components/ui/avatar";
import { Button } from "./components/ui/button";
import { IUser } from "./next-auth";
import { Badge } from "./components/ui/badge";
import { useMutation } from "./lib/react-query/mutation";
import { logout } from "./actions/auth/logout";
import { DropdownBuilderProps } from "./components/_builders/types/dropdown";

export const AvatarDropdownOptions: (user: IUser) => DropdownBuilderProps = (
  user: IUser
) => {
  const highestBadge = user.badges
    ? user.badges[user.badges.length - 1].label
    : null;

  const onLogout = useMutation({ mutationFn: logout });

  const getBadgeIcon = (badge: string | null) => {
    switch (badge) {
      case "gold":
        return <Crown className="w-3 h-3 text-yellow-500" />;
      case "silver":
        return <Award className="w-3 h-3 text-gray-400" />;
      case "bronze":
        return <Award className="w-3 h-3 text-amber-600" />;
      default:
        return null;
    }
  };

  return {
    trigger: (
      <Button variant="ghost" className="relative h-10 w-10 rounded-full">
        <Avatar className="h-10 w-10">
          <AvatarImage
            src={user.avatar || "/placeholder.svg"}
            alt={user.name}
          />

          <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        {user.badges?.length && (
          <div className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 bg-background rounded-full border-2 border-background">
            {getBadgeIcon(highestBadge)}
          </div>
        )}
      </Button>
    ),

    children: (
      <div className="flex items-center justify-start gap-2 p-2">
        <div className="flex flex-col space-y-1 leading-none">
          <p className="font-medium">{user.name}</p>
          <p className="w-[200px] truncate text-sm text-muted-foreground">
            {user.email}
          </p>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs capitalize">
              {user.type}
            </Badge>
            {highestBadge && (
              <Badge
                variant="secondary"
                className="text-xs flex items-center gap-1"
              >
                {getBadgeIcon(highestBadge)}
                {highestBadge}
              </Badge>
            )}
          </div>
        </div>
      </div>
    ),

    items: [
      {
        id: "sep1_item",
        type: "separator",
      },

      {
        id: "profile_item",
        type: "item",
        href: `/profile`,
        label: (
          <div className="flex items-center">
            <LucideUser className="mr-2 h-4 w-3" />
            <span>Profile</span>
          </div>
        ),
      },

      {
        id: "dashboardz_item",
        type: "item",
        href: "/dashboard",

        label: (
          <div className="flex items-center">
            <Settings className="mr-2 h-4 w-3" />
            <span>Dashboard</span>
          </div>
        ),
      },

      {
        id: "sep2_item",
        type: "separator",
      },

      {
        id: "logout_item",
        type: "item",

        label: (
          <div className="flex items-center">
            <LogOut className="mr-2 h-4 w-3" />
            <span>Log out</span>
          </div>
        ),
        onClick: () => onLogout.mutate,
      },
    ],

    disabled: onLogout.isLoading,
    contentClassName: "w-56",
    align: "end",
  };
};
