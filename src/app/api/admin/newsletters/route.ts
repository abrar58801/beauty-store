import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/admin";

export async function GET() {
  try {
    const admin = await isAdmin();

    if (!admin) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const subscribers =
      await prisma.newsletterSubscriber.findMany({
        orderBy: {
          createdAt: "desc",
        },
      });

    return NextResponse.json(subscribers);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          "Failed to fetch subscribers",
      },
      { status: 500 }
    );
  }
}