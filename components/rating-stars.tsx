import { Star } from "lucide-react";

interface RatingStarsProps {
  rating: number;
  size?: "sm" | "lg";
}

export const RatingStars = ({ rating, size = "sm" }: RatingStarsProps) => {
  const starSize = size === "lg" ? "w-5 h-5" : "w-4 h-4";

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${starSize} ${
            star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );
};
