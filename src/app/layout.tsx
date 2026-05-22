import "./globals.css";
import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import Providers from "@/components/Providers";
import Script from "next/script";
import { getSiteSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  return {
    title: {
      default:
        settings.siteName ||
        "Beauty Luxe",

      template: `%s | ${settings.siteName || "Beauty Luxe"
        }`,
    },

    description:
      settings.seoDescription ||
      settings.siteDescription,

    keywords:
      settings.seoKeywords || "",

    icons: {
      icon: [
        {
          url: settings.favicon || "/favicon.ico",
          type: "image/png",
          sizes: "32x32",
        },
        {
          url: settings.favicon || "/favicon.ico",
          type: "image/png",
          sizes: "16x16",
        },
      ],

      apple: [
        {
          url: settings.favicon || "/favicon.ico",
          sizes: "180x180",
          type: "image/png",
        },
      ],

      shortcut: settings.favicon || "/favicon.ico",
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${inter.variable} antialiased`}
      >
        <Providers>
          {children}
        </Providers>

        <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      </body>
    </html>
  );
}