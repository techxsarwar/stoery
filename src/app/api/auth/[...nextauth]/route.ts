import NextAuth, { NextAuthOptions } from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID as string,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET as string,
      authorization: "https://accounts.spotify.com/authorize?scope=user-read-email,user-read-private",
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        const profile = await prisma.profile.findUnique({
          where: { userId: user.id },
          select: { pen_name: true }
        });
        token.onboardingComplete = !!profile?.pen_name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        // @ts-ignore
        session.user.id = token.id;
        // @ts-ignore
        session.user.onboardingComplete = token.onboardingComplete;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export async function GET(req: Request, { params }: { params: Promise<{ nextauth: string[] }> }) {
  const awaitedParams = await params;
  // @ts-ignore
  return NextAuth(req, { params: awaitedParams }, authOptions);
}

export async function POST(req: Request, { params }: { params: Promise<{ nextauth: string[] }> }) {
  const awaitedParams = await params;
  // @ts-ignore
  return NextAuth(req, { params: awaitedParams }, authOptions);
}
