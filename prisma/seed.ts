import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding...");

  // ADMIN USER
  const hashedPassword = await bcrypt.hash(
    "admin123",
    10
  );

  const admin = await prisma.user.upsert({
    where: {
      email: "admin@gmail.com",
    },
    update: {},
    create: {
      name: "Admin",
      email: "admin@gmail.com",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  // CATEGORIES
  const skincare = await prisma.category.upsert({
    where: {
      slug: "skincare",
    },
    update: {},
    create: {
      name: "Skincare",
      slug: "skincare",
    },
  });

  const makeup = await prisma.category.upsert({
    where: {
      slug: "makeup",
    },
    update: {},
    create: {
      name: "Makeup",
      slug: "makeup",
    },
  });

  const fragrance = await prisma.category.upsert({
    where: {
      slug: "fragrance",
    },
    update: {},
    create: {
      name: "Fragrance",
      slug: "fragrance",
    },
  });

  // BRANDS
  const rareBeauty = await prisma.brand.upsert({
    where: {
      slug: "rare-beauty",
    },
    update: {},
    create: {
      name: "Rare Beauty",
      slug: "rare-beauty",
    },
  });

  const hudaBeauty = await prisma.brand.upsert({
    where: {
      slug: "huda-beauty",
    },
    update: {},
    create: {
      name: "Huda Beauty",
      slug: "huda-beauty",
    },
  });

  const dior = await prisma.brand.upsert({
    where: {
      slug: "dior",
    },
    update: {},
    create: {
      name: "Dior",
      slug: "dior",
    },
  });

  // PRODUCT 1
  await prisma.product.upsert({
    where: {
      slug: "matte-lipstick",
    },
    update: {},
    create: {
      name: "Matte Lipstick",
      slug: "matte-lipstick",
      description:
        "Luxury matte lipstick with rich pigment.",
      shortDescription:
        "Premium matte lipstick",
      price: 999,
      comparePrice: 1299,
      sku: "LIP001",
      stock: 50,
      featured: true,
      active: true,
      categoryId: makeup.id,
      brandId: rareBeauty.id,

      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1631214540242-6f6d1b7a9ff6",
          },
        ],
      },

      variants: {
        create: [
          {
            name: "Shade",
            value: "Ruby Red",
            price: 999,
            stock: 20,
          },
          {
            name: "Shade",
            value: "Nude Beige",
            price: 999,
            stock: 30,
          },
        ],
      },
    },
  });

  // PRODUCT 2
  await prisma.product.upsert({
    where: {
      slug: "hydrating-serum",
    },
    update: {},
    create: {
      name: "Hydrating Serum",
      slug: "hydrating-serum",
      description:
        "Deep hydration serum for glowing skin.",
      shortDescription:
        "Hydration boost serum",
      price: 1499,
      comparePrice: 1899,
      sku: "SER001",
      stock: 40,
      featured: true,
      active: true,
      categoryId: skincare.id,
      brandId: hudaBeauty.id,

      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be",
          },
        ],
      },

      variants: {
        create: [
          {
            name: "Size",
            value: "30ml",
            price: 1499,
            stock: 20,
          },
          {
            name: "Size",
            value: "50ml",
            price: 1999,
            stock: 20,
          },
        ],
      },
    },
  });

  // PRODUCT 3
  await prisma.product.upsert({
    where: {
      slug: "luxury-perfume",
    },
    update: {},
    create: {
      name: "Luxury Perfume",
      slug: "luxury-perfume",
      description:
        "Elegant premium fragrance.",
      shortDescription:
        "Signature luxury perfume",
      price: 2999,
      comparePrice: 3999,
      sku: "PER001",
      stock: 25,
      featured: true,
      active: true,
      categoryId: fragrance.id,
      brandId: dior.id,

      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1594035910387-fea47794261f",
          },
        ],
      },

      variants: {
        create: [
          {
            name: "Size",
            value: "50ml",
            price: 2999,
            stock: 10,
          },
          {
            name: "Size",
            value: "100ml",
            price: 4999,
            stock: 15,
          },
        ],
      },
    },
  });

  console.log("Seed completed");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });