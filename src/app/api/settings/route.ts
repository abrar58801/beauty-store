import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  let settings = await prisma.siteSetting.findFirst();

  if (!settings) {
    settings = await prisma.siteSetting.create({
      data: {},
    });
  }

  return NextResponse.json(settings);
}