import AppDetails from "@/components/app-detauls";
import { getAppById } from "@/data/apps";
import { Metadata } from "next";
import { notFound } from "next/navigation";

interface PageProps {
  params: { appId: number };
}

const getApp = async (id: number) => {
  const app = await getAppById(id);

  if (!app) return notFound();

  return app;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { appId } = await params;

  const app = await getApp(appId);

  return {
    title: `${app.name} details page`,
  };
}

export default async function AppPage({ params }: PageProps) {
  const { appId } = await params;

  const app = await getApp(appId);

  return <AppDetails />;
}
