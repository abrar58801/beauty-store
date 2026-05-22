import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendWelcomeEmail } from "@/lib/mail";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email required" },
        { status: 400 }
      );
    }

    const existing =
      await prisma.newsletterSubscriber.findUnique({
        where: { email },
      });

    if (existing) {
      return NextResponse.json(
        { error: "Already subscribed" },
        { status: 400 }
      );
    }

    await prisma.newsletterSubscriber.create({
      data: { email },
    });

    await sendWelcomeEmail(email);

    return NextResponse.json({
      success: true,
      message:
        "Subscribed successfully. Welcome email sent 💖",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Subscription failed" },
      { status: 500 }
    );
  }
}