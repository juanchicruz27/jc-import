"use server";

import prisma from "database";
import { revalidatePath } from "next/cache";

export async function updateDollarRate(formData: FormData) {
  const rate = parseFloat(formData.get("rate") as string);
  if (isNaN(rate)) return;

  await prisma.settings.upsert({
    where: { id: "global" },
    update: { dollarRate: rate },
    create: { id: "global", dollarRate: rate, updatedAt: new Date() }
  });

  revalidatePath("/");
}

export async function createProduct(formData: FormData) {
  const name = formData.get("name") as string;
  const brand = formData.get("brand") as string;
  const priceUSD = parseFloat(formData.get("priceUSD") as string);
  const discount = formData.get("discount") 
    ? parseFloat(formData.get("discount") as string) 
    : 0;
  const imageFile = formData.get("imageFile") as File | null;
  let imagePath = null;
  if (imageFile && imageFile.size > 0) {
    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString('base64');
    imagePath = `data:${imageFile.type};base64,${base64}`;
  }

  const notesTop = formData.get("notesTop") as string;
  const notesHeart = formData.get("notesHeart") as string;
  const notesBase = formData.get("notesBase") as string;
  const bgColor = formData.get("bgColor") as string || "#ffffff";
  const gender = formData.get("gender") as string || "Unisex";
  
  // generate a basic slug
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();

  await prisma.product.create({
    data: { 
      id: Math.random().toString(36).substring(2, 15), 
      slug, 
      name, 
      brand, 
      priceUSD, 
      discount, 
      imagePath, 
      notesTop, 
      notesHeart, 
      notesBase, 
      bgColor, 
      gender,
      updatedAt: new Date()
    }
  });

  revalidatePath("/");
}

export async function deleteProduct(id: string) {
  await prisma.product.delete({ where: { id } });
  revalidatePath("/");
}

export async function updateProductCategory(id: string, gender: string) {
  await prisma.product.update({
    where: { id },
    data: { gender }
  });
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
      id: Math.random().toString(36).substring(2, 15),
      clientName,
      productId: productId || null,
      productName,
      totalAmount,
      amountPaid,
      date,
      updatedAt: new Date()
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
