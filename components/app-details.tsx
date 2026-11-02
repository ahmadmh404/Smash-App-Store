"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Download,
  Share,
  Heart,
  Smartphone,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

import { RatingStars } from "./rating-stars";
import { RatingBreakdown } from "./rating-breakdown";
import { ReviewCard } from "./preview-card";
import { WriteReviewSection } from "./write-review";
import { IApp } from "@/types";

interface AppDetaulsProsp {
  app: IApp;
}

export default function AppDetails({ app }: AppDetaulsProsp) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedScreenshot, setSelectedScreenshot] = useState(0);

  const formatDownloads = (downloads: number) => {
    if (downloads >= 1000000000) {
      return `${(downloads / 1000000000).toFixed(1)}B+`;
    } else if (downloads >= 1000000) {
      return `${(downloads / 1000000).toFixed(1)}M+`;
    } else if (downloads >= 1000) {
      return `${(downloads / 1000).toFixed(1)}K+`;
    }
    return downloads.toString();
  };

  const formatSize = (bytes: number) => {
    if (bytes >= 1024) {
      return `${(bytes / 1024).toFixed(1)} GB`;
    }
    return `${bytes.toFixed(1)} MB`;
  };

  const formatPrice = (price: number) => {
    return price === 0 ? "Free" : `$${price.toFixed(2)}`;
  };

  const getCurrentGalleryImage = (id: number) => {
    const cImage = app.galleries.filter((gImage) => gImage.id === id);

    return cImage?.[0].path;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="flex-1" />
            <Button variant="ghost" size="sm">
              <Share className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFavorite(!isFavorite)}
            >
              <Heart
                className={`w-4 h-4 ${
                  isFavorite ? "fill-red-500 text-red-500" : ""
                }`}
              />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* App Header */}
            <div className="flex gap-4">
              <img
                src={app.icon}
                alt={app.name}
                className="w-24 h-24 rounded-2xl object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h1 className="text-2xl font-bold">{app.name}</h1>
                    <p className="text-muted-foreground">{app.downloads}</p>
                  </div>
                  {app.recommended && (
                    <Badge variant="secondary">Featured</Badge>
                  )}
                </div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <RatingStars rating={app.app_rate} size="lg" />
                    <span className="font-semibold">{app.app_rate}</span>
                    <span className="text-muted-foreground">
                      ({app.reviews.length} reviews)
                    </span>
                  </div>
                  <Separator orientation="vertical" className="h-4" />
                  <span className="text-muted-foreground">
                    {formatDownloads(app.downloads)} downloads
                  </span>
                </div>
                <div className="flex gap-3">
                  <Button size="lg" className="flex-1 max-w-xs">
                    <Download className="w-4 h-4 mr-2" />
                    {formatPrice(app.price)}
                  </Button>
                  <Button variant="outline" size="lg">
                    <Heart className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Screenshots */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Preview</h2>
              <div className="space-y-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <img
                      src={app.icon}
                      alt={`Screenshot ${selectedScreenshot + 1}`}
                      className="w-full max-w-md rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                    />
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl">
                    <img
                      src={getCurrentGalleryImage(selectedScreenshot)}
                      alt={`Screenshot ${selectedScreenshot + 1}`}
                      className="w-full rounded-lg"
                    />
                  </DialogContent>
                </Dialog>
                <ScrollArea className="w-full whitespace-nowrap">
                  <div className="flex gap-3 pb-4">
                    {app.galleries.map((gallery, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedScreenshot(index)}
                        className={`flex-shrink-0 rounded-lg overflow-hidden border-2 transition-colors ${
                          selectedScreenshot === index
                            ? "border-primary"
                            : "border-transparent"
                        }`}
                      >
                        <img
                          src={gallery.path}
                          alt={`Screenshot ${index + 1}`}
                          className="w-20 h-32 object-cover"
                        />
                      </button>
                    ))}
                  </div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-4">
              <h2 className="text-xl cdfont-semibold">About this {app.type}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {app.description}
              </p>
            </div>

            {/* Features */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">What's New</h2>
              <ul className="space-y-2">
                {app.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Reviews Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Reviews & Ratings</h2>
                <Button variant="outline">Write Review</Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-4xl font-bold">{app.app_rate}</div>
                    <RatingStars rating={app.app_rate} size="lg" />
                    <p className="text-muted-foreground">
                      {app.reviews.length} reviews
                    </p>
                  </div>
                </div>
                <RatingBreakdown reviews={app.reviews} />
              </div>

              <WriteReviewSection />

              <div className="space-y-4">
                {app.reviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* App Info */}
            <Card>
              <CardHeader>
                <h3 className="font-semibold">Information</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Developer</span>
                  <span className="font-medium">{app.developer.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Size</span>
                  <span className="font-medium">{formatSize(app.size)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Category</span>
                  <span className="font-medium">{app.category.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Version</span>
                  <span className="font-medium">{app.version}</span>
                </div>
                {/* <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Age Rating</span>
                  <span className="font-medium">{app.age_rating}</span>
                </div> */}
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Updated</span>
                  <span className="font-medium">
                    {new Date(app.updated_at).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Requirements */}
            <Card>
              <CardHeader>
                <h3 className="font-semibold">Requirements</h3>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {app.requirements.map((requirement, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <span className="w-1 h-1 bg-muted-foreground rounded-full mt-2 flex-shrink-0" />
                      <span className="text-muted-foreground">
                        {requirement}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Developer Info */}
            <Card>
              <CardHeader>
                <h3 className="font-semibold">Developer</h3>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src="/placeholder.svg?height=40&width=40" />
                    <AvatarFallback>SC</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{app.developer.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Game Developer
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Globe className="w-4 h-4 mr-2" />
                    Website
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Smartphone className="w-4 h-4 mr-2" />
                    More Apps
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
