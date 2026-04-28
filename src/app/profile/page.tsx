import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import MyProfileClient from "@/components/MyProfileClient";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "My Profile — SOULPAD" };

export default async function MyProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user?.email) redirect("/auth/signin");

  const profile = await prisma.profile.findFirst({
    where: { user: { email: user.email } },
    include: {
      _count: {
        select: { followers: true, following: true, stories: true },
      },
      followers: {
        orderBy: { createdAt: "desc" },
        take: 50,
        include: {
          follower: {
            select: {
              id: true,
              pen_name: true,
              username: true,
              avatar_url: true,
              isVerified: true,
              _count: { select: { followers: true } },
            },
          },
        },
      },
      following: {
        orderBy: { createdAt: "desc" },
        take: 50,
        include: {
          following: {
            select: {
              id: true,
              pen_name: true,
              username: true,
              avatar_url: true,
              isVerified: true,
              _count: { select: { followers: true } },
            },
          },
        },
      },
    },
  });

  if (!profile) redirect("/onboarding");

  const followersList = profile.followers.map((f) => f.follower);
  const followingList = profile.following.map((f) => f.following);

  const safeProfile = {
    id: profile.id,
    pen_name: profile.pen_name,
    full_name: profile.full_name,
    username: profile.username,
    bio: profile.bio,
    avatar_url: profile.avatar_url,
    age: profile.age,
    isVerified: profile.isVerified,
    followerCount: profile._count.followers,
    followingCount: profile._count.following,
    storyCount: profile._count.stories,
  };

  return (
    <div className="min-h-screen bg-surface flex cursor-default overflow-hidden">
      <Sidebar />
      <main className="flex-grow ml-0 md:ml-20 lg:ml-64 h-screen overflow-y-auto bg-[radial-gradient(circle_at_top_right,#e5e7eb,transparent)] custom-scrollbar">
        <Navbar user={user ?? null} />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-12 pt-24 pb-32">
          <MyProfileClient
            profile={safeProfile}
            followersList={followersList}
            followingList={followingList}
          />
        </div>
      </main>
    </div>
  );
}
