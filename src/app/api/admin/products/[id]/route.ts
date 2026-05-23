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
    const body = await req.json();

    const {
      name,
      slug,
      description,
      shortDescription,
      price,
      comparePrice,
      sku,
      stock,
      featured,
      active,
      categoryId,
      brandId,
      images,
      variants,
    } = body;

    await prisma.product.update({
      where: { id },
      data: {
        name,
        slug,
        description,
        shortDescription,
        price,
        comparePrice,
        sku,
        stock,
        featured,
        active,
        categoryId,
        brandId,
      },
    });

    // Replace images
    await prisma.productImage.deleteMany({
      where: {
        productId: id,
      },
    });

    if (images?.length) {
      await prisma.productImage.createMany({
        data: images.map((img: string) => ({
          productId: id,
          url: img,
        })),
      });
    }

    // Replace variants
    await prisma.productVariant.deleteMany({
      where: {
        productId: id,
      },
    });

    if (variants?.length) {
      await prisma.productVariant.createMany({
        data: variants.map(
          (variant: any) => ({
            productId: id,
            name: variant.name,
            value: variant.value,
            price: variant.price,
            stock: variant.stock,
          })
        ),
      });
    }

    return NextResponse.json({
      success: true,
    });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { error: "Update failed" },
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