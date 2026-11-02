"use client";

import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { CategorySection } from "@/components/category-section";

import { Search } from "lucide-react";
import { apps, categories } from "@/constants";
import { AvatarDropdown } from "./shared/avatar-dropdown";
import { useCurrentuser } from "@/hooks/use-current-user";
import { Button } from "./ui/button";
import Link from "next/link";

export const AppStoreHome = () => {
  const user = useCurrentuser();

  const handleNavigate = (path: string) => {
    console.log(`Navigating to: ${path}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-primary">App Store</h1>
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search apps and games..."
                  className="pl-10"
                />
              </div>
            </div>
            {user && (
              <div className="ml-auto">
                <AvatarDropdown user={user} onNavigate={handleNavigate} />
              </div>
            )}

            {!user && (
              <div className="flex space-x-2 ms-auto">
                <Button variant={"outline"} asChild>
                  <Link href={"/auth/login"}>Log in</Link>
                </Button>
                <Button variant={"default"} asChild>
                  <Link href={"/auth/register"}>Sign up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 space-y-8">
        <CategorySection title="featured" showLarge={true} />

        <CategorySection title="top-rated" />

        <CategorySection title="games" />

        <CategorySection title="apps" />

        {/* Categories Grid */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Replace the apps with categories from query */}
            {categories.map((category, index) => (
              <Card
                key={category.name || index}
                className="cursor-pointer hover:shadow-md transition-shadow"
              >
                <CardContent className="p-4 text-center">
                  {category.icon && (
                    <div className="text-2xl mb-2">{category.icon}</div>
                  )}

                  <h3 className="font-medium">{category.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {category.apps_count} apps
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};
