import { BadgeIcon } from "./badge-icon";
import { UserType } from "./profile-page";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { Progress } from "./ui/progress";

interface AchievementCardProps {
  achievement: UserType["achievements"][0];
}

export const AchievementCard = ({ achievement }: AchievementCardProps) => {
  const isCompleted =
    !achievement.progress ||
    achievement.progress >= (achievement.maxProgress || 0);
  const progressPercentage =
    achievement.progress && achievement.maxProgress
      ? (achievement.progress / achievement.maxProgress) * 100
      : 100;

  return (
    <Card className={`${isCompleted ? "border-primary" : "border-muted"}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div
            className={`p-2 rounded-full ${
              isCompleted ? "bg-primary/10" : "bg-muted"
            }`}
          >
            <BadgeIcon badge={achievement.badge} size="md" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold truncate">{achievement.name}</h3>
              <Badge
                variant={isCompleted ? "default" : "secondary"}
                className="text-xs"
              >
                {achievement.badge}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              {achievement.description}
            </p>
            {achievement.progress &&
              achievement.maxProgress &&
              !isCompleted && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Progress</span>
                    <span>
                      {achievement.progress}/{achievement.maxProgress}
                    </span>
                  </div>
                  <Progress value={progressPercentage} className="h-2" />
                </div>
              )}
            {isCompleted && (
              <p className="text-xs text-muted-foreground">
                Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
