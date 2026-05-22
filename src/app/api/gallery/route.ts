import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const gallery = await prisma.gallery.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json(gallery);
}