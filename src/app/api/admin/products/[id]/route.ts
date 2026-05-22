import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/admin";

export async function GET(
  req: Request,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const admin = await isAdmin();

    if (!admin) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        images: true,
        variants: true,
        category: true,
        brand: true,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Fetch failed" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await req.json();

    console.log("PATCH BODY:", body);
    console.log("PATCH IMAGES:", body.images);

    await prisma.productImage.deleteMany({
      where: {
        productId: id,
      },
    });

    if (body.images?.length) {
      for (const img of body.images) {
        console.log("INSERTING:", img);

        await prisma.productImage.create({
          data: {
            productId: id,
            url: img,
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
    });
  } catch (err) {
    console.error("PATCH ERROR:", err);
    return NextResponse.json(
      { error: "failed" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const admin = await isAdmin();

    if (!admin) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    await prisma.productImage.deleteMany({
      where: {
        productId: id,
      },
    });

    await prisma.productVariant.deleteMany({
      where: {
        productId: id,
      },
    });

    await prisma.cart.deleteMany({
      where: {
        productId: id,
      },
    });

    await prisma.wishlist.deleteMany({
      where: {
        productId: id,
      },
    });

    await prisma.orderItem.deleteMany({
      where: {
        productId: id,
      },
    });

    await prisma.product.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Delete failed" },
      { status: 500 }
    );
  }
}