"use client";

import { signUp, signIn } from "@/actions/auth";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import Link from "next/link";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    startTransition(async () => {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("password", password);

        const res = await signUp(formData);

        if (res.error) {
          setError(res.error);
        } else {
          // Attempt auto sign-in after successful sign up
          const signInRes = await signIn(formData);
          if (signInRes?.error) {
            // If auto-signin fails (e.g. email verification required), go to signin
            router.push("/auth/signin");
          } else {
            router.push("/");
            router.refresh();
          }
        }
    });
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center pt-24 px-6 md:px-12 w-full mx-auto relative">
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-70"></div>
      <div className="bg-white p-8 rounded-lg w-full max-w-md shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-4 border-on-surface relative z-10">
        <h2 className="text-4xl font-headline font-black text-on-surface mb-8 text-center tracking-tighter uppercase">
          Join Storyverse
        </h2>
        <div className="flex flex-col gap-8">
          <LoginButton />
        </div>

        <div className="flex items-center gap-4 my-8">
          <div className="flex-1 h-0.5 bg-on-surface opacity-10"></div>
          <span className="font-headline font-black text-on-surface-variant uppercase text-xs opacity-50 tracking-widest">Been here before?</span>
          <div className="flex-1 h-0.5 bg-on-surface opacity-10"></div>
        </div>

        <p className="text-center text-sm font-label font-bold text-on-surface-variant">
          <Link
            href="/auth/signin"
            className="text-on-surface hover:text-primary transition-colors hover:underline underline-offset-4 decoration-primary decoration-4 uppercase tracking-tighter text-lg"
          >
            Sign in to your account
          </Link>
        </p>
      </div>
    </div>
  );
}
