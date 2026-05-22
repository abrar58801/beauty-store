import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/admin";
import { transporter } from "@/lib/mail";

export async function POST(req: Request) {
  try {
    const admin = await isAdmin();

    if (!admin) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { subject, message } = await req.json();

    if (!subject || !message) {
      return NextResponse.json(
        {
          error: "Subject and message required",
        },
        { status: 400 }
      );
    }

    const subscribers =
      await prisma.newsletterSubscriber.findMany({
        select: {
          email: true,
        },
      });

    if (!subscribers.length) {
      return NextResponse.json(
        {
          error: "No subscribers found",
        },
        { status: 400 }
      );
    }

    await Promise.all(
      subscribers.map((subscriber) =>
        transporter.sendMail({
          from: `"Beauty Luxe" <${process.env.EMAIL_USER}>`,
          to: subscriber.email,
          subject,
          html: `
            <div style="font-family: Arial; padding:20px;">
              <h2>Beauty Luxe Newsletter 💖</h2>
              <div>${message}</div>
              <hr />
              <p style="font-size:12px;color:#666;">
                You subscribed to Beauty Luxe newsletter.
              </p>
            </div>
          `,
        })
      )
    );

    return NextResponse.json({
      success: true,
      message: `Newsletter sent to ${subscribers.length} subscribers`,
    });
  } catch (error: any) {
    console.error(
      "NEWSLETTER SEND ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          error?.message ||
          "Failed to send newsletter",
      },
      { status: 500 }
    );
  }
}