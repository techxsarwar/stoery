"use client";

import { signUp } from "@/actions/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);

    const res = await signUp(formData);

    if (res.error) {
      setError(res.error);
    } else {
      // Auto sign-in after sign up
      const signInRes = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (signInRes?.ok) {
        router.push("/");
        router.refresh();
      } else {
        router.push("/auth/signin");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-24 px-6 md:px-12 w-full max-w-7xl mx-auto">
      <div className="bg-surface-container-low p-8 rounded-xl w-full max-w-md shadow-2xl relative z-10">
        <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
        <h2 className="text-3xl font-headline font-bold text-on-surface mb-6 text-center tracking-tight">
          Join Storyverse
        </h2>
        {error && (
          <div className="bg-error-container text-on-error-container p-3 rounded-lg text-sm mb-4 font-label text-center border border-error/20">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="font-label text-sm text-on-surface-variant font-medium">
              Pen Name
            </label>
            <input
              type="text"
              className="bg-surface border-b-2 border-outline-variant/30 text-on-surface px-4 py-3 focus:outline-none focus:border-primary focus:bg-surface-container-highest transition-all duration-300 font-label placeholder:text-outline-variant/70"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-label text-sm text-on-surface-variant font-medium">
              Email
            </label>
            <input
              type="email"
              className="bg-surface border-b-2 border-outline-variant/30 text-on-surface px-4 py-3 focus:outline-none focus:border-primary focus:bg-surface-container-highest transition-all duration-300 font-label placeholder:text-outline-variant/70"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-label text-sm text-on-surface-variant font-medium">
              Password
            </label>
            <input
              type="password"
              className="bg-surface border-b-2 border-outline-variant/30 text-on-surface px-4 py-3 focus:outline-none focus:border-primary focus:bg-surface-container-highest transition-all duration-300 font-label placeholder:text-outline-variant/70"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="mt-4 bg-gradient-to-r from-primary to-primary-container text-on-primary font-headline text-lg px-8 py-3 rounded-full hover:scale-[1.02] transition-all duration-300 glow-hover font-semibold w-full"
          >
            Create Account
          </button>
        </form>
        <p className="mt-8 text-center text-sm font-label text-on-surface-variant">
          Already have an account?{" "}
          <Link
            href="/auth/signin"
            className="text-primary hover:text-primary-container transition-colors font-medium underline underline-offset-4 decoration-primary/30 hover:decoration-primary"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
