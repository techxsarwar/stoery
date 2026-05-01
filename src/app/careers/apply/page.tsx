import { prisma } from "@/lib/prisma";
import CareerApplicationClient from "./CareerApplicationClient";
import { Suspense } from "react";

export const metadata = {
  title: "Apply | SOULPAD Careers",
  description: "Submit your application to join the SOULPAD team.",
};

export default async function CareerApplicationPage() {
  const jobs = await prisma.jobPosting.findMany({
    where: { isActive: true },
    select: { id: true, title: true }
  });

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-primary font-headline uppercase font-black tracking-widest">Loading...</div>}>
      <CareerApplicationClient jobs={jobs} />
    </Suspense>
  );
}
