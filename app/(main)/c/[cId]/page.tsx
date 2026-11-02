import { Metadata } from "next";
import { notFound } from "next/navigation";

import { CategoryPage as Category } from "@/components/category-page";
import { getCategoryById } from "@/data/categories";

interface PageProps {
  params: { cId: number };
}

const getCategory = async (catId: number) => {
  const res = await getCategoryById(catId);

  if (!res?.category) notFound();

  return res.category;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { cId } = await params;

  // const category = await getCategory(cId);

  return {
    title: `${"games"} category page`,
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { cId } = await params;

  // const category = await getCategory(cId);

  const category = { id: 1, name: "Games", icon: "🎮" };

  return <Category category={category} />;
}
