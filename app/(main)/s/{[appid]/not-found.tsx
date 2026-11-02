import { ArrowLeft, Package } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function AppNotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center">
          <div className="mb-6">
            <div className="w-20 h-20 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
              <Package className="w-10 h-10 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-bold mb-2">App Not Found</h1>
            <p className="text-muted-foreground">
              The app you're looking for doesn't exist or has been removed from
              the store.
            </p>
          </div>

          <Link href={"/"} className="w-full">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
