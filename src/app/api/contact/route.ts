import { NextResponse } from "next/server";
import { sendContactEmail } from "@/lib/mail";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      name,
      email,
      phone,
      subject,
      message,
    } = body;

    if (
      !name ||
      !email ||
      !phone ||
      !subject ||
      !message
    ) {
      return NextResponse.json(
        { error: "All fields required" },
        { status: 400 }
      );
    }

    // SAVE TO DB
    await prisma.contact.create({
      data: {
        name,
        email,
        phone,
        subject,
        message,
      },
    });

    // SEND EMAILS
    await sendContactEmail({
      name,
      email,
      phone,
      subject,
      message,
    });

    return NextResponse.json({
      success: true,
      message: "Message sent successfully 💖",
    });
  } catch (error) {
    console.error("CONTACT ERROR:", error);

    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}