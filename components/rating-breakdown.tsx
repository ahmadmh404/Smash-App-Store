import { Star } from "lucide-react";
import { Progress } from "./ui/progress";
import { IReview } from "@/types";

interface RatingBreakdownProps {
  reviews: IReview[];
}

export const RatingBreakdown = ({ reviews }: RatingBreakdownProps) => {
  const ratingCounts = [5, 4, 3, 2, 1].map(
    (rating) => reviews.filter((review) => review.rating === rating).length
  );
  const totalReviews = reviews.length;

  return (
    <div className="space-y-2">
      {[5, 4, 3, 2, 1].map((rating, index) => (
        <div key={rating} className="flex items-center gap-3 text-sm">
          <span className="w-3">{rating}</span>
          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
          <Progress
            value={(ratingCounts[index] / totalReviews) * 100}
            className="flex-1 h-2"
          />
          <span className="w-8 text-right text-muted-foreground">
            {ratingCounts[index]}
          </span>
        </div>
      ))}
    </div>
  );
};
