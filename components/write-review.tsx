import { useState } from "react";

import { Card, CardContent, CardHeader } from "./ui/card";
import { Star } from "lucide-react";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";

export const WriteReviewSection = () => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  return (
    <Card>
      <CardHeader>
        <h3 className="font-semibold">Write a Review</h3>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Your Rating</label>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className="p-1"
              >
                <Star
                  className={`w-6 h-6 ${
                    star <= rating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300 hover:text-yellow-400"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-sm font-medium mb-2 block">Your Review</label>
          <Textarea
            placeholder="Share your experience with this app..."
            value={review}
            onChange={(e) => setReview(e.target.value)}
            rows={4}
          />
        </div>
        <Button
          className="w-full"
          disabled={rating === 0 || review.trim() === ""}
        >
          Submit Review
        </Button>
      </CardContent>
    </Card>
  );
};
