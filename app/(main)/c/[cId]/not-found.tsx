import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Folder, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardContent className="p-8 text-center">
          <div className="mb-8">
            <div className="w-20 h-20 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
              <Folder className="w-10 h-10 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Category Not Found</h1>
            <p className="text-muted-foreground">
              The category you're looking for doesn't exist. Browse our
              available categories below.
            </p>
          </div>

          <Link href={"/"} className="mx-auto space-x-2">
            <Home size={17} />
            <span>Back to home</span>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
