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
  const imageFile = formData.get("imageFile") as File | null;
  let imageUrl = null;
  if (imageFile && imageFile.size > 0) {
    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString('base64');
    imageUrl = `data:${imageFile.type};base64,${base64}`;
  }

  const notesTop = formData.get("notesTop") as string;
  const notesHeart = formData.get("notesHeart") as string;
  const notesBase = formData.get("notesBase") as string;
  const bgColor = formData.get("bgColor") as string || "#ffffff";

  await prisma.product.create({
    data: { name, brand, priceUSD, discountPercentage, imageUrl, notesTop, notesHeart, notesBase, bgColor }
  });

  revalidatePath("/");
}

export async function deleteProduct(id: string) {
  await prisma.product.delete({ where: { id } });
  revalidatePath("/");
}

// Sales Actions
export async function createSale(formData: FormData) {
  const clientName = formData.get("clientName") as string;
  const productId = formData.get("productId") as string;
  const productName = formData.get("productName") as string;
  const totalAmount = parseFloat(formData.get("totalAmount") as string);
  const amountPaid = parseFloat(formData.get("amountPaid") as string) || 0;
  
  const dateStr = formData.get("date") as string;
  const date = dateStr ? new Date(dateStr) : new Date();

  await prisma.sale.create({
    data: {
      clientName,
      productId: productId || null,
      productName,
      totalAmount,
      amountPaid,
      date,
    }
  });

  revalidatePath("/");
}

export async function updateSalePayment(formData: FormData) {
  const id = formData.get("saleId") as string;
  const newAmountPaid = parseFloat(formData.get("newAmountPaid") as string);
  if (!id || isNaN(newAmountPaid)) return;

  await prisma.sale.update({
    where: { id },
    data: { amountPaid: newAmountPaid }
  });
  revalidatePath("/");
}

export async function deleteSale(id: string) {
  await prisma.sale.delete({ where: { id } });
  revalidatePath("/");
}
