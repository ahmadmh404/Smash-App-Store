import Dashboard from "@/components/dashboard";
import { Loader } from "@/components/ui/loader";
import { currentUser } from "@/lib/auth";

async function DashboradPage() {
  const user = await currentUser();

  if (!user)
    return (
      <Loader
        size="md"
        variant="spinner"
        overlay
        className="text-muted-foreground/80"
      />
    );

  return <Dashboard user={user} />;
}

export default DashboradPage;
