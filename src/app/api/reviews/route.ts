import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const productId =
      searchParams.get("productId");

    if (!productId) {
      return NextResponse.json([]);
    }

    const reviews =
      await prisma.review.findMany({
        where: {
          productId,
        },
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

    return NextResponse.json(reviews);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session =
      await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Login required" },
        { status: 401 }
      );
    }

    const body = await req.json();

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const existing =
      await prisma.review.findFirst({
        where: {
          userId: user.id,
          productId: body.productId,
        },
      });

    if (existing) {
      return NextResponse.json(
        {
          error:
            "You already reviewed this product",
        },
        { status: 400 }
      );
    }

    const review =
      await prisma.review.create({
        data: {
          rating: Number(body.rating),
          comment: body.comment,
          productId: body.productId,
          userId: user.id,
        },
      });

    return NextResponse.json(review);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to add review" },
      { status: 500 }
    );
  }
}