import { Shield, Star, Target, Trophy, Zap } from "lucide-react";
import { UserType } from "./profile-page";
import { Card, CardContent } from "./ui/card";

interface UserStatesProps {
  user: UserType;
}

export const UserStats = ({ user }: UserStatesProps) => {
  const getStatsForRole = () => {
    switch (user.role) {
      case "user":
        return [
          {
            label: "Apps Downloaded",
            value: user.stats.appsDownloaded,
            icon: Target,
          },
          {
            label: "Reviews Written",
            value: user.stats.reviewsWritten,
            icon: Star,
          },
        ];
      case "developer":
        return [
          {
            label: "Apps Published",
            value: user.stats.appsPublished,
            icon: Zap,
          },
          {
            label: "Total Revenue",
            value: `$${user.stats.totalRevenue.toLocaleString()}`,
            icon: Trophy,
          },
          {
            label: "Average Rating",
            value: user.stats.totalRating.toFixed(1),
            icon: Star,
          },
          {
            label: "Apps Downloaded",
            value: user.stats.appsDownloaded,
            icon: Target,
          },
        ];
      case "admin":
        return [
          {
            label: "Apps Published",
            value: user.stats.appsPublished,
            icon: Zap,
          },
          {
            label: "Total Revenue",
            value: `$${user.stats.totalRevenue.toLocaleString()}`,
            icon: Trophy,
          },
          {
            label: "Platform Rating",
            value: user.stats.totalRating.toFixed(1),
            icon: Star,
          },
          {
            label: "Reviews Moderated",
            value: user.stats.reviewsWritten,
            icon: Shield,
          },
        ];
      default:
        return [];
    }
  };

  const stats = getStatsForRole();

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardContent className="p-4 text-center">
            <stat.icon className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
