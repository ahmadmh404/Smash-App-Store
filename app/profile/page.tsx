import { Metadata } from "next";

export async function generateMetdata(): Promise<Metadata> {
  return { title: "Profile" };
}

export default async function ProfilePage() {}
