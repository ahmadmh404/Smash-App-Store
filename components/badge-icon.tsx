import { Award, Crown } from "lucide-react";

interface BadgeIconProps {
  badge: "bronze" | "silver" | "gold";
  size?: "sm" | "md" | "lg";
}

export const BadgeIcon = ({ badge, size = "sm" }: BadgeIconProps) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  const colorClasses = {
    bronze: "text-amber-600",
    silver: "text-gray-400",
    gold: "text-yellow-500",
  };

  const Icon = badge === "gold" ? Crown : Award;

  return <Icon className={`${sizeClasses[size]} ${colorClasses[badge]}`} />;
};
