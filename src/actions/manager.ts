"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

async function verifyManager() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return false;

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { role: true }
  });

  return user?.role === "MANAGER";
}

export async function promoteUser(email: string, role: "EMPLOYEE" | "ADMIN") {
  if (!(await verifyManager())) return { success: false, error: "Unauthorized" };

  try {
    await prisma.user.update({
      where: { email },
      data: { role },
    });
    revalidatePath("/manager");
    return { success: true };
  } catch (error) {
    console.error("Failed to promote user:", error);
    return { success: false, error: "Failed to update user role" };
  }
}

export async function revokeStaffAccess(email: string) {
  if (!(await verifyManager())) return { success: false, error: "Unauthorized" };

  try {
    await prisma.user.update({
      where: { email },
      data: { role: "AUTHOR" },
    });
    revalidatePath("/manager");
    return { success: true };
  } catch (error) {
    console.error("Failed to revoke access:", error);
    return { success: false, error: "Failed to revoke access" };
  }
}

export async function getStaffActivity() {
  if (!(await verifyManager())) return { success: false, error: "Unauthorized" };

  try {
    const staff = await prisma.user.findMany({
      where: {
        role: { in: ["EMPLOYEE", "ADMIN"] }
      },
      include: {
        profile: {
          select: {
            pen_name: true,
            _count: {
              select: {
                stories: true,
              }
            }
          }
        }
      }
    });
    return { success: true, staff };
  } catch (error) {
    return { success: false, error: "Failed to fetch staff data" };
  }
}
