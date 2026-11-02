"use client";

import { useState } from "react";
import { Mail, Calendar, Edit, Save, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { BadgeIcon } from "./badge-icon";
import { UserStats } from "./user-states";
import { AchievementCard } from "./achievement-card";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";

export interface UserType {
  id: number;
  name: string;
  email: string;
  avatar: string;
  role: "user" | "developer" | "admin";
  badges: ("bronze" | "silver" | "gold")[];
  joinDate: string;
  bio?: string;
  location?: string;
  website?: string;
  stats: {
    appsDownloaded: number;
    appsPublished: number;
    totalRevenue: number;
    totalRating: number;
    reviewsWritten: number;
  };
  achievements: {
    id: string;
    name: string;
    description: string;
    badge: "bronze" | "silver" | "gold";
    unlockedAt: string;
    progress?: number;
    maxProgress?: number;
  }[];
}

// Mock user data with achievements
const mockUser: UserType = {
  id: 1,
  name: "John Doe",
  email: "john@example.com",
  avatar: "/placeholder.svg?height=120&width=120",
  role: "developer",
  badges: ["bronze", "silver", "gold"],
  joinDate: "2023-01-15",
  bio: "Passionate mobile app developer with 5+ years of experience creating innovative solutions.",
  location: "San Francisco, CA",
  website: "https://johndoe.dev",
  stats: {
    appsDownloaded: 45,
    appsPublished: 8,
    totalRevenue: 12500,
    totalRating: 4.7,
    reviewsWritten: 23,
  },
  achievements: [
    {
      id: "first-app",
      name: "First Steps",
      description: "Published your first app",
      badge: "bronze",
      unlockedAt: "2023-02-01",
    },
    {
      id: "revenue-milestone",
      name: "Revenue Milestone",
      description: "Earned $10,000 in total revenue",
      badge: "silver",
      unlockedAt: "2023-08-15",
    },
    {
      id: "top-developer",
      name: "Top Developer",
      description: "Achieved 4.5+ average rating across all apps",
      badge: "gold",
      unlockedAt: "2023-12-01",
    },
    {
      id: "download-master",
      name: "Download Master",
      description: "Reach 100,000 total downloads",
      badge: "gold",
      unlockedAt: "2024-01-10",
      progress: 85000,
      maxProgress: 100000,
    },
    {
      id: "community-contributor",
      name: "Community Contributor",
      description: "Write 50 helpful reviews",
      badge: "silver",
      unlockedAt: "2023-11-20",
      progress: 23,
      maxProgress: 50,
    },
  ],
};

// Add the form schema after the imports and before the component definitions
const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  bio: z
    .string()
    .max(500, {
      message: "Bio must not be longer than 500 characters.",
    })
    .optional(),
  location: z
    .string()
    .max(100, {
      message: "Location must not be longer than 100 characters.",
    })
    .optional(),
  website: z
    .string()
    .url({
      message: "Please enter a valid URL.",
    })
    .optional()
    .or(z.literal("")),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function ProfilePage({
  initialUser = mockUser,
}: {
  initialUser?: UserType;
}) {
  const [user, setUser] = useState(initialUser);
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user.name,
      bio: user.bio || "",
      location: user.location || "",
      website: user.website || "",
    },
  });

  const getHighestBadge = () => {
    if (user.badges.includes("gold")) return "gold";
    if (user.badges.includes("silver")) return "silver";
    if (user.badges.includes("bronze")) return "bronze";
    return null;
  };

  const handleSave = (values: ProfileFormValues) => {
    setUser({
      ...user,
      name: values.name,
      bio: values.bio || "",
      location: values.location || "",
      website: values.website || "",
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    form.reset({
      name: user.name,
      bio: user.bio || "",
      location: user.location || "",
      website: user.website || "",
    });
    setIsEditing(false);
  };

  const highestBadge = getHighestBadge();
  const completedAchievements = user.achievements.filter(
    (a) => !a.progress || a.progress >= (a.maxProgress || 0)
  );
  const inProgressAchievements = user.achievements.filter(
    (a) => a.progress && a.progress < (a.maxProgress || 0)
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="space-y-8">
          {/* Profile Header */}
          <Card>
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex flex-col items-center md:items-start">
                  <div className="relative">
                    <Avatar className="w-32 h-32">
                      <AvatarImage
                        src={user.avatar || "/placeholder.svg"}
                        alt={user.name}
                      />
                      <AvatarFallback className="text-2xl">
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {highestBadge && (
                      <div className="absolute -top-2 -right-2 flex items-center justify-center w-10 h-10 bg-background rounded-full border-4 border-background shadow-lg">
                        <BadgeIcon badge={highestBadge} size="lg" />
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    <Badge variant="outline" className="capitalize">
                      {user.role}
                    </Badge>
                    {highestBadge && (
                      <Badge
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        <BadgeIcon badge={highestBadge} size="sm" />
                        {highestBadge} Member
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex-1 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      {!isEditing && (
                        <>
                          <h1 className="text-3xl font-bold">{user.name}</h1>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Mail className="w-4 h-4" />
                            <span>{user.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            <span>
                              Joined{" "}
                              {new Date(user.joinDate).toLocaleDateString()}
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {isEditing ? (
                        <>
                          <Button
                            onClick={form.handleSubmit(handleSave)}
                            size="sm"
                          >
                            <Save className="w-4 h-4 mr-2" />
                            Save
                          </Button>
                          <Button
                            onClick={handleCancel}
                            variant="outline"
                            size="sm"
                          >
                            <X className="w-4 h-4 mr-2" />
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <Button
                          onClick={() => setIsEditing(true)}
                          variant="outline"
                          size="sm"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Profile
                        </Button>
                      )}
                    </div>
                  </div>

                  {isEditing ? (
                    <Form {...form}>
                      <form className="space-y-6">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Name</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="bio"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Bio</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Tell us about yourself..."
                                  className="resize-none"
                                  rows={3}
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                Brief description for your profile. Max 500
                                characters.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="location"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Location</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Your location"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="website"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Website</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="https://example.com"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </form>
                    </Form>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium">Bio</Label>
                        <p className="text-muted-foreground mt-1">
                          {user.bio || "No bio provided yet."}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium">
                            Location
                          </Label>
                          <p className="text-muted-foreground mt-1">
                            {user.location || "Not specified"}
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Website</Label>
                          <p className="text-muted-foreground mt-1">
                            {user.website ? (
                              <a
                                href={user.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline"
                              >
                                {user.website}
                              </a>
                            ) : (
                              "Not specified"
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Statistics */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Statistics</h2>
            <UserStats user={user} />
          </div>

          {/* Achievements & Badges */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Achievements & Badges</h2>
              <p className="text-muted-foreground">
                Your highest badge:{" "}
                {highestBadge ? (
                  <span className="inline-flex items-center gap-1 font-medium">
                    <BadgeIcon badge={highestBadge} size="sm" />
                    {highestBadge.charAt(0).toUpperCase() +
                      highestBadge.slice(1)}
                  </span>
                ) : (
                  "No badges earned yet"
                )}
              </p>
            </div>

            {completedAchievements.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Completed Achievements
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {completedAchievements.map((achievement) => (
                    <AchievementCard
                      key={achievement.id}
                      achievement={achievement}
                    />
                  ))}
                </div>
              </div>
            )}

            {inProgressAchievements.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4">In Progress</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {inProgressAchievements.map((achievement) => (
                    <AchievementCard
                      key={achievement.id}
                      achievement={achievement}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
