import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "SOULPAD" };

export default async function UsernamePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const decoded = decodeURIComponent(username).replace(/^@/, "");

  const profile = await prisma.profile.findUnique({
    where: { username: decoded.toLowerCase() },
    select: { pen_name: true },
  });

  if (!profile?.pen_name) {
    redirect("/feed");
  }

  redirect(`/author/${encodeURIComponent(profile.pen_name)}`);
}
