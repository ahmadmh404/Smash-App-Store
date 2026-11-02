import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

import { IReview } from "@/types";

import { MoreVertical, Shield, ThumbsDown, ThumbsUp } from "lucide-react";
import { RatingStars } from "@/components/rating-stars";

export const ReviewCard = ({ review }: { review: IReview }) => {
  const [helpful, setHelpful] = useState(false);
  const [notHelpful, setNotHelpful] = useState(false);

  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarImage
                  src={review.user.avatar || "/placeholder.svg"}
                  alt={review.user.name}
                />
                <AvatarFallback>{review.user.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{review.user.name}</span>
                  {review.user.verified && (
                    <Badge variant="secondary" className="text-xs">
                      <Shield className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                  {review.verified_purchase && (
                    <Badge variant="outline" className="text-xs">
                      Verified Purchase
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <RatingStars rating={review.rating} />
                  <span>•</span>
                  <span>{new Date(review.date).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>v{review.version_reviewed}</span>
                </div>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Report review</DropdownMenuItem>
                <DropdownMenuItem>Block user</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div>
            <h4 className="font-medium mb-1">{review.title}</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {review.comment}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className={`text-xs ${helpful ? "text-green-600" : ""}`}
                onClick={() => {
                  setHelpful(!helpful);
                  if (notHelpful) setNotHelpful(false);
                }}
              >
                <ThumbsUp className="w-3 h-3 mr-1" />
                Helpful ({review.helpful_count + (helpful ? 1 : 0)})
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={`text-xs ${notHelpful ? "text-red-600" : ""}`}
                onClick={() => {
                  setNotHelpful(!notHelpful);
                  if (helpful) setHelpful(false);
                }}
              >
                <ThumbsDown className="w-3 h-3 mr-1" />
                Not helpful
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
