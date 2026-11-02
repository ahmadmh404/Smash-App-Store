"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { AppCard } from "@/components/app-card";
import { SearchInput } from "@/components/shared/big-input";

import { apps } from "@/constants";

import { ArrowLeft } from "lucide-react";
import { ICategory } from "@/types";

interface CategoryPageProps {
  category: ICategory;
}

export function CategoryPage({ category }: CategoryPageProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  // const filteredApps = apps
  //   .filter((app) => app.category.name.includes(category?.name!))
  //   .filter(
  //     (app) =>
  //       searchQuery === "" ||
  //       app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //       app.description.toLowerCase().includes(searchQuery.toLowerCase())
  //   );

  const filteredApps = apps;
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push("/")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold text-primary">{category.name}</h1>
            <div className="flex-1 max-w-md">
              <SearchInput
                query={searchQuery}
                setQuery={setSearchQuery}
                placeholder="Serch apps.."
                showSearch
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-2 mb-6">
          <div className="text-3xl">{category.icon}</div>
          <div>
            <h2 className="text-2xl font-bold">{category.name}</h2>
            <p className="text-muted-foreground">
              {filteredApps.length} apps available
            </p>
          </div>
        </div>

        {filteredApps.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredApps.map((app, index) => (
              <AppCard key={index} app={app} size="default" />
            ))}
          </div>
        ) : (
          <Empty search={searchQuery} />
        )}
      </main>
    </div>
  );
}

const Empty = ({ search }: { search: string }) => {
  return (
    <div className="text-center py-12">
      <h3 className="text-xl font-medium mb-2">No apps found</h3>
      <p className="text-muted-foreground">
        {search
          ? "Try a different search term"
          : "There are no apps in this category yet"}
      </p>
    </div>
  );
};
