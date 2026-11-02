"use client";

import { IApp } from "@/types";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

import { Star, TrendingUp } from "lucide-react";
import Link from "next/link";

interface AppCardProps {
  app: IApp;
  size?: "default" | "large";
}

export const AppCard = ({ app, size = "default" }: AppCardProps) => {
  const formatSize = (bytes: number) => {
    if (bytes >= 1024) {
      return `${(bytes / 1024).toFixed(1)} GB`;
    }
    return `${bytes.toFixed(1)} MB`;
  };

  const formatPrice = (price: number) => {
    return price === 0 ? "Free" : `$${price.toFixed(2)}`;
  };

  if (size === "large") {
    return (
      <Link href={`/s/${app.id}`}>
        <Card className="w-80 flex-shrink-0">
          <CardContent className="p-4">
            <div className="flex gap-4">
              <img
                src={app.icon || "/placeholder.svg"}
                alt={app.name}
                className="w-16 h-16 rounded-xl object-cover"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-lg truncate">
                      {app.name}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                      {app.description}
                    </p>
                  </div>
                  {app.recommended && (
                    <Badge variant="secondary" className="ml-2 flex-shrink-0">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      Featured
                    </Badge>
                  )}
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>{app.app_rate}</span>
                    </div>
                    <span>{formatSize(app.size)}</span>
                  </div>
                  <Button size="sm" className="flex-shrink-0">
                    {formatPrice(app.price)}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  }

  return (
    <Link href={`/s/${app.id}`}>
      <Card className="w-40 flex-shrink-0">
        <CardContent className="p-3">
          <div className="space-y-3">
            <div className="relative">
              <img
                src={app.icon || "/placeholder.svg"}
                alt={app.name}
                className="w-full aspect-square rounded-xl object-cover"
              />
              {app.recommended && (
                <Badge
                  variant="secondary"
                  className="absolute -top-1 -right-1 text-xs px-1.5 py-0.5"
                >
                  Featured
                </Badge>
              )}
            </div>
            <div className="space-y-1">
              <h3 className="font-medium text-sm truncate">{app.name}</h3>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span>{app.app_rate}</span>
              </div>
              <div className="text-xs text-muted-foreground">
                {formatSize(app.size)}
              </div>
            </div>
            <Button size="sm" className="w-full text-xs">
              {formatPrice(app.price)}
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
