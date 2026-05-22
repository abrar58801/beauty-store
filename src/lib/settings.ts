import { prisma } from "@/lib/prisma";

export async function getSiteSettings() {
  let settings = await prisma.siteSetting.findFirst();

  if (!settings) {
    settings = await prisma.siteSetting.create({
      data: {
        siteName: "Beauty Luxe",
        siteDescription:
          "Luxury skincare & premium cosmetics",
        contactEmail:
          "support@beautyluxe.com",
        contactPhone:
          "+91 9876543210",
        contactAddress:
          "Mumbai, India",
        businessHours:
          "Mon - Sat: 9 AM - 7 PM",
      },
    });
  }

  return settings;
}