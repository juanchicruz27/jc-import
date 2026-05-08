"use server";

import prisma from "database";
import { revalidatePath } from "next/cache";

export async function updateDollarRate(formData: FormData) {
  const rate = parseFloat(formData.get("rate") as string);
  if (isNaN(rate)) return;

  await prisma.storeSettings.upsert({
    where: { id: "global" },
    update: { dollarRate: rate },
    create: { id: "global", dollarRate: rate }
  });

  revalidatePath("/");
}

export async function createProduct(formData: FormData) {
  const name = formData.get("name") as string;
  const brand = formData.get("brand") as string;
  const priceUSD = parseFloat(formData.get("priceUSD") as string);
  const discountPercentage = formData.get("discountPercentage") 
    ? parseInt(formData.get("discountPercentage") as string) 
    : null;
  const imageUrl = formData.get("imageUrl") as string || null;

  await prisma.product.create({
    data: { name, brand, priceUSD, discountPercentage, imageUrl }
  });

  revalidatePath("/");
}

export async function deleteProduct(id: string) {
  await prisma.product.delete({ where: { id } });
  revalidatePath("/");
}
