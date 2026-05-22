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

    let settings = await prisma.siteSetting.findFirst();

    if (!settings) {
      settings = await prisma.siteSetting.create({
        data: {},
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const admin = await isAdmin();

    if (!admin) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();

    let settings = await prisma.siteSetting.findFirst();

    if (!settings) {
      settings = await prisma.siteSetting.create({
        data: {},
      });
    }

    const updated =
      await prisma.siteSetting.update({
        where: {
          id: settings.id,
        },

        data: {
          siteName: body.siteName,
          siteDescription:
            body.siteDescription,

          logo: body.logo,
          favicon: body.favicon,

          heroBanner: body.heroBanner,
          heroTitle: body.heroTitle,
          heroSubtitle:
            body.heroSubtitle,
          heroButtonText:
            body.heroButtonText,
          heroButtonLink:
            body.heroButtonLink,

          seoTitle: body.seoTitle,
          seoDescription:
            body.seoDescription,
          seoKeywords:
            body.seoKeywords,

          contactEmail:
            body.contactEmail,
          contactPhone:
            body.contactPhone,
          contactAddress:
            body.contactAddress,
          businessHours:
            body.businessHours,

          facebook: body.facebook,
          instagram: body.instagram,
          twitter: body.twitter,
          youtube: body.youtube,
          whatsapp: body.whatsapp,
        },
      });

    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}